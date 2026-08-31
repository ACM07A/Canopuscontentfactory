# Canopus Care — Product Design System and UI Direction

> **Purpose:** Apply the visual language of the supplied healthcare-dashboard reference to Canopus Care without copying its logo, content, illustrations, or exact layout.  
> **Primary use:** Patient portal, care-coordinator workspace, treatment journey, hospital/doctor discovery, medical-record review, cost planning, and travel coordination.  
> **Brand used in this document:** **Canopus Care**. Replace the name only if the product brand changes.

---

## 1. Design Objective

Canopus Care should feel like a **premium clinical command centre**, not a generic hospital website and not a noisy travel marketplace.

The interface must communicate:

- medical credibility;
- personal care and reassurance;
- clarity around a complicated treatment journey;
- modern AI-assisted coordination;
- transparent costs and next steps;
- calm, organised decision-making.

The reference image works because it combines:

- a large white application surface;
- a soft, blurred clinical environment behind it;
- generous negative space;
- rounded modular cards;
- restrained blue accents;
- realistic anatomical imagery;
- compact medical metrics;
- a clear hierarchy between overview, actions, and detail.

Use those principles, but create an original Canopus Care system.

---

# 2. Core Experience Principles

## 2.1 Calm before clever

Medical users may be anxious, confused, or under time pressure. Every screen must first answer:

1. Where am I?
2. What is happening?
3. What requires my attention?
4. What should I do next?
5. Who can help me?

Avoid decorative complexity that weakens these answers.

## 2.2 One primary action per surface

Every page and major card should have one obvious primary action.

Examples:

- **Upload medical records**
- **Review treatment plan**
- **Compare hospitals**
- **Confirm consultation**
- **View cost estimate**
- **Message care coordinator**
- **Complete visa documents**

Secondary actions should use text buttons, tertiary icons, or overflow menus.

## 2.3 Progressive disclosure

Show the summary first, then reveal details.

Examples:

- display total estimated treatment cost first;
- show the detailed hospital, doctor, travel, accommodation, and contingency breakdown on expansion;
- display “3 records need review” before showing all uploaded reports;
- show the next milestone before the entire treatment timeline.

## 2.4 Human reassurance

The interface should regularly show a named human care coordinator, doctor, or support contact. AI may assist, but it should not visually replace medical professionals.

Good wording:

- “Prepared with your care coordinator”
- “Awaiting review by Dr. Sharma”
- “AI-assisted summary — verify with your clinician”
- “Your coordinator usually replies within 15 minutes”

Avoid wording that suggests autonomous diagnosis or guaranteed outcomes.

## 2.5 Evidence and provenance

Any medical summary, recommendation, or extracted data should show:

- its source;
- the date;
- who reviewed it;
- whether it is patient-entered, hospital-provided, or AI-extracted;
- a clear uncertainty or review state.

---

# 3. Visual Direction

## 3.1 Overall style

Use a **soft clinical minimalism** aesthetic:

- clean white surfaces;
- cool neutral background;
- high-quality medical imagery;
- strong but restrained cobalt-blue highlights;
- subtle glass effects;
- thin borders rather than heavy shadows;
- rounded corners;
- compact dashboard modules;
- deep charcoal text;
- tiny amounts of warm colour only for health states or urgency.

The experience should feel like a combination of:

- a modern specialist hospital;
- a premium private-banking dashboard;
- a luxury travel concierge;
- an advanced medical-imaging workstation.

It should not feel like:

- an insurance portal;
- an e-commerce marketplace;
- a gaming dashboard;
- a neon AI startup;
- a generic Bootstrap admin template.

---

# 4. Brand Translation for Canopus Care

## 4.1 Brand personality

**Precise, calm, international, attentive, transparent.**

Voice attributes:

- warm but not casual;
- expert but understandable;
- confident but not absolute;
- concise but not abrupt;
- personal but privacy-conscious.

## 4.2 Suggested visual motif

Use a subtle **guiding-orbit / care-path motif** inspired by the name Canopus:

- small orbital rings;
- directional arcs;
- journey nodes;
- a guiding-star point;
- a soft radial glow around selected milestones.

Do not turn the product into a space-themed interface. The motif should appear only in:

- loading states;
- journey timeline nodes;
- selected-state halos;
- the logo animation;
- empty-state illustrations.

## 4.3 Logo treatment

Use the original Canopus Care logo or create a minimal symbol with:

- one clear geometric mark;
- one blue-to-indigo gradient;
- no complex medical cross unless it is part of the existing identity;
- wordmark in black or near-black;
- compact horizontal lock-up for the app header.

Do not copy the “Healthink” logo from the reference.

---

# 5. Colour System

Use colour sparingly. Most of the interface should remain white, off-white, and graphite.

## 5.1 Primary palette

