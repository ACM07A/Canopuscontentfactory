# MedYatra Growth Factory — operator runbook

Open `http://localhost:5173/growth` in the operator workspace. The factory cycle is autonomous for research, planning, local rendering, QA handoff and recommendation generation. It does not publish, message a person, activate an ad, or spend money without a human decision.

## Factory flow

1. Create an experiment brief with market, audience, objective, channels and working budget.
2. Run the cycle manually with **Run cycle now**, or leave `GROWTH_AUTOPILOT=1` enabled for the six-hour cadence.
3. Review the research packet. It uses public-web surfaces such as Google Trends, TikTok Creative Center, Meta Ad Library, Pinterest Trends and YouTube search. Public signals are directional, not proof of clinical, pricing, credential or outcome claims.
4. Open the generated package from the approval queue. SEO drafts, video briefs, carousel cards, copy and `package.json` metadata are written under `outputs/factory/`.
5. Approve or reject each asset. Approval records the reviewer and decision; it does not publish.
6. For an approved asset, use **Prepare dry-run payload**. The handoff checks the approval record, builds the channel payload and invokes the existing publisher adapter in dry-run mode.
7. Live publishing requires the platform credentials, an approved asset, `confirm=true`, and `POST_LIVE=1`. Paid campaign activation and spend remain separate human decisions.

## Freepik/Magnific generation

Set `FREEPIK_API_KEY`, `FREEPIK_IMAGE_MODEL`, `FREEPIK_VIDEO_MODEL`, and explicitly list only account-confirmed unlimited models in `FREEPIK_UNLIMITED_MODELS`. The worker refuses models that are not on that allowlist. Unlimited availability is account/plan-specific; credit-consuming models are blocked by policy.

Run `npm run factory:worker` to submit ready jobs. The worker only submits generation tasks and stores provider task IDs. It never publishes or contacts a lead.

For a multi-scene organic Short, set a profile and run the explicit sequence command:

```powershell
$env:FACTORY_VIDEO_USE_CASE="knee-replacement"
$env:FACTORY_VIDEO_SCENE_SECONDS="5"
npm run factory:sequence
```

Available profiles include `knee-replacement-doctor`, `knee-replacement`, `cardiac`, `dental`, `fertility`, and `oncology`. The `knee-replacement-doctor` profile adapts the question-led educator format into six independently generated scenes assembled into a 30-second 9:16 MP4, with script-led review captions. Change `FACTORY_VIDEO_SCENES` to shorten a sequence. This command generates but never publishes.

## Hybrid Magnific web-app bridge

The hybrid bridge keeps strategy, scripts, safety checks, approvals, captions, assembly and attribution in this repo. An approved job can be prepared in a signed-in Magnific web-app browser session, while direct API generation remains an optional fallback. The bridge never bypasses login, CAPTCHA, quotas or credit controls.

Configure the browser worker with a real browser profile and keep submission off while testing:

```powershell
$env:MAGNIFIC_WEB_ENABLED="1"
$env:MAGNIFIC_WEB_AUTO_SUBMIT="0"
$env:MAGNIFIC_WEB_CONFIRM="0"
$env:STEALTH_PROFILE_DIR="C:\path\to\magnific-profile"
npm run hybrid:web-worker
```

The worker only handles jobs explicitly marked `APPROVED_FOR_GENERATION`. With auto-submit disabled, it opens Magnific and prepares the prompt for an operator to review. Enabling auto-submit requires both `MAGNIFIC_WEB_AUTO_SUBMIT=1` and `MAGNIFIC_WEB_CONFIRM=1`; this is an explicit credit-consuming action. Use `POST /api/growth/hybrid/jobs` to queue a brief and `/api/growth/hybrid/jobs/:id/approve` to approve it for generation.

## Attribution and optimization

Send anonymous events to `POST /api/growth/events` with `event_type`, `experiment_id`, `channel`, `campaign`, `creative_id`, `landing_page`, `client_id` and UTM fields. Email, phone, MRN, UHID and passport-like values are rejected. Recommendations are generated only after enough lead events exist and distinguish qualified leads from unqualified volume.

## Safety boundary

Every asset remains research-only until claims are cited and a reviewer signs off. MedYatra is a facilitator, not a provider. Do not add diagnosis, treatment advice, guarantees, fabricated prices, outcomes, accreditations or credentials to a brief or asset.
