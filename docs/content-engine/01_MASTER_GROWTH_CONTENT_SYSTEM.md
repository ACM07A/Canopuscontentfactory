# Canopus Care — Master Lead Generation, Medical Content, SEO & AI Search System

**Goal:** build the most useful treatment-decision resources for international patients considering India, then attach a low-friction Canopus Care coordination layer.

A page should answer: what the diagnosis/procedure means; symptoms and red flags; treatment choices; records/tests; treatment cycle; cost and cost drivers; hospitals and doctors to evaluate; how to compare plans; expected India stay; visa/travel; return-home follow-up; and the next action.

---

# 1. Design: make this the editorial wing of the Canopus product

Use the existing Canopus visual language: white/off-white clinical surfaces, restrained cobalt blue and indigo, graphite text, thin borders, rounded cards, generous space, clinically relevant imagery, visible human support, source provenance, and one obvious next action.

Desktop:

```text
12-column shell
article: ~8 columns / max readable line ~760px
sticky conversion rail: ~4 columns / 320–360px usable width
```

Article column:
- breadcrumb
- H1
- medical/editorial review row
- last updated + read time
- quick-answer card
- table of contents
- medical sections
- evidence tables and infographics
- references
- related resources

Right rail:

```text
Talk to a care coordinator

Get hospital options and a current estimate
based on your records.

Country
Treatment / diagnosis
WhatsApp
Do you have reports?  Yes / No

[Get my case reviewed]

No obligation.
Canopus coordinates the process; doctors make clinical decisions.
```

After step 1 reveal name, optional email, preferred language, secure file upload and consent. Do not lead with a 12-field form.

Mobile: inline CTA after quick answer, after cost and after hospital sections; compact sticky bottom bar `Send reports | Talk to coordinator`. Do not cover content with a giant WhatsApp bubble.

---

# 2. ICP architecture

## Patient ICP A — already diagnosed
Searches procedure + India + cost/hospital/doctor. Highest intent.
CTA: **Send your reports for current hospital options and estimates.**

## Patient ICP B — caregiver / family decision maker
Needs clarity, comparison, costs and logistics.
CTA: **Talk through the case with a care coordinator.**

## Patient ICP C — second opinion
Has an existing recommendation. Canopus may organize and route records for specialist hospital review; Canopus itself does not give the clinical opinion.

## Patient ICP D — cost planner
Needs price anatomy, inclusions/exclusions, budget, current estimate.
CTA: **Compare current treatment estimates.**

## Patient ICP E — complex/high-acuity
Oncology, transplant, complex cardiac, revision orthopaedics, paediatric cases. Needs stronger safety language, complete records, multidisciplinary review, longer-stay planning and return-home care.

## B2B ICPs
Create separate pages for:
- medical travel agents/facilitators;
- hospital international-patient teams;
- employers/insurers/government/NGO sponsors;
- referring doctors;
- non-clinical travel/patient-support partners.

Agent promise: complete case packs, missing-info detection, hospital routing, response organization, normalized estimates, next actions and human approval.

Hospital promise: cleaner inbound cases, fewer fragmented WhatsApp/email threads, structured documents/estimates, follow-up and audit trail.

---

# 3. Treatment architecture

Build condition → treatment decision → procedure → journey, not only broad speciality pages.

**Orthopaedics:** knee replacement, robotic knee, bilateral knee, hip replacement, revision joint reconstruction.  
**Cardiac:** CABG, valve repair/replacement, TAVR, PCI, congenital heart surgery, EP, heart failure/transplant evaluation.  
**Oncology:** broad cancer, breast, lung, colorectal, prostate, head/neck, gynae, blood cancer, BMT.  
**Transplant:** kidney, liver, BMT.  
**Spine/neuro:** lumbar/cervical surgery, fusion, disc replacement, brain tumour, DBS.  
**Fertility:** IVF, ICSI, fertility preservation.  
Then urology, gastro/hepatobiliary, bariatric, ophthalmology, dental, paediatric complex care, ENT/cochlear and reconstruction.

---

# 4. Geography: use corridors, not doorway pages

Unit of growth:

> origin market → India → treatment → patient intent

Examples:
- Kenya → India → knee replacement
- Tanzania → India → cancer
- Nigeria → India → CABG
- UAE → India → spine
- Oman → India → valve surgery
- Bangladesh → India → oncology

A corridor page should only be indexable when it adds meaningful localized value. Aim for at least five:
- language;
- current visa path;
- document/hospital-letter workflow;
- departure/destination logistics;
- currency/payment planning;
- companion planning;
- time-zone/contact behaviour;
- home-country follow-up;
- sponsor/insurance paperwork;
- country-specific FAQs from real leads.

If the page only changes the country name, do not index it.

---

# 5. The 18–30 minute canonical treatment page

Target roughly 3,600–6,000 useful words, but completeness matters more than word count.

Recommended sequence:

