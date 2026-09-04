// FACTORY RUNNER — one safe unattended cycle, in order. It may research, plan, QA and render
// local drafts. It never sends outreach, spends money, or calls a paid generation provider unattended.
//   node --experimental-sqlite data-core/run_loop.mjs
import { open, logRun, setState } from "./db.mjs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));

let db = open(); logRun(db, "System", "Factory cycle start", new Date().toLocaleTimeString()); setState(db, "loop_started", new Date().toISOString()); db.close();

// Snapshot the DB first (it's the only record; gitignored). Non-fatal if it fails.
try { execFileSync(process.execPath, ["--experimental-sqlite", join(HERE, "backup.mjs")], { stdio: "inherit", env: process.env }); } catch {}

// Set DISCOVER=1 (with STEALTH=1) to include browser POC discovery. Repurposing is opt-in because
// the configured failover chain may incur provider charges. Outbound delivery is a separate, reviewed action.
const steps = [
  ["Partner layer (CRM backbone)", "partner_layer.mjs", []],
  ["Research worklist", "research_worklist.mjs", []],
  process.env.DISCOVER === "1" ? ["POC discovery (stealth Google→LinkedIn)", "discover_pocs.mjs", ["6"]] : null,
  ["Email inference", "infer_contacts.mjs", []],
  process.env.FACTORY_SAFE_MODE !== "0" ? null : ["Repurpose content → social (provider; may consume credits)", "repurpose_content.mjs", [process.env.REPURPOSE_PAGES || "1"]],
  ["QA reviewer (content)", "qa_content.mjs", []],
  ["QA infographics (numbers vs data core)", "qa_infographics.mjs", []],
  ["QA proposals (claims + voice)", "qa_proposals.mjs", []],
  ["Sourcing research (free web)", "sourcing_research.mjs", []],
  ["Publisher (local site)", "publish_site.mjs", []],
].filter(Boolean);
for (const [name, script, args] of steps) {
  console.log(`\n=== ${name} ===`);
  try { execFileSync(process.execPath, ["--experimental-sqlite", join(HERE, script), ...args], { stdio: "inherit", env: process.env }); }
  catch { console.log(`(${name} step reported an issue — continuing)`); }
}
db = open(); logRun(db, "System", "Factory cycle complete", `backup · partner-layer · QA · publish${process.env.FACTORY_SAFE_MODE !== "0" ? " · safe-mode (no generation/outreach)" : " · provider-generation opt-in"}`);
setState(db, "loop_completed", new Date().toISOString()); db.close();
console.log("\n✓ factory cycle done.");
