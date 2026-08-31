import { randomUUID } from "node:crypto";
import { freepikStatus } from "../lib/factory_registry.mjs";
export function ensureFactorySchema(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS research_packet (id TEXT PRIMARY KEY, experiment_id TEXT, market TEXT, category TEXT, packet_json TEXT NOT NULL, source_count INTEGER NOT NULL DEFAULT 0, confidence REAL NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'RESEARCH_ONLY', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS production_job (id TEXT PRIMARY KEY, experiment_id TEXT NOT NULL, job_type TEXT NOT NULL, channel TEXT NOT NULL, model TEXT, status TEXT NOT NULL, input_json TEXT NOT NULL, output_json TEXT, error TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS channel_asset (id TEXT PRIMARY KEY, experiment_id TEXT NOT NULL, production_job_id TEXT NOT NULL, channel TEXT NOT NULL, format TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'DRAFT', asset_path TEXT, metadata_json TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS factory_approval (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'PENDING', reviewer TEXT, notes TEXT, created_at TEXT NOT NULL, decided_at TEXT);`);
  db.exec("INSERT OR IGNORE INTO factory_approval (id, asset_id, status, created_at) SELECT 'fapr-' || substr(replace(hex(randomblob(16)),'-',''),1,10), id, 'PENDING', created_at FROM channel_asset WHERE status IN ('READY_FOR_REVIEW','DRAFT')");
}
const formats = { seo: ["cornerstone-page"], instagram: ["reel", "static-4x5", "carousel"], facebook: ["video", "static", "carousel"], tiktok: ["short-video", "photo-carousel"], youtube: ["short-video"], linkedin: ["video", "document-carousel"], pinterest: ["vertical-pin", "video-pin", "carousel"], x: ["video", "image-thread"], whatsapp: ["approved-template"], telegram: ["post"] };
export function planProduction(db) {
  ensureFactorySchema(db); const rows = db.prepare("SELECT * FROM growth_experiment WHERE status IN ('Draft','Needs approval','Measuring') ORDER BY created_at DESC").all(); const now = new Date().toISOString(); let created = 0;
  const addJob = db.prepare("INSERT INTO production_job (id,experiment_id,job_type,channel,model,status,input_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)");
  const addAsset = db.prepare("INSERT INTO channel_asset (id,experiment_id,production_job_id,channel,format,status,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)");
  for (const e of rows) { const requested = String(e.channels || "").toLowerCase(); const paid = ["facebook", "instagram"]; const organic = ["instagram", "facebook", "tiktok", "youtube", "linkedin", "pinterest", "x", "whatsapp", "telegram"]; const selected = Object.keys(formats).filter((c) => requested.includes(c) || (requested.includes("meta") && paid.includes(c)) || (requested.includes("paid") && paid.includes(c)) || (requested.includes("organic") && organic.includes(c))); for (const channel of (selected.length ? selected : Object.keys(formats))) for (const format of formats[channel]) {
    if (db.prepare("SELECT 1 FROM channel_asset WHERE experiment_id=? AND channel=? AND format=? LIMIT 1").get(e.id, channel, format)) continue;
    const type = format.includes("video") || format === "reel" || format === "short-video" ? "VIDEO" : format === "cornerstone-page" ? "SEO" : "IMAGE"; const model = type === "VIDEO" ? process.env.FREEPIK_VIDEO_MODEL || "" : process.env.FREEPIK_IMAGE_MODEL || ""; const allowlisted = freepikStatus().unlimitedModels; const ready = model && allowlisted.includes(model) && (type !== "VIDEO" || (process.env.FREEPIK_IMAGE_MODEL && allowlisted.includes(process.env.FREEPIK_IMAGE_MODEL))); const status = ready ? "READY_FOR_GENERATION" : "AWAITING_PROVIDER_CONFIG"; const input = { experimentId: e.id, market: e.market, icp: e.icp, objective: e.objective, channel, format, model, inputImageModel: type === "VIDEO" ? process.env.FREEPIK_IMAGE_MODEL || null : null, safety: "claims-cited-human-approval-required" }; const id = `job-${randomUUID().slice(0, 10)}`;
    addJob.run(id, e.id, type, channel, model || null, status, JSON.stringify(input), now, now); const assetId = `asset-${randomUUID().slice(0, 10)}`; addAsset.run(assetId, e.id, id, channel, format, "DRAFT", JSON.stringify(input), now); db.prepare("INSERT INTO factory_approval (id,asset_id,status,created_at) VALUES (?,?,?,?)").run(`fapr-${randomUUID().slice(0, 10)}`, assetId, "PENDING", now); created++;
  }}
  const allowlisted = freepikStatus().unlimitedModels;
  for (const job of db.prepare("SELECT id, job_type, model, input_json FROM production_job WHERE status='AWAITING_PROVIDER_CONFIG'").all()) {
    let input = {}; try { input = JSON.parse(job.input_json || "{}"); } catch {}
    const ready = job.model && allowlisted.includes(job.model) && (job.job_type !== "VIDEO" || (input.inputImageModel && allowlisted.includes(input.inputImageModel)));
    if (ready) db.prepare("UPDATE production_job SET status='READY_FOR_GENERATION', updated_at=? WHERE id=?").run(now, job.id);
  }
  return { created, provider: freepikStatus() };
}
export function factoryProductionState(db) { ensureFactorySchema(db); const assetQuery = `SELECT a.*, c.channel, c.format, c.asset_path, e.name experiment_name FROM factory_approval a JOIN channel_asset c ON c.id=a.asset_id JOIN growth_experiment e ON e.id=c.experiment_id`; const research = db.prepare("SELECT id, experiment_id, market, source_count, confidence, status, created_at, packet_json FROM research_packet ORDER BY created_at DESC LIMIT 12").all().map((r) => { let packet = {}; try { packet = JSON.parse(r.packet_json); } catch {} return { ...r, query: packet.query, surfaces: packet.research_surfaces?.length || 0, observation_count: packet.observations?.length || 0 }; }); return { provider: freepikStatus(), jobs: db.prepare("SELECT status, count(*) count FROM production_job GROUP BY status ORDER BY status").all(), assets: db.prepare("SELECT channel, format, status, count(*) count FROM channel_asset GROUP BY channel, format, status ORDER BY channel, format").all(), approvals: db.prepare(`${assetQuery} WHERE a.status='PENDING' ORDER BY a.created_at DESC`).all(), approved: db.prepare(`${assetQuery} WHERE a.status='APPROVED' ORDER BY a.decided_at DESC LIMIT 12`).all(), research }; }

export function decideFactoryApproval(db, id, decision, reviewer = "operator", notes = "") {
  ensureFactorySchema(db);
  const row = db.prepare("SELECT * FROM factory_approval WHERE id=?").get(id);
  if (!row) return { ok: false, error: { code: "NOT_FOUND", message: "Factory approval not found." } };
  const status = decision === "approve" ? "APPROVED" : decision === "reject" ? "REJECTED" : null;
  if (!status) return { ok: false, error: { code: "INVALID_DECISION", message: "Use approve or reject." } };
  const now = new Date().toISOString();
  db.prepare("UPDATE factory_approval SET status=?, reviewer=?, notes=?, decided_at=? WHERE id=?").run(status, String(reviewer).slice(0, 120), String(notes).slice(0, 500), now, id);
  db.prepare("UPDATE channel_asset SET status=? WHERE id=?").run(status === "APPROVED" ? "APPROVED" : "REJECTED", row.asset_id);
  return { ok: true, approval: db.prepare("SELECT * FROM factory_approval WHERE id=?").get(id) };
}
