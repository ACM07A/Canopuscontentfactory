import { generatedResourceArticles } from './generatedResourceArticles';

export type ResourceArticle = {
  slug: string;
  title: string;
  specialty: 'Orthopaedics' | 'Cardiac' | 'Oncology' | 'Transplant' | 'Spine and Neurosurgery' | 'Fertility' | 'Urology' | 'Bariatric' | 'Ophthalmology' | 'Resource' | 'Partner';
  categoryId: 'ortho' | 'cardiac' | 'oncology' | 'transplant' | 'spine' | 'fertility' | 'urology' | 'bariatric' | 'ophthalmology' | 'resource' | 'partner';
  summary: string;
  quickAnswer: string;
  readTime: string;
  updatedAt: string;
  sourceCount: number;
  costSignal: {
    label: string;
    range: string;
    source: string;
    checkedAt: string;
    note: string;
  };
  records: string[];
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
  sources: Array<{ label: string; url: string }>;
};

const flagshipResourceArticles: ResourceArticle[] = [
  {
    slug: '/treatments/orthopaedics/knee-replacement-india',
    title: 'Knee Replacement in India',
    specialty: 'Orthopaedics',
    categoryId: 'ortho',
    summary: 'A practical guide to planning knee replacement evaluation in India, including records, hospital comparisons, cost evidence and travel preparation.',
    quickAnswer: 'Knee replacement planning should start with current X-rays, prior treatment notes and a written hospital estimate. Canopus Care coordinates records and hospital responses; surgeons and hospitals decide whether a procedure is suitable.',
    readTime: '18 min',
    updatedAt: 'Not recorded',
    sourceCount: 4,
    costSignal: {
      label: 'Published reference signal',
      range: 'Hospital estimate required',
      source: 'AAOS clinical background plus hospital-published package references where current',
    checkedAt: 'Not recorded',
      note: 'Do not treat internet package prices as quotes. Implant type, room class, length of stay, investigations and patient-specific risks can change the final estimate.',
    },
    records: ['Standing knee X-rays', 'Recent blood tests if available', 'Medication list', 'Prior surgery notes', 'Fitness or cardiac clearance if already done'],
    sections: [
      { heading: 'When this resource is useful', body: 'Use this page if a clinician has already discussed severe knee arthritis, joint damage or replacement evaluation. It is not a diagnosis tool and it does not decide whether surgery is appropriate.' },
      { heading: 'How Canopus coordinates the case', body: 'We organize the record set, identify missing administrative items and route the case only with consent. Hospital clinical teams review the medical material and provide their own plan or estimate.' },
      { heading: 'Cost evidence', body: 'A useful estimate needs the hospital name, surgeon or unit, implant assumptions, inclusions, exclusions, validity period and checked date. Pages that omit these details should be treated as weak reference signals.' },
    ],
    faqs: [
      { q: 'Can Canopus tell me if I need knee replacement?', a: 'No. Canopus Care is a facilitator. Suitability and treatment decisions belong to qualified hospital clinicians.' },
      { q: 'Can I compare more than one hospital?', a: 'Yes. With consent and a complete record set, coordinator workflows can route the same case to suitable hospital teams for comparable responses.' },
    ],
    sources: [
      { label: 'AAOS OrthoInfo: Total Joint Replacement', url: 'https://orthoinfo.aaos.org/en/treatment/total-joint-replacement/' },
      { label: 'Canopus source register', url: '/docs/content-engine/09_SOURCE_REGISTER.md' },
    ],
  },
  {
    slug: '/treatments/orthopaedics/hip-replacement-india',
    title: 'Hip Replacement in India',
    specialty: 'Orthopaedics',
    categoryId: 'ortho',
    summary: 'A patient planning guide for hip replacement evaluation, record readiness, cost comparison and post-discharge travel preparation.',
    quickAnswer: 'Hip replacement planning works best when the hospital sees recent imaging, diagnosis notes, medication history and fitness information. The hospital decides clinical suitability; Canopus coordinates the case file and responses.',
    readTime: '17 min',
    updatedAt: 'Not recorded',
    sourceCount: 4,
    costSignal: {
      label: 'Published reference signal',
      range: 'Current hospital estimate required',
      source: 'Hospital-published procedure pages and clinical society background',
    checkedAt: 'Not recorded',
      note: 'Package ranges vary by implant, approach, investigations, stay length and patient condition. A patient-specific estimate is required before travel.',
    },
    records: ['Hip X-ray or MRI if available', 'Diagnosis summary', 'Medication and allergy list', 'Prior procedure notes', 'Mobility and comorbidity notes'],
    sections: [
      { heading: 'What to clarify before travel', body: 'Ask what implant is assumed, how many hospital days are included, what physiotherapy is included and whether any cardiac or anesthesia clearance is required before admission.' },
      { heading: 'Hospital comparison', body: 'Compare hospitals on evidence you can verify: official program information, written estimate assumptions, coordinator responsiveness and the clarity of exclusions.' },
      { heading: 'Return-home planning', body: 'Patients should discuss flight timing, mobility support and follow-up handoff with the treating hospital before booking travel.' },
    ],
    faqs: [
      { q: 'Are hospital pages enough to choose a surgeon?', a: 'No. Hospital pages are starting evidence. Final decisions should use a current hospital response and clinician consultation.' },
      { q: 'Does Canopus guarantee a cost?', a: 'No. The hospital issues the estimate and the final bill depends on the clinical course and written inclusions.' },
    ],
    sources: [
      { label: 'AAOS OrthoInfo: Total Hip Replacement', url: 'https://orthoinfo.aaos.org/en/treatment/total-hip-replacement/' },
      { label: 'Canopus source register', url: '/docs/content-engine/09_SOURCE_REGISTER.md' },
    ],
  },
  {
    slug: '/treatments/cardiac/cabg-india',
    title: 'CABG / Heart Bypass in India',
    specialty: 'Cardiac',
    categoryId: 'cardiac',
    summary: 'A structured guide for international patients comparing CABG evaluation in India, including reports, hospital estimates, care-team questions and travel readiness.',
    quickAnswer: 'CABG planning requires current cardiology reports and a hospital cardiac-team review. Canopus can coordinate the administrative case file and hospital responses, but clinical decisions stay with cardiologists and cardiac surgeons.',
    readTime: '21 min',
    updatedAt: 'Not recorded',
    sourceCount: 5,
    costSignal: {
      label: 'Published reference signal',
      range: 'Current hospital estimate required',
      source: 'AHA/ACC background and hospital-published package evidence where current',
    checkedAt: 'Not recorded',
      note: 'CABG estimates must specify ICU days, ward days, surgeon fee, consumables, investigations, medicines and exclusions.',
    },
    records: ['Coronary angiogram report and images', 'Echo report', 'ECG', 'Medication list', 'Cardiologist summary', 'Recent blood tests if available'],
    sections: [
      { heading: 'Records first', body: 'Hospitals usually need the angiogram details, cardiac function information and current medication list before they can respond usefully. Missing records delay comparison.' },
      { heading: 'Estimate anatomy', body: 'A cardiac estimate should separate procedure, ICU, ward stay, investigations, medications, blood products if relevant and complication exclusions.' },
      { heading: 'Facilitator boundary', body: 'Canopus does not recommend CABG, PCI or any clinical pathway. We coordinate the file and hospital response workflow.' },
    ],
    faqs: [
      { q: 'Can Canopus review my angiogram?', a: 'No. Canopus can relay records with consent. Hospital cardiac teams review clinical material.' },
      { q: 'Can I get a medical visa invitation?', a: 'The selected hospital issues any medical invitation letter. Canopus can help track that administrative step.' },
    ],
    sources: [
      { label: 'AHA patient information: Coronary artery bypass graft surgery', url: 'https://www.heart.org/' },
      { label: 'Canopus source register', url: '/docs/content-engine/09_SOURCE_REGISTER.md' },
    ],
  },
  {
    slug: '/treatments/cardiac/heart-valve-surgery-india',
    title: 'Heart Valve Surgery in India',
    specialty: 'Cardiac',
    categoryId: 'cardiac',
    summary: 'A planning resource for patients comparing valve-surgery evaluation, records, estimate assumptions and hospital responses in India.',
    quickAnswer: 'Heart valve evaluation depends on the exact valve problem, imaging, symptoms and hospital cardiac-team assessment. Canopus coordinates record readiness and response tracking; hospitals make clinical decisions.',
    readTime: '20 min',
    updatedAt: 'Not recorded',
    sourceCount: 5,
    costSignal: {
      label: 'Published reference signal',
      range: 'Procedure-specific estimate required',
      source: 'AHA/ACC background and hospital-published procedure evidence where current',
    checkedAt: 'Not recorded',
      note: 'Valve estimates depend on repair vs replacement, valve type, ICU assumptions, medicines and patient-specific findings.',
    },
    records: ['Echo report', 'Cardiology summary', 'ECG', 'Medication list', 'Prior surgery notes if any', 'Recent lab reports if available'],
    sections: [
      { heading: 'What changes the estimate', body: 'Valve type, surgical approach, ICU length, blood products, investigations and comorbidities can all change the hospital quote.' },
      { heading: 'Questions to ask', body: 'Ask whether the written estimate covers pre-op tests, ICU stay, ward stay, medicines, follow-up visit and what happens if the treatment plan changes after admission.' },
      { heading: 'Clinical responsibility', body: 'Treatment options and eligibility are decided by the hospital team. Canopus Care does not choose a procedure or present one as best without reviewed evidence.' },
    ],
    faqs: [
      { q: 'Can the estimate be final before admission?', a: 'Hospitals can provide written estimates, but final costs may change after in-person evaluation or complications.' },
      { q: 'Should I send original reports?', a: 'Send secure copies first. Keep originals for travel and hospital admission.' },
    ],
    sources: [
      { label: 'AHA heart valve disease information', url: 'https://www.heart.org/' },
      { label: 'Canopus source register', url: '/docs/content-engine/09_SOURCE_REGISTER.md' },
    ],
  },
  {
    slug: '/treatments/oncology/cancer-treatment-india',
    title: 'Cancer Treatment in India',
    specialty: 'Oncology',
    categoryId: 'oncology',
    summary: 'A facilitator-safe guide to preparing oncology records, comparing hospital responses and understanding why treatment estimates must be case-specific.',
    quickAnswer: 'Cancer care planning must be based on diagnosis, stage, pathology, imaging and a treating oncology team review. Canopus coordinates records and hospital responses; it does not interpret cancer stage or recommend treatment.',
    readTime: '25 min',
    updatedAt: 'Not recorded',
    sourceCount: 6,
    costSignal: {
      label: 'Case-specific estimate required',
      range: 'Not appropriate as a generic price',
      source: 'NCI background plus hospital-specific written estimates after review',
    checkedAt: 'Not recorded',
      note: 'Oncology costs vary materially by diagnosis, stage, tests, surgery, radiation, systemic therapy, cycles and supportive care.',
    },
    records: ['Biopsy and pathology report', 'Imaging reports and images', 'Current treatment summary', 'Medication list', 'Prior surgery or chemotherapy notes', 'Tumor marker reports if relevant'],
    sections: [
      { heading: 'Why oncology is different', body: 'Small differences in diagnosis, stage or prior treatment can change the plan. A generic price table is usually not reliable enough for decision-making.' },
      { heading: 'Hospital response workflow', body: 'The useful output is a written hospital response that states what records were reviewed, what is still missing and what estimate assumptions apply.' },
      { heading: 'Safety boundary', body: 'Canopus must not interpret stage, compare survival outcomes or suggest one therapy. Those are clinical decisions for oncology teams.' },
    ],
    faqs: [
      { q: 'Can Canopus explain my pathology report?', a: 'No. Canopus can organize and route the report. Interpretation belongs to qualified clinicians.' },
      { q: 'Can I request multiple hospital opinions?', a: 'Yes, with consent and a complete record set, the case can be routed to suitable hospital teams.' },
    ],
    sources: [
      { label: 'National Cancer Institute', url: 'https://www.cancer.gov/' },
      { label: 'Canopus source register', url: '/docs/content-engine/09_SOURCE_REGISTER.md' },
    ],
  },
  {
    slug: '/treatments/oncology/breast-cancer-india',
    title: 'Breast Cancer Treatment in India',
    specialty: 'Oncology',
    categoryId: 'oncology',
    summary: 'A record-readiness and hospital-comparison guide for international breast cancer patients considering evaluation in India.',
    quickAnswer: 'Breast cancer planning depends on pathology, receptor status, imaging, staging workup and oncology-team review. Canopus coordinates records and hospital responses; it does not recommend surgery, chemotherapy, radiation or medicines.',
    readTime: '24 min',
    updatedAt: 'Not recorded',
    sourceCount: 6,
    costSignal: {
      label: 'Case-specific estimate required',
      range: 'Current hospital estimate required',
      source: 'NCI background plus hospital-published surgical references where current',
    checkedAt: 'Not recorded',
      note: 'Costs can change with surgery type, reconstruction, chemotherapy, radiation, medicines, pathology and supportive care.',
    },
    records: ['Biopsy and histopathology', 'ER/PR/HER2 or receptor-status report if available', 'Mammogram or breast imaging', 'Staging scans if done', 'Current treatment summary', 'Medication list'],
    sections: [
      { heading: 'Record completeness matters', body: 'Hospital teams may not be able to respond meaningfully without pathology, receptor-status details and imaging. The first job is to identify gaps.' },
      { heading: 'Comparing hospitals', body: 'Compare the clarity of the response, multidisciplinary availability, estimate assumptions and what remains uncertain before travel.' },
      { heading: 'No outcome promises', body: 'No resource page should promise cure, survival or treatment success. Outcomes depend on individual clinical factors reviewed by the treating team.' },
    ],
    faqs: [
      { q: 'Can Canopus choose between mastectomy and breast-conserving surgery?', a: 'No. Those decisions belong to the oncology and surgical teams after evaluation.' },
      { q: 'Can I upload reports now?', a: 'The public page starts the intake. Secure report handling should happen inside the consented Canopus case workflow.' },
    ],
    sources: [
      { label: 'National Cancer Institute: Breast Cancer', url: 'https://www.cancer.gov/types/breast' },
      { label: 'Canopus source register', url: '/docs/content-engine/09_SOURCE_REGISTER.md' },
    ],
  },
];

export const resourceArticles: ResourceArticle[] = [
  ...flagshipResourceArticles,
  ...generatedResourceArticles,
];

export const getArticleByPath = (path: string) =>
  resourceArticles.find((article) => article.slug === path.replace(/\/$/, ''));
