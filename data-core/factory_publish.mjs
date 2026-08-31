import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { publisherFor } from "../lib/publishers.mjs";
import { ensureFactorySchema } from "./factory_core.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCAL_OUTPUT = /^outputs[\\/]factory[\\/]/;

function localPath(assetPath) {
  const relative = String(assetPath || "");
  if (!LOCAL_OUTPUT.test(relative)) throw new Error("Factory asset must be a local factory output.");
  const absolute = join(ROOT, relative);
  if (!absolute.startsWith(join(ROOT, "outputs", "factory"))) throw new Error("Unsafe factory output path.");
  return absolute;
}

export async function prepareFactoryPublish(db, assetId, { confirm = false, reviewer = "operator" } = {}) {
  ensureFactorySchema(db);
  const row = db.prepare(`SELECT a.*, e.name experiment_name, e.market, e.objective FROM channel_asset a JOIN growth_experiment e ON e.id=a.experiment_id WHERE a.id=?`).get(assetId);
  if (!row) return { ok: false, error: { code: "NOT_FOUND", message: "Factory asset not found." } };
  const approval = db.prepare("SELECT * FROM factory_approval WHERE asset_id=?").get(assetId);
  if (!approval || approval.status !== "APPROVED") return { ok: false, error: { code: "APPROVAL_REQUIRED", message: "A human must approve this factory asset before handoff." } };
  const metadata = JSON.parse(row.metadata_json || "{}");
  const file = localPath(row.asset_path);
  const copy = readFileSync(file, "utf8");
  const publisher = publisherFor(row.channel);
  const payload = { channel: row.channel, format: row.format, experiment_id: row.experiment_id, creative_id: row.id, campaign: metadata.attribution?.campaign || row.experiment_name, landing_page: metadata.landing_page || null, copy: copy.slice(0, 12000), publish_mode: "dry_run_only_until_explicit_live_gate" };
  if (!publisher) return { ok: true, dryRun: true, status: "PAYLOAD_READY", payload, message: "No live adapter is configured for this channel; payload is ready for platform-specific review." };
  const result = row.channel === "whatsapp" ? { dryRun: true, would: "Approved WhatsApp template handoff requires recipient consent and a pre-approved template." } : await publisher.publish({ text: copy, caption: copy, title: row.experiment_name, imageUrls: [] }, { confirm: Boolean(confirm && process.env.POST_LIVE === "1") });
  return { ok: true, dryRun: result.dryRun !== false, status: result.posted ? "PUBLISHED" : "DRY_RUN", publisher: publisher.channel, payload, result, reviewer };
}
