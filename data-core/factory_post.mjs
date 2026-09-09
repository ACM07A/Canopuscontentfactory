// Local post-production for an approved sequence. It never publishes and never spends credits unless a
// voice model is explicitly configured and the operator runs this command.
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { loadEnv } from "../lib/env.mjs";
import { videoProfile } from "../lib/video_profiles.mjs";
import { createVoiceover, getVoiceoverTask, status as providerStatus } from "../lib/providers/freepik.mjs";
import { renderBenchmark } from "../lib/benchmark_render.mjs";

// Explicit plan-driven path: preserve native AV, transcribe actual dialogue, then caption.
// Runs before legacy profile lookup; no arrays or unrelated voiceovers leak into this path.
if (process.env.FACTORY_BENCHMARK_PLAN) {
  if (!process.env.FACTORY_BENCHMARK_ASSETS || !process.env.FACTORY_BENCHMARK_OUTPUT) throw new Error('Benchmark assets and new output directory required');
  console.log(JSON.stringify(await renderBenchmark(process.env.FACTORY_BENCHMARK_PLAN, process.env.FACTORY_BENCHMARK_ASSETS, process.env.FACTORY_BENCHMARK_OUTPUT)));
  process.exit(0);
}

loadEnv();
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const id = process.env.FACTORY_VIDEO_ID || "knee-replacement-organic-short-001";
const dir = join(ROOT, "outputs", "factory", "video-sequences", id);
const profile = videoProfile(process.env.FACTORY_VIDEO_USE_CASE || "knee-replacement");
let sequence = {};
try { sequence = JSON.parse(readFileSync(join(dir, "sequence.json"), "utf8")); } catch {}
const duration = Number(process.env.FACTORY_VIDEO_SCENE_SECONDS) === 10 ? 10 : 5;
const captionsLines = profile.captions || [profile.title, ...(profile.scenes || [])];
const script = profile.voiceover || captionsLines.join(" ");
const template = sequence.template || process.env.FACTORY_VIDEO_TEMPLATE || profile.template || "doctor-explainer";
const srtTime = (seconds) => { const h = String(Math.floor(seconds / 3600)).padStart(2, "0"); const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"); const s = (seconds % 60).toFixed(3).padStart(6, "0").replace(".", ","); return `${h}:${m}:${s}`; };
const terminal = (status) => ["COMPLETED", "SUCCEEDED", "FAILED", "ERROR", "CANCELLED"].includes(String(status).toUpperCase());
const urls = (x) => x?.generated || x?.output_urls || x?.data?.generated || x?.data?.output_urls || (x?.url ? [x.url] : []) || [];
const download = (url, out) => execFileSync("powershell", ["-NoProfile", "-Command", `Invoke-WebRequest -Uri '${url}' -OutFile '${out}' -TimeoutSec 120`], { stdio: "ignore" });
const psQuote = (value) => `'${String(value).replaceAll("'", "''")}'`;
function synthesizeLocal(text, out, voice = "Microsoft David Desktop") {
  const command = `Add-Type -AssemblyName System.Speech; $s=New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SelectVoice(${psQuote(voice)}); $s.Rate=0; $s.Volume=100; $s.SetOutputToWaveFile(${psQuote(out)}); $s.Speak(${psQuote(text)}); $s.Dispose()`;
  execFileSync("powershell", ["-NoProfile", "-Command", command], { stdio: "ignore" });
}
function synthesizePocket(text, out, voice = "alba") {
  const textPath = join(dir, `tts-${basename(out)}.txt`);
  writeFileSync(textPath, text);
  const python = process.env.FACTORY_PYTHON || "python";
  const script = [
    "import sys",
    "import scipy.io.wavfile",
    "from pocket_tts import TTSModel",
    "text_path, output_path, voice_name = sys.argv[1], sys.argv[2], sys.argv[3]",
    "model = TTSModel.load_model()",
    "state = model.get_state_for_audio_prompt(voice_name)",
    "audio = model.generate_audio(state, open(text_path, encoding='utf-8').read())",
    "scipy.io.wavfile.write(output_path, model.sample_rate, audio.numpy())",
  ].join("; ");
  execFileSync(python, ["-c", script, textPath, out, voice], { stdio: "ignore" });
}

if (!existsSync(dir)) throw new Error(`Sequence not found: ${dir}`);
const sceneFiles = Array.from({ length: Math.max(2, captionsLines.length) }, (_, i) => join(dir, `scene-${i + 1}.mp4`)).filter(existsSync);
if (sceneFiles.length < 2) throw new Error("At least two generated scene clips are required before assembly.");
const captionLines = captionsLines.slice(0, sceneFiles.length);
mkdirSync(dir, { recursive: true });
const sceneDuration = duration;
const disclosure = "General education only. Canopus Care is a facilitator; clinical decisions stay with qualified hospital teams.";
const fullScript = String(script).trim();
writeFileSync(join(dir, "voiceover-script.txt"), `${fullScript}\n\nDISCLOSURE: ${disclosure}`);
const captions = captionLines.map((line, i) => `${i + 1}\n${srtTime(i * duration)} --> ${srtTime((i + 1) * duration)}\n${line}`).join("\n\n");
writeFileSync(join(dir, "captions-review.srt"), captions);
const assEscape = (line) => String(line).replaceAll("\\", "\\\\").replaceAll("{", "\\{").replaceAll("}", "\\}").replaceAll("\n", "\\N");
const assEvents = captionLines.map((line, i) => {
  const start = i === 0 ? Math.min(1.8, sceneDuration / 2) : i * sceneDuration;
  return `Dialogue: 0,${srtTime(start).replace(",", ".")},${srtTime((i + 1) * sceneDuration).replace(",", ".")},Canopus,,0,0,0,,${assEscape(line)}`;
}).join("\n");
const hook = profile.captions?.[0] || profile.title;
const hookEvent = `Dialogue: 1,0:00:00.00,0:00:01.80,Hook,,0,0,0,,${assEscape(hook)}`;
const ass = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Canopus,Arial,46,&H0000FFFF,&H0000FFFF,&H00000000,&HAA000000,1,0,1,4,1,2,70,70,190,1\nStyle: Hook,Arial,52,&H0000FFFF,&H0000FFFF,&H00000000,&HCC000000,1,0,1,5,1,8,80,80,120,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${hookEvent}\n${assEvents}\n`;
writeFileSync(join(dir, "captions-review.ass"), ass);
const concat = sceneFiles.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n");
const normalizedSceneFiles = sceneFiles.map((file, i) => {
  const normalized = join(dir, `scene-${i + 1}-normalized.mp4`);
  execFileSync("ffmpeg", ["-y", "-i", file, "-vf", `tpad=stop_mode=clone:stop_duration=${sceneDuration},trim=duration=${sceneDuration},setpts=PTS-STARTPTS`, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", normalized], { stdio: "ignore" });
  return normalized;
});
const normalizedConcat = normalizedSceneFiles.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n");
writeFileSync(join(dir, "concat.txt"), normalizedConcat);
const assembled = join(dir, "assembled-review.mp4");
execFileSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", join(dir, "concat.txt"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-an", assembled], { stdio: "ignore" });
const captioned = join(dir, "assembled-captioned.mp4");
execFileSync("ffmpeg", ["-y", "-i", assembled, "-vf", `fps=30,tpad=stop_mode=clone:stop_duration=1,trim=duration=${sceneFiles.length * sceneDuration},setpts=PTS-STARTPTS,ass=captions-review.ass`, "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", captioned], { cwd: dir, stdio: "ignore" });

const voiceModel = process.env.FREEPIK_VOICE_MODEL || "";
let voiceover = { status: "PENDING_PROVIDER", reason: "Set FREEPIK_VOICE_MODEL to an explicitly allowlisted voice model; no silent or synthetic placeholder audio is accepted." };
const localVoice = process.env.FACTORY_VOICE_PROVIDER !== "magnific" && (!voiceModel || process.env.FACTORY_VOICE_PROVIDER === "local");
if (localVoice && process.platform === "win32") {
  const audio = join(dir, "voiceover-local.wav");
  const sceneSync = process.env.FACTORY_SCENE_SYNC !== "0";
  const ttsProvider = (process.env.FACTORY_TTS_PROVIDER || "pocket").toLowerCase();
  const pocketVoice = process.env.FACTORY_POCKET_VOICE || "alba";
  const speak = (text, out) => ttsProvider === "pocket" ? synthesizePocket(text, out, pocketVoice) : synthesizeLocal(text, out, process.env.FACTORY_LOCAL_VOICE || "Microsoft David Desktop");
  if (sceneSync) {
    const sceneAudio = [];
    for (let i = 0; i < captionLines.length; i++) {
      const raw = join(dir, `voiceover-scene-${i + 1}.wav`);
      const padded = join(dir, `voiceover-scene-${i + 1}-padded.wav`);
      speak(captionLines[i], raw);
      execFileSync("ffmpeg", ["-y", "-i", raw, "-af", `apad=pad_dur=${sceneDuration},atrim=duration=${sceneDuration}`, "-ar", "22050", "-ac", "1", padded], { stdio: "ignore" });
      sceneAudio.push(padded);
    }
    const audioConcat = join(dir, "voiceover-concat.txt");
    writeFileSync(audioConcat, sceneAudio.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n"));
    execFileSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", audioConcat, "-c:a", "pcm_s16le", audio], { stdio: "ignore" });
  } else speak(fullScript, audio);
  const final = join(dir, "final-review.mp4");
  execFileSync("ffmpeg", ["-y", "-i", captioned, "-i", audio, "-map", "0:v:0", "-map", "1:a:0", "-t", String(sceneFiles.length * sceneDuration), "-c:v", "copy", "-c:a", "aac", "-movflags", "+faststart", final], { stdio: "ignore" });
  voiceover = { status: ttsProvider === "pocket" ? "LOCAL_POCKET_TTS" : "LOCAL_PREVIEW", provider: ttsProvider === "pocket" ? "pocket-tts" : "windows-speech", voice: ttsProvider === "pocket" ? pocketVoice : process.env.FACTORY_LOCAL_VOICE || "Microsoft David Desktop", audio: "voiceover-local.wav", final: "final-review.mp4", sync_mode: sceneSync ? "scene-locked-timing-only" : "full-script-overlay", lip_sync: false, note: "Natural-language local preview only; the generated face is not driven by this audio. Use native-audio Kling or Magnific lip-sync before release." };
} else if (voiceModel && providerStatus().configured && providerStatus().unlimitedModels.includes(voiceModel)) {
  const created = await createVoiceover({ model: voiceModel, text: script, voiceId: process.env.FREEPIK_VOICE_ID || undefined, speed: Number(process.env.FREEPIK_VOICE_SPEED) || 1 });
  let latest = created;
  for (let i = 0; i < 30 && !terminal(latest.status); i++) { await new Promise((resolve) => setTimeout(resolve, 5000)); latest = await getVoiceoverTask({ model: voiceModel, taskId: created.taskId }); }
  const audioUrl = urls(latest)[0];
  if (audioUrl && terminal(latest.status) && String(latest.status).toUpperCase() !== "FAILED") {
    const audio = join(dir, "voiceover.mp3"); download(audioUrl, audio);
    const final = join(dir, "final-review.mp4");
    execFileSync("ffmpeg", ["-y", "-i", captioned, "-i", audio, "-map", "0:v:0", "-map", "1:a:0", "-shortest", "-c:v", "copy", "-c:a", "aac", "-movflags", "+faststart", final], { stdio: "ignore" });
    voiceover = { status: "READY_FOR_REVIEW", model: voiceModel, audio: "voiceover.mp3", final: "final-review.mp4" };
  } else voiceover = { status: "VOICEOVER_FAILED", model: voiceModel, provider_status: latest.status };
} else if (voiceModel) voiceover = { status: "BLOCKED_CONFIGURATION", model: voiceModel, reason: "Voice model is not configured and explicitly allowlisted." };
writeFileSync(join(dir, "production-package.json"), JSON.stringify({ ok: true, title: profile.title, template, format: "1080x1920 9:16", video_model: sequence.model || null, filler_ratio_target: sequence.filler_ratio_target || "1/3", hook_overlay: "first 1.8 seconds", script: "voiceover-script.txt", captions: "captions-review.srt", burned_captions: "assembled-captioned.mp4", preview: "assembled-review.mp4", voiceover, publish: false, review: "human approval required" }, null, 2));
console.log(JSON.stringify({ ok: true, id, template, preview: `outputs/factory/video-sequences/${id}/assembled-review.mp4`, voiceover }));