| Token | Hex | Usage |
|---|---:|---|
| `brand-50` | `#EEF4FF` | Soft selected backgrounds |
| `brand-100` | `#DDE9FF` | Hover and highlighted chips |
| `brand-200` | `#BCD2FF` | Focus rings and secondary accents |
| `brand-500` | `#2F6BFF` | Main brand blue |
| `brand-600` | `#1F56E5` | Primary button default |
| `brand-700` | `#1846BE` | Primary button hover/pressed |
| `indigo-500` | `#5C4DFF` | Gradient end and AI-assisted states |
| `ink-950` | `#111318` | Main text |
| `ink-700` | `#3E4552` | Secondary text |
| `ink-500` | `#6E7685` | Metadata |
| `line-200` | `#E6E9EF` | Borders |
| `surface-0` | `#FFFFFF` | Primary card |
| `surface-50` | `#F7F8FA` | App background |
| `surface-100` | `#F1F3F6` | Nested card or disabled state |

## 5.2 Semantic colours

| Token | Hex | Usage |
|---|---:|---|
| `success-500` | `#1FA971` | Completed, clinically reviewed |
| `warning-500` | `#E7A322` | Attention required |
| `danger-500` | `#D84A4A` | Urgent issue, failed upload |
| `info-500` | `#4285F4` | Neutral information |
| `purple-500` | `#7657E8` | AI-extracted or model-assisted |
| `teal-500` | `#1C9A9A` | Travel or logistics status |

Semantic colour must always be paired with:

- an icon;
- a text label;
- sufficient contrast.

Never use colour alone to communicate medical status.

## 5.3 Gradients

Primary gradient:

```css
linear-gradient(135deg, #2F6BFF 0%, #5C4DFF 100%)
```

Soft selected gradient:

```css
linear-gradient(135deg, rgba(47,107,255,.10), rgba(92,77,255,.08))
```

Use gradients only for:

- primary emphasis cards;
- selected treatment-path items;
- premium plan highlight;
- small chart fills;
- visual anchors.

Do not apply gradients to every button or every card.

---

# 6. Typography

## 6.1 Font family

Preferred:

```css
font-family: "Inter", "Manrope", "SF Pro Display", "Segoe UI", sans-serif;
```

Use **Inter** for implementation simplicity. Use **Manrope** only for large headings if a slightly more premium personality is desired.

## 6.2 Type scale

| Role | Size | Weight | Line height |
|---|---:|---:|---:|
| Display | 40–48 px | 600 | 1.08 |
| Page title | 28–32 px | 600 | 1.15 |
| Section title | 20–22 px | 600 | 1.25 |
| Card title | 15–17 px | 600 | 1.3 |
| Body | 14–16 px | 400 | 1.55 |
| Compact body | 13–14 px | 400 | 1.45 |
| Label | 11–12 px | 500–600 | 1.3 |
| Metric | 30–42 px | 500–600 | 1.0 |
| Metadata | 11–12 px | 400 | 1.4 |

## 6.3 Typography rules

- Use sentence case, not title case, for buttons and labels.
- Keep primary headings direct.
- Do not use all caps except for tiny technical tags.
- Avoid ultra-light font weights.
- Keep body text at 14 px minimum on desktop and 15–16 px on mobile.
- Use tabular numerals for costs, dates, health metrics, and durations.

Example:

```css
font-variant-numeric: tabular-nums;
```

---

# 7. Spacing, Grid, and Density

## 7.1 Spacing scale

Use a 4 px base system:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
```

## 7.2 Desktop application frame

- Maximum app width: `1440px`
- Recommended content width: `1280–1360px`
- Outer margin: `24–48px`
- Header height: `72px`
- Content padding: `24px`
- Grid: `12 columns`
- Gutter: `16–20px`

The dashboard can sit inside a rounded app shell over a blurred clinical background on marketing screenshots. Inside the actual authenticated product, use a neutral full-page background for performance and readability.

## 7.3 Card geometry

| Element | Radius |
|---|---:|
| App shell | 22–28 px |
| Major panel | 18–22 px |
| Standard card | 14–18 px |
| Nested card | 12–14 px |
| Button | 10–999 px depending on form |
| Chip | 999 px |
| Input | 12–14 px |

## 7.4 Borders and shadows

Default card:

```css
border: 1px solid #E6E9EF;
box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
```

Floating overlay:

```css
box-shadow:
  0 12px 32px rgba(17, 19, 24, 0.10),
  0 2px 8px rgba(17, 19, 24, 0.05);
