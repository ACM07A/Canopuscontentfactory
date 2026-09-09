# Local video benchmark agent

Run from the repository root. This is a separate local worker process; it does not require another chat or an always-running model server. FFmpeg extracts evidence, Marlin-2B interprets video, Faster-Whisper transcribes audio, and Qwen builds a structured draft template. The compiler writes 50 scene manifests; the renderer assembles supplied generated clips. No paid provider generations or posts are submitted.

## Feed a reference

One-command analysis and 50-plan handoff (after creating/editing the matrix below):

```powershell
npm run factory:benchmark -- run "C:\path\reference.mp4" --out "outputs/factory/benchmarks/reference-001" --matrix "variant-matrix.json"
```

This writes run-state.json and 50 asset manifests. It stops at AWAITING_GENERATED_CLIPS; it does not mislabel missing video generations as finished products. The individual commands below support inspection and retry.

```powershell
npm run factory:benchmark -- prepare "C:\path\reference.mp4"
```

The command prints the output directory and a review.html file. Open that file in your browser to inspect timecoded frames and extracted reference audio. Videos must be at most ten minutes. URL input creates a NEEDS_LOCAL_MEDIA record: a social post link is not treated as a watched video. A local reference copy is used only to extract the creative mechanics; the renderer generates an independent new asset and never publishes or repurposes the reference media.

## Analyze each reference

```powershell
npm run factory:benchmark -- perceive "OUTPUT_DIRECTORY"
```

Runs the installed Python runtime directly. Defaults: cached NemoStation/Marlin-2B on CUDA; cached faster-whisper small on CPU int8; Qwen/Qwen3-1.7B for instruction-following planning, loaded after Marlin exits to release GPU memory. BENCHMARK_PYTHON selects Python; --model selects the vision checkpoint; --planner or BENCHMARK_PLANNER_MODEL selects a cached text planner. Model loading is offline-only; missing weights fail instead of silently downloading or calling a paid service. The vision loader searches complete cached snapshots if the latest cached revision only has a config.

Outputs: vision.json (time-ranged model descriptions), audio-analysis.json (words, times, confidence, language, pacing, silence/volume measurements), template-candidate.txt (raw planner response), and validated template.json. A malformed template blocks; it is never replaced with a generic format. ASR is not verified transcription, and video descriptions are fallible. Tone/music identification, exact shot boundaries and lip-sync measurement are not implemented. Sampled video can miss brief edits. Read agents/video-benchmark/INSTRUCTIONS.md for the analyst contract.

Retry planning without re-running perception: `npm run factory:benchmark -- plan "OUTPUT_DIRECTORY"`. Audio alone: `npm run factory:benchmark -- audio "OUTPUT_DIRECTORY"`. The older `analyze --model NAME` command remains an optional Ollama adapter, not the default.

Alternatively, the assistant or a human analyst can inspect the evidence and create the specified JSON, then import it:

```powershell
npm run factory:benchmark -- import "OUTPUT_DIRECTORY" --template "reviewed-analysis.json"
```

Import validates timing and required fields; it does not certify factual accuracy. Templates remain unreviewed. All scene observations should cite frames/timecodes; production tools and prompts are reconstruction hypotheses. Unknown details must remain explicit.

## Produce 50 variants

```powershell
npm run factory:benchmark -- matrix "variant-matrix.json"
npm run factory:benchmark -- variants "OUTPUT_DIRECTORY" --matrix "variant-matrix.json"
```

The default editable matrix is five niches × five geographies × two angles. Customize the fields and add template variables for props, objections, local idiom, proof asset, CTA and language. Exactly 50 unique briefs are required. Arabic rows are briefs requiring transcreation, not automatically translated English scripts.

The compiler exports variants.json and 50 plans/variant-NNN.json files. Each contains style instructions, storyboard, exact dialogue, matching caption text, visual generation prompts, production method, invariants, localization requirements and a content fingerprint. Open review.html to inspect all plans. They are production drafts, not rendered videos; geographic variable substitution alone does not establish cultural adaptation.

## Rendering handoff

```powershell
npm run factory:benchmark -- assets "OUTPUT_DIRECTORY/plans/variant-001.json" --out "assets.json"
# Fill each video field with the generated local clip path; relative paths resolve beside assets.json.
npm run factory:benchmark -- render "OUTPUT_DIRECTORY/plans/variant-001.json" --assets "assets.json" --out "outputs/factory/video-sequences/benchmark-001"
```

The asset manifest binds to the entire plan fingerprint and exact scene dialogue. Speaking clips must be native-dialogue or audio-driven with their synchronized audio embedded. External narration over a speaking face is rejected. Licensed cutaways can use mode broll plus an optional audio path; footage shorter than the speech is blocked. Missing/incorrect assets fail before final assembly. Clips must be supplied: this command does not generate new Kling footage or perform face animation.

The renderer transcribes each final clip, blocks any lexical dialogue mismatch (case/punctuation ignored), measures actual duration, builds word-timed caption groups, preserves the original audio, and exports H.264/AAC 1080x1920 plus captions.srt, captions.ass, plan.json and render-qa.json. ASR errors can cause false blocks: inspect the saved recognition and fix the clip/transcription workflow rather than silently burning an incorrect medical word into captions. It does not trim spoken words to template timings. Optional plan.render_style controls font_name, font_size, color and margin_v. Outputs always remain RENDERED_REVIEW_REQUIRED with publish:false. Mouth sync, rights, editorial and localization review remain required.

The existing `npm run factory:post` also accepts FACTORY_BENCHMARK_PLAN, FACTORY_BENCHMARK_ASSETS and FACTORY_BENCHMARK_OUTPUT environment variables to select this same renderer instead of legacy profile-array post-production. Without those variables the legacy path is unchanged.

For each candidate compare the final video against the reference rubric: opening hook, rhythm, frame composition, face/voice continuity, audio/caption accuracy, relevant cutaways and local language quality. Track retention and enquiries only from actual distribution data. A benchmark's production process and virality cannot be proven from its appearance alone.

Dependencies reused: installed PyTorch/Transformers, Marlin and Faster-Whisper. Qwen planner weights are an additional local download; no new repository needs to be cloned. Model documentation: https://huggingface.co/NemoStation/Marlin-2B and https://huggingface.co/Qwen/Qwen3-1.7B. Audio implementation: https://github.com/SYSTRAN/faster-whisper.

Tests: `node --test tests/video-benchmark.test.mjs`. Opt-in real-media integration: set BENCHMARK_MEDIA_TEST=1 and run `node --test tests/benchmark-render.integration.test.mjs`. It requires the local-smoke-20260907 audio fixture and cached Whisper weights; its color-card video is explicitly test-only.
