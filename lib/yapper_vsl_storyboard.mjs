import { createHash } from 'node:crypto';

export const YAPPER_VSL_KNEE_ID = 'yapper-vsl-knee-explainer-001';

const presenterPrompt = 'Use the supplied fictional facilitator educator identity exactly: adult South Asian/Indian man, early 40s, salt-and-pepper short hair, trimmed beard, charcoal overshirt over a plain navy crew-neck shirt. Warm modern home office, direct eye-line, natural daylight plus warm practical lamp, waist-up 9:16 creator footage. He is not a clinician: no white coat, badge, stethoscope, hospital logo, or credential claim.';
const negative = 'plastic skin, frozen face, teleprompter stare, lip movement without matching audio, robotic gestures, face morphing, text, watermark, logo, hospital branding, white coat, stethoscope, badge, extra fingers, distorted hands, diagnosis, surgery footage, patient data';

const rawScenes = [
  ['S01', 'presenter', 'Pattern-break hook', 'Thinking about knee replacement abroad? Start with three questions, not a package.', 'Lean in on “three questions”; one restrained open-palm gesture.', 'AUDIO_DRIVEN_PRESENTER'],
  ['S02', 'presenter', 'Question one', 'First: what records does the hospital team need before reviewing your case?', 'Direct eye contact; count “first” on one hand.', 'AUDIO_DRIVEN_PRESENTER'],
  ['S03', 'broll', 'Records cutaway', 'The treating hospital can tell you the exact records it needs for review.', 'Overhead desk shot of a blank, unbranded checklist, a closed folder and a generic scan icon; no names, files, or medical images.', 'SILENT_CUTAWAY'],
  ['S04', 'presenter', 'Question two', 'Second: what does the written estimate include, and what is excluded?', 'Small pause after “Second”; gesture to a simple floating two-column graphic added in edit.', 'AUDIO_DRIVEN_PRESENTER'],
  ['S05', 'broll', 'Estimate cutaway', 'Ask for the assumptions behind it, then get those answers in writing.', 'Close-up of an unbranded estimate sheet with abstract line items; all numbers and text deliberately illegible.', 'SILENT_CUTAWAY'],
  ['S06', 'presenter', 'Question three', 'Third: how will communication work after you return home?', 'Calm, plain-English question; lean forward slightly.', 'AUDIO_DRIVEN_PRESENTER'],
  ['S07', 'broll', 'Coordination cutaway', 'Know who coordinates travel logistics, and how questions reach the treating team.', 'Phone calendar, travel folder, and route-map style desk detail. No patient names, messages, or hospital marks.', 'SILENT_CUTAWAY'],
  ['S08', 'presenter', 'Scope boundary', 'Keep travel arrangements separate from clinical decisions, which stay with qualified hospital teams.', 'Slow nod on “hospital teams”; no claim of clinical authority.', 'AUDIO_DRIVEN_PRESENTER'],
  ['S09', 'broll', 'Checklist payoff', 'A clear checklist makes unknowns visible before anyone decides anything.', 'Hands ticking three blank checkbox lines on an unbranded card. Natural desk shadows, no legible health content.', 'SILENT_CUTAWAY'],
  ['S10', 'presenter', 'Facilitator role', 'Canopus Care can help organise questions, records, and verified information.', 'Warm, helpful close; keep it conversational, not salesy.', 'AUDIO_DRIVEN_PRESENTER'],
  ['S11', 'presenter', 'Save CTA', 'Save this for your first enquiry, and verify every detail with the hospital team.', 'Point subtly toward the lower screen where the editor adds the save icon.', 'AUDIO_DRIVEN_PRESENTER'],
  ['S12', 'slate', 'Disclosure', 'General education only. Canopus Care is a facilitator, not a medical provider.', 'Clean end card using brand-neutral dark navy, cream and muted teal. No performance promise or hard sell.', 'EDITED_SLATE'],
];

