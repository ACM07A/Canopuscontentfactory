import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mdToHtml } from "./md.mjs";

const BASE_ARTICLES = {
  "/treatments/orthopaedics/knee-replacement-india": {
    file: "content/treatments/orthopaedics/knee-replacement-india.md",
    category: "Orthopaedics",
    categoryId: "ortho",
    cta: "Send knee reports",
    description: "Detailed guide to knee replacement in India for international patients: records, costs, hospitals, recovery, travel planning and quote comparison.",
  },
  "/treatments/orthopaedics/hip-replacement-india": {
    file: "content/treatments/orthopaedics/hip-replacement-india.md",
    category: "Orthopaedics",
    categoryId: "ortho",
    cta: "Send hip reports",
    description: "Detailed guide to hip replacement in India: records, implant questions, hospital estimates, travel planning and return-home handoff.",
  },
  "/treatments/cardiac/cabg-india": {
    file: "content/treatments/cardiac/cabg-india.md",
    category: "Cardiac",
    categoryId: "cardiac",
    cta: "Send cardiac reports",
    description: "CABG and heart bypass in India guide for international patients: angiogram records, cardiac-team review, costs, hospitals, travel and recovery.",
  },
  "/treatments/cardiac/heart-valve-surgery-india": {
    file: "content/treatments/cardiac/heart-valve-surgery-india.md",
    category: "Cardiac",
    categoryId: "cardiac",
    cta: "Send valve reports",
    description: "Heart valve surgery in India guide covering repair, replacement, TAVR, cost signals, hospitals, records and international patient planning.",
  },
  "/treatments/oncology/cancer-treatment-india": {
    file: "content/treatments/oncology/cancer-treatment-india.md",
    category: "Oncology",
    categoryId: "oncology",
    cta: "Send oncology reports",
    description: "Cancer treatment in India guide for international patients: pathology, staging records, hospital review, cost evidence and safe coordinator workflow.",
  },
  "/treatments/oncology/breast-cancer-india": {
    file: "content/treatments/oncology/breast-cancer-india.md",
    category: "Oncology",
    categoryId: "oncology",
    cta: "Send breast cancer reports",
    description: "Breast cancer treatment in India guide: pathology, receptor status, imaging, hospital responses, cost factors and international patient planning.",
  },
};

function loadGeneratedArticles() {
  try {
    const raw = readFileSync(new URL("../content/generated_resource_articles.json", import.meta.url), "utf8");
    const rows = JSON.parse(raw);
    return Object.fromEntries(rows.map((row) => [row.slug, {
      generated: true,
      category: row.category,
      categoryId: row.categoryId,
      cta: row.cta,
      description: row.description,
      title: row.title,
      type: row.type,
      primaryIntent: row.primaryIntent,
      records: row.records || [],
      sources: row.sources || [],
      quickAnswer: row.quickAnswer,
      procedure: row.procedure,
      vertical: row.vertical,
      country: row.country,
      countryCode: row.countryCode,
      canonicalSlug: row.canonicalSlug,
      indexReady: row.indexReady !== false,
    }]));
  } catch {
    return {};
  }
}

const GENERATED_ARTICLES = loadGeneratedArticles();
const ARTICLES = { ...BASE_ARTICLES, ...GENERATED_ARTICLES };

const GENERATED_PROCEDURE_PROFILES = {
  "/treatments/urology/kidney-stone-surgery-india": {
    intro: "Kidney stone surgery is not one operation. The main decision is whether the stone can pass with observation and medicines, whether it should be broken from outside the body with shock wave lithotripsy, removed through a natural urinary passage with ureteroscopy or RIRS, or removed through a small back incision with percutaneous nephrolithotomy. The right discussion depends on stone size, location, hardness, obstruction, infection risk, kidney function, anatomy, symptoms, prior procedures and patient preference.",
    sections: [
      ["When kidney stones become urgent", "Severe flank pain, fever, chills, vomiting, reduced urine output, a stone in a single functioning kidney, pregnancy, uncontrolled pain, kidney-function concern or suspected infection with obstruction can make a stone episode urgent. A patient with fever and obstructing stone symptoms should not wait for overseas travel planning; they need local emergency assessment. For a stable patient, overseas planning can focus on imaging, infection screen, treatment options and estimate comparison."],
      ["What the urologist is trying to learn from imaging", "The most useful report usually states the stone side, exact location, size in millimetres, number of stones, hydronephrosis or swelling, whether the stone is in the kidney or ureter, whether there are stones on both sides and whether prior stents or surgery are present. CT can also help doctors infer density and anatomy, but the treating team decides how much that matters for the procedure choice."],
      ["Observation and medicines before surgery", "Not every stone needs immediate surgery. Small stones may pass with pain control, hydration advice and medicines chosen by a clinician. That said, public pages should not tell a patient to wait, drink excessive water or self-medicate. Waiting can be unsafe if there is infection, obstruction, uncontrolled pain, kidney impairment or only one functioning kidney."],
      ["Shock wave lithotripsy or ESWL", "Shock wave lithotripsy uses focused shock waves from outside the body to fragment selected stones so pieces can pass through the urinary tract. It may be discussed for some kidney or upper ureter stones, depending on stone size, location, density, anatomy, body habitus and local equipment. Patients should ask whether a stent is expected, how fragments will pass, what pain or bleeding is normal, when imaging follow-up is needed and what happens if fragments do not clear."],
      ["Ureteroscopy and laser lithotripsy", "Ureteroscopy passes a small scope through the urethra and bladder into the ureter and sometimes kidney. The urologist may use a laser to fragment the stone and may remove fragments with a basket. This route avoids a skin incision, but it can still require anesthesia, a temporary ureteral stent, follow-up removal and monitoring for fever, pain, bleeding or urinary symptoms."],
      ["RIRS for kidney stones", "Retrograde intrarenal surgery, often called RIRS, is a flexible ureteroscopy approach used inside the kidney. It may be discussed when the stone is in a kidney calyx or renal pelvis and the team believes a flexible scope and laser approach is suitable. Suitability depends on anatomy, stone burden, location and surgeon judgement; it is not automatically better than ESWL or PCNL."],
      ["PCNL and mini-PCNL", "Percutaneous nephrolithotomy creates a small tract through the back into the kidney so instruments can fragment and remove larger or more complex stones. Mini-PCNL uses a smaller tract in selected cases. PCNL may be discussed for large stones, staghorn stones, complex kidney stone burden or stones unlikely to clear well with less invasive options. Patients should ask about hospital stay, tube or stent use, bleeding risk, infection precautions, follow-up imaging and whether a second-look procedure may be needed."],
      ["DJ stent questions patients often forget", "A double-J ureteral stent may be placed before, during or after stone treatment to help urine drain or allow swelling to settle. Stents can cause urinary frequency, urgency, flank discomfort or blood in urine for some patients. The most important patient-facing question is practical: when and where will the stent be removed, what symptoms are expected and what symptoms require urgent care?"],
      ["Stone analysis and recurrence prevention", "After the immediate stone is treated, prevention matters. Patients should ask whether fragments can be analysed, whether blood or urine metabolic testing is needed and what diet or medicine advice should come from a clinician. Generic advice such as drinking more water is not enough for recurrent, bilateral, unusual or high-risk stone disease."],
      ["Recovery and return travel", "Recovery depends on ESWL, ureteroscopy/RIRS, PCNL, infection status, stent symptoms, pain control and follow-up imaging. Patients should avoid booking a rigid return flight until the hospital has explained expected local stay, stent plan, warning signs and follow-up. Fever, worsening pain, inability to pass urine, heavy bleeding or persistent vomiting after stone treatment should be treated as urgent clinical concerns."],
    ],
    comparison: [
      ["Small ureter stone", "Observation or ureteroscopy may be discussed depending on symptoms, obstruction, infection risk and stone features.", "Ask what makes waiting safe or unsafe in this case."],
      ["Selected kidney stone", "ESWL or ureteroscopy/RIRS may be compared depending on size, location, density and anatomy.", "Ask how fragments will clear and what follow-up imaging is planned."],
      ["Large kidney stone or staghorn stone", "PCNL or staged procedures may be discussed.", "Ask about bleeding, infection control, hospital stay and need for second-stage treatment."],
      ["Stone with suspected infection", "Drainage and antibiotics may come before definitive stone removal.", "Do not travel for elective treatment until stability and infection control are clarified by clinicians."],
      ["Recurrent stones", "Treatment should include stone clearance and prevention planning.", "Ask about stone analysis, metabolic evaluation and home-country follow-up."],
    ],
    estimateDrivers: ["stone size and number", "kidney versus ureter location", "single-stage versus staged treatment", "ESWL versus ureteroscopy/RIRS versus PCNL", "stent placement and removal plan", "infection or emergency drainage need", "anesthesia and hospital stay", "repeat imaging", "consumables such as laser fiber, access sheath, baskets or nephroscope equipment", "extra stay if pain, fever, bleeding or obstruction occurs"],
    questions: ["Is there obstruction, hydronephrosis or infection risk on the current report?", "Which procedure is being proposed and why?", "Is the goal complete stone clearance in one session or staged treatment?", "Will a DJ stent be placed, and when will it be removed?", "Will fragments be sent for stone analysis?", "What follow-up scan is needed before flying home?", "What symptoms after treatment require emergency care?", "What prevention plan should be handed to the doctor at home?"],
    sources: [
      ["NIDDK kidney stone treatment", "https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/treatment"],
      ["AUA surgical management of kidney and ureteral stones", "https://www.auanet.org/guidelines-and-quality/guidelines/surgical-management-of-kidney-and-ureteral-stones"],
      ["EAU urolithiasis guideline", "https://uroweb.org/guidelines/urolithiasis/chapter/guidelines"],
      ["Mayo Clinic kidney stones diagnosis and treatment", "https://www.mayoclinic.org/diseases-conditions/kidney-stones/diagnosis-treatment/drc-20355759"],
      ["Mayo Clinic percutaneous nephrolithotomy", "https://www.mayoclinic.org/tests-procedures/percutaneous-nephrolithotomy/about/pac-20385051"],
    ],
  },
};

function kidneyStoneSurgeryMarkdown(article) {
  const sourceLines = [
    ["NIDDK kidney stone treatment", "https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/treatment"],
    ["AUA surgical management of kidney and ureteral stones", "https://www.auanet.org/guidelines-and-quality/guidelines/surgical-management-of-kidney-and-ureteral-stones"],
    ["EAU urolithiasis guideline", "https://uroweb.org/guidelines/urolithiasis/chapter/guidelines"],
    ["Mayo Clinic kidney stones diagnosis and treatment", "https://www.mayoclinic.org/diseases-conditions/kidney-stones/diagnosis-treatment/drc-20355759"],
    ["Mayo Clinic percutaneous nephrolithotomy", "https://www.mayoclinic.org/tests-procedures/percutaneous-nephrolithotomy/about/pac-20385051"],
  ].map(([label, url]) => `- ${label}: ${url}`).join("\n");

  return `---
title: "${article.title}"
primary_keyword: "kidney stone surgery in India"
cta: "${article.cta || "Send kidney stone reports"}"
---

# Kidney Stone Surgery in India

Kidney stone surgery in India is usually planned around one practical question: **what is the safest and most effective way to clear this specific stone for this specific patient?** The answer can be very different for a small ureter stone, a large kidney stone, a staghorn stone, a stone with infection, a recurrent stone former, a patient with one functioning kidney or a patient who already has a ureteral stent.

This guide is for international patients and caregivers comparing stone treatment in India. It explains the actual procedure choices, what reports hospitals need, what changes the estimate, what happens with a DJ stent, how recovery can affect flights and what to ask before paying a deposit. Canopus Care can coordinate records and hospital responses, but urologists and hospitals make all clinical decisions.

## Quick answer

Most kidney stone treatment plans depend on stone **size, side, location, obstruction, infection risk, kidney function, stone burden, previous procedures and symptoms**. Common options include observation with clinician supervision, shock wave lithotripsy or ESWL, ureteroscopy with laser lithotripsy, RIRS for selected kidney stones, and PCNL or mini-PCNL for larger or more complex stones. A patient-specific hospital response should be based on imaging and labs, not a generic package price.

## When kidney stone symptoms are urgent

Do not treat an overseas-treatment page as emergency advice. A patient with fever, chills, severe uncontrolled flank pain, repeated vomiting, inability to pass urine, confusion, worsening weakness, known kidney-function decline, pregnancy, a single functioning kidney or stone symptoms on both sides should seek local urgent care. If a stone blocks urine flow and infection is present or suspected, definitive stone removal may need to wait until drainage and infection control are handled by local clinicians.

For medical travel, this distinction matters. A stable patient with reports can compare hospitals. An unstable patient needs immediate local assessment. Canopus Care should not route an emergency as if it were an elective package enquiry.

## What kidney stones are and why treatment differs

Kidney stones are hard deposits that form in the urinary tract. Some remain in the kidney. Some move into the ureter, the tube between the kidney and bladder. Pain often occurs when a stone blocks urine flow or irritates the ureter. Treatment differs because a stone in the lower ureter is not the same as a stone inside a kidney calyx, and a 5 mm stone is not the same planning problem as a 25 mm stone or a branching staghorn stone.

The urologist is usually trying to answer:

- Is the stone in the kidney, upper ureter, mid ureter, lower ureter or bladder?
- How large is it, and are there multiple stones?
- Is the kidney swollen from obstruction?
- Is infection present or possible?
- Is kidney function normal, reduced or unknown?
- Has the patient already had a stent, ESWL, ureteroscopy or PCNL?
- Is the goal pain relief, urgent drainage, complete clearance, recurrence prevention or second opinion?

## Reports hospitals usually need before giving a serious answer

For kidney stone surgery, the most useful record is usually the imaging report and image file. A text report alone may not be enough if the urologist needs to see exact anatomy.

- Non-contrast CT KUB report and images, if already done
- Ultrasound KUB report, especially if CT has not been done
- X-ray KUB if stone visibility is being assessed
- Urine routine and urine culture, if infection was tested
- Creatinine or kidney-function blood test, if available
- CBC and basic blood tests, if already done
- Current medicines, especially blood thinners
- Allergy list, including contrast, antibiotic or anesthesia reactions
- Prior stone analysis, if the patient has passed or removed stones before
- Prior stent, ESWL, ureteroscopy, RIRS, PCNL or open surgery records
- Discharge summaries from any emergency admission

If the patient only has pain and no imaging, hospitals may give only broad process guidance. A real estimate needs the stone details.

## How doctors decide between ESWL, ureteroscopy, RIRS and PCNL

There is no single “best kidney stone surgery.” The best procedure discussion depends on the stone and the patient. Public websites often oversimplify this into a menu. A better way is to understand the tradeoffs.

| Option | How it works | When it may be discussed | Patient questions |
| --- | --- | --- | --- |
| Observation / medical management | Pain control, hydration advice and medicines chosen by a clinician while waiting for selected stones to pass. | Smaller stones, stable patient, no infection or kidney-risk red flags. | What makes waiting safe in my case? When should I go to emergency care? |
| ESWL / shock wave lithotripsy | Shock waves from outside the body fragment selected stones so pieces can pass. | Some kidney or ureter stones depending on size, location, visibility, density and anatomy. | Will fragments pass safely? Is a stent needed? What if it fails? |
| Ureteroscopy + laser lithotripsy | A scope passes through the urinary tract; laser breaks the stone and fragments may be removed. | Many ureter stones and selected kidney stones. | Will a DJ stent be placed? When is it removed? Is this day-care or admission? |
| RIRS | Flexible ureteroscopy reaches inside the kidney; laser treats selected kidney stones. | Selected renal stones where flexible scope access is suitable. | Is RIRS better than ESWL or PCNL for my size and location? |
| PCNL / mini-PCNL | A small tract through the back into the kidney lets instruments fragment and remove larger stones. | Larger kidney stones, complex stones, staghorn stones or high stone burden. | What is the bleeding/infection plan? Will I need a tube, stent or second stage? |

## ESWL: what patients should understand

Extracorporeal shock wave lithotripsy, often shortened to ESWL or shock wave lithotripsy, is attractive because it does not usually require a scope through the urinary tract or an incision. The machine focuses shock waves on the stone to break it into smaller pieces. Those pieces must then pass through the urinary tract.

That last sentence is important. ESWL does not remove every fragment at the time of treatment. The patient may still pass fragments later, may have pain, may need follow-up imaging and may need another procedure if fragmentation or clearance is incomplete. ESWL may be less suitable for some stones because of size, location, density, anatomy, body habitus, pregnancy, bleeding risk or infection concerns. The hospital should explain why ESWL is being proposed instead of ureteroscopy or PCNL.

Ask:

- Can my stone be seen and targeted well enough for ESWL?
- What size and location make ESWL reasonable here?
- Will I need anesthesia or sedation?
- Will a stent be placed before or after ESWL?
- What symptoms are expected when fragments pass?
- When should I repeat imaging?
- What is the next step if ESWL does not clear the stone?

## Ureteroscopy and laser lithotripsy

Ureteroscopy uses a thin scope passed through the urethra and bladder into the ureter, and sometimes into the kidney. The urologist can see the stone, use a laser to break it and remove fragments with small tools. Because the route uses natural urinary passages, there is no skin incision, but it is still a real procedure with anesthesia, infection precautions, bleeding considerations and follow-up.

Many patients wake up with a DJ stent after ureteroscopy. The stent keeps the ureter open while swelling settles or fragments pass. Stents can cause urinary frequency, urgency, burning, blood in urine or flank discomfort. These symptoms are often temporary, but patients should know what is expected and what is not.

Ask:

- Is the stone in the ureter or kidney?
- Is rigid or flexible ureteroscopy planned?
- Will laser lithotripsy be used?
- Will fragments be removed or dusted?
- Will a DJ stent be placed?
- How and when will the stent be removed?
- Can I fly with the stent if needed?
- What symptoms after ureteroscopy require urgent contact?

## RIRS for kidney stones

RIRS means retrograde intrarenal surgery. It is essentially flexible ureteroscopy inside the kidney. A flexible scope goes up through the urinary tract into the kidney collecting system, and a laser treats the stone. RIRS is often marketed heavily, but it should not be presented as automatically superior. Its usefulness depends on stone size, location, anatomy, stone burden, access, equipment and surgeon judgement.

RIRS may be discussed when the stone is inside the kidney and the team believes it can be reached and treated with a flexible scope. It may avoid a back puncture, but it can still require a stent, staged treatment, follow-up imaging and management of residual fragments.

Ask:

- Why is RIRS preferred over ESWL or PCNL in my case?
- Is the stone in a lower-pole calyx or a difficult position?
- Is the goal complete extraction or dusting?
- Could more than one session be needed?
- Will an access sheath be used?
- What is the stent plan?

## PCNL and mini-PCNL

Percutaneous nephrolithotomy, or PCNL, is usually discussed for larger or more complex kidney stones. The surgeon creates a tract from the back into the kidney and uses instruments to fragment and remove the stone. Mini-PCNL uses smaller instruments in selected cases. PCNL can be very useful for large stone burden because it gives direct access for removal, but it also has specific risks that need careful explanation.

Patients should ask about bleeding risk, infection precautions, anesthesia, hospital stay, need for nephrostomy tube, DJ stent, catheter, follow-up scan and whether a second-look procedure may be needed. A staghorn stone or multiple kidney stones may not be a simple one-session package.

Ask:

- Is my stone size or shape the reason PCNL is being proposed?
- Is standard PCNL, mini-PCNL or another approach planned?
- Will there be a nephrostomy tube?
- Will there be a DJ stent?
- How will the hospital check residual fragments?
- What is the bleeding and transfusion policy?
- What happens if fever occurs after surgery?
- How many local days are needed before return travel?

## DJ stents: the part many pages do not explain

A DJ stent is a temporary tube placed between the kidney and bladder to help urine drain through the ureter. It may be placed before definitive surgery if infection, obstruction or swelling needs management. It may be placed after ureteroscopy, RIRS or PCNL. It may be removed after a few days or weeks depending on the case.

The practical issue for an international patient is not only whether a stent is used. It is **where and when the stent will be removed**. A patient should not fly home without understanding the plan. If removal is planned in India, the patient must budget time. If removal is planned at home, the patient needs a local urologist willing to do it and a clear record of stent type and placement date.

Ask:

- Is a stent expected?
- Is it temporary or part of staged treatment?
- When should it be removed?
- Can removal happen before flying home?
- What symptoms are normal with the stent?
- What symptoms suggest infection, blockage or migration?
- Who do I contact if I have fever or severe pain with the stent?

## What happens on the hospital day

The exact day differs by procedure, but a typical pathway includes identity checks, review of reports, urine/infection status review, anesthesia assessment, consent, procedure confirmation and post-procedure monitoring. If the patient is having ESWL, the day may be shorter. If ureteroscopy or RIRS is planned, anesthesia and recovery monitoring are more involved. If PCNL is planned, admission and post-operative observation may be longer.

International patients should ask whether the estimate assumes day care, one-night admission or several days. They should also ask whether pre-operative tests are included and whether any abnormal urine culture, fever, kidney-function issue or blood-thinner medicine could delay treatment.

## Recovery after kidney stone surgery

Recovery depends on the procedure and the patient. After ESWL, the patient may pass fragments and need pain guidance and follow-up imaging. After ureteroscopy or RIRS, stent symptoms may dominate recovery. After PCNL, the patient may need more time for wound care, urine monitoring, pain control and imaging.

The patient should know:

- Expected pain pattern
- Expected blood in urine
- Fever warning signs
- Medicine plan
- Activity restrictions
- Bathing or wound instructions, if relevant
- Stent removal date
- Follow-up imaging date
- When flying is reasonable
- What to do if pain returns after discharge

No page should promise a universal “fly home in X days” timeline. The treating team should clear travel based on the procedure, complications, stent plan, pain, fever risk and follow-up needs.

## Risks and complications to ask about

Kidney stone procedures are common, but not risk-free. Patients should ask about infection, fever or sepsis risk, bleeding, pain, ureter injury, residual fragments, need for repeat procedure, stent symptoms, urinary retention, kidney-function issues and anesthesia risks. PCNL has a different risk profile from ESWL or ureteroscopy, so one generic risk paragraph is not enough.

The patient should also ask what the hospital does if fever appears after the procedure. This is especially important for patients who had infection, obstruction, positive urine culture, diabetes, immune suppression or prior sepsis.

## Cost drivers for kidney stone surgery in India

Kidney stone estimates can vary widely because the phrase “kidney stone surgery” can mean very different things. The quote should specify the procedure and assumptions.

| Cost driver | Why it matters |
| --- | --- |
| ESWL vs ureteroscopy/RIRS vs PCNL | Different equipment, anesthesia, stay and consumables. |
| Stone size and number | Multiple or large stones can need longer time or staged treatment. |
| Stone location | Kidney, upper ureter, lower ureter and lower-pole stones differ in access and clearance planning. |
| Stent use | Placement and removal may be separate billing or scheduling items. |
| Infection or obstruction | Drainage, antibiotics, cultures and delayed surgery can change cost. |
| Laser fiber, baskets, access sheath, nephrostomy equipment | Consumables can materially affect the estimate. |
| Hospital stay | Day care, one-night admission and longer PCNL recovery are different budgets. |
| Follow-up imaging | X-ray, ultrasound or CT may be needed to confirm clearance. |
| Second procedure | Residual fragments or staged treatment can change the total plan. |
| Companion and hotel stay | The hospital bill is not the full travel cost. |

## What a useful hospital quote should include

A quote that only says “kidney stone package” is weak. A useful quote should state:

- Procedure proposed: ESWL, ureteroscopy, RIRS, PCNL, mini-PCNL or staged plan
- Stone details used: side, size, location and number
- Records reviewed and dates
- Whether infection testing is required
- Included investigations
- Anesthesia and OT charges
- Consumables included or excluded
- Stent placement and removal assumptions
- Hospital stay assumption
- Medicines included or excluded
- Follow-up imaging
- Complication and extra-stay exclusions
- Validity date
- What can change after in-person evaluation

## India travel planning for stone patients

Stone patients often want fast relief, but speed should not override safety. A stable patient can travel with a planned admission date, but the family should keep flexibility if infection testing, blood thinners, kidney function or fresh imaging changes the timeline.

Before booking flights, ask:

- Is this elective, urgent or emergency?
- Has infection been ruled out or treated?
- Is the hospital asking for a urine culture?
- Will the patient need admission before the procedure?
- How many days should be kept after treatment?
- Can the stent be removed before return?
- If the stent stays in, who removes it at home?
- What documents are needed for medical visa support?
- What follow-up can be done remotely?

## How Canopus Care can coordinate this case

Canopus Care can help assemble the stone record packet, ask hospitals to respond against the same imaging, compare procedure assumptions, track quote inclusions and clarify non-clinical logistics such as visa-letter process, arrival date, companion plan and return-home handoff.

Canopus Care cannot tell the patient which procedure is best, interpret CT images, decide whether a stone is infected, prescribe antibiotics, clear the patient for flying or guarantee a final price. Those decisions belong to qualified clinicians and hospitals.

## Patient-ready checklist before contacting hospitals

- I know whether the stone is left, right or both sides.
- I have the latest CT/ultrasound report.
- I can share image files if the hospital asks.
- I know the stone size and location from the report.
- I know whether hydronephrosis or obstruction is mentioned.
- I know whether fever or infection has occurred.
- I have urine test/culture reports if done.
- I have kidney-function blood tests if done.
- I know whether a stent is already present.
- I have prior procedure records if any.
- I have a current medicine and allergy list.
- I know my preferred travel window but have not booked rigid flights.

## FAQ

### Which kidney stone surgery is best?

There is no universal best procedure. ESWL, ureteroscopy, RIRS and PCNL solve different stone problems. The urologist should explain the recommendation using stone size, location, number, obstruction, infection risk, anatomy and patient factors.

### Is RIRS better than PCNL?

Not automatically. RIRS may be suitable for selected kidney stones and avoids a back tract, but PCNL may be more appropriate for larger or complex stones. The right question is why one approach is being proposed for this stone.

### Will I need a stent?

Possibly. Stents are common around ureteroscopy, RIRS and PCNL, but not every patient has the same plan. Ask whether a stent is expected, when it will be removed and whether removal happens in India or at home.

### Can I fly after kidney stone surgery?

Only the treating team can clear travel. Flight timing depends on procedure type, pain, bleeding, fever risk, stent plan, kidney function and follow-up imaging.

### Can I get a quote before sending reports?

You may get a rough process answer, but a serious quote needs imaging and basic clinical details. Stone size and location can completely change the procedure and cost.

### What if I already have a DJ stent?

Send the stent placement note, date, reason for stent, current symptoms and any planned removal date. A forgotten stent can create serious problems, so the removal or exchange plan must be clear.

### What if my urine culture is positive?

The urologist may treat infection or drain obstruction before definitive stone treatment. Do not treat this as a simple elective travel booking until clinicians clarify safety.

# Sources

${sourceLines}
`;
}

