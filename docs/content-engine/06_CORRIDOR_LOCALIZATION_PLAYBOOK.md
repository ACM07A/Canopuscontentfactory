# Canopus Care — Corridor & Multilingual Localization Playbook

A corridor page is a patient-journey page, not translated SEO filler.

## Recommended 10-language launch architecture
1. English `en` — global, Kenya, Nigeria, Tanzania, Gulf
2. Arabic `ar` — UAE, Oman, Gulf/MENA
3. French `fr` — Francophone Africa
4. Swahili `sw` — Kenya/Tanzania/East Africa
5. Bengali `bn` — Bangladesh
6. Nepali `ne` — Nepal
7. Sinhala `si` — Sri Lanka
8. Russian `ru` — Russia/CIS/Central Asia
9. Uzbek `uz` — Uzbekistan/Central Asia
10. Indonesian `id` — Southeast Asia

Reorder using qualified-lead and Search Console data.

# Kenya → India
Languages: English, Swahili.
Unique modules: Nairobi/relevant departure logic without hard-coded fares; current India medical-visa source; English/Swahili coordinator; companion planning; payment/currency planning; return-home rehab/oncology/cardiology handoff; country-specific patient questions.

Example title: `Knee Replacement in India for Kenyan Patients: Cost, Hospitals, Travel & Recovery`

# Tanzania → India
Languages: Swahili, English.
Unique modules: Dar es Salaam/relevant hubs; current visa; Swahili care-navigation; companion; longer oncology/transplant stay; return-home continuity.

# Nigeria → India
Language: English.
Unique modules: Lagos/Abuja/relevant hubs; sponsor/employer/insurance documents where applicable; full estimate comparison; long-stay budget; return-home specialist handoff; hospital-letter/payment verification. Never infer visa eligibility—verify official rules.

# UAE → India
Languages: Arabic, English.
Unique modules: second-opinion and comparison intent; short-haul travel; RTL; reimbursement-document checklist without implying coverage; home-country follow-up; specialist-first city choice.

# Oman → India
Languages: Arabic, English.
Unique modules: Arabic clinical explanations; referral records; companion; visa source; follow-up in Oman; treatment-specific local stay.

# Bangladesh → India
Languages: Bengali, English.
Unique modules: Bengali explanation; current visa; transport/flight logic by city; payments; caregiver; follow-up; current hospital selection.

Example title draft: `ভারতে হাঁটু প্রতিস্থাপন: বাংলাদেশি রোগীদের জন্য খরচ, হাসপাতাল ও ভ্রমণ গাইড`
Native review required before indexation.

# Nepal → India
Languages: Nepali, English.
Unique: cross-border travel, documents, language, hospital city, follow-up.

# Sri Lanka → India
Languages: Sinhala, English.
Unique: short-haul travel, city selection, companion, current entry/visa rules, follow-up. Add Tamil when demand supports it.

# Uzbekistan / Central Asia → India
Languages: Uzbek, Russian, English.
Unique: translated records, visa, connection planning, extended oncology/transplant stays, payments, return-home care.

# Russia / CIS → India
Languages: Russian, English.
Unique: medical document translation, specialist/hospital match, multi-leg travel, long-stay planning, medication/follow-up availability after return.

# Francophone Africa
Start with a French hub `/fr/traitements-en-inde/`, then add country pages only where there is real lead demand and unique country data.

---

# Translation workflow

1. Lock medically reviewed English source version.
2. Maintain translation memory/glossary.
3. Native translation.
4. Medical terminology review.
5. Corridor review for currency, visa, travel, contact and cultural context.
6. Local-language query/SEO adaptation.
7. Keep draft at `noindex,follow`.
8. Publish only after signoff.

Arabic: `<html lang="ar" dir="rtl">`; test directional icons, phone input, mixed numerals and currency. Do not blindly mirror anatomical diagrams.

Recommended URL model:
`/en/...`, `/ar/...`, `/sw/...`, `/bn/...`
and corridor pages such as `/sw/ke/treatments/...`.

Use reciprocal `hreflang` plus `x-default`.

## Localization acceptance
- full article translated;
- medical terminology reviewed;
- local facts current;
- visa source current;
- CTA natural in the language;
- metadata/alt text localized;
- `inLanguage` correct;
- hreflang reciprocal;
- RTL tested;
- no unsupported “best” claims;
- material local value.
