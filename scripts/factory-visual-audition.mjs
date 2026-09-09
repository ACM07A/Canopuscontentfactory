// Explicit Freepik visual audition: no posting and no fake audio/lip-sync claims.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../lib/env.mjs';
import { createVideo, getVideoTask, status as providerStatus } from '../lib/providers/freepik.mjs';

loadEnv();
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.env.FACTORY_AUDITION_ID || 'yapper-vsl-knee-visual-audition-001';
const dir = join(root, 'outputs/factory/video-sequences', id);
const source = process.env.FACTORY_AUDITION_IMAGE || join(dir, 'presenter-reference.png');
const model = process.env.FACTORY_AUDITION_MODEL || 'kling-v2-5-pro';
const prompt = `Vertical 9:16 authentic creator-style social-video visual, five seconds. Use the supplied fictional educator identity exactly: same face, salt-and-pepper hair, short beard, charcoal overshirt and navy shirt, warm home-office background. Medium close-up, direct camera eye-line. He begins with a small intentful hand gesture, leans in slightly as if opening an important question, then relaxed natural facial response. Hand motion is anatomically correct and subtle. Premium but believable smartphone creator footage, natural daylight and warm lamp light, gentle handheld micro-movement, one continuous shot. No words, no burned-in captions, no logos, no medical badge, no white coat, no stethoscope, no hospital branding, no visual of diagnosis or treatment. This is an illustrative facilitator educator, not a clinician.`;
const negative = 'robotic face, frozen pose, face morphing, plastic skin, teleprompter stare, lip movement without audio, speaking, lip sync, text, watermark, logo, badge, white coat, stethoscope, deformed hands, extra fingers, flicker, jump cut, hospital branding';
if (!existsSync(source)) throw new Error(`Reference image not found: ${source}`);
if (!providerStatus().configured) throw new Error('FREEPIK_API_KEY is not configured');
if (!providerStatus().unlimitedModels.includes(model)) throw new Error(`${model} is not configured as an allowed unlimited model`);
mkdirSync(dir, { recursive: true });
const manifestPath = join(dir, 'visual-audition.json');
let manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;
if (!manifest) {
  const task = await createVideo({ model, prompt, image: readFileSync(source).toString('base64'), duration: 5, aspectRatio: '9:16', generateAudio: false, negativePrompt: negative });
  manifest = { id, model, prompt, negative_prompt: negative, task, source: 'presenter-reference.png', audio: 'NONE — this visual-only model run is not an approved talking-head output', publish: false, review: 'Human visual review required' };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}
const terminal = s => ['COMPLETED','SUCCEEDED','FAILED','ERROR','CANCELLED'].includes(String(s).toUpperCase());
let current = manifest.task;
for (let attempt = 0; attempt < 36 && !terminal(current.status); attempt++) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  current = await getVideoTask({ model, taskId: manifest.task.taskId });
  manifest.last_status = current; writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}
const urls = current.generated || current.output_urls || [];
if (!terminal(current.status) || String(current.status).toUpperCase() !== 'COMPLETED' || !urls[0]) throw new Error(`Visual generation did not complete: ${current.status}`);
const response = await fetch(urls[0], { signal: AbortSignal.timeout(120000) });
if (!response.ok) throw new Error(`Generated video download failed: ${response.status}`);
const output = join(dir, 'visual-audition.mp4');
writeFileSync(output, Buffer.from(await response.arrayBuffer()));
manifest.output = 'visual-audition.mp4'; manifest.status = 'VISUAL_REVIEW_REQUIRED'; manifest.provider_result = current;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ output, manifest: manifestPath, status: manifest.status, publish: false }));