1. Breadcrumb.
2. H1: `[Treatment] in India: Cost, Hospitals, Doctors, Recovery & International Patient Guide`.
3. Trust row: real medical reviewer, editorial reviewer, last reviewed, updated, read time and sources. Never claim medical review before it happens.
4. 120–180 word quick answer.
5. Treatment-specific urgent-care box.
6. At-a-glance fact table.
7. Table of contents.
8. Symptoms and diagnosis.
9. When treatment is considered.
10. Alternatives comparison.
11. Tests/records checklist.
12. Treatment cycle timeline.
13. Hospital stay and recovery.
14. Cost reference + exact cost drivers.
15. Hospitals to evaluate with objective evidence.
16. Doctors to evaluate with current official source and checked date.
17. Hospital-plan comparison matrix.
18. Relevant India city comparison.
19. Current visa/travel process.
20. Return-home handoff.
21. How Canopus helps.
22. 8–15 FAQs based on real queries.
23. References.
24. Final CTA.

---

# 6. Conversion system

Primary: case submission / coordinator conversation.  
Secondary: WhatsApp.  
Tertiary: checklist/tool download.

Prefer:
- Get current hospital options
- Send my reports
- Compare treatment estimates
- Talk to a care coordinator
- Organize a specialist review

Avoid:
- guaranteed cure
- cheapest treatment
- best doctor guaranteed
- 100% success
- instant diagnosis

CTA placements: hero, after records checklist, after cost, after hospital comparison, final. Do not interrupt every few paragraphs.

After lead submit, show real workflow:

```text
1. We check whether the records are complete.
2. A coordinator contacts you.
3. With consent, the case can be routed to appropriate hospital teams.
4. Hospital teams make clinical decisions and provide plans/estimates.
```

Only promise response times if operations consistently meet them.

---

# 7. Cost methodology

Never invent one “India average.”

Price can change with diagnosis, procedure variant, implant/device, complexity, comorbidities, surgeon, hospital, city, ICU, stay, room, medicines, complications, oncology drug/cycle/fraction count, transplant work-up and exchange rate.

Source ladder:
1. current written Canopus hospital quotes;
2. current official hospital pricing;
3. official device/implant pricing where relevant;
4. public tariff only if applicable;
5. third-party market estimates only as clearly labelled context.

Every displayed number needs: source, checked date, what it represents, exclusions and a reminder that case-specific quotes can differ.

Use:
- `Published reference signal`
- `Canopus observed range` only after enough anonymized current data
- `Patient-specific current estimate`

Cost table fields:
hospital package, surgeon, implant/device, diagnostics, ICU, medicines/consumables, room, companion, accommodation, transport, flights, visa, rehabilitation, contingency, exclusions.

Suggested volatile-data TTL: 30–90 days.

---

# 8. Hospital and doctor evidence

Do not publish unsupported “Top 10” rankings.

Preferred labels:
- **Hospitals to evaluate**
- **Examples of Indian centres with current programs relevant to this treatment**
- **Doctors to evaluate**

Hospital database:
```yaml
hospital_name:
city:
official_url:
nabh_status:
nabh_checked_at:
specialties:
procedures:
international_patient_service:
relevant_infrastructure:
source_urls:
last_verified:
```

Doctor database:
```yaml
doctor_name:
hospital:
city:
current_title:
specialty:
procedure_tags:
official_profile:
years_experience_claim:
claim_source:
last_verified:
```

If a hospital claims a doctor has performed a certain volume, attribute it: “Medanta’s official profile states…” Do not turn hospital marketing into independent outcome evidence.

---

# 9. Keyword architecture

Map one primary intent to one canonical page. Do not stuff “all keywords” onto the page.

Knee:
- knee replacement surgery in India
- knee replacement cost in India
- total knee replacement India
- robotic knee replacement India
- knee replacement hospitals India
- knee replacement doctors India
- knee replacement recovery
- international patient knee replacement India

CABG:
- CABG surgery India
- heart bypass surgery cost India
- CABG cost India
- cardiac surgery hospital India
- heart bypass surgeon India
- CABG recovery
- CABG vs angioplasty
- off-pump CABG India

Cancer:
- cancer treatment India
- cancer treatment cost India
- cancer hospital India
- oncologist India
- chemotherapy cost India
- radiation therapy India
- cancer second opinion India
- international oncology India

Add natural conversational questions:
- How much does X cost for an international patient?
- How long should I stay in India after X?
- What reports do I send?
- What is included in a hospital quote?
- How do I compare two treatment plans?
- When can I fly?
- Which records are needed for a second opinion?

---

# 10. AI-search / AEO strategy

There is no magic AI-SEO markup.

Use:
**crawlable + authoritative + structured + answer-first + source-rich + current + genuinely useful.**

At the start of important sections, answer directly in a short paragraph, then explain.

Keep key entities explicit: condition, treatment, hospital, doctor, city, country, source, update date.

Build original information gain from Canopus operations:
- anonymized current quote ranges;
- median response times;
- common missing documents;
- clarification rounds;
- corridor non-medical spend;
- real patient questions;
- normalized plan examples;
- treatment timelines;
- paperwork checklists.

Aggregate only when privacy-safe and statistically meaningful.

---

# 11. Technical SEO

Recommended locale routes:

