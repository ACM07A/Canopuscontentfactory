// Deterministic packaging layer. It creates reviewable, channel-native packages without inventing facts.
// Provider-generated media can replace these files later, but a package is never labelled publish-ready until
// its voiceover, captions, claim audit and human review record exist.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
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

function svgCard(title, subtitle, body, page, total) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f7faf8"/><rect width="1080" height="24" fill="#126342"/><circle cx="120" cy="142" r="54" fill="#dcefe4"/><path d="M92 142h56M120 114v56" stroke="#126342" stroke-width="10" stroke-linecap="round"/><text x="205" y="151" font-family="Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="3" fill="#126342">CANOPUS CARE</text><text x="80" y="285" font-family="Arial,sans-serif" font-size="17" font-weight="800" letter-spacing="3" fill="#1f8a62">${page === 1 ? "START HERE" : `QUESTION ${page - 1}`}</text><text x="80" y="430" font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#14251f">${esc(title)}</text><rect x="80" y="540" width="920" height="5" rx="3" fill="#d7e9df"/><text x="80" y="650" font-family="Arial,sans-serif" font-size="31" fill="#52665b">${esc(body)}</text><text x="80" y="820" font-family="Arial,sans-serif" font-size="22" fill="#6c7e75">${esc(subtitle)}</text><rect x="80" y="1015" width="920" height="150" rx="18" fill="#e6f4ec"/><text x="115" y="1080" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#126342">Canopus Care coordinates questions</text><text x="115" y="1125" font-family="Arial,sans-serif" font-size="21" fill="#52665b">Clinical decisions stay with the treating team.</text><text x="1000" y="1280" text-anchor="end" font-family="Arial,sans-serif" font-size="18" fill="#6c7e75">${page}/${total} · general education</text></svg>`;
}

function textFor(channel, format, e) {
  const lead = `A clear way to research ${e.objective.toLowerCase()} in ${e.market}.`;
  const disclosure = "Canopus Care is a medical-travel facilitator, not a healthcare provider. This is an educational draft; the treating hospital makes clinical decisions.";
  if (channel === "seo") return `# ${e.name}: a practical research guide for ${e.market}\n\n${lead}\n\n## What to verify before you decide\n\nUse this guide to organize questions, compare written information, and understand the coordination process. Do not rely on a page as a diagnosis or treatment recommendation.\n\n## Questions to take to a hospital\n\nAsk what the assessment covers, what remains uncertain, what documents are needed, who answers clinical questions, and what follow-up arrangements are available. Request important details in writing.\n\n## What Canopus Care does\n\n${disclosure} We can help organize an enquiry and supporting documents. You arrange your own travel and visa unless a separately described service is agreed.\n\n## Next step\n\nRequest a documented, non-binding coordination pathway.\n\n<!-- DRAFT · source-backed clinical/price claims require citation and human sign-off -->`;
  if (format.includes("carousel")) return `${lead}\n\nCard 1: Start with the questions that matter.\nCard 2: What records will the hospital review?\nCard 3: What does the written estimate include?\nCard 4: What remains uncertain or excluded?\nCard 5: How will follow-up communication work?\n\n${disclosure}`;
  if (format.includes("video") || format === "reel" || format === "short-video") return `VIDEO BRIEF\nHook: ${lead}\nBeat 1: Ask what records the hospital needs to review.\nBeat 2: Ask for inclusions, exclusions and validity in writing.\nBeat 3: Ask how follow-up communication will work.\nCTA: Request a documented coordination pathway.\nSafety: no diagnosis, no outcome promise, no fake patient or doctor, no unverified pricing.\nAudio: publishable version requires approved voiceover and caption alignment.\n\n${disclosure}`;
  return `${lead}\n\nAsk for documented information, compare what is known with what still needs verification, and keep medical decisions with the treating hospital.\n\n${disclosure}`;
}

export function renderDraftPackages(db) {
  ensureFactorySchema(db); const statuses = process.env.FACTORY_RENDER_REBUILD === "1" ? "('DRAFT','READY_FOR_REVIEW','APPROVED')" : "('DRAFT')";
  const rows = db.prepare(`SELECT a.*, e.name experiment_name, e.market, e.icp, e.objective, e.budget FROM channel_asset a JOIN growth_experiment e ON e.id=a.experiment_id WHERE a.status IN ${statuses} ORDER BY a.created_at`).all(); let rendered = 0;
  for (const asset of rows) {
    const base = join(ROOT, "outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format)); mkdirSync(base, { recursive: true });
    const e = { name: asset.experiment_name, market: asset.market, icp: asset.icp, objective: asset.objective, budget: asset.budget }; const copy = textFor(asset.channel, asset.format, e);
    let file;
    if (asset.format.includes("carousel")) {
      const cards = [["Start with the right questions", "A clear checklist is more useful than a headline promise."], ["What records will they review?", "Ask what is needed before a hospital can respond."], ["What does the estimate include?", "Request inclusions, exclusions and validity in writing."], ["What remains uncertain?", "Keep clinical decisions with qualified hospital teams."], ["Request a documented pathway", "A coordinator can organize the next questions with consent."]];
      cards.forEach(([title, body], i) => writeFileSync(join(base, `card-${i + 1}.svg`), svgCard(title, `${e.market} · ${e.name}`, body, i + 1, cards.length)));
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "manifest.md");
      writeFileSync(join(ROOT, file), `# ${asset.channel} ${asset.format}\n\n${copy}\n\nFiles: card-1.svg through card-${cards.length}.svg\n\nProduction status: DRAFT — human review required.\n`);
    } else if (asset.format.includes("video") || asset.format === "reel" || asset.format === "short-video") {
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "video-brief.md"); writeFileSync(join(ROOT, file), `# ${asset.channel} video brief\n\n${copy}\n`);
    } else if (asset.format === "cornerstone-page") {
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "draft.md"); writeFileSync(join(ROOT, file), copy);
    } else {
      file = join("outputs", "factory", safe(asset.experiment_id), safe(asset.channel), safe(asset.format), "copy.md"); writeFileSync(join(ROOT, file), `# ${asset.channel} ${asset.format}\n\n${copy}\n`);
    }
    const spec = CHANNEL_SPECS[asset.channel] || { surface: "review", objective: "review", specs: [] };
    const metadata = { ...JSON.parse(asset.metadata_json || "{}"), surface: spec.surface, channel_objective: spec.objective, deliverable_requirements: spec.specs, attribution: { campaign: safe(asset.experiment_name), creative_id: asset.id, utm_required: true }, output_path: file, generated_by: "deterministic-factory-renderer-v2", creative_system: "docs/CREATIVE_PRODUCTION_SYSTEM.md", review_required: true, publish_mode: "human_approved_dry_run" };
    writeFileSync(join(base, "package.json"), JSON.stringify(metadata, null, 2));
    db.prepare("UPDATE channel_asset SET status='READY_FOR_REVIEW', asset_path=?, metadata_json=? WHERE id=?").run(file, JSON.stringify(metadata), asset.id); rendered++;
  }
  return { rendered };
}

if (process.argv[1]?.toLowerCase().endsWith("factory_render.mjs")) { const db = open(); try { console.log(JSON.stringify(renderDraftPackages(db))); } finally { db.close(); } }