function secondsToSrt(seconds) {
  const millis = Math.round(seconds * 1000);
  const h = String(Math.floor(millis / 3600000)).padStart(2, '0');
  const m = String(Math.floor((millis % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((millis % 60000) / 1000)).padStart(2, '0');
  const ms = String(millis % 1000).padStart(3, '0');
  return `${h}:${m}:${s},${ms}`;
}

export function createYapperVslKneeStoryboard() {
  const scenes = rawScenes.map(([id, type, role, narration, visual, productionMethod], index) => {
    const start = index * 5;
    const end = start + 5;
    const isPresenter = type === 'presenter';
    const generationPrompt = isPresenter
      ? `${presenterPrompt} One five-second continuous scene. ${visual} Native dialogue must be generated from this exact spoken line, with exact mouth timing: “${narration}”. No burned-in text.`
      : type === 'broll'
        ? `Vertical 9:16 premium natural creator B-roll, five seconds. ${visual} Gentle handheld micro-motion. No people speaking, no burned-in text, no logo, no watermark.`
        : 'Vertical 9:16 graphic end card, five seconds. Dark navy background, cream typography, muted-teal accent line, ample safe margins. The editor adds the exact disclosure as readable text. No medical logo, outcome claim, or QR code.';
    return {
      id, start, end, duration: 5, type, role, narration,
      caption_text: narration,
      caption_layout: id === 'S12' ? 'centre disclosure card' : 'two lines maximum, lower-middle, inside 1080x1920 safe area',
      visual_direction: visual,
      production_method: productionMethod,
      generation_prompt: generationPrompt,
      negative_prompt: negative,
      asset_status: 'UNGENERATED',
      qa: isPresenter
        ? ['Native audio and lip motion generated together', 'Transcript matches narration exactly', 'No clinician identity or credential signal', 'Natural hand and face motion']
        : ['No identifying/patient data', 'No fabricated price or clinical claim', 'No logo or watermark', 'Caption copy matches narration exactly'],
    };
  });
  const plan = {
    id: YAPPER_VSL_KNEE_ID,
    title: 'Three questions before a knee-replacement enquiry abroad',
    format: { canvas: '1080x1920', aspect_ratio: '9:16', duration_seconds: 60, fps: 24, distribution: ['Instagram Reels', 'TikTok', 'YouTube Shorts'] },
    source_style: 'Yapper / VSL-style short informed by publicly described AI-UGC benchmark category; not a pixel-level clone of any third-party video.',
    narrator: { identity: 'fictional facilitator educator', reference_asset: 'presenter-reference.png', prohibited: ['doctor title', 'white coat', 'credentials', 'hospital affiliation'] },
    edit_system: {
      hook_window_seconds: 2.0,
      cutaway_ratio_target: '4 of 12 scenes (33%)',
      subtitle: { font: 'Arial or Inter Black', size_px: 56, color: '#FFF8ED', outline: '#102536', outline_px: 5, highlight: '#72D2C0', position: 'lower-middle with 220px bottom safe margin', max_lines: 2, animation: 'word-by-word pop only on hook and question numbers' },
      grade: 'warm natural skin, soft contrast, restrained grain; avoid glossy stock or overly clinical blue',
      music: 'optional licensed, low-key pulse at -25 LUFS below speech; omit if rights are unresolved',
    },
    approval_gates: {
      audio: 'BLOCKED until a native-audio, lip-synchronised model is explicitly allowlisted and its cost policy is confirmed',
      clinical: 'Human medical/compliance review required before publishing',
      publishing: 'Human approval required; this plan never publishes',
    },
    scenes,
    publish: false,
  };
  plan.fingerprint = createHash('sha256').update(JSON.stringify({ ...plan, fingerprint: undefined })).digest('hex');
  return plan;
}

export function validateYapperStoryboard(plan) {
  if (plan.format.duration_seconds !== 60 || plan.scenes.length !== 12) throw new Error('Expected a 12-scene, 60-second plan.');
  if (plan.scenes.some((scene, index) => scene.start !== index * 5 || scene.end !== (index + 1) * 5)) throw new Error('Scenes must be contiguous five-second beats.');
  if (plan.scenes.filter(scene => scene.type === 'broll').length !== 4) throw new Error('Plan requires four b-roll cutaways.');
  if (plan.scenes.some(scene => scene.narration !== scene.caption_text)) throw new Error('Subtitle source must exactly match narration source.');
  if (plan.publish) throw new Error('This production plan must remain human-gated.');
  return true;
}

export function storyboardSrt(plan) {
  return plan.scenes.map((scene, index) => `${index + 1}\n${secondsToSrt(scene.start)} --> ${secondsToSrt(scene.end)}\n${scene.caption_text}`).join('\n\n');
}

export function storyboardMarkdown(plan) {
  return `# ${plan.title}\n\n**Format:** ${plan.format.duration_seconds}s · ${plan.format.canvas} · ${plan.format.fps} fps · ${plan.format.distribution.join(' / ')}\n\n**Narrator:** ${plan.narrator.identity}; not a doctor or clinician.\n\n**Release gate:** ${plan.approval_gates.audio}\n\n## Narrative\n\n${plan.scenes.map(scene => `- **${String(scene.start).padStart(2, '0')}–${String(scene.end).padStart(2, '0')} · ${scene.role}:** ${scene.narration}`).join('\n')}\n\n## Required review\n\n- Render presenter scenes only with native, generated-together speech and lip motion. Do not overlay TTS on a silent face.\n- Regenerate captions from the approved final audio word timings; the included SRT is a timing workprint.\n- Use only licensed or generated cutaways. Never put patient records, identities, specific prices, outcomes, or unsourced clinical claims on screen.\n- Human clinical/compliance and brand review are required before publishing.\n`;
}