```

Avoid strong shadows under every card.

---

# 8. Application Shell

## 8.1 Desktop header

The header should include:

**Left**

- Canopus Care logo;
- product switcher only if there are separate patient and provider products.

**Centre**

- Dashboard;
- My case;
- Hospitals;
- Treatment plan;
- Travel;
- Messages.

**Right**

- global search;
- notifications;
- help;
- user avatar;
- account menu.

Keep the central navigation in a light-grey rounded capsule, similar in spirit to the reference, but not identical.

### Active navigation item

- white fill;
- subtle shadow;
- dark text;
- small leading icon;
- no underline.

## 8.2 Mobile navigation

Use:

- top bar with logo, notifications, and avatar;
- bottom navigation with a maximum of five items:
  - Home
  - My case
  - Journey
  - Messages
  - Profile

Put less-used items in a “More” screen.

## 8.3 Breadcrumbs

Use breadcrumbs only on deeper workflow pages such as:

```text
My case / Records / MRI report / Review
```

Do not show breadcrumbs on the main dashboard.

---

# 9. Patient Dashboard Architecture

The dashboard must answer the user’s current treatment status immediately.

## 9.1 Recommended desktop layout

### Top row

**Left: greeting and case summary**

- “Good morning, Ajeya”
- “Your cardiac-care case is awaiting two hospital proposals.”
- case ID;
- country of origin;
- destination under consideration;
- care coordinator.

**Right: utility controls**

- date or journey phase selector;
- “View full journey” button;
- current status chip.

### Main body

Use an asymmetrical two-column layout.

#### Left visual zone: 5 columns

A high-quality medical visual connected to the user’s case:

- 3D heart, knee, spine, brain, dental arch, or body region;
- three or four interactive hotspots;
- one floating metric card;
- thumbnail selector for related organs or scans;
- optional “View in 3D” action.

This visual should be relevant to the treatment. Do not show a random heart for a dental or fertility case.

#### Right information zone: 7 columns

Top:

- **Case overview / patient body analysis**
- three summary metric cards.

Middle:

- **Recommended next steps**
- **Upcoming consultations**

Bottom:

- **Issue or attention card**
- **Care coordinator card**
- **Cost estimate preview**

On smaller desktops, stack the left visual above the right modules.

## 9.2 Suggested metric cards

Do not use arbitrary clinical data. Use metrics relevant to medical travel and case progress.

Examples:

1. **Medical records**
   - `12/14 received`
   - “2 reports still required”

2. **Hospital proposals**
   - `3 received`
   - “1 awaiting specialist review”

3. **Estimated budget**
   - `₹8.4L–₹10.2L`
   - “Treatment and hospital stay”

4. **Journey readiness**
   - `68%`
   - “Visa and travel documents pending”

5. **Response time**
   - `18 min`
   - “Average coordinator response”

6. **Clinical review**
   - `Completed`
   - “Reviewed by Dr. Mehta · 24 Jul”

## 9.3 Dashboard priority order

1. urgent medical or documentation issue;
2. next required patient action;
3. next consultation;
4. treatment proposal status;
5. cost and payment;
6. travel readiness;
7. educational content.

Do not let promotional content outrank care tasks.

---

# 10. Core Components

## 10.1 Metric card

Structure:

- category label;
- optional info tooltip;
- main value;
- unit or range;
- comparison or status text;
- micro-chart or progress visual;
- optional “Details” chip.

Example:

```text
Estimated hospital cost
₹7.2L–₹8.6L
Excludes flights and accommodation
[small range bar]
```

Rules:

- one main number;
- no more than two supporting lines;
- chart must be understandable without hover;
- use compact but readable padding;
- use a white surface inside a light-grey parent panel.

## 10.2 Status chip

Variants:

- Draft
- Awaiting patient
- Awaiting hospital
- Under clinical review
- Coordinator reviewing
- Ready to confirm
- Confirmed
- Completed
- Needs attention

Chip style:

- 28–32 px height;
- soft tinted background;
- small icon;
- medium-weight label;
- full pill radius.

## 10.3 Treatment-path item

Inspired by the selectable treatment cards in the reference.

Each item includes:

- circular treatment or specialty icon;
- title;
- one-line descriptor;
- optional status;
- optional chevron.

Selected state:

- blue-to-indigo gradient;
- white text;
- slightly elevated;
- icon in a translucent white circle.

Unselected state:

- white;
- light border;
- hover background `surface-50`.

## 10.4 Appointment card

Include:

- doctor photo;
- doctor name;
- specialty;
- hospital;
- date and local time;
- patient timezone;
- video/in-person badge;
- join or reschedule action.

Never show a famous-person placeholder name. Use realistic fictional names in demos.

## 10.5 Care-coordinator card

Include:

- human photo;
- name;
- role;
- online/away state;
- typical response time;
- message button;
- optional language badges.

Example:

```text
Rhea Nair
Your care coordinator
English · Hindi · Kannada
Usually replies in 15 minutes
[Message Rhea]
```

## 10.6 Attention card

Use a dark card only for a truly important summary, similar in visual weight to the reference’s “Issue Found” panel.

Examples:

- Missing pathology slides
- Passport expires too soon
- Hospital requested an additional scan
- Cost estimate changed
- Consultation rescheduled

Style:

- dark graphite image overlay or dark surface;
- white heading;
- one-sentence explanation;
- small status tags;
- arrow button.

Do not use this dramatic card for routine content.

## 10.7 Timeline / journey tracker

Use a horizontal journey tracker on desktop and vertical tracker on mobile.

Suggested phases:

1. Case created
2. Records collected
3. Clinical review
4. Hospital matching
5. Consultations
6. Treatment selected
7. Visa and travel
8. Admission
9. Treatment
10. Recovery and follow-up

Each node must support:

- not started;
- in progress;
- awaiting external party;
- awaiting patient;
- completed;
- blocked.

## 10.8 File card

For medical records:

- file type icon;
- report title;
- hospital or lab;
- report date;
- upload date;
- verification state;
- extraction state;
- reviewer;
- view/download controls.

Medical-file status examples:

- Uploaded
- Virus scan complete
- AI extraction complete
- Needs patient confirmation
- Clinician reviewed

## 10.9 Comparison card

For hospitals or doctors:

- hospital image/logo;
- accreditation badges;
- city and country;
- doctor;
- estimated cost range;
- expected stay;
- proposal turnaround;
- inclusions/exclusions;
- match rationale;
- shortlist checkbox.

Do not rank hospitals with a mysterious single score. Explain the factors.

---

# 11. Main Product Screens

## 11.1 Patient home

Purpose:

- give a one-screen overview;
- surface the next action;
- show upcoming events;
- keep the coordinator visible.

Required modules:

- greeting and case state;
- main treatment visual;
- case-progress metrics;
- next steps;
- upcoming appointment;
- coordinator;
- attention alert;
- cost summary.

## 11.2 My case

Sections:

- diagnosis and treatment sought;
- symptoms and history;
- current medications;
- allergies;
- medical records;
- case notes;
- clinical summary;
- consent and data-sharing status.

Use a clear “source” label for every item.

## 11.3 Medical-record workspace

Layout:

- left file list;
- centre document viewer;
- right extracted-data and review panel.

The right panel should show:

- extracted observations;
- confidence;
- source page;
- patient confirmation;
- clinician review status.

For PDFs and scans:

- support zoom;
- page thumbnails;
- highlight source text;
- never silently overwrite original data.

## 11.4 Hospital discovery

Use a split layout:

- filter and shortlist panel;
- results list;
- optional map.

Key filters:

- specialty;
- treatment;
- country/city;
- budget;
- accreditation;
- language support;
- wait time;
- expected stay;
- visa support;
- accommodation support.

The card design should remain clinical and structured, not travel-marketplace-heavy.

## 11.5 Hospital comparison

Use a matrix for 2–4 hospitals.

Compare:

- clinical team;
- relevant procedure volume;
- accreditation;
- treatment plan;
- cost range;
- stay length;
- inclusions;
- exclusions;
- expected timeline;
- follow-up model;
- language support;
- coordinator notes.

On mobile, convert the matrix into one criterion at a time.

## 11.6 Treatment plan

Sections:

- clinical objective;
- recommended procedure;
- pre-treatment tests;
- admission schedule;
- procedure timeline;
- recovery milestones;
- risks and considerations;
- medications;
- follow-up plan;
- open questions.

Use a “Reviewed by” block with date and clinician identity.

## 11.7 Cost planner

Use a clean financial-dashboard treatment.

Break the estimate into:

- hospital package;
- surgeon and specialist fees;
- diagnostics;
- medicines and consumables;
- ICU or room upgrade;
- travel;
- accommodation;
- local transport;
- visa;
- companion costs;
- contingency;
- platform or coordination fee, if applicable.

Show:

- low estimate;
- expected estimate;
- high estimate;
- included/excluded items;
- currency;
- exchange-rate timestamp;
- payment milestones.

Never present an estimate as a guaranteed final bill.

## 11.8 Travel workspace

Modules:

- passport and visa readiness;
- flight plan;
- airport pickup;
- accommodation;
- companion details;
- admission time;
- local emergency contact;
- return-flight fitness status;
- travel checklist.

Use teal as a secondary accent for logistics.

## 11.9 Messaging

Use a calm, healthcare-safe chat interface.

Conversation groups:

- care coordinator;
- hospital coordinator;
- doctor;
- billing;
- travel support.

Features:

- secure file sharing;
- message translation;
- read status;
- response-time estimate;
- flagged clinical question;
- appointment creation;
- clear escalation option.

AI summaries must be visibly labelled and should not replace the original thread.

## 11.10 Provider / coordinator workspace

The staff dashboard may reuse the same system with denser information.

Key modules:

- active cases;
- cases needing attention;
- hospital proposal status;
- missing records;
- upcoming consultations;
- response SLA;
- pending payments;
- travel readiness;
- escalations.

Keep patient-facing and operator-facing navigation separate.

---

# 12. Landing Page Adaptation

The public website can use the same aesthetic without looking like an app screenshot stretched into a homepage.

## 12.1 Hero section

Layout:

- left: strong value proposition;
- right: premium product mock-up inside a white rounded shell over a soft hospital background.

Suggested copy structure:

```text
International treatment, coordinated from one place.

