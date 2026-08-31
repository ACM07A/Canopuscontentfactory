import { resolve } from "node:path";
import { getResourceArticlePaths, renderResourceArticle } from "../server/resource_pages.mjs";

const root = resolve(".");
const internalLanguage = /competitor-level|search intent|conversion intent|localisation status|content brief|AI[- ]generated/i;
const generatedTreatments = getResourceArticlePaths().filter((path) => (
  path.startsWith("/treatments/")
  && ![
    "/treatments/orthopaedics/knee-replacement-india",
    "/treatments/orthopaedics/hip-replacement-india",
    "/treatments/cardiac/cabg-india",
    "/treatments/cardiac/heart-valve-surgery-india",
    "/treatments/oncology/cancer-treatment-india",
    "/treatments/oncology/breast-cancer-india",
    "/treatments/urology/kidney-stone-surgery-india",
  ].includes(path)
));

const rows = getResourceArticlePaths().map((path) => {
  const html = renderResourceArticle(path, root, "https://www.canopuscare.com");
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
  return {
    path,
    internalLanguage: internalLanguage.test(text),
    sources: (html.match(/<span>Source \d{2}<\/span>/g) || []).length,
    hasPatientLens: html.includes("From the patient side"),
    hasEvidenceTrail: html.includes("Evidence trail"),
    hasIllustrativeImage: html.includes("not a Canopus Care patient story"),
  };
});

const failures = rows.filter((row) => (
  row.internalLanguage
  || (generatedTreatments.includes(row.path) && (!row.hasPatientLens || !row.hasEvidenceTrail || row.sources < 3))
  || (row.path.startsWith("/treatments/oncology/") && !row.hasIllustrativeImage)
));

console.log(JSON.stringify({
  pages: rows.length,
  generatedTreatments: generatedTreatments.length,
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
