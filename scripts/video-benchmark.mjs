// Local process subagent: evidence extraction -> local vision analysis -> 50 production plans.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { fingerprint, validateTemplate, expandTemplate } from '../lib/video_benchmark.mjs';
import { createAssetManifest, renderBenchmark } from '../lib/benchmark_render.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [command, input, ...rest] = process.argv.slice(2);
const flag = name => { const i = rest.indexOf(name); return i < 0 ? undefined : rest[i + 1]; };
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const save = (p, data) => writeFileSync(p, JSON.stringify(data, null, 2));
const run = (bin, args) => execFileSync(bin, args, { encoding: 'utf8', timeout: 600000, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
const esc = x => String(x).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function report(dir) {
  const e = json(join(dir, 'evidence.json'));
  const template = existsSync(join(dir, 'template.json')) ? json(join(dir, 'template.json')) : null;
  const variants = existsSync(join(dir, 'variants.json')) ? json(join(dir, 'variants.json')) : [];
  const variantSection = variants.length
    ? `<a href="variants.json">Download manifest</a>${variants.map(v => `<details><summary>${esc(v.id)} · ${esc(v.niche)} · ${esc(v.geography)} · ${esc(v.angle)}</summary><pre>${esc(JSON.stringify(v, null, 2))}</pre></details>`).join('')}`
    : `<p>No variant plans yet. ${e.status === 'NEEDS_LOCAL_MEDIA' ? 'This X URL did not expose playable media. A local reference copy is required for analysis only: it is never reused in the finished video. After analysis, the system produces independent Freepik generation prompts, scene plans, captions and QA checks.' : 'Create or import a validated template, then run the variants step.'}</p>`;
  writeFileSync(join(dir, 'review.html'), `<!doctype html><meta charset="utf-8"><title>Video benchmark review</title><style>body{max-width:1100px;margin:40px auto;padding:20px;font:16px system-ui;background:#111827;color:#f3f4f6}a{color:#93c5fd}.frames{display:flex;overflow:auto;gap:12px}img{height:300px}pre{white-space:pre-wrap;background:#1f2937;padding:18px}summary{cursor:pointer;padding:16px}audio{width:100%}</style><h1>Video benchmark</h1><p>${esc(e.status)} · ${esc(e.source)} · ${variants.length} draft variants</p><p>Source fingerprint: ${esc(e.hash)}</p>${e.audio ? '<h2>Reference audio</h2><audio controls src="audio.wav"></audio>' : ''}<div class="frames">${(e.frames || []).map(f => `<figure><img src="${esc(f.file)}"><figcaption>${esc(f.id)} · ${f.time}s</figcaption></figure>`).join('')}</div><h2>Format analysis</h2><pre>${esc(template ? JSON.stringify(template, null, 2) : 'Awaiting reference analysis. Evidence extracted; no template inferred yet.')}</pre><h2>Variant production plans</h2>${variantSection}`);
}
function perceptionReport(dir) {
  const sections=['vision.json','audio-analysis.json'].filter(f=>existsSync(join(dir,f))).map(f=>`<h2>${esc(f)}</h2><pre>${esc(JSON.stringify(json(join(dir,f)),null,2))}</pre>`).join('');
  const path=join(dir,'review.html');
  writeFileSync(path,readFileSync(path,'utf8').replace('<h2>Format analysis</h2>',`${sections}<h2>Format analysis</h2>`));
}
async function main() {
  if (command === 'review') {
    if (!input || !existsSync(join(resolve(input),'evidence.json'))) throw new Error('Supply a prepared benchmark directory');
    report(resolve(input)); perceptionReport(resolve(input)); console.log(join(resolve(input),'review.html')); return;
  }
  if(command==='run') {
    const out=flag('--out'), matrix=flag('--matrix');
    if(!input || !out || !matrix) throw new Error('run requires video, --out new-directory and --matrix file');
    if(existsSync(out)) throw new Error('Run directory already exists; use individual stage commands to retry');
    const cli=fileURLToPath(import.meta.url);
    run(process.execPath,[cli,'prepare',input,'--out',out]);
    const state={status:'RUNNING',phase:'perception',publish:false};
    save(join(out,'run-state.json'),state);
    try {
      run(process.execPath,[cli,'perceive',out]);
      state.phase='variants';save(join(out,'run-state.json'),state);
      run(process.execPath,[cli,'variants',out,'--matrix',matrix]);
      for(const plan of json(join(out,'variants.json'))) save(join(out,'plans',`${plan.id}-assets.json`),createAssetManifest(plan));
      state.status='AWAITING_GENERATED_CLIPS';state.phase='render_handoff';
      save(join(out,'run-state.json'),state);
      console.log(JSON.stringify({out,...state}));
    } catch(error) {state.status='BLOCKED';state.error=error.message;save(join(out,'run-state.json'),state);throw error;}
    return;
  }
  if (command === 'assets') {
    const out=flag('--out'); if(!out || existsSync(out)) throw new Error('Supply a new --out assets.json');
    save(out,createAssetManifest(json(input))); console.log(out); return;
  }
  if (command === 'render') {
    const assets=flag('--assets'), out=flag('--out');
    if(!assets||!out) throw new Error('--assets and --out required');
    console.log(JSON.stringify(await renderBenchmark(resolve(input),resolve(assets),out))); return;
  }
  if (command === 'matrix') {
    if (!input) throw new Error('Supply an output JSON filename');
    if (existsSync(input)) throw new Error('Matrix file already exists');
    const niches = ['knee replacement planning','cardiac care planning','dental care planning','fertility care planning','oncology care planning'];
    const markets = [{geography:'Kenya',language:'English',localization:'Kenyan English; verify local contact/travel details'}, {geography:'Nigeria',language:'English',localization:'Nigerian English; verify local contact/travel details'}, {geography:'Oman',language:'Arabic',localization:'Arabic transcreation and RTL typography required'}, {geography:'United Kingdom',language:'English',localization:'British English; verify follow-up coordination wording'}, {geography:'Iraq',language:'Arabic',localization:'Arabic transcreation and RTL typography required'}];
    const angles = ['questions to ask before sharing records','what to clarify in a written estimate'];
    save(input,niches.flatMap(niche=>markets.flatMap(m=>angles.map(angle=>({niche,...m,angle,audience:'Families exploring care in India',presenter:'Disclosed fictional AI educator',cta:'Save this question list'})))));
    console.log('Created 50 editable market/angle briefs. These are not 50 rendered videos.'); return;
  }
  if (command === 'prepare') {
    if (!input) throw new Error('Supply a local video path or reference URL');
    const id = fingerprint(input).slice(0, 12);
    const dir = resolve(flag('--out') || join(root, 'outputs/factory/benchmarks', id));
    if (existsSync(join(dir, 'evidence.json'))) throw new Error('Output exists; choose a new --out directory to preserve evidence');
    mkdirSync(dir, { recursive: true });
    if (/^https?:\/\//i.test(input)) {
      save(join(dir, 'evidence.json'), { source: input, hash: fingerprint(input), status: 'NEEDS_LOCAL_MEDIA', frames: [], note: 'Link recorded only. Supply the downloaded reference video you may use; no analysis inferred from page text.' });
    } else {
      const path = resolve(input);
      const meta = JSON.parse(run('ffprobe', ['-v','error','-show_format','-show_streams','-of','json',path]));
      const duration = Number(meta.format.duration);
      if (!(duration > 0 && duration <= 600) || !meta.streams.some(s => s.codec_type === 'video')) throw new Error('Expected video of 0–600 seconds');
      const frames = [];
      // Dense opening samples plus evenly spaced coverage; these are samples, not exact cut detection.
      const times = [...new Set([0,.5,1,2,3,...Array.from({length:19},(_,i)=> +(i * duration / 19).toFixed(3))])].filter(t=>t < duration).sort((a,b)=>a-b);
      for (const time of times) {
        const file = `frame-${String(frames.length).padStart(3,'0')}.jpg`;
        run('ffmpeg',['-v','error','-y','-ss',String(time),'-i',path,'-frames:v','1','-vf','scale=640:-2',join(dir,file)]);
        if (existsSync(join(dir,file))) frames.push({id:`F${frames.length}`,time,file});
      }
      const audio = meta.streams.some(s=>s.codec_type === 'audio');
      if (audio) run('ffmpeg',['-v','error','-y','-i',path,'-vn','-ac','1','-ar','16000',join(dir,'audio.wav')]);
      save(join(dir,'evidence.json'),{source:path,hash:fingerprint(readFileSync(path).toString('base64')),status:'EVIDENCE_READY',duration,streams:meta.streams,frames,audio,limitations:['Sampled frames can miss brief cuts and animation.','Audio has been extracted, not automatically listened to or transcribed.']});
    }
    writeFileSync(join(dir,'analyst-instructions.md'),readFileSync(join(root,'agents/video-benchmark/INSTRUCTIONS.md')));
    report(dir); console.log(JSON.stringify({dir,review:join(dir,'review.html')})); return;
  }
  if (!input) throw new Error('Supply the prepared benchmark directory');
  const dir = resolve(input), evidence = json(join(dir,'evidence.json'));
  if (['perceive','audio','plan'].includes(command)) {
    if(evidence.status!=='EVIDENCE_READY') throw new Error('Actual local video required');
    const python=process.env.BENCHMARK_PYTHON||'python', worker=join(root,'scripts/benchmark-local.py');
    if(evidence.audio && command!=='plan') {
      run(python,[worker,'audio',join(dir,'audio.wav'),'--output',join(dir,'audio-analysis.json')]);
      const audio=json(join(dir,'audio-analysis.json')); save(join(dir,'audio-analysis.json'),{...audio,source_hash:evidence.hash});
    }
    if(command==='perceive') {
      run(python,[worker,'vision',dir,'--model',flag('--model')||'NemoStation/Marlin-2B']);
    }
    if(command==='perceive' || command==='plan') {
      run(python,[worker,'plan',dir,'--model',flag('--planner')||process.env.BENCHMARK_PLANNER_MODEL||'Qwen/Qwen3-1.7B']);
      const raw=readFileSync(join(dir,'template-candidate.txt'),'utf8').replace(/<think>[\s\S]*?<\/think>/g,'').replace(/^\s*```(?:json)?\s*|\s*```\s*$/g,'').trim();
      try {
        const template=validateTemplate(JSON.parse(raw),evidence.duration);
        save(join(dir,'template.json'),{...template,source_hash:evidence.hash,review_status:'UNREVIEWED',analysis_model:flag('--planner')||process.env.BENCHMARK_PLANNER_MODEL||'Qwen/Qwen3-1.7B',vision_model:json(join(dir,'vision.json')).model});
      } catch(error) { report(dir); perceptionReport(dir); throw new Error(`Perception saved, but template failed validation: ${error.message}. Inspect template-candidate.txt; no generic fallback created.`); }
    }
  } else if (command === 'analyze') {
    if (evidence.status !== 'EVIDENCE_READY') throw new Error('Actual local video evidence required');
    const model = flag('--model') || process.env.BENCHMARK_VISION_MODEL;
    if (!model) throw new Error('Set BENCHMARK_VISION_MODEL to an installed Ollama vision model, or import an analyst-reviewed template with import');
    const endpoint = new URL(process.env.BENCHMARK_LOCAL_URL || 'http://127.0.0.1:11434');
    if (!['localhost','127.0.0.1','[::1]'].includes(endpoint.hostname)) throw new Error('This worker accepts localhost models only');
    const prompt = readFileSync(join(root,'agents/video-benchmark/INSTRUCTIONS.md'),'utf8');
    const response = await fetch(new URL('/api/chat',endpoint),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model,stream:false,format:'json',messages:[{role:'system',content:prompt},{role:'user',content:`Analyze these ordered sampled frames. Audio was NOT supplied to you. Evidence: ${JSON.stringify(evidence.frames)}. Duration ${evidence.duration}s.`,images:evidence.frames.map(f=>readFileSync(join(dir,f.file)).toString('base64'))}]}),signal:AbortSignal.timeout(180000)});
    if (!response.ok) throw new Error(`Local model returned ${response.status}`);
    const result = await response.json();
    const template = validateTemplate(JSON.parse(result.message.content),evidence.duration);
    save(join(dir,'template.json'),{...template,source_hash:evidence.hash,analysis_model:model,review_status:'UNREVIEWED'});
  } else if (command === 'import') {
    if (evidence.status !== 'EVIDENCE_READY') throw new Error('Actual local video evidence required');
    const path = flag('--template'); if (!path) throw new Error('--template required');
    const template = validateTemplate(json(path),evidence.duration);
    save(join(dir,'template.json'),{...template,source_hash:evidence.hash,review_status:'UNREVIEWED',analysis_model:'analyst-import'});
  } else if (command === 'variants') {
    const path = flag('--matrix'); if (!path) throw new Error('--matrix required');
    const template = json(join(dir,'template.json'));
    if (template.source_hash !== evidence.hash) throw new Error('Template belongs to different evidence');
    const variants = expandTemplate(template,json(path));
    mkdirSync(join(dir,'plans'),{recursive:true});
    for (const v of variants) save(join(dir,'plans',`${v.id}.json`),v);
    save(join(dir,'variants.json'),variants);
  } else throw new Error('Commands: prepare <video> [--out dir], analyze <dir> --model name, import <dir> --template file, variants <dir> --matrix file');
  report(dir); perceptionReport(dir); console.log(JSON.stringify({ok:true,review:join(dir,'review.html')}));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
