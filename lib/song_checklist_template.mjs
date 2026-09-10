import { createHash } from 'node:crypto';

export const SONG_CHECKLIST_ID = 'song-checklist-knee-001';
const referenceUrl = 'https://x.com/qwertyu_alex/status/2097722700634456171?s=20';

const slices = [
  ['S01', 'a-roll', 'hook', 'Before you book, pause and write this down.', 'A fictional facilitator educator in a warm, graphic 3D travel-planning room looks into camera and sings/speaks the hook naturally. No doctor coat, badge, hospital mark, or procedure imagery.', 'sync-vocal'],
  ['S02', 'b-roll', 'records', 'Records first: ask the hospital team what it needs to review.', 'Rhythmic original 3D cutaway: an anonymous sealed folder unfolds into three clean blank request cards. No patient documents, legible data, or clinical imagery.', 'instrumental-or-off-camera-vocal'],
  ['S03', 'b-roll', 'written-brief', 'Then ask what the written estimate includes and leaves out.', 'Beat-matched 3D paper tiles slide into two aligned neutral columns. The editor adds the caption; generated visuals contain no legible prices or text.', 'instrumental-or-off-camera-vocal'],
  ['S04', 'a-roll', 'coordination', 'Name the coordinator. Know where each question goes.', 'Return to the same fictional facilitator educator. Subtle rhythmic hand gesture; animated route tokens pass behind them without a real hospital or person name.', 'sync-vocal'],
  ['S05', 'b-roll', 'turn', 'Same questions, one brief. Then you can compare.', 'Music opens up. The scattered folder, paper and route icons settle into one calm four-part comparison board. No answer or treatment outcome is shown.', 'instrumental-or-off-camera-vocal'],
  ['S06', 'a-roll', 'cta', 'Save this checklist. Hospital teams decide clinical care.', 'Facilitator educator holds a small blank checklist card toward camera. End on a crisp disclosure card added in edit: “General education only · MedYatra is a facilitator.”', 'sync-vocal'],
];

const guardrails = [
  'Create an original melody, rhythm, vocal and art direction. Do not imitate, sample, interpolate, or reference a named artist, song, creator, or the linked example’s audio/video.',
  'Use only music/vocal audio with documented commercial-use rights. Retain licence, prompt, generation ID, audio fingerprint and project owner in the production ledger.',
  'This format is organic-draft only until paid-health-ad policy review. No outcomes, price claims, clinical advice, fear hooks, patient imagery, hospital rankings or unconsented data.',
  'Audio is the source of truth. Every A-roll scene must be generated with, or lip-synced against, its exact approved 7-second audio slice. Never pad, loop, or overlay unmatched speech.',
];

export function createSongChecklistTemplate({ brand = 'MedYatra', topic = 'knee-treatment travel enquiry' } = {}) {
  const scenes = slices.map(([id, kind, role, lyric, visual, audioRole], index) => ({
    id, start: index * 7, end: (index + 1) * 7, duration: 7, kind, role, lyric,
    caption_text: lyric,
    visual_direction: visual,
    audio_role: audioRole,
    audio_slice: `audio/${id.toLowerCase()}.wav`,
    visual_prompt: `Original warm cinematic 3D social short, vertical 9:16, seven seconds. ${visual} Premium tactile textures, clear silhouettes, intentional beat-synchronised cuts, no text, no watermark. ${guardrails[0]} ${guardrails[2]}`,
    qa: ['Lyric equals caption text', 'Exact audio-slice fingerprint assigned', 'No detached voice overlay', 'No text generated into frame', 'No clinical or commercial claim'],
  }));
  const plan = {
    id: SONG_CHECKLIST_ID,
    title: `The ${topic} question-list song short`, brand, topic,
    reference: { source: referenceUrl, observed_workflow: 'audio-first song ad with 5–7 second A-roll/B-roll slices; original production only' },
    format: { seconds: 42, scenes: 6, slice_seconds: 7, canvas: '1080x1920', fps: 24, channel: 'organic social only pending policy review' },
    audio_master: {
      brief: 'Original 94 BPM, warm percussive pop/indie mnemonic, confident but calm, natural adult English vocal, no celebrity or artist imitation. The vocal should be intelligible first and musical second.',
      structure: '2-bar intro/hook · four 7-second lyric slices · 2-bar resolved CTA',
      production_order: ['Generate and rights-check one master audio file', 'Lock transcript and word timing', 'Cut exact 7-second WAV slices', 'Generate A-roll with its corresponding slice as lip-sync source', 'Generate B-roll to the same beat grid', 'Assemble without time-stretching vocal audio', 'Create captions from final audio alignment', 'Human compliance + brand approval'],
      required_ledger: ['licence', 'audio fingerprint', 'master generation ID', 'voice/source declaration', 'approved transcript', 'word timings'],
    },
    visual_system: {
      ratio: '3 A-roll / 3 B-roll',
      a_roll: 'same fictional facilitator educator, warm 3D world, direct-camera only on hook/coordination/CTA',
      b_roll: 'abstract checklists, sealed folder, paper tiles, travel/communication tokens; no patient or hospital identification',
      captions: '56px Inter Black, cream with navy outline, word pop on the downbeat, lower-middle safe zone, two lines max.',
      cuts: 'Cut on music-bar boundaries; reserve the 28–35s turn for a longer visual hold.',
    },
    testing: {
      safe_variables: ['hook lyric/caption', 'palette', 'A-roll setting', 'instrumental intensity'],
      fixed_for_first_test: ['approved medical-travel guardrails', 'master beat grid', 'CTA disclosure', 'same decision-checklist body'],
      success_signals: ['first-3-second hold', 'completed-view rate', 'saves/shares', 'caption readability'],
    },
    guardrails, scenes, publish: false,
  };
  plan.fingerprint = createHash('sha256').update(JSON.stringify({ ...plan, fingerprint: undefined })).digest('hex');
  return plan;
}

export function validateSongChecklist(plan) {
  if (plan.format.seconds !== 42 || plan.scenes.length !== 6) throw new Error('Song checklist requires six seven-second scenes.');
  if (plan.scenes.some((scene, index) => scene.start !== index * 7 || scene.end !== (index + 1) * 7)) throw new Error('Audio slices must occupy contiguous seven-second beats.');
  if (plan.scenes.some(scene => scene.lyric !== scene.caption_text)) throw new Error('Caption text must use the lyric source exactly.');
  if (plan.scenes.filter(scene => scene.kind === 'a-roll').some(scene => scene.audio_role !== 'sync-vocal')) throw new Error('A-roll must use an exact lip-sync audio slice.');
  if (plan.publish) throw new Error('Song creative must stay human-gated.');
  return true;
}

const stamp = (second) => `00:00:${String(second).padStart(2, '0')},000`;
export function songChecklistSrt(plan) { return plan.scenes.map((scene, index) => `${index + 1}\n${stamp(scene.start)} --> ${stamp(scene.end)}\n${scene.caption_text}`).join('\n\n'); }
