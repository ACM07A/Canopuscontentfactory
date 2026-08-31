import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("docs/content-engine/02_PAGE_MANIFEST.json", "utf8"));
const current = JSON.parse(readFileSync("content/generated_resource_articles.json", "utf8"));
const existing = current.filter((article) => article.type !== "corridor_treatment_candidate");
const canonicalBySlug = new Map(existing.map((article) => [article.slug, article]));

const specialtyByVertical = {
  orthopaedics: ["Orthopaedics", "ortho"],
  cardiac: ["Cardiac", "cardiac"],
  oncology: ["Oncology", "oncology"],
  transplant: ["Transplant", "transplant"],
  "spine-neurosurgery": ["Spine and Neurosurgery", "spine"],
  fertility: ["Fertility", "fertility"],
};

const defaultRecords = {
  ortho: ["Recent weight-bearing X-rays and available MRI", "Orthopaedic consultation note", "Mobility and pain summary", "Prior injection or operation records", "Current medicines and allergies", "Medical-fitness history"],
  cardiac: ["Cardiology summary", "ECG and latest echocardiogram", "Angiogram or CT images and report where relevant", "Current medicines, including blood thinners", "Recent kidney-function and blood-test results", "Previous cardiac procedure records"],
  oncology: ["Biopsy and complete pathology report", "Original imaging files and reports", "Staging and molecular reports where relevant", "Prior treatment summary with dates and doses", "Current medicines and recent blood tests", "Local oncologist contact and next scheduled treatment"],
  transplant: ["Specialist summary and current disease status", "Recent laboratory results and imaging", "Recipient and donor records where relevant", "Blood-group and compatibility information", "Infection and prior-admission history", "Current medicines and local follow-up contact"],
  spine: ["MRI or CT images and reports", "Neurology or spine consultation note", "Symptom and weakness timeline", "Prior physiotherapy, injection or surgery records", "Current medicines and allergies", "Local rehabilitation and follow-up plan"],
  fertility: ["Fertility history and previous cycle records", "Hormone, ultrasound and semen reports where relevant", "Medication and allergy list", "Infection-screening results if already completed", "Treatment calendar constraints", "Local fertility or obstetric follow-up contact"],
};

const generalSources = {
  ortho: [["AAOS OrthoInfo patient education", "https://orthoinfo.aaos.org/"]],
  cardiac: [["American Heart Association patient information", "https://www.heart.org/en/health-topics"]],
  oncology: [["US National Cancer Institute treatment information", "https://www.cancer.gov/about-cancer/treatment"]],
  transplant: [["NOTTO transplant guidance", "https://www.notto.mohfw.gov.in/"]],
  spine: [["American Association of Neurological Surgeons patient information", "https://www.aans.org/patients/"]],
  fertility: [["ASRM patient education", "https://www.reproductivefacts.org/"]],
};

const missionSources = {
  ke: ["High Commission of India, Nairobi: visa types and medical visa documents", "https://www.hcinairobi.gov.in/Visa_Types"],
  tz: ["High Commission of India, Dar es Salaam: medical visa", "https://www.hcindiatz.gov.in/medical-visa.php"],
  ng: ["Consulate General of India, Lagos: medical visa checklist", "https://www.cgilagos.gov.in/pdf/Visa_Checklist-3-2-2023.pdf"],
  ae: ["Embassy of India, Abu Dhabi: medical and medical attendant visa", "https://www.indembassyuae.gov.in/content/9.%20Medical%20%20Medical%20Attendant%20Visa.pdf"],
};

function routeFor(page) {
  return page.route.replace(/^\/en(?=\/)/, "").replace(/\/$/, "");
}

function canonicalRoute(page) {
  return `/treatments/${page.vertical}/${page.procedure}-india`;
}

function articleFor(page) {
  const [specialty, categoryId] = specialtyByVertical[page.vertical];
  const canonicalSlug = canonicalRoute(page);
  const canonical = canonicalBySlug.get(canonicalSlug);
  const sources = [
    missionSources[page.country_code],
    ["Government of India official visa portal", "https://indianvisaonline.gov.in/"],
    ...(canonical?.sources || generalSources[categoryId] || []),
  ].filter(Boolean);
  const uniqueSources = [...new Map(sources.map((source) => [source[1], source])).values()];
  const title = page.title.replace("from United Arab Emirates", "from the United Arab Emirates");
  const topic = page.title.replace(/ in India for patients from .+$/, "");
  return {
    slug: routeFor(page),
    title,
    type: page.type,
    specialty,
    categoryId,
    category: specialty,
    procedure: page.procedure,
    vertical: page.vertical,
    country: page.country,
    countryCode: page.country_code,
    language: "en",
    canonicalSlug,
    indexReady: false,
    primaryIntent: "country-specific treatment planning + records + visa + estimates + return-home care",
    cta: page.primary_cta || "Talk to a care coordinator",
    description: `A patient guide for people travelling from ${page.country} to India for ${topic.toLowerCase()}: records, hospital review, visa sources, estimates, companion preparation and follow-up.`,
    summary: `A country-specific ${topic.toLowerCase()} guide built around clinical review, current written hospital responses and a safe return-home handoff.`,
    quickAnswer: `If you are travelling from ${page.country}, begin with a clinician-reviewed record packet and a written hospital response before arranging a visa, payment or flight. The treatment plan, fitness to travel and timing must come from qualified clinicians; Canopus Care can coordinate the administrative pathway.`,
    readTime: "24 min",
    updatedAt: "2026-08-24",
    sourceCount: uniqueSources.length,
    records: canonical?.records || defaultRecords[categoryId],
    sources: uniqueSources,
  };
}

const corridorWave = manifest.pages
  .filter((page) => page.type === "corridor_treatment_candidate" && page.language === "en")
  .slice(0, 45)
  .filter((page) => !(page.vertical === "transplant" && page.procedure === "bone-marrow-transplant"))
  .map(articleFor);

writeFileSync("content/generated_resource_articles.json", `${JSON.stringify([...existing, ...corridorWave], null, 2)}\n`);
console.log(`Generated ${corridorWave.length} English corridor pages (${existing.length + corridorWave.length} generated pages total).`);
