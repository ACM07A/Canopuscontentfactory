// Production worker — submits allowlisted image/video jobs to Freepik and records async task IDs.
// It never publishes. A missing key or non-allowlisted model leaves the job queued with an explicit status.
import { open } from "./db.mjs";
import { loadEnv } from "../lib/env.mjs";
import { createImage, createVideo, status as providerStatus } from "../lib/providers/freepik.mjs";

loadEnv();
const db = open();
const limit = Number(process.env.FACTORY_JOB_BATCH) || 3;
// Provider calls are a spend boundary. Only assets with an explicit human approval record
// may leave the local queue; the planner/autopilot cannot submit pending drafts.
const jobs = db.prepare(`SELECT j.* FROM production_job j
  JOIN channel_asset a ON a.production_job_id=j.id
  JOIN factory_approval f ON f.asset_id=a.id AND f.status='APPROVED'
  WHERE j.status='READY_FOR_GENERATION' ORDER BY j.created_at LIMIT ?`).all(limit);
let submitted = 0;
for (const job of jobs) {
  const input = JSON.parse(job.input_json || "{}");
  const now = new Date().toISOString();
  db.prepare("UPDATE production_job SET status='GENERATING', updated_at=? WHERE id=? AND status='READY_FOR_GENERATION'").run(now, job.id);
  try {
    const prompt = `${input.objective}. Audience: ${input.icp}. Market: ${input.market}. Channel: ${input.channel}. Format: ${input.format}. Create a calm, factual medical-travel facilitation visual. No text in image, no fake patient, no fake doctor, no outcome guarantee, no accreditation claim.`;
    const result = job.job_type === "VIDEO"
      ? await createVideo({ model: job.model, prompt, duration: 5 })
      : await createImage({ model: job.model, prompt, aspectRatio: input.format.includes("4x5") ? "4:5" : "1:1" });
    db.prepare("UPDATE production_job SET status='PROVIDER_SUBMITTED', output_json=?, updated_at=? WHERE id=?").run(JSON.stringify(result), now, job.id);
    db.prepare("UPDATE channel_asset SET status='GENERATION_SUBMITTED', metadata_json=? WHERE production_job_id=?").run(JSON.stringify({ ...input, provider: result }), job.id);
    submitted++;
  } catch (error) {
    db.prepare("UPDATE production_job SET status='BLOCKED_PROVIDER', error=?, updated_at=? WHERE id=?").run(String(error.message || error).slice(0, 500), now, job.id);
  }
}
console.log(JSON.stringify({ ok: true, considered: jobs.length, submitted, provider: providerStatus() }));
db.close();
