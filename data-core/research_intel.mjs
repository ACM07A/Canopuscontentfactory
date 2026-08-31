// Public research collector for the factory. It records observations and source URLs, never clinical
// facts. The packet is research-only until a human verifies any claim before publication.
import { open } from "./db.mjs";
import { search } from "../lib/research.mjs";
import { randomUUID } from "node:crypto";

export async function collectResearch(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS research_packet (id TEXT PRIMARY KEY, experiment_id TEXT, market TEXT, category TEXT, packet_json TEXT NOT NULL, source_count INTEGER NOT NULL DEFAULT 0, confidence REAL NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'RESEARCH_ONLY', created_at TEXT NOT NULL)`);
  const experiments = db.prepare("SELECT * FROM growth_experiment WHERE status IN ('Draft','Needs approval','Measuring') ORDER BY created_at DESC").all();
  let packets = 0;
  for (const experiment of experiments) {
    const query = `${experiment.market} ${experiment.icp} medical travel India competitors`; const results = await search(query, 8);
    const observations = results.map((r) => ({ kind: /ads|campaign|competitor|clinic|hospital/i.test(`${r.title} ${r.url}`) ? "competitor_signal" : "demand_signal", title: r.title, source_url: r.url, retrieved_at: new Date().toISOString(), confidence: 0.35 }));
    const q = encodeURIComponent(`${experiment.market} ${experiment.icp}`);
    const researchSurfaces = [
      { surface: "Google Trends", url: `https://trends.google.com/trends/explore?q=${q}`, use: "directional demand and related queries" },
      { surface: "TikTok Creative Center", url: "https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en", use: "public top-ad patterns, hooks, and formats" },
      { surface: "Meta Ad Library", url: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${q}`, use: "public competitor creative and copy review" },
      { surface: "Pinterest Trends", url: "https://trends.pinterest.com/", use: "evergreen visual discovery signals" },
      { surface: "YouTube search", url: `https://www.youtube.com/results?search_query=${q}`, use: "public video topics, packaging, and comments to review" },
    ];
    const packet = { query, experiment: { id: experiment.id, market: experiment.market, icp: experiment.icp, objective: experiment.objective }, observations, research_surfaces: researchSurfaces, collection_mode: "public_web_directional", limitations: ["Public search results are directional; no private reach, conversion, or revenue data was accessed.", "Public platform pages may require browser review or rate-limited access; a missing result is not evidence of no demand.", "Clinical, price, accreditation, and credential claims require source verification before use."], next_actions: ["Review source pages in the browser", "Extract recurring questions, hooks, formats, and competitor positioning", "Create platform-specific briefs only after QA"] };
    const id = `research-${randomUUID().slice(0, 10)}`; const now = new Date().toISOString();
    db.prepare("INSERT INTO research_packet (id,experiment_id,market,category,packet_json,source_count,confidence,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)").run(id, experiment.id, experiment.market, null, JSON.stringify(packet), observations.length, observations.length ? 0.35 : 0, "RESEARCH_ONLY", now);
    packets++;
  }
  return { packets, observations: db.prepare("SELECT coalesce(sum(source_count),0) count FROM research_packet").get().count };
}

if (process.argv[1]?.toLowerCase().endsWith("research_intel.mjs")) {
  const db = open();
  try { console.log(JSON.stringify(await collectResearch(db))); } finally { db.close(); }
}
