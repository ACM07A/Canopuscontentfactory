import { createHash } from 'node:crypto';

export const fingerprint = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const dimensions = ['framing', 'lighting', 'palette', 'typography', 'captions', 'performance', 'editing', 'sound', 'visual_hook', 'narrative', 'cta'];
export function validateTemplate(t, duration = Infinity) {
  if (!t || !t.name || !Array.isArray(t.scenes) || !t.scenes.length) throw new Error('Template needs name and scenes');
  for (const key of dimensions) if (typeof t.style?.[key] !== 'string' || !t.style[key].trim()) throw new Error(`Missing style.${key}`);
  let end = 0;
  for (const s of t.scenes) {
    if (!Number.isFinite(s.start) || !Number.isFinite(s.end) || s.start < end || s.end <= s.start || s.end > duration + .1) throw new Error('Invalid scene timeline');
    for (const key of ['role', 'visual', 'speech', 'evidence', 'production_method']) if (typeof s[key] !== 'string' || !s[key].trim()) throw new Error(`Missing scene ${key}`);
    if (!['observed', 'inferred', 'unknown'].includes(s.confidence)) throw new Error('Scene confidence required');
    end = s.end;
  }
  return t;
}
function substitute(text, values) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] === undefined ? match : String(values[key]));
}
export function expandTemplate(template, matrix) {
  validateTemplate(template);
  if (!Array.isArray(matrix) || matrix.length !== 50) throw new Error('Supply exactly 50 variant records');
  const ids = new Set();
  return matrix.map((v, i) => {
    for (const key of ['niche', 'geography', 'language', 'angle', 'audience']) if (!v[key]) throw new Error(`Variant ${i + 1} missing ${key}`);
    const signature = fingerprint(v);
    if (ids.has(signature)) throw new Error('Duplicate variant');
    ids.add(signature);
    const scenes = template.scenes.map((s, n) => {
      const speech = substitute(s.speech, v), visual = substitute(s.visual, v);
      return { id: `scene-${n + 1}`, start: s.start, end: s.end, role: s.role, speech, caption_text: speech, visual,
        generation_prompt: `${visual}\nExact dialogue: ${speech}\nPerformance: ${template.style.performance}\nFraming: ${template.style.framing}\nLighting: ${template.style.lighting}`,
        production_method: s.production_method, audio_contract: 'Use native dialogue or animate against the final approved audio; never overlay unrelated speech.',
        caption_timing: 'Align to the actual generated speech; template times are planning estimates.', evidence: s.evidence };
    });
    const blockers = ['editorial review', 'localization review', 'asset rights review', 'render and audio/visual QA'];
    if (JSON.stringify(scenes).match(/\{\{\w+\}\}/)) blockers.push('unresolved template variables');
    return { id: `variant-${String(i + 1).padStart(3, '0')}`, ...v, template_hash: fingerprint(template), style: template.style,
      scenes, render_style: template.render_style || {}, production_recipe: template.production_recipe || [], invariants: template.invariants || [],
      content_hash: fingerprint({ scenes, style: template.style, render_style:template.render_style||{}, variant: v }), status: 'DRAFT_PRODUCTION_PLAN', publish: false, blockers,
      experiments: { primary: 'Compare opening retention and completion with the account baseline', secondary: 'Saves, shares and qualified enquiries', claim: 'No performance guarantee' } };
  });
}
