import test from 'node:test';
import assert from 'node:assert/strict';
import { createDecisionEscalationTemplate, escalationSrt, validateDecisionEscalation } from '../lib/decision_escalation_template.mjs';

test('decision-escalation format stays within the short-form format and safety guardrails', () => {
  const plan = createDecisionEscalationTemplate();
  assert.equal(validateDecisionEscalation(plan), true);
  assert.equal(plan.format.seconds, 49);
  assert.equal(plan.scenes.length, 7);
  assert.equal(plan.scenes.at(-1).end, 49);
  assert.ok(plan.guardrails.some(rule => rule.includes('not a recreation')));
  assert.ok(plan.scenes.every(scene => scene.narration === scene.caption_text));
  assert.equal(plan.publish, false);
});

test('decision escalation captions exactly cover every source narration beat', () => {
  const plan = createDecisionEscalationTemplate();
  const srt = escalationSrt(plan);
  assert.match(srt, /00:00:00,000 --> 00:00:07,000/);
  assert.match(srt, /00:00:42,000 --> 00:00:49,000/);
  for (const scene of plan.scenes) assert.ok(srt.includes(scene.narration));
});