Compare hospitals, organise medical records, understand costs,
and manage your entire care journey with a dedicated coordinator.

[Start your case] [See how it works]
```

Trust row:

- hospitals or network count;
- supported countries;
- response-time claim only if verified;
- accreditation or data-security badges.

## 12.2 Page sections

1. Hero
2. Trust and proof
3. How Canopus Care works
4. Patient dashboard preview
5. Medical-record review
6. Hospital and doctor matching
7. Transparent cost planning
8. Travel and admission coordination
9. Dedicated care coordinator
10. Security and privacy
11. Patient story or synthetic demo case
12. FAQ
13. Final CTA

## 12.3 Marketing imagery

Use:

- original dashboard renders;
- original 3D anatomy;
- real or licensed hospital photography;
- real team/coordinator portraits where possible;
- restrained motion.

Avoid:

- random doctors with folded arms;
- operating-room gore;
- excessive stock photography;
- fake counters;
- invented hospital logos;
- unsupported clinical claims.

---

# 13. 3D Medical Visuals

## 13.1 Purpose

3D anatomy should help users understand their case, not merely decorate the screen.

Valid uses:

- highlight the body area under review;
- show procedure location;
- explain stages of treatment;
- attach scan or report references;
- switch between organs or views;
- open a guided explanation.

## 13.2 Presentation

- use a white or transparent background;
- realistic but not graphic;
- soft studio lighting;
- high anatomical fidelity;
- no blood or surgery imagery on default screens;
- use subtle hotspots;
- allow rotation only when useful;
- provide a non-3D fallback.

## 13.3 Performance

- lazy-load 3D assets;
- use compressed GLB/GLTF;
- poster image before interaction;
- cap initial asset size;
- disable continuous animation when off-screen;
- respect reduced-motion preferences.

## 13.4 Originality

Do not reuse or closely recreate the exact heart model shown in the reference. Use licensed, commissioned, or original medical assets.

---

# 14. Data Visualisation

## 14.1 Chart style

Charts should be:

- thin;
- low-noise;
- lightly gridded;
- mostly monochrome with one accent;
- labelled directly where possible;
- accessible without hover.

Use:

- sparklines;
- progress bars;
- range bars;
- step timelines;
- compact trend charts;
- stacked cost bars;
- journey completion rings sparingly.

Avoid:

- 3D charts;
- rainbow palettes;
- unnecessary pie charts;
- dense legends;
- misleading truncated axes.

## 14.2 Medical data rules

Every health metric should show:

- unit;
- date/time;
- source;
- reference range where relevant;
- abnormal-state explanation;
- review status.

Do not label a value “good” or “bad” without clinical context.

---

# 15. Buttons and Controls

## 15.1 Primary button

- blue or blue-indigo gradient;
- white text;
- 40–44 px height;
- 12–16 px horizontal padding;
- 10–12 px radius or pill form for top-level actions;
- arrow icon allowed on high-intent CTA.

## 15.2 Secondary button

- white;
- light border;
- dark text;
- subtle grey hover.

## 15.3 Tertiary button

- transparent;
- blue or dark text;
- no border.

## 15.4 Icon button

- 36–40 px square;
- circular or 10–12 px radius;
- tooltip required;
- visible focus ring.

## 15.5 Destructive action

- use red only after confirmation;
- never place next to the primary action without spacing;
- use explicit labels such as “Delete record”, not “Confirm”.

---

# 16. Forms

## 16.1 General

- one logical question per row;
- plain-language labels;
- helper text below the field;
- errors next to the relevant field;
- autosave long medical forms;
- visible save state;
- allow “I don’t know” where medically appropriate.

## 16.2 Inputs

- 44–48 px minimum height;
- 12–14 px radius;
- white background;
- `line-200` border;
- blue focus ring;
- labels always visible;
- placeholders are examples, not labels.

## 16.3 Multi-step onboarding

Recommended stages:

1. Basic details
2. Treatment need
3. Medical history
4. Upload records
5. Preferences and budget
6. Travel readiness
7. Consent
8. Case submitted

Show:

- progress;
- time estimate;
- save and continue later;
- privacy reassurance;
- coordinator availability.

---

# 17. Empty, Loading, and Error States

## 17.1 Empty state

Use a small original illustration, one sentence, and one action.

Example:

```text
No hospital proposals yet

