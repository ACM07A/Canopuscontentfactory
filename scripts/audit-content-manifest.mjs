// Governance audit for the content factory. The manifest is a candidate inventory;
// runtime routes are the served set. This command makes the difference measurable and
// fails if anything served as indexable lacks a review marker or uses medical schema.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getResourceArticlePaths, renderResourceArticle } from "../server/resource_pages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(readFileSync(new URL("../docs/content-engine/02_PAGE_MANIFEST.json", import.meta.url), "utf8"));
const normalize = (route = "") => String(route).replace(/\/$/, "").replace(/^\/en(?=\/)/, "") || "/";
const manifestRoutes = new Set((manifest.pages || []).map((page) => normalize(page.route)));
const servedRoutes = getResourceArticlePaths();
const indexableWithoutReview = [];
const medicalSchema = [];
const internalLeak = [];

for (const route of servedRoutes) {
  const html = renderResourceArticle(route, root, "http://localhost:5173");
  if (!html) continue;
  if (/name="robots" content="index,follow/i.test(html) && !html.includes("Clinically reviewed by")) indexableWithoutReview.push(route);
  if (html.includes('"@type":"MedicalWebPage"')) medicalSchema.push(route);
  if (html.includes("Canopus should") || html.includes("Do not publish")) internalLeak.push(route);
}

const report = {
  manifestCandidates: manifestRoutes.size,
  servedRoutes: servedRoutes.length,
  manifestCandidatesNotServed: [...manifestRoutes].filter((route) => !servedRoutes.includes(route)),
  servedRoutesNotInManifest: servedRoutes.filter((route) => !manifestRoutes.has(normalize(route))),
  indexableWithoutReview,
  medicalSchema,
  internalLeak,
};
console.log(JSON.stringify(report, null, 2));
if (indexableWithoutReview.length || medicalSchema.length || internalLeak.length) process.exitCode = 1;
