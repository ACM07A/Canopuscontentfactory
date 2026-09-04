// Outreach Sender — explicit human approval is required for every batch. Without POST_LIVE=1 and
// a configured Resend sender, approved drafts are written to a local outbox for manual dispatch.
//   node --experimental-sqlite data-core/send_outreach.mjs
import { open, logRun } from "./db.mjs";
import { sendEmail } from "../lib/mailer.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTBOX = join(ROOT, "outputs", "outbox");
const db = open();

const approver = process.env.OUTREACH_APPROVER_ID?.trim();
const approvalId = process.env.OUTREACH_APPROVAL_ID?.trim();
if (!approver || !approvalId) {
  logRun(db, "Outreach Sender", "Outbound batch blocked", "A named approver and approval record are required; no email was created or sent.", "/outreach", "pending");
  console.error("outreach blocked: set OUTREACH_APPROVER_ID and OUTREACH_APPROVAL_ID after a human reviews the batch");
  db.close();
  process.exitCode = 2;
} else {
const rows = db.prepare(`SELECT o.*, p.ips_channel_public chan, p.name partner FROM outreach o
  JOIN partner p ON p.id=o.partner_id WHERE o.status='draft'`).all();
let done = 0, skipped = 0;
for (const o of rows) {
  const email = (o.chan || "").match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  if (!email) { logRun(db, "Outreach Sender", `skip ${o.partner}`, "no public email — run sourcing research first", `/outreach/${o.id}`, "pending"); skipped++; continue; }
  const raw = readFileSync(join(ROOT, o.file_ref), "utf8").replace(/<!--[\s\S]*?-->/g, "").trim();
  const body = raw.replace(/^Subject:.*(\r?\n)+/i, "").trim();
  const res = await sendEmail({ to: email[0], subject: o.subject, text: body }, OUTBOX);
  if (!res.ok && res.status === "blocked") {
    logRun(db, "Outreach Sender", `blocked ${o.partner}`, res.detail || res.reason, `/outreach/${o.id}`, "pending");
    skipped++;
    continue;
  }
  db.prepare(`UPDATE outreach SET status=? WHERE id=?`).run(res.status, o.id);
  db.prepare(`UPDATE partner SET stage=? WHERE id=?`).run(res.status === "sent" ? "Outreach sent" : "Outreach queued", o.partner_id);
  logRun(db, "Outreach Sender", `${res.status} ${o.partner}`, `${res.mode} → ${email[0]} · approved by ${approver} · approval ${approvalId}`, `/outreach/${o.id}`, res.ok ? "ok" : "pending");
  done++;
}
logRun(db, "Outreach Sender", "Send batch complete", `${done} ${process.env.POST_LIVE === "1" && process.env.RESEND_API_KEY ? "sent (Resend)" : "queued to local outbox"}, ${skipped} skipped`);
console.log(`outreach: ${done} ${process.env.POST_LIVE === "1" && process.env.RESEND_API_KEY ? "sent" : "queued(outbox)"}, ${skipped} skipped (no email)`);
db.close();
}
