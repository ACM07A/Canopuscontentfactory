// Opt-in real FFmpeg + cached Whisper test. Color bars are test media, not a product video.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createAssetManifest, renderBenchmark } from '../lib/benchmark_render.mjs';

test('real offline ASR -> captions -> AV-preserving FFmpeg render', {skip:process.env.BENCHMARK_MEDIA_TEST!=='1'}, async()=>{
  const dir=mkdtempSync(join(tmpdir(),'benchmark-render-'));
  const audio=resolve('outputs/factory/benchmarks/local-smoke-20260907/audio.wav');
  assert.ok(existsSync(audio));
  execFileSync('ffmpeg',['-v','error','-y','-f','lavfi','-i','color=c=navy:s=360x640:r=30:d=10.1','-i',audio,'-shortest','-c:v','libx264','-c:a','aac',join(dir,'fixture.mp4')]);
  // Test uses the raw recognition result, not a corrected medical script. An ASR
  // substitution must block a production script instead of burning the error in.
  const speech='Considering me replacement abroad? Start with three questions. First, what records will the hospital review?';
  const plan={id:'TEST_ONLY',publish:false,scenes:[{id:'scene-1',speech,caption_text:speech}]};
  const assets=createAssetManifest(plan);assets.scenes[0].video='fixture.mp4';assets.scenes[0].mode='broll';
  writeFileSync(join(dir,'plan.json'),JSON.stringify(plan));writeFileSync(join(dir,'assets.json'),JSON.stringify(assets));
  const result=await renderBenchmark(join(dir,'plan.json'),join(dir,'assets.json'),join(dir,'render'));
  assert.equal(result.status,'RENDERED_REVIEW_REQUIRED');assert.equal(result.publish,false);
  const meta=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-of','json',join(dir,'render/final-review.mp4')],{encoding:'utf8'}));
  assert.ok(meta.streams.some(s=>s.codec_type==='audio'));
  assert.equal(meta.streams.find(s=>s.codec_type==='video').width,1080);
  assert.ok(readFileSync(join(dir,'render/captions.srt'),'utf8').includes('00:00:'));
  console.log(`TEST-ONLY render: ${dir}`);
});