const SPECIFIC_TREATMENT_PAGES = {
  "/treatments/orthopaedics/robotic-knee-replacement-india": {
    topic: "robotic knee replacement", family: "orthopaedic", patient: "patients with advanced knee arthritis comparing conventional and robotic-assisted planning",
    actual: ["Robotic knee replacement is not a robot operating alone. The surgeon remains responsible for planning, bone preparation, implant positioning and soft-tissue balance; robotic or navigation systems assist with mapping, alignment and execution depending on the platform.", "The patient still needs the same core assessment as any knee replacement: standing X-rays, deformity assessment, pain/function history, medical fitness, implant discussion and rehabilitation planning.", "Useful comparison questions are whether the hospital uses CT-based or image-free planning, whether robotics changes implant cost, whether the same surgeon offers non-robotic surgery, and whether the quote separates robotic-system charges."],
    options: ["non-surgical arthritis care", "standard total knee replacement", "robotic-assisted total knee replacement", "partial knee replacement in selected cases", "staged bilateral surgery if both knees are affected"],
    records: ["standing AP/lateral/skyline knee X-rays", "long-leg alignment film if available", "arthritis diagnosis note", "walking distance and stair limitation", "prior injection or arthroscopy records", "medicine and fitness summary"],
    drivers: ["robotic platform fee", "implant brand and bearing", "unilateral vs bilateral", "CT planning if used", "room category", "physiotherapy and stay length", "medical-clearance needs"],
    questions: ["What robotic platform is used?", "Is CT required before surgery?", "What implant is quoted?", "Does robotics change recovery instructions?", "What happens if robotic assistance cannot be used intra-operatively?"],
  },
  "/treatments/orthopaedics/bilateral-knee-replacement-india": {
    topic: "bilateral knee replacement", family: "orthopaedic", patient: "patients with severe arthritis in both knees deciding between same-admission and staged surgery",
    actual: ["Bilateral knee replacement means both knees need a plan, but it does not always mean both knees should be operated in one sitting. The major decision is same-stage versus staged replacement.", "Same-stage surgery may reduce total travel episodes for selected patients, while staged surgery may reduce physiological stress and simplify recovery for others. That decision depends on age, heart/lung status, anemia risk, diabetes, mobility, home support and surgeon/anesthesia review.", "International patients must plan walker use, stairs, bathroom access, hotel recovery and return travel more carefully because both legs are recovering."],
    options: ["staged knee replacement", "same-admission bilateral knee replacement", "one knee now and second later", "continued injections/physiotherapy if surgery is not yet appropriate"],
    records: ["both-knee standing X-rays", "fitness/cardiology notes", "hemoglobin and diabetes status if available", "walking support needs", "home/hotel accessibility needs", "prior knee procedures"],
    drivers: ["one-stage vs staged plan", "two implants", "ICU or monitored-care need", "blood-management plan", "physiotherapy intensity", "longer hotel stay", "companion support"],
    questions: ["Why same-stage or staged?", "What fitness tests are required?", "How many local days are needed?", "What walking aid is expected?", "What blood-clot prevention plan is used?"],
  },
  "/treatments/orthopaedics/revision-joint-replacement-india": {
    topic: "revision joint replacement", family: "orthopaedic", patient: "patients with a painful, loose, infected, unstable or failed previous hip or knee implant",
    actual: ["Revision joint replacement is more complex than first-time replacement. The surgeon must understand why the existing implant is failing: loosening, wear, infection, instability, fracture, malalignment, stiffness, bone loss or persistent unexplained pain.", "The hospital may need old operative notes, implant stickers, serial X-rays, infection workup and sometimes aspiration results before giving a useful plan. A generic package price is especially weak for revision surgery.", "Patients should expect uncertainty until the surgeon reviews imaging and infection risk. Some revisions require special implants, augments, bone graft, staged infection surgery or longer rehabilitation."],
    options: ["non-operative pain workup", "single-stage revision", "two-stage revision for selected infections", "liner or component exchange", "complex reconstruction with revision implants"],
    records: ["old operative note", "implant sticker/card", "serial X-rays", "ESR/CRP or infection tests if done", "joint aspiration report if done", "discharge summaries and culture reports"],
    drivers: ["reason for failure", "infection status", "bone loss", "revision implant system", "need for staged surgery", "ICU/ward stay", "cultures and antibiotics"],
    questions: ["Has infection been ruled out?", "Is this one-stage or two-stage?", "What revision implant is assumed?", "What records are missing?", "What follow-up is needed at home?"],
  },
  "/treatments/cardiac/tavr-india": {
    topic: "TAVR / TAVI", family: "cardiac", patient: "patients with aortic valve stenosis being evaluated for transcatheter valve replacement",
    actual: ["TAVR, also called TAVI, is a transcatheter aortic valve procedure for selected patients. It is not a simple substitute for every open valve surgery case.", "A valve team usually reviews echo severity, symptoms, CT anatomy, vascular access, surgical risk, frailty, coronary disease, kidney function and lifetime valve strategy.", "The biggest quote driver is often the transcatheter valve/device and the evaluation package. Patients need a written valve-team response, not just a device price."],
    options: ["medical monitoring", "surgical aortic valve replacement", "TAVR/TAVI", "balloon valvuloplasty in limited bridging contexts", "combined coronary and valve planning"],
    records: ["latest echocardiogram", "CT TAVR protocol if done", "coronary angiogram/CT if done", "ECG", "kidney function", "current medicines and anticoagulants"],
    drivers: ["valve device", "CT and cath evaluation", "vascular access complexity", "ICU/monitored stay", "pacemaker risk", "coronary work if needed", "kidney-protection planning"],
    questions: ["Why TAVR instead of surgery?", "Which valve/device is quoted?", "Is CT anatomy suitable?", "What is the pacemaker plan?", "What antiplatelet/anticoagulation plan is expected?"],
  },
  "/treatments/cardiac/angioplasty-pci-india": {
    topic: "angioplasty / PCI", family: "cardiac", patient: "patients comparing stent-based treatment after angiogram or CT coronary findings",
    actual: ["PCI opens selected narrowed coronary arteries using balloons and stents. It is planned from coronary anatomy, symptoms, heart function, diabetes/kidney status, urgency and whether CABG or medicines are better options.", "The quote must state the expected number of stents, stent type, cath lab charges, ICU/room assumption, medicines and whether extra stents change cost.", "For unstable chest pain, heart attack symptoms or breathlessness, local emergency care comes before overseas comparison."],
    options: ["optimized medical therapy", "PCI with drug-eluting stent", "staged PCI", "CABG evaluation", "urgent local cardiac care"],
    records: ["coronary angiogram images and report", "echo", "ECG", "troponin/ACS records if relevant", "medication list", "diabetes/kidney history"],
    drivers: ["number of stents", "complex lesions", "IVUS/OCT/FFR if used", "ICU/ward stay", "blood thinners", "kidney-risk precautions", "emergency vs planned admission"],
    questions: ["How many stents are assumed?", "Is CABG also being considered?", "Will IVUS/OCT/FFR be used?", "What medicines are needed after PCI?", "Can follow-up happen at home?"],
  },
  "/treatments/cardiac/congenital-heart-surgery-india": {
    topic: "congenital heart surgery", family: "cardiac", patient: "children or adults with structural heart conditions present from birth",
    actual: ["Congenital heart care is not one procedure. It can involve pediatric cardiology, adult congenital cardiology, cardiac surgery, cath-lab intervention, ICU planning, growth/nutrition assessment and long-term follow-up.", "Reports must define the anatomy clearly. Echo, CT/MRI, cath data and previous operation notes matter more than a generic diagnosis label.", "Families should ask whether the case is corrective, palliative, staged, re-operation or catheter-based, and what ICU, blood, ventilation and follow-up assumptions are included."],
    options: ["monitoring", "catheter-based closure/intervention", "open repair", "staged palliation", "re-operation after childhood surgery"],
    records: ["echo report and images", "CT/MRI/cath reports", "previous surgery notes", "oxygen saturation and symptoms", "growth/weight details for children", "medicine list"],
    drivers: ["complexity of anatomy", "age/weight", "ICU days", "blood products", "catheter vs surgery", "re-operation complexity", "ventilation and infection risk"],
    questions: ["What exact anatomy is being treated?", "Is this repair or palliation?", "How many ICU days are assumed?", "What long-term follow-up is needed?", "Who handles pediatric/adult congenital care?"],
  },
  "/treatments/oncology/lung-cancer-india": {
    topic: "lung cancer treatment", family: "oncology", patient: "patients with suspected or confirmed lung cancer comparing staging, biopsy review and treatment sequencing",
    actual: ["Lung cancer planning depends on tissue diagnosis, cancer type, stage, molecular markers, performance status and lung/heart fitness. Surgery, radiation, chemotherapy, immunotherapy and targeted therapy may be sequenced differently.", "Hospitals usually need pathology, imaging and prior treatment records before they can respond. A generic cost for lung cancer is not meaningful without stage and treatment intent.", "Patients should ask whether the first step is diagnosis confirmation, staging, molecular testing, surgery review, radiation planning or systemic therapy."],
    options: ["biopsy/pathology review", "surgery for selected early-stage cases", "radiation or chemoradiation", "targeted therapy if markers support it", "immunotherapy/chemotherapy", "palliative/supportive care"],
    records: ["biopsy/pathology", "CT chest/abdomen", "PET-CT if done", "brain MRI if done", "molecular marker reports", "pulmonary function tests if surgery considered"],
    drivers: ["stage", "histology", "molecular tests", "surgery vs radiation vs medicines", "drug regimen and cycles", "ICU/ward need", "repeat imaging"],
    questions: ["Is diagnosis confirmed?", "What stage is assumed?", "Are molecular markers available?", "Is surgery realistic?", "What treatment intent is being discussed?"],
  },
  "/treatments/oncology/colorectal-cancer-india": {
    topic: "colorectal cancer treatment", family: "oncology", patient: "patients comparing colon or rectal cancer surgery, chemotherapy, radiation and staging review",
    actual: ["Colon and rectal cancer pathways differ. Rectal cancer may require pelvic MRI and discussion of radiation/chemotherapy before surgery, while colon cancer planning often centers on surgery and pathology-based chemotherapy decisions.", "A hospital needs colonoscopy/biopsy, CT or MRI staging, CEA if done and prior treatment summaries. If an obstruction or bleeding is severe, local urgent care may be needed before travel.", "Patients should ask whether the plan is curative-intent, neoadjuvant therapy, surgery-first, stoma-involving or palliative/supportive."],
    options: ["surgery", "neoadjuvant chemoradiation for selected rectal cancer", "chemotherapy", "targeted therapy in selected cases", "stoma planning", "supportive care"],
    records: ["colonoscopy report", "biopsy/pathology", "CT chest/abdomen/pelvis", "MRI pelvis for rectal cancer if done", "CEA", "prior surgery/chemo/radiation notes"],
    drivers: ["colon vs rectal site", "stage", "lap/open/robotic surgery", "stoma need", "radiation sessions", "chemo regimen/cycles", "ICU/ward stay"],
    questions: ["Is it colon or rectal cancer?", "Is MRI pelvis needed?", "Will a stoma be needed?", "What is included in surgery package?", "Can chemo continue at home?"],
  },
  "/treatments/oncology/prostate-cancer-india": {
    topic: "prostate cancer treatment", family: "oncology/urology", patient: "men comparing prostate cancer staging, surgery, radiation and active surveillance discussions",
    actual: ["Prostate cancer planning depends on PSA, biopsy grade group/Gleason score, MRI, PSMA PET or staging scans where relevant, urinary symptoms, age, fitness and patient priorities.", "Some patients need active surveillance discussion, not immediate treatment. Others compare robotic prostatectomy, radiation, hormone therapy or systemic treatment.", "The page should not frame surgery as automatically best. Patients should compare cancer control discussion, urinary/sexual side-effect counselling and follow-up feasibility."],
    options: ["active surveillance in selected cases", "robotic/open prostatectomy", "radiation therapy", "hormone therapy", "systemic therapy for advanced disease"],
    records: ["PSA timeline", "biopsy report", "MRI prostate", "PSMA PET/CT if done", "urinary symptom score if available", "prior treatment notes"],
    drivers: ["risk group", "robotic surgery vs radiation", "hospital stay", "nerve-sparing feasibility", "radiation fractions", "hormone/medicine duration", "follow-up PSA plan"],
    questions: ["What risk group is assumed?", "Is active surveillance an option?", "What side effects should I understand?", "What follow-up PSA schedule is needed?", "Can follow-up happen at home?"],
  },
  "/treatments/oncology/head-neck-cancer-india": {
    topic: "head and neck cancer treatment", family: "oncology", patient: "patients with oral, throat, larynx, thyroid-region or other head-neck tumors needing multidisciplinary planning",
    actual: ["Head and neck cancer planning often involves surgical oncology, radiation oncology, medical oncology, dental/nutrition support, speech/swallowing assessment and reconstruction planning.", "Treatment may affect speech, swallowing, appearance, airway and nutrition. A useful hospital response must go beyond price and explain sequence, reconstruction, feeding-tube/tracheostomy possibility and rehabilitation.", "Patients should send biopsy, imaging, endoscopy notes and prior treatment details before comparing hospitals."],
    options: ["surgery with or without reconstruction", "radiation", "chemoradiation", "systemic therapy", "airway/nutrition support", "rehabilitation"],
    records: ["biopsy/pathology", "MRI/CT/PET reports and images", "endoscopy notes", "dental/nutrition notes if available", "prior surgery/radiation records", "swallowing/speech concerns"],
    drivers: ["tumor site/stage", "reconstruction need", "ICU/airway support", "radiation fractions", "chemo regimen", "feeding tube/tracheostomy", "rehab needs"],
    questions: ["Will reconstruction be needed?", "Could speech/swallowing be affected?", "Is radiation before or after surgery?", "What airway/nutrition support is planned?", "What follow-up is needed?"],
  },
  "/treatments/oncology/blood-cancer-india": {
    topic: "blood cancer treatment", family: "hemato-oncology", patient: "patients with leukemia, lymphoma, myeloma or related blood cancers comparing specialist review",
    actual: ["Blood cancer treatment is highly diagnosis-specific. Leukemia, lymphoma and myeloma have different tests, urgency, admission needs, chemotherapy/immunotherapy choices and transplant discussions.", "Hospitals need biopsy or marrow reports, flow cytometry, cytogenetics/molecular tests, PET/CT where relevant, blood counts and prior treatment summaries.", "Some blood cancers require urgent inpatient care; others allow planned second opinion. Travel should be cleared by clinicians, especially if blood counts are low or infection risk is high."],
    options: ["diagnosis confirmation", "chemotherapy", "immunotherapy/targeted therapy", "radiation in selected lymphoma contexts", "stem-cell transplant evaluation", "supportive transfusion/infection care"],
    records: ["CBC trend", "bone marrow report", "flow cytometry", "cytogenetic/molecular tests", "PET/CT if lymphoma", "prior chemo summaries"],
    drivers: ["exact diagnosis", "inpatient vs day-care treatment", "drug regimen", "transfusion/supportive care", "infection management", "transplant workup", "cycle count"],
    questions: ["What exact subtype is assumed?", "Is admission required?", "Are molecular tests complete?", "Is transplant being discussed?", "Can cycles continue at home?"],
  },
  "/treatments/oncology/bone-marrow-transplant-india": {
    topic: "bone marrow / stem cell transplant", family: "hemato-oncology", patient: "patients comparing autologous or allogeneic transplant evaluation",
    actual: ["Stem-cell transplant planning depends on diagnosis, disease status, prior therapy, donor availability, organ fitness, infection status and whether the transplant is autologous or allogeneic.", "The estimate must separate workup, mobilization/collection, conditioning, transplant admission, blood products, medicines, infection management, donor testing and follow-up.", "Patients should understand that transplant requires prolonged monitoring and cannot be planned like a short procedure trip."],
    options: ["autologous transplant", "matched sibling/allogeneic transplant", "haploidentical transplant", "continued non-transplant therapy", "supportive care"],
    records: ["diagnosis and remission status", "marrow/PET reports", "prior chemo details", "HLA/donor details if available", "infection history", "heart/lung/kidney fitness"],
    drivers: ["auto vs allo", "donor type", "conditioning regimen", "isolation stay", "blood products", "infection/ICU risk", "post-transplant medicines", "local stay duration"],
    questions: ["Is transplant indicated now?", "Auto or allo?", "What donor is assumed?", "How long must I stay near hospital?", "What follow-up happens after return?"],
  },
  "/treatments/transplant/kidney-transplant-india": {
    topic: "kidney transplant", family: "transplant", patient: "patients and living donors exploring legally compliant kidney transplant evaluation",
    actual: ["Kidney transplant is not a package enquiry. It requires medical suitability, donor evaluation, legal authorization, ethics documentation and long-term follow-up.", "International patients must understand that Indian transplant law and hospital authorization processes control eligibility. A facilitator cannot bypass documentation, donor relationship rules or committee approval.", "The patient and donor both need evaluation; the donor's safety and independent consent are central."],
    options: ["dialysis planning", "living-donor transplant evaluation", "deceased donor options in home country", "second opinion", "post-transplant follow-up planning"],
    records: ["recipient nephrology summary", "dialysis records", "blood group", "donor relationship documents", "donor medical summary", "previous transplant/immunology records"],
    drivers: ["recipient fitness", "donor workup", "legal authorization", "immunology tests", "ICU/ward stay", "immunosuppressive medicines", "complications/rejection/infection management"],
    questions: ["Is the donor legally eligible?", "What authorization documents are required?", "What donor-protection process is used?", "What medicines are needed lifelong?", "Who follows the patient at home?"],
  },
  "/treatments/transplant/liver-transplant-india": {
    topic: "liver transplant", family: "transplant", patient: "patients with advanced liver disease or liver cancer being evaluated for transplant",
    actual: ["Liver transplant evaluation is complex and time-sensitive. It involves liver severity, cancer criteria where relevant, infection risk, nutrition, heart/lung fitness, donor suitability and legal authorization for living donation.", "A public estimate is not enough. Hospitals need recent labs, imaging, endoscopy, MELD-related data, complications history and donor details if living donor transplant is being considered.", "Patients with bleeding, confusion, severe infection, kidney failure or ICU-level illness may not be safe for routine travel planning."],
    options: ["medical management", "living-donor transplant evaluation", "bridging cancer therapy in selected cases", "ICU stabilization", "palliative/supportive care where transplant is not suitable"],
    records: ["liver diagnosis summary", "recent LFT/INR/creatinine/sodium", "CT/MRI liver", "endoscopy/bleeding history", "ascites/encephalopathy history", "donor details if any"],
    drivers: ["recipient severity", "donor surgery", "ICU stay", "blood products", "infection risk", "renal support", "post-transplant medicines", "long local stay"],
    questions: ["Is transplant medically suitable?", "Is a living donor legally and medically suitable?", "What urgent risks exist?", "How long must patient and donor stay?", "What follow-up is required?"],
  },
  "/treatments/transplant/bone-marrow-transplant-india": {
    topic: "bone marrow transplant", family: "transplant", patient: "patients needing transplant evaluation for blood cancers or marrow disorders",
    actual: ["Bone marrow transplant, also called a stem-cell transplant, is a specialist haematology and oncology pathway. The key split is autologous transplant, using your own collected cells, and allogeneic transplant, using cells from a matched or partially matched donor.", "A useful specialist response needs the diagnosis, current disease status, prior therapy, donor and HLA information where relevant, and infection and organ-fitness assessment.", "You should expect an extended local stay and carefully planned post-discharge monitoring, not a short surgical trip."],
    options: ["autologous transplant", "allogeneic transplant", "non-transplant systemic therapy", "donor search/evaluation", "supportive care"],
    records: ["diagnosis subtype", "latest marrow/PET status", "prior treatment lines", "HLA/donor records", "infection history", "organ fitness tests"],
    drivers: ["transplant type", "donor source", "conditioning intensity", "isolation stay", "blood products", "infection management", "post-transplant medicines"],
    questions: ["What transplant type is proposed?", "Is disease controlled enough?", "Who is donor?", "How long near hospital?", "What home follow-up is mandatory?"],
  },
};

Object.assign(SPECIFIC_TREATMENT_PAGES, {
  "/treatments/spine-neurosurgery/spine-surgery-india": {
    topic: "spine surgery", family: "spine/neurosurgery", patient: "patients with disc, stenosis, deformity, tumor, trauma or nerve-compression reports comparing spine opinions",
    actual: ["Spine surgery is a category, not one operation. The plan may involve decompression, fusion, disc surgery, deformity correction, tumor surgery or non-surgical care.", "The surgeon needs MRI/CT images, neurological symptoms, weakness/numbness pattern, walking tolerance, bladder/bowel symptoms and prior treatment details.", "Red flags such as new bladder/bowel dysfunction, progressive weakness or suspected infection/tumor need urgent local assessment."],
    options: ["physiotherapy/pain care", "microdiscectomy", "decompression", "fusion", "deformity correction", "tumor/infection surgery"],
    records: ["MRI spine images/report", "CT/X-rays if done", "neurology exam notes", "pain/weakness timeline", "prior injections/surgery", "medicine list"],
    drivers: ["spinal level count", "decompression vs fusion", "implants/screws/cages", "navigation/neuromonitoring", "ICU need", "rehab and stay length", "revision complexity"],
    questions: ["What diagnosis is being treated?", "Why surgery now?", "What levels are included?", "Will implants be used?", "What neurological recovery is uncertain?"],
  },
  "/treatments/spine-neurosurgery/lumbar-fusion-india": {
    topic: "lumbar fusion", family: "spine", patient: "patients with lumbar instability, spondylolisthesis, deformity or recurrent nerve compression being evaluated for fusion",
    actual: ["Lumbar fusion joins selected vertebrae to reduce painful motion or stabilize the spine. It is different from a simple disc decompression.", "Patients should ask which levels are being fused, why fusion is needed, whether decompression alone is an option and what implants are included.", "Recovery includes wound care, walking progression, lifting restrictions and follow-up imaging; international travel should be planned around surgeon clearance."],
    options: ["non-surgical care", "decompression alone", "TLIF/PLIF/ALIF/LLIF fusion approaches", "revision fusion", "staged deformity correction"],
    records: ["lumbar MRI", "standing flexion-extension X-rays if done", "CT if done", "leg pain/weakness map", "prior injections/surgery", "fitness notes"],
    drivers: ["number of levels", "approach", "screws/rods/cages", "bone graft/substitute", "navigation/neuromonitoring", "hospital stay", "revision status"],
    questions: ["Which levels are fused?", "Why not decompression alone?", "What implant system is quoted?", "What restrictions after surgery?", "When can I fly?"],
  },
  "/treatments/spine-neurosurgery/cervical-spine-surgery-india": {
    topic: "cervical spine surgery", family: "spine", patient: "patients with neck disc disease, cervical myelopathy, radiculopathy or instability",
    actual: ["Cervical spine surgery may aim to relieve nerve-root compression, protect the spinal cord or stabilize the neck. Myelopathy symptoms such as hand clumsiness, walking imbalance or progressive weakness need careful review.", "Procedure choices may include ACDF, disc replacement, posterior decompression, fusion or complex revision.", "Patients should ask about spinal-cord risk, collar use, swallowing/voice symptoms, implant assumptions and follow-up imaging."],
    options: ["conservative care", "ACDF", "cervical disc replacement", "posterior decompression", "posterior fusion", "revision surgery"],
    records: ["cervical MRI", "dynamic X-rays if done", "neurology findings", "hand/walking symptoms", "prior surgery records", "medicine list"],
    drivers: ["number of levels", "disc replacement vs fusion", "plate/cage implants", "neuromonitoring", "anterior vs posterior approach", "ICU/ward stay"],
    questions: ["Is there myelopathy?", "Which levels are treated?", "Fusion or disc replacement?", "Will I need a collar?", "What warning symptoms are urgent?"],
  },
  "/treatments/spine-neurosurgery/brain-tumour-surgery-india": {
    topic: "brain tumour surgery", family: "neurosurgery", patient: "patients with brain mass imaging seeking neurosurgical opinion and treatment planning",
    actual: ["Brain tumor surgery planning depends on tumor location, size, symptoms, edema, seizures, relation to speech/motor/vision areas, imaging characteristics and whether biopsy, maximal safe resection or non-surgical treatment is being discussed.", "A hospital needs MRI brain with contrast images, neurology/neurosurgery notes and medication details such as steroids or anti-seizure medicines.", "Urgent symptoms such as worsening drowsiness, seizures, severe headache with vomiting or new weakness need local emergency care."],
    options: ["observation for selected lesions", "stereotactic biopsy", "craniotomy/resection", "awake mapping in selected cases", "radiation/oncology planning", "supportive care"],
    records: ["MRI brain with contrast", "CT if emergency", "neurology symptoms", "seizure history", "current steroids/anti-seizure medicines", "prior pathology if any"],
    drivers: ["tumor location", "mapping/navigation", "ICU days", "pathology/molecular tests", "radiation/oncology needs", "seizure/edema management", "rehab"],
    questions: ["Biopsy or resection?", "What neurological function is at risk?", "Is awake mapping needed?", "What pathology tests are included?", "What follow-up treatment may be needed?"],
  },
  "/treatments/spine-neurosurgery/deep-brain-stimulation-india": {
    topic: "deep brain stimulation", family: "functional neurosurgery", patient: "patients with Parkinson's disease, tremor or selected movement disorders evaluating DBS",
    actual: ["DBS places electrodes in targeted brain areas and connects them to an implanted pulse generator. It is not a cure; it aims to improve selected symptoms in carefully evaluated patients.", "Good DBS evaluation includes diagnosis confirmation, medication response, neuropsychology/psychiatric screening, MRI suitability, target selection and programming follow-up.", "International patients must plan post-operative programming. The device is not finished at implantation."],
    options: ["medicine optimization", "DBS evaluation", "focused ultrasound in selected contexts", "rehabilitation/supportive care", "device programming follow-up"],
    records: ["movement-disorder diagnosis", "medicine response history", "neurologist notes", "MRI brain", "cognitive/psychiatric history", "prior treatments"],
    drivers: ["device brand/model", "single vs bilateral leads", "rechargeable vs non-rechargeable IPG", "programming visits", "hospital stay", "imaging/navigation"],
    questions: ["Am I a DBS candidate?", "Which symptoms may improve?", "Which device is quoted?", "How many programming visits?", "Who programs it at home?"],
  },
  "/treatments/fertility/ivf-india": {
    topic: "IVF", family: "fertility", patient: "couples or individuals comparing IVF evaluation and cycle planning in India",
    actual: ["IVF involves ovarian stimulation, monitoring, egg retrieval, fertilization, embryo culture and embryo transfer or freezing. The plan depends on age, ovarian reserve, semen parameters, uterine factors, prior cycles and legal or ethical eligibility.", "You should not compare IVF by headline cycle price alone. Medicines, monitoring, ICSI, freezing, donor options, genetic testing and embryo storage can change cost.", "Ask each clinic to explain any success-rate figure by age group, diagnosis, embryo stage, transfer policy and whether it reports per cycle started, egg retrieval or embryo transfer. A published percentage cannot predict your individual outcome."],
    options: ["timed intercourse/IUI in selected cases", "IVF", "IVF with ICSI", "donor egg/sperm where legally appropriate", "embryo freezing", "fertility preservation"],
    records: ["age and fertility history", "AMH/AFC", "semen analysis", "HSG/uterine scan", "prior cycle records", "medical/legal eligibility details"],
    drivers: ["medicine dose", "ICSI", "embryo freezing/storage", "PGT if used", "donor program", "number of monitoring visits", "repeat cycle need"],
    questions: ["What is included in cycle cost?", "Are medicines extra?", "Is ICSI included?", "How many visits are needed?", "What success data is clinic-specific and current?"],
  },
  "/treatments/fertility/icsi-india": {
    topic: "ICSI", family: "fertility", patient: "patients comparing IVF with intracytoplasmic sperm injection",
    actual: ["ICSI is a lab technique where a single sperm is injected into an egg. It is often discussed for male-factor infertility, prior fertilization failure or selected IVF contexts.", "ICSI is not the whole IVF cycle; it is one component. The patient still has stimulation, retrieval, embryo culture and transfer/freezing planning.", "The quote should state whether ICSI is included, whether surgical sperm retrieval is needed and what lab/embryology services are extra."],
    options: ["standard IVF insemination", "IVF with ICSI", "surgical sperm retrieval plus ICSI", "donor sperm where legally appropriate", "embryo freezing"],
    records: ["semen analysis", "male-factor diagnosis", "prior IVF fertilization results", "female partner ovarian reserve", "infection screening", "legal/consent documents"],
    drivers: ["ICSI lab fee", "sperm retrieval if needed", "medicine dose", "embryo culture/freezing", "PGT if used", "repeat cycle"],
    questions: ["Why is ICSI recommended?", "Is sperm retrieval needed?", "Is ICSI included in the package?", "What fertilization history matters?", "What lab quality indicators can be shared?"],
  },
  "/treatments/fertility/fertility-preservation-india": {
    topic: "fertility preservation", family: "fertility", patient: "patients considering egg, sperm or embryo freezing before cancer treatment, age-related delay or medical therapy",
    actual: ["Fertility preservation planning depends on urgency, age, ovarian reserve or semen parameters, cancer-treatment timing, partner status, legal consent and storage logistics.", "Cancer patients often need coordination between oncology and fertility teams so preservation does not dangerously delay treatment.", "International patients must ask about storage duration, renewal fees, export rules, future use and what happens if they do not return to India."],
    options: ["sperm freezing", "egg freezing", "embryo freezing", "ovarian tissue discussion in select centers", "urgent oncology-linked preservation"],
    records: ["oncology treatment timeline if relevant", "AMH/AFC or semen analysis", "age and reproductive history", "partner/consent details", "infection screening", "storage preferences"],
    drivers: ["stimulation medicines", "retrieval procedure", "embryology", "freezing method", "storage years", "legal documentation", "urgent cycle timing"],
    questions: ["How urgent is cancer treatment?", "What can be preserved?", "What are storage rules?", "Can material be shipped later?", "What consent documents are needed?"],
  },
  "/treatments/urology/robotic-prostate-surgery-india": {
    topic: "robotic prostate surgery", family: "urology/oncology", patient: "men with prostate cancer or selected prostate conditions comparing robotic prostatectomy",
    actual: ["Robotic prostate surgery most often refers to robotic-assisted radical prostatectomy for localized prostate cancer, but the term can be used loosely. The plan must start with diagnosis, PSA, biopsy grade, MRI/staging and whether surgery is appropriate.", "Patients should ask about cancer risk group, nerve-sparing feasibility, lymph-node dissection, urinary continence expectations, sexual-function counselling and pathology follow-up.", "The robot does not replace surgeon judgement. Surgeon/team experience, cancer suitability and follow-up matter more than the machine label."],
    options: ["active surveillance", "robotic radical prostatectomy", "open/laparoscopic surgery", "radiation therapy", "hormone/systemic therapy"],
    records: ["PSA timeline", "biopsy/Gleason grade", "MRI prostate", "PSMA PET/CT if done", "urinary/sexual baseline", "fitness notes"],
    drivers: ["robotic system fee", "hospital stay", "lymph-node dissection", "nerve-sparing complexity", "pathology", "catheter removal visit", "follow-up PSA"],
    questions: ["Is surgery appropriate for my risk group?", "Will nerves be spared?", "When is catheter removed?", "What continence recovery is expected?", "How is pathology reviewed?"],
  },
  "/treatments/urology/bph-surgery-india": {
    topic: "BPH surgery", family: "urology", patient: "men with enlarged prostate symptoms comparing TURP, laser and minimally invasive options",
    actual: ["BPH surgery treats urinary obstruction from benign prostate enlargement, not prostate cancer. The procedure choice depends on prostate size, urinary retention, bladder function, bleeding risk, medicines, infection and patient goals.", "Options may include TURP, HoLEP/laser enucleation, laser vaporization or other techniques depending on hospital capability and prostate anatomy.", "Patients should ask whether cancer has been considered, what prostate size is measured, catheter duration, bleeding risk, sexual side effects and follow-up."],
    options: ["medicines", "TURP", "HoLEP or laser enucleation", "laser vaporization", "catheter management", "evaluation for prostate cancer where relevant"],
    records: ["prostate ultrasound/TRUS size", "uroflow/PVR if done", "PSA if done", "urine tests", "retention/catheter history", "medicine list"],
    drivers: ["prostate size", "TURP vs laser", "laser fiber/equipment", "catheter days", "hospital stay", "blood thinner management", "infection/retention history"],
    questions: ["What is my prostate size?", "Which procedure and why?", "How long catheter?", "What sexual/urinary effects?", "Is biopsy/pathology included?"],
  },
  "/treatments/bariatric/gastric-sleeve-india": {
    topic: "gastric sleeve", family: "bariatric", patient: "patients with obesity comparing sleeve gastrectomy evaluation and travel planning",
    actual: ["Gastric sleeve removes a large portion of the stomach to create a sleeve-shaped stomach. It requires bariatric-team evaluation, nutrition preparation, anesthesia fitness and lifelong follow-up habits.", "It is not cosmetic weight loss. Suitability depends on BMI, obesity-related conditions, prior attempts, mental health, eating pattern, reflux, diabetes and surgical risk.", "International patients must plan diet stages, hydration, supplements, follow-up labs and emergency access after returning home."],
    options: ["medical weight management", "gastric sleeve", "gastric bypass", "endoscopic options in selected cases", "revisional bariatric surgery"],
    records: ["BMI/weight history", "diabetes/BP/sleep apnea notes", "prior weight-loss attempts", "endoscopy if done", "psych/nutrition notes", "medicine list"],
    drivers: ["laparoscopic/robotic approach", "stapler/consumables", "ICU/ward stay", "pre-op tests", "nutrition program", "complication/extra stay", "follow-up labs"],
    questions: ["Why sleeve over bypass?", "How is reflux handled?", "What diet stages?", "What supplements lifelong?", "Who follows labs at home?"],
  },
  "/treatments/bariatric/gastric-bypass-india": {
    topic: "gastric bypass", family: "bariatric", patient: "patients comparing bypass surgery for obesity, diabetes/metabolic disease or reflux-related decisions",
    actual: ["Gastric bypass changes stomach size and reroutes food flow. It may be discussed for obesity with metabolic disease, reflux considerations or when sleeve is less suitable.", "Bypass requires strong follow-up for nutrition, supplements, dumping symptoms, marginal ulcer risk and long-term lab monitoring.", "The estimate should include bariatric team review, surgery, stay, diet counselling and follow-up plan, not only operating room cost."],
    options: ["medical management", "sleeve gastrectomy", "Roux-en-Y gastric bypass", "mini/one-anastomosis bypass where offered", "revision surgery"],
    records: ["BMI and comorbidities", "diabetes history", "reflux/endoscopy findings", "prior bariatric records", "nutrition assessment", "medicine list"],
    drivers: ["procedure type", "staplers/consumables", "ICU/ward stay", "diabetes management", "nutrition follow-up", "complications/extra stay", "revision status"],
    questions: ["Why bypass not sleeve?", "What supplement plan?", "What diabetes medicine changes?", "What long-term labs?", "What symptoms require urgent care?"],
  },
  "/treatments/ophthalmology/cataract-surgery-india": {
    topic: "cataract surgery", family: "ophthalmology", patient: "patients comparing cataract removal and intraocular lens choices",
    actual: ["Cataract surgery removes the cloudy natural lens and replaces it with an intraocular lens. The most important patient decision is often the lens plan, not the operation label.", "Patients should ask about monofocal, toric, multifocal/EDOF lens suitability, astigmatism, retina status, glaucoma/diabetes issues and whether both eyes are treated separately.", "International patients must plan follow-up visits and avoid rushing return before the surgeon checks early healing."],
    options: ["watchful waiting if mild", "phaco cataract surgery", "toric lens for astigmatism in selected cases", "premium lenses where suitable", "separate-eye staged surgery"],
    records: ["eye exam", "vision/acuity", "biometry/IOL calculation", "retina/OCT if done", "diabetes/glaucoma history", "current eye drops"],
    drivers: ["IOL type", "one eye vs both", "premium lens", "femtosecond laser if used", "retina/glaucoma comorbidity", "follow-up visits", "drops/medicines"],
    questions: ["Which lens is quoted?", "Is premium lens suitable?", "How many visits after surgery?", "When can the second eye be done?", "What if retina disease exists?"],
  },
  "/treatments/ophthalmology/retinal-surgery-india": {
    topic: "retinal surgery", family: "ophthalmology", patient: "patients with retinal detachment, diabetic eye disease, macular hole or vitreoretinal problems",
    actual: ["Retinal surgery is often time-sensitive. Retinal detachment symptoms such as sudden curtain-like vision loss, flashes or many floaters need urgent local eye assessment.", "Procedures may include vitrectomy, laser, gas or silicone oil, membrane peel or buckle depending on diagnosis.", "Patients must understand positioning instructions, flying restrictions with gas bubbles and follow-up timing."],
    options: ["laser/injection in selected diseases", "vitrectomy", "retinal detachment repair", "membrane peel", "silicone oil placement/removal", "diabetic retina management"],
    records: ["retina diagnosis", "OCT", "fundus photos", "ultrasound B-scan if media opaque", "diabetes control notes", "prior injections/laser/surgery"],
    drivers: ["diagnosis urgency", "vitrectomy consumables", "gas vs silicone oil", "oil removal later", "injections/laser", "follow-up frequency", "one vs both eyes"],
    questions: ["Is this urgent?", "Will gas or oil be used?", "Can I fly?", "What positioning is required?", "Will another surgery remove oil?"],
  },
  "/treatments/ophthalmology/corneal-transplant-india": {
    topic: "corneal transplant", family: "ophthalmology", patient: "patients with corneal opacity, keratoconus, graft failure or endothelial disease comparing transplant options",
    actual: ["Corneal transplant may mean full-thickness penetrating keratoplasty or partial-layer procedures such as DALK, DSEK or DMEK. The right option depends on which corneal layer is diseased.", "Patients need diagnosis, corneal scans, eye-pressure/glaucoma status, infection history, previous graft details and ocular-surface condition.", "Follow-up is long and important because rejection, infection, pressure problems and suture management can occur after the patient returns home."],
    options: ["contact lens/scleral lens", "cross-linking for selected keratoconus", "DALK", "DSEK/DMEK endothelial keratoplasty", "penetrating keratoplasty", "repeat graft"],
    records: ["corneal diagnosis", "topography/pachymetry", "slit-lamp notes", "eye pressure/glaucoma history", "prior graft records", "infection/herpes history"],
    drivers: ["graft type", "donor cornea availability", "combined cataract/glaucoma work", "repeat graft", "suture/follow-up visits", "medicines", "complication management"],
    questions: ["Which corneal layer is diseased?", "What transplant type is planned?", "How long follow-up?", "What rejection signs?", "Can my home ophthalmologist manage follow-up?"],
  },
});

const SPECIFIC_TOOL_PAGES = {
  "/resources/medical-record-checklist": {
    purpose: "help patients send a hospital-ready file instead of scattered screenshots",
    sections: [["Identity and case summary", "Patient name as on passport, age, country, diagnosis as written, main symptom, treating doctor at home and preferred travel window."], ["Clinical reports", "Latest consultation note, diagnosis summary, imaging reports, lab reports, pathology where relevant, procedure notes and discharge summaries."], ["Image files", "DICOM or original image links for CT, MRI, PET-CT, angiogram, X-ray or ultrasound when hospitals need more than the written report."], ["Medicines and risks", "Current medicines, blood thinners, allergies, anesthesia reactions, diabetes, kidney disease, heart/lung disease and infection history."], ["Travel documents", "Passport details, companion details, visa status and whether a hospital invitation letter is needed."]],
  },
  "/resources/hospital-quote-comparison": {
    purpose: "compare hospital estimates by assumptions, not headline price",
    sections: [["Records reviewed", "A quote should state what reports and dates were reviewed."], ["Procedure scope", "Confirm the exact procedure, device/implant/medicine assumptions and whether the plan is staged."], ["Included items", "Room, stay, ICU, OT/cath lab, investigations, medicines, consumables, professional fees and follow-up."], ["Exclusions", "Complications, extra stay, blood products, premium devices, rehab, hotel and flights."], ["Validity and payment", "Quote date, validity, deposit, refund rules and currency assumptions."]],
  },
  "/resources/medical-travel-budget-planner": {
    purpose: "estimate the full trip cost beyond the hospital package",
    sections: [["Hospital estimate", "Use written estimates only, with inclusions and exclusions."], ["Travel costs", "Flights, flexible return ticket, airport transfer, visa, insurance and local transport."], ["Stay costs", "Hotel near hospital, companion room, meals, laundry, accessibility and longer-stay buffer."], ["Medical extras", "Repeat tests, medicines, rehab, blood products, extra stay and emergency return visits."], ["Currency buffer", "Exchange rates, bank fees, cash/card rules and quote validity can change the final amount."]],
  },
  "/resources/questions-to-ask-surgeon": {
    purpose: "prepare for a surgical opinion before travelling",
    sections: [["Diagnosis", "What diagnosis and reports are you using for this recommendation?"], ["Procedure", "What procedure is proposed, what alternatives exist and why is this timing suggested?"], ["Risks", "What patient-specific risks apply because of age, medicines or other diseases?"], ["Recovery", "Hospital stay, wound care, mobility, restrictions, follow-up and flight timing."], ["Cost", "What devices/implants/consumables are included and what could change the estimate?"]],
  },
  "/resources/questions-to-ask-oncologist": {
    purpose: "help cancer patients compare oncology responses safely",
    sections: [["Diagnosis and stage", "What cancer type, stage and pathology assumptions are being used?"], ["Missing tests", "Is more imaging, pathology review or molecular testing needed before planning treatment?"], ["Treatment intent", "Is the plan curative, control-focused, palliative or diagnostic?"], ["Sequence", "Surgery, radiation, systemic therapy, cycles and response assessment."], ["Follow-up", "What can happen at home and what must happen at the treating hospital?"]],
  },
  "/resources/medical-visa-checklist": {
    purpose: "organize visa and hospital-letter tasks without hard-coding unstable rules",
    sections: [["Official rule check", "Use the current Government of India visa portal for category and eligibility."], ["Hospital letter", "Ask the selected hospital what invitation or appointment document it can issue."], ["Attendant planning", "Check whether a companion needs a medical-attendant category or another category."], ["Timing", "Do not book rigid travel until hospital date and visa process are aligned."], ["Documents", "Passport, photos, hospital letter, diagnosis summary, payment/travel documents where required."]],
  },
  "/resources/travel-readiness-checklist": {
    purpose: "avoid booking travel before medical and operational readiness are aligned",
    sections: [["Clinical stability", "Ask a qualified clinician whether travel is reasonable."], ["Hospital readiness", "Written response, estimate, admission date and coordinator contact."], ["Companion readiness", "Who travels, who manages documents and who supports recovery."], ["Hotel readiness", "Distance, lifts, bathroom access, food, pharmacy and emergency route."], ["Return readiness", "Follow-up plan, fit-to-fly discussion and home doctor handoff."]],
  },
  "/resources/return-home-checklist": {
    purpose: "make sure the patient leaves India with usable medical documents",
    sections: [["Discharge summary", "Diagnosis, treatment performed, hospital stay, complications and condition at discharge."], ["Medicines", "Dose, duration, side effects, interactions and what not to stop suddenly."], ["Warning signs", "Symptoms that require urgent hospital contact after return."], ["Follow-up", "Dates, tests, scans, wound checks, rehab or oncology cycles."], ["Records", "Implant/device cards, pathology, imaging, bills and receipts."]],
  },
  "/resources/caregiver-checklist": {
    purpose: "help companions manage practical responsibilities during treatment travel",
    sections: [["Documents", "Passport, reports, hospital estimate, visa documents and consent preferences."], ["Daily care", "Medicines, meals, transport, hydration, hygiene and appointment timing."], ["Communication", "Who receives medical updates, who pays bills and who updates family at home."], ["Recovery support", "Walking help, wound observation, symptom diary and discharge questions."], ["Escalation", "Which symptoms go to hospital, coordinator or local emergency care."]],
  },
  "/resources/hospital-estimate-glossary": {
    purpose: "translate package-estimate terms into patient decisions",
    sections: [["Indicative estimate", "A preliminary quote that can change after examination or tests."], ["Package inclusion", "Items covered in the stated amount."], ["Exclusion", "Items billed separately, often complications or extra stay."], ["Consumables", "Medical items used during procedure, sometimes a major cost driver."], ["Validity", "How long the quote remains usable before rechecking."]],
  },
};