Your coordinator is preparing your case for matched hospitals.
Most proposals arrive after the medical record review is complete.

[View required records]
```

## 17.2 Loading

Use skeletons shaped like the final layout.

For long medical processing:

```text
Analysing 12 uploaded records
This may take a few minutes. You can leave this page safely.
```

Show real progress only if progress is measurable.

## 17.3 Error

Explain:

- what failed;
- whether data was saved;
- what the user can do;
- how to contact support.

Avoid generic “Something went wrong” as the only message.

---

# 18. Accessibility

Minimum target: **WCAG 2.2 AA**.

Requirements:

- keyboard navigation;
- visible focus;
- semantic headings;
- correct form labels;
- alt text for meaningful medical visuals;
- non-colour status indicators;
- minimum 4.5:1 text contrast;
- minimum 3:1 for large text and essential UI boundaries;
- 44 × 44 px touch targets;
- reduced-motion mode;
- zoom support to 200%;
- screen-reader status announcements;
- chart data available as text or table;
- captions/transcripts for video;
- no autoplaying audio.

Medical terminology should have optional plain-language explanations.

---

# 19. Privacy and Trust UI

Healthcare trust must be visible in the interface, not hidden in legal pages.

Show:

- data-sharing status;
- who has access;
- consent history;
- download/delete request controls;
- session and device management;
- secure upload state;
- record provenance;
- audit history for staff actions.

Use a dedicated “Privacy and access” page.

Avoid false claims such as “100% secure”. Use precise claims supported by the actual product architecture and certifications.

---

# 20. Responsive Behaviour

## 20.1 Breakpoints

```text
Mobile: 0–639 px
Tablet: 640–1023 px
Desktop: 1024–1439 px
Wide: 1440 px+
```

## 20.2 Mobile dashboard order

1. greeting and status;
2. next action;
3. attention card;
4. journey progress;
5. upcoming consultation;
6. coordinator;
7. metrics;
8. medical visual;
9. cost estimate;
10. education.

The large anatomy visual must not push urgent actions below the fold.

## 20.3 Tablet

- two-column cards;
- collapsible navigation rail;
- anatomy visual may span full width;
- comparison matrices become horizontal scroll with sticky labels.

## 20.4 Desktop

- maintain 12-column grid;
- support 1280 px comfortably;
- avoid excessive blank width on 4K screens;
- limit text line length.

---

# 21. Motion

Motion should communicate state changes.

Use:

- 150–220 ms micro-interactions;
- 240–320 ms panel transitions;
- gentle fade and translate;
- soft progress-node activation;
- small chart draw animation on first load;
- no constant floating animations.

Suggested easing:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 22. Iconography and Imagery

## 22.1 Icons

Recommended:

- Lucide;
- Phosphor;
- custom medical line icons where necessary.

Rules:

- 1.5–2 px stroke;
- rounded line endings;
- consistent optical size;
- use filled icons only for selected or high-priority states.

## 22.2 People photography

Use:

- neutral, warm lighting;
- natural expressions;
- diverse patients and professionals;
- uncluttered clinical backgrounds;
- circular or softly rounded crops.

Avoid fake AI faces in final production when representing named doctors or staff.

## 22.3 Hospital imagery

- use verified or licensed images;
- show facility context;
- label images accurately;
- avoid photos that imply a facility or service not actually available.

---

# 23. Design Tokens

```css
:root {
  --brand-50: #EEF4FF;
  --brand-100: #DDE9FF;
  --brand-200: #BCD2FF;
  --brand-500: #2F6BFF;
  --brand-600: #1F56E5;
  --brand-700: #1846BE;
  --indigo-500: #5C4DFF;

  --ink-950: #111318;
  --ink-700: #3E4552;
  --ink-500: #6E7685;

  --surface-0: #FFFFFF;
  --surface-50: #F7F8FA;
  --surface-100: #F1F3F6;
  --line-200: #E6E9EF;

  --success-500: #1FA971;
  --warning-500: #E7A322;
  --danger-500: #D84A4A;
  --info-500: #4285F4;
  --purple-500: #7657E8;
  --teal-500: #1C9A9A;

  --radius-app: 24px;
  --radius-panel: 20px;
  --radius-card: 16px;
  --radius-control: 12px;
  --radius-pill: 999px;

  --shadow-card: 0 1px 2px rgba(16, 24, 40, 0.03);
  --shadow-float:
    0 12px 32px rgba(17, 19, 24, 0.10),
    0 2px 8px rgba(17, 19, 24, 0.05);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

# 24. Tailwind Theme Guidance

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF4FF",
          100: "#DDE9FF",
          200: "#BCD2FF",
          500: "#2F6BFF",
          600: "#1F56E5",
          700: "#1846BE",
        },
        indigoAccent: "#5C4DFF",
        ink: {
          950: "#111318",
          700: "#3E4552",
          500: "#6E7685",
        },
        surface: {
          0: "#FFFFFF",
          50: "#F7F8FA",
          100: "#F1F3F6",
        },
        line: {
          200: "#E6E9EF",
        },
      },
      borderRadius: {
        app: "24px",
        panel: "20px",
        card: "16px",
        control: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.03)",
        float:
          "0 12px 32px rgba(17,19,24,.10), 0 2px 8px rgba(17,19,24,.05)",
      },
    },
  },
};
```

---

# 25. Suggested Component Library

Build reusable primitives before pages.

```text
AppShell
TopNavigation
MobileBottomNavigation
PageHeader
SectionHeader
Card
NestedCard
MetricCard
StatusChip
AttentionCard
TreatmentPathItem
JourneyTimeline
DoctorCard
HospitalCard
CoordinatorCard
AppointmentCard
CostSummaryCard
FileCard
DocumentViewer
SourceBadge
ReviewBadge
ConsentBadge
EmptyState
Skeleton
ErrorState
PrimaryButton
SecondaryButton
IconButton
SearchInput
DateRangeControl
FilterDrawer
ComparisonTable
ChatThread
MessageComposer
```

Every component should have:

- default;
- hover;
- focus;
- active;
- disabled;
- loading;
- error;
- empty;
- mobile states.

---

# 26. Example Patient Dashboard Component Tree

```tsx
<PatientDashboard>
  <AppShell>
    <TopNavigation />

    <PageHeader
      greeting="Good morning, Ajeya"
      subtitle="Two hospital proposals are ready for review."
      status="Under clinical review"
      primaryAction="View full journey"
    />

    <DashboardGrid>
      <CaseVisualPanel>
        <MedicalModel />
        <HotspotControls />
        <FloatingMetricCard />
        <VisualSelector />
      </CaseVisualPanel>

      <CaseOverviewPanel>
        <SectionHeader title="Your case overview" />
        <MetricGrid>
          <MetricCard />
          <MetricCard />
          <MetricCard />
        </MetricGrid>
      </CaseOverviewPanel>

      <NextStepsPanel>
        <TreatmentPathItem />
        <TreatmentPathItem />
        <TreatmentPathItem />
      </NextStepsPanel>

      <AppointmentsPanel>
        <AppointmentCard />
        <AppointmentCard />
      </AppointmentsPanel>

      <AttentionCard />
      <CoordinatorCard />
      <CostSummaryCard />
    </DashboardGrid>
  </AppShell>
