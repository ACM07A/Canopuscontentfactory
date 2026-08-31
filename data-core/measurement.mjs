import { randomUUID } from "node:crypto";

const EVENTS = new Set(["PAGE_VIEW", "VIEW_CONTENT", "LEAD", "QUALIFIED_LEAD", "APPOINTMENT", "OPPORTUNITY", "PURCHASE"]);
const PII = /(?:[\w.+-]+@[\w-]+\.[\w.-]+|\+?\d[\d\s().-]{7,}\d|\b(?:MRN|UHID|passport)\b)/i;

export function ensureMeasurementSchema(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS growth_event (
    id TEXT PRIMARY KEY, event_type TEXT NOT NULL, occurred_at TEXT NOT NULL, experiment_id TEXT,
    channel TEXT, campaign TEXT, creative_id TEXT, landing_page TEXT, client_id TEXT,
    utm_json TEXT NOT NULL DEFAULT '{}', properties_json TEXT NOT NULL DEFAULT '{}'
  );
  CREATE TABLE IF NOT EXISTS growth_metric_snapshot (
    id TEXT PRIMARY KEY, period_start TEXT NOT NULL, period_end TEXT NOT NULL, experiment_id TEXT,
    channel TEXT, impressions INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, leads INTEGER DEFAULT 0,
    qualified_leads INTEGER DEFAULT 0, appointments INTEGER DEFAULT 0, revenue REAL DEFAULT 0, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS growth_recommendation (
    id TEXT PRIMARY KEY, experiment_id TEXT, action TEXT NOT NULL, reason TEXT NOT NULL,
    evidence_json TEXT NOT NULL, confidence REAL NOT NULL, status TEXT NOT NULL DEFAULT 'RECOMMENDED', created_at TEXT NOT NULL
  );`);
}

export function recordGrowthEvent(db, body = {}) {
  ensureMeasurementSchema(db);
  const eventType = String(body.event_type || "").toUpperCase();
  if (!EVENTS.has(eventType)) return { ok: false, error: { code: "INVALID_EVENT", message: "Unsupported event type." } };
  const raw = JSON.stringify(body);
  if (PII.test(raw)) return { ok: false, error: { code: "PII_REJECTED", message: "Do not send email, phone, medical-record, or passport data to attribution." } };
  const id = String(body.event_id || `evt-${randomUUID().slice(0, 12)}`).slice(0, 80);
  const occurred = String(body.occurred_at || new Date().toISOString()).slice(0, 40);
  db.prepare(`INSERT OR IGNORE INTO growth_event (id,event_type,occurred_at,experiment_id,channel,campaign,creative_id,landing_page,client_id,utm_json,properties_json) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    .run(id, eventType, occurred, String(body.experiment_id || "").slice(0, 100) || null, String(body.channel || "").slice(0, 50) || null, String(body.campaign || "").slice(0, 100) || null, String(body.creative_id || "").slice(0, 100) || null, String(body.landing_page || "").slice(0, 300) || null, String(body.client_id || "").slice(0, 100) || null, JSON.stringify(body.utm || {}), JSON.stringify(body.properties || {}));
  return { ok: true, event_id: id };
}

export function measurementState(db) {
  ensureMeasurementSchema(db);
  return {
    events: db.prepare("SELECT event_type, count(*) count FROM growth_event GROUP BY event_type ORDER BY event_type").all(),
    byChannel: db.prepare("SELECT coalesce(channel,'unknown') channel, count(*) events FROM growth_event GROUP BY coalesce(channel,'unknown') ORDER BY events DESC").all(),
    recommendations: db.prepare("SELECT * FROM growth_recommendation ORDER BY created_at DESC LIMIT 12").all(),
  };
}

export function generateRecommendations(db) {
  ensureMeasurementSchema(db);
  const rows = db.prepare("SELECT experiment_id, channel, event_type, count(*) count FROM growth_event WHERE experiment_id IS NOT NULL GROUP BY experiment_id, channel, event_type").all();
  const created = [];
  for (const row of rows.filter((r) => r.event_type === "LEAD" && r.count >= 3)) {
    const qualified = rows.find((r) => r.experiment_id === row.experiment_id && r.channel === row.channel && r.event_type === "QUALIFIED_LEAD")?.count || 0;
    const action = qualified ? "KEEP" : "COLLECT_MORE_DATA";
    const reason = qualified ? `${qualified} qualified lead event(s) attributed to ${row.channel}.` : `${row.count} lead event(s) but no qualified-lead event yet; do not scale on lead volume alone.`;
    const id = `rec-${randomUUID().slice(0, 10)}`;
    db.prepare("INSERT INTO growth_recommendation (id,experiment_id,action,reason,evidence_json,confidence,created_at) VALUES (?,?,?,?,?,?,?)").run(id, row.experiment_id, action, reason, JSON.stringify(row), qualified ? 0.72 : 0.45, new Date().toISOString());
    created.push(id);
  }
  return { created: created.length };
}
