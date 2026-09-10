import { createYapperVslKneeStoryboard, validateYapperStoryboard } from './yapper_vsl_storyboard.mjs';
import { createDecisionEscalationTemplate, validateDecisionEscalation } from './decision_escalation_template.mjs';
import { createSongChecklistTemplate, validateSongChecklist } from './song_checklist_template.mjs';

const builders = {
  'yapper-vsl-educator': {
    build: () => createYapperVslKneeStoryboard(),
    validate: validateYapperStoryboard,
    execution: 'scene-by-scene native-audio talking-head and B-roll render',
  },
  'decision-escalation': {
    build: () => createDecisionEscalationTemplate(),
    validate: validateDecisionEscalation,
    execution: 'scene-by-scene original 3D scenario animation with native narration',
  },
  'song-checklist': {
    build: () => createSongChecklistTemplate(),
    validate: validateSongChecklist,
    execution: 'rights-cleared master audio, exact audio slices, then A-roll lip-sync and beat-matched B-roll',
  },
};

export function supportedCreativeTemplateIds() { return Object.keys(builders); }

export function createCreativeProductionRun(templateId, overrides = {}) {
  const selected = builders[templateId];
  if (!selected) throw new Error(`Unsupported production template '${templateId}'.`);
  const plan = selected.build(overrides);
  selected.validate(plan);
  return {
    version: 1,
    selected_template: templateId,
    execution: selected.execution,
    duration_seconds: plan.format?.duration_seconds || plan.format?.seconds || null,
    scene_count: plan.scenes.length,
    canvas: plan.format?.canvas || '1080x1920',
    audio_policy: plan.audio_master ? 'MASTER_AUDIO_REQUIRED' : 'NATIVE_AUDIO_PER_PRESENTER_SCENE_REQUIRED',
    caption_policy: 'Captions must be regenerated from the final approved audio word timings.',
    final_release_gates: ['native audio / lip-sync QA', 'caption transcript QA', 'medical-travel safety review', 'named human reviewer', 'platform / rights approval'],
    plan,
  };
}