</PatientDashboard>
```

---

# 27. Content Rules

## 27.1 Good microcopy

- “Two reports are still required”
- “Reviewed by a cardiologist”
- “Estimate updated 2 hours ago”
- “Excludes flights and accommodation”
- “Hospital response expected by 27 Jul”
- “AI-assisted extraction — please verify”
- “Your data has not been shared with this hospital yet”

## 27.2 Avoid

- “Best hospital”
- “Guaranteed cure”
- “100% success”
- “Cheapest treatment”
- “Perfect match”
- “No-risk procedure”
- “AI diagnosis complete”
- “Secure forever”

Use qualified, transparent wording.

---

# 28. Demo Data Guidance

For product demos and YC/investor recordings, use a clearly labelled synthetic case.

Example:

```text
Demo patient: Arun Mehta
Age: 54
Country: India
Treatment need: Mitral valve repair
Destination options: Bengaluru, Chennai, Singapore
Case status: Hospital proposals received
Records: 14 uploaded
Hospital proposals: 3
Estimated treatment range: ₹7.8L–₹11.4L
Next action: Review specialist consultation slots
Care coordinator: Rhea Nair
```

Add a discreet label:

```text
Synthetic demo case — no real patient data
```

Do not use real patient records in public demos.

---

# 29. Do Not Copy from the Reference

Do not copy:

- the Healthink name or logo;
- the exact navigation labels;
- the exact heart asset;
- the doctor names;
- the specific card wording;
- the exact panel proportions;
- the exact metric layouts;
- the exact blue gradient;
- the exact background photograph.

The goal is to reuse the **design principles**, not clone the artwork.

---

# 30. Anti-Slop Rules

The final interface must not contain:

- excessive glassmorphism;
- glowing borders everywhere;
- giant gradient headlines;
- floating abstract blobs;
- random 3D icons;
- meaningless AI sparkles;
- fake charts;
- unsupported claims;
- 20 cards with equal visual weight;
- overly rounded mobile-toy styling;
- dense text inside tiny cards;
- generic stock illustrations;
- inconsistent icon sets;
- mixed border-radius systems;
- empty “analytics” built only to look impressive.

Every visual element must either explain, prioritise, reassure, or enable action.

---

# 31. Build Acceptance Checklist

## Visual

- [ ] The page has a clear primary visual anchor.
- [ ] White space is generous but not wasteful.
- [ ] Cards use consistent radii and borders.
- [ ] Blue is reserved for interaction and emphasis.
- [ ] Text hierarchy is obvious at a glance.
- [ ] The UI looks premium at 1280 px and 1440 px.
- [ ] Mobile preserves the task hierarchy.
- [ ] Medical imagery is relevant and original.

## UX

- [ ] The user’s next action is visible without scrolling.
- [ ] Urgent issues appear before promotional content.
- [ ] Every medical datum shows its source or review state.
- [ ] Cost estimates explain inclusions and exclusions.
- [ ] Human support is easy to reach.
- [ ] Long forms autosave.
- [ ] Empty and error states are actionable.
- [ ] Hospital comparison explains criteria.

## Trust and compliance

- [ ] No guaranteed clinical outcomes.
- [ ] No fake accreditations.
- [ ] No real patient data in demos.
- [ ] AI-assisted output is labelled.
- [ ] Consent and sharing state are visible.
- [ ] Accessibility meets WCAG 2.2 AA.
- [ ] Privacy claims match actual implementation.

## Engineering

- [ ] Components are reusable.
- [ ] 3D assets are lazy-loaded.
- [ ] Images use responsive formats.
- [ ] Skeletons reduce layout shift.
- [ ] Page performance remains acceptable on mid-range mobile.
- [ ] Keyboard navigation works.
- [ ] Reduced-motion mode works.
- [ ] Charts have text alternatives.

---

# 32. Copy-Paste Build Prompt

Use the following prompt with Gemini, Codex, Claude, Fable, or another builder:

```text
Redesign the Canopus Care website and authenticated product using the attached
DESIGN.md as the binding visual and UX specification.

