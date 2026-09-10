// Hybrid creative execution contract.
// The factory owns briefs, safety, approvals and assembly. Provider workers own generation.
// Browser generation is deliberately opt-in because it uses the user's logged-in web session
// and may consume account entitlements/credits.
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { freepikStatus } from "../lib/factory_registry.mjs";
import { createCreativeProductionRun, supportedCreativeTemplateIds } from "../lib/creative_production_catalog.mjs";

export const HYBRID_STAGES = ["BRIEF", "RESEARCH", "STORYLINE", "SCRIPT_QA", "GENERATE", "ASSEMBLE", "REVIEW", "PUBLISH_READY"];

function bool(value) { return ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase()); }

export function hybridConfig() {
  return {
    browserEnabled: bool(process.env.MAGNIFIC_WEB_ENABLED),
    browserAutoSubmit: bool(process.env.MAGNIFIC_WEB_AUTO_SUBMIT),
    browserConfirmationRequired: !bool(process.env.MAGNIFIC_WEB_CONFIRM),
    browserProfileConfigured: Boolean(process.env.STEALTH_PROFILE_DIR && existsSync(process.env.STEALTH_PROFILE_DIR)),
    apiConfigured: freepikStatus().configured,
    apiModelsAllowlisted: freepikStatus().unlimitedModels,
    localAssembly: true,
    publishEnabled: bool(process.env.POST_LIVE),
    policy: "browser generation requires explicit approval; publishing remains separately gated",
  };
}

export function ensureHybridSchema(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS hybrid_generation_job (
    id TEXT PRIMARY KEY, workflow_id TEXT NOT NULL, template_id TEXT NOT NULL,
    use_case TEXT NOT NULL, mode TEXT NOT NULL, stage TEXT NOT NULL,
    status TEXT NOT NULL, payload_json TEXT NOT NULL, output_json TEXT,
    error TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`);
}

export function queueHybridJob(db, body = {}) {
  ensureHybridSchema(db);
  const templateId = String(body.template_id || "doctor-explainer").slice(0, 80);
  if (!supportedCreativeTemplateIds().includes(templateId)) return { ok: false, error: { code: "UNSUPPORTED_TEMPLATE", message: `Choose one of: ${supportedCreativeTemplateIds().join(", ")}.` } };
  const useCase = String(body.use_case || "knee-replacement").slice(0, 100);
  const workflowId = `wf-${randomUUID().slice(0, 10)}`;
  const now = new Date().toISOString();
  const brief = String(body.brief || "").slice(0, 2000);
  if (!brief.trim()) return { ok: false, error: { code: "BRIEF_REQUIRED", message: "Add an audience/use-case brief before preparing a production run." } };
  const production = createCreativeProductionRun(templateId, { treatment: useCase, topic: useCase });
  const payload = { brief, template_id: templateId, use_case: useCase, channel: String(body.channel || "instagram").slice(0, 40), format: "9:16", approval_required: true, production };
  db.prepare(`INSERT INTO hybrid_generation_job (id,workflow_id,template_id,use_case,mode,stage,status,payload_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(`hjob-${randomUUID().slice(0, 10)}`, workflowId, templateId, useCase, "browser_preferred_api_fallback", "BRIEF", "WAITING_FOR_APPROVAL", JSON.stringify(payload), now, now);
  return { ok: true, workflowId, status: "WAITING_FOR_APPROVAL", production: { duration_seconds: production.duration_seconds, scene_count: production.scene_count, audio_policy: production.audio_policy, release_gates: production.final_release_gates }, payload };
}

export function hybridState(db) {
  ensureHybridSchema(db);
  const jobs = db.prepare("SELECT id,workflow_id,template_id,use_case,mode,stage,status,error,payload_json,created_at,updated_at FROM hybrid_generation_job ORDER BY created_at DESC LIMIT 12").all().map((job) => { let payload = {}; try { payload = JSON.parse(job.payload_json || '{}'); } catch {} return { ...job, duration_seconds: payload.production?.duration_seconds || null, scene_count: payload.production?.scene_count || null, audio_policy: payload.production?.audio_policy || null }; });
  return { config: hybridConfig(), stages: HYBRID_STAGES, supportedTemplates: supportedCreativeTemplateIds(), jobs };
}

export function decideHybridJob(db, id, decision, notes = "") {
  ensureHybridSchema(db);
  const next = decision === "approve" ? "APPROVED_FOR_GENERATION" : "REJECTED";
  const row = db.prepare("SELECT id FROM hybrid_generation_job WHERE id=?").get(id);
  if (!row) return { ok: false, error: { code: "NOT_FOUND", message: "Hybrid generation job not found." } };
  const now = new Date().toISOString();
  db.prepare("UPDATE hybrid_generation_job SET status=?, stage=?, error=?, updated_at=? WHERE id=?").run(next, decision === "approve" ? "GENERATE" : "REVIEW", String(notes).slice(0, 500), now, id);
  return { ok: true, id, status: next };
}
