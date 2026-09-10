import test from 'node:test';
import assert from 'node:assert/strict';
import { createSongChecklistTemplate, songChecklistSrt, validateSongChecklist } from '../lib/song_checklist_template.mjs';

test('song checklist has a locked audio-first six-slice production plan', () => {
  const plan = createSongChecklistTemplate();
  assert.equal(validateSongChecklist(plan), true);
  assert.equal(plan.format.seconds, 42);
  assert.equal(plan.scenes.length, 6);
  assert.equal(plan.scenes.filter(scene => scene.kind === 'a-roll').length, 3);
  assert.ok(plan.scenes.every(scene => scene.lyric === scene.caption_text));
  assert.ok(plan.guardrails.some(rule => rule.includes('commercial-use rights')));
});

test('song caption workprint follows exact audio slice boundaries', () => {
  const plan = createSongChecklistTemplate();
  const srt = songChecklistSrt(plan);
  assert.match(srt, /00:00:00,000 --> 00:00:07,000/);
  assert.match(srt, /00:00:35,000 --> 00:00:42,000/);
});