The supplied healthcare-dashboard image is a style reference only. Do not clone
its brand, exact layout, text, logo, doctor names, anatomical asset, or artwork.
Translate its strengths into an original Canopus Care system: clean white
surfaces, a cool clinical background, modular rounded cards, restrained cobalt
blue accents, compact medical metrics, high-quality case-relevant anatomy, and
clear patient actions.

PRODUCT CONTEXT
Canopus Care is a medical-treatment coordination platform. It helps patients
organise medical records, receive clinical review, compare hospitals and
doctors, understand treatment costs, coordinate consultations, plan visas and
travel, communicate with a care coordinator, and manage follow-up.

PRIMARY DESIGN OUTCOME
The product must feel like a premium clinical command centre combined with a
trusted international-care concierge. It must not look like a generic admin
template, insurance portal, travel marketplace, or neon AI product.

BUILD THESE FOUNDATIONS FIRST
1. Global design tokens from DESIGN.md.
2. Responsive app shell.
3. Desktop top navigation and mobile bottom navigation.
4. Reusable card, status, metric, timeline, appointment, coordinator, record,
   cost, hospital, comparison, and attention components.
5. Complete hover, focus, active, disabled, loading, empty, and error states.
6. WCAG 2.2 AA accessibility.
7. Original imagery and original interface composition.

