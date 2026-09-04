import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { auditPublicContent, findInternalNotes } from "../lib/content_gate.mjs";
import { sendEmail } from "../lib/mailer.mjs";
import { autopilotState } from "../server/growth_autopilot.mjs";
import { open } from "../data-core/db.mjs";
import { renderResourceArticle } from "../server/resource_pages.mjs";

test("content gate catches a new internal instruction instead of rewriting it", () => {
  const note = "The page should display the newly invented approval phrase.";
  assert.equal(findInternalNotes(note).length, 1);
  assert.equal(auditPublicContent(`# Guide\n\n${note}`).publishable, false);
});

test("public treatment rendering is noindex and never exposes internal notes", () => {
  const html = renderResourceArticle("/treatments/cardiac/cabg-india", process.cwd(), "http://localhost:5173");
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.doesNotMatch(html, /Canopus should|Do not publish/);
  assert.doesNotMatch(html, /MedicalWebPage/);
  assert.match(html, /Clinical review: pending/);
});

test("mailer fails closed without real legal sender metadata", async () => {
  const dir = mkdtempSync(join(tmpdir(), "medyatra-mailer-"));
  const result = await sendEmail({ to: "partner@hospital.org", subject: "Test", text: "Draft", from: "" }, dir);
  assert.equal(result.status, "blocked");
  assert.equal(result.reason, "EMAIL_COMPLIANCE_CONFIG_REQUIRED");
  assert.equal(existsSync(dir) && (await import("node:fs")).readdirSync(dir).length, 0);
  rmSync(dir, { recursive: true, force: true });
});

test("autopilot is opt-in and disabled in demo mode", () => {
  const dir = mkdtempSync(join(tmpdir(), "medyatra-autopilot-"));
  const db = open(join(dir, "test.db"));
  db.exec("CREATE TABLE IF NOT EXISTS system_state (k TEXT PRIMARY KEY, v TEXT NOT NULL)");
  const prior = { APP_MODE: process.env.APP_MODE, GROWTH_AUTOPILOT: process.env.GROWTH_AUTOPILOT };
  process.env.APP_MODE = "demo";
  delete process.env.GROWTH_AUTOPILOT;
  const state = autopilotState(db);
  assert.equal(state.enabled, false);
  assert.equal(state.safeMode, true);
  assert.equal(state.outbound, "DISABLED");
  for (const [key, value] of Object.entries(prior)) {
    if (value == null) delete process.env[key]; else process.env[key] = value;
  }
  db.close();
  rmSync(dir, { recursive: true, force: true });
});
