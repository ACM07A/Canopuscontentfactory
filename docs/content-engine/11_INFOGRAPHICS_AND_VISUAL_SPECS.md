# Canopus Care — Infographics, Graphs & Visual Content Specifications

The goal is not decorative “medical infographics.” Every visual should reduce a real decision burden and should also have a text/table equivalent for SEO and accessibility.

# 1. Treatment Journey Timeline

**Use:** every canonical treatment page.

Desktop:
`Records → Hospital review → Consultation → Tests → Treatment → Local recovery → Return-home follow-up`

Mobile: vertical timeline.

Data schema:
```json
{
  "steps": [
    {"label":"Records","status":"information","description":"What to send"},
    {"label":"Hospital review","status":"information","description":"What the specialist checks"}
  ]
}
```

Do not put exact day counts on the generic component unless sourced for that treatment and explicitly labelled “typical / varies.”

# 2. “What changes the cost?” graph

Use an ordered horizontal influence diagram rather than an invented percentage pie chart.

Example knee:
- one vs two knees
- primary vs revision
- implant
- complexity
- robotic/navigation
- hospital/room
- medical conditions
- length of stay
- complications
- rehabilitation

Example oncology:
- cancer type/stage
- surgery complexity
- exact drug
- number of cycles
- radiation modality/fractions
- pathology/molecular testing
- hospital admissions
- complications
- total duration in India

Only use percentage shares if based on real Canopus quote data with sufficient sample size.

# 3. Hospital Quote Comparison Matrix

Rows:
- diagnosis assumed
- proposed treatment
- surgeon
- device/implant/drug
- hospital days
- ICU days
- diagnostics
- medicine/consumables
- rehab
- follow-up
- complications excluded
- quote validity
- currency
- non-medical costs

Visual treatment: white comparison cards with sticky left row labels; Canopus blue used only for selected plan/highlight, not as a “winner” score.

# 4. Records Checklist

Use a document-stack visual.

Universal:
- consultation summary
- diagnosis
- imaging
- lab results
- medication list
- previous operations
- allergies/conditions

Treatment-specific additions:
- CABG: angiogram + echo
- oncology: pathology + slides/blocks + scans + biomarker testing
- revision joint: old operation note + implant information
- transplant: donor/recipient work-up, subject to legal review

CTA directly under visual:
**“Upload what you have — we’ll organize the case.”**

# 5. Recovery Milestone Graph

Do not use a fake linear “100% recovered” chart.

Use milestone bands:
- hospital recovery
- early local recovery
- travel review
- home rehabilitation
- longer-term follow-up

Each band supports:
- earliest reasonable general window only if sourced;
- “varies by patient” label;
- required clinical clearance.

# 6. CABG decision explainer

Three-column visual:
`Medical therapy | PCI | CABG`

Under each:
- what it is
- where it happens
- what factors clinicians consider

Central banner:
**“The correct strategy depends on coronary anatomy and the patient. Heart Team review is important when the optimum strategy is unclear.”**

Never label one treatment “best.”

# 7. Oncology Treatment Map

Branching visual:
```text
Diagnosis + stage + biology
     ├── Surgery
     ├── Systemic therapy
     │      ├── Chemotherapy
     │      ├── Targeted therapy
     │      ├── Immunotherapy
     │      └── Hormone therapy
     ├── Radiation
     └── Stem-cell transplant (selected diseases)
```

Then show common sequences:
- surgery → adjuvant therapy
- neoadjuvant therapy → surgery → additional therapy
- systemic therapy → response assessment
No disease-specific recommendation in the generic graphic.

# 8. International Journey Map

Origin country → India medical city → local accommodation → hospital → local follow-up → home clinician.

Show:
- records before travel;
- visa/hospital letter;
- companion;
- arrival;
- treatment;
- travel clearance;
- handoff home.

Do not display flight prices unless fetched and timestamped.

# 9. “What is in a treatment quote?” donut alternative

Do NOT use a donut with invented proportional slices.

Use a labelled ring with equal visual segments:
- hospital
- clinical team
- device/drug
- tests
- medicines
- stay
- rehab
- non-medical travel
- exclusions

Caption:
**“These are cost categories, not proportions. Your case determines the actual mix.”**

# 10. Hospital Evaluation Scorecard

This is not a ranking score.

Rows:
- relevant speciality program
- current specialist team
- accreditation verified
- written treatment plan
- estimate completeness
- international patient support
- emergency/ICU support
- follow-up plan
- source verified date

Use check / needs clarification / not stated.

# 11. Doctor Evidence Card

No star rating.

Show:
- photo if licensed/current;
- name;
- current title;
- hospital;
- specialty;
- treatment relevance;
- official source;
- checked date;
- `View official profile`;
- `Ask this hospital about my case`.

# 12. Cost Trend Graph — future Canopus proprietary data

Only after enough anonymized cases.

Possible chart:
**Median quoted treatment range by quarter**, split by:
- treatment;
- city;
- case complexity only when consistently coded.

Display sample size `n`, date window and methodology.

Never graph tiny samples as if they represent the Indian market.

# 13. Case Completeness Funnel — proprietary information-gain visual

Future SEO moat:

```text
100 submitted cases
↓
X% missing imaging
↓
Y% missing pathology
↓
Z% ready for hospital routing
```

Only aggregate privacy-safe operational data with sufficient volume.

# 14. Visual design tokens

Match Canopus:
- surface white / #F7F8FA
- ink #111318
- primary blue #2F6BFF
- indigo #5C4DFF
- line #E6E9EF
- 16–20px card radii
- subtle 1px borders
- no large shadow
- chart labels always visible
- blue reserved for action/selection
- semantic danger/warning only for real status

# 15. Image/illustration requirements

Use treatment-relevant medical anatomy or licensed clinical imagery:
- knee joint for knee page;
- coronary anatomy for CABG;
- tumour/cell/pathology or treatment pathway for oncology;
- kidneys/liver for transplant;
- spine region for spine;
- reproductive anatomy/embryology only where clinically tasteful for IVF.

Avoid:
- random smiling-doctor stock images in every section;
- operating-room gore;
- fake AI doctor portraits;
- generic “brain with glowing AI nodes” artwork.

# 16. Accessibility

Every SVG:
- meaningful title/description;
- text equivalent below or adjacent;
- not color-only;
- contrast;
- keyboard accessibility where interactive;
- reduced-motion mode;
- responsive without horizontal clipping.
