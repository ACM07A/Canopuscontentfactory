// Magnific web-app worker. It opens the user's visible browser profile, prepares an approved job,
// and only clicks Generate when the operator explicitly enables both flags below:
//   MAGNIFIC_WEB_ENABLED=1 MAGNIFIC_WEB_AUTO_SUBMIT=1 MAGNIFIC_WEB_CONFIRM=1
// It never bypasses login, CAPTCHA, plan limits, or credit controls.
import { open } from "./db.mjs";
import { loadEnv } from "../lib/env.mjs";
import { stealthSession } from "../lib/browser.mjs";
import { ensureHybridSchema, hybridConfig } from "./hybrid_factory.mjs";

loadEnv();
const db = open();
ensureHybridSchema(db);
const id = process.env.HYBRID_JOB_ID || "";
const job = id
  ? db.prepare("SELECT * FROM hybrid_generation_job WHERE id=? AND status='APPROVED_FOR_GENERATION'").get(id)
  : db.prepare("SELECT * FROM hybrid_generation_job WHERE status='APPROVED_FOR_GENERATION' ORDER BY created_at LIMIT 1").get();
const config = hybridConfig();

function update(status, stage, error = null, output = null) {
  const now = new Date().toISOString();
  db.prepare("UPDATE hybrid_generation_job SET status=?,stage=?,error=?,output_json=?,updated_at=? WHERE id=?")
    .run(status, stage, error ? String(error).slice(0, 500) : null, output ? JSON.stringify(output) : null, now, job.id);
}

if (!job) {
  console.log(JSON.stringify({ ok: true, skipped: true, reason: "No APPROVED_FOR_GENERATION hybrid job." }));
  db.close();
} else if (!config.browserEnabled) {
  update("BLOCKED_CONFIGURATION", "GENERATE", "MAGNIFIC_WEB_ENABLED is not enabled.");
  console.log(JSON.stringify({ ok: false, error: "Enable MAGNIFIC_WEB_ENABLED=1 before starting the browser worker." }));
  db.close();
} else if (!config.browserProfileConfigured) {
  update("BLOCKED_CONFIGURATION", "GENERATE", "STEALTH_PROFILE_DIR is missing or does not exist.");
  console.log(JSON.stringify({ ok: false, error: "Set STEALTH_PROFILE_DIR to the browser profile that is signed into Magnific." }));
  db.close();
} else {
  const payload = JSON.parse(job.payload_json || "{}");
  const prompt = `${payload.brief || "Create the approved creative brief."}\n\nFormat: ${payload.format || "9:16"}. Use a fictional AI medical educator. Include spoken narration, shot-level continuity, captions-safe framing, and a clearly labeled general-education disclaimer. No diagnosis, treatment advice, clinical outcome promise, price claim, or invented credential.`;
  update("BROWSER_OPENING", "GENERATE");
  try {
    const result = await stealthSession(async ({ page }) => {
      await page.goto(process.env.MAGNIFIC_WEB_APP_URL || "https://www.magnific.com/app/ai-video-generator", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const bodyText = await page.evaluate(() => document.body?.innerText || "");
      if (/welcome to magnific|log in with|continue with google/i.test(bodyText)) throw new Error("Magnific web session is not signed in.");
      const input = await page.$("textarea, [contenteditable='true'], input[placeholder*='prompt' i], input[placeholder*='describe' i]");
      if (!input) throw new Error("Magnific prompt field was not found; the web UI may have changed.");
      await input.click();
      await page.keyboard.type(prompt);
      if (!config.browserAutoSubmit || config.browserConfirmationRequired) {
        return { status: "BROWSER_READY", requires_operator_submit: true, prompt_prepared: true, url: page.url() };
      }
      const clicked = await page.evaluate(() => [...document.querySelectorAll("button")].find((button) => /^generate$/i.test((button.innerText || "").trim()))?.click() || false);
      if (!clicked) throw new Error("Generate button was not found; no credit-consuming action was taken.");
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return { status: "SUBMITTED_TO_MAGNIFIC_WEB", requires_operator_submit: false, prompt_prepared: true, url: page.url() };
    });
    update(result.status, "GENERATE", null, result);
    console.log(JSON.stringify({ ok: true, jobId: job.id, ...result }));
  } catch (error) {
    update("BLOCKED_BROWSER", "GENERATE", error.message || error);
    console.log(JSON.stringify({ ok: false, jobId: job.id, error: String(error.message || error) }));
  } finally { db.close(); }
}
