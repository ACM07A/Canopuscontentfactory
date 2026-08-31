// One explicitly requested, single-asset organic-social trial. It generates only after the operator asks
// for this command; it never publishes. The source is an illustrative local image, not patient data.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../lib/env.mjs";
import { createVideo, getVideoTask, status as providerStatus } from "../lib/providers/freepik.mjs";

loadEnv();
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const model = process.env.FREEPIK_VIDEO_MODEL || "kling-v2-5-pro";
const source = process.env.FACTORY_TRIAL_IMAGE || join(ROOT, "site", "landing", "care-coordination-v2.jpg");
const prompt = "Natural vertical organic-social motion study for a medical-travel facilitator: a calm coordination conversation, subtle camera push-in, gentle hand movement, warm daylight, realistic but clearly illustrative, no on-screen text, no logos, no diagnosis, no treatment recommendation, no outcome promise, no price, no accreditation claim, no identifiable real person.";

function fail(message) { console.error(JSON.stringify({ ok: false, error: message })); process.exitCode = 1; }
if (!providerStatus().configured) fail("FREEPIK_API_KEY is not configured");
else if (!providerStatus().unlimitedModels.includes(model)) fail(`Model ${model} is not allowlisted as unlimited`);
else {
  const ext = source.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  const image = readFileSync(source).toString("base64");
  const result = await createVideo({ model, prompt, image, duration: 5 });
  const trialDir = join(ROOT, "outputs", "factory", "trials", process.env.FACTORY_TRIAL_ID || "organic-social-kling-001"); mkdirSync(trialDir, { recursive: true });
  writeFileSync(join(trialDir, "request.json"), JSON.stringify({ model, source, format: "9:16", duration: 5, prompt, safety: "human-review-required", publish: false }, null, 2));
  writeFileSync(join(trialDir, "provider-task.json"), JSON.stringify(result, null, 2));
  let latest = result;
  for (let i = 0; i < 24 && !["COMPLETED", "SUCCEEDED", "FAILED", "ERROR", "CANCELLED"].includes(String(latest.status).toUpperCase()); i++) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    latest = await getVideoTask({ model, taskId: result.taskId });
    writeFileSync(join(trialDir, "provider-task.json"), JSON.stringify(latest, null, 2));
  }
  const generated = latest.generated || latest.data?.generated || [];
  writeFileSync(join(trialDir, "result.json"), JSON.stringify({ ...latest, output_urls: generated, publish: false }, null, 2));
  console.log(JSON.stringify({ ok: true, model, taskId: result.taskId, status: latest.status, outputUrls: generated, outputDir: `outputs/factory/trials/${process.env.FACTORY_TRIAL_ID || "organic-social-kling-001"}`, sourceType: ext }));
}
