import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { hybridState, queueHybridJob } from '../data-core/hybrid_factory.mjs';

test('hybrid production job stores a locked scene and audio production run before approval', () => {
  const db = new DatabaseSync(':memory:');
  const queued = queueHybridJob(db, {
    template_id: 'song-checklist', use_case: 'knee replacement enquiry abroad', channel: 'instagram',
    brief: 'Families comparing options from Oman need an original checklist-led organic short. No patient data.',
  });
  assert.equal(queued.ok, true);
  assert.equal(queued.status, 'WAITING_FOR_APPROVAL');
  assert.equal(queued.production.duration_seconds, 42);
  assert.equal(queued.production.scene_count, 6);
  assert.equal(queued.production.audio_policy, 'MASTER_AUDIO_REQUIRED');
  const state = hybridState(db);
  assert.equal(state.jobs.length, 1);
  assert.equal(state.jobs[0].status, 'WAITING_FOR_APPROVAL');
  assert.equal(state.jobs[0].scene_count, 6);
  db.close();
});

test('hybrid production job refuses missing briefs and unsupported formats', () => {
  const db = new DatabaseSync(':memory:');
  assert.equal(queueHybridJob(db, { template_id: 'song-checklist' }).error.code, 'BRIEF_REQUIRED');
  assert.equal(queueHybridJob(db, { template_id: 'doctor-explainer', brief: 'test' }).error.code, 'UNSUPPORTED_TEMPLATE');
  db.close();
});
