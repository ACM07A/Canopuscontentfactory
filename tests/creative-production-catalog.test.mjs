import test from 'node:test';
import assert from 'node:assert/strict';
import { createCreativeProductionRun, supportedCreativeTemplateIds } from '../lib/creative_production_catalog.mjs';

test('creative production runs carry the full scene plan and release gates', () => {
  assert.deepEqual(supportedCreativeTemplateIds(), ['yapper-vsl-educator', 'decision-escalation', 'song-checklist']);
  for (const id of supportedCreativeTemplateIds()) {
    const run = createCreativeProductionRun(id);
    assert.ok(run.duration_seconds >= 40 && run.duration_seconds <= 60);
    assert.ok(run.scene_count >= 6);
    assert.equal(run.plan.publish, false);
    assert.ok(run.final_release_gates.includes('caption transcript QA'));
    assert.ok(run.plan.scenes.every(scene => (scene.narration || scene.lyric) === scene.caption_text));
  }
});

test('creative production catalog refuses an unknown format', () => {
  assert.throws(() => createCreativeProductionRun('unknown-format'), /Unsupported production template/);
});
