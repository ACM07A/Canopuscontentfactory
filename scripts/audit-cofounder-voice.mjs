import { resolve } from "node:path";
import { getResourceArticlePaths, renderResourceArticle } from "../server/resource_pages.mjs";

const root = resolve(".");
const pages = new Map(getResourceArticlePaths().map((path) => [
  path,
  renderResourceArticle(path, root, "https://www.canopuscare.com"),
]));

const text = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:nbsp|amp|quot|#39);/g, " ")
  .replace(/\s+/g, " ");

const failures = [];
const fail = (path, rule) => failures.push({ path, rule });

const bannedEverywhere = [
  /It is designed to be read with a caregiver or home clinician/i,
  /Pain relief, cancer control, preserving speech or vision/i,
  /high-conversion|keyword-intent|higher-intent searcher|conversion step|competitor-level|localisation status/i,
  /What The coordinator should/i,
  /Public market price signals, not Canopus quotes/i,
  /Fertility pages must be careful/i,
  /transplant vertical/i,
  /\/docs\/content-engine\/09_SOURCE_REGISTER\.md/i,
  /Dr SVS Deo|Prof(?: \(Dr\))? Atul Sharma|Dr Meenu Walia|Dr Subhash Jangid|Dr Yash Gulati/i,
  /reason to reverify device-specific pricing before publishing or quoting/i,
];

for (const [path, html] of pages) {
  const pageText = text(html);
  for (const phrase of bannedEverywhere) {
    if (phrase.test(pageText)) fail(path, `banned customer-facing language: ${phrase}`);
  }

  const directAddress = (pageText.match(/\b(?:you|your)\b/gi) || []).length;
  if (path.startsWith("/treatments/") && path !== "/treatments/urology/kidney-stone-surgery-india" && directAddress < 20) {
    fail(path, `insufficient direct address (${directAddress})`);
  }
  if ((path.startsWith("/resources/") || path.startsWith("/partners/")) && directAddress < 10) {
    fail(path, `insufficient direct address (${directAddress})`);
  }
}

const nonUrologyLeakPaths = [
  "/treatments/spine-neurosurgery/spine-surgery-india",
  "/treatments/spine-neurosurgery/brain-tumour-surgery-india",
  "/treatments/spine-neurosurgery/deep-brain-stimulation-india",
  "/treatments/fertility/ivf-india",
  "/treatments/fertility/icsi-india",
  "/treatments/fertility/fertility-preservation-india",
  "/treatments/bariatric/gastric-sleeve-india",
  "/treatments/bariatric/gastric-bypass-india",
];
for (const path of nonUrologyLeakPaths) {
  const pageText = text(pages.get(path));
  if (/Care commonly involves a urologist|catheters, stents, urine leakage|Will any catheter, stent or drain remain after discharge/i.test(pageText)) {
    fail(path, "urology content leaked into another specialty");
  }
}

for (const path of ["/resources/questions-to-ask-surgeon", "/resources/questions-to-ask-oncologist"]) {
  const pageText = text(pages.get(path));
  if (!/Your five essential questions/.test(pageText)) fail(path, "question-led structure missing");
  if (/Detailed action list|Printable decision sheet|Coordinator handoff/.test(pageText)) fail(path, "generic checklist structure remains");
}

const focusedTools = {
  "/resources/medical-record-checklist": ["Name and order every file", "Send the scan, not only its report"],
  "/resources/hospital-quote-comparison": ["Freeze the clinical assumptions", "Expose the exclusions"],
  "/resources/medical-travel-budget-planner": ["three independent baskets", "currency and payment friction"],
  "/resources/medical-visa-checklist": ["Begin at the official source", "attendant application"],
  "/resources/travel-readiness-checklist": ["Gate one: clinical readiness", "Define pause and stop triggers"],
  "/resources/return-home-checklist": ["discharge summary before leaving", "Reconcile every medicine"],
  "/resources/caregiver-checklist": ["responsible for", "Protect your own capacity"],
  "/resources/hospital-estimate-glossary": ["Professional fee", "Validity and re-estimation"],
};
for (const [path, terms] of Object.entries(focusedTools)) {
  const pageText = text(pages.get(path));
  for (const term of terms) if (!pageText.includes(term)) fail(path, `focused tool content missing: ${term}`);
  if (/Common mistake: do not send random screenshots|Detailed action list|Printable decision sheet/i.test(pageText)) fail(path, "generic resource scaffold remains");
}

if (pages.has("/treatments/transplant/bone-marrow-transplant-india")) {
  fail("/treatments/transplant/bone-marrow-transplant-india", "duplicate BMT route remains indexable");
}

const requiredTerms = {
  "/treatments/cardiac/tavr-india": ["TAVR / TAVI", "Aortic stenosis", "Vascular access"],
  "/treatments/cardiac/angioplasty-pci-india": ["IVUS", "OCT", "FFR"],
  "/treatments/cardiac/congenital-heart-surgery-india": ["Corrective repair", "Palliative operation", "Staged pathway"],
  "/treatments/oncology/colorectal-cancer-india": ["CEA"],
  "/treatments/oncology/prostate-cancer-india": ["Gleason score / Grade Group", "PSMA PET"],
  "/treatments/oncology/blood-cancer-india": ["Flow cytometry", "Cytogenetics"],
  "/treatments/oncology/bone-marrow-transplant-india": ["Haploidentical donor", "Conditioning regimen", "Protective isolation"],
  "/treatments/transplant/liver-transplant-india": ["MELD score"],
  "/treatments/spine-neurosurgery/lumbar-fusion-india": ["TLIF / PLIF", "ALIF", "LLIF"],
  "/treatments/spine-neurosurgery/cervical-spine-surgery-india": ["ACDF"],
  "/treatments/spine-neurosurgery/brain-tumour-surgery-india": ["Craniotomy", "Stereotactic biopsy"],
  "/treatments/spine-neurosurgery/deep-brain-stimulation-india": ["IPG"],
  "/treatments/ophthalmology/cataract-surgery-india": ["EDOF lens"],
  "/treatments/ophthalmology/retinal-surgery-india": ["Vitrectomy", "Membrane peel", "Scleral buckle"],
  "/treatments/ophthalmology/corneal-transplant-india": ["DALK", "DSEK / DMEK", "Penetrating keratoplasty"],
};

for (const [path, terms] of Object.entries(requiredTerms)) {
  const pageText = text(pages.get(path));
  for (const term of terms) {
    if (!pageText.includes(term)) fail(path, `plain-language term missing: ${term}`);
  }
}

console.log(JSON.stringify({ pages: pages.size, checks: "voice, leakage, structure, terminology", failures }, null, 2));
if (failures.length) process.exitCode = 1;
