import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const esc = (value) => String(value ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) walk(path, out); else out.push(path);
  }
  return out;
}

export function factoryOutputCatalog(root) {
  const base = join(root, "outputs", "factory");
  const files = walk(base);
  const rel = (path) => relative(root, path).replaceAll("\\", "/");
  const sequenceGroups = new Map();
  for (const path of files.filter((p) => p.toLowerCase().endsWith(".mp4") && p.includes("video-sequences"))) {
    const key = path.split(/[/\\]/).slice(0, -1).join("\\");
    if (!sequenceGroups.has(key)) sequenceGroups.set(key, []);
    sequenceGroups.get(key).push(path);
  }
  const preferred = (paths) => ["final-review.mp4", "assembled-review.mp4", "organic-short.mp4"].map((name) => paths.find((p) => p.endsWith(`\\${name}`))).find(Boolean) || paths[0];
  const videos = [...sequenceGroups.values()].map((paths) => { const p = preferred(paths); const metaPath = join(paths[0].split(/[/\\]/).slice(0, -1).join("\\"), "production-package.json"); let production = {}; try { production = JSON.parse(readFileSync(metaPath, "utf8")); } catch {} return {
    kind: "video", name: p.split(/[/\\]/).at(-1), path: rel(p), bytes: statSync(p).size,
    sequence: true, voiceoverStatus: production.voiceover?.status || null, videoModel: production.video_model || null,
  }; });
  const carousels = [];
  for (const manifest of files.filter((p) => p.endsWith("manifest.md") && p.includes("carousel"))) {
    const dir = join(manifest, "..");
    const cards = files.filter((p) => p.startsWith(dir) && /card-\d+\.svg$/i.test(p)).sort();
    carousels.push({ kind: "carousel", name: rel(manifest).split("/").slice(-4, -2).join(" / "), manifest: rel(manifest), cards: cards.map(rel) });
  }
  return { videos, carousels, total: videos.length + carousels.length };
}

function urlFor(path) { return `/${String(path).replaceAll("\\", "/").split("/").map(encodeURIComponent).join("/")}`; }

export function renderFactoryOutputs(root) {
  const catalog = factoryOutputCatalog(root);
  const videoHtml = catalog.videos.filter((v) => v.sequence).map((v) => { const ready = v.name === "final-review.mp4"; const local = ["LOCAL_PREVIEW", "LOCAL_POCKET_TTS"].includes(v.voiceoverStatus); const modelLabel = v.videoModel ? `Generated with ${esc(v.videoModel)}. ` : ""; const label = v.videoModel && local ? "UNSYNCED MODEL + LOCAL VOICE" : local ? "UNSYNCED VOICE PREVIEW" : ready ? "HUMAN REVIEW" : "VOICEOVER PENDING"; return `<article class="asset"><div class="asset-head"><div><span class="eyebrow">${ready ? "FINAL REVIEW CANDIDATE" : "ASSEMBLED PREVIEW"}</span><h2>${esc(v.path.split("/").at(-2))}</h2></div><span class="pill amber">${label}</span></div><video controls preload="metadata" playsinline src="${esc(urlFor(v.path))}"></video><div class="asset-actions"><a class="btn" href="${esc(urlFor(v.path))}" download>Download reel</a><a class="btn" href="${esc(urlFor(v.path))}" target="_blank">Open file</a></div><p class="muted">${modelLabel}${local ? "Timing-only English preview: the face is not lip-synced to this voice. Do not publish; use native-audio video or a lip-sync pass." : ready ? "Voiceover and scene assembly are present. Check narration, captions, continuity, brand treatment and medical-safety review before posting." : "Scene assembly is available for visual review; the package is not publishable until approved voiceover is added."}</p></article>`; }).join("") || `<div class="empty">No assembled reel is available yet. Run the approved video sequence command after provider generation.</div>`;
  const carouselHtml = catalog.carousels.map((c) => `<article class="asset"><div class="asset-head"><div><span class="eyebrow">CAROUSEL PACKAGE</span><h2>${esc(c.name)}</h2></div><span class="pill amber">DRAFT</span></div><div class="cards">${c.cards.slice(0, 5).map((p) => `<a href="${esc(urlFor(p))}" target="_blank"><img src="${esc(urlFor(p))}" alt="Carousel card" loading="lazy"></a>`).join("")}</div><div class="asset-actions"><a class="btn" href="${esc(urlFor(c.manifest))}" target="_blank">Open manifest</a></div><p class="muted">Cards are editable SVG exports. Verify copy, source citations, CTA and brand URL before approval.</p></article>`).join("") || `<div class="empty">No carousel packages available yet.</div>`;
  const css = `:root{--ink:#14251f;--muted:#6c7e75;--line:#dfe9e3;--paper:#f7faf7;--card:#fff;--green:#1f8a62;--amber:#8a5b1a}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.5 Inter,system-ui,sans-serif}.wrap{max-width:1280px;margin:auto;padding:28px 20px 70px}header{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:24px}h1{margin:5px 0;font-size:32px;letter-spacing:-.04em}.eyebrow{color:var(--green);font-size:10px;font-weight:800;letter-spacing:.12em}.muted{color:var(--muted);font-size:12px}.pill{font-size:10px;font-weight:800;padding:4px 8px;border-radius:99px;background:#fff0d8;color:var(--amber);white-space:nowrap}.btn{display:inline-block;border:1px solid var(--line);border-radius:8px;padding:8px 11px;background:#fff;color:var(--ink);text-decoration:none;font-weight:700;font-size:12px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(440px,1fr));gap:18px}.asset{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;box-shadow:0 12px 35px #1837280d}.asset-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}.asset h2{font-size:16px;margin:3px 0}.asset video{display:block;width:100%;max-height:620px;background:#0d1713;border-radius:10px}.asset-actions{display:flex;gap:8px;margin:12px 0}.cards{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.cards img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;border:1px solid var(--line);border-radius:5px}.empty{border:1px dashed var(--line);border-radius:10px;padding:28px;text-align:center;color:var(--muted)}@media(max-width:700px){header{display:block}.grid{grid-template-columns:1fr}.cards{grid-template-columns:repeat(3,1fr)}}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Creative Production Gallery · Canopus Care</title><style>${css}</style></head><body><main class="wrap"><header><div><div class="eyebrow">CANOPUS CARE · CREATIVE PRODUCTION</div><h1>Reviewable outputs</h1><p class="muted">${catalog.total} artifact groups found. This gallery never auto-publishes and never hides missing production stages.</p></div><a class="btn" href="/growth">← Growth Factory</a></header><section class="grid">${videoHtml}${carouselHtml}</section><section style="margin-top:22px" class="muted"><b>Publish gate:</b> named reviewer, claim/safety audit, voiceover/caption review, platform export check, attribution package and explicit platform approval.</section></main></body></html>`;
}
