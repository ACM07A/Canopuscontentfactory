# Canopus Care — Coding Agent Implementation Prompt

Use this prompt with Codex/Claude/Gemini or another coding agent after attaching the current Canopus Care repository and this content pack.

```text
You are implementing a production-grade treatment-resource and lead-generation
system inside the existing Canopus Care website.

FIRST
Inspect the repository. Do not replace the existing application shell, brand
identity, routing, analytics, authentication or working business logic. Read
CANOPUS_CARE_DESIGN.md and reuse the existing tokens/components where possible.

DESIGN OUTCOME
The resource centre must look native to Canopus Care:
- premium clinical command-centre aesthetic
- white/off-white surfaces
- restrained cobalt blue/indigo
- graphite text
- rounded modular cards
- thin borders
- generous spacing
- medically relevant imagery
- visible human coordinator
- source provenance
- one obvious next action
- no generic blog theme
- no neon AI aesthetic
- no marketplace-style clutter

CONTENT INPUTS
Use:
- 01_MASTER_GROWTH_CONTENT_SYSTEM.md
- 02_PAGE_MANIFEST.json
- 03_FLAGSHIP_KNEE_REPLACEMENT_INDIA.md
- 04_FLAGSHIP_CABG_HEART_BYPASS_INDIA.md
- 05_FLAGSHIP_CANCER_TREATMENT_INDIA.md
- 06_CORRIDOR_LOCALIZATION_PLAYBOOK.md
- 07_VERTICAL_PAGE_BLUEPRINTS.md
- 11_INFOGRAPHICS_AND_VISUAL_SPECS.md
- 12_CRO_COMPONENT_COPY.md

Do NOT mass-publish every manifest URL. The manifest is an opportunity inventory.
A URL becomes indexable only after editorial, medical, localization and SEO review.

BUILD REUSABLE COMPONENTS
1. ResourceCentre
2. TreatmentArticle
3. CorridorTreatmentArticle
4. StickyLeadRail
5. MobileConversionBar
6. MedicalReviewBadge
7. SourceCitation / EvidenceFootnote
8. CostEvidenceCard
9. CostComparisonTable
10. HospitalEvidenceCard
11. DoctorEvidenceCard
12. TreatmentTimeline
13. RecordsChecklist
14. UrgentCareAlert
15. TableOfContents
16. FAQ
17. RelatedResources
18. LanguageSwitcher
19. Hreflang generator
20. Article + Breadcrumb structured-data generator
21. FreshnessStatus
22. SecureReportUpload
23. LeadSuccessState
24. InfographicShell

DESKTOP ARTICLE LAYOUT
Use a 12-column container.
Article: ~8 columns.
Lead rail: ~4 columns, 320–360px usable.
Keep article text around 680–760px for readability.
Sticky rail must stop before the footer and must not overlap content.

ARTICLE HERO
- breadcrumb
- H1
- medically reviewed by [real reviewer only after approval]
- editorially reviewed by Canopus Care
- last reviewed / last updated
- read time
- source count
- quick-answer panel
- primary CTA
- optional treatment-relevant anatomical visual

STICKY LEAD RAIL — STEP 1
Fields:
- Country
- Treatment or diagnosis
- WhatsApp number
- Do you have medical reports? Yes / No

Button:
Get my case reviewed

Support copy:
Canopus Care coordinates records and hospital responses.
Doctors and hospitals make clinical decisions.

STEP 2
- First name
- Email (optional unless operationally required)
- Preferred language
- Secure report upload
- explicit consent

AFTER SUBMISSION
Show truthful workflow:
1. We check whether the available records are complete.
2. A care coordinator contacts you.
3. With your consent, the case can be routed to suitable hospital teams.
4. Hospitals make clinical decisions and provide plans/estimates.

Never invent a response-time SLA.

MOBILE
Do not pin a large form.
Use:
- CTA after quick answer
- CTA after records checklist
- CTA after cost
- CTA after hospital comparison
- compact bottom action bar: Send reports | Talk to coordinator

CONTENT RENDERING
Medical content must be crawlable server-rendered or statically generated text.
Do not put essential content only behind client-only accordions/tabs.
Use semantic headings and real HTML tables.

SEO
- self canonical for each unique page
- clean locale URL
- reciprocal hreflang
- x-default
- locale/content-type XML sitemaps
- Article or BlogPosting structured data
- BreadcrumbList
- Organization
- real Person author/reviewer
- MedicalWebPage can be used semantically when appropriate
- structured data must match visible content
- no fabricated AggregateRating / Review
- no dependence on FAQ rich results

INDEXATION WORKFLOW
Article states:
DRAFT
RESEARCHED
MEDICAL_REVIEW
LOCALIZATION_REVIEW
SEO_REVIEW
APPROVED
PUBLISHED
STALE
ARCHIVED

Only APPROVED/PUBLISHED pages may be indexable.
Unreviewed translations stay noindex,follow.

FRESHNESS MODEL
Every volatile fact should support:
- value
- source_url
- checked_at
- expires_at
- reviewer
- verification_status

Volatile:
- hospital program
- doctor role/title
- price
- visa
- accreditation
- availability

When a volatile fact expires, do not silently leave it forever. Flag the page in
the editorial queue and optionally render a neutral “information being
reverified” state.

COST UX
Never show a treatment price without:
- source
- checked date
- what the price represents
- important inclusions/exclusions where known
- reminder that patient-specific estimate may differ

Allow three data levels:
1. Published reference signal
2. Canopus anonymized observed range (only with enough current cases)
3. Patient-specific current hospital estimate

HOSPITAL / DOCTOR CARDS
Use:
Hospitals to evaluate
Doctors to evaluate

Each card needs current official evidence and checked date.
Do not use “best” unless an explicit transparent independent ranking methodology exists.
Do not invent success rates, procedure volumes, accreditations or titles.

INFOGRAPHICS
Implement reusable responsive HTML/SVG components:
- treatment journey
- decision pathway
- record checklist
- cost anatomy
- recovery milestones
- hospital comparison scorecard
- corridor journey map
All visual information must also be present in text/table form.

ACCESSIBILITY
WCAG 2.2 AA.
44px targets.
Keyboard-accessible TOC/form.
Visible focus.
RTL Arabic support.
Reduced-motion.
Responsive tables.
Charts/diagrams have text equivalents.

ANALYTICS
Track:
resource_view
toc_interaction
cost_section_view
hospital_section_view
doctor_section_view
cta_click
lead_step_1_complete
lead_step_2_complete
report_upload_start
report_upload_complete
whatsapp_click
qualified_lead
hospital_route_ready
hospital_response_received
treatment_confirmed

Do not send diagnosis, medical-record contents or other sensitive medical data
into general analytics/event payloads.

PRIVACY
- secure upload
- no public medical-file URLs
- consent before sharing with hospitals
- reuse the application’s secure storage/auth patterns
- preserve audit history
- never put medical records into client logs or search indexes

LOCALIZATION
Support:
en, ar, fr, sw, bn, ne, si, ru, uz, id
but publish only reviewed locales.

Arabic:
<html lang="ar" dir="rtl">

Do not merely machine-translate SEO keywords. Each locale needs native query and
medical-language review.

QUALITY BAR
No:
- unsupported medical advice
- fabricated costs
- stale doctor roles without warning
- fake accreditation
- guaranteed outcomes
- fake urgency/countdown timers
- “top hospital” filler
- copy/paste country pages
- generic AI prose
- hidden SEO keyword blocks

FIRST IMPLEMENTATION
1. Add the content platform/components.
2. Publish the three flagship English resources after real medical-review placeholders are resolved.
3. Add the first high-value corridor pages only after local uniqueness exists.
4. Add tools/checklists.
5. Add editorial freshness dashboard.
6. Test desktop/mobile/RTL, metadata, schema, sitemap, canonical, hreflang and lead flow.
7. Run visual regression and accessibility tests before merging.
```