```text
/en/treatments/orthopaedics/knee-replacement-india/
/ar/treatments/cardiac/cabg-india/
/sw/ke/treatments/orthopaedics/knee-replacement-india/
/bn/bd/treatments/oncology/cancer-treatment-india/
```

Use separate locale URLs, self-canonicals, reciprocal `hreflang`, and `x-default`. Do not rely on IP/Accept-Language switching.

Core structured data:
- `Article` / `BlogPosting`
- `BreadcrumbList`
- `Organization`
- real `Person` reviewer
- `VideoObject` where real
- semantic `MedicalWebPage` when appropriate

No fabricated rating/review schema. FAQ markup may be semantically fine but visible Google FAQ rich results are generally restricted to well-known authoritative health/government sites.

Important content must be server-rendered or statically generated text. Do not hide the core answer inside client-only tabs.

---

# 12. Multilingual plan

Recommended initial 10:
1. English `en`
2. Arabic `ar`
3. French `fr`
4. Swahili `sw`
5. Bengali `bn`
6. Nepali `ne`
7. Sinhala `si`
8. Russian `ru`
9. Uzbek `uz`
10. Indonesian `id`

This is a launch recommendation aligned with current target regions; reorder by lead and Search Console demand.

Medical translations:
English source lock → translation → native-language edit → medical terminology QA → corridor QA → SEO adaptation → publish.

Unreviewed machine translations: `noindex,follow`.

Arabic:
```html
<html lang="ar" dir="rtl">
```
Test direction-aware controls, mixed numerals/currency and phone fields.

---

# 13. Safety rules

Canopus may say:
- hospitals may consider…
- a specialist may request…
- guidelines describe…
- this treatment is commonly used for…
- the appropriate option depends on…
- Canopus can coordinate a hospital review.

Do not say:
- you need CABG;
- this lump is cancer;
- you are eligible for transplant;
- this doctor will cure you;
- this hospital has a 99% success rate without audited evidence;
- you can safely fly after X days as a universal rule.

Transplant and fertility pages need separate current legal/compliance review. Canopus must never broker or source organs/donors.

---

# 14. Infographics

Each flagship: 4–7 useful visuals.

1. Treatment journey timeline.
2. Decision comparison (e.g. medical therapy ↔ PCI ↔ CABG) without simplistic winner labels.
3. Cost anatomy; only show proportions if verified.
4. Document checklist.
5. Recovery milestones.
6. Hospital comparison scorecard (not a clinical ranking).
7. Corridor map from origin to India city without made-up fares.

Build visuals in accessible HTML/SVG; all information should also exist as text.

---

# 15. Internal linking

Treatment page links to:
parent speciality → condition → cost → hospitals → doctors → corridor → visa → quote comparison → record checklist → recovery → related treatments.

Example:
```text
Knee osteoarthritis
        ↓
Knee replacement India
   ↙        ↓        ↘
cost    hospitals   doctors
   ↘        ↓        ↙
 Kenya / UAE / Bangladesh corridor
        ↓
hospital quote comparison
```

---

# 16. Editorial workflow

1. Query + lead research.
2. Primary-source research.
3. Draft.
4. Claim/source table.
5. Medical review.
6. Native localization.
7. SEO/CRO QA.
8. Publish.
9. Freshness/revalidation queue.

Source priority:
clinical guideline/society → government → accreditation → official hospital/clinician → peer-reviewed → high-quality secondary.

High-volatility facts: doctor roles, costs, hospital programs, visas, consultation availability.

---

# 17. Analytics / CRO

Track:
`resource_view`, `toc_interaction`, `cost_section_view`, `hospital_section_view`, `doctor_section_view`, `cta_click`, `lead_step_1_complete`, `lead_step_2_complete`, `report_upload_start`, `report_upload_complete`, `whatsapp_click`, `qualified_lead`, `hospital_route_ready`, `hospital_response_received`, `treatment_confirmed`.

Optimize for qualified cases and treatment progression, not raw form fills.

Test:
- hospital options vs coordinator CTA;
- form-first vs WhatsApp-first;
- cost CTA vs generic CTA;
- “send reports” vs “get estimate”;
- coordinator portrait;
- treatment-specific CTA.

---

# 18. Indexation quality gate

Do not index unless:
- unique intent and meaningful unique value;
- medical facts sourced;
- cost uncertainty transparent;
- hospital/doctor current source + date;
- no unsupported best/outcome claims;
- emergency language where needed;
- real medical review completed;
- localization reviewed;
- canonical/hreflang correct;
- structured data matches visible content;
- form works and consent/privacy is present;
- mobile is readable;
- references visible;
- update date is real.

---

# 19. Recommended first release

Rather than 1,000 pages:
- 10 canonical treatment guides;
- 6 corridor hubs;
- 18 highest-demand treatment × corridor pages;
- 10 tools/checklists;
- 5 B2B ICP pages.

~49 substantial pages is a stronger learning launch than mass-generated pages.

Long-term moat: a live treatment-intelligence layer built from current hospital programs, specialist roles, current estimates, quote inclusions, response turnaround, missing documents, corridor logistics, patient questions and anonymized journey data.
