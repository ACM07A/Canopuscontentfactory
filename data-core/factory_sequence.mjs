// Compose a multi-scene organic Short from provider-generated clips. This is an explicit operator
// command, never part of live publishing. Each scene is independently reviewable before release.
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { loadEnv } from "../lib/env.mjs";
import { createVideo, getVideoTask, status as providerStatus } from "../lib/providers/freepik.mjs";
import { videoProfile } from "../lib/video_profiles.mjs";

loadEnv();
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const profile = videoProfile(process.env.FACTORY_VIDEO_USE_CASE || "knee-replacement");
const model = process.env.FREEPIK_VIDEO_MODEL || "kling-v2-5-pro";
const source = process.env.FACTORY_TRIAL_IMAGE || join(ROOT, "outputs", "factory", "trials", "organic-social-kling-001", "trial-source-vertical.jpg");
const duration = Number(process.env.FACTORY_VIDEO_SCENE_SECONDS) === 10 ? 10 : 5;
const maxScenes = Math.max(2, Math.min(Number(process.env.FACTORY_VIDEO_SCENES) || profile.scenes.length, profile.scenes.length));
const outId = process.env.FACTORY_VIDEO_ID || `${process.env.FACTORY_VIDEO_USE_CASE || "knee-replacement"}-organic-short-001`;
const outDir = join(ROOT, "outputs", "factory", "video-sequences", outId);
const promptBase = `Vertical organic social explainer for a medical-travel facilitator. Calm, documentary, realistic, clearly illustrative. ${profile.prompt || "Use a neutral coordinator and planning visuals."} No on-screen text, no logos, no identifiable real person, no diagnosis, no treatment recommendation, no outcome promise, no price, no accreditation claim.`;

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function terminal(status) { return ["COMPLETED", "SUCCEEDED", "FAILED", "ERROR", "CANCELLED"].includes(String(status).toUpperCase()); }
function srtTime(seconds) { const h = String(Math.floor(seconds / 3600)).padStart(2, "0"); const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"); const s = (seconds % 60).toFixed(3).padStart(6, "0").replace(".", ","); return `${h}:${m}:${s}`; }

if (!providerStatus().configured) throw new Error("FREEPIK_API_KEY is not configured");
if (!providerStatus().unlimitedModels.includes(model)) throw new Error(`Model ${model} is not allowlisted as unlimited`);
mkdirSync(outDir, { recursive: true });
const image = readFileSync(source).toString("base64");
const sceneResults = [];
for (let i = 0; i < maxScenes; i++) {
  const prompt = `${promptBase} Scene ${i + 1}: ${profile.scenes[i]}`;
  const sceneJsonPath = join(outDir, `scene-${i + 1}.json`);
  const sceneVideoPath = join(outDir, `scene-${i + 1}.mp4`);
  if (existsSync(sceneJsonPath) && existsSync(sceneVideoPath)) {
    sceneResults.push(JSON.parse(readFileSync(sceneJsonPath, "utf8")));
    continue;
  }
  const created = await createVideo({ model, prompt, image, duration });
  let latest = created;
  for (let n = 0; n < 30 && !terminal(latest.status); n++) { await wait(5000); latest = await getVideoTask({ model, taskId: created.taskId }); }
  const urls = latest.generated || [];
  sceneResults.push({ scene: i + 1, prompt, ...latest, output_urls: urls });
  writeFileSync(sceneJsonPath, JSON.stringify(sceneResults.at(-1), null, 2));
  if (!urls.length || !terminal(latest.status) || String(latest.status).toUpperCase() === "FAILED") throw new Error(`Scene ${i + 1} did not complete.`);
  execFileSync("powershell", ["-NoProfile", "-Command", `Invoke-WebRequest -Uri '${urls[0]}' -OutFile '${sceneVideoPath}' -TimeoutSec 120`], { stdio: "ignore" });
}
const concat = sceneResults.map((_, i) => `file '${join(outDir, `scene-${i + 1}.mp4`).replaceAll("'", "'\\''")}'`).join("\n");
writeFileSync(join(outDir, "concat.txt"), concat);
execFileSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", join(outDir, "concat.txt"), "-c", "copy", join(outDir, "organic-short.mp4")], { stdio: "ignore" });
const captionLines = profile.captions || profile.scenes;
const captions = captionLines.slice(0, maxScenes).map((line, i) => `${i + 1}\n${srtTime(i * duration)} --> ${srtTime((i + 1) * duration)}\n${line}`).join("\n\n");
writeFileSync(join(outDir, "captions-review.srt"), captions);
writeFileSync(join(outDir, "sequence.json"), JSON.stringify({ ok: true, title: profile.title, model, duration_seconds: maxScenes * duration, format: "1080x1920 9:16", scene_count: maxScenes, safety: "human-review-required", publish: false, scenes: sceneResults }, null, 2));
console.log(JSON.stringify({ ok: true, title: profile.title, model, durationSeconds: maxScenes * duration, outDir: `outputs/factory/video-sequences/${outId}`, publish: false }));