const SPECIFIC_PARTNER_PAGES = {
  "/partners/medical-travel-agents": {
    audience: "medical travel agents and facilitators", value: "a consent-led routing workflow that keeps clinical decisions with hospitals",
    opening: "Your reputation depends on what happens after a patient says yes: whether the file is usable, consent is visible, the hospital answers the real question and nobody turns an indicative response into a promise. Canopus Care gives you a shared operating workflow without taking over your patient relationship.",
    contribution: "You bring the trusted patient relationship, local context and communication continuity. We bring record readiness, structured hospital requests, comparison discipline and an auditable handoff.",
    sections: [["Referral intake", "Minimum patient details, no scraped PII, no diagnosis by agent."], ["Consent", "Explicit patient permission before sharing records with hospitals."], ["Hospital response", "Written response with assumptions, inclusions, exclusions and next steps."], ["Compliance", "No outcome guarantees, no unsupported doctor claims, no spam outreach."], ["Revenue workflow", "Commercial terms documented separately from patient clinical communication."]],
  },
  "/partners/hospitals": {
    audience: "hospital international-patient teams", value: "cleaner patient files and clearer estimate comparison",
    opening: "Your international-patient desk should not have to reconstruct a case from unlabeled screenshots before a clinician can review it. Canopus Care prepares consented, indexed case packets and sends the patient's actual question with the records, so your team can respond with fewer avoidable clarification loops.",
    contribution: "You retain clinical ownership, consultant assignment, pricing authority and admission decisions. We prepare the file, keep assumptions visible and return your response to the patient without changing its clinical meaning.",
    sections: [["Case packet", "Structured records, diagnosis summary, report dates and patient country."], ["Response template", "Plan, missing records, estimate assumptions, inclusions, exclusions and validity."], ["Coordinator boundary", "Canopus Care coordinates; hospital owns clinical review."], ["Lead quality", "Patients are routed with consent and clearer readiness signals."], ["Feedback loop", "Hospitals can identify missing data before admission dates are promised."]],
  },
  "/partners/sponsors": {
    audience: "employers, insurers, governments and NGOs", value: "transparent medical-travel coordination for sponsored patients",
    opening: "When you fund care across borders, you need more than a hospital price. You need eligibility, consent, approvals, estimate assumptions, travel dependencies and discharge documentation to remain visible without circulating unnecessary clinical detail.",
    contribution: "You define eligibility, authorization and reporting rules. We coordinate the operational pathway, separate clinical documents from commercial approvals and give your team status information appropriate to its role.",
    sections: [["Eligibility", "Sponsor rules, patient consent and covered treatment categories."], ["Estimate governance", "Written estimates, exclusions and approval workflow."], ["Patient support", "Travel, companion, translation and return-home documentation."], ["Data handling", "Minimum necessary data and role-based communication."], ["Reporting", "Operational status without exposing unnecessary clinical detail."]],
  },
  "/partners/referring-doctors": {
    audience: "referring doctors", value: "better continuity when patients seek India opinions",
    opening: "When your patient seeks an opinion in India, you should not disappear from the care pathway. Canopus Care can organize the referral question, route consented records and bring the hospital response and discharge documents back in a form you can review.",
    contribution: "You provide the clinical history, current treatment and reason for referral. The India hospital provides the specialist opinion and treatment plan. We keep the documents, questions and handoffs connected without substituting for doctor-to-doctor judgement.",
    sections: [["Referral summary", "Diagnosis, current treatment, reason for overseas opinion and urgency."], ["Records", "Reports and images sent with patient consent."], ["Hospital reply", "Clear response that can be reviewed by the home doctor."], ["Return handoff", "Discharge summary, medicines, follow-up tests and warning signs."], ["Clinical boundary", "Canopus Care does not replace doctor-to-doctor judgement."]],
  },
};