BUILD OR REDESIGN THESE SCREENS
1. Public landing page.
2. Patient dashboard.
3. Case overview.
4. Medical-record workspace.
5. Hospital discovery.
6. Hospital comparison.
7. Treatment-plan page.
8. Cost planner.
9. Travel and admission workspace.
10. Secure messaging.
11. Profile, consent, privacy, and access.
12. Care-coordinator operations dashboard.

PATIENT DASHBOARD
Use an asymmetrical 12-column desktop layout. The left side should contain a
case-relevant 3D medical visual with subtle hotspots and one floating metric
card. The right side should contain case metrics, next steps, appointments,
care-coordinator access, an attention card, and a cost preview. On mobile, put
the next action, urgent issue, journey progress, appointment, and coordinator
before the large medical visual.

DATA AND COPY
Use a clearly labelled synthetic patient case. Do not use real patient data.
Every medical value must show date, unit, source, and review state where
relevant. Every AI-generated or AI-extracted result must be visibly labelled.
Do not use guaranteed-outcome language.

ENGINEERING EXPECTATIONS
- Use reusable production-quality components.
- Preserve or improve the existing application architecture.
- Do not replace working business logic with static mockups.
- Use semantic HTML and keyboard-accessible controls.
- Lazy-load large medical assets.
- Optimise images and prevent layout shift.
- Keep the visual layer independent of backend data contracts.
- Add Storybook or an equivalent component showcase if the project supports it.
- Add visual regression coverage for the main states.
- Add responsive tests for mobile, tablet, desktop, and wide desktop.

QUALITY BAR
The result should look intentionally designed at every breakpoint. It should
have disciplined spacing, restrained colour, clear visual hierarchy, realistic
content, and no generic AI-generated UI filler. Follow every requirement,
component rule, content rule, anti-slop rule, and acceptance item in DESIGN.md.
```

---

# 33. Final Visual Summary

The target Canopus Care aesthetic is:

> **A quiet, premium, white clinical workspace with case-relevant anatomical imagery, compact medical and journey metrics, precise blue accents, rounded modular surfaces, visible human support, transparent provenance, and one obvious next action at every stage.**

That is the design standard to preserve across the website, patient product, coordinator product, and demo materials.
