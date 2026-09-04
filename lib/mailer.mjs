// Mailer — FREE by default (writes .eml to a local outbox; a human dispatches). Resend if RESEND_API_KEY.
//
// CAN-SPAM / GDPR compliance is enforced here, not left to the copy: every message gets a compliance
// FOOTER (sender identity + physical postal address + why-you-got-this + how to opt out) and a
// List-Unsubscribe header (one-click). Real B2B cold outreach also needs, on the SENDING DOMAIN:
//   • SPF + DKIM + DMARC records (or it lands in spam regardless of content)
//   • domain warm-up (ramp volume slowly from a fresh domain)
//   • a maintained suppression/opt-out list (honor STOP immediately)
// These are ops steps (see /build-os/10); this module makes each message itself compliant.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SENDER_NAME = process.env.SENDER_NAME?.trim() || "";
const SENDER_ADDRESS = process.env.SENDER_ADDRESS?.trim() || "";
const UNSUB_EMAIL = process.env.UNSUBSCRIBE_EMAIL?.trim() || "";
const UNSUB_URL = process.env.UNSUBSCRIBE_URL?.trim() || "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validRealEmail = (value) => EMAIL_RE.test(value) && !value.toLowerCase().includes(".example");
const validRealUrl = (value) => /^https:\/\/[^\s]+$/i.test(value) && !value.toLowerCase().includes(".example");

function emailConfigError(from) {
  if (!SENDER_NAME || SENDER_NAME.includes("[SET")) return "SENDER_NAME is required";
  if (!validRealEmail(from)) return "SENDER_EMAIL must be a real sender address";
  if (!SENDER_ADDRESS || SENDER_ADDRESS.includes("[SET")) return "SENDER_ADDRESS must be a real postal address";
  if (UNSUB_EMAIL && !validRealEmail(UNSUB_EMAIL)) return "UNSUBSCRIBE_EMAIL must be a real address";
  if (UNSUB_URL && !validRealUrl(UNSUB_URL)) return "UNSUBSCRIBE_URL must be an HTTPS URL";
  if (!UNSUB_EMAIL && !UNSUB_URL) return "UNSUBSCRIBE_EMAIL or UNSUBSCRIBE_URL is required";
  return null;
}

function complianceFooter() {
  const optout = UNSUB_URL ? `unsubscribe: ${UNSUB_URL}` : `reply "STOP" or email ${UNSUB_EMAIL}`;
  return `\r\n\r\n—\r\n${SENDER_NAME} · ${SENDER_ADDRESS}\r\n` +
    `You received this one-time B2B partnership inquiry because your organisation's public business-development contact was identified for medical-value-travel partnerships (legitimate-interest basis). ` +
    `Not the right person? Reply and we'll update our records. To stop hearing from us: ${optout}.`;
}

export async function sendEmail({ to, subject, text, from = process.env.SENDER_EMAIL || process.env.RESEND_FROM || "" }, outboxDir) {
  const configError = emailConfigError(from);
  if (configError) return { mode: "blocked", ok: false, status: "blocked", reason: "EMAIL_COMPLIANCE_CONFIG_REQUIRED", detail: configError };
  const body = text + complianceFooter();
  const unsubscribeParts = [UNSUB_URL && `<${UNSUB_URL}>`, UNSUB_EMAIL && `<mailto:${UNSUB_EMAIL}?subject=unsubscribe>`].filter(Boolean);
  const unsubHeader = unsubscribeParts.join(", ");

  if (process.env.POST_LIVE === "1" && process.env.RESEND_API_KEY) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: `${SENDER_NAME} <${from}>`, to, subject, text: body,
          headers: { "List-Unsubscribe": unsubHeader, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }),
      });
      if (r.ok) return { mode: "resend", ok: true, status: "sent" };
    } catch (e) { /* fall through to outbox */ }
  }
  mkdirSync(outboxDir, { recursive: true });
  const eml = `From: ${SENDER_NAME} <${from}>\r\nTo: ${to}\r\nSubject: ${subject}\r\n` +
    `List-Unsubscribe: ${unsubHeader}\r\nList-Unsubscribe-Post: List-Unsubscribe=One-Click\r\n` +
    `Date: ${new Date().toUTCString()}\r\n\r\n${body}\r\n`;
  const file = join(outboxDir, `${Date.now()}-${String(to).replace(/[^a-z0-9]/gi, "_").slice(0, 40)}.eml`);
  writeFileSync(file, eml);
  return { mode: "outbox", ok: true, status: "queued", file };
}
