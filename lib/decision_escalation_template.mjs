import { createHash } from 'node:crypto';

export const DECISION_ESCALATION_ID = 'decision-escalation-knee-001';
const referenceUrl = 'https://x.com/CEO_Vlad/status/2097816686665650462?s=20';

const guardrails = [
  'This is original cinematic 3D scenario animation, not a recreation of a named creator or third-party video.',
  'No symptom escalation, diagnosis, outcome promise, urgency tactic, price claim, hospital ranking, doctor credential, or patient data.',
  'MedYatra is depicted only as a facilitator that organises questions and logistics; qualified hospital teams make clinical decisions.',
  'Every presenter/narration scene requires a native-audio render or verified lip-sync from the same approved audio source. Never overlay detached TTS on a speaking character.',
];

const beats = [
  ['S01', 'hook', 'orientation', 'You find three hospitals for knee replacement abroad. Every page looks reassuring.', 'A cinematic original 3D overhead of three anonymous hospital cards floating above a calm travel map. Camera drops into the choice from the viewer’s point of view. No hospital names or logos.', 'low-angle push-in; 0–3s hook caption'],
  ['S02', 'escalation', 'inconsistent-records', 'But each conversation begins with a different question about records.', 'The three cards open into three differently shaped blank question cards. They drift out of alignment around a generic sealed records folder. No readable medical records.', 'tight close-up; visual uncertainty grows'],
  ['S03', 'escalation', 'not-comparable', 'Then estimates arrive with different inclusions. It is not a like-for-like decision yet.', 'Abstract paper tiles with empty line blocks slide across a 3D desk; comparison columns cannot line up. All text and numbers are deliberately illegible.', 'faster lateral cuts; no actual prices'],
  ['S04', 'escalation', 'coordination-pressure', 'Travel dates get closer while the open questions stay scattered.', 'A calm animated calendar, plane route and checkmark tokens orbit separately rather than connect. The environment becomes busier but never alarming.', 'wider orbit; tempo peaks without fear imagery'],
  ['S05', 'turn', 'comparison-brief', 'The turn is not choosing faster. It is asking the same questions in one comparison brief.', 'Movement pauses. The scattered tokens snap into one clean four-part checklist card: records, written inclusions, coordinator, follow-up questions. The editor supplies labels; do not ask the model to draw text.', 'longer, steadier hold; sound resolves'],
  ['S06', 'payoff', 'facilitator-boundary', 'Now you can see what needs confirmation by the hospital team, and what a facilitator can coordinate.', 'The checklist becomes a structured pathway: hospital-team questions on one side; travel and communication coordination on the other. No clinical decision is visualised.', 'calm wider frame; palette shifts from amber tension to teal clarity'],
  ['S07', 'close', 'save-cta', 'Start with the questions. Save the checklist. General education only, not medical advice.', 'Minimal original 3D end-card: a folded checklist rests beside a passport-like travel document and a teal route line. Brand-neutral/MedYatra-safe label added only in editor.', 'still end hold; readable disclosure'],
];

const scenePrompt = (visual) => `Original cinematic 3D short-form animation for a medical-travel facilitator. ${visual} Premium stylised realism, tactile materials, controlled depth of field, physically plausible camera motion, restrained dramatic lighting, clean shapes, vertical 9:16, no on-screen text. ${guardrails.slice(0, 3).join(' ')}`;

export function createDecisionEscalationTemplate({ treatment = 'knee replacement', brand = 'MedYatra' } = {}) {
  const scenes = beats.map(([id, phase, escalation, narration, visual, edit], index) => ({
    id, start: index * 7, end: (index + 1) * 7, duration: 7, phase, escalation, narration,
    caption_text: narration,
    visual_direction: visual,
    edit_direction: edit,
    generation_prompt: scenePrompt(visual),
    audio_requirement: 'native generated narration with the same scene visual, or approved lip-sync using the exact approved voice track',
    qa: ['Narration and caption source are identical', 'Escalation dimension is distinct from prior beat', 'No medical claim or fear tactic', 'No generated text relied on for meaning', 'No third-party brand/character/style replication'],
  }));
  const plan = {
    id: DECISION_ESCALATION_ID,
    title: `The comparison brief before a ${treatment} enquiry abroad`,
    brand, treatment,
    reference: { source: referenceUrl, observed_format: 'second-person escalating-scenario narrative; original execution required' },
    format: { seconds: 49, scenes: 7, canvas: '1080x1920', fps: 24, channels: ['TikTok', 'Instagram Reels', 'YouTube Shorts'] },
    pattern: {
      hook: 'Viewer enters a recognisable decision scenario in the first three seconds.',
      escalation: 'Four distinct, operational stakes: orientation → record inconsistency → non-comparable information → coordination pressure.',
      turn: 'A neutral comparison brief enters; it does not promise a clinical, financial, or treatment outcome.',
      payoff: 'Clarity on which questions belong with hospital teams versus a facilitator.',
      testing: 'Hold the body constant; test ten hook captions, then setting, then character palette. Review first-3-second hold and the turn at 28 seconds.',
    },
    visual_system: {
      medium: 'original cinematic 3D animation',
      palette: { tension: ['#243041', '#D39B58'], resolution: ['#102536', '#72D2C0'], type: '#FFF8ED' },
      captions: '56px Inter/Arial Black; cream fill, navy outline; max two lines; lower-middle safe area; highlight only “same questions” and “hospital team”.',
      audio: 'Steady, grounded second-person narrator; quiet pulse rises through S04, drops to warm resolve in S05. Native audio only.',
      cuts: '0.8–1.5s internal micro-cuts in S01–S04; 2–3s holds in S05–S07.',
    },
    guardrails, scenes, publish: false,
  };
  plan.fingerprint = createHash('sha256').update(JSON.stringify({ ...plan, fingerprint: undefined })).digest('hex');
  return plan;
}

export function validateDecisionEscalation(plan) {
  if (plan.format.seconds < 40 || plan.format.seconds > 60 || plan.scenes.length < 6 || plan.scenes.length > 8) throw new Error('Escalating short must be 40–60 seconds with 6–8 scenes.');
  if (plan.scenes.some((scene, index) => scene.start !== index * 7 || scene.end !== (index + 1) * 7)) throw new Error('Timeline must contain contiguous seven-second beats.');
  if (new Set(plan.scenes.map(scene => scene.escalation)).size !== plan.scenes.length) throw new Error('Each scene requires a distinct narrative function.');
  if (plan.scenes.some(scene => scene.narration !== scene.caption_text)) throw new Error('Captions must derive from the exact narration source.');
  if (plan.publish) throw new Error('Medical-travel creative stays human-gated.');
  return true;
}

const timestamp = (seconds) => `00:00:${String(seconds).padStart(2, '0')},000`;
export function escalationSrt(plan) {
  return plan.scenes.map((scene, index) => `${index + 1}\n${timestamp(scene.start)} --> ${timestamp(scene.end)}\n${scene.caption_text}`).join('\n\n');
}
