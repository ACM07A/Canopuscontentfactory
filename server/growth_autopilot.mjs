import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { open, setState } from "../data-core/db.mjs";
import { planProduction } from "../data-core/factory_core.mjs";
import { renderDraftPackages } from "../data-core/factory_render.mjs";
import { generateRecommendations } from "../data-core/measurement.mjs";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOOP = join(ROOT, "data-core", "run_loop.mjs");
let active = false;
let timer;

function writeState(key, value) {
  const db = open();
  setState(db, key, value);
  db.close();
}

export function autopilotState(db) {
  const get = (key) => db.prepare("SELECT v FROM system_state WHERE k=?").get(key)?.v || null;
  return {
    enabled: process.env.GROWTH_AUTOPILOT === "1" && process.env.APP_MODE !== "demo",
    safeMode: true,
    outbound: "DISABLED",
    active,
    cadenceHours: Number(process.env.GROWTH_AUTOPILOT_HOURS) || 6,
    lastStarted: get("growth_autopilot_started"),
    lastCompleted: get("growth_autopilot_completed"),
    lastResult: get("growth_autopilot_result") || "Waiting for first cycle",
  };
}

export function runGrowthCycle({ reason = "scheduled" } = {}) {
  if (active) return { ok: false, error: { code: "ALREADY_RUNNING", message: "A factory cycle is already running." } };
  active = true;
  const started = new Date().toISOString();
  writeState("growth_autopilot_started", started);
  writeState("growth_autopilot_result", `Running (${reason})`);
  try {
    execFileSync(process.execPath, ["--experimental-sqlite", join(ROOT, "data-core", "research_intel.mjs")], { cwd: ROOT, stdio: "ignore", env: process.env, windowsHide: true });
    const db = open(); setState(db, "factory_jobs_planned", JSON.stringify(planProduction(db))); renderDraftPackages(db); generateRecommendations(db); db.close();
  } catch (error) { writeState("growth_autopilot_result", `Planning warning: ${String(error.message).slice(0, 120)}`); }
  const child = spawn(process.execPath, ["--experimental-sqlite", LOOP], {
    cwd: ROOT,
    env: { ...process.env, FACTORY_SAFE_MODE: "1", POST_LIVE: "0" },
    stdio: "ignore",
    windowsHide: true,
  });
  child.on("close", (code) => {
    active = false;
    writeState("growth_autopilot_completed", new Date().toISOString());
    writeState("growth_autopilot_result", code === 0 ? "Completed successfully" : `Completed with issues (exit ${code})`);
  });
  child.on("error", (error) => {
    active = false;
    writeState("growth_autopilot_result", `Could not start: ${String(error.message).slice(0, 120)}`);
  });
  return { ok: true, started, reason };
}

export function startGrowthAutopilot() {
  if (process.env.GROWTH_AUTOPILOT !== "1" || process.env.APP_MODE === "demo" || timer) return;
  const hours = Number(process.env.GROWTH_AUTOPILOT_HOURS) || 6;
  timer = setInterval(() => runGrowthCycle({ reason: "scheduled" }), hours * 60 * 60 * 1000);
  timer.unref?.();
}
