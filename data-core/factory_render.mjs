// Deterministic packaging layer. It turns planned channel assets into reviewable, channel-native
// outputs without inventing medical facts. Provider-generated media can replace these files later.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { open } from "./db.mjs";
import { ensureFactorySchema } from "./factory_core.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const safe = (s) => String(s || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const CHANNEL_SPECS = {
  seo: { surface: "owned", objective: "organic discovery", specs: ["title", "meta description", "internal links", "source citations"] },
  instagram: { surface: "organic + paid", objective: "reach and qualified enquiry", specs: ["reel 9:16", "static 4:5", "carousel 4:5", "caption", "UTM"] },
  facebook: { surface: "organic + paid", objective: "reach and qualified enquiry", specs: ["video 9:16 or 1:1", "static 1:1", "carousel", "primary text", "UTM"] },
  tiktok: { surface: "organic + paid", objective: "video discovery", specs: ["short video 9:16", "photo carousel", "hook", "UTM"] },
  youtube: { surface: "organic + paid", objective: "video discovery", specs: ["short video 9:16", "title", "description", "UTM"] },
  linkedin: { surface: "organic + paid", objective: "professional trust", specs: ["video", "document carousel", "post copy", "UTM"] },
  pinterest: { surface: "organic", objective: "evergreen discovery", specs: ["vertical pin", "video pin", "carousel", "title", "description", "UTM"] },
  x: { surface: "organic", objective: "conversation", specs: ["video", "image thread", "thread copy", "UTM"] },
  whatsapp: { surface: "conversion", objective: "consented follow-up", specs: ["approved template", "consent check", "opt-out"] },
  telegram: { surface: "organic", objective: "community education", specs: ["post", "source link", "moderation"] },
};

function svgCard(title, subtitle, page, total) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f3f8f4"/><rect width="1080" height="34" fill="#1f8a62"/><circle cx="120" cy="155" r="70" fill="#dcefe4"/><path d="M84 155h72M120 119v72" stroke="#126342" stroke-width="12" stroke-linecap="round"/><text x="120" y="310" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="#126342">MEDYATRA</text><text x="80" y="490" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#14251f">${esc(title)}</text><text x="80" y="610" font-family="Arial,sans-serif" font-size="28" fill="#52665b">${esc(subtitle)}</text><line x1="80" y1="730" x2="1000" y2="730" stroke="#d3e4d9" stroke-width="3"/><text x="80" y="820" font-family="Arial,sans-serif" font-size="23" fill="#6c7e75">Educational draft · verify all clinical and price details</text><text x="80" y="1210" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#126342">Learn more → medyatra.example</text><text x="1000" y="1280" text-anchor="end" font-family="Arial,sans-serif" font-size="18" fill="#6c7e75">${page}/${total}</text></svg>`;
}

function textFor(channel, format, e) {
  const lead = `A clear way to research ${e.objective.toLowerCase()} in ${e.market}.`;
  const disclosure = "MedYatra is a medical-travel facilitator, not a healthcare provider. This is an educational draft; the treating hospital makes clinical decisions.";
  if (channel === "seo") return `# ${e.name}: a practical research guide for ${e.market}\n\n${lead}\n\n## What to verify before you decide\n\nUse this guide to organize questions, compare written information, and understand the coordination process. Do not rely on a page as a diagnosis or treatment recommendation.\n\n## Questions to take to a hospital\n\nAsk what the assessment covers, what remains uncertain, what documents are needed, who answers clinical questions, and what follow-up arrangements are available. Request important details in writing.\n\n## What MedYatra does\n\n${disclosure} We can help organize an enquiry and supporting documents. You arrange your own travel and visa unless a separately described service is agreed.\n\n## Next step\n\nMessage the coordination team for a documented, non-binding pathway.\n\n<!-- DRAFT · source-backed clinical/price claims require citation and human sign-off -->`;
  if (format.includes("carousel")) return `${lead}\n\nCard 1: Start with the questions that matter.\nCard 2: Ask what an estimate includes and excludes.\nCard 3: Request the hospital's written assessment.\nCard 4: Keep clinical decisions with the treating team.\nCard 5: Message MedYatra for coordination.\n\n${disclosure}`;
  if (format.includes("video") || format === "reel" || format === "short-video") return `VIDEO BRIEF\nHook: ${lead}\nScene 1: A coordinator opens a checklist.\nScene 2: Show three questions on screen.\nScene 3: Show a calm handoff to the hospital team.\nCTA: Request a documented coordination pathway.\nSafety: no diagnosis, no outcome promise, no fake patient or doctor, no unverified pricing.\n\n${disclosure}`;
  return `${lead}\n\nAsk for documented information, compare what is known with what still needs verification, and keep medical decisions with the treating hospital.\n\n${disclosure}`;
}

export function renderDraftPackages(db) {
  ensureFactorySchema(db); const rows = db.prepare(`SELECT a.*, e.name experiment_name, e.market, e.icp, e.objective, e.budget FROM channel_asset a JOIN growth_experiment e ON e.id=a.experiment_id WHERE a.status='DRAFT' ORDER BY a.created_at`).all(); let rendered = 0;
  for (const asset of rows) {
    const base = join(ROOT, "outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format)); mkdirSync(base, { recursive: true });
    const e = { name: asset.experiment_name, market: asset.market, icp: asset.icp, objective: asset.objective, budget: asset.budget }; const copy = textFor(asset.channel, asset.format, e);
    let file;
    if (asset.format.includes("carousel")) {
      const cards = ["Start with the right questions", "Ask what the estimate includes", "Request written information", "Keep clinical decisions with the hospital", "Message for coordination"];
      cards.forEach((title, i) => writeFileSync(join(base, `card-${i + 1}.svg`), svgCard(title, `${e.market} · ${e.name}`, i + 1, cards.length)));
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "manifest.md");
      writeFileSync(join(ROOT, file), `# ${asset.channel} ${asset.format}\n\n${copy}\n\nFiles: card-1.svg through card-${cards.length}.svg\n`);
    } else if (asset.format.includes("video" ) || asset.format === "reel" || asset.format === "short-video") {
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "video-brief.md"); writeFileSync(join(ROOT, file), `# ${asset.channel} video brief\n\n${copy}\n`);
    } else if (asset.format === "cornerstone-page") {
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "draft.md"); writeFileSync(join(ROOT, file), copy);
    } else {
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "copy.md"); writeFileSync(join(ROOT, file), `# ${asset.channel} ${asset.format}\n\n${copy}\n`);
    }
    const spec = CHANNEL_SPECS[asset.channel] || { surface: "review", objective: "review", specs: [] };
    const metadata = { ...JSON.parse(asset.metadata_json || "{}"), surface: spec.surface, channel_objective: spec.objective, deliverable_requirements: spec.specs, attribution: { campaign: safe(asset.experiment_name), creative_id: asset.id, utm_required: true }, output_path: file, generated_by: "deterministic-factory-renderer", review_required: true, publish_mode: "human_approved_dry_run" };
    writeFileSync(join(base, "package.json"), JSON.stringify(metadata, null, 2));
    db.prepare("UPDATE channel_asset SET status='READY_FOR_REVIEW', asset_path=?, metadata_json=? WHERE id=?").run(file, JSON.stringify(metadata), asset.id); rendered++;
  }
  return { rendered };
}

if (process.argv[1]?.toLowerCase().endsWith("factory_render.mjs")) { const db = open(); try { console.log(JSON.stringify(renderDraftPackages(db))); } finally { db.close(); } }
