// Benchmark-plan assembly. Never substitutes narration for a speaking face's audio.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fingerprint } from './video_benchmark.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const save = (p, x) => writeFileSync(p, JSON.stringify(x, null, 2));
const run = (bin, args, cwd) => execFileSync(bin, args, {cwd, windowsHide:true, encoding:'utf8', timeout:600000, maxBuffer:8*1024*1024});
const tokens = text => String(text).normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
export function wordErrorRate(expected, actual) {
  const a=tokens(expected), b=tokens(actual);
  let row=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++) { const next=[i]; for(let j=1;j<=b.length;j++) next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1)); row=next; }
  return row[b.length]/Math.max(a.length,1);
}
export function validateAssets(plan, assets) {
  if(!plan.scenes?.length || /\{\{\w+\}\}/.test(JSON.stringify(plan.scenes))) throw new Error('Resolved scene plan required');
  if(assets.plan_hash !== fingerprint(plan)) throw new Error('Asset manifest is stale or belongs to another plan');
  if(assets.scenes?.length !== plan.scenes.length) throw new Error('Every planned scene needs an asset');
  for(let i=0;i<plan.scenes.length;i++) {
    const a=assets.scenes[i], s=plan.scenes[i];
    if(a.id!==s.id || a.speech!==s.speech) throw new Error('Asset scene/dialogue mismatch');
    if(!['native-dialogue','audio-driven','broll'].includes(a.mode)) throw new Error('Unknown audio mode');
    if(a.mode!=='broll' && a.audio) throw new Error('Speaking faces must contain their own synchronized audio; external overlay forbidden');
    if(!a.video) throw new Error('Scene video required');
  }
}
const stamp = value => { const n=Math.round(value*1000); return `${String(Math.floor(n/3600000)).padStart(2,'0')}:${String(Math.floor(n/60000)%60).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')},${String(n%1000).padStart(3,'0')}`; };
export function captionCues(words, offset=0) {
  const cues=[]; let group=[], previousEnd=0;
  for(const w of words) {
    if(!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.end<=w.start||w.start<previousEnd) throw new Error('Invalid word timing');
    previousEnd=w.end;
    if(group.length && (group.length>=5 || w.end-group[0].start>2.5 || w.start-group.at(-1).end>.4)) { cues.push(group); group=[]; }
    group.push(w);
  }
  if(group.length)cues.push(group);
  return cues.map(g=>({start:g[0].start+offset,end:g.at(-1).end+offset,text:g.map(w=>w.word).join(' ').replace(/[<>\r\n]/g,'')}));
}
export function captionAss(cues, style={}) {
  const font=/^[\w -]{1,60}$/.test(style.font_name||'') ? style.font_name : 'Arial';
  const size=Math.max(30,Math.min(90,Number(style.font_size)||56));
  const margin=Math.max(120,Math.min(600,Number(style.margin_v)||220));
  const color=/^[0-9a-f]{6}$/i.test(style.color||'') ? style.color : 'FFFFFF';
  const assColor=`&H00${color.slice(4,6)}${color.slice(2,4)}${color.slice(0,2)}`;
  const time=s=>stamp(s).replace(',','.').slice(0,-1);
  const clean=s=>String(s).replaceAll('\\','\\\\').replaceAll('{','').replaceAll('}','').replace(/[\r\n]/g,' ');
  return `[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\nWrapStyle: 0\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Caption,${font},${size},${assColor},${assColor},&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,1,2,80,80,${margin},1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${cues.map(c=>`Dialogue: 0,${time(c.start)},${time(c.end)},Caption,,0,0,0,,${clean(c.text)}`).join('\n')}\n`;
}
export function createAssetManifest(plan) {
  return {plan_hash:fingerprint(plan), publish:false, scenes:plan.scenes.map(s=>({id:s.id,speech:s.speech,
    mode:'native-dialogue', video:null, generation_prompt:s.generation_prompt,
    note:'Set video to a local native-audio or audio-driven clip. For licensed cutaway footage choose broll and supply final audio if needed.'}))};
}
export async function renderBenchmark(planPath, assetPath, outputDir) {
  const plan=read(planPath), assets=read(assetPath); validateAssets(plan,assets);
  const dir=resolve(outputDir);
  if(existsSync(dir)) throw new Error('Render output exists; select a new directory to preserve review evidence');
  mkdirSync(dir,{recursive:true});
  const qa={plan_hash:fingerprint(plan),publish:false,status:'ANALYZING',scenes:[],
    remaining_reviews:['mouth synchronization (not measured by ASR)','visual quality and identity','asset rights','medical/editorial approval','localization']};
  save(join(dir,'render-qa.json'),qa);
  const cues=[]; let offset=0;
  try {
    for(let i=0;i<assets.scenes.length;i++) {
      const a=assets.scenes[i], s=plan.scenes[i];
      const video=resolve(dirname(assetPath),a.video);
      const meta=JSON.parse(run('ffprobe',['-v','error','-show_format','-show_streams','-of','json',video]));
      const length=Number(meta.streams.find(x=>x.codec_type==='video')?.duration || meta.format.duration);
      if(!meta.streams.some(x=>x.codec_type==='video') || !Number.isFinite(length)||length<=0) throw new Error('Invalid video asset');
      const external=a.mode==='broll' && a.audio ? resolve(dirname(assetPath),a.audio) : null;
      if(!external && !meta.streams.some(x=>x.codec_type==='audio')) throw new Error(`${a.id}: clip has no audio; silent speaking footage is blocked`);
      const audioPath=join(dir,`audio-${i}.wav`), analysisPath=join(dir,`audio-${i}.json`);
      run('ffmpeg',['-v','error','-y','-i',external||video,'-vn','-ac','1','-ar','16000',audioPath]);
      run(process.env.BENCHMARK_PYTHON||'python',[join(ROOT,'scripts/benchmark-local.py'),'audio',audioPath,'--output',analysisPath]);
      const audio=read(analysisPath), audioHash=fingerprint(readFileSync(audioPath).toString('base64'));
      let captionWords=audio.words, recognized=audio.text, correction=null;
      if(a.transcript_review) {
        correction=read(resolve(dirname(assetPath),a.transcript_review));
        if(correction.audio_hash!==audioHash || correction.plan_hash!==fingerprint(plan) || !correction.reviewer?.name || !correction.reviewer?.role || !Number.isFinite(Date.parse(correction.reviewed_at)) || !Array.isArray(correction.words)) throw new Error('Transcript review missing identity/date or stale fingerprints');
        captionWords=correction.words; recognized=captionWords.map(w=>w.word).join(' ');
        captionCues(captionWords); // Reject overlapping or malformed approved timestamps too.
      }
      const wer=wordErrorRate(s.speech,recognized);
      const record={id:s.id,expected:s.speech,recognized:audio.text,word_error_rate:wer,caption_review_required:wer>0||audio.words.some(w=>w.probability<.8),video_seconds:length,audio_seconds:audio.duration,
        source_hash:fingerprint(readFileSync(video).toString('base64')),audio_hash:audioHash,transcript_review:correction?.reviewer||null,lip_sync:'NOT_MEASURED',mode:a.mode};
      qa.scenes.push(record); save(join(dir,'render-qa.json'),qa);
      if(wer>0 || !captionWords.length) throw new Error(`${a.id}: dialogue mismatch (${Math.round(wer*100)}% word error); review ASR and clip before rendering`);
      if(external && audio.duration>length+.1) throw new Error(`${a.id}: cutaway too short for final audio; supply longer footage`);
      if(captionWords.at(-1).end>length+.1) throw new Error(`${a.id}: speech extends past the picture`);
      cues.push(...captionCues(captionWords,offset));
      const args=['-v','error','-y','-i',video];
      if(external) args.push('-i',external);
      args.push('-map','0:v:0','-map',external?'1:a:0':'0:a:0','-vf','scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30',
        '-af',`apad,atrim=duration=${length}`,'-t',String(length),'-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-ar','48000','-ac','2',join(dir,`clip-${i}.mp4`));
      run('ffmpeg',args); offset+=length;
    }
    writeFileSync(join(dir,'captions.srt'),cues.map((c,i)=>`${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}`).join('\n\n'));
    writeFileSync(join(dir,'captions.ass'),captionAss(cues,plan.render_style));
    writeFileSync(join(dir,'concat.txt'),assets.scenes.map((_,i)=>`file 'clip-${i}.mp4'`).join('\n'));
    run('ffmpeg',['-v','error','-y','-f','concat','-safe','1','-i','concat.txt','-vf','ass=captions.ass','-c:v','libx264','-preset','fast','-crf','18','-c:a','aac','-movflags','+faststart','final-review.mp4'],dir);
    const finalMeta=JSON.parse(run('ffprobe',['-v','error','-show_format','-show_streams','-of','json',join(dir,'final-review.mp4')]));
    qa.status='RENDERED_REVIEW_REQUIRED'; qa.duration=Number(finalMeta.format.duration); qa.final='final-review.mp4';
    if(Math.abs(qa.duration-offset)>.25) throw new Error('Final duration mismatch');
    save(join(dir,'render-qa.json'),qa); save(join(dir,'plan.json'),plan);
    const escaped=JSON.stringify(qa,null,2).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    writeFileSync(join(dir,'review.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Benchmark render review</title><style>body{max-width:1000px;margin:32px auto;padding:16px;background:#111827;color:white;font:16px system-ui}video{max-height:75vh;max-width:100%}pre{white-space:pre-wrap}a{color:#93c5fd}</style><h1>Rendered · review required</h1><p>Not published. Automated transcription does not prove mouth synchronization or clinical accuracy.</p><video controls src="final-review.mp4"></video><p><a href="captions.srt">Captions</a> · <a href="render-qa.json">QA evidence</a></p><pre>${escaped}</pre>`);
    return {dir,...qa};
  } catch(error) { qa.status='BLOCKED';qa.error=error.message;save(join(dir,'render-qa.json'),qa);throw error; }
}
