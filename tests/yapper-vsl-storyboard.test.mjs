import test from 'node:test';
import assert from 'node:assert/strict';
import { createYapperVslKneeStoryboard, storyboardSrt, validateYapperStoryboard } from '../lib/yapper_vsl_storyboard.mjs';

test('yapper VSL production board is a contiguous 60-second audio-safe plan', () => {
  const plan = createYapperVslKneeStoryboard();
  assert.equal(validateYapperStoryboard(plan), true);
  assert.equal(plan.scenes.length, 12);
  assert.equal(plan.scenes.at(-1).end, 60);
  assert.equal(plan.scenes.filter(scene => scene.type === 'broll').length, 4);
  assert.ok(plan.scenes.filter(scene => scene.type === 'presenter').every(scene => scene.production_method === 'AUDIO_DRIVEN_PRESENTER'));
  assert.ok(plan.scenes.every(scene => scene.caption_text === scene.narration));
  assert.equal(plan.publish, false);
});

test('caption workprint covers every scene using the single narration source', () => {
  const plan = createYapperVslKneeStoryboard();
  const srt = storyboardSrt(plan);
  assert.match(srt, /00:00:00,000 --> 00:00:05,000/);
  assert.match(srt, /00:00:55,000 --> 00:01:00,000/);
  for (const scene of plan.scenes) assert.ok(srt.includes(scene.narration));
});
