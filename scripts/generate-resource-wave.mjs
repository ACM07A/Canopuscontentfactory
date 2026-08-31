import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("docs/content-engine/02_PAGE_MANIFEST.json", "utf8"));

const existing = new Set([
  "/treatments/orthopaedics/knee-replacement-india",
  "/treatments/orthopaedics/hip-replacement-india",
  "/treatments/cardiac/cabg-india",
  "/treatments/cardiac/heart-valve-surgery-india",
  "/treatments/oncology/cancer-treatment-india",
  "/treatments/oncology/breast-cancer-india",
]);

const specialtyByVertical = {
  orthopaedics: ["Orthopaedics", "ortho"],
  cardiac: ["Cardiac", "cardiac"],
  oncology: ["Oncology", "oncology"],
  transplant: ["Transplant", "transplant"],
  "spine-neurosurgery": ["Spine and Neurosurgery", "spine"],
  fertility: ["Fertility", "fertility"],
  urology: ["Urology", "urology"],
  bariatric: ["Bariatric", "bariatric"],
  ophthalmology: ["Ophthalmology", "ophthalmology"],
};

const sourceByCategory = {
  ortho: [
    ["AAOS OrthoInfo patient education", "https://orthoinfo.aaos.org/"],
    ["AAOS total knee replacement", "https://orthoinfo.aaos.org/en/treatment/total-knee-replacement/"],
    ["AAOS activities after knee replacement", "https://orthoinfo.aaos.org/en/recovery/activities-after-knee-replacement/"],
    ["AAOS knee replacement exercise guide", "https://orthoinfo.aaos.org/en/recovery/total-knee-replacement-exercise-guide/"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  cardiac: [
    ["American Heart Association", "https://www.heart.org/"],
    ["ACC/AHA/SCAI coronary revascularization guidance", "https://professional.heart.org/en/science-news/2021-acc-aha-scai-guideline-for-coronary-artery-revascularization/top-things-to-know"],
    ["AHA chronic coronary disease guidance", "https://professional.heart.org/en/science-news/2023-guideline-for-the-management-of-patients-with-chronic-coronary-disease/top-things-to-know"],
    ["NHLBI TAVR patient guide", "https://www.nhlbi.nih.gov/health/tavr"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  oncology: [
    ["NCI cancer treatment overview", "https://www.cancer.gov/about-cancer/treatment"],
    ["NCI types of cancer treatment", "https://www.cancer.gov/about-cancer/treatment/types"],
    ["NCI diagnosis and staging", "https://www.cancer.gov/about-cancer/diagnosis-staging"],
    ["NCI cancer staging", "https://www.cancer.gov/about-cancer/diagnosis-staging/staging"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  transplant: [
    ["NOTTO transplant manual", "https://www.notto.mohfw.gov.in/WriteReadData/Portal/News/848_1_NOTTO_TRANSPLANT_MANUAL-final_version.pdf"],
    ["NOTTO information for foreign citizens seeking organ transplant", "https://notto.mohfw.gov.in/WriteReadData/Portal/News/850_1_D.O._letter_dated_19.06.2024_from_Secretary__MoHFW__GoI.pdf"],
    ["NIDDK kidney transplant patient guide", "https://www.niddk.nih.gov/health-information/kidney-disease/kidney-failure/kidney-transplant"],
    ["Government of India e-Visa", "https://indianvisaonline.gov.in/visa/tvoa.html"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  spine: [
    ["American Association of Neurological Surgeons patient resources", "https://www.aans.org/patients/"],
    ["AANS minimally invasive spine surgery", "https://www.aans.org/patients/conditions-treatments/minimally-invasive-spine-surgery/"],
    ["AANS brain tumors", "https://www.aans.org/patients/conditions-treatments/brain-tumors/"],
    ["AANS deep brain stimulation", "https://www.aans.org/patients/conditions-treatments/deep-brain-stimulation/"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  fertility: [
    ["ASRM patient education", "https://www.reproductivefacts.org/"],
    ["ASRM patient education: ICSI", "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/intracytoplasmic-sperm-injection-icsi/"],
    ["ASRM patient journey: fertility preservation", "https://www.reproductivefacts.org/patient-journeys/fertility-preservation/"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  urology: [
    ["NIDDK kidney stone treatment", "https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/treatment"],
    ["AUA kidney and ureteral stone surgical management guideline", "https://www.auanet.org/guidelines-and-quality/guidelines/surgical-management-of-kidney-and-ureteral-stones"],
    ["EAU urolithiasis guideline", "https://uroweb.org/guidelines/urolithiasis/chapter/guidelines"],
    ["Mayo Clinic kidney stone diagnosis and treatment", "https://www.mayoclinic.org/diseases-conditions/kidney-stones/diagnosis-treatment/drc-20355759"],
    ["American Urological Association guideline directory", "https://www.auanet.org/guidelines-and-quality/guidelines"],
    ["AUA benign prostatic hyperplasia guideline", "https://www.auanet.org/documents/Guidelines/PDF/2023%20Guidelines/BPH%20Unabridged%2002-20-24%20Final.pdf"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  bariatric: [
    ["NIDDK types of weight-loss surgery", "https://www.niddk.nih.gov/health-information/weight-management/bariatric-surgery/types"],
    ["NIDDK bariatric surgery information", "https://www.niddk.nih.gov/health-information/weight-management/bariatric-surgery"],
    ["ASMBS patient learning center", "https://asmbs.org/patients/"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  ophthalmology: [
    ["American Academy of Ophthalmology patient resources", "https://www.aao.org/eye-health"],
    ["American Academy of Ophthalmology corneal transplant patient guide", "https://store.aao.org/media/resources/051175/051175-corneal-transplants.pdf"],
    ["AAO EyeWiki retinal detachment", "https://eyewiki.aao.org/Retinal_Detachment"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  resource: [
    ["Government of India e-Visa", "https://indianvisaonline.gov.in/visa/tvoa.html"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
  partner: [
    ["NABH Medical Value Travel Facilitator programme", "https://nabh.co/programmes/medical-value-travel-facilitator-mvtf-empanelment-programme/"],
    ["Canopus Care source register", "/docs/content-engine/09_SOURCE_REGISTER.md"],
  ],
};

const sourceOverrides = {
  "/treatments/cardiac/angioplasty-pci-india": [
    ["American Heart Association: what is a stent?", "https://www.heart.org/en/health-topics/heart-attack/treatment-of-a-heart-attack/stent"],
    ["American Heart Association: coronary angioplasty", "https://www.heart.org/-/media/files/health-topics/answers-by-heart/what-is-coronary-angioplasty.pdf"],
  ],
  "/treatments/cardiac/congenital-heart-surgery-india": [
    ["American Heart Association: congenital heart disease care and treatment", "https://www.heart.org/en/health-topics/congenital-heart-defects/care-and-treatment-for-congenital-heart-defects"],
    ["American Heart Association: preparing children for heart surgery", "https://www.heart.org/en/health-topics/congenital-heart-defects/care-and-treatment-for-congenital-heart-defects/preparing-children-for-heart-surgery"],
  ],
  "/treatments/oncology/prostate-cancer-india": [
    ["NCI prostate cancer treatment for patients", "https://www.cancer.gov/types/prostate/patient/prostate-treatment-pdq"],
    ["NCI definition of PSMA PET scan", "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/psma-pet-scan"],
  ],
  "/treatments/oncology/bone-marrow-transplant-india": [
    ["NCI stem cell transplants in cancer treatment", "https://www.cancer.gov/about-cancer/treatment/types/stem-cell-transplant"],
    ["NCI donating blood stem cells", "https://www.cancer.gov/about-cancer/treatment/types/stem-cell-transplant/donating-blood-stem-cells"],
  ],
  "/treatments/transplant/bone-marrow-transplant-india": [
    ["NCI stem cell transplants in cancer treatment", "https://www.cancer.gov/about-cancer/treatment/types/stem-cell-transplant"],
    ["NCI donating blood stem cells", "https://www.cancer.gov/about-cancer/treatment/types/stem-cell-transplant/donating-blood-stem-cells"],
  ],
  "/treatments/transplant/liver-transplant-india": [
    ["NIDDK liver transplant surgery", "https://www.niddk.nih.gov/health-information/liver-disease/liver-transplant/liver-transplant-surgery"],
    ["NIDDK living with a liver transplant", "https://www.niddk.nih.gov/health-information/liver-disease/liver-transplant/living-with-transplant"],
  ],
  "/treatments/spine-neurosurgery/cervical-spine-surgery-india": [
    ["AANS cervical spine patient guide", "https://www.aans.org/patients/conditions-treatments/cervical-spine/"],
    ["AANS minimally invasive spine surgery", "https://www.aans.org/patients/conditions-treatments/minimally-invasive-spine-surgery/"],
  ],
  "/treatments/spine-neurosurgery/brain-tumour-surgery-india": [
    ["AANS stereotactic brain biopsy", "https://www.aans.org/patients/conditions-treatments/stereotactic-brain-biopsy/"],
    ["AANS brain tumors", "https://www.aans.org/patients/conditions-treatments/brain-tumors/"],
  ],
  "/treatments/ophthalmology/cataract-surgery-india": [
    ["American Academy of Ophthalmology cataract surgery guide", "https://store.aao.org/media/resources/PEHANDOUTS/Cataract_Surgery_2020_FINAL.pdf"],
    ["AAO EyeWiki cataract overview", "https://eyewiki.aao.org/Cataract"],
    ["American Academy of Ophthalmology: what is cataract surgery?", "https://www.aao.org/eye-health/diseases/what-is-cataract-surgery"],
  ],
  "/treatments/ophthalmology/retinal-surgery-india": [
    ["AAO EyeWiki pars plana vitrectomy", "https://eyewiki.aao.org/Pars_Plana_Vitrectomy"],
    ["American Academy of Ophthalmology detached retina guide", "https://store.aao.org/media/resources/051177/051177-detached-retina.pdf"],
  ],
  "/treatments/ophthalmology/corneal-transplant-india": [
    ["American Academy of Ophthalmology corneal transplant guide", "https://store.aao.org/media/resources/051175/051175-corneal-transplants-rf1.pdf"],
    ["AAO EyeWiki DMEK guide", "https://eyewiki.aao.org/Descemet_Membrane_Endothelial_Keratoplasty"],
  ],
};

function sourcesFor(route, categoryId) {
  const categorySources = sourceByCategory[categoryId] || sourceByCategory.resource;
  const routeSources = sourceOverrides[route];
  const sources = routeSources
    ? [...routeSources, categorySources[0], categorySources.at(-1)]
    : categorySources;
  return [...new Map(sources
    .filter(([, url]) => /^https?:\/\//i.test(url || ""))
    .map((source) => [source[1], source])).values()];
}

const recordSets = {
  ortho: ["Recent X-rays or MRI if available", "Diagnosis or consultation note", "Medication and allergy list", "Prior surgery or injection records", "Mobility limitation summary", "Major medical-condition history"],
  cardiac: ["Cardiology summary", "Echo report", "ECG", "Angiogram or CT report if relevant", "Current medication list", "Recent blood tests if available"],
  oncology: ["Biopsy and pathology report", "Imaging reports and image files", "Staging workup if completed", "Prior treatment summary", "Medication list", "Tumor markers or molecular reports if relevant"],
  transplant: ["Diagnosis summary", "Recent lab reports", "Imaging and specialist notes", "Donor-related documents where relevant", "Medication list", "Prior admission or treatment records"],
  spine: ["MRI or CT reports and images", "Neurology or spine consultation note", "Symptom timeline", "Prior treatment summary", "Medication list", "Functional limitation notes"],
  fertility: ["Fertility history summary", "Prior cycle records", "Hormone and semen reports where relevant", "Ultrasound reports", "Medication list", "Age and treatment-timeline details"],
  urology: ["Non-contrast CT KUB or ultrasound report and images", "Stone size, side and location from the report", "Urine routine/culture if infection is suspected or tested", "Kidney-function blood tests if available", "Medication and allergy list, especially blood thinners", "Prior stone surgery, stent, ESWL or infection records"],
  bariatric: ["BMI and weight history", "Comorbidity summary", "Prior diet/medical treatment history", "Blood tests if available", "Medication list", "Endoscopy or imaging if already done"],
  ophthalmology: ["Eye examination notes", "OCT/scan reports if available", "Vision prescription or acuity notes", "Prior procedure records", "Medication list", "Medical-condition summary"],
  resource: ["Passport and travel document details", "Diagnosis or treatment summary", "Hospital response or estimate", "Medication list", "Companion details", "Home-doctor follow-up plan"],
  partner: ["Organization profile", "Patient segment or referral context", "Compliance requirements", "Operating countries", "Preferred communication workflow", "Escalation contact"],
};

function normalizeRoute(route) {
  return route.replace(/^\/en(?=\/)/, "").replace(/\/$/, "");
}

function articleForPage(page) {
  const route = normalizeRoute(page.route);
  const [specialty, categoryId] = specialtyByVertical[page.vertical] || ["Resource", "resource"];
  const isTool = page.type === "tool";
  const isPartner = page.type === "b2b_icp";
  const safeCategory = isTool ? "Resource" : isPartner ? "Partner" : specialty;
  const safeCategoryId = isTool ? "resource" : isPartner ? "partner" : categoryId;
  const title = page.title.replace(/\s+/g, " ").trim();
  const firstWord = title.split(" ")[0];
  const sentenceTitle = firstWord.length > 1 && firstWord === firstWord.toUpperCase()
    ? title
    : `${title.charAt(0).toLowerCase()}${title.slice(1)}`;
  const sources = sourcesFor(route, safeCategoryId);
  const summary = isPartner
    ? `${title}: a practical model for consent-led referrals, clear hospital handoffs, patient communication and accountable medical-travel coordination.`
    : isTool
      ? `${title} with a step-by-step workflow for international patients preparing records, comparing hospital responses and planning travel or follow-up.`
      : `A detailed patient guide to ${sentenceTitle}: how the treatment is evaluated, what happens during care, records to send, recovery planning, hospital questions and travel decisions.`;
  return {
    slug: route,
    title,
    type: page.type,
    specialty: safeCategory,
    categoryId: safeCategoryId,
    category: safeCategory,
    procedure: page.procedure || "",
    primaryIntent: page.primary_intent || "records + estimates + travel readiness",
    cta: page.primary_cta || (isPartner ? "Discuss partnership workflow" : "Send reports for current options"),
    description: summary,
    summary,
    quickAnswer: isPartner
      ? "Build a referral pathway patients can understand: consent before record sharing, documented responsibilities, hospital-owned clinical decisions and a complete return-home handoff."
      : isTool
        ? "Work through the checklist before paying a deposit or booking travel, then use the completed document to compare written hospital responses on the same facts."
        : `Planning for ${title.toLowerCase()} starts with a case-specific clinical review. Send current records, ask why the proposed approach fits the case, and compare the full care and follow-up plan rather than a headline package price.`,
    readTime: isPartner ? "14 min" : isTool ? "18 min" : "28 min",
    updatedAt: "2026-08-14",
    sourceCount: sources.length,
    records: recordSets[safeCategoryId] || recordSets.resource,
    sources,
  };
}

const canonical = manifest.pages
  .filter((page) => page.type === "canonical_treatment" && page.language === "en")
  .filter((page) => !(page.vertical === "transplant" && page.procedure === "bone-marrow-transplant"))
  .map(articleForPage)
  .filter((page) => !existing.has(page.slug));

const tools = manifest.pages.filter((page) => page.type === "tool" && (!page.language || page.language === "en")).map(articleForPage);
const partners = manifest.pages.filter((page) => page.type === "b2b_icp" && (!page.language || page.language === "en")).map(articleForPage).slice(0, 4);

const wave = [...canonical, ...tools, ...partners].slice(0, 45);

writeFileSync("content/generated_resource_articles.json", `${JSON.stringify(wave, null, 2)}\n`);

const ts = `import type { ResourceArticle } from './resourceArticles';

export const generatedResourceArticles: ResourceArticle[] = ${JSON.stringify(wave.map((page) => ({
  slug: page.slug,
  title: page.title,
  specialty: page.specialty,
  categoryId: page.categoryId,
  summary: page.summary,
  quickAnswer: page.quickAnswer,
  readTime: page.readTime,
  updatedAt: page.updatedAt,
  sourceCount: page.sourceCount,
  costSignal: {
    label: page.type === "b2b_icp" ? "Commercial workflow" : "Current written estimate required",
    range: page.type === "b2b_icp" ? "Not a patient package" : "Hospital-specific estimate required",
    source: page.type === "b2b_icp" ? "Partnership and facilitator-policy review" : "Source-register background plus hospital-specific written response",
    checkedAt: "2026-08-14",
    note: page.type === "b2b_icp"
      ? "Partnership pages must not imply clinical control or guaranteed lead outcomes."
      : "Generic internet ranges are not quotes. Inclusions, exclusions, devices, medicines, stay length and patient-specific findings can change the final estimate.",
  },
  records: page.records,
  sections: [
    {
      heading: page.type === "b2b_icp" ? "Who this page is for" : "When this resource is useful",
      body: page.quickAnswer,
    },
    {
      heading: page.type === "tool" ? "How to use the checklist" : "How Canopus coordinates the case",
      body: page.type === "b2b_icp"
        ? "The goal is a consent-led referral or support workflow where the patient understands who is coordinating, which hospital is reviewing the case and who owns clinical decisions."
        : "Canopus Care organizes the record set, identifies missing administrative items and routes the case only with consent. Hospital clinical teams review the medical material and provide their own plan or estimate.",
    },
    {
      heading: "What to compare before committing",
      body: "Compare the written response, records reviewed, assumptions, inclusions, exclusions, validity date, follow-up plan and travel readiness. Do not rely on unsupported package prices, outcome claims or outdated screenshots.",
    },
  ],
  faqs: [
    {
      q: page.type === "b2b_icp" ? "Does Canopus Care provide medical treatment?" : "Can Canopus Care tell me which treatment I need?",
      a: "No. Canopus Care is a facilitator. Hospitals and qualified clinicians make medical decisions after reviewing the case.",
    },
    {
      q: "Can I request more than one current response?",
      a: "Yes. With consent and a complete record set, the same case can be routed to suitable hospital teams so written responses can be compared.",
    },
  ],
  sources: page.sources.map(([label, url]) => ({ label, url })),
})), null, 2)};
`;

writeFileSync("frontend/src/content/generatedResourceArticles.ts", ts);
console.log(`Generated ${wave.length} next-wave resource articles.`);
