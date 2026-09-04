// Public-content gate. Every article passes through this module before it is rendered.
// A clean result is not a clinical approval: medical content still needs a named reviewer
// and a review record before it may be indexable.
import { lintClaims } from "./claims.mjs";
import { eeatCheck } from "./eeat.mjs";
import { checkMessage } from "./safety.mjs";

// These are editorial instructions, not patient-facing copy. Keep this detector structural
// rather than maintaining a list of known sentences: a new internal note must fail too.
const INTERNAL_NOTE = /(^|\n)\s*(?:Canopus(?: Care)? should\b|Do not publish\b|Display the real\b|Related internal links\b|content brief\b|localisation status\b|Simple flow arrows\b|`Medically reviewed \[date\]`|(?:the )?(?:page|article|content|copy)\s+(?:should|must)\b|(?:use|add|replace|check|avoid)\b[^\n]{0,140}\b(?:page|claim|source|review|link|date|section|copy|publish)\b)/gim;

export function findInternalNotes(text = "") {
  return [...String(text).matchAll(INTERNAL_NOTE)].map((match) => match[0].trim()).filter(Boolean);
}

export function auditPublicContent(text = "", { author = "", reviewedAt = "", reviewer = "", fingerprint = "" } = {}) {
  const source = String(text);
  const claims = lintClaims(source);
  const safety = checkMessage(source, { outbound: false });
  const eeat = eeatCheck(source);
  const internalNotes = findInternalNotes(source);
  const reviewReady = Boolean(String(author).trim() && String(reviewedAt).trim() && String(reviewer).trim() && String(fingerprint).trim());
  const hardSafety = safety.findings.filter((finding) => ["block", "escalate"].includes(finding.severity));
  return {
    publishable: internalNotes.length === 0 && claims.vague.length === 0 && hardSafety.length === 0 && eeat.ready && reviewReady,
    reviewReady,
    internalNotes,
    claims,
    safety,
    eeat,
    findings: [
      ...internalNotes.map((note) => ({ code: "internal-note", detail: note })),
      ...claims.vague.map((claim) => ({ code: "uncited-vague-claim", detail: claim })),
      ...hardSafety.map((finding) => ({ code: finding.code, detail: finding.detail })),
      ...(!eeat.ready ? [{ code: "eeat-not-ready", detail: `E-E-A-T score ${eeat.score}; missing ${eeat.missing.map((item) => item.signal).join(", ")}` }] : []),
      ...(!reviewReady ? [{ code: "review-record-missing", detail: "Named author, reviewer, review date and content fingerprint are required before indexing." }] : []),
    ],
  };
}
