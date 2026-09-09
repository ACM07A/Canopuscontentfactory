import test from 'node:test';
import assert from 'node:assert/strict';
import { dimensions, validateTemplate, expandTemplate, fingerprint } from '../lib/video_benchmark.mjs';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createAssetManifest, validateAssets, wordErrorRate, captionCues } from '../lib/benchmark_render.mjs';
const fixture = () => ({name:'Test format',style:Object.fromEntries(dimensions.map(k=>[k,'Test instruction'])),scenes:[{start:0,end:4,role:'hook',visual:'Presenter addresses {{audience}}',speech:'Exploring {{niche}} from {{geography}}? {{angle}}',evidence:'F0 at 0 seconds',production_method:'native audio video',confidence:'inferred'}]});
const matrix = () => Array.from({length:50},(_,i)=>({niche:'planning',geography:'Kenya',language:'English',audience:'families',angle:`Question ${i}`}));
test('asset handoff rejects stale dialogue and external audio on talking faces',()=>{
  const p=expandTemplate(fixture(),matrix())[0], a=createAssetManifest(p);
  a.scenes[0].video='clip.mp4';validateAssets(p,a);
  a.scenes[0].audio='unrelated.wav';assert.throws(()=>validateAssets(p,a),/external overlay/);
  delete a.scenes[0].audio; a.scenes[0].speech='changed';assert.throws(()=>validateAssets(p,a),/dialogue mismatch/);
  a.scenes[0].speech=p.scenes[0].speech;p.scenes[0].visual='changed';assert.throws(()=>validateAssets(p,a),/stale/);
});
test('word comparison catches repetition and uses unicode words',()=>{
  assert.equal(wordErrorRate('Hello, world!','hello world'),0);
  assert.ok(wordErrorRate('Hello world','Hello world hello world')>.15);
  assert.equal(wordErrorRate('مرحبا بالعالم','مرحبا بالعالم'),0);
});
test('captions use actual word timing and preserve pauses',()=>{
  const cues=captionCues([{word:'Hello',start:.2,end:.5},{word:'world',start:1.2,end:1.6}],5);
  assert.deepEqual(cues,[{start:5.2,end:5.5,text:'Hello'},{start:6.2,end:6.6,text:'world'}]);
  assert.throws(()=>captionCues([{word:'bad',start:2,end:1}]));
});
test('50 variants maintain one dialogue source and original timing',()=>{
  const output=expandTemplate(fixture(),matrix());
  assert.equal(output.length,50);
  assert.equal(new Set(output.map(v=>v.content_hash)).size,50);
  for(const v of output){assert.equal(v.scenes[0].speech,v.scenes[0].caption_text);assert.ok(v.scenes[0].generation_prompt.includes(v.scenes[0].speech));assert.equal(v.scenes[0].end,4);assert.equal(v.publish,false);}
});
test('overlaps and out-of-range evidence are rejected',()=>{const t=fixture();assert.throws(()=>validateTemplate(t,2));t.scenes.push({...t.scenes[0],start:3,end:6});assert.throws(()=>validateTemplate(t));});
test('missing style evidence cannot silently become a generic template',()=>{const t=fixture();delete t.style.sound;assert.throws(()=>validateTemplate(t));});
test('duplicates are rejected and unresolved variables are held',()=>{const m=matrix();m[1]=m[0];assert.throws(()=>expandTemplate(fixture(),m));const t=fixture();t.scenes[0].speech='Ask {{missing}}';assert.ok(expandTemplate(t,matrix())[0].blockers.includes('unresolved template variables'));});
test('changing spoken words invalidates fingerprints',()=>{const t=fixture(),h=fingerprint(t);t.scenes[0].speech='Changed';assert.notEqual(fingerprint(t),h);});
test('CLI imports evidence-linked analysis and writes 50 reviewable plan files',()=>{
  const dir=mkdtempSync(join(tmpdir(),'video-benchmark-test-'));
  writeFileSync(join(dir,'evidence.json'),JSON.stringify({source:'synthetic-test-only',hash:'test-source',status:'EVIDENCE_READY',duration:4,frames:[]}));
  writeFileSync(join(dir,'input.json'),JSON.stringify(fixture()));
  writeFileSync(join(dir,'matrix.json'),JSON.stringify(matrix()));
  const cli=resolve('scripts/video-benchmark.mjs');
  execFileSync(process.execPath,[cli,'import',dir,'--template',join(dir,'input.json')]);
  execFileSync(process.execPath,[cli,'variants',dir,'--matrix',join(dir,'matrix.json')]);
  assert.equal(JSON.parse(readFileSync(join(dir,'variants.json'))).length,50);
  assert.ok(existsSync(join(dir,'plans/variant-050.json')));
  assert.ok(readFileSync(join(dir,'review.html'),'utf8').includes('variant-050'));
});