function sourceLinesFor(article, extra = []) {
  return [...(article.sources || []), ...extra]
    .filter(([, url]) => /^https?:\/\//i.test(url || ""))
    .map(([label, url]) => `- ${label}: ${url}`)
    .join("\n");
}

function bullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

const EDITORIAL_LENSES = {
  orthopaedic: {
    scene: "Most joint-replacement decisions are made in ordinary moments: the stairs that have become a calculation, the walk to the bathroom at night, or the family outing declined because recovery feels too uncertain. A useful consultation begins with those limits, not with a technology name.",
    travel: "For an orthopaedic trip, the hotel and journey home are part of the recovery plan. Ask about step-free access, shower safety, the height of the bed and toilet, walking aids, airport distances, physiotherapy continuity and who will help with luggage while the patient is using both hands for support.",
    prompt: "What does the patient most want to do again, and which part of recovery could prevent that?",
  },
  cardiac: {
    scene: "Cardiac families often arrive with two competing clocks: the medical urgency described by the treating team and the practical time needed to collect images, compare opinions and travel. The safest plan makes those clocks explicit rather than using urgency as a sales tactic.",
    travel: "Cardiac travel planning should account for exertion at airports, medicine timing across time zones, access to urgent assessment, wound or access-site checks and the need for a home cardiology appointment. The treating team, not an online itinerary, decides when travel is reasonable.",
    prompt: "What is urgent, what is elective, and which finding would change that timing?",
  },
  oncology: {
    scene: "Cancer care rarely fits into one trip-shaped box. A biopsy review may change the diagnosis; a staging scan may change the sequence; a treatment that begins in India may need to continue close to home. The central planning question is therefore not only where treatment starts, but how the whole course stays connected.",
    travel: "Build the travel plan around the treatment calendar and blood-test or imaging checkpoints, not around a package duration. Clarify which cycles, dressings, nutrition support, medicines and urgent-care arrangements must be available after the patient returns home.",
    prompt: "Which result determines the next treatment step, and where will that result be acted on?",
  },
  transplant: {
    scene: "A transplant enquiry is a long-term care and legal-readiness question before it is a travel question. Families need plain answers about recipient suitability, donor legality where relevant, infection risk, medicine access and who will monitor the patient after return.",
    travel: "Transplant travel requires a durable local-stay plan, strict medicine continuity, rapid access to the transplant team and a named clinician at home. No short advertised stay should override legal review, clinical stability or the monitoring schedule.",
    prompt: "Who owns the next legal, clinical and follow-up decision, and is that ownership documented?",
  },
  spine: {
    scene: "People considering spine or brain procedures often carry a folder of scans and a much harder-to-document story: where pain travels, when a hand becomes clumsy, which movements trigger weakness, or how sleep and work have changed. Those details help explain what the images do and do not mean.",
    travel: "Plan for transfers, sitting tolerance, stairs, lifting restrictions, wound review and access to urgent neurological assessment. A long flight and airport connection can be more demanding than the family expects, so return timing needs a clinician's review.",
    prompt: "Which symptom is the procedure intended to improve, and how will the team judge whether the plan addresses it?",
  },
  fertility: {
    scene: "Fertility travel is governed by biology rather than a fixed tourism itinerary. Scan dates can move, medicine timing matters, laboratory decisions may be time-sensitive and both partners may need tests or consent conversations before a cycle can proceed.",
    travel: "Keep tickets and accommodation flexible around monitoring, retrieval, transfer and early follow-up. Ask who answers medicine questions across time zones and exactly which parts of the cycle can be monitored safely in the patient's home country.",
    prompt: "Which dates are fixed, which may move, and who will coordinate monitoring between countries?",
  },
  urology: {
    scene: "Urology journeys are often shaped by practical details patients hesitate to ask about: catheters, stents, urine leakage, sexual function, bathroom access and when a device will be removed. Naming those details early produces a more useful plan than discussing the operation in isolation.",
    travel: "Confirm the catheter or stent plan, access to a bathroom during travel, fever and bleeding instructions, medicine supply and the exact follow-up test. If a device remains in place, its removal date and responsible clinician must be written down.",
    prompt: "Will any catheter, stent or drain remain after discharge, and who is responsible for it?",
  },
  bariatric: {
    scene: "Metabolic surgery changes daily routines long after the incisions heal. The meaningful comparison includes food progression, hydration, supplements, reflux or dumping symptoms, mental-health support and whether long-term blood tests will remain accessible at home.",
    travel: "The return plan should protect hydration, staged nutrition, supplement access, mobility and follow-up testing. Families should know what the patient can tolerate during a flight and whom to contact if eating or drinking becomes difficult.",
    prompt: "What support will still be in place six months after the operation?",
  },
  ophthalmology: {
    scene: "Eye procedures can look small on a hospital schedule while having an outsized effect on independence. Patients need to know how vision may fluctuate, whether they can read signs or manage drops, and who will help if both eyes or the better-seeing eye are affected.",
    travel: "Plan around drop schedules, early pressure or retinal checks, visual assistance at airports and any positioning or flight restriction. A home ophthalmologist should receive the operative note and know when the next examination is due.",
    prompt: "What will the patient be able to see and manage independently during the first days after treatment?",
  },
};

function baseFamily(profile) {
  const family = (profile.family || "").toLowerCase();
  if (family.includes("orthopaedic")) return "orthopaedic";
  if (family.includes("cardiac")) return "cardiac";
  if (family.includes("oncology")) return "oncology";
  if (family.includes("transplant")) return "transplant";
  if (family.includes("spine") || family.includes("neuro")) return "spine";
  if (family.includes("fertility")) return "fertility";
  if (family.includes("urology")) return "urology";
  if (family.includes("bariatric")) return "bariatric";
  if (family.includes("ophthalmology")) return "ophthalmology";
  throw new Error(`No editorial family configured for ${profile.family || profile.topic}`);
}

function sentenceStart(value = "") {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

const SPECIALTY_READER_GUIDANCE = {
  orthopaedic: {
    priorities: "the movement you want back, the pain that limits you now, the help available during rehabilitation and whether your home or hotel will work with a walking aid",
    urgent: "a new inability to bear weight, a hot or draining previous joint-replacement wound, a recent major injury, or rapidly worsening weakness",
  },
  cardiac: {
    priorities: "the symptom or heart finding driving the decision, how urgent your cardiology team believes it is, the alternatives being compared and the follow-up available when you return home",
    urgent: "chest pain, severe or worsening breathlessness, fainting, new confusion or another sudden change that may need emergency cardiac assessment",
  },
  oncology: {
    priorities: "what the pathology confirms, the treatment goal, which result determines the next step, how side effects will be managed and which parts of care can continue near home",
    urgent: "uncontrolled bleeding, severe breathlessness, confusion, a seizure, fever during treatment or another sudden deterioration",
  },
  transplant: {
    priorities: "recipient suitability, donor legality and safety where relevant, infection risk, medicine access and who will provide long-term monitoring after you return home",
    urgent: "rapid deterioration, severe breathlessness, confusion, uncontrolled bleeding, signs of serious infection or another change your transplant or local clinical team considers urgent",
  },
  spine: {
    priorities: "the symptom the procedure is intended to improve, how examination findings match the scan, what function could be at risk and what support you will need during recovery",
    urgent: "new or worsening limb weakness, loss of bladder or bowel control, a seizure, reduced alertness, sudden speech or vision change, or another acute neurological change",
  },
  fertility: {
    priorities: "the diagnosis being addressed, the dates that may move, medicine and monitoring responsibilities, laboratory decisions and what will happen if the cycle changes or is cancelled",
    urgent: "severe or rapidly worsening pain, heavy bleeding, fainting, breathing difficulty or symptoms your fertility team has told you require prompt local assessment",
  },
  urology: {
    priorities: "pain or urinary symptoms, infection and obstruction risk, kidney function, catheter or stent plans, sexual or continence concerns and the follow-up available at home",
    urgent: "fever with urinary obstruction, inability to pass urine, severe uncontrolled pain, heavy bleeding or rapidly worsening weakness",
  },
  bariatric: {
    priorities: "your metabolic-health goals, reflux and eating history, the long-term nutrition and supplement plan, hydration after surgery and access to follow-up blood tests at home",
    urgent: "severe abdominal or chest pain, breathing difficulty, repeated vomiting, inability to drink, fainting or another sudden post-operative concern",
  },
  ophthalmology: {
    priorities: "which eye is affected, what vision you rely on day to day, what the procedure is intended to change, how you will manage drops and which early checks must happen before travel",
    urgent: "sudden loss or marked worsening of vision, a curtain-like shadow, severe eye pain, new flashes with many floaters or another rapid visual change",
  },
};

const PAGE_GLOSSARIES = {
  "/treatments/cardiac/tavr-india": [
    ["TAVR / TAVI", "Two names for replacing the aortic valve through a catheter rather than through conventional open-heart valve surgery."],
    ["Aortic stenosis", "Narrowing of the valve that lets blood leave the heart; the team assesses how severe it is and whether it explains the symptoms."],
    ["Vascular access", "The blood-vessel route used to carry the replacement valve to the heart, most often assessed with CT imaging."],
  ],
  "/treatments/cardiac/angioplasty-pci-india": [
    ["PCI", "Percutaneous coronary intervention: treatment performed through a catheter to open a narrowed coronary artery, commonly using a balloon and stent."],
    ["IVUS", "Intravascular ultrasound: a tiny ultrasound probe inside the artery that helps the team assess the vessel and stent."],
    ["OCT", "Optical coherence tomography: catheter-based light imaging that shows detailed pictures from inside a coronary artery."],
    ["FFR", "Fractional flow reserve: a pressure measurement used in selected cases to judge whether a narrowing is restricting blood flow enough to guide treatment."],
  ],
  "/treatments/cardiac/congenital-heart-surgery-india": [
    ["Corrective repair", "An operation intended to repair the heart defect as fully as the anatomy allows."],
    ["Palliative operation", "An operation that improves blood flow or symptoms without fully correcting the underlying anatomy."],
    ["Staged pathway", "A planned series of procedures performed at different ages or phases rather than one definitive operation."],
    ["Catheter-based treatment", "A procedure performed through a blood vessel, which may avoid open surgery for selected defects."],
  ],
  "/treatments/oncology/colorectal-cancer-india": [["CEA", "Carcinoembryonic antigen: a blood marker that may help with baseline assessment or follow-up, but does not diagnose colorectal cancer by itself."]],
  "/treatments/oncology/prostate-cancer-india": [
    ["Gleason score / Grade Group", "A pathology grading system describing how abnormal prostate-cancer cells look and helping the team estimate how the cancer may behave."],
    ["PSMA PET", "A scan using a tracer that binds to prostate-specific membrane antigen to look for prostate-cancer sites in selected staging or recurrence situations."],
  ],
  "/treatments/oncology/blood-cancer-india": [
    ["Flow cytometry", "A laboratory test that identifies patterns of markers on blood or marrow cells and helps classify some leukemias and lymphomas."],
    ["Cytogenetics", "Testing that looks for chromosome changes in cancer cells; results can affect diagnosis, risk grouping and treatment planning."],
  ],
  "/treatments/oncology/bone-marrow-transplant-india": [
    ["Autologous transplant", "A transplant using the patient's own previously collected stem cells."],
    ["Allogeneic transplant", "A transplant using stem cells from a donor."],
    ["Haploidentical donor", "A donor who is a half match, often a parent, child or sibling, considered within a specialist transplant plan."],
    ["Conditioning regimen", "Chemotherapy, sometimes with radiation, given before transplant to prepare the body and marrow for the stem cells."],
    ["Protective isolation", "Infection-control precautions used while immunity is very low; the exact rules and duration vary by hospital and recovery."],
  ],
  "/treatments/transplant/bone-marrow-transplant-india": [
    ["Autologous transplant", "A transplant using the patient's own previously collected stem cells."],
    ["Allogeneic transplant", "A transplant using stem cells from a donor."],
    ["Haploidentical donor", "A donor who is a half match, often a parent, child or sibling, considered within a specialist transplant plan."],
    ["Conditioning regimen", "Chemotherapy, sometimes with radiation, given before transplant to prepare the body and marrow for the stem cells."],
    ["Protective isolation", "Infection-control precautions used while immunity is very low; the exact rules and duration vary by hospital and recovery."],
  ],
  "/treatments/transplant/liver-transplant-india": [["MELD score", "A score calculated from laboratory results to describe the severity of liver disease. Transplant teams interpret it alongside the full clinical and legal evaluation."]],
  "/treatments/spine-neurosurgery/lumbar-fusion-india": [
    ["TLIF / PLIF", "Lumbar fusion approaches performed from the back; the route to the disc space and nerve structures differs."],
    ["ALIF", "Anterior lumbar interbody fusion, performed through an approach from the front of the abdomen."],
    ["LLIF", "Lateral lumbar interbody fusion, performed through an approach from the side in selected cases."],
  ],
  "/treatments/spine-neurosurgery/cervical-spine-surgery-india": [["ACDF", "Anterior cervical discectomy and fusion: an operation through the front of the neck to remove a problem disc and fuse selected vertebrae."]],
  "/treatments/spine-neurosurgery/brain-tumour-surgery-india": [
    ["Craniotomy", "An operation in which the surgeon temporarily opens part of the skull to reach the brain lesion."],
    ["Stereotactic biopsy", "A precisely targeted procedure that removes a small tissue sample for diagnosis rather than removing the whole lesion."],
  ],
  "/treatments/spine-neurosurgery/deep-brain-stimulation-india": [["IPG", "Implantable pulse generator: the battery-powered device, usually placed under the skin of the chest, that sends programmed electrical pulses to the brain leads."]],
  "/treatments/ophthalmology/cataract-surgery-india": [["EDOF lens", "An extended-depth-of-focus intraocular lens designed to provide a broader range of focus than a standard monofocal lens; suitability and trade-offs require an eye-surgeon discussion."]],
  "/treatments/ophthalmology/retinal-surgery-india": [
    ["Vitrectomy", "An operation that removes the gel inside the eye so the surgeon can reach and treat the retina."],
    ["Membrane peel", "Removal of a very thin layer of scar-like tissue from the retinal surface."],
    ["Scleral buckle", "A band placed around the outside of the eye to support repair of selected retinal detachments."],
    ["Gas or silicone oil", "Materials placed inside the eye to support the retina while it heals; gas can create strict flying restrictions until it has fully disappeared."],
  ],
  "/treatments/ophthalmology/corneal-transplant-india": [
    ["DALK", "A partial-thickness transplant that replaces the front corneal layers while keeping the patient's own innermost layer."],
    ["DSEK / DMEK", "Partial-thickness transplants that replace diseased inner corneal layers; DMEK uses a thinner donor layer."],
    ["Penetrating keratoplasty", "A full-thickness corneal transplant replacing all layers in the treated area."],
  ],
};

function editorialOpening(path, profile) {
  if (path === "/treatments/cardiac/congenital-heart-surgery-india") {
    return "If you are reading this for your child, you may be trying to understand an unfamiliar heart diagram while also making decisions about timing, travel and intensive care. Start by asking the congenital-heart team to name the exact anatomy, the purpose of the proposed procedure and whether this is one operation or one stage in a longer plan.";
  }
  if (path === "/treatments/orthopaedics/revision-joint-replacement-india") {
    return "Pain or uncertainty after a previous joint replacement can be especially difficult because you have already been through surgery once. A useful revision opinion begins by explaining why the implant may be failing, what is still uncertain, whether infection has been assessed and how much more complex recovery may be than the first operation.";
  }
  const variants = [
    `You may already have a procedure name but still not know whether it fits your diagnosis, how recovery will work or what could change after you arrive. A useful ${profile.topic} conversation starts with those unanswered questions, not with a package price.`,
    `When you are comparing ${profile.topic}, information is rarely the problem; clarity is. Begin by separating what your reports confirm, what the hospital is assuming and what must still be decided before travel is sensible.`,
    `${sentenceStart(profile.topic)} is easier to understand as a sequence of decisions than as one hospital event. Each report, consultation and follow-up step should answer a question that matters to you and the people supporting you.`,
    `A useful second opinion for ${profile.topic} should do more than name a procedure. It should help you understand the reasoning, the alternatives, the recovery burden and the point at which the plan could still change.`,
  ];
  const index = [...path].reduce((sum, char) => sum + char.charCodeAt(0), 0) % variants.length;
  return variants[index];
}

function glossaryMarkdown(path) {
  const terms = PAGE_GLOSSARIES[path] || [];
  if (!terms.length) return "";
  return `## Medical terms on this page, in plain language\n\n${terms.map(([term, meaning]) => `- **${term}:** ${meaning}`).join("\n")}`;
}

function inlineEvidence(article, limit = 3) {
  const links = (article.sources || []).filter(([, url]) => /^https?:\/\//.test(url)).slice(0, limit);
  if (!links.length) return "";
  return `> **Evidence trail:** ${links.map(([label, url]) => `[${label}](${url})`).join(" · ")}. Sources explain the general care pathway; the treating team must interpret them for the individual patient.`;
}

const FAMILY_GUIDANCE = {
  orthopaedic: {
    team: "an orthopaedic surgeon, anesthetist, physician or cardiologist when medical clearance is needed, physiotherapist and discharge team",
    decision: "how closely the scan findings match pain and loss of function, whether non-surgical care has been exhausted, the condition of bone and soft tissues, medical fitness and the rehabilitation environment after discharge",
    preparation: "skin or dental infection concerns, blood-thinner medicines, diabetes control, anemia, walking-aid practice and the accessibility of the patient's home or hotel",
    recovery: "pain control, safe transfers, walking progression, wound observation, clot-prevention instructions and a rehabilitation plan that can continue after the patient returns home",
  },
  cardiac: {
    team: "a cardiologist, cardiac surgeon or interventional specialist as relevant, cardiac anesthetist, imaging team, critical-care team and rehabilitation or follow-up clinicians",
    decision: "symptoms, anatomy, heart function, kidney and lung health, urgency, frailty, medicine history and whether a surgical, catheter-based or medical pathway best fits the case",
    preparation: "current ECG and imaging, blood-thinner instructions, kidney function, infection screening, diabetes control, dental review when requested and a clear plan for medicines before admission",
    recovery: "rhythm and blood-pressure monitoring, wound or access-site care, medication reconciliation, graded activity and reliable cardiology follow-up after return home",
  },
  oncology: {
    team: "medical, surgical and radiation oncologists as relevant, pathology and radiology specialists, organ-specific surgeons, nursing, nutrition and supportive-care teams",
    decision: "confirmed pathology, stage, tumor biology, previous treatment, performance status, treatment intent and the sequence in which surgery, radiation or medicines may be used",
    preparation: "pathology material, original imaging, infection and nutrition review, medicine reconciliation, baseline organ-function tests and a realistic plan for cycles or follow-up that may continue at home",
    recovery: "symptom control, infection precautions, nutrition, wound or treatment-site care, treatment-response assessment and a written plan for the next cycle, scan or consultation",
  },
  transplant: {
    team: "the transplant physician and surgeon, donor team where relevant, anesthetist, infectious-disease and critical-care teams, pharmacist, dietitian and transplant coordinator",
    decision: "recipient suitability, donor legality and suitability where relevant, infection risk, organ function, compatibility testing, adherence capacity and long-term follow-up",
    preparation: "complete recipient and donor records, current legal documentation, infection screening, medicine review, vaccination discussion and a durable funding and follow-up plan for lifelong care",
    recovery: "close monitoring, infection prevention, medicine adherence, repeated laboratory testing and direct coordination with a transplant clinician after the patient returns home",
  },
  spine: {
    team: "a spine surgeon or neurosurgeon, neurologist when appropriate, radiologist, anesthetist, physiotherapist and pain or rehabilitation team",
    decision: "the relationship between symptoms, neurological examination and imaging; stability or compression; prior treatment; bone quality; and whether surgery is likely to address the patient's actual limitation",
    preparation: "complete MRI or CT images, a precise symptom timeline, weakness or bladder/bowel history, blood-thinner review, smoking and bone-health discussion and a plan for mobility after discharge",
    recovery: "neurological observation, pain control, wound care, safe movement, activity restrictions and staged rehabilitation with clear warning signs for urgent review",
  },
  fertility: {
    team: "a fertility specialist, embryology laboratory, nursing team and, depending on the case, urology, genetics, anesthesia or counseling support",
    decision: "age, ovarian reserve, sperm factors, uterine and tubal findings, previous cycles, genetics, treatment timeline and how monitoring will work before and after travel",
    preparation: "cycle records, hormone and semen testing, ultrasound findings, infection screening, medication teaching, consent decisions and a travel calendar that can accommodate changing scan dates",
    recovery: "medicine timing, symptom monitoring, embryo-transfer or procedure instructions, pregnancy testing and a clear handoff to a fertility or obstetric team at home",
  },
  urology: {
    team: "a urologist, radiology and laboratory teams, anesthetist when a procedure is planned and nursing staff familiar with catheter, stent and urinary-care instructions",
    decision: "symptoms, imaging, obstruction or infection, kidney function, anatomy, prior procedures and whether the goal is drainage, removal, reconstruction or symptom relief",
    preparation: "urine testing where requested, kidney-function results, blood-thinner review, imaging files, infection history and a written catheter or stent plan",
    recovery: "urination, bleeding and fever monitoring, catheter or stent care, pain control, activity guidance and follow-up imaging or pathology when required",
  },
  bariatric: {
    team: "a bariatric surgeon, anesthetist, physician, dietitian and nursing team, with psychological, endocrine, sleep or cardiac review when relevant",
    decision: "BMI and weight history, metabolic disease, reflux, eating pattern, previous treatment, surgical risk, nutritional readiness and the ability to maintain long-term follow-up",
    preparation: "nutrition and medicine review, blood tests, sleep-apnea assessment, smoking and alcohol discussion, pre-operative diet instructions and a post-discharge food and supplement plan",
    recovery: "hydration, staged diet progression, clot prevention, wound care, vitamin and mineral supplementation and long-term metabolic and nutritional monitoring",
  },
  ophthalmology: {
    team: "the relevant eye surgeon, optometry and imaging teams, anesthetist when required and a home ophthalmologist who can continue close follow-up",
    decision: "visual symptoms, examination findings, eye imaging, the condition of the other eye, previous procedures, pressure or retinal risk and whether travel restrictions will apply",
    preparation: "current eye measurements and scans, infection or inflammation review, medicine reconciliation, companion support for low vision and a plan for drops and early follow-up",
    recovery: "eye-drop adherence, protection from rubbing or contamination, positioning or flight restrictions when relevant and urgent review for pain or sudden vision change",
  },
};

function specificTreatmentMarkdown(path, article, profile) {
  const sourceLines = sourceLinesFor(article);
  const familyKey = baseFamily(profile);
  const family = FAMILY_GUIDANCE[familyKey] || FAMILY_GUIDANCE.urology;
  const lens = EDITORIAL_LENSES[familyKey];
  const readerGuidance = SPECIALTY_READER_GUIDANCE[familyKey];
  const evidence = inlineEvidence(article);
  const optionRows = profile.options.map((option) => `| ${option} | Ask what problem this option is intended to solve, why it fits or does not fit this case, and what follow-up it requires. |`).join("\n");
  const recordRows = profile.records.map((record) => `| ${record} | Include the report date and the original image or complete document when available. |`).join("\n");
  const driverRows = profile.drivers.map((driver) => `| ${driver} | Ask the hospital to state the assumption and whether a change would alter the estimate. |`).join("\n");
  return `---
title: "${article.title}"
primary_keyword: "${profile.topic} in India"
cta: "${article.cta || "Send reports for current hospital options"}"
---

# ${article.title}

${editorialOpening(path, profile)}

## Quick answer

**The short version:** start with current records, then ask the hospital to explain why its proposed approach fits this case. A usable response names the evidence reviewed, alternatives considered, important recovery needs, estimate assumptions and the point at which the plan may change.

**The question to keep in view:** ${lens.prompt}

Canopus Care can organize records, consent, hospital communication and travel-readiness tasks. It is a facilitator, not a medical provider: diagnosis, treatment choice, prescriptions, travel clearance and outcome discussions belong to qualified clinicians.

## What this procedure actually means

${profile.actual.map((p) => `${p}`).join("\n\n")}

${evidence}

## From the patient side

${lens.scene}

Before the consultation, write down what matters most to you. For this kind of care, that may include ${readerGuidance.priorities}. A useful specialist conversation connects the medical plan to those priorities without promising a particular result.

## When this may be urgent

Overseas planning should never delay urgent local care. Seek prompt local medical assessment for ${readerGuidance.urgent}. This is not a complete warning-sign list, and a facilitator cannot decide whether you are stable to travel. Ask the clinician who knows your case which changes require emergency care.

## Treatment options to compare

| Option that may enter the discussion | What the patient should clarify |
| --- | --- |
${optionRows}

Do not ask only which option is cheapest. Ask why the hospital is proposing it for your case, what alternatives were considered and what could change after an in-person evaluation.

An alternative is not necessarily “better” because it is newer, less invasive or more expensive. Suitability depends on the problem being treated, anatomy, disease severity, medical fitness, previous treatment and the clinician's judgment. Ask for the trade-offs in language the family can repeat back accurately.

## The clinical team and how the decision is made

Care commonly involves ${family.team}. The exact team varies, but you should know who has reviewed your case and who will be responsible at each stage.

The decision usually turns on ${family.decision}. This is why a coordinator cannot select treatment from a diagnosis label and why a hospital should not issue a confident plan from an incomplete file.

When opinions differ, compare the reasoning rather than counting recommendations. Did both teams review the same images? Are they working from the same diagnosis and dates? Is one plan based on an assumption the other team has already ruled out? A short written clarification often explains more than another generic quote.

## Reports hospitals usually need

| Record | How to prepare it |
| --- | --- |
${recordRows}

For image-heavy procedures, the image files may matter as much as the written report. For oncology, pathology and staging details are central. For cardiac, original angiogram/echo images can materially change the answer. For transplant, legal and donor documentation may be as important as medical suitability.

Create a one-page case summary with the diagnosis exactly as written, your current symptoms, major medical conditions, previous procedures, medicines, allergies and the question you want answered. Do not rewrite the diagnosis in marketing language. Label every report with its date, and separate old findings from the most recent assessment.

## Preparing before admission

Preparation may include ${family.preparation}. The hospital should provide patient-specific instructions after reviewing the records; online articles cannot replace those instructions.

Before leaving home, confirm which medicines to continue or stop, whether fasting is needed, which tests will be repeated, whether blood or special devices must be arranged, who signs consent, and what may postpone the procedure. Bring medicines in original packaging and carry a readable list of doses. Never stop a prescribed medicine solely because a website mentions it.

If someone is travelling with you, agree who will manage the admission location, coordinator and clinical contacts, payment records, nearby accommodation and escalation route. This matters most when you may not be able to manage calls, forms or mobility independently.

## Procedure pathway in India

1. **Pre-travel review.** You share the minimum case details and give consent before records go to selected hospitals. The file is checked for missing reports and image files.
2. **Written specialist response.** The hospital states what it reviewed, its preliminary understanding, the proposed next step, missing tests and estimate assumptions. “Final plan after examination” should be treated as an important limitation, not fine print.
3. **Arrival and reassessment.** Registration, examination, updated tests, imaging review and anesthesia or medical clearance may confirm or change the preliminary plan.
4. **Consent and treatment.** The treating clinician explains the procedure, alternatives, material risks and expected course. You should have time to ask questions before signing.
5. **Hospital recovery.** The team monitors the problems most relevant to the procedure, starts mobility or other recovery tasks and adjusts medicines.
6. **Discharge preparation.** You receive written instructions, a medicine list, warning signs, follow-up dates and any procedure-specific device, wound, diet or activity guidance.
7. **Local follow-up and return.** The treating team reviews early recovery and decides when further travel is reasonable. You and your home clinician receive the final record packet.

## What recovery may involve

Recovery planning commonly covers ${family.recovery}. The hospital should translate this into a personal schedule: what is expected in the first 24 hours, before discharge, during the local hotel stay and after the patient returns home.

Ask what you are expected to do independently at discharge. Will you need help walking, using the bathroom, managing drops or injections, following a modified diet or monitoring symptoms? Clarify whether you need a companion, nurse, rehabilitation stay or longer admission. The answer affects both safety and the true trip budget.

Return-flight timing is not a fixed internet number. The treating team must consider the procedure, symptoms, wound or access site, infection and clot risk, medicines, mobility, required follow-up and what care is available at the destination. A flexible ticket is often easier to manage than a schedule built around the shortest advertised stay.

## Risks, side effects and warning signs

Every treatment has risks, and the relevant risks are not identical for every patient. Ask the clinician to separate common temporary effects from less common but serious complications, then explain which personal factors increase risk. The consent discussion should also cover what the hospital does if the planned procedure cannot be completed or if an unexpected finding changes the approach.

Before discharge, obtain a written warning-sign list and a 24-hour contact route. Severe or rapidly worsening symptoms, breathing difficulty, chest pain, fainting, new weakness, uncontrolled bleeding, high fever, confusion, sudden visual change or another emergency should be assessed urgently through local medical services rather than managed through a travel coordinator. The exact warning signs for ${profile.topic} must come from the treating team.

## What changes the estimate

| Estimate driver | What to request in writing |
| --- | --- |
${driverRows}

Any quote should show the date, hospital branch, records reviewed, procedure assumptions, included stay, device/implant/medicine assumptions, exclusions and validity. Generic online prices should be treated as orientation only.

The cheapest headline may exclude the item that matters most: a device, donor material, medicines, pathology, imaging, rehabilitation, extra ICU time or a second planned stage. Compare estimates line by line and ask hospitals to revise unclear entries before paying. Your wider budget should also include flights, visa processing, accommodation, meals, local transport, companion costs, medicine refills and a contingency for additional days.

## Questions to ask the hospital

${bullets(profile.questions)}

Also ask: Who will perform the treatment and who covers if that clinician is unavailable? Which hospital branch is named in the estimate? What findings could cancel or delay the procedure? What is the plan if the treatment does not proceed? Which documents will be available at discharge? Can the home doctor speak with the treating team if follow-up questions arise?

${glossaryMarkdown(path)}

## Where readers usually enter this journey

Some readers are seeking a first specialist opinion. Others already have a recommendation but cannot explain it to their family. A third group is comparing two written plans that use different assumptions. Caregivers often arrive with a fourth problem: the reports are scattered across phones, portals and old discharge files.

For ${profile.topic}, the coordinator should first understand which situation applies to you. A first opinion needs a different workflow from a comparison between two procedure quotes. If your reports are incomplete, organize them before hospital routing. If your symptoms are severe or unstable, seek local clinical help before continuing a travel plan.

## What a strong hospital response should say

A strong response should not read like a brochure. It should tell you what records were reviewed, how the hospital understands the diagnosis or procedure need, what information is still missing, what option is being proposed, what alternatives may exist, what the estimate includes, what is excluded, what could change after arrival and how follow-up will work after discharge.

If the response skips the clinical assumptions and gives only a price, the patient cannot know whether the quote matches the case. If the response is clinically detailed but omits exclusions, the family cannot plan the real budget. The safest comparison needs both pieces together.

## Hospital comparison table

| What to compare | Strong answer | Weak answer |
| --- | --- | --- |
| Diagnosis basis | Names the reports reviewed and dates. | Gives a price without medical assumptions. |
| Procedure scope | States the exact procedure or treatment sequence. | Uses a broad label only. |
| Alternatives | Explains why other options are or are not suitable. | Pushes one option with no reasoning. |
| Estimate | Lists inclusions, exclusions, stay and validity. | Only gives a headline number. |
| Follow-up | Explains what happens after discharge and at home. | Ends at admission or payment. |

## The journey beyond the hospital room

${lens.travel}

For ${profile.topic}, travel planning should also include a practical back-up plan: where the patient stays if extra tests are needed, who speaks to the hospital if symptoms change, what happens if the procedure is delayed, how medicines are refilled, whether the home doctor can receive discharge documents and what symptoms should trigger urgent local care after return.

## Planning the return-home handoff

Do not let the care journey end with a flight. Before discharge, request the final diagnosis, procedure or treatment note, discharge summary, medication reconciliation, investigation results, pathology where relevant, implant or device details, image files, bills, follow-up schedule and warning signs. Check that names and dates are correct while the patient is still nearby.

Arrange a home-clinician appointment before travel when continuing care will be complex. Share the India team's contact details and ask which tests must be repeated locally. If medicines require monitoring, confirm where prescriptions and laboratory checks will come from. If a device, catheter, stent, drain, suture or dressing remains, identify who will manage or remove it and on what date.

## What can change after arrival

Even a good pre-travel estimate can change after examination, fresh imaging, labs, anesthesia review, infection testing, pathology review or your informed preferences. This does not automatically mean the hospital acted wrongly; it means the pre-travel response was based on available records. Ask the hospital to label what is confirmed, what is assumed and what remains uncertain.

The family should keep travel and payment decisions flexible enough to handle reasonable changes. The worst pattern is a rigid flight, a vague quote and no home follow-up plan.

## What Canopus Care can coordinate

Canopus Care can assemble your records, request current hospital responses, normalize estimate assumptions, help you prepare questions, track non-clinical logistics and organize return-home documentation. Medical interpretation and treatment decisions remain with qualified clinicians.

## Patient checklist before submitting the case

- I have the latest report that supports this diagnosis or procedure discussion.
- I know which symptoms are current and which have improved.
- I have a current medicine and allergy list.
- I know whether there has been fever, infection, bleeding, admission or emergency care.
- I can explain what I want from India: first opinion, second opinion, procedure quote, faster access or follow-up plan.
- I understand that Canopus Care coordinates the case but does not choose treatment.
- I will compare written responses before paying a deposit or booking rigid flights.

## FAQ

### Can this page tell me which treatment I need?

No. It explains the decision framework. The hospital team decides suitability after reviewing your records and assessing you.

### Can I get a quote without reports?

Only a rough orientation may be possible. A serious response needs the core records listed above.

### Is India always cheaper?

Not automatically. Compare the full cost: hospital package, exclusions, hotel, flights, companion stay, extra tests, medicines and follow-up.

### Can I compare multiple hospitals?

Yes, but compare written responses against the same records so differences are meaningful.

### How do I know whether a hospital response is genuinely case-specific?

It should name the records reviewed, reflect your diagnosis and history, identify missing information, explain why the suggested option is being considered and state what could change after examination. A response that could be sent unchanged to anyone is not enough for a travel decision.

### Should I choose a hospital from rankings or testimonials?

Use verifiable factors: the relevant clinical program, the proposed treating team, the hospital branch, the written plan, estimate clarity, safety and follow-up arrangements. Rankings and testimonials do not establish that a specific treatment is suitable for a specific patient.

### What should I do if two hospitals recommend different treatments?

Ask each team to explain its reasoning against the same current records. Clarify whether they disagree about the diagnosis, disease severity, treatment goal, medical fitness or available technique. Discuss major differences with a qualified clinician who knows the patient; a facilitator should not decide between competing medical opinions.

# Sources

${sourceLines}
`;
}

const QUESTION_PAGE_CONFIG = {
  "/resources/questions-to-ask-surgeon": {
    role: "surgeon",
    opening: "A surgical consultation can move quickly, especially when you are also comparing hospitals, travel dates and estimates. Use this guide to slow the conversation down and leave with a clear account of what is proposed, why it is being proposed and what remains uncertain.",
    followUps: ["Can you show me the finding on my scan or report?", "What would make you recommend a different option?", "What is the most important risk in my case?", "What will I need help with after discharge?", "Which part of the estimate is most likely to change?"],
  },
  "/resources/questions-to-ask-oncologist": {
    role: "oncologist",
    opening: "An oncology plan may depend on pathology, stage, tumor biology, previous treatment and results that are still pending. Use this guide to understand the sequence, not simply the name of the next treatment, and to clarify which parts of care can continue near home.",
    followUps: ["Which report confirms that point?", "Is this result final or still under review?", "What is the goal of this treatment?", "Which result will decide the next step?", "What needs to be available near my home between visits?"],
  },
};

function questionToolMarkdown(path, article, page, config) {
  const groups = page.sections.map(([topic, question]) => `### ${topic}\n\n- ${question}\n- What answer would change the proposed plan?\n- Which report, image or test supports the answer?\n- What remains uncertain until examination or further testing?`).join("\n\n");
  return `---
title: "${article.title}"
primary_keyword: "${article.title}"
cta: "Prepare your questions"
---

# ${article.title}

${config.opening}

You do not need to ask every question in one appointment. Mark the five that matter most, write the answers in the clinician's own words and note any report or follow-up action attached to each answer. Canopus Care can organize the questions and records, but only qualified clinicians can interpret findings or recommend treatment.

## Your five essential questions

${page.sections.map(([topic, question]) => `- **${topic}:** ${question}`).join("\n")}

## Ask by topic

${groups}

## Follow-up prompts when an answer is unclear

${config.followUps.map((question) => `- ${question}`).join("\n")}

If you hear unfamiliar terminology, ask the ${config.role} to spell it, explain it without abbreviations and show how it affects your plan. A useful answer should help you explain the decision to someone who was not in the room.

## Record the answer, not just the recommendation

For each major decision, write down the option proposed, alternatives discussed, reason for the recommendation, important personal risks, likely recovery burden, tests still pending and the next decision date. If the plan depends on a fresh scan, pathology review or examination after arrival, label it as preliminary.

## Questions about travel and continuity

- Which parts of assessment or treatment must happen at this hospital?
- What can happen with my clinician at home?
- How long should I remain nearby after the procedure or treatment?
- What symptoms require urgent local care rather than a coordinator message?
- Which documents and images will I receive before returning home?
- Can the treating team answer follow-up questions from my home clinician?

## Questions about the estimate

- Which exact treatment scope is included?
- Which tests, medicines, devices, professional fees and hospital days are assumed?
- What is excluded?
- What finding could change the treatment scope or price?
- When does the estimate expire, and what are the deposit and refund terms?

## Before you finish the appointment

Read back your understanding in one minute: “My understanding is that the team reviewed these records, is proposing this next step for these reasons, still needs these answers and expects this follow-up.” Ask the clinician to correct anything you have misunderstood. Then confirm who owns each next action and when it is due.

## Your consultation note

- **Decision I am trying to make:**
- **Records reviewed:**
- **Working diagnosis or stage:**
- **Proposed next step:**
- **Alternatives discussed:**
- **Important risks or side effects:**
- **Tests or opinions still needed:**
- **Travel and recovery assumptions:**
- **Estimate questions:**
- **Next contact and date:**

## Privacy and role boundaries

Share medical records only through a consented workflow and only with the teams needed for your review. A coordinator can arrange appointments, organize records and document answers; it cannot diagnose, select treatment, change medicines or clear you to travel.

# Sources

${sourceLinesFor(article)}
`;
}

const TOOL_GUIDES = {
  "/resources/medical-record-checklist": {
    intro: "A specialist cannot give a useful opinion from an unlabeled camera roll. This checklist helps you turn reports, scans and treatment history into one file that can be reviewed without guessing what is current.",
    modules: [
      ["Build the one-page case summary", "Write the question you want answered, the diagnosis exactly as recorded, current symptoms, important medical conditions, medicines and allergies. Add the date of the newest clinical review. Do not rewrite uncertain details as facts."],
      ["Name and order every file", "Use dates in YYYY-MM-DD format, followed by the document type: 2026-08-12_pathology-report.pdf. Keep the original report and any translation together. Put the newest report first within each category."],
      ["Send the scan, not only its report", "For CT, MRI, PET-CT, angiography and many X-rays, ask whether the specialist needs the original DICOM images. A PDF report describes what another reader saw; it does not contain the full image set."],
      ["Protect context during translation", "Retain the original-language document, translate every visible field, and label who produced the translation. Never crop the patient name, report date, laboratory units or reference ranges."],
      ["Run a five-minute quality check", "Open every link on a second device. Confirm that names belong to the same person, dates are readable, pages are complete and password instructions are included through the approved secure channel."],
    ],
    worksheet: ["Decision or opinion requested", "Records included and date range", "Missing records", "Imaging files included", "Translation status", "Hospital questions", "Consent confirmed"],
  },
  "/resources/hospital-quote-comparison": {
    intro: "Two totals are not comparable until they describe the same procedure, hospital stay and exclusions. Use this guide to put each hospital response on one set of assumptions before deciding what is genuinely different.",
    modules: [
      ["Freeze the clinical assumptions", "Write the diagnosis, proposed procedure, side or site, implant or device assumption, treating specialty and whether the plan is single-stage or staged. If these differ, resolve the clinical difference before sorting by price."],
      ["Rebuild each total line by line", "Separate professional fees, operating theatre or procedure room, anesthesia, ICU, ward, tests, medicines, consumables, implants, rehabilitation and planned follow-up. Mark an item unknown rather than assuming it is included."],
      ["Expose the exclusions", "Ask about extra hospital days, complications, blood products, repeat procedures, premium devices, take-home medicines, companion costs and taxes. An exclusion is not automatically unfair, but it must be visible."],
      ["Check commercial terms", "Record issue date, validity, currency, deposit, refund or cancellation terms, payment recipient and what causes re-estimation. Verify the hospital branch and beneficiary details independently before transferring money."],
      ["Write the reason for your choice", "Complete the final decision only after the clinical response, follow-up plan and estimate are understood. A defensible reason might be a clearer treatment rationale or better continuity, not merely the lowest headline number."],
    ],
    worksheet: ["Records reviewed", "Exact procedure and team", "Implant or device", "Hospital and ICU days", "Included line items", "Exclusions", "Validity and deposit", "Unresolved questions"],
  },
  "/resources/medical-travel-budget-planner": {
    intro: "The hospital estimate is only one part of an overseas-care budget. This planner keeps treatment, travel and recovery costs separate so a change in one category does not disappear inside a single optimistic total.",
    modules: [
      ["Start with three independent baskets", "Create medical, travel-and-stay, and contingency columns. Keep the hospital's written estimate unchanged in the medical basket; do not silently add hotel or flight assumptions to it."],
      ["Price the itinerary you may actually need", "Include flexible flights, visa charges from official sources, airport assistance, local transport, accommodation near the hospital, meals, laundry and companion expenses. Use dated quotes and state the currency."],
      ["Model a longer recovery", "Add a scenario for extra nights, a changed return flight, additional medicines, follow-up tests and local rehabilitation. This is planning, not a prediction that complications will occur."],
      ["Account for currency and payment friction", "Record the exchange rate used, bank charges, card limits, transfer time, cash rules and whether the hospital accepts the proposed payment method. Recalculate before any large payment."],
      ["Set a decision threshold", "Write who can authorize additional spending and the amount that triggers a family or sponsor review. Keep emergency clinical decisions with clinicians; this threshold governs payment communication, not care."],
    ],
    worksheet: ["Hospital estimate", "Possible medical extras", "Flights and visa", "Accommodation and meals", "Local transport", "Companion costs", "Currency and bank fees", "Contingency owner"],
  },
  "/resources/medical-visa-checklist": {
    intro: "Visa rules change, and a hospital invitation is not a visa approval. Use this checklist to align the current official process with the hospital's proposed dates before committing to non-refundable travel.",
    modules: [
      ["Begin at the official source", "Check the Government of India visa portal and the Indian mission serving your place of residence. Record the page URL and date checked. Do not rely only on an agent's screenshot or an old checklist."],
      ["Ask the hospital for the right letter", "Confirm the patient name, passport number, hospital branch, clinical department, proposed appointment or admission window and companion details where applicable. Ask the hospital to correct errors before submission."],
      ["Plan the attendant application", "Check the current category and relationship-document requirements for each companion. Do not assume that the patient's visa automatically covers a caregiver."],
      ["Keep dates flexible", "Align estimated processing time, hospital availability and passport return before booking rigid flights. Neither a facilitator nor a hospital can guarantee a government decision or processing time."],
      ["Carry an arrival packet", "Keep copies of the hospital contact, invitation, accommodation address, return or onward plan, insurance information where relevant and the records needed at admission."],
    ],
    worksheet: ["Official page and date checked", "Visa category", "Hospital letter verified", "Patient documents", "Attendant documents", "Application reference", "Hospital date flexibility"],
  },
  "/resources/travel-readiness-checklist": {
    intro: "A confirmed hospital date does not by itself mean you are ready to fly. Use three gates: clinical readiness, hospital readiness and journey readiness. A pause at any gate is a task to resolve, not a failure.",
    modules: [
      ["Gate one: clinical readiness", "Ask the appropriate clinician whether the current condition, oxygen needs, infection risk, mobility and medicines make the proposed journey reasonable. Seek local urgent care for deterioration rather than continuing elective travel planning."],
      ["Gate two: hospital readiness", "Confirm the hospital branch, department, named clinical contact where the hospital has assigned one, records reviewed, proposed next step, estimate, admission window and after-hours contact."],
      ["Gate three: journey readiness", "Check airline medical-clearance rules, connection length, wheelchair or oxygen arrangements, accessible accommodation, local transport, companion capacity and passport or visa status."],
      ["Define pause and stop triggers", "Write who to call if symptoms change before departure, which change requires clinician review and which situation means seeking local emergency care. Do not let a paid ticket become a medical reason to travel."],
      ["Rehearse arrival day", "Know who meets you, where you go first, which documents stay in hand luggage, how medicines cross time zones and how the hospital is contacted after hours."],
    ],
    worksheet: ["Clinician travel discussion", "Hospital and clinical contact", "Admission window", "Airline clearance", "Accessible stay", "Companion role", "Pause triggers", "Arrival contact"],
  },
  "/resources/return-home-checklist": {
    intro: "The safest return begins at the discharge desk. Before you leave India, make sure a clinician at home can understand what happened, what must happen next and which symptoms cannot wait for a scheduled call.",
    modules: [
      ["Read the discharge summary before leaving", "Check the diagnosis, procedure or treatment, important results, hospital course, complications, condition at discharge and pending reports. Ask for corrections while the treating team can still verify them."],
      ["Reconcile every medicine", "For each medicine, record the generic name, strength, dose, timing, duration and reason. Clarify what changed from the pre-travel list and which medicines must not be stopped without clinical advice."],
      ["Separate urgent from routine follow-up", "Get written warning signs and the appropriate contact for each. If severe symptoms occur, use local emergency care; an overseas message thread is not an emergency service."],
      ["Book the home-country handoff", "Identify the clinician who will review wounds, blood tests, imaging, rehabilitation or ongoing treatment. Send the packet before the appointment and confirm that image files can be opened."],
      ["Close the document gaps", "Collect pathology, imaging, operative or procedure notes, implant or device cards, prescriptions, invoices and receipts. Record which results are still pending and who will send them."],
    ],
    worksheet: ["Discharge summary checked", "Medicine list reconciled", "Warning signs", "Pending results", "Fit-to-travel discussion", "Home appointment", "Records transferred"],
  },
  "/resources/caregiver-checklist": {
    intro: "A caregiver is often the memory, navigator and practical support for the trip, but not the clinician. Agree on your role before travel so consent, money, medicines and family communication do not become improvised during a stressful day.",
    modules: [
      ["Agree what you are responsible for", "Choose who holds documents, attends consultations with permission, tracks appointments, communicates with family and handles payments. The patient should remain central to decisions wherever they have capacity."],
      ["Prepare for an ordinary hospital day", "Carry identification, a current medicine list, water or food only where permitted, charging cables, a notebook and the day's contacts. Ask staff before helping with mobility, food, wounds or equipment."],
      ["Capture decisions accurately", "Write the question, answer, speaker and next action. Ask clinicians to clarify unfamiliar terms. Do not turn your notes into a diagnosis or alter medicines from memory."],
      ["Protect your own capacity", "Plan sleep, meals, transport and relief coverage. Tell the coordinator early if you cannot safely lift, translate, stay overnight or manage complex instructions."],
      ["Know the escalation route", "Keep the hospital emergency number, treating department, coordinator and local emergency route separate. New severe symptoms go to qualified clinical services, not only to family chat."],
    ],
    worksheet: ["Patient consent preferences", "Document owner", "Clinical update recipient", "Payment owner", "Daily support plan", "Relief caregiver", "Emergency contacts"],
  },
  "/resources/hospital-estimate-glossary": {
    intro: "Hospital estimates compress many assumptions into a few terms. This glossary translates the language into questions you can ask before treating an indicative amount as a budget.",
    modules: [
      ["Indicative estimate", "A preliminary amount based on the information currently available. Ask which records were reviewed and which examination or test could change it."],
      ["Package", "A defined group of services sold together. Ask for the start and end point, room category, assumed length of stay and complete inclusion list."],
      ["Professional fee", "Charges for clinicians involved in care. Ask whether the quoted amount includes the primary consultant, assistants, anesthesia, radiology, pathology and follow-up consultations."],
      ["Consumables, implant and device", "Items used during treatment may be included, capped or billed by actual use. Ask for the assumed model or category and how an upgrade or clinical change affects cost."],
      ["Exclusion, complication and extra stay", "These describe costs outside the package. Ask how they are authorized, communicated and billed, and whether the estimate includes any contingency."],
      ["Validity and re-estimation", "Validity is the period during which assumptions may be honored. Ask what must be reviewed again if treatment, dates, currency or clinical findings change."],
    ],
    worksheet: ["Term used", "Hospital definition", "Included amount", "Cap or limit", "Exclusion", "Question asked", "Written answer"],
  },
};

function specificToolMarkdown(path, article, page) {
  const questionConfig = QUESTION_PAGE_CONFIG[path];
  if (questionConfig) return questionToolMarkdown(path, article, page, questionConfig);
  const guide = TOOL_GUIDES[path];
  if (!guide) throw new Error(`Missing tool guide for ${path}`);
  const rows = page.sections.map(([a, b]) => `| ${a} | ${b} |`).join("\n");
  const modules = guide.modules.map(([heading, body], index) => `## ${index + 1}. ${heading}\n\n${body}`).join("\n\n");
  const worksheet = guide.worksheet.map((item) => `| ${item} |  |  |`).join("\n");
  return `---
title: "${article.title}"
primary_keyword: "${article.title}"
cta: "Use this guide"
---

# ${article.title}

${guide.intro}

Use it as a working document: add dates, owners and written answers. Canopus Care can organize records and communication, but hospitals and qualified clinicians make clinical decisions.

## What you need at a glance

| Area | What to prepare |
| --- | --- |
${rows}

${modules}

## Your working sheet

| Item | Status or answer | Owner and date |
| --- | --- | --- |
${worksheet}

## Before you act on it

Check that every clinical statement came from a qualified clinician or an unchanged source document. Verify current visa or travel rules on official websites. Share health information only with your consent and through an approved channel. Keep urgent symptoms with local emergency services rather than waiting for an overseas response.

# Sources

${sourceLinesFor(article)}
`;
}

function specificPartnerMarkdown(path, article, page) {
  const rows = page.sections.map(([a, b]) => `| ${a} | ${b} |`).join("\n");
  const partnerActions = page.sections.map(([a, b]) => `- **${a}:** ${b}`).join("\n");
  return `---
title: "${article.title}"
primary_keyword: "${article.title}"
cta: "Discuss partnership workflow"
---

# ${article.title}

${page.opening}

${page.contribution}

Canopus Care coordinates structured intake, consent tracking, record readiness, hospital-response comparison, non-clinical travel tasks and return-home documentation. Hospitals and qualified clinicians retain responsibility for diagnosis, treatment advice, medical consent and care delivery.

## Partnership workflow

| Area | Operating standard |
| --- | --- |
${rows}

## Why referrals commonly break down

International cases often arrive as incomplete chat threads: no consent record, uncertain diagnosis, missing image files, an old estimate and no clearly stated question. The receiving team spends time reconstructing the file, while the patient believes a clinical review is already under way. Dates are discussed before medical readiness, and an indicative estimate is repeated as a guaranteed package.

The operating model above prevents that mismatch. Every case has a named owner, a current record index, a consent state, a response status and an unresolved-question list. You and the patient can see the same operational milestones.

## What this is not

This is not a promise of patient outcomes, guaranteed conversion, diagnosis, clinical triage by a non-clinician or permission to send scraped personal data. Every patient workflow needs consent, minimum necessary data and clear role boundaries.

## What a good referral contains

A good referral includes patient permission, diagnosis as written, country, preferred language, report availability, urgency context, desired outcome, financial sponsor if any and the hospital response format needed.

It also distinguishes facts from requests. “Biopsy report dated 4 August attached” is a fact. “Please confirm whether pathology review is required” is a request. “Patient wants to travel next week” is a preference, not clinical clearance. Keeping those categories separate reduces errors and helps the receiving hospital respond precisely.

## Minimum partner actions

${partnerActions}

Each action should have an owner and evidence. Consent should have a date and scope. A hospital response should name the records reviewed. An estimate should identify the branch, assumptions and validity. A handoff should contain documents, not only a promise that documents will follow.

## Operating model

You send or receive only the information needed for the agreed workflow. The patient should know your role, which hospital is reviewing records, what happens next and whether a commercial relationship exists. Clinical questions move to the hospital or the patient's treating doctor rather than remaining with a non-clinical intermediary.

### Stage 1: referral readiness

The referring organization records the patient's goal, consent and minimum case summary. Canopus Care checks document readability and completeness without interpreting medical findings. If the case lacks a key report, it is returned with a specific missing-item request rather than routed as a vague lead.

### Stage 2: hospital review

The selected hospital receives a structured packet through the agreed channel. Its response should identify what was reviewed, what is missing, the preliminary clinical next step, estimate assumptions and the responsible department. Questions outside the facilitator's role go directly to the hospital team.

### Stage 3: patient decision and travel

The patient receives the response in understandable language, with uncertainty preserved. Estimates are normalized so differences in procedure scope, devices, medicines, stay and exclusions are visible. Travel tasks begin only after the hospital and patient have enough clarity to plan responsibly.

### Stage 4: discharge and continuity

The workflow tracks the discharge summary, medication list, procedure or treatment record, follow-up dates, warning signs and home-clinician handoff. A completed treatment is not a completed case until the patient can continue care safely after return.

## Patient communication standard

Every patient-facing message should be clear about what is confirmed and what is still pending. A quote should not be described as final if it depends on examination or fresh tests. A hospital response should not be described as a treatment guarantee. A coordinator should not pressure payment before the patient understands inclusions, exclusions and follow-up requirements.

Use direct status language: “records received,” “awaiting hospital review,” “more information requested,” “preliminary response received,” “estimate clarification pending,” or “travel date confirmed by hospital.” Avoid labels such as “approved” when only an administrative step is complete. Never translate a coordinator's confidence into a clinical promise.

## Handoff requirements

A clean handoff includes the case summary, record list, consent status, hospital response, estimate assumptions, pending questions, travel dates if booked and post-discharge follow-up plan. The receiving party should not need to reconstruct the case from chat history.

## Compliance posture

No unsupported doctor claims, no cure promises, no fake package certainty, no spam outreach and no patient-file sharing without consent. Commercial terms should be documented outside the patient clinical record.

## Success metrics

Useful metrics are not just lead volume. Track record completeness, response clarity, time to hospital answer, estimate comparability, consent capture, patient comprehension, missed-document rate, follow-up handoff completion and complaint/escalation rate.

Measure quality by stage. At intake, track consent and record completeness. At hospital review, track response time and missing-information loops. At decision, track whether the patient received comparable assumptions. At discharge, track whether the home-care packet was completed. Conversion can be reported, but it should never reward pressure, hidden commercial relationships or inappropriate clinical routing.

## Example patient journey

A patient or sponsor asks for help. The partner records the request without making clinical claims. The patient gives consent for case handling. Records are organized into a structured packet. A hospital team reviews the packet and responds with a written plan or missing-record request. The patient compares the response with family and local clinicians. Travel is planned only after clinical and operational readiness are aligned. After treatment, discharge documents and follow-up needs return to the patient and home-care team.

At every stage, the patient can ask who currently owns the action. If the answer is unclear, the case is not ready to advance. That single rule prevents many of the dropped handoffs and conflicting promises that make international care difficult.

## What you receive from Canopus Care

- A structured intake and record index rather than an unfiltered message thread.
- Consent state and permitted recipients before medical documents are routed.
- A standard request format for hospital plan, missing records and estimate assumptions.
- An issue log for unanswered clinical, operational and commercial questions.
- A patient-facing comparison that preserves uncertainty and role boundaries.
- Travel-readiness and return-home checklists attached to the same case.
- An audit trail of actions, approvals and handoffs appropriate to the agreed workflow.

## What Canopus Care needs from you

- A named operational contact and a separate escalation contact.
- Accurate organization and service information with a current verification source.
- Secure, approved channels for patient records.
- Clear response times and a process for unavailable clinicians or departments.
- Written estimate terms, refund or cancellation rules and commercial disclosures.
- Prompt correction when information changes.
- Commitment to patient consent, non-discrimination and honest communication.

## Governance checklist

- Is patient consent captured before sharing records?
- Is the partner role clear to the patient?
- Is the hospital responsible for clinical review?
- Are estimates written, dated and assumption-based?
- Are exclusions visible before payment?
- Are medical claims source-backed and current?
- Is patient data limited to what is necessary?
- Is the return-home handoff tracked?

## Escalation rules

Medical emergencies, severe symptoms, consent disputes, unclear payment terms, missing hospital documents, suspected misinformation and privacy concerns should be escalated quickly. A partnership workflow is only useful if it knows when to slow down, ask for clarification or direct the patient back to qualified clinical care.

## Partnership review questions

1. Can both parties describe the patient journey in the same order?
2. Is responsibility unambiguous at intake, clinical review, payment, travel and discharge?
3. Can the patient see what data is being shared and with whom?
4. Are clinical claims traceable to the hospital or an authoritative source?
5. Can an indicative estimate be distinguished from a final bill?
6. Is there a documented route for complaints, emergencies and privacy requests?
7. Does the workflow still protect the patient when a case does not convert?

## Frequently asked questions

### Does Canopus Care control clinical decisions?

No. Canopus Care organizes and coordinates the pathway. Hospitals and qualified clinicians review medical information, recommend care, obtain medical consent and deliver treatment.

### Can partners exchange patient records immediately after a lead arrives?

Only after the patient has given appropriate permission and the recipients and purpose are clear. The workflow should use the minimum information needed and an approved secure channel.

### Are patient numbers or treatment outcomes guaranteed?

No. Partnership performance depends on patient need, clinical suitability, record quality, hospital response, affordability and patient choice. Commercial expectations must never become treatment or outcome promises.

### How is a pilot evaluated?

Use a small, defined case set and review consent quality, record completeness, hospital response clarity, turnaround time, patient understanding, handoff completion and escalations. Agree any commercial terms separately and document them transparently.

# Sources

${sourceLinesFor(article)}
`;
}

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function parseMarkdown(raw) {
  let md = raw.replace(/^\uFEFF/, "");
  const frontmatter = {};
  const fm = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    md = md.slice(fm[0].length);
    const lines = fm[1].split("\n");
    let active = null;
    for (const line of lines) {
      const listItem = line.match(/^\s+-\s+"?(.+?)"?\s*$/);
      if (active && listItem) {
        frontmatter[active].push(listItem[1]);
        continue;
      }
      const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (!kv) continue;
      active = null;
      const [, key, value] = kv;
      if (!value.trim()) {
        frontmatter[key] = [];
        active = key;
      } else {
        frontmatter[key] = value.trim().replace(/^"|"$/g, "");
      }
    }
  }
  return { frontmatter, md };
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildToc(md) {
  return md.split("\n")
    .map((line) => line.match(/^#\s+(.+)/) || line.match(/^##\s+(.+)/))
    .filter(Boolean)
    .slice(1, 18)
    .map((match) => ({ label: match[1].replace(/\*\*/g, ""), id: slugify(match[1]) }));
}

function enhanceHtml(html) {
  return html
    .replace(/<h([12])>(.*?)<\/h\1>/g, (_m, level, text) => `<h${level} id="${slugify(text)}">${text}</h${level}>`)
    .replace(/<blockquote>/g, '<blockquote class="inline-conversion">')
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

function publicMarkdown(md) {
  return md
    .replace(/^.*\/docs\/content-engine\/09_SOURCE_REGISTER\.md.*(?:\r?\n)?/gim, "")
    .replace(/^\*\*\d+[\u2013-]\d+ minute resource guide\*\*$/gm, "**Comprehensive patient resource guide**")
    .replace(/^## Intake questions Canopus should capture$/gm, "## Questions to prepare before requesting estimates")
    .replace(/^## Intake questions Canopus Care should capture$/gm, "## Questions to prepare before requesting estimates")
    .replace(/\bCanopus Care should\b/g, "The coordinator should")
    .replace(/\bCanopus should\b/g, "The coordinator should")
    .replace(/^## 18–26 minute resource guide$/gm, "## Complete treatment resource guide")
    .replace(/^## 18-26 minute resource guide$/gm, "## Complete treatment resource guide")
    .replace(/^Do not publish a universal “fly home on day 7” claim\.$/gm, "Avoid relying on a universal “fly home on day 7” claim. Flight timing should be discussed with the treating team.")
    .replace(/^Do not publish a universal recommendation between these choices\.$/gm, "There is no universal recommendation between these choices; the right discussion depends on the patient’s anatomy, diagnosis and medical history.")
    .replace(/^Do not publish a universal age cutoff as a Canopus rule\.$/gm, "There is no universal public age cutoff; the treating valve team should assess age, anatomy, frailty, risk and lifetime strategy.")
    .replace(/^Do not publish a universal number of chemotherapy cycles\.$/gm, "There is no universal number of chemotherapy cycles; cycle count depends on diagnosis, stage, protocol, tolerance and oncology review.")
    .replace(/^Do not publish fixed flight or hotel values unless they are current, sourced and time-stamped\.$/gm, "Treat flight and hotel costs as time-sensitive. Check current prices before booking.")
    .replace(/^Display the real `Last medically reviewed` and `Cost data checked` dates separately\..*$/gm, "Look for separate clinical update and cost-check dates, because medical explanations and commercial estimates can age at different speeds.")
    .replace(/^Simple flow arrows; avoid diagnostic thresholds unless reviewed\.$/gm, "Use simple pathway diagrams for orientation, and rely on the treating team for diagnostic thresholds.")
    .replace(/^`Medically reviewed \[date\]`$/gm, "The page should show when clinical content was last reviewed.")
    .replace(/Each disease-specific article should replace these generic scenarios with its medically reviewed pathway\./g, "Disease-specific plans should be confirmed by the relevant oncology team.")
    .replace(/\bCanopus\b(?! Care)/gi, "Canopus Care");
}

function extractSources(md) {
  const sourceBlock = md.match(/# Sources\n([\s\S]*?)(?:\n---|\n# |\n$)/i)?.[1] || "";
  const urls = [...sourceBlock.matchAll(/https?:\/\/[^\s)]+/g)].map((m) => m[0].replace(/[.,;]+$/, ""));
  return [...new Set(urls)].slice(0, 18);
}

const MARKET_SIGNALS = {
  "/treatments/orthopaedics/hip-replacement-india": {
    procedure: "Hip replacement",
    intent: "hip replacement cost in India, hip replacement hospitals India, hip replacement abroad",
    signals: [
      ["AAOS hip replacement patient guidance", "Primary patient-education source for what hip replacement is, how it is planned and how recovery is usually discussed.", "https://orthoinfo.aaos.org/en/treatment/total-hip-replacement/"],
      ["Vaidam bilateral THR", "International-patient bilateral hip replacement signal of about USD 9,000-11,000, with stated hospital and outside-hospital stay assumptions.", "https://www.vaidam.com/search/bilateral-total-hip-replacement/india"],
      ["Bookimed India hip replacement", "Marketplace signal of about USD 4,400-7,300 on average, dependent on implant material, hospital category and surgical technique.", "https://us-uk.bookimed.com/clinics/country%3Dindia/procedure%3Dhip-replacement/"],
      ["Apollo / official hospital estimate", "Use the current hospital quote as the decision document, not a scraped average. The quote must specify implant and stay assumptions.", ""],
    ],
    costDrivers: ["implant material and brand", "cemented vs cementless plan", "unilateral vs bilateral", "primary vs revision surgery", "room category", "ICU need if medically required", "physiotherapy and rehab assumptions", "length of post-discharge stay"],
    records: ["pelvis and hip X-rays", "MRI/CT if already done", "orthopaedic diagnosis note", "pain and mobility history", "medication list", "prior surgery records", "fitness/cardiac notes where relevant"],
  },
  "/treatments/orthopaedics/knee-replacement-india": {
    procedure: "Knee replacement",
    intent: "knee replacement cost in India, robotic knee replacement India, best knee replacement hospitals India",
    signals: [
      ["AAOS total knee replacement patient guidance", "Primary patient-education source for procedure basics, implant concepts and recovery framing.", "https://orthoinfo.aaos.org/en/treatment/total-knee-replacement/"],
      ["Vaidam knee replacement cost page", "Approximate India signal of INR 1.5-3.8 lakh / USD 2,000-6,000, with variation by hospital, surgeon, severity and implant.", "https://www.vaidam.com/knee-replacement-cost-india"],
      ["Bookimed knee replacement India", "Marketplace signal of about USD 3,600-6,600, dependent on technique, implant brand and selected medical center.", "https://us-uk.bookimed.com/clinics/country%3Dindia/procedure%3Dknee-replacement/"],
      ["Hospital-written estimate", "Decision-grade quote should state implant, unilateral/bilateral scope, room, stay, tests, physiotherapy and exclusions.", ""],
    ],
    costDrivers: ["implant type and brand", "unilateral vs bilateral", "robotic/navigation use if proposed", "primary vs revision surgery", "room category", "diagnostics and pre-op clearance", "physiotherapy scope", "length of local stay"],
    records: ["standing knee X-rays", "scan reports if available", "orthopaedic notes", "walking limitation and pain history", "current medicines", "prior injection/surgery records", "fitness notes if available"],
  },
  "/treatments/cardiac/cabg-india": {
    procedure: "CABG / heart bypass",
    intent: "CABG cost in India, heart bypass surgery India, cardiac hospitals India",
    signals: [
      ["American Heart Association CABG patient information", "Patient-facing source for coronary bypass concepts and why cardiac-team review matters.", "https://www.heart.org/"],
      ["My1Health CABG comparison", "Apollo/Kokilaben/Max-style market signal in the USD 6,500-9,000 range for some CABG packages, depending on branch and assumptions.", "https://my1health.com/articles/cost-of-cabg-surgery-India-Apllo-Kokilaben-Max"],
      ["MediGence CABG India", "Aggregator signal that CABG in India can range around USD 5,000-6,000, with variation by patient and hospital factors.", "https://medigence.com/hospitals/cardiac-sciences/cabg/india"],
      ["Hospital cardiac-team estimate", "Decision-grade quote should state bypass count assumptions, ICU/ward days, investigations, medicines, blood products and exclusions.", ""],
    ],
    costDrivers: ["number and complexity of grafts", "on-pump/off-pump approach if proposed", "ICU and ward days", "coronary angiogram review", "blood products and consumables", "comorbidities", "room category", "post-op complications or extended stay"],
    records: ["coronary angiogram report and images", "echo report", "ECG", "cardiology summary", "medication list", "recent labs", "diabetes/kidney/lung history"],
  },
  "/treatments/cardiac/heart-valve-surgery-india": {
    procedure: "Heart valve surgery",
    intent: "heart valve replacement cost India, TAVR cost India, mitral valve repair India",
    signals: [
      ["Apollo valve procedure pages", "Procedure-specific public signals vary materially by open valve surgery, minimally invasive surgery and TAVI/TAVR; one number is not reliable.", "https://www.apollohospitals.com/departments/heart/treatment/surgery/heart-valve-surgery"],
      ["ACC/AHA valve guideline", "Severe valve disease being considered for intervention should be evaluated by a multidisciplinary valve team.", "https://professional.heart.org/en/science-news/2020-acc-aha-guideline-for-the-management-of-patients-with-valvular-heart-disease/top-things-to-know"],
      ["Hospital valve-team estimate", "Decision-grade quote must specify valve, repair/replacement, surgical vs transcatheter approach, device, ICU/ward days and exclusions.", ""],
    ],
    costDrivers: ["which valve is affected", "repair vs replacement", "surgical vs TAVR/TAVI", "mechanical vs tissue valve/device", "single vs double valve", "combined CABG/aortic procedure", "ICU/ward stay", "anticoagulation and follow-up plan"],
    records: ["latest echocardiogram report and images", "cardiology note", "ECG", "medicine list", "TEE/CT if available", "coronary angiogram if done", "previous valve records"],
  },
  "/treatments/oncology/cancer-treatment-india": {
    procedure: "Cancer treatment",
    intent: "cancer treatment in India, oncology hospitals India, cancer treatment cost India",
    signals: [
      ["National Cancer Institute", "Treatment planning depends on diagnosis, stage, pathology, imaging and oncology-team review; generic price pages are weak for oncology.", "https://www.cancer.gov/"],
      ["NCI cancer treatment overview", "Reliable source for explaining that cancer treatment can involve surgery, radiation, medicines and supportive care depending on cancer type and stage.", "https://www.cancer.gov/about-cancer/treatment"],
      ["Hospital multidisciplinary estimate", "Decision-grade oncology response should state what records were reviewed, what is missing, proposed pathway and estimate assumptions.", ""],
      ["Canopus safety rule", "No survival, cure or suitability claims are published without qualified medical review and a source trail.", ""],
    ],
    costDrivers: ["diagnosis and stage", "pathology and molecular testing", "surgery/radiation/systemic therapy mix", "number of cycles", "medicines and supportive care", "imaging frequency", "hospital stay", "complication or infection management"],
    records: ["biopsy and pathology report", "imaging reports and images", "staging workup", "current treatment summary", "prior chemo/radiation/surgery notes", "medicine list", "tumor markers if relevant"],
  },
  "/treatments/oncology/breast-cancer-india": {
    procedure: "Breast cancer treatment",
    intent: "breast cancer treatment in India, breast cancer surgery cost India, oncology hospitals India",
    signals: [
      ["NCI breast cancer staging", "Stage is determined using clinical and pathological information; receptor status and pathology materially affect planning.", "https://www.cancer.gov/types/breast/stages"],
      ["NCI breast cancer treatment PDQ", "Treatment varies by stage, biology and prior therapy; a generic cost cannot replace oncology review.", "https://www.cancer.gov/types/breast/hp/breast-treatment-pdq"],
      ["Hospital oncology-board estimate", "Decision-grade response should identify reviewed records, missing tests, proposed sequence and estimate assumptions.", ""],
    ],
    costDrivers: ["stage and tumor biology", "ER/PR/HER2 receptor status", "surgery type and reconstruction", "chemotherapy/immunotherapy/targeted therapy", "radiation plan", "pathology and genomic testing", "cycle count", "supportive care"],
    records: ["biopsy and histopathology", "ER/PR/HER2 report", "mammogram/ultrasound/MRI", "staging scans", "current oncology summary", "prior treatment notes", "medicine list"],
  },
};

const PROCEDURE_GUIDES = {
  "/treatments/orthopaedics/knee-replacement-india": {
    anatomy: "The knee is a hinge-like joint formed by the femur, tibia and patella. Smooth cartilage normally lets these surfaces glide with low friction. In advanced arthritis, cartilage loss, bone changes, deformity, inflammation and stiffness can make walking, stairs, standing from a chair and sleep difficult. A knee replacement does not replace the whole leg; it resurfaces the damaged joint surfaces and creates a new bearing surface.",
    indications: ["severe osteoarthritis or inflammatory arthritis after clinician evaluation", "pain and functional limitation despite appropriate non-surgical care", "significant joint deformity or instability", "radiographic joint damage that matches symptoms", "failed prior joint-preserving treatment where replacement is clinically appropriate"],
    alternatives: ["weight reduction where appropriate", "supervised strengthening and physiotherapy", "walking aids and activity modification", "pain medicines prescribed by a clinician", "injections when clinically appropriate", "osteotomy or partial replacement for selected patients"],
    procedureSteps: ["The hospital confirms identity, consent, anesthesia plan and operative side.", "The surgeon exposes the knee through an incision and protects surrounding soft tissues.", "Damaged cartilage and a small amount of bone are removed from the femur and tibia using alignment guides or navigation/robotic assistance when used.", "Trial components are placed so the team can assess alignment, stability, range of motion and ligament balance.", "Final metal components and the polyethylene insert are implanted. The kneecap may be resurfaced or left depending on the case and surgeon plan.", "The wound is closed, dressings are applied and recovery monitoring begins."],
    choices: ["Total knee replacement versus partial knee replacement", "cemented versus cementless fixation", "standard versus revision-type implants for complex cases", "robotic/navigation-assisted workflow versus conventional instrumentation", "single knee versus staged/bilateral planning", "patella resurfacing strategy"],
    recovery: ["pain control and early mobilization", "blood-clot prevention plan from the treating team", "walking with walker/crutches initially", "range-of-motion and quadriceps activation exercises", "wound care and infection monitoring", "graduated stair practice and home exercise plan", "return-home flight timing only after clinician clearance"],
    complications: ["infection", "blood clots", "stiffness", "persistent pain", "implant loosening or wear", "fracture", "nerve or vessel injury", "wound problems", "need for revision surgery"],
  },
  "/treatments/orthopaedics/hip-replacement-india": {
    anatomy: "The hip is a ball-and-socket joint. The femoral head moves inside the acetabulum of the pelvis. Arthritis, fracture, avascular necrosis and other conditions can damage the cartilage or bone so severely that walking and daily life become limited. Hip replacement removes the damaged ball and resurfaces the socket with prosthetic components.",
    indications: ["advanced arthritis or avascular necrosis after clinician evaluation", "hip fracture or post-traumatic damage where replacement is appropriate", "severe pain and mobility limitation despite conservative care", "x-ray or MRI findings that match symptoms", "revision of a failed previous hip implant"],
    alternatives: ["physiotherapy and strengthening", "walking aids", "activity modification", "medicines prescribed by a clinician", "injections in selected cases", "joint-preserving procedures when clinically suitable"],
    procedureSteps: ["The hospital confirms side, consent, anesthesia plan and implant assumptions.", "The surgeon uses an anterior, lateral or posterior approach depending on training and case requirements.", "The damaged femoral head is removed and the socket is prepared.", "The acetabular cup and liner are placed, then the femoral canal is prepared for the stem.", "Trial components are checked for leg length, stability and range of motion.", "Final components are implanted and the wound is closed with a post-op mobilization plan."],
    choices: ["total versus partial hip replacement", "cemented versus cementless fixation", "ceramic, metal and polyethylene bearing combinations", "primary versus revision components", "approach selection", "unilateral versus bilateral/staged planning"],
    recovery: ["early standing and walking", "hip precautions if advised", "pain control and wound care", "blood-clot prevention plan", "physiotherapy for walking pattern and strength", "hotel/local stay before flying", "return-home follow-up with implant details"],
    complications: ["dislocation", "infection", "blood clots", "leg-length difference", "fracture", "implant loosening or wear", "nerve or vessel injury", "persistent pain", "revision surgery"],
  },
  "/treatments/cardiac/cabg-india": {
    anatomy: "CABG treats coronary artery disease by creating new routes for blood to reach heart muscle beyond blocked coronary arteries. It does not remove every plaque. It uses grafts, commonly internal mammary artery and/or vein grafts, to bypass narrowed segments selected by the cardiac team.",
    indications: ["coronary anatomy where the cardiac team recommends bypass", "left main or multi-vessel disease in selected patients", "symptoms or risk profile requiring revascularization", "diabetes or heart-function considerations when relevant", "failed or unsuitable PCI in selected cases"],
    alternatives: ["medical therapy", "angioplasty/stenting for selected anatomy", "lifestyle and risk-factor management", "continued monitoring where intervention is not indicated"],
    procedureSteps: ["The team reviews angiogram, echo, labs and anesthesia risk.", "Grafts are harvested from chest/leg/arm depending on plan.", "The heart is accessed through the chest; surgery may be on-pump or off-pump depending on team and case.", "Bypass grafts are sewn beyond blocked coronary segments.", "Blood flow and hemostasis are checked before closure.", "ICU monitoring begins with ventilation, rhythm, blood pressure, drainage and pain control."],
    choices: ["on-pump versus off-pump strategy", "arterial versus vein graft plan", "number of grafts", "combined valve/CABG procedure if needed", "ICU/ward assumptions", "remote consult versus in-person finalization"],
    recovery: ["ICU recovery", "breathing exercises", "sternal wound care", "rhythm monitoring", "walking progression", "medication reconciliation", "cardiac rehabilitation planning", "flight timing after clinician clearance"],
    complications: ["bleeding", "infection", "stroke", "rhythm disturbance", "kidney injury", "lung complications", "wound problems", "graft issues", "extended ICU or hospital stay"],
  },
  "/treatments/cardiac/heart-valve-surgery-india": {
    anatomy: "The aortic, mitral, tricuspid and pulmonary valves direct blood flow through the heart. Disease may narrow a valve, make it leak, or do both. A valve operation or transcatheter procedure is chosen only after the team understands the valve, severity, symptoms, heart function, anatomy and lifetime strategy.",
    indications: ["severe valve disease where a valve team recommends intervention", "symptoms, ventricular changes or other guideline-based triggers", "aortic stenosis being evaluated for SAVR/TAVR", "mitral disease being evaluated for repair/replacement", "combined cardiac disease requiring a planned strategy"],
    alternatives: ["monitoring and repeat echo", "medical management for associated conditions", "surgical repair", "surgical replacement", "transcatheter procedures for selected anatomy"],
    procedureSteps: ["The valve team confirms lesion, severity and imaging.", "Additional TEE/CT/angiography may be requested.", "The team decides repair, replacement or transcatheter pathway.", "For surgery, the valve is repaired or replaced through an operative approach selected by the surgeon.", "For TAVR/TAVI, a transcatheter valve is delivered through a vascular route in selected cases.", "Post-procedure echo, rhythm monitoring and medication planning guide discharge."],
    choices: ["repair versus replacement", "mechanical versus tissue valve", "open/minimally invasive surgery versus transcatheter pathway", "single versus multiple valves", "combined CABG/aortic work", "long-term anticoagulation and home monitoring"],
    recovery: ["ICU or monitored recovery", "rhythm and valve-function checks", "anticoagulation/antiplatelet plan", "wound or access-site care", "repeat echo", "home cardiologist handoff", "return travel clearance"],
    complications: ["bleeding", "stroke", "infection", "rhythm problems", "pacemaker requirement", "kidney injury", "prosthetic valve complications", "anticoagulation bleeding/clotting", "reintervention"],
  },
  "/treatments/oncology/cancer-treatment-india": {
    anatomy: "Cancer treatment is not one procedure. It can involve surgery, radiation, systemic therapy, targeted therapy, immunotherapy, pathology review, imaging, molecular testing and supportive care. The pathway depends on diagnosis, stage, biology, prior treatment and patient condition.",
    indications: ["confirmed or suspected cancer requiring specialist review", "need for multidisciplinary tumor-board opinion", "complex treatment sequencing", "second opinion after pathology/imaging", "international patient seeking a written hospital plan"],
    alternatives: ["local oncology review", "second opinion without travel", "supportive care", "active surveillance for selected cancers", "clinical trial discussion where appropriate"],
    procedureSteps: ["The hospital reviews pathology, imaging and prior treatment.", "Missing diagnostic tests are identified.", "A multidisciplinary team may sequence surgery, systemic therapy and radiation.", "A written plan should specify assumptions and unresolved questions.", "Treatment starts only after clinician consent and patient agreement.", "Response assessment and follow-up are planned before return home."],
    choices: ["surgery-first versus medicine-first sequencing", "radiation timing", "drug regimen and cycle count", "molecular testing", "supportive care needs", "local versus India follow-up split"],
    recovery: ["treatment-cycle planning", "infection and side-effect monitoring", "nutrition and symptom support", "family communication", "response scans", "discharge/return-home summary", "home oncology handoff"],
    complications: ["infection", "bleeding", "treatment side effects", "delayed recovery", "disease progression", "hospital admission during therapy", "financial toxicity", "need to change treatment plan"],
  },
  "/treatments/oncology/breast-cancer-india": {
    anatomy: "Breast cancer planning depends on tumor type, size, lymph-node status, receptor status, grade, stage, imaging and patient priorities. Surgery, chemotherapy, radiation, endocrine therapy, targeted therapy and reconstruction may be sequenced differently for different patients.",
    indications: ["new diagnosis requiring staging and treatment plan", "need for pathology/receptor-status review", "second opinion before surgery or systemic therapy", "complex reconstruction or radiation planning", "international patient comparing oncology centres"],
    alternatives: ["local oncology treatment", "remote second opinion", "neoadjuvant therapy before surgery for selected cases", "breast-conserving surgery versus mastectomy discussion", "supportive/palliative care when relevant"],
    procedureSteps: ["The team reviews biopsy, receptor status and imaging.", "Staging and additional tests are requested if needed.", "A multidisciplinary plan sequences surgery, medicine and radiation.", "Surgery may involve lumpectomy/mastectomy and lymph-node procedure when clinically indicated.", "Systemic therapy and radiation are planned based on pathology and team review.", "Follow-up and surveillance are handed back to local clinicians."],
    choices: ["lumpectomy versus mastectomy", "sentinel node versus axillary surgery", "reconstruction timing", "chemotherapy before or after surgery", "targeted/endocrine therapy", "radiation plan", "fertility preservation discussion where relevant"],
    recovery: ["wound and drain care", "arm/shoulder exercises when advised", "pathology review after surgery", "cycle scheduling", "radiation planning", "lymphedema education", "return-home oncology summary"],
    complications: ["infection", "bleeding", "seroma", "lymphedema", "treatment side effects", "delayed wound healing", "need for additional surgery", "therapy changes after final pathology"],
  },
};

function comparisonRows(rows) {
  return rows.map(([label, value, source]) => `<tr><td><strong>${esc(label)}</strong></td><td>${esc(value)}${source ? `<br><a href="${esc(source)}" rel="nofollow">Source</a>` : ""}</td></tr>`).join("");
}

function listItems(items) {
  return items.map((item) => `<li>${esc(item)}</li>`).join("");
}

function procedureDeepGuide(path) {
  const guide = PROCEDURE_GUIDES[path];
  if (!guide) return "";
  return `<section class="procedure-guide" id="procedure-explained-in-detail">
<h2>Procedure explained in detail</h2>
<p>${esc(guide.anatomy)}</p>

<h3>When doctors may consider this treatment</h3>
<p>The decision is made by the treating clinical team after reviewing symptoms, examination findings, imaging, medical history and patient goals. The points below are not eligibility rules; they are the kinds of factors a hospital may evaluate.</p>
<ul class="checklist">${listItems(guide.indications)}</ul>

<h3>Non-surgical or alternative paths to discuss first</h3>
<p>A world-class resource should not make surgery sound automatic. Many patients need a comparison of conservative care, monitoring, medicine, procedure options and timing before they can make a responsible decision.</p>
<ul class="checklist">${listItems(guide.alternatives)}</ul>

<h3>Step-by-step: what usually happens in the hospital pathway</h3>
<ol class="timeline">${guide.procedureSteps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>

<h3>Important choices that change the plan</h3>
<p>Two patients searching the same keyword can still need very different packages. These choices are exactly why records should be organized first and written hospital responses should be compared instead of presenting one generic package as the answer.</p>
<ul class="checklist">${listItems(guide.choices)}</ul>

<h3>Recovery milestones patients and families should understand</h3>
<p>Recovery is not just discharge from hospital. International patients must plan the inpatient phase, local post-discharge stay, medication access, warning signs, follow-up and the handoff to a doctor at home.</p>
<ul class="checklist">${listItems(guide.recovery)}</ul>

<h3>Risks and complications to ask the hospital about</h3>
<p>This page cannot personalize risk. The hospital should explain patient-specific risks based on age, diagnosis, medical history, reports and the exact treatment plan.</p>
<ul class="checklist">${listItems(guide.complications)}</ul>

<h3>Questions to ask before paying a deposit</h3>
<div class="table-wrap"><table><thead><tr><th>Question</th><th>Why it matters</th></tr></thead><tbody>
<tr><td>What records did the hospital review?</td><td>A quote based on incomplete records is weaker and may change after arrival.</td></tr>
<tr><td>What exact procedure is being proposed?</td><td>Different procedures can have different risks, stay length, devices, recovery and cost.</td></tr>
<tr><td>Who is the responsible consultant/team?</td><td>The patient should know which department owns the plan and follow-up.</td></tr>
<tr><td>What is included in the package?</td><td>Room, stay, tests, medicines, implants/devices and follow-up vary by hospital.</td></tr>
<tr><td>What is excluded?</td><td>Complications, extra stay, blood products, premium devices, rehab, travel and companion costs can be material.</td></tr>
<tr><td>What could change the plan after arrival?</td><td>New tests or examination findings can alter treatment and cost.</td></tr>
<tr><td>When is it safe to fly home?</td><td>Travel timing is clinical and operational; it should be discussed before booking rigid tickets.</td></tr>
<tr><td>What must the home doctor monitor?</td><td>A clear handoff reduces confusion after the patient leaves India.</td></tr>
</tbody></table></div>
</section>`;
}

const FAMILY_PLAYBOOK = {
  ortho: {
    patient: "a patient with painful joint disease or a failed previous joint treatment",
    team: "orthopaedic surgeon, anaesthesia team, physiotherapist, nursing team and medical-clearance physicians when needed",
    tests: ["weight-bearing X-rays or pelvis/hip views", "blood tests and infection screen when requested", "ECG and medical fitness review", "anaesthesia assessment", "implant and fixation discussion", "physiotherapy baseline"],
    localStay: "many orthopaedic patients need enough time in India after discharge to walk safely, practice stairs where relevant, check the wound and receive the first rehabilitation instructions before a long flight",
    homeHandoff: "implant details, wound instructions, physiotherapy plan, medicines, blood-clot prevention instructions if prescribed, warning signs and follow-up dates",
    caregiver: "help with walking support, luggage, hotel transfers, medicine timing, wound monitoring and practical recovery tasks",
  },
  cardiac: {
    patient: "a patient with heart disease being evaluated for an intervention after cardiology review",
    team: "cardiologist, cardiac surgeon or structural-heart specialist, anaesthetist, intensivist, perfusion/cath-lab team, nurses and rehabilitation support",
    tests: ["echocardiogram images and report", "ECG", "angiogram or CT images when relevant", "blood tests and kidney function", "anaesthesia and ICU assessment", "medicine and anticoagulation review"],
    localStay: "cardiac patients need a conservative travel plan that allows monitored recovery, wound or access-site review, medicine adjustment and return-flight clearance from the treating team",
    homeHandoff: "procedure note, discharge summary, medicine list, anticoagulation or antiplatelet instructions, follow-up echo/cardiology schedule and emergency warning signs",
    caregiver: "help with slow walking, breathing exercises, appointment tracking, medicine timing, food restrictions if advised and communication with the coordinator",
  },
  oncology: {
    patient: "a patient with cancer or suspected cancer who needs a multidisciplinary plan rather than a generic package",
    team: "medical oncologist, surgical oncologist, radiation oncologist, radiologist, pathologist, oncology nurses, nutrition/supportive-care staff and coordinators",
    tests: ["biopsy and pathology review", "imaging reports plus images", "stage-defining scans", "receptor, marker or molecular tests where relevant", "prior treatment summaries", "baseline blood tests and performance-status review"],
    localStay: "oncology travel depends on whether the trip is for surgery, radiation, systemic therapy, testing, a second opinion or a combination, so the stay should be built around the proposed sequence rather than a generic number of days",
    homeHandoff: "diagnosis summary, stage and pathology assumptions, treatment plan, medicines, cycle dates, side-effect instructions, response-assessment plan and local oncology follow-up needs",
    caregiver: "help with records, nutrition, infection precautions, appointment timing, side-effect reporting and emotional support during a complex treatment sequence",
  },
};

function familyFor(path) {
  if (path.includes("/orthopaedics/")) return FAMILY_PLAYBOOK.ortho;
  if (path.includes("/cardiac/")) return FAMILY_PLAYBOOK.cardiac;
  return FAMILY_PLAYBOOK.oncology;
}

function cards(items) {
  return items.map(([title, body]) => `<div><strong>${esc(title)}</strong><p>${esc(body)}</p></div>`).join("");
}

function rows(items) {
  return items.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("");
}

function patientFacingScorecard() {
  return `<h3>Hospital comparison scorecard</h3>
<div class="table-wrap"><table><thead><tr><th>Comparison field</th><th>What the patient should receive</th><th>How to use it</th></tr></thead><tbody>
<tr><td>Hospital/program evidence</td><td>Official hospital page or a written hospital response with city, department and checked date.</td><td>Use this to separate current hospital information from old screenshots, generic marketplace text or unsupported claims.</td></tr>
<tr><td>Doctor or team evidence</td><td>Official profile, department relevance, current role and whether the named team actually handles this condition.</td><td>Ask for the responsible consultant or clinical team in writing before you travel.</td></tr>
<tr><td>Clinical proposal</td><td>A plain-language summary of what records were reviewed, what is missing and what the hospital proposes next.</td><td>Compare proposals side by side instead of comparing only price.</td></tr>
<tr><td>Package inclusions</td><td>Procedure, room, stay, tests, medicines, consumables, implant/device where relevant, professional fees and follow-up.</td><td>Check each line so a cheaper quote does not hide a missing device, test, ICU day or follow-up visit.</td></tr>
<tr><td>Exclusions</td><td>Complications, extra stay, blood products, premium implants/devices, additional investigations, rehabilitation, hotel and flights.</td><td>Build a contingency budget before booking rigid travel.</td></tr>
<tr><td>Travel readiness</td><td>Visa letter, tentative admission date, arrival instructions, companion plan, local-stay plan and return-home handoff.</td><td>Move forward only when the medical and operational steps are both clear.</td></tr>
</tbody></table></div>`;
}

function longPatientGuide(path) {
  const data = MARKET_SIGNALS[path];
  const guide = PROCEDURE_GUIDES[path];
  if (!data || !guide) return "";
  const family = familyFor(path);
  const decisionRows = [
    ["Diagnosis fit", `Whether the records support the same ${data.procedure.toLowerCase()} pathway that the patient is searching for.`, "Ask the hospital to list the exact records reviewed and the assumptions it used."],
    ["Timing", "Whether the case is elective, urgent, second-opinion oriented or part of an ongoing treatment sequence.", "Do not make flight decisions until the hospital has reviewed the latest reports."],
    ["Procedure scope", `Whether the proposed plan is a standard ${data.procedure.toLowerCase()}, a staged plan, a combined plan or a revision/complex pathway.`, "Scope changes can change stay length, risk discussion, device needs and estimate assumptions."],
    ["Medical fitness", "Whether other conditions such as diabetes, kidney disease, heart/lung issues, infection risk or medicines require clearance.", "Send the medication list and major medical history early."],
    ["Home-country follow-up", "Whether a doctor at home can monitor wounds, medicines, rehab, scans or treatment cycles after return.", "A weak follow-up plan is a real travel risk, even when surgery goes well."],
  ];
  const timelineRows = [
    ["Before contact", "Collect the latest reports, images, discharge summaries and medication list.", "Do not rely on memory. A coordinator can only route what is documented."],
    ["First coordinator call", "Confirm country, age band, diagnosis, main concern, report availability and desired travel window.", "This is operational triage, not medical advice."],
    ["Record packet", family.tests.join("; "), "Missing reports should be listed clearly before hospital routing."],
    ["Hospital review", "The hospital gives an indicative plan, requests more records or asks for in-person evaluation.", "Treat this as a current response, not a guarantee."],
    ["Quote comparison", "Normalize inclusions, exclusions, device/implant assumptions, stay assumptions and validity dates.", "Compare the written plan and the financial assumptions together."],
    ["Travel readiness", "Visa support, arrival date, accommodation, companion, airport transfer and admission instructions.", "Book travel around the hospital plan and clinical clearance."],
    ["Treatment in India", "Admission, final assessment, consent, treatment, recovery monitoring and discharge planning.", "The treating hospital owns medical decisions."],
    ["Return home", family.homeHandoff, "Carry digital and printed copies, and share them with the local doctor."],
  ];
  const quoteRows = [
    ["Clinical assumption", `The diagnosis and ${data.procedure.toLowerCase()} plan as understood by the hospital.`, "If this line is vague, the quote is weak."],
    ["Records reviewed", data.records.join("; "), "A quote based on old or incomplete records may change after arrival."],
    ["Included hospital stay", "ICU/ward/room days, nursing, routine medicines, investigations and follow-up visits included in package.", "Stay assumptions should match the procedure and patient condition."],
    ["Implant/device/medicine", "Brand, type, model or medicine assumptions where relevant.", "This is often a major cost driver."],
    ["Professional and facility fees", "Surgeon/consultant, anaesthesia, OT/cath lab/radiation/day-care and hospital charges.", "Ask whether all major professional fees are included."],
    ["Exclusions", "Complications, extra stay, blood, premium devices, extra tests, rehab, hotel, flights and companion expenses.", "Budget for exclusions before paying deposits."],
    ["Validity and next step", "Date until which the estimate is valid and what the patient must do next.", "Old estimates should be rechecked."],
  ];
  const faq = expandedFaq(data, family);
  const glossary = glossaryTerms(data);
  return `<section class="patient-guide" id="complete-patient-guide">
<h2>Complete international patient guide</h2>
<p>This is the part most thin medical-tourism pages miss. A patient searching for ${esc(data.intent)} is not only looking for a definition. They are trying to decide whether travel is sensible, what the hospital must review, what the procedure may involve, what can change the estimate, how recovery affects flights and how to compare one hospital response against another. A facilitator can help organize records, collect consent, compare written responses and keep claims tied to sources. It should not diagnose, promise outcomes or make a treatment decision.</p>

<h3>How to read this guide safely</h3>
<div class="quote-grid">${cards([
    ["Education, not medical advice", `This guide explains how ${data.procedure.toLowerCase()} is commonly discussed for international patients. It does not say that a specific patient needs it.`],
    ["Hospital review is required", `A real plan depends on reports, images, examination, medical history and the judgement of the treating ${family.team}.`],
    ["Prices are unstable", "Public price ranges are useful for orientation, but final estimates depend on inclusions, exclusions, devices, medicines, room category, length of stay and complications."],
    ["Facilitator role", "Canopus Care can coordinate records, consent, logistics and comparison. The hospital and clinicians make clinical decisions."]
  ])}</div>

<h3>Decision map before choosing India</h3>
<p>Before you spend money on travel, turn a broad internet search into a structured decision. The safest first question is not “which hospital is cheapest?” It is “what does the hospital believe I need, and what evidence did it use?” Your records, symptoms, prior care and travel constraints all need to be visible. A polished website can make the journey feel simple, but the real work is disciplined comparison.</p>
<div class="table-wrap"><table><thead><tr><th>Decision area</th><th>What it means</th><th>Your action</th></tr></thead><tbody>${rows(decisionRows)}</tbody></table></div>

<h3>What to send first</h3>
<p>You do not need to upload an unfiltered archive. Start with basic case details, then work with a coordinator to assemble a hospital-ready packet. The packet should be clear enough that each hospital sees the same case rather than guessing from scattered message attachments. If images exist on a disc, secure cloud service or DICOM viewer, ask how to share them securely after consent.</p>
<ul class="checklist">${listItems(data.records)}</ul>
<p>For this treatment family, hospitals commonly request or repeat some of the following checks: ${esc(family.tests.join(", "))}. Do not self-order tests from this list without a clinician. The practical point is to know why the hospital may ask for them and why an estimate can remain indicative until the clinical team sees complete information.</p>

<h3>Timeline from first message to return home</h3>
<p>The journey becomes easier to manage when you can see what happens next, what is safe to do online and what must wait for clinical review. The timeline below keeps that boundary visible from the first message through the return-home handoff.</p>
<div class="table-wrap"><table><thead><tr><th>Stage</th><th>What happens</th><th>Why it matters</th></tr></thead><tbody>${rows(timelineRows)}</tbody></table></div>

<h3>What happens before admission</h3>
<p>After the hospital reviews the records, the response may be a written estimate, a request for more tests, a remote consult suggestion or a note that the final plan can only be confirmed after in-person assessment. This is normal and should be explained honestly. The patient should know whether the admission date is tentative, whether fasting or medicine changes are expected, who meets them on arrival and what amount is payable before admission. For high-stakes procedures, a coordinator should encourage the patient to keep a local physician informed before travel.</p>

<h3>Admission day and consent</h3>
<p>On arrival, the hospital usually repeats identity checks, reviews reports, performs fresh assessment and confirms consent. Consent should cover the planned procedure, major alternatives, material risks, possible changes during treatment and financial assumptions. International patients sometimes hear a public package price and assume it is fixed. A better page explains that packages depend on the final hospital plan. If a patient’s examination or fresh tests change the plan, the estimate may change too. This should be discussed before payment, not discovered during discharge.</p>

<h3>During treatment</h3>
<p>The experience varies by specialty, but the patient should expect monitoring, nursing communication, medicine reconciliation and a discharge plan. Families should ask how updates will be shared, which coordinator handles non-medical questions and who answers clinical questions. For ${esc(data.procedure.toLowerCase())}, the patient should understand the major choices that may change the pathway: ${esc(guide.choices.join(", "))}. These choices are not marketing labels; they affect the real clinical and financial plan.</p>

<h3>Discharge and local stay in India</h3>
<p>Discharge from hospital does not always mean the patient is ready for a long flight. ${esc(family.localStay)}. The discharge file should be usable at home, not just understandable to the hospital that produced it. It should include the treatment performed, medicines, restrictions, warning signs, follow-up instructions and who to contact if a concern appears before return travel.</p>

<h3>Companion and family planning</h3>
<p>A companion is often not just emotional support. For this pathway, the companion may ${esc(family.caregiver)}. The page should speak to the companion directly because companions often handle WhatsApp, payments, documents and travel bookings. They need a clear list of what to pack, where to stay, how to reach the hospital, what expenses are outside the hospital quote and what signs require urgent hospital contact.</p>

<h3>Quote anatomy: how to read a hospital estimate</h3>
<p>A world-class treatment page should teach the patient how to inspect a quote. A hospital estimate that says only “package cost” is not enough. The patient should see the assumption behind the package, what records were reviewed, what is included, what is excluded and when the quote expires. Canopus can add value by normalizing quotes into the same structure so the patient is not comparing one all-inclusive document with another narrow headline price.</p>
<div class="table-wrap"><table><thead><tr><th>Quote line</th><th>What it should explain</th><th>Patient check</th></tr></thead><tbody>${rows(quoteRows)}</tbody></table></div>

<h3>Recovery planning by phase</h3>
<div class="guide-grid">${cards([
    ["First 24-72 hours", "The patient is monitored for pain, bleeding, infection risk, mobility or organ-function concerns depending on the procedure. Family updates should come from the clinical team or coordinator channel agreed by the hospital."],
    ["Before discharge", "The patient should receive medicine instructions, warning signs, diet/activity guidance where relevant, wound or access-site advice and follow-up appointments. Ask for clarification before leaving the hospital."],
    ["Hotel or local recovery", "This period is for practical stabilization: walking or daily activity practice where relevant, wound checks, report collection, medicine purchase and confirming that travel documents are ready."],
    ["Return-home period", "The patient should already know which local doctor will review them, what records to share, what symptoms require urgent care and when the India hospital expects follow-up information."]
  ])}</div>

<h3>Red flags before booking travel</h3>
<ul class="checklist">
<li>A provider gives a fixed final price without reviewing core medical records.</li>
<li>The quote does not name the procedure, device, implant, medicine sequence or treatment scope where those items matter.</li>
<li>The hospital response does not state what is excluded.</li>
<li>The patient is pushed to pay before receiving a clear written plan and consent pathway.</li>
<li>The public page claims guaranteed cure, guaranteed success, fixed recovery or exact personal suitability.</li>
<li>The patient has no local doctor or emergency plan for follow-up after returning home.</li>
<li>The travel date is chosen before the hospital comments on fitness, record completeness or timing.</li>
<li>Doctor titles, hospital accreditations, volumes or outcomes are repeated without official current evidence.</li>
</ul>

<h3>Questions to ask the hospital team</h3>
<div class="workbook">
<details open><summary>About diagnosis and suitability</summary><p>What diagnosis are you assuming? Which reports support it? What information is missing? Could the plan change after examination in India? Are there non-surgical, local or staged options that should be considered first?</p></details>
<details><summary>About the procedure or treatment sequence</summary><p>What exact procedure, implant, device, drug regimen, radiation plan or surgical sequence is being proposed? What alternatives exist? What factors would make the team switch from one option to another?</p></details>
<details><summary>About hospital stay and recovery</summary><p>How many ICU, ward, room, day-care or outpatient visits are assumed? What milestones must be reached before discharge? What warning signs should the patient and companion watch for?</p></details>
<details><summary>About cost and exclusions</summary><p>What is included, what is excluded, what can change the cost, what payment is required before admission and how long the quote is valid? How are complications or extra stay billed?</p></details>
<details><summary>About travel and follow-up</summary><p>When can the patient fly, what documents are needed, who provides the discharge summary and what should the home doctor monitor after return?</p></details>
</div>

<h3>Frequently asked questions</h3>
<div class="faq-bank">${faq}</div>

<h3>Plain-English glossary</h3>
<div class="glossary">${glossary}</div>

${planningWorkbook(data, family, guide)}
</section>`;
}

function expandedFaq(data, family) {
  const questions = [
    ["Can I decide from the internet price alone?", "No. Public prices are orientation signals. A real decision needs a written hospital response based on the records, the planned procedure, inclusions, exclusions, room or stay assumptions and the patient’s medical condition."],
    ["Why do hospitals ask for reports before quoting?", `For ${data.procedure.toLowerCase()}, the hospital needs to understand diagnosis, severity, prior treatment, medical fitness and what may change the plan. Without records, the quote is usually broad and may change after arrival.`],
    ["Can Canopus tell me which treatment I need?", "No. Canopus Care is a facilitator. It can organize records, obtain consent, route the case and compare hospital responses. The treating clinicians make diagnosis and treatment decisions."],
    ["What if I do not have all reports?", "Start with what you have. A coordinator can identify missing records and ask hospitals whether an indicative response is possible. Missing records should be clearly marked so the patient understands uncertainty."],
    ["Is a video consultation enough?", "Sometimes a remote consult helps clarify direction, but many plans remain provisional until examination, fresh tests or image review. The hospital should say what can and cannot be confirmed remotely."],
    ["How many hospitals should I compare?", "Enough to understand meaningful differences, but not so many that responses become unmanageable. Comparing two or three complete written responses is often more useful than collecting many vague headline prices."],
    ["What makes one estimate higher than another?", "Different estimates may include different stay lengths, devices, medicines, diagnostics, room categories, professional fees, complication assumptions and follow-up. Always compare line items."],
    ["Should I choose the cheapest hospital?", "The lowest headline price may exclude important items or use different assumptions. Patients should compare clinical plan, team clarity, inclusion detail, exclusions, logistics and follow-up."],
    ["Can a quote change after arrival?", "Yes. Fresh assessment, missing test results, new findings, complications, device changes or extended stay can change the final bill. A good estimate explains what may change."],
    ["What should my companion prepare?", family.caregiver],
    ["When should I book flights?", "Only after the hospital has reviewed records, commented on timing and issued clear admission or appointment guidance. Return flights should remain flexible when recovery or clinical clearance is uncertain."],
    ["What happens if the hospital asks for new tests?", "Ask why the test is needed, whether it affects the plan, whether it must be done in India and how it changes the timeline or estimate. Do not treat new tests as a failure; they may be part of responsible planning."],
    ["How do I avoid repeating my story to every hospital?", "Use one structured case packet: diagnosis, symptoms, reports, images, medicines, prior treatment, travel country, preferred timing and key questions. Canopus can help maintain that packet."],
    ["What should be in the discharge summary?", family.homeHandoff],
    ["Can I continue follow-up at home?", "Often follow-up is shared with a local doctor, but the feasibility depends on the procedure, medicines, wound care, scans, rehabilitation and the home-country medical system. Plan it before travel."],
    ["Are success rates useful?", "Only if they are current, relevant, risk-adjusted and officially sourced. Generic success-rate claims can mislead patients because individual risk varies."],
    ["What if my case is urgent?", "Urgent symptoms should be handled through local emergency care first. Medical tourism planning should not delay emergency evaluation."],
    ["What should I ask about medicines?", "Ask which current medicines to continue or stop, what new medicines may be prescribed, how long they are needed and whether they are available after returning home. Only the treating clinician should change medicines."],
    ["How is privacy handled?", "Patients should avoid posting medical files in public links. Sharing with hospitals should happen after consent, with only the records needed for review."],
    ["Why does Canopus avoid fixed guarantees?", "Because medicine depends on individual condition, hospital findings and clinical judgement. Guarantees of cure, suitability, outcome or exact recovery timing are not responsible."],
    ["What is the difference between a public range and a hospital quote?", "A public range is a market signal. A hospital quote is a current document tied to a patient’s records and the hospital’s assumptions. The quote should explain what it includes, what it excludes and when it expires."],
    ["Why do two hospitals give different plans?", "Hospitals may interpret incomplete records differently, use different clinical pathways, have different devices or implants available, or make different assumptions about stay and follow-up. Ask each hospital to explain its reasoning in writing."],
    ["What if the hospital says final plan after arrival?", "That can be appropriate when examination or fresh tests are needed. The patient should still ask what is likely, what could change, what costs may change and what refund or deposit rules apply."],
    ["How should I compare doctors?", "Use official profiles and written hospital confirmation. Look for specialty relevance and current role, but avoid relying on unsupported claims about volumes, rankings or outcomes."],
    ["How should I compare cities in India?", "City choice affects hospital access, flights, local accommodation, language support, companion convenience and total travel cost. Clinical fit should come before tourism convenience."],
    ["What documents should I carry physically?", "Carry passport, visa documents, hospital invitation if applicable, printed summaries, prescription list, allergy list, key imaging reports, insurance documents if relevant and emergency contacts."],
    ["What should be translated?", "If reports are not in English, ask whether translation is needed before hospital review. Key diagnosis, pathology, imaging impression, medicine names and prior treatment dates should be understandable."],
    ["Can family members speak to the hospital?", "Usually the patient should give consent for family involvement. The coordinator can help clarify who receives updates and which questions are clinical versus logistical."],
    ["What does medical fitness mean?", "It means the treating team evaluates whether the patient can safely undergo the proposed treatment and travel plan. It may involve history, examination, labs, imaging and specialist clearance."],
    ["What if I have diabetes, kidney disease or heart disease?", "Send those records early. Comorbidities can affect anaesthesia, infection risk, medicine planning, ICU need, recovery and quote assumptions."],
    ["What if I am already on blood thinners?", "Do not stop medicines on your own. Tell the hospital exactly what you take, including dose and timing, so the clinical team can advise through the proper channel."],
    ["What should I know about deposits?", "Ask what the deposit confirms, whether it is refundable, what happens if the plan changes and whether the deposit is paid to the hospital or another party."],
    ["What is a medical invitation letter?", "It is a hospital-issued administrative document that may support medical-visa processing. It does not replace clinical clearance or guarantee treatment suitability."],
    ["How much extra budget should I keep?", "This depends on the case, city, stay length and exclusions. Patients should plan for extra stay, medicines, additional tests, companion costs and travel changes instead of spending the full budget on the headline package."],
    ["What happens if recovery is slower than expected?", "The patient may need extra local stay, additional review, medicine changes or delayed travel. This is why flexible return tickets and contingency accommodation are useful."],
    ["Can I travel alone?", "Some patients can, but many procedures are safer and easier with a companion. Ask the hospital whether a companion is strongly recommended for the specific plan."],
    ["What if I need emergency care after returning home?", "Before travel, identify a local doctor or hospital at home. Carry the discharge summary and understand warning signs that require urgent care."],
    ["Can Canopus Care share my reports with many hospitals?", "Reports should be shared only after consent and only with appropriate hospital teams. More sharing is not automatically better; quality of comparison matters."],
    ["What is a second opinion useful for?", "It can clarify diagnosis, staging, procedure options, sequencing or whether travel is necessary. It should be based on records, not only a short message."],
    ["What if the second opinion disagrees with my home doctor?", "Ask for the reasoning and evidence behind the difference, then discuss it with qualified clinicians. Do not treat disagreement as proof that one side is automatically wrong."],
    ["Can treatment start immediately after arrival?", "Sometimes, but not always. The hospital may need fresh assessment, tests, consent, payment clearance, blood arrangements, device planning or scheduling."],
    ["What should I ask about infection prevention?", "Ask about wound care, catheter or line care where relevant, visitor rules, hygiene instructions and warning signs. The hospital should provide procedure-specific guidance."],
    ["What should I ask about pain control?", "Ask what pain control is usually used, how pain is monitored, what medicines go home with the patient and which side effects should be reported."],
    ["What does return-home handoff mean?", "It is the transfer of usable information from the India hospital to the patient and local doctor: diagnosis, procedure, medicines, restrictions, follow-up and warning signs."],
    ["Should I buy travel insurance?", "Patients should explore insurance or assistance options where available, but coverage varies widely and may exclude planned treatment. Read policy wording carefully."],
    ["How do I know if a page is trustworthy?", "Look for clear sources, dates, facilitator boundaries, no cure guarantees, no invented outcomes, and a path to current hospital responses instead of only generic marketing."],
    ["Why are records and images different?", "Reports summarize findings; images let specialists review details directly. For some cases, images can materially affect the plan."],
    ["What if my images are too large to upload?", "Ask the coordinator for a secure sharing method after consent. Do not post sensitive medical files in public links."],
    ["Can the hospital reject my case?", "Yes. A hospital may request more records, suggest local care, decline travel, or say a different specialty is needed. That response can still protect the patient."],
    ["What if I want treatment during a specific week?", "Share the preferred window, but let the hospital confirm feasibility. Specialist availability, operating slots, test timing and medical readiness can affect dates."],
    ["What if my condition worsens before travel?", "Seek local medical care promptly and inform the coordinator. Do not wait for an international plan if symptoms suggest an emergency."],
    ["How should I store all responses?", "Keep hospital responses, quotes, consent messages, payment receipts, visa documents and discharge papers in one folder that the patient and companion can access."],
    ["What should I ask before leaving the hospital?", "Ask what was done, what medicines to take, what activity restrictions apply, when to return for follow-up, what warning signs matter and who to contact."],
    ["Can I combine treatment with tourism?", "Only if the treating team clears activity and travel. Medical recovery comes first; sightseeing can be unsafe or unrealistic after many treatments."],
    ["What if I need rehabilitation?", "Ask whether rehabilitation is inpatient, outpatient, hotel-based or home-based, what it costs, how long it may take and what records the home physiotherapist needs."],
    ["How do I compare a facilitator and a hospital direct desk?", "A hospital desk represents one hospital. A facilitator can help compare multiple written responses, organize documents and support travel logistics, but should be transparent about its role."],
    ["What should never be promised?", "No one should promise cure, guaranteed success, exact personal outcome, fixed final bill in every scenario or definite flight clearance without clinical review."],
    ["What is the safest next step from this page?", "Submit the short form, share records only after consent, ask for a structured record checklist and compare written hospital responses before paying deposits or booking fixed travel."]
  ];
  return questions.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
}

function glossaryTerms(data) {
  const terms = [
    ["Indicative estimate", "A preliminary cost range or quote that may change after full assessment."],
    ["Package inclusion", "A service, test, medicine, room day, device or professional fee included in the quoted amount."],
    ["Exclusion", "A cost not included in the quote, such as complications, extra stay, blood products, premium devices, hotel or flights."],
    ["Clinical clearance", "A clinician’s judgement that a patient can proceed with a treatment or travel plan."],
    ["Multidisciplinary team", "A group of specialists who review complex cases from different clinical angles."],
    ["Second opinion", "A review of diagnosis or plan by another qualified clinical team."],
    ["Medical visa letter", "A hospital-issued document that may support visa processing where applicable."],
    ["Discharge summary", "The document explaining diagnosis, treatment, medicines, follow-up and warning signs after hospital discharge."],
    ["Follow-up plan", "The schedule and responsibility for post-treatment review in India and at home."],
    [data.procedure, `The treatment topic of this page. The exact form of ${data.procedure.toLowerCase()} depends on patient records and hospital review.`]
  ];
  return terms.map(([term, definition]) => `<div><strong>${esc(term)}</strong><p>${esc(definition)}</p></div>`).join("");
}

function planningWorkbook(data, family, guide) {
  const chapters = [
    ["1. Build a one-page case summary", `Write the diagnosis as stated in the latest report, the main symptoms, the treatment already tried, the patient’s age band, major medical conditions, current medicines, allergies and preferred travel window. For ${data.procedure.toLowerCase()}, this summary lets each hospital understand the same starting point. The summary should not exaggerate symptoms or hide prior complications, because missing context can lead to a weak estimate.`],
    ["2. Separate clinical questions from logistics", "Patients often mix medical, travel and price questions in one WhatsApp message. A stronger approach is to group them: clinical suitability, procedure scope, risks, hospital stay, quote inclusions, visa support, accommodation and return-home follow-up. This helps the coordinator send the right question to the right person."],
    ["3. Check record freshness", "Old records may still matter, but hospitals usually want the latest meaningful reports. If symptoms have changed, if new treatment has started, or if the patient has been admitted since the last report, say so clearly. A current estimate based on stale records can be misleading."],
    ["4. Ask what can change after arrival", `For ${data.procedure.toLowerCase()}, the hospital may repeat tests, review images, examine the patient or adjust the plan. Ask for the main reasons the treatment scope, hospital stay or cost could change after arrival. This protects the family from treating the public estimate as a fixed promise.`],
    ["5. Normalize every hospital response", "Create a simple comparison sheet with hospital name, city, responsible department, records reviewed, proposed plan, inclusions, exclusions, stay assumption, quote validity and next step. Do not compare a full hospital response against another hospital’s headline price."],
    ["6. Plan the companion role", `The companion should know how to reach the hospital, where documents are stored, what medicines the patient takes, what bills are paid and who receives updates. For this treatment area, the companion may need to support ${family.caregiver}.`],
    ["7. Keep payment boundaries clear", "Ask who receives the payment, what receipt is issued, what is refundable, what happens if the plan changes and whether additional amounts are paid directly to the hospital. Patients should avoid informal payment pressure that is not tied to a written hospital instruction."],
    ["8. Prepare for the first 48 hours in India", "Confirm airport arrival, SIM/WhatsApp access, hotel or admission plan, emergency contact, hospital appointment time and fasting or medicine instructions if provided by the hospital. Do not make medicine changes unless the treating clinical team instructs through the proper channel."],
    ["9. Understand local stay after discharge", family.localStay],
    ["10. Prepare the home-country handoff", family.homeHandoff],
    ["11. Keep a contingency plan", "Medical travel has uncertainty. Flights can change, tests can be repeated, recovery can take longer and additional medicines or visits may be needed. A responsible page should normalize contingency planning instead of selling the trip as a perfectly fixed package."],
    ["12. Use sources intelligently", "Official medical sources help explain the condition and treatment concepts. Hospital responses explain what that hospital is willing to offer for the patient’s records. Marketplace ranges show public price signals. These are different evidence levels, and patients should not treat them as interchangeable."]
  ];
  const readinessRows = [
    ["Reports", data.records.join("; "), "Send readable copies and note anything missing."],
    ["Questions", `Suitability, alternatives, risks, ${guide.choices.slice(0, 3).join(", ")}`, "Ask in writing before deposit."],
    ["Travel", "Passport, visa route, invitation letter, arrival plan, flexible return date", "Do not book rigid travel before hospital timing is clear."],
    ["Money", "Quote, inclusions, exclusions, validity, deposit, contingency", "Keep a buffer for changes and non-hospital costs."],
    ["Recovery", guide.recovery.join("; "), "Confirm what happens in India and what shifts to home follow-up."],
    ["Safety", guide.complications.join("; "), "Know warning signs and emergency contact paths."]
  ];
  return `<h3>Patient workbook: from search to decision</h3>
<p>This workbook turns the guide into actions. It is designed for the patient, companion or family decision-maker who is comparing India with local treatment, another destination or waiting for more information. It avoids false certainty while still making the next steps concrete.</p>
<div class="chapter-list">${chapters.map(([title, body]) => `<section><h4>${esc(title)}</h4><p>${esc(body)}</p></section>`).join("")}</div>
<h3>Readiness checklist before paying a deposit</h3>
<div class="table-wrap"><table><thead><tr><th>Area</th><th>What to confirm</th><th>Patient action</th></tr></thead><tbody>${rows(readinessRows)}</tbody></table></div>
${advancedDecisionLibrary(data, family, guide)}`;
}

function advancedDecisionLibrary(data, family, guide) {
  const responseRows = [
    ["A hospital gives only one line of price", "Ask for procedure scope, stay assumptions, inclusions, exclusions and validity. A one-line price may be useful for screening, but it is not enough for travel planning.", "Do not pay a deposit until the hospital response becomes specific."],
    ["A hospital asks for more reports", "This can be a good sign when the missing information could affect treatment choice, risk or cost. Ask which reports are essential and whether an indicative estimate is still possible.", "Send missing records through the agreed consent-based channel."],
    ["Two hospitals suggest different approaches", "Ask each team to explain the reason for its approach and what findings would change the plan. Differences can reflect case complexity, not necessarily poor quality.", "Share both explanations with a qualified clinician if uncertain."],
    ["The quote excludes complications", "Most quotes exclude unpredictable complications or extra stay. The question is whether exclusions are visible and whether the patient has a contingency plan.", "Ask how extra days, ICU, medicines, blood products or devices are billed."],
    ["The hospital cannot confirm return-flight timing", "That may be responsible if recovery is uncertain. The patient should avoid fixed return travel until the treating team comments after treatment.", "Book flexible tickets or delay return booking when advised."],
    ["The patient wants the fastest date", "Speed matters, but fastest is not always safest. Records, medical fitness, specialist availability and admission planning should determine timing.", "Ask what must happen before admission is confirmed."],
    ["The family wants a famous doctor", "A famous name is not enough. Confirm current role, specialty fit, team involvement and whether the named consultant will actually assess the patient.", "Ask for written confirmation from the hospital channel."],
    ["The patient has ongoing treatment at home", "The India plan must account for medicines, recent procedures, infections, blood thinners, chemotherapy cycles or other current care.", "Send the latest treatment summary and medicine list."],
    ["The patient is comparing countries", "Compare total pathway, not only surgery price: travel distance, visa, language, follow-up, family support, local doctor access and contingency costs.", "Choose the route that best matches medical and practical risk."],
    ["The patient has limited budget", "A smaller budget increases the need for clarity. Hidden exclusions, extra stay and emergency changes can cause stress after arrival.", "Prioritize complete quotes and contingency planning."],
    ["The patient is nervous about safety", "The answer is not a vague reassurance. The hospital should explain the pathway, monitoring, warning signs, responsible team and escalation process.", "Ask for the patient-specific risk conversation during clinical review."],
    ["The patient lacks a home doctor", "International treatment is weaker without home follow-up. Even a successful procedure may need wound checks, labs, scans, medicines or rehab after return.", "Identify a local physician before travel where possible."]
  ];
  const scenarios = [
    ["I only have a diagnosis name, not reports", `A diagnosis name is a starting point, not a hospital-ready case. For ${data.procedure.toLowerCase()}, the coordinator should ask for the latest reports, images and treatment summary before requesting detailed estimates. If reports truly are unavailable, the hospital may only give a broad indicative response.`],
    ["My reports are old but symptoms are worse", "Tell the hospital that symptoms changed and when. Old reports can still provide history, but worsening symptoms may make fresh evaluation necessary. The patient should not assume that an old estimate still matches the current situation."],
    ["A hospital says I may need a different procedure", `That is possible when the records suggest a different severity, anatomy, stage or treatment sequence. Ask what finding led to the alternative and whether additional tests are needed. The point is to understand the reasoning, not to force the original ${data.procedure.toLowerCase()} keyword.`],
    ["I want a final quote before travelling", "Every patient wants certainty, but some parts of medicine cannot be finalized before examination or fresh tests. A strong hospital response should still explain the likely plan, what is uncertain and what could change the cost."],
    ["The public range online is much lower than the hospital quote", "Check whether the public range excludes room category, device, medicines, tests, ICU, professional fees, complex-case assumptions or extra stay. Public ranges often mix many case types and may not match the patient’s records."],
    ["The public range online is much higher than the hospital quote", "A lower quote can be legitimate, but verify inclusions and exclusions carefully. Ask whether the quote is for the same procedure scope and whether key devices, medicines, tests and stay assumptions are included."],
    ["I am worried about being upsold", "Ask for the clinical reason behind each test, device, implant, medicine or room upgrade. A coordinator can help separate medical requirements from comfort choices and make sure changes are documented."],
    ["I need treatment but have no companion", "Ask the hospital and coordinator whether travelling alone is realistic. Some pathways may require a companion for consent discussions, mobility, medicines, discharge, hotel recovery and emergency contact."],
    ["I want a second opinion but may not travel", "A second opinion can still be useful if it clarifies diagnosis, treatment options or missing records. The response should be labelled as remote review and should not be confused with an admission-ready treatment promise."],
    ["I have already paid another facilitator", "Keep receipts and written commitments. Ask what has been shared with hospitals, whether your records were shared with consent and what obligations exist before changing route."],
    ["I need visa support quickly", "Visa support depends on a hospital response and administrative process. A facilitator can coordinate documents, but it should not imply that medical suitability is guaranteed."],
    ["My family wants several hospital options", "Use the same case packet for every hospital. Otherwise each response may be based on a different version of the facts, making comparison unreliable."],
    ["I am comparing a top brand with a smaller specialist centre", "Brand recognition matters, but it is not the only question. Compare department relevance, team clarity, plan detail, communication, cost assumptions, follow-up and evidence behind claims."],
    ["The hospital response is slow", "Slow response can happen when records are incomplete or the case needs specialist review. Ask what is pending and whether another complete hospital response is available for comparison."],
    ["I have a fixed return date", "Tell the hospital early. A fixed return date may be unrealistic for some procedures or complications. Medical recovery should control travel decisions, not the other way around."],
    ["I am travelling from a country with long flights", "Long flights can affect comfort, clot risk, medication timing, oxygen needs and recovery logistics depending on the condition. Ask the treating team about travel timing and precautions."],
    ["I need help deciding between two quotes", "Put both quotes into the same table: records reviewed, procedure, inclusions, exclusions, stay, device or medicine assumptions, follow-up and total non-hospital costs. The cheaper quote may or may not be better."],
    ["I want to know the best hospital in India", "A universal best-hospital answer is usually misleading. The better question is which hospital has the right specialty team, current response, transparent quote and practical pathway for this patient."],
    ["I do not want to share all personal details yet", "Start with minimum details and ask how data is handled. Detailed hospital review will require medical records and consent, but the patient should understand the sharing process first."],
    ["I am anxious about language and communication", "Ask whether the hospital and coordinator can communicate in a language the patient understands, how clinical consent is handled and whether family members can join discussions with patient permission."],
    ["I need a letter for my employer", "Ask the hospital what documents it can issue and when. Administrative letters should reflect known appointments or treatment plans, not unsupported promises."],
    ["My home doctor disagrees with travelling", "Take that concern seriously. Ask what specific medical risk the home doctor sees and request the India hospital’s response after reviewing the same records. Do not treat travel as the default."],
    ["I want to reduce hotel days", "Hotel days should be planned around clinical review, discharge instructions, follow-up visits and travel clearance. Cutting days may save money but can increase risk or stress."],
    ["I want premium room comfort", "Room upgrades are usually comfort choices unless medically required. Ask how room category affects the quote and whether clinical care differs."],
    ["I have insurance", "Planned overseas treatment may or may not be covered. Ask the insurer about pre-authorization, exclusions, claim documents, cashless options and whether the hospital can provide required paperwork."],
    ["I am worried about hidden costs", "Hidden costs are reduced by asking for exclusions, billing rules for extra stay, device upgrade policy, blood product charges, medicine exclusions, attendant charges and non-hospital expenses."],
    ["I want to bring children or additional family", "Additional family can increase hotel cost and complexity. Check hospital visitor rules, accommodation, transport and whether the companion who handles care duties is clearly identified."],
    ["I need rehabilitation after treatment", "Ask whether rehab starts in hospital, continues as outpatient care in India or shifts home. Get exercises, restrictions, milestones and red flags in writing."],
    ["I have had previous surgery or treatment", "Prior treatment can change anatomy, risk, device choice, recovery and estimate. Send operative notes, implant cards, pathology, radiation summaries or discharge records where relevant."],
    ["The quote has no expiry date", "Ask for validity. Prices, exchange rates, room availability, medicines and device costs can change. A stale quote should be rechecked before payment or travel."],
    ["I need a coordinator but not pressure", "A good coordinator should make steps clearer, not pressure payment. The patient should receive written information, consent choices and enough time to ask questions."],
    ["I am not sure India is right for me", "That uncertainty is legitimate. Compare local care, remote second opinion, another destination, medical risk, support system and total cost before deciding."]
  ];
  return `<h3>How to interpret common hospital responses</h3>
<p>Patients often receive different answers from different providers and do not know whether the difference is a warning sign or normal clinical variation. The table below makes those responses easier to interpret without turning Canopus Care into the medical decision-maker.</p>
<div class="table-wrap"><table><thead><tr><th>Response</th><th>What it may mean</th><th>Patient action</th></tr></thead><tbody>${rows(responseRows)}</tbody></table></div>
<h3>Real-world decision scenarios</h3>
<p>These scenarios are written for the person actually making the decision: the patient, spouse, adult child, sibling or friend comparing hospitals on WhatsApp. They are intentionally practical because high-intent visitors need more than definitions.</p>
<div class="scenario-list">${scenarios.map(([title, body]) => `<section><h4>${esc(title)}</h4><p>${esc(body)}</p></section>`).join("")}</div>
${searchIntentLibrary(data, family, guide)}`;
}

function searchIntentLibrary(data, family, guide) {
  const intents = [
    ["Cost of treatment in India", `People searching this phrase need more than a number. They need to know which version of ${data.procedure.toLowerCase()} the number refers to, what is included, what is excluded, whether the hospital reviewed records and how long the estimate is valid.`],
    ["Best hospitals in India", "This search should be answered with a comparison method, not a universal ranking. The patient needs specialty relevance, current hospital response, named department, transparent quote and a follow-up pathway."],
    ["Best doctors in India", "Doctor selection should use official profiles and written hospital confirmation. A public article should not invent titles, volumes or success rates. Ask who is responsible for review, procedure and follow-up."],
    ["Treatment package", "A package should specify procedure, room category, stay, tests, medicines, professional fees, devices or implants where relevant, follow-up visits and exclusions. If these are absent, the word package is not enough."],
    ["Surgery abroad", "Travelling abroad changes the decision. The patient must evaluate visa, flight distance, companion support, return-home follow-up, medical fitness, total cost and what happens if recovery is delayed."],
    ["Medical visa", "Visa support usually begins after a hospital reviews the case and issues appropriate documentation. A visa document supports travel administration; it is not a clinical suitability decision."],
    ["Second opinion", "A second opinion should clarify diagnosis, missing tests, treatment sequence and alternatives. It can be useful even if the patient does not travel, provided the hospital knows the limits of remote review."],
    ["Recovery time", `Recovery for ${data.procedure.toLowerCase()} is individual. Public pages can explain phases and planning questions, but the treating team must advise activity, follow-up and flight timing.`],
    ["Risks and complications", "Patients should see a clear risk conversation without alarmism or promises. Risk depends on the procedure, medical history, age, medicines, diagnosis, hospital findings and recovery."],
    ["Robotic or minimally invasive option", "Technique labels can be useful, but they should not become marketing shortcuts. Ask whether the option applies to the patient, what it changes, what it costs and what evidence the hospital used."],
    ["Implant, device or medicine brand", "Brand may affect cost and pathway, but the patient should ask why a specific item is proposed, whether alternatives exist and how it appears in the quote."],
    ["Length of hospital stay", "Stay length should be shown as an assumption, not a guarantee. ICU days, ward days, day-care visits, complications and recovery milestones can change the plan."],
    ["Can I fly after treatment", "The answer must come from the treating team. Long flights, mobility, wound condition, medicines, oxygen needs and complication risk can matter depending on the case."],
    ["How much money to carry", "Patients should budget beyond the hospital quote: hotel, food, local transport, extra stay, medicines, companion expenses, tests and changed flights. Payment rules should be written."],
    ["Is India safe for treatment", "Safety is not a slogan. Ask about hospital process, responsible team, infection precautions, emergency escalation, discharge planning, follow-up and how complications are handled."],
    ["Can I bring a companion", "A companion often improves practical safety. Ask about attendant rules, accommodation, visitor policy, discharge training and who communicates with the coordinator."],
    ["What if I need ICU", "The quote should say whether ICU is included and for how long. Extra ICU can be a major cost driver and should be part of the contingency conversation."],
    ["What if I need blood products", "Ask whether blood products are included, excluded or billed separately, and whether donors or blood-bank steps are needed. Policies vary by hospital and procedure."],
    ["What if my case changes", "The plan can change after fresh tests, examination, complications or new findings. The patient should ask how changes are explained, approved and billed."],
    ["How Canopus Care helps", "Canopus Care helps by structuring the case, collecting consent, routing records, comparing written hospital responses and coordinating logistics. It does not diagnose or replace doctors."],
    ["Why source links matter", "Medical explanations should point to reliable sources, while cost and hospital details should be checked for currentness. A source link is not decoration; it tells the patient what level of evidence they are seeing."],
    ["Why one page cannot personalize care", "A page can educate and prepare questions, but personal suitability depends on records, examination and clinician judgement. This boundary protects patients from false certainty."],
    ["How to prepare for the coordinator call", "Have the diagnosis, country, age band, main concern, report availability, medicines, prior treatment and travel window ready. The goal is to turn scattered questions into a hospital-ready case."],
    ["How to compare non-hospital costs", "Flights, hotel, meals, local transport, companion stay, translation, SIM card, extra medicines and flexible return tickets can materially change the real cost."],
    ["How to handle uncertainty", "Ask each provider to label what is confirmed, what is assumed, what is missing and what may change after arrival. Clear uncertainty is better than confident vagueness."],
    ["How to protect privacy", "Share only necessary records, after consent, through secure channels. Avoid public links and do not send documents to providers that are not being actively evaluated."],
    ["How to involve home doctors", "Home doctors can help assess travel risk, manage chronic medicines and handle follow-up. Share the hospital response and discharge summary with them."],
    ["How to avoid rushed decisions", "Use a written comparison sheet, confirm payment rules, ask for exclusions and sleep on major decisions when medically safe. Pressure is not a substitute for clarity."],
    ["How to know the page is current", "Look for update dates, checked source links and language that admits volatile information can change. Old cost pages should be rechecked before decisions."],
    ["What to ask if travelling from Africa", "Long travel distance, visa timing, currency conversion, companion logistics and follow-up access can be major issues. Ask whether the hospital can coordinate arrival timing, discharge documents and a follow-up plan suitable for the home country."],
    ["What to ask if travelling from the Gulf", "Patients from Gulf countries may compare India against local private care or other regional destinations. The practical comparison should include flight time, language comfort, appointment speed, total stay and whether home follow-up is easy."],
    ["What to ask if travelling from the UK or Europe", "Patients may be comparing waiting time, private local prices and travel burden. They should ask how records are transferred, whether a home GP or specialist can follow up and what documents are needed for continuity of care."],
    ["How currency changes affect estimates", "Quotes may be issued in INR, USD or another currency. Exchange rates, bank fees and payment timing can change the real cost. Ask what currency the hospital accepts and how long the quoted amount is valid."],
    ["How to compare hotel recovery options", "The cheapest hotel may not be appropriate after treatment. Consider distance to hospital, lift access, food, hygiene, companion comfort, transport, emergency route and whether follow-up visits are easy."],
    ["How to plan airport transfers", "Airport transfer is not just convenience after a procedure. Ask who receives the patient, how luggage is handled, what happens after late-night arrival and who to call if symptoms worsen during transit."],
    ["How to organize medicines for travel", "Carry the current prescription list and ask the treating team what medicines should be continued, paused or replaced. Patients should not make medicine changes from website content."],
    ["How to manage allergies and prior reactions", "All allergies, prior anaesthesia issues, contrast reactions and major medicine side effects should be visible in the case packet. These details can affect tests, medicines and procedural planning."],
    ["How to communicate pain or symptoms", "Patients should describe symptoms plainly: location, duration, triggers, severity, progression and what helps. Clear symptom history helps hospitals interpret reports and decide what information is still missing."],
    ["How to avoid duplicate tests", "Send readable copies of recent tests and ask whether they can be accepted. Some tests may still be repeated for safety, freshness or hospital protocol, but the reason should be explained."],
    ["How to decide between local care and travel", "Travel may make sense for cost, access or expertise, but local care may be safer for urgent, unstable or follow-up-heavy situations. Ask both local and destination clinicians about risk before deciding."],
    ["How to prepare for a remote consult", "Have reports open, write down questions, keep medicine names available, join with a family member if desired and ask what the consult can confirm versus what requires in-person assessment."],
    ["How to compare treatment timelines", "One hospital may propose faster admission while another requests more preparation. Faster is not automatically better; compare why each timeline differs and what must happen before treatment starts."],
    ["How to judge coordinator quality", "A good coordinator asks for consent, clarifies missing records, avoids medical advice, documents answers and does not pressure payment. The patient should feel more organized after the call, not more confused."],
    ["How to handle disagreement inside the family", "Use the written comparison sheet to move the discussion from emotion to facts: medical plan, risks, total cost, travel burden, home support and what each clinician has actually said."],
    ["How to prepare children or dependents at home", "If the patient is a caregiver, the family should plan responsibilities during travel and recovery. Medical tourism decisions often affect the whole household, not only the patient."],
    ["How to check whether follow-up is realistic", "Ask whether follow-up requires physical visits in India, video calls, local tests, wound checks, scans or specialist review. If the home setting cannot support follow-up, travel may need reconsideration."],
    ["How to read testimonials carefully", "Testimonials can describe experience but do not prove personal suitability or outcomes. Clinical decisions should rely on records, qualified review and current hospital responses."],
    ["How to avoid outcome guarantees", "Any promise of guaranteed cure, guaranteed success or exact recovery should be treated skeptically. Responsible providers explain uncertainty and patient-specific risk."],
    ["How to prepare for discharge billing", "Before discharge, ask for an itemized bill, medicines, receipts, discharge summary, implant or device cards where relevant and contact details for post-discharge questions."],
    ["How to keep continuity after returning home", "Send the discharge summary to the local doctor, keep follow-up dates visible, store medicine instructions safely and contact the India hospital through the agreed channel if concerns arise."],
    ["How to choose the next best action", "If records are incomplete, complete the record packet. If quotes are vague, ask for line items. If clinical plans differ, ask for reasoning. If travel risk is unclear, involve a qualified clinician before booking."],
    ["What if the patient is elderly", "Age alone should not be treated as the only decision point. Frailty, heart and lung function, medicines, mobility, cognition, support at home and procedure-specific risk all matter. Ask the treating team what additional precautions apply."],
    ["What if the patient has mobility limits", "Mobility affects airport movement, hotel choice, hospital transfers, fall risk and discharge planning. Ask whether wheelchair support, physiotherapy, accessible rooms and companion help are needed before and after treatment."],
    ["What if the patient has had complications before", "Prior infections, bleeding, anaesthesia problems, clots, ICU admission or delayed wound healing should be disclosed early. These details may change risk discussion, preparation and estimate assumptions."],
    ["What if reports mention severe disease", "Do not panic from a report phrase alone. Ask the hospital to explain severity in context, what options are available, what is urgent and what can safely wait for planned travel."],
    ["What if the patient wants privacy from extended family", "Consent and communication preferences should be clear. The patient can decide who receives updates, who sees documents and who participates in calls, subject to hospital policy and legal requirements."],
    ["What if the patient needs nutrition support", "Some patients need nutrition review before or after treatment. Ask whether diet, supplements, swallowing issues, weight loss, diabetes control or treatment side effects require special planning."],
    ["What if the patient cannot stay long in India", "A short stay may not match the medical pathway. Ask the hospital what minimum local stay is sensible, what follow-up can happen remotely and what risks increase if the patient leaves early."],
    ["What if the patient wants multiple procedures", "Combining procedures can increase risk, stay, recovery time and cost. Ask whether the hospital recommends staging, whether one procedure should take priority and how recovery would be monitored."],
    ["What if the patient is worried about hospital infection", "Ask about infection-prevention process, wound care instructions, visitor rules and warning signs. Avoid providers that respond only with vague reassurance and no practical steps."],
    ["What if the patient needs documents for financing", "Ask for a written estimate with hospital details, validity date, inclusions and exclusions. Financing decisions should use current documents, not screenshots from public pages."],
    ["What if the patient changes destination", "Keep the record packet organized so it can be reused with consent. Do not assume a quote from one destination applies to another; hospital protocols, devices, medicines and billing rules differ."],
    ["What if the patient wants to speak to a previous patient", "Some providers may offer references with consent, but privacy must be respected. Testimonials can support confidence but cannot replace clinical review or current hospital documentation."],
    ["What if the patient is not ready to upload reports", "The patient can still ask process questions first. Detailed hospital responses will require records later, but the trust-building step can begin with a clear explanation of consent and privacy."],
    ["What if a provider criticizes all competitors", "Be careful with fear-based selling. A responsible comparison explains evidence, scope, inclusions and risks without relying on unsupported attacks."],
    ["What if the patient wants everything handled by WhatsApp", "WhatsApp is convenient, but major decisions should still be backed by written hospital documents, source links, receipts, discharge papers and clear consent records."],
    ["What if the family asks for a same-day answer", "A same-day operational response may be possible, but clinical review can take longer when records are complex or incomplete. It is better to receive a slower, specific hospital response than a fast answer built on guesses."],
    ["What if the patient has already booked tickets", "Tell the coordinator immediately. The hospital may still need to confirm whether the date is realistic. If timing is unsafe or records are incomplete, changing the ticket may be wiser than forcing the medical plan."],
    ["What if the patient worries about food and daily needs", "Daily needs matter during recovery. Ask about diet restrictions, nearby food options, hotel kitchen access, drinking water, companion meals, laundry, pharmacy access and how to reach the hospital outside appointment hours."],
    ["What if the patient needs religious or cultural support", "Ask early about prayer space, food preferences, modesty needs, family participation and language. These are practical comfort issues and should be planned without changing clinical decision-making."],
    ["What if the hospital asks for originals", "Carry originals when required, but keep digital copies and photos in a secure folder. Ask which originals are needed for admission, billing, insurance, visa, pharmacy or discharge documentation."],
    ["What if the patient uses alternative medicines", "Tell the treating team about supplements, herbal products and traditional medicines. Some can affect bleeding, anaesthesia, liver function or drug interactions, so they should not be hidden."],
    ["What if the quote is in a different currency", "Ask whether payment is collected in INR, USD or another currency, how exchange is calculated and whether card, bank transfer or cash rules apply. Currency mismatch can create avoidable stress at admission."],
    ["What if the patient wants to delay after receiving quotes", "Delays are common, but the patient should ask when records or estimates need refreshing. Medical condition, symptoms, prices, hospital availability and visa documents can all change over time."],
    ["What if the patient is choosing between speed and certainty", "Speed can help when access is the problem, but certainty comes from complete records, clear assumptions and qualified review. The best next step depends on urgency, stability and what is still unknown."],
    ["What if the patient feels overwhelmed", "Use a simple sequence: collect records, submit the case, compare written responses, ask unresolved questions, confirm travel readiness, then decide. Breaking the process into steps reduces pressure and improves the quality of the decision."],
    ["What if the family wants one simple recommendation", "A simple recommendation can be helpful only after qualified review. Before that, the safer answer is a structured comparison: what each hospital reviewed, what it proposes, what is uncertain, what it costs and what follow-up will require."],
    ["What a good next step looks like", "The next step is not blind payment. It is a structured case review, consent-based record sharing, current hospital responses and a side-by-side comparison the patient can understand."]
  ];
  return `<h3>Answers to common planning questions</h3>
<p>These are the practical questions families often ask before they contact a facilitator. Each answer is designed to help you make a specific decision rather than leave you with another broad description.</p>
<div class="scenario-list">${intents.map(([title, body]) => `<section><h4>${esc(title)}</h4><p>${esc(body)}</p></section>`).join("")}</div>
<h3>What to prepare before hospital review</h3>
<p>Before a hospital receives a case, it helps to prepare the patient’s country, preferred language, diagnosis as written in reports, current symptoms, treatment already received, major medical conditions, medicines, allergies, report availability, preferred travel window and whether a companion is available. For ${esc(data.procedure.toLowerCase())}, the high-impact variables are: ${esc(guide.choices.join(", "))}. This preparation does not replace medical review. It makes the hospital response faster, clearer and easier to compare.</p>
<h3>What the patient should receive after hospital routing</h3>
<p>A strong response should include the records reviewed, the hospital’s provisional understanding of the case, the proposed next step, missing information, expected hospital stay, estimate assumptions, inclusions, exclusions, validity date, travel or admission instructions and follow-up expectations. If the response is only a price, it should be treated as incomplete. If the response is clinical but lacks cost assumptions, it is not ready for travel planning. The patient needs both.</p>
<h3>Use the guide at your own pace</h3>
<p>Medical travel is a high-trust, high-cost decision. You may not need every section today. Start with the quick answer and records list, then return to procedure, estimate, recovery and travel sections as those decisions become relevant.</p>
<p>Use this guide as a preparation tool before the first coordinator conversation. The best outcome from reading it is not that the patient memorizes every detail; it is that the family can send better records, ask sharper questions, recognize weak quotes and avoid making travel or payment decisions from incomplete information, with more confidence and calm.</p>`;
}

function directReaderHtml(html) {
  return html
    .replace(/\bThe patient should\b/g, "You should")
    .replace(/\bthe patient should\b/g, "you should")
    .replace(/\bPatients should\b/g, "You should")
    .replace(/\bpatients should\b/g, "you should")
    .replace(/\bThe patient may\b/g, "You may")
    .replace(/\bthe patient may\b/g, "you may")
    .replace(/\bThe patient can\b/g, "You can")
    .replace(/\bthe patient can\b/g, "you can")
    .replace(/\bThe patient is\b/g, "You are")
    .replace(/\bthe patient is\b/g, "you are")
    .replace(/\bThe patient has\b/g, "You have")
    .replace(/\bthe patient has\b/g, "you have")
    .replace(/\bthe patient receives\b/g, "you receive")
    .replace(/\bthe patient needs\b/g, "you need")
    .replace(/\bthe patient’s\b/g, "your")
    .replace(/\bthe patient's\b/g, "your");
}

function coordinationModelHtml() {
  return `<section class="deep-dive coordination-model" id="how-canopus-care-coordinates">
<h2>What Canopus Care coordinates before you travel</h2>
<p>You should know who is responsible for each step. Canopus Care keeps one coordination owner across your records, hospital communication and practical planning. The hospital and its clinicians remain responsible for diagnosis, treatment recommendations, pricing and care.</p>
<div class="quote-grid">
  <div><strong>A confirmed clinical contact</strong><p>Before you commit, ask the hospital to confirm the treating department and the named consultant or clinical team assigned to review your case. Assignment may change if the hospital identifies a different specialty need.</p></div>
  <div><strong>A pre-travel conversation</strong><p>Where the hospital offers it and your records are sufficient, Canopus Care can schedule a video consultation. The clinician explains what the call can confirm and what still requires examination or testing in India.</p></div>
  <div><strong>Medical and travel costs kept separate</strong><p>The hospital's written medical estimate remains distinct from flights, visa fees, accommodation, local transport and companion costs, so you can see which assumption changed.</p></div>
  <div><strong>One operational point of contact</strong><p>Your coordinator tracks consent, missing records, responses and non-clinical next steps. They do not join, record or summarise the clinical consultation and cannot choose treatment for you.</p></div>
</div>
</section>`;
}

function comprehensiveAddon(path, article) {
  const data = MARKET_SIGNALS[path];
  if (!data) return "";
  const showPublicSignals = !["/treatments/cardiac/cabg-india", "/treatments/cardiac/heart-valve-surgery-india"].includes(path);
  const signalSection = showPublicSignals ? `<h3>How to interpret published price ranges</h3>
<p>Published ranges can help you understand the rough order of cost, but they cannot price your case. Check the publication date and currency, then compare every figure with a current written hospital estimate based on your records and the same treatment assumptions.</p>
<div class="table-wrap"><table><thead><tr><th>Signal</th><th>How to use it</th></tr></thead><tbody>${comparisonRows(data.signals)}</tbody></table></div>` : `<h3>Build the estimate from your proposed procedure</h3>
<p>Cardiac estimates should be based on the records reviewed, the exact operation or intervention, device assumptions where relevant, expected ICU and ward stay, and written inclusions and exclusions. Request current hospital responses rather than relying on a public range that may describe a different procedure.</p>`;
  return directReaderHtml(`${procedureDeepGuide(path)}${longPatientGuide(path)}<section class="deep-dive" id="practical-decision-guide">
<h2>A practical decision guide: costs, hospitals and written quotes</h2>
<p>Once a family understands ${esc(data.procedure)}, the next questions are practical: what a current estimate should contain, how long to plan locally, which records make a specialist response useful and how to compare hospitals without mistaking marketing for medical advice.</p>

<h3>The four decisions most families are trying to make</h3>
<div class="intent-grid">
  <div><strong>Treatment and estimate</strong><span>${esc(data.intent)}</span></div>
  <div><strong>Hospital comparison</strong><span>which programs and teams fit the case, and how their written plans differ</span></div>
  <div><strong>Travel planning</strong><span>hospital stay, nearby recovery, visa letter, companion support and return-home follow-up</span></div>
  <div><strong>Practical next step</strong><span>which reports to organize, how to compare current estimates and when to speak with a coordinator</span></div>
</div>

${signalSection}

<h3>What changes the final estimate</h3>
<ul class="checklist">${listItems(data.costDrivers)}</ul>

<h3>Records that make hospital responses faster</h3>
<p>A complete record packet is the difference between a vague callback and a usable hospital response. The form should collect the lead first, but the coordinator should quickly assemble these documents before routing the case.</p>
<ul class="checklist">${listItems(data.records)}</ul>

${patientFacingScorecard()}

<h3>What a good hospital quote should include</h3>
<div class="quote-grid">
  <div><strong>1. Patient-specific assumptions</strong><p>Diagnosis/procedure as understood by the hospital, records reviewed, missing tests and whether an in-person evaluation may change the plan.</p></div>
  <div><strong>2. Medical package line items</strong><p>Professional fees, OT/cath lab, implant/device where relevant, anesthesia, ICU/ward, investigations, medicines, consumables and follow-up.</p></div>
  <div><strong>3. Exclusions and validity</strong><p>Extra stay, complications, blood products, premium implant/device changes, attendant costs, travel, accommodation and quote validity date.</p></div>
  <div><strong>4. Next operational step</strong><p>Remote consult, additional records, visa invitation letter, tentative admission window and coordinator owner.</p></div>
</div>

<h3>International patient timeline</h3>
<ol class="timeline">
  <li><strong>Lead captured:</strong> country, treatment, WhatsApp and whether reports exist.</li>
  <li><strong>Record packet assembled:</strong> coordinator checks completeness and missing items.</li>
  <li><strong>Consent confirmed:</strong> case is shared only with suitable hospital teams after consent.</li>
  <li><strong>Hospital responses compared:</strong> plans, inclusions, exclusions and validity are normalized.</li>
  <li><strong>Patient selects a path:</strong> hospital issues administrative documents such as the medical invitation letter where applicable.</li>
  <li><strong>Travel and admission:</strong> patient travels only after clinician/hospital travel guidance and operational readiness.</li>
  <li><strong>Return-home handoff:</strong> discharge summary, medicines, warning signs, follow-up and local clinician handoff are organized.</li>
</ol>

<h3>Choose a practical next step</h3>
<div class="cta-grid">
  <a href="#lead-form">Get current hospital estimates</a>
  <a href="#lead-form">Compare hospitals with the same records</a>
  <a href="#lead-form">Check if your reports are complete</a>
  <a href="#lead-form">Talk to a care coordinator</a>
</div>

<h3>Expanded FAQ for high-intent visitors</h3>
<details><summary>Is the lowest public price the best choice?</summary><p>No. A lower advertised range may exclude key items or use different assumptions. Compare the procedure, hospital, team, inclusions, exclusions, room category, stay length and validity.</p></details>
<details><summary>Can Canopus recommend the best hospital?</summary><p>Canopus can help evaluate options using evidence and current hospital responses. It should not publish a “best hospital” claim unless there is a transparent, independent methodology and current source trail.</p></details>
<details><summary>When should I upload reports?</summary><p>Start with the short form. Secure report handling should happen only after consent inside the Canopus case workflow, not through public file URLs.</p></details>
<details><summary>Can I get a quote without all records?</summary><p>Sometimes a hospital can give an indicative response, but missing records usually weaken the estimate. A coordinator should identify what is missing before hospital routing.</p></details>
<details><summary>Who makes the clinical decision?</summary><p>The treating hospital and clinicians make clinical decisions. Canopus Care coordinates records, consent, communication and comparison.</p></details>
</section>`);
}

function htmlPage({ meta, title, description, canonicalPath, html, addon, toc, sources, wordCount }) {
  const keywords = [
    meta.primary_keyword,
    ...(Array.isArray(meta.secondary_keywords) ? meta.secondary_keywords : []),
  ].filter(Boolean).join(", ");
  const sourceItems = sources.map((url, index) => {
    let host = "Canopus Care evidence register";
    let path = url;
    try {
      const parsed = new URL(url);
      host = parsed.hostname.replace(/^www\./, "");
      path = parsed.pathname.replace(/\/$/, "") || "/";
    } catch {}
    return `<li><a href="${esc(url)}" rel="nofollow"><span>Source ${String(index + 1).padStart(2, "0")}</span><strong>${esc(host)}</strong><small>${esc(path)}</small></a></li>`;
  }).join("");
  const tocItems = toc.map((item) => `<a href="#${esc(item.id)}">${esc(item.label)}</a>`).join("");
  const readMinutes = Math.max(20, Math.round(wordCount / 220));
  const displayWordCount = wordCount >= 14900 ? "15,000+ words" : `${wordCount.toLocaleString()} words`;
  const isPartnerPage = meta.category === "Partner";
  const isToolPage = meta.category === "Resource";
  const editorialVisual = meta.category === "Oncology"
    ? `<figure class="editorial-visual"><img src="/landing-assets/editorial-care-conversation.jpg" alt="A clinician discussing written information with an adult patient" loading="lazy"><figcaption>Illustrative care conversation. This is licensed editorial photography, not a Canopus Care patient story. Photo: cottonbro studio / Pexels.</figcaption></figure>`
    : "";
  const heroPoints = isPartnerPage
    ? ["Consent-led referrals", "Clear ownership at every handoff", "Complete return-home documentation"]
    : isToolPage
      ? ["A practical step-by-step workflow", "A like-for-like hospital comparison", "Travel and follow-up readiness"]
      : ["Procedure and alternatives explained", "Records and hospital questions", "Recovery, estimate and travel planning"];
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: title,
    description,
    inLanguage: "en",
    isAccessibleForFree: true,
    dateModified: meta.last_researched || "2026-08-10",
    publisher: { "@type": "Organization", name: "Canopus Care" },
    mainEntityOfPage: canonicalPath,
    citation: sources,
  };
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title.replace(/: .*$/, ""))} | Canopus Care</title>
<meta name="description" content="${esc(description)}">
<meta name="keywords" content="${esc(keywords)}">
<meta name="robots" content="${meta.indexReady === false ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"}">
<link rel="canonical" href="${esc(canonicalPath)}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root{--ink:#1e3a44;--heading:#07111f;--muted:#64748b;--navy:#0a1626;--accent:#0fb8a6;--accent2:#0d9488;--line:#d7e1ec;--soft:#f7faf9}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:var(--soft);color:var(--ink);line-height:1.68}a{color:var(--accent2);text-decoration:none}a:hover{text-decoration:underline}.reading-progress{position:fixed;left:0;right:0;top:0;height:3px;background:transparent;z-index:40}.reading-progress span{display:block;width:0;height:100%;background:var(--accent)}
.top{position:sticky;top:0;z-index:20;background:var(--navy);color:#fff;border-bottom:1px solid rgba(148,163,184,.18);box-shadow:0 10px 24px rgba(15,23,42,.16)}.nav{max-width:1180px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.brand-mark{width:38px;height:38px;border-radius:16px;background:#07111f;border:1px solid rgba(15,184,166,.35);box-shadow:0 0 0 4px rgba(15,184,166,.08);position:relative;display:inline-block}.brand-mark:before{content:"";position:absolute;inset:12px;border-radius:5px;background:var(--accent)}.brand-text strong{display:block;font-size:18px;line-height:1;font-weight:900}.brand-text small{display:block;margin-top:4px;font-size:11px;color:#cbd5e1;font-weight:700}.nav-links{display:flex;align-items:center;gap:4px}.nav-links a{color:#cbd5e1;font-weight:800;font-size:13px;margin-left:16px}.nav-links a:hover{color:#fff;text-decoration:none}
.hero{background:linear-gradient(180deg,#fff 0%,#eef7f5 100%);border-bottom:1px solid var(--line)}.hero-inner{max-width:1180px;margin:0 auto;padding:42px 20px 44px;display:grid;grid-template-columns:minmax(0,1fr) 356px;gap:32px;align-items:start}.crumb{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(15,184,166,.2);background:#fff;border-radius:999px;padding:7px 12px;font-size:11px;font-weight:800;color:#334155;text-transform:uppercase;letter-spacing:0;box-shadow:0 1px 2px rgba(15,23,42,.04)}.crumb:before{content:"";width:7px;height:7px;border-radius:999px;background:var(--accent)}.hero h1{max-width:780px;font-size:clamp(36px,4.4vw,48px);line-height:1.04;letter-spacing:0;margin:26px 0 18px;color:#020617;font-weight:800}.dek{font-size:18px;color:#475569;max-width:760px;margin:0;line-height:1.65;font-weight:400}.hero-points{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:26px 0 0;padding:0;list-style:none;max-width:760px}.hero-points li{min-height:64px;display:flex;align-items:center;border-top:2px solid var(--accent);background:rgba(255,255,255,.72);padding:11px 12px;color:#164e4b;font-size:13px;font-weight:800;line-height:1.4}
.layout{max-width:1180px;margin:0 auto;padding:30px 20px 90px;display:grid;grid-template-columns:minmax(0,764px) 356px;gap:32px;align-items:start}.article{min-width:0;font-size:17px}.article h1{display:none}.article h2,.article h3{line-height:1.18;letter-spacing:0;color:#020617}.article h2{font-size:28px;margin:48px 0 14px;padding-top:4px;font-weight:800}.article h3{font-size:20px;margin:30px 0 9px;font-weight:800}.article p{max-width:70ch;margin:14px 0;color:#334155;line-height:1.76;font-weight:400}.article ul,.article ol{padding-left:22px;max-width:72ch}.article li{margin:8px 0;color:#334155}.article hr{border:0;border-top:1px solid var(--line);margin:30px 0}.article code{background:#eef6f5;border:1px solid #cfe1df;padding:2px 5px;border-radius:6px}.article pre,.article p:has(code){overflow-x:auto}.table-wrap{overflow-x:auto;margin:18px 0 26px;border:1px solid var(--line);border-radius:8px;background:#fff}.article table{border-collapse:collapse;width:100%;min-width:620px}.article th,.article td{padding:13px 14px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.article th{background:#f2f7f6;color:#0f5f58;font-size:12px;text-transform:uppercase;letter-spacing:0}.article blockquote{max-width:70ch;margin:24px 0;padding:17px 19px;border-left:4px solid var(--accent);background:#f4fbfa;border-radius:0 8px 8px 0;font-weight:700;color:#123b3a}.editorial-visual{margin:0 0 32px}.editorial-visual img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px}.editorial-visual figcaption{padding:9px 2px;color:#64748b;font-size:12px;line-height:1.5}
.toc,.rail,.source-box,.trust{border:1px solid var(--line);background:#fff;border-radius:8px;padding:16px;box-shadow:0 14px 32px -30px rgba(15,23,42,.65)}.toc{margin:0 0 26px;background:#fbfefd}.toc h2,.rail h2,.source-box h2{font-size:17px;margin:0 0 12px;color:var(--heading);font-weight:800}.toc-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px;row-gap:2px}.toc-links a{padding:7px 0;border-bottom:1px solid #e7eef3;font-size:13px;font-weight:650;line-height:1.4;color:#0f766e}.source-box ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0;list-style:none}.source-box li{margin:0}.source-box a{display:flex;min-height:92px;flex-direction:column;gap:3px;border:1px solid var(--line);border-radius:8px;padding:12px;background:#fff}.source-box a span{font-size:10px;font-weight:800;text-transform:uppercase;color:#0d9488}.source-box a strong{font-size:14px;color:#0f172a}.source-box a small{font-size:11px;color:#64748b;word-break:break-word}
.deep-dive,.patient-guide{margin-top:40px;border-top:1px solid var(--line);padding-top:28px}.intent-grid,.quote-grid,.guide-grid,.cta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0}.intent-grid div,.quote-grid div,.guide-grid div{border:1px solid var(--line);border-radius:10px;background:#f8fbfa;padding:13px}.intent-grid strong,.quote-grid strong,.guide-grid strong{display:block;color:#0d9488}.intent-grid span,.quote-grid p,.guide-grid p{display:block;margin-top:5px;color:#64748b;font-size:14px;line-height:1.55}.checklist{columns:2;column-gap:28px}.timeline{border-left:3px solid #99d9d1;padding-left:22px}.timeline li{padding:7px 0}.cta-grid a{border-radius:10px;background:var(--accent2);color:#fff;padding:12px 14px;font-weight:900;text-align:center;box-shadow:0 10px 20px rgba(13,148,136,.14)}.deep-dive details,.faq-bank details,.workbook details{border:1px solid var(--line);border-radius:10px;padding:13px 15px;margin:9px 0;background:#fff}.deep-dive summary,.faq-bank summary,.workbook summary{cursor:pointer;font-weight:900;color:var(--heading)}.deep-dive details p,.faq-bank details p,.workbook details p{font-size:15px}.glossary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0}.glossary div{border:1px solid var(--line);border-radius:10px;padding:13px;background:#fff}.glossary strong{color:#0d9488}.glossary p{font-size:14px;line-height:1.55}.chapter-list section,.scenario-list section{border-left:3px solid var(--accent);background:#f8fbfa;border-radius:0 10px 10px 0;padding:13px 15px;margin:10px 0}.chapter-list h4,.scenario-list h4{margin:0 0 6px;color:#0d9488;font-size:16px}.chapter-list p,.scenario-list p{margin:0;font-size:15px;line-height:1.62}
.side{position:sticky;top:104px}.rail{border-color:#c8dbe7}.rail h2{font-size:20px;color:var(--heading);line-height:1.2;font-weight:800}.rail p{font-size:13px;color:#64748b;margin:0 0 14px}.field{display:block;margin:10px 0;font-size:12px;font-weight:900;color:#334155}.field input,.field select{width:100%;margin-top:5px;border:1px solid #cbd5e1;border-radius:10px;padding:11px 12px;font-size:14px;background:#fff;color:#1e3a44}.field input:focus,.field select:focus{outline:2px solid rgba(15,184,166,.35);border-color:var(--accent)}.btn{border:0;border-radius:10px;padding:12px 15px;background:var(--accent2);color:#fff;font-weight:900;width:100%;cursor:pointer;box-shadow:0 12px 22px rgba(13,148,136,.15)}.btn:hover{background:#0f766e;text-decoration:none}.btn.secondary{background:#fff;color:#0d9488;border:1px solid rgba(15,184,166,.35);box-shadow:none}.fine{font-size:12px;color:#64748b;line-height:1.55;margin-top:12px}.trust{margin-top:12px;background:#f8fbfa}.trust strong{display:block;color:var(--heading)}.source-box{margin-top:34px;background:#fbfefd}.source-box li{word-break:break-word}.success{display:none;background:#ecfdf5;border:1px solid #bbf7d0;color:#065f46;border-radius:10px;padding:13px;margin-top:12px;font-weight:800}
.mobile-bar{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--line);padding:10px;z-index:30;box-shadow:0 -12px 30px -24px #000}.mobile-bar .bar-inner{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:520px;margin:0 auto}.mobile-bar a{display:flex;justify-content:center;align-items:center;border-radius:10px;padding:11px;font-weight:900}.mobile-bar a:first-child{background:var(--accent2);color:#fff}.mobile-bar a:last-child{border:1px solid var(--line);color:var(--ink)}
@media(max-width:900px){.hero-inner,.layout{grid-template-columns:minmax(0,1fr)}.hero-inner{padding:28px 18px}.layout{padding:22px 14px 86px}.side{position:static}.hero h1{font-size:32px}.dek{font-size:16px}.hero-points{grid-template-columns:1fr}.hero-points li{min-height:0}.toc-links,.intent-grid,.quote-grid,.guide-grid,.glossary,.cta-grid,.source-box ol{grid-template-columns:1fr}.checklist{columns:1}.article{font-size:16px}.article h2{font-size:24px}.mobile-bar{display:block}.nav-links{display:none}.brand-text small{display:none}}
</style></head><body><div class="reading-progress" aria-hidden="true"><span></span></div>
<header class="top"><div class="nav"><a class="brand" href="/"><span class="brand-mark"></span><span class="brand-text"><strong>Canopus Care</strong><small>Coordinate. Care. Connect.</small></span></a><div class="nav-links"><a href="/resources">Resources</a><a href="/treatments">Treatments</a><a href="#lead-form">Get options</a></div></div></header>
<section class="hero"><div class="hero-inner"><div><div class="crumb"><a href="/resources">Resources</a> / ${esc(meta.primary_keyword || "Treatment guide")}</div><h1>${esc(title)}</h1><p class="dek">${esc(description)}</p><ul class="hero-points">${heroPoints.map((point) => `<li>${esc(point)}</li>`).join("")}</ul></div><div><div class="rail"><h2>Get current hospital responses</h2><p>Share the minimum details first. Secure report handling happens after consent inside the Canopus case workflow.</p><form id="lead-form"><label class="field">Country<input name="country" required placeholder="Kenya, Oman, Nigeria"></label><label class="field">Treatment or diagnosis<input name="treatment" required value="${esc(meta.primary_keyword || title)}"></label><label class="field">WhatsApp number<input name="whatsapp" required placeholder="+254..."></label><label class="field">Do you have medical reports?<select name="has_reports"><option value="yes">Yes</option><option value="no">No</option></select></label><button class="btn" type="submit">${esc(meta.cta || "Get my case reviewed")}</button><div class="success" id="lead-success">Request received. A coordinator can contact you; hospitals make clinical decisions.</div><div class="fine">Canopus Care is a facilitator, not a hospital. No diagnosis, treatment advice or outcome guarantees.</div></form></div></div></div></section>
<main class="layout"><article class="article">${editorialVisual}<section class="toc"><h2>On this page</h2><div class="toc-links">${tocItems}</div></section>${html}${addon}<section class="source-box"><h2>Medical and planning sources</h2><p>These sources support the clinical orientation and planning framework. Hospital, doctor, device and cost details can change, so ask for a current written response before making travel or payment decisions.</p><ol>${sourceItems}</ol></section></article><aside class="side"><div class="rail"><h2>${esc(meta.cta || "Send reports")}</h2><p>Use the same hospital-ready case packet across hospitals so responses can be compared on procedure, inclusions, exclusions and validity.</p><a class="btn secondary" href="#lead-form">Start case review</a><div class="fine">A coordinator checks completeness first. Hospitals and clinicians make medical decisions.</div></div><div class="trust"><strong>Patient safeguards</strong><div class="fine">Consent before hospital sharing. No public medical-file URLs. No diagnosis, treatment advice or outcome guarantees.</div></div></aside></main>
<div class="mobile-bar"><div class="bar-inner"><a href="#lead-form">Send reports</a><a href="#lead-form">Talk to coordinator</a></div></div>
<script>
const progress = document.querySelector(".reading-progress span");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + "%";
}, { passive: true });
document.getElementById("lead-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const body = Object.fromEntries(new FormData(form).entries());
  body.source_url = location.pathname;
  body.source_page_type = "treatment_resource";
  body.speciality = ${JSON.stringify(meta.category || "")};
  body.treatment_slug = location.pathname;
  body.cta_source = "server_article_rail";
  const response = await fetch("/api/resource-leads", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(body) });
  if (response.ok) document.getElementById("lead-success").style.display = "block";
});
</script></body></html>`;
}

export function isResourceArticlePath(pathname) {
  return !!ARTICLES[pathname.replace(/\/$/, "")];
}

export function getResourceArticlePaths() {
  return Object.keys(ARTICLES);
}

const RESOURCE_REDIRECTS = new Map([
  ["/treatments/transplant/bone-marrow-transplant-india", "/treatments/oncology/bone-marrow-transplant-india"],
  ["/ke/treatments/transplant/bone-marrow-transplant-india", "/ke/treatments/oncology/bone-marrow-transplant-india"],
  ["/tz/treatments/transplant/bone-marrow-transplant-india", "/tz/treatments/oncology/bone-marrow-transplant-india"],
  ["/ng/treatments/transplant/bone-marrow-transplant-india", "/ng/treatments/oncology/bone-marrow-transplant-india"],
]);

export function resolveResourceRedirect(pathname) {
  return RESOURCE_REDIRECTS.get(pathname.replace(/\/$/, "")) || null;
}

const CORRIDOR_COUNTRY_PROFILES = {
  ke: {
    demonym: "Kenyan",
    homeName: "Kenya",
    currency: "Kenyan shillings (KES)",
    languages: "English or Swahili",
    mission: "the High Commission of India in Nairobi",
    visa: "The current Nairobi mission guidance asks medical-visa applicants for an Indian hospital invitation, supporting medical documents and a local doctor or hospital referral, evidence of funds, and attendant relationship documents where relevant. Requirements can change, so confirm the live checklist before paying for travel.",
    departure: "Build the departure plan from the city where you will actually board, not from an assumed Nairobi itinerary. Check the airline's medical-clearance rules, connection time, mobility assistance and how you will reach follow-up care after returning to Kenya.",
    handoff: "Before leaving Kenya, identify the local clinician or hospital that can receive the discharge summary, medicine list and follow-up schedule. Ask whether imaging, wound review, blood tests, rehabilitation or oncology treatment can continue locally and who will act if the Indian team requests a change.",
  },
  tz: {
    demonym: "Tanzanian",
    homeName: "Tanzania",
    currency: "Tanzanian shillings (TZS)",
    languages: "English or Swahili",
    mission: "the High Commission of India in Dar es Salaam",
    visa: "The current Dar es Salaam mission guidance describes a medical or medical-escort visa supported by preliminary medical advice or an appointment letter from a recognized Indian institution and evidence of financial standing. The mission also publishes current passport, vaccination and application requirements; verify them directly before travel.",
    departure: "Plan from your real departure point and allow for domestic travel to Dar es Salaam or another international airport if needed. Ask the airline about mobility help, oxygen or medical clearance well before departure, and avoid a tight connection after a major procedure.",
    handoff: "Name the Tanzanian clinician who can review the discharge packet and arrange urgent care if symptoms change. Confirm where blood tests, imaging, wound checks, rehabilitation or treatment cycles can be completed after return rather than assuming every follow-up must happen in India.",
  },
  ng: {
    demonym: "Nigerian",
    homeName: "Nigeria",
    currency: "Nigerian naira (NGN)",
    languages: "English and any preferred family language",
    mission: "the relevant Indian mission or consular service in Nigeria",
    visa: "The Consulate General of India in Lagos publishes a medical-visa checklist that includes an Indian hospital pathway, a referral from a recognized Nigerian medical institution and current vaccination documentation. Use the live consular checklist because document and public-health requirements can change.",
    departure: "Do not assume Lagos is the only practical departure point. Compare the complete route from home to the Indian hospital, including domestic transfers, airline assistance, connection length and the effort of returning after treatment. Clinician travel clearance comes before fare selection.",
    handoff: "Agree on a Nigerian follow-up clinician before departure, especially for oncology, transplant, cardiac or rehabilitation-heavy care. The handoff should state who will order tests, renew medicines, manage complications and communicate with the Indian team.",
  },
  ae: {
    demonym: "UAE-based",
    homeName: "the UAE",
    currency: "UAE dirhams (AED)",
    languages: "English, Arabic or another preferred language",
    mission: "the Embassy of India in Abu Dhabi or the Consulate General of India in Dubai, as applicable",
    visa: "The Embassy of India in Abu Dhabi publishes a medical and medical-attendant visa checklist that asks for preliminary medical advice or a UAE referral and an Indian hospital letter indicating an appointment or willingness to treat. Residency and nationality can affect the correct route, so use the current official guidance for the applicant's circumstances.",
    departure: "A short direct flight does not make immediate post-treatment travel safe. Ask the treating team about clot risk, mobility, oxygen, wound or device issues and airline documentation. Coordinate the airport, hospital city and UAE home transfer as one journey.",
    handoff: "Before departure, identify the UAE specialist or primary clinician who will receive the final records. Confirm insurance or self-pay arrangements for local follow-up, and establish how the UAE and Indian teams will exchange reports if medicines, scans or rehabilitation plans change.",
  },
};

const CORRIDOR_CORE_PROFILES = {
  "knee-replacement": {
    topic: "knee replacement", family: "orthopaedic", patient: "people with severe knee pain and loss of function who are comparing replacement opinions",
    actual: ["Knee replacement removes damaged joint surfaces and replaces them with implant components. The decision should connect symptoms and loss of function with examination and weight-bearing X-rays; an image alone does not decide surgery.", "A surgeon may discuss total, partial, bilateral, conventional or technology-assisted surgery. The meaningful comparison is the operation and implant plan, medical fitness, rehabilitation and follow-up, not the marketing label.", "Recovery starts with pain control, clot prevention, safe transfers and walking. A patient travelling home needs a realistic local-stay plan and continued physiotherapy."],
    options: ["continued non-surgical care", "total knee replacement", "partial knee replacement in selected cases", "staged or same-admission bilateral planning", "revision or complex reconstruction"],
    records: ["weight-bearing knee X-rays", "orthopaedic note", "pain and walking limitation", "previous surgery or injection records", "medicine list", "medical-fitness history"],
    drivers: ["one knee or both", "primary or revision surgery", "implant system", "robotic or navigation charges", "medical clearance", "stay and rehabilitation"],
    questions: ["Why replacement now?", "Total or partial replacement?", "Which implant is quoted?", "What rehabilitation is expected?", "When could long-distance travel be considered?"],
  },
  "hip-replacement": {
    topic: "hip replacement", family: "orthopaedic", patient: "people with hip pain, stiffness or loss of mobility comparing replacement opinions",
    actual: ["Hip replacement replaces the damaged ball-and-socket surfaces with implant components. Suitability depends on symptoms, examination, imaging, bone quality, diagnosis, age and medical fitness.", "The surgeon should explain the bearing surfaces, fixation, approach and any special issues caused by fracture, deformity, previous surgery or infection.", "A safe plan includes walking aids, clot prevention, wound review, movement precautions where advised and rehabilitation after return home."],
    options: ["continued non-surgical care", "total hip replacement", "cemented or uncemented fixation", "fracture-related arthroplasty", "revision or complex reconstruction"],
    records: ["pelvis and hip X-rays", "MRI or CT if performed", "orthopaedic note", "prior surgery records", "mobility limitation", "medicine and medical history"],
    drivers: ["diagnosis and bone quality", "primary or revision surgery", "implant and bearing", "fracture or deformity complexity", "medical clearance", "stay and rehabilitation"],
    questions: ["What diagnosis is driving surgery?", "Which implant and fixation are proposed?", "Are there movement precautions?", "What walking support is expected?", "When could long-distance travel be considered?"],
  },
  cabg: {
    topic: "CABG / heart bypass surgery", family: "cardiac", patient: "people with coronary artery disease comparing surgical and non-surgical heart-team opinions",
    actual: ["CABG creates new routes for blood to reach heart muscle beyond narrowed coronary arteries. The decision depends on angiogram anatomy, symptoms, heart function, diabetes, kidney and lung health and whether medicines or PCI are reasonable alternatives.", "A useful response states the likely graft plan, whether on-pump or off-pump surgery is being considered, expected critical-care assumptions and what remains provisional until examination.", "Recovery includes rhythm and wound monitoring, medicine reconciliation, breathing and walking progression and cardiac follow-up after return."],
    options: ["medical therapy", "PCI or stenting", "CABG", "combined valve and bypass surgery", "urgent local stabilization"],
    records: ["angiogram images and report", "echocardiogram", "ECG", "cardiology summary", "kidney and lung assessment", "medicine list"],
    drivers: ["coronary anatomy", "graft number and conduit plan", "heart function", "ICU and ward stay", "blood products", "combined procedures"],
    questions: ["Why CABG rather than PCI?", "What graft plan is assumed?", "How is heart function affecting risk?", "What medicines continue after surgery?", "Who provides cardiac follow-up at home?"],
  },
  "heart-valve-surgery": {
    topic: "heart valve surgery", family: "cardiac", patient: "people with valve narrowing or leakage comparing repair, replacement and catheter-based opinions",
    actual: ["Valve treatment aims to correct severe narrowing or leakage when symptoms, heart changes and clinical findings support intervention. The team should identify the valve, severity and effect on heart function.", "Options can include surgical repair, mechanical or tissue replacement, and catheter-based treatment for selected conditions. Age, anatomy, anticoagulation, pregnancy plans, infection history and future reintervention all matter.", "The plan must include medicine and anticoagulation follow-up, wound or access-site care and repeat echocardiography after return."],
    options: ["clinical monitoring", "surgical valve repair", "mechanical valve replacement", "tissue valve replacement", "catheter-based treatment in selected cases"],
    records: ["latest echocardiogram and images", "cardiology summary", "ECG", "angiogram or CT if performed", "infection history", "medicine and anticoagulant list"],
    drivers: ["valve and procedure type", "repair complexity", "prosthetic valve or device", "combined coronary work", "critical-care stay", "anticoagulation planning"],
    questions: ["Repair or replacement, and why?", "Mechanical or tissue valve?", "Is a catheter option relevant?", "What anticoagulation is expected?", "What echo follow-up is required?"],
  },
  "cancer-treatment": {
    topic: "cancer treatment", family: "oncology", patient: "people seeking a multidisciplinary review after a suspected or confirmed cancer diagnosis",
    actual: ["Cancer treatment is not one pathway. The first job is to confirm the diagnosis, stage, tumor biology, prior treatment and the purpose of the proposed care.", "Surgery, radiation, systemic medicines and supportive care may be used alone or in sequence. A hospital response should say which specialists reviewed the case and what information is still missing.", "Travel planning must fit the treatment calendar. Some care can continue at home, while other pathways require a longer stay or repeated visits."],
    options: ["pathology and staging review", "surgery", "radiation", "chemotherapy or other systemic therapy", "combined treatment", "supportive or palliative care"],
    records: ["complete pathology", "original imaging", "staging reports", "molecular tests where relevant", "prior treatment details", "current blood tests and medicines"],
    drivers: ["cancer type and stage", "treatment intent", "surgery complexity", "radiation fractions", "medicine regimen and cycles", "supportive-care needs"],
    questions: ["Is the diagnosis confirmed?", "What stage and treatment intent are assumed?", "Which specialists reviewed the case?", "What can happen at home?", "What would change the treatment sequence?"],
  },
  "breast-cancer": {
    topic: "breast cancer treatment", family: "oncology", patient: "people with a breast biopsy or imaging abnormality comparing multidisciplinary treatment plans",
    actual: ["Breast cancer planning begins with pathology, receptor results, imaging, stage and patient priorities. ER and PR describe hormone receptors; HER2 is another treatment-relevant marker. These results help shape medicine and surgery discussions.", "Options can include breast-conserving surgery, mastectomy, lymph-node surgery, chemotherapy, HER2-directed treatment, endocrine therapy and radiation in different sequences.", "The return-home plan should state wound and drain care, pathology review, the next oncology decision and where medicines or radiation can continue."],
    options: ["diagnosis and staging completion", "breast-conserving surgery", "mastectomy with or without reconstruction", "systemic treatment before or after surgery", "radiation", "endocrine or targeted treatment"],
    records: ["biopsy and receptor report", "mammogram and ultrasound", "MRI or staging scans if performed", "prior treatment details", "genetic or molecular results if available", "current medicines"],
    drivers: ["stage and biology", "surgery and reconstruction", "lymph-node procedure", "drug regimen and cycles", "radiation plan", "pathology and follow-up"],
    questions: ["What do ER, PR and HER2 mean in this case?", "Is treatment needed before surgery?", "Breast conservation or mastectomy?", "Is reconstruction part of the plan?", "Which care can continue at home?"],
  },
};

function corridorTreatmentMarkdown(article) {
  const country = CORRIDOR_COUNTRY_PROFILES[article.countryCode];
  const profile = SPECIFIC_TREATMENT_PAGES[article.canonicalSlug] || CORRIDOR_CORE_PROFILES[article.procedure];
  if (!country || !profile) throw new Error(`Missing corridor profile for ${article.slug || article.title}`);
  const family = FAMILY_GUIDANCE[baseFamily(profile)];
  const sources = sourceLinesFor(article);
  const records = profile.records.map((item) => `- ${item}`).join("\n");
  const options = profile.options.map((item) => `| ${item} | Ask why it fits or does not fit your case, what evidence supports it and what follow-up it requires. |`).join("\n");
  const drivers = profile.drivers.map((item) => `- ${item}`).join("\n");
  const questions = profile.questions.map((item) => `- ${item}`).join("\n");
  return `---
title: "${article.title}"
primary_keyword: "${profile.topic} in India from ${article.country}"
cta: "${article.cta}"
last_researched: "2026-08-24"
---

# ${article.title}

If you are reading this from ${article.country}, you probably have two decisions tangled together: what care makes sense, and whether travelling to India is a workable way to receive it. Separate them. First obtain a case-specific clinical opinion. Then build the visa, payment, companion and return-home plan around that opinion.

## Quick answer

${article.quickAnswer}

Canopus Care can organize records, consent, hospital communication and practical next steps. It is not a hospital and cannot diagnose, prescribe, select treatment, clear you to fly or guarantee an outcome, visa, admission date or final bill.

## What changes when you travel from ${article.country}

A useful country page should do more than add “from ${article.country}” to a general treatment guide. Your starting records may sit across several clinics. Your caregiver may be joining from another city. The hospital response may need to support a visa application. Payment may move from ${country.currency} to Indian rupees, while refunds or extra charges follow hospital rules. Most importantly, care must continue after you return.

Your plan therefore needs five named owners: the clinician reviewing your case at home, the Indian hospital team, the person coordinating records, the companion handling day-to-day logistics and the clinician who will take over after return. If one role is missing, solve that before booking.

## First decide whether travel can wait

This guide is for planned care, not emergency triage. New severe chest pain, major breathing difficulty, uncontrolled bleeding, sudden weakness, seizures, rapidly worsening confusion, high fever during cancer or transplant treatment, or another acute deterioration needs local emergency assessment. Do not delay urgent care while waiting for an overseas quote.

Even when the condition is stable, ask a local clinician whether commercial travel is reasonable. Fitness to travel can depend on symptoms, oxygen need, anemia, infection, recent surgery, clot risk, mobility, medicines and the length of the journey.

## What ${profile.topic} actually involves

${profile.actual.join("\n\n")}

The team commonly includes ${family.team}. Their decision should consider ${family.decision}.

## Options the hospital may compare

| Possible pathway | What you should clarify |
| --- | --- |
${options}

This table is a conversation guide, not a recommendation. Ask the hospital to identify the proposed option, the evidence reviewed, the alternatives considered and the finding that could change the plan after arrival.

## How the clinical team builds a recommendation

A preliminary opinion should connect your symptoms, reports and goals rather than simply repeat the diagnosis. For ${profile.topic}, the team is weighing ${family.decision}. Ask the lead clinician to explain that reasoning in ordinary language: what problem they believe is causing the current difficulty, which finding matters most, what they hope the proposed care will change and which limitations may remain even if treatment goes well.

The words “suitable for treatment” are not enough. A useful response distinguishes what is known from what is inferred. It should identify whether the diagnosis is confirmed, whether the available images are recent enough, whether pathology or laboratory work needs review, and whether an examination in India could materially change the proposal. If the team is relying on one report while another hospital asks for original images or additional tests, that difference deserves an explanation rather than a sales comparison.

Ask how the recommendation fits your wider health. Anesthesia, infection, bleeding, kidney, heart, lung, nutrition, mobility and medicine issues can affect timing and recovery even when they do not change the main procedure. The team should say which specialists need to clear or optimize those risks. A hospital that names unresolved issues is giving you more useful information than one that promises a fixed pathway without qualification.

Your priorities also belong in the decision. Tell the clinician what daily activity you most want to regain or protect, which side effects worry you, how much support is available at home and whether repeated travel would be difficult. In some conditions, the choice is not between treatment and no treatment but between different sequences, devices, medicines, levels of intervention or follow-up burdens. Ask what trade-off each option creates for you.

When two opinions differ, do not ask which doctor is “better” as the first question. Ask whether they are using the same diagnosis, stage, images, treatment goal and assumptions. One may be proposing a definitive treatment while another is proposing a diagnostic step, stabilization or a bridge to later care. Put the reasoning side by side before comparing cost or dates.

## What may happen after you arrive in India

An overseas opinion remains preliminary until the treating team confirms your identity, history, current symptoms, medicines and examination findings. The hospital may repeat blood tests, imaging, heart or anesthesia assessment, infection screening or other investigations because results have changed, files are incomplete or local policy requires a current baseline. Ask before travel which tests are expected, which are conditional and whether they are included in the estimate.

Bring medicines in original packaging where practical, along with a dated list showing dose and timing. At the first appointment, mention allergies, previous anesthesia problems, blood clots, bleeding, difficult intravenous access, implanted devices, pregnancy possibility, infection exposure and recent admissions. Do not assume these details are obvious from a discharge summary. Small omissions can create delays or unsafe medicine duplication.

The first consultation should end with a written or clearly documented next step. You should know whether the proposed plan is unchanged, what new information was found, who is leading the case, what consent is still required and when the next decision will occur. If the recommendation changes, ask for the clinical reason and the revised estimate before agreeing to a different procedure or treatment whenever the situation permits.

For planned care, use the time before admission to prepare for ${family.preparation}. The companion should know where to wait, when updates are usually given, how to reach the ward, what identification or payment documents are needed and which belongings should stay outside a procedure area. Practical preparation reduces stress without crossing into medical decision-making.

## Procedure or treatment day: what to clarify

Before consent, ask the treating clinician to name the procedure or regimen exactly and describe its purpose. Confirm the side, site, level, device, medicine plan or donor details where relevant. Ask who will perform the key parts, what anesthesia or sedation is planned, whether blood products may be needed and what circumstance could lead to a different or additional step. Consent is not a formality; it is the moment to correct misunderstandings.

Your companion should know how long the intervention is expected to take, where you are likely to recover first and who will contact them. Operating or treatment times can change, so the useful promise is a communication process, not an exact clock time. The family should also know which updates can be shared under the patient's consent and whom to call if no update arrives.

Immediate monitoring depends on the treatment, but the team should explain the likely ward, critical-care or day-care pathway, expected tubes or lines, pain and nausea plan, movement or positioning restrictions and the first clinical milestones. Ask which findings are common after treatment and which require urgent action. Avoid turning a generic recovery timeline into a personal guarantee.

## Recovery milestones before a return flight

Recovery is not a countdown to the earliest ticket. It is a sequence of clinical milestones. Depending on the case, these may include stable observations, controlled symptoms, safe eating or hydration, acceptable blood tests, mobility, wound or access-site review, medicine understanding and a plan for drains, catheters, devices or dressings. Ask the team to write down the milestones that apply to you.

The days immediately after discharge can reveal problems that were not visible in hospital. Arrange accommodation that is reachable from the treating centre, has appropriate bathroom and mobility access and allows the companion to obtain food and medicines. Know whether the hospital has an after-hours contact route and whether a return visit is already scheduled.

For this specialty, the continuing priorities include ${family.recovery}. A fit-to-fly discussion should consider the complete journey, not only time in the air: the trip to the airport, queues, security, transfers, walking distance, baggage, connection delays and travel from the arrival airport to home. The airline may request separate documentation even when the hospital is comfortable with travel.

Do not use a coordinator's reassurance as medical clearance. Ask the treating team to state the recommended local recovery period, restrictions during travel, medicine timing across time zones, mobility or compression advice if applicable, and what to do if symptoms begin during transit. Carry essential medicines and a concise medical summary in hand luggage rather than checked baggage.

## If the plan changes or the stay becomes longer

Build a contingency before departure because clinical care does not always follow the first estimate. Ask the hospital what commonly changes the plan for this condition, who authorizes additional charges, how the family will receive an updated estimate and whether a second clinical consent is required. Keep enough flexibility for repeat tests, delayed recovery or a revised travel date without assuming a particular complication will occur.

If the hospital proposes a materially different treatment after arrival, slow the conversation down when the situation is not urgent. Ask what new finding caused the change, what alternatives remain, what the revised risks and recovery needs are and whether your local clinician should be involved. Request a written summary so the decision does not depend on a stressful verbal exchange.

The companion should also have a non-clinical contingency plan: access to emergency funds, ability to extend accommodation, a way to change travel, contact details for family and sponsor, and care arrangements for responsibilities at home. These preparations do not predict a poor outcome; they prevent a manageable delay from becoming a crisis.

## Build one clinical record packet

Do not send a different story to every hospital. Create one dated case summary, one record index and one secure folder. Include the diagnosis exactly as written, current symptoms, prior treatment, medicines, allergies, major medical conditions and the question you want the hospital to answer.

For ${profile.topic}, start with:

${records}

Include original image files when available, not only screenshots of radiology reports. If a report is handwritten or not in English, keep the original and arrange a clear translation; do not rewrite the diagnosis yourself. Your local clinician's summary should state current stability and any time-sensitive concern.

## The ${article.country} record-to-hospital workflow

1. Collect the latest reports and create a dated one-page summary.
2. Ask your local clinician to correct factual gaps and identify urgent issues.
3. Share only the minimum necessary records after consent.
4. Ask each Indian hospital to list exactly what it reviewed.
5. Request a written preliminary plan, missing-test list, estimate assumptions and likely local-stay window.
6. Compare responses on the same facts before choosing a hospital.
7. Request the hospital documents needed for the correct visa pathway only after the clinical and financial response is usable.

If your preferred communication is ${country.languages}, say so at intake. Clinical consent, estimate terms, medicine instructions and discharge warnings should be understood by the patient, not only by the companion.

## Medical visa planning from ${article.country}

${country.visa}

Use ${country.mission} and the Government of India visa portal as the source of truth. Do not rely on an agent's screenshot, an old checklist or a promise of guaranteed approval. Confirm the correct visa category for the patient and companion, the required hospital letter, passport validity, photographs, referral evidence, funds, vaccination or public-health documents, biometrics and any registration rule that applies to the expected stay.

Do not buy a non-refundable ticket merely because an invitation letter has arrived. A hospital letter supports an application; it is not a visa decision, admission guarantee or travel-clearance certificate.

## Compare the hospital response before paying

A decision-grade response should name the diagnosis or procedure being considered, records reviewed, missing information, clinician or department, proposed next step and uncertainty. The estimate should be dated and should separate professional fees, operation or treatment charges, devices or implants, medicines, tests, critical care, room, expected stay, exclusions, extra-stay rate, companion costs and follow-up.

The estimate for this care can change because of:

${drivers}

Ask for four labels beside every material line: **included**, **excluded**, **conditional** or **not yet known**. A low headline number with undefined devices, medicines, stay or complication costs is not cheaper in any reliable sense.

## Payment planning in ${country.currency} and Indian rupees

Request the hospital's legal billing name, bank details through a verified channel, deposit schedule, currency, refund terms and receipt process. Ask your bank, insurer or sponsor what documentation is needed and how long approval or international transfer may take. Exchange rates and bank charges can move, so keep a contingency rather than treating today's conversion as final.

Separate the medical estimate from flights, visa fees, local transport, accommodation, food, companion costs, home-country tests and post-return care. Avoid large informal cash payments and never send money to a personal account because someone claims it will secure faster treatment.

## Companion planning

Your companion is not just a traveller. They may need to hold the document folder, understand medicines, speak during admission, track receipts, help with mobility and communicate with family. Choose someone who can stay for the likely duration and who understands the patient's privacy preferences.

Before departure, agree who will handle finances, who may receive medical updates, what happens if the stay extends and who supports dependants at home. The companion should have their own visa and travel documents, accommodation plan, emergency contacts and access to essential records without carrying the only copy.

## The journey from ${article.country}

${country.departure}

Ask the airline directly about wheelchairs, stretchers, portable oxygen, recent surgery, pregnancy, implanted devices and medical information forms where relevant. The hospital should advise when travel may be considered, but the airline controls carriage requirements. Build flexibility into the return ticket because discharge and fitness to fly are different decisions.

## Preparing for admission in India

Before admission, the hospital may repeat tests or change the provisional plan after examination. Prepare for ${family.preparation}. Carry original records, a current medicine list, allergy details, copies of travel documents and the written estimate. Do not stop blood thinners, diabetes medicines, fertility medicines, cancer medicines or other prescriptions unless the responsible clinician gives clear instructions.

At admission, ask who is the named consultant, how updates will be shared, what consent covers, which items may be billed separately and whom the companion should contact after hours.

## Recovery is part of the treatment decision

For this specialty, recovery planning includes ${family.recovery}. Ask what must happen before discharge, what should happen before a flight and which tasks can safely continue in ${article.country}.

The discharge date is not automatically the departure date. Pain control, mobility, wound or access-site status, infection risk, blood counts, hydration, medicine stability and the ability to obtain urgent help can all affect travel timing.

## Your return-home handoff

${country.handoff}

Do not leave India without a discharge summary, final diagnosis, procedure or treatment record, pathology where relevant, medicine list with duration, implant or device details, wound or catheter instructions, warning signs, contact route, follow-up schedule and copies of important images and laboratory results.

The handoff should answer three practical questions: who reviews you first after return, which test is due next and what symptom should trigger urgent local care rather than a message to an overseas coordinator.

## Questions to ask the treating team

${questions}

- Which parts of the plan are confirmed and which remain provisional?
- What could extend the stay or change the estimate?
- What must my clinician in ${article.country} be able to manage?
- What written clearance or airline form may be needed before return?
- How will the Indian and home-country teams exchange follow-up information?

## A practical timeline

### Before hospital routing

Complete the record packet, obtain patient consent, identify the local clinician and write down the exact question. Do not begin with price alone.

### During hospital comparison

Compare clinical reasoning, missing information, treatment scope, estimate assumptions, local-stay expectations and the quality of the return-home plan.

### Before visa and payment

Verify the current official visa checklist, hospital invitation details, companion documentation, funding route, refund terms and a realistic admission window.

### Before departure from ${article.country}

Confirm clinical stability, medicines, airline requirements, accommodation, local transport, companion roles and how an unexpected delay will be funded.

### Before leaving India

Obtain the complete discharge packet, travel guidance, medicines, warning signs, follow-up date and a confirmed handoff to your clinician at home.

## Turn a second opinion into a decision you can explain

A second opinion is useful only when you can see why it differs from the first. Put each response beside the same case summary and mark the diagnosis, treatment goal, proposed procedure or regimen, alternatives, missing tests, expected stay, major uncertainties and follow-up needs. If one team recommends intervention and another recommends monitoring or a different sequence, ask both teams which finding drives the difference. Do not ask a coordinator to settle a clinical disagreement.

Write a short decision note for yourself and your family. It should state what you understand, what remains uncertain, why the chosen hospital or pathway appears workable, which financial assumptions you accepted and what would cause you to pause. Include the name of the clinician who answered the medical questions and the date of the response. This creates a better record than relying on calls, chat messages or memory.

Before committing, discuss the plan with the clinician who knows your health in ${country.homeName}. Ask whether the proposed care is consistent with your current condition, whether any stabilization is needed before travel and whether the expected follow-up can actually be provided after return. The local clinician does not have to endorse a hospital marketing claim; their role is to help identify safety, continuity and practical gaps.

Finally, use a cooling-off check before a non-refundable payment. Confirm that the patient understands the plan and alternatives, the hospital estimate is current, the companion can manage the trip, the visa route is correct, emergency funds exist and the return-home clinician has agreed to receive the records. Pressure to decide before these basics are clear is a reason to slow down.

## Common mistakes to avoid

- Booking travel before the hospital has reviewed adequate records.
- Comparing hospitals using different diagnoses, scans or procedure assumptions.
- Treating an invitation letter as a visa or admission guarantee.
- Paying to a personal account or accepting unclear refund terms.
- Assuming the companion can translate every clinical decision accurately.
- Planning to fly on the discharge date without clinical and airline clearance.
- Returning without pathology, procedure records, medicine instructions or a local follow-up owner.

## Frequently asked questions

### Can Canopus Care choose the hospital or treatment for me?

No. Canopus Care can organize consented records and compare written operational responses. Qualified clinicians decide medical suitability and treatment.

### Is the hospital invitation letter enough to travel?

No. Use the current official visa process, wait for the relevant decision and obtain clinical travel guidance. The hospital letter is one supporting document.

### Can I get a final price before arrival?

Hospitals may provide an indicative written estimate from records. Examination, repeat tests, procedure scope, devices, medicines, complications or extra stay can change the final bill.

### Should I choose the shortest proposed stay?

Not automatically. Ask what clinical milestones support discharge, how long you should remain nearby and what must be checked before a long journey.

### Can all follow-up happen online?

No. Some conversations can be remote, but wounds, symptoms, rehabilitation, blood tests, imaging, medicines or treatment cycles may require in-person care in ${country.homeName}.

### What is the safest first step?

Create one accurate record packet, involve your local clinician and request written hospital responses based on the same information. Build travel around the resulting clinical plan.

# Sources

${sources}
`;
}

function generatedMarkdown(path, article) {
  if (article.type === "corridor_treatment_candidate") return corridorTreatmentMarkdown(article);
  if (path === "/treatments/urology/kidney-stone-surgery-india") return kidneyStoneSurgeryMarkdown(article);
  if (SPECIFIC_TREATMENT_PAGES[path]) return specificTreatmentMarkdown(path, article, SPECIFIC_TREATMENT_PAGES[path]);
  if (SPECIFIC_TOOL_PAGES[path]) return specificToolMarkdown(path, article, SPECIFIC_TOOL_PAGES[path]);
  if (SPECIFIC_PARTNER_PAGES[path]) return specificPartnerMarkdown(path, article, SPECIFIC_PARTNER_PAGES[path]);
  const isPartner = article.type === "b2b_icp";
  const isTool = article.type === "tool";
  const title = article.title;
  const profile = GENERATED_PROCEDURE_PROFILES[path];
  const records = article.records?.length ? article.records : ["Latest medical summary", "Relevant reports", "Medication list", "Prior treatment notes"];
  const sources = [...(article.sources || []), ...(profile?.sources || [])].filter(([, url]) => /^https?:\/\//i.test(url || ""));
  const sourceLines = sources.map(([label, url]) => `- ${label}: ${url}`).join("\n");
  const recordsList = records.map((item) => `- ${item}`).join("\n");
  const profileSections = profile ? `
## Actual procedure guide for patients

${profile.intro}

${profile.sections.map(([heading, body]) => `### ${heading}\n\n${body}`).join("\n\n")}

## Procedure comparison for this condition

| Situation | What may be discussed | What the patient should ask |
| --- | --- | --- |
${profile.comparison.map(([situation, option, ask]) => `| ${situation} | ${option} | ${ask} |`).join("\n")}

## What changes the estimate for this procedure

${profile.estimateDrivers.map((item) => `- ${item}`).join("\n")}

## Procedure-specific questions to ask the urologist

${profile.questions.map((item) => `- ${item}`).join("\n")}
` : "";
  const categoryText = article.category || "medical travel";
  const pageKind = isPartner ? "partner workflow" : isTool ? "planning checklist" : "treatment planning";
  const facilitatorBoundary = "Canopus Care is a facilitator. It can coordinate consented records, hospital communication and travel-readiness tasks, but it does not diagnose, prescribe, choose treatment, guarantee outcomes or act as the treating provider.";

  return `---
title: "${title}"
primary_keyword: "${title}"
cta: "${article.cta || "Send reports for current options"}"
---

# ${title}

${article.quickAnswer || `This ${pageKind} page helps international patients prepare records, compare written hospital responses and understand what must be clarified before travelling to India.`}

## Quick answer

${facilitatorBoundary}

For ${title.toLowerCase()}, the safest next step is a structured case packet and a current written response from a hospital team. A public page can explain the process, common records, estimate questions and travel planning, but it cannot decide whether a patient is suitable for treatment.

## Why this page exists

Most medical-travel pages are too short for the real decision a patient or family is making. A family is not only asking what ${title.toLowerCase()} means. They are asking whether India is realistic, which documents are needed, how estimates are compared, what could change after arrival, how long planning may take, what a companion must prepare and how follow-up works after returning home.

This guide focuses on records, written hospital responses, source-backed caution and practical next steps. It deliberately avoids unsupported prices, miracle language, success-rate claims, doctor credential claims and one-size-fits-all medical advice.

## At a glance

| Planning area | What the patient should do | Why it matters |
| --- | --- | --- |
| Records | Prepare the latest reports, images, medication list and prior treatment summary. | Hospital teams need case evidence before they can respond responsibly. |
| Clinical decision | Ask the hospital what it reviewed and what remains uncertain. | A quote without clinical assumptions is not decision-grade. |
| Estimate | Compare inclusions, exclusions, validity date, room/stay assumptions and devices or medicines where relevant. | A cheaper estimate may omit material items. |
| Travel | Confirm visa support, admission timing, companion plan, local stay and return-home follow-up. | Medical travel fails when the operational plan is weaker than the medical plan. |
| Safety boundary | Use Canopus Care for coordination, not diagnosis or treatment advice. | Clinical responsibility remains with qualified hospital teams. |

## Who this resource is for

This page is for patients, caregivers and families researching ${title.toLowerCase()} from outside India. It is also useful for coordinators who need a patient-facing explanation that does not overpromise. The reader may be comparing hospitals, checking whether reports are ready, trying to understand cost variation or deciding whether to speak to a facilitator before sending medical documents.

It is not for emergency self-triage. If symptoms are urgent, severe or rapidly worsening, the patient should seek local emergency care. Travel planning should wait until a qualified clinician has assessed stability and risk.

## What Canopus Care can and cannot do

Canopus Care can help organize the case so hospitals receive the same clear information. It can help the patient understand which documents are missing, request current hospital responses, track non-clinical next steps, coordinate language and travel-readiness questions and keep family communication organized.

Canopus Care cannot interpret scans, stage cancer, recommend an operation, prescribe medicines, rank doctors by unsupported claims, guarantee cost, guarantee a medical visa, guarantee admission, guarantee cure or guarantee recovery. Those limits should be visible on every acquisition page because they protect the patient and the company.

## Records to prepare before requesting a hospital response

The exact record packet depends on the condition and the hospital. Start with the records below, then let the coordinator identify what is missing before hospital routing.

${recordsList}

If files are large, the patient should avoid public links and use a secure, consented workflow. Original reports should be carried for travel when required, while digital copies should be stored in a private folder.

## How hospital review usually works

First, the coordinator collects non-sensitive intake details: country, age band, diagnosis as written in reports, main concern, report availability, preferred travel window and whether a companion is available. Second, the patient consents to sharing the relevant medical file with selected hospitals. Third, the hospital reviews the available documents and either issues an indicative response, asks for more records, suggests a remote consult or explains that the plan can only be confirmed after in-person assessment.

This sequence matters because it separates marketing from decision-grade information. A public price range may attract attention, but the hospital response should state what was reviewed, what is assumed, what is missing and what may change.

## Procedure and care-pathway discussion

${isPartner ? "For partnership pages, the procedure is the referral and coordination pathway itself. The partner should know exactly how patient consent, case routing, communication, documentation, hospital ownership and escalation work before referring any patient." : isTool ? "For checklist pages, the procedure is the planning workflow. The patient uses the checklist to move from scattered questions to a hospital-ready case file and a side-by-side comparison of written responses." : `For ${title.toLowerCase()}, the treating clinical team decides whether a procedure, medicine, monitoring, staged plan or local care is appropriate. The patient should ask what alternatives were considered, what the proposed pathway includes, what must be confirmed after arrival and which follow-up steps can happen at home.`}

Good pages explain the clinical topic without pretending to personalize care. The useful patient-facing questions are:

- What diagnosis or treatment pathway is the hospital considering?
- What reports did the hospital review before giving its answer?
- What information is still missing?
- What alternatives or timing questions should be discussed with the clinician?
- What could change after physical examination or repeat testing?
- What should the patient ask their local doctor before travelling?

${profileSections}

## Cost and estimate logic

The right cost answer is rarely one number. A usable estimate should identify the hospital, department, date, records reviewed, proposed next step, included stay, room type, investigations, medicines, consumables, implants or devices where relevant, professional fees, exclusions and validity period.

Patients should be careful with pages that show a low headline price but do not explain what is included. A current written estimate is stronger than an old screenshot, aggregator range or verbal promise.

## What changes the final estimate

Cost can change because of diagnosis, severity, prior treatment, patient fitness, repeat investigations, room category, ICU or monitored-care requirement, device or implant selection, medicine choice, blood products, complications, extra stay, rehabilitation and follow-up needs.

The patient should ask the hospital to label each item as included, excluded, unknown or dependent on final assessment. This makes the quote easier to compare and reduces confusion at admission or discharge.

## Hospital comparison scorecard

| Field | Strong response | Weak response |
| --- | --- | --- |
| Records reviewed | Lists the specific reports, scans or summaries reviewed. | Gives a package without saying what was reviewed. |
| Clinical proposal | Explains provisional next step and uncertainty. | Uses generic treatment language only. |
| Estimate assumptions | Shows inclusions, exclusions, stay assumptions and validity date. | Gives only a headline number. |
| Follow-up | Explains discharge documents and home-doctor handoff. | Ends at discharge or payment. |
| Facilitator role | Keeps clinical decisions with hospital teams. | Implies the facilitator can choose treatment. |

## Questions to ask before paying a deposit

- What exactly has the hospital reviewed?
- Is the response indicative or final?
- Which doctor, department or hospital team is responsible for the plan?
- What is included in the estimate?
- What is excluded?
- What circumstances could change the plan or cost after arrival?
- How many days should be kept flexible before and after admission?
- What documents are needed for visa support or admission?
- What follow-up can happen after the patient returns home?
- Who should the family contact for clinical concerns versus travel coordination?

## Travel readiness

Medical travel is not only the hospital appointment. The patient should confirm passport validity, visa category and invitation-letter process, companion availability, airport transfer, hotel distance, accessible room needs, local SIM or communication plan, medicines for travel, emergency contacts and flexible return-ticket assumptions.

Official visa rules and hospital requirements can change. The patient should use current official government and hospital instructions before booking travel.

## Companion planning

A companion may need to manage documents, payment receipts, translation, daily meals, transport, medicine timing, discharge papers and communication with family at home. For complex cases, the companion should understand what warning signs require immediate hospital contact and what questions must go to the treating team rather than the coordinator.

## Return-home handoff

Before leaving India, the patient should receive a discharge summary, procedure or treatment note if applicable, medicine list, warning signs, follow-up dates, emergency contact route, investigation plan and instructions for the home doctor. If implants, devices, pathology, imaging or special medicines are involved, copies should be easy to share with clinicians at home.

## Common mistakes to avoid

- Choosing from the lowest public price without checking inclusions.
- Sending scattered report photos without dates or context.
- Booking flights before hospital review.
- Treating a facilitator as a doctor.
- Assuming the plan cannot change after fresh assessment.
- Ignoring the cost of hotels, meals, companion travel and extra stay.
- Returning home without a clear follow-up plan.
- Relying on outcome guarantees or unsupported success claims.

## Deep planning workbook

Use this section as a working document before the first coordinator call. The patient or caregiver can copy the headings into a note and fill them in from real documents. The purpose is not to force a decision. The purpose is to make the hospital response more precise.

### Patient context

Write the patient's country, city, preferred language, age band, travel companion availability, main concern, diagnosis exactly as written in reports and current treatment status. If the patient is currently admitted, unstable, unable to travel, on oxygen, receiving active chemotherapy, taking blood thinners or dealing with infection, that should be visible before any travel discussion.

### Report timeline

List the reports in date order. A useful timeline includes the first symptom or diagnosis date, major scans, biopsy or procedure dates, admissions, medicines started or stopped, current symptoms and the most recent specialist opinion. Hospitals often struggle when a family sends many files without a timeline. The timeline helps the clinical team see what is old, what is current and what may need repeating.

### Decision questions

The family should write the three decisions they are actually trying to make. Examples include whether to travel, whether to request more than one hospital response, whether a remote consult is enough before travel, whether the estimate includes the major cost drivers and whether follow-up at home is realistic. Clear decision questions prevent the conversation from becoming a generic sales call.

### Risk and stability questions

The patient should ask a qualified clinician whether travel is safe enough to consider, whether symptoms require urgent local care, whether medicines need review before flying, whether a companion is necessary and whether the proposed timing is medically sensible. A facilitator can coordinate these questions, but it should not answer them as medical advice.

### Family and payment readiness

Medical travel can create stress if payment, documents and travel duties are unclear. Decide who communicates with the coordinator, who stores reports, who receives hospital estimates, who handles payments, who books travel and who will support the patient after discharge. The family should also decide how much uncertainty it can tolerate before booking flights.

## Search-intent answers

### Is India cheaper for this care?

India may be cost-competitive for some private-care pathways, but the useful comparison is not a generic country-level promise. Compare the complete written hospital estimate, expected stay, companion cost, hotel cost, flights, repeat tests, medicines, rehab, follow-up and contingency budget. A low package can become expensive if exclusions are material or if the patient needs a longer stay.

### Which hospital is best?

The better question is which hospital gives the clearest, most relevant response for this patient. A strong response names the department or team, states what records were reviewed, explains what is still uncertain, gives an estimate with assumptions and describes follow-up. A famous hospital name is not enough if the response is vague.

### Which city should the patient choose?

City choice depends on the hospital program, travel route, language support, hotel access, family comfort, appointment availability and follow-up needs. The patient should avoid choosing only by flight convenience if the clinical plan is not clear. For longer recovery or multiple visits, hotel distance and transport reliability matter.

### Can the patient get a quote without reports?

A very rough orientation may be possible, but a decision-grade response needs records. Without records, the hospital may not know diagnosis details, severity, prior treatment, medicines, comorbidities or whether the searched treatment is even relevant. The coordinator should explain which minimum documents are needed for the first useful response.

### Can the plan change after arrival?

Yes. Fresh examination, updated tests, missing images, infection screen, anesthesia review, clinical instability or patient preference can change the plan. This is not automatically a failure. It is why estimates should label assumptions and why patients should keep travel plans flexible where possible.

### Is a video consultation enough?

A video consultation can help clarify records, likely next steps and missing documents. It may not replace physical examination, fresh tests, consent or admission assessment. The patient should ask what the consultation can confirm, what it cannot confirm and what would still need to happen in India.

## Estimate-normalization checklist

| Quote item | Ask this | Why it matters |
| --- | --- | --- |
| Hospital identity | Which hospital branch and department issued the estimate? | Large hospital groups may have different branches and teams. |
| Records reviewed | Which reports and dates were used? | Old or missing records weaken the estimate. |
| Treatment scope | What exactly is proposed? | Similar keywords can hide different procedures or treatment sequences. |
| Stay assumptions | How many ICU, ward, room, day-care or hotel days are assumed? | Stay length is a major driver of total cost and travel planning. |
| Tests | Which pre-treatment and post-treatment tests are included? | Repeat tests may be required for safety or hospital protocol. |
| Medicines and consumables | What routine medicines, special drugs, implants or devices are included? | These can materially change the estimate. |
| Exclusions | What is not included? | Complications, extra stay, blood products, premium devices, rehab and companion costs can be significant. |
| Validity | Until what date is the estimate valid? | Prices, availability and currency assumptions can change. |
| Payment rules | What deposit is required and what refund rules apply? | Patients need clarity before committing money. |
| Follow-up | What happens after discharge and after return home? | A weak handoff can create risk and confusion. |

## Information to prepare before hospital routing

Before hospital routing, the patient or caregiver should prepare the patient's country, preferred language, diagnosis as written, current location, urgency as described by the patient, report availability, prior treatment, major comorbidities, current medicines, allergies, travel window, companion availability and consent preferences. This information is used as operational context, not as clinical interpretation.

For ${title.toLowerCase()}, the coordinator should also ask whether the patient already has the records listed above, whether image files are available, whether a local doctor is currently involved and whether the patient is seeking first treatment, second opinion, revision, follow-up or a cost comparison.

## What patients should receive after routing

After hospital routing, the patient should receive a response that can be understood without a sales call. It should say what was reviewed, what the hospital believes the next step may be, what is uncertain, what additional tests may be needed, what the estimate includes, what is excluded, how long the estimate is valid, what travel documents may be needed and what follow-up would look like.

If two hospitals respond differently, the patient should not panic. Differences may come from different assumptions, missing records, specialty focus or risk tolerance. Ask each hospital to explain its reasoning in plain language and involve a qualified clinician before making a decision.

## Caregiver briefing

The caregiver should know where documents are stored, which hospital response is current, what payments are pending, what medicines the patient takes, what allergies or prior reactions exist, who to call in India, who to call at home and what warning signs require urgent hospital contact. The caregiver should also keep receipts, discharge papers and follow-up instructions organized from the beginning rather than trying to reconstruct them later.

## Privacy and consent

Medical reports contain sensitive information. The patient should share only what is necessary, only with consent and only through channels that are intended for case handling. Public links, social-media uploads and uncontrolled forwarding can create avoidable privacy risk. If a family member is communicating on behalf of the patient, the patient's permission and communication preferences should be clear.

## Quality signals to look for

Quality signals include clear source links, current dates, hospital-written responses, transparent facilitator boundaries, explicit exclusions, realistic travel planning, no cure guarantees, no pressure to pay before records are reviewed and a willingness to say when information is missing. A page or coordinator that admits uncertainty is often more trustworthy than one that pretends everything is simple.

## Red flags

Be careful with guaranteed outcomes, fixed universal prices, unnamed hospitals, unnamed doctors, pressure to pay immediately, refusal to share exclusions, claims that no reports are needed, advice to stop medicines without clinician review, promises that every patient can fly home on the same timeline and claims that a facilitator can decide clinical suitability.

## How Canopus Care moves the case forward

Start with basic details rather than an uncontrolled document upload. A coordinator checks whether reports exist, explains consent, organizes the case packet and requests written hospital responses where appropriate. You can then compare the responses with your family and local doctor before making travel or payment decisions.

## FAQ

### Can this page tell me whether I need treatment?

No. This page is educational and operational. Suitability decisions belong to qualified clinicians after reviewing the patient.

### Can Canopus Care compare hospitals for me?

Canopus Care can help compare written responses, inclusions, exclusions and next steps. It should not make unsupported medical claims or promise outcomes.

### Is a public cost range enough to plan travel?

No. Public ranges are orientation only. The decision document should be a current written hospital estimate based on the patient record set.

### Should I send every document immediately?

Start with the main reports and summaries. Share medical records only through a consented workflow and avoid public document links.

### What is the best next step?

Organize the record packet, request current hospital responses and compare the plan, assumptions, exclusions and follow-up requirements before booking travel.

# Sources

${sourceLines}
`;
}

export function renderResourceArticle(pathname, root, origin = "") {
  const path = pathname.replace(/\/$/, "");
  const article = ARTICLES[path];
  if (!article) return null;
  const raw = article.generated ? generatedMarkdown(path, article) : readFileSync(join(root, article.file), "utf8");
  const { frontmatter, md: parsedMd } = parseMarkdown(raw);
  const md = publicMarkdown(parsedMd);
  const title = frontmatter.title || md.match(/^#\s+(.+)$/m)?.[1] || article.description;
  const toc = buildToc(md);
  const addon = `${article.type === "corridor_treatment_candidate" ? "" : comprehensiveAddon(path, article)}${coordinationModelHtml()}`;
  const addOnUrls = [...addon.matchAll(/https?:\/\/[^"]+/g)].map((m) => m[0]);
  const sources = [...new Set([...extractSources(md), ...addOnUrls])].slice(0, 24);
  const html = enhanceHtml(mdToHtml(md));
  const wordCount = md.trim().split(/\s+/).filter(Boolean).length + addon.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return htmlPage({
    meta: { ...frontmatter, category: article.category, categoryId: article.categoryId, cta: article.cta, indexReady: article.indexReady },
    title,
    description: article.description,
    canonicalPath: `${origin}${path}`,
    html,
    addon,
    toc,
    sources,
    wordCount,
  });
}
