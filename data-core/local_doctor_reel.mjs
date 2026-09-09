// Zero-credit English doctor-style reel. This is deliberately a controlled presenter-card composition:
// the fictional doctor stays visible in every beat, FFmpeg handles motion/text/audio, and Windows SAPI
// supplies a preview voice. Replace the local voice with an approved provider voice before paid use.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { videoProfile } from "../lib/video_profiles.mjs";
import { loadEnv } from "../lib/env.mjs";

loadEnv();
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const id = process.env.FACTORY_LOCAL_DOCTOR_ID || "knee-replacement-doctor-controlled-001";
const dir = join(ROOT, "outputs", "factory", "video-sequences", id);
const source = process.env.FACTORY_DOCTOR_REFERENCE || join(ROOT, "outputs", "factory", "sources", "fictional-doctor-educator.png");
const profile = videoProfile("knee-replacement-doctor");
// FFmpeg's Windows font parser needs the font path quoted inside the filter graph.
const fontBold = "'C\\:/Windows/Fonts/arialbd.ttf'";
const fontRegular = "'C\\:/Windows/Fonts/arial.ttf'";
const scenes = [
  { kicker: "START HERE", title: "Before you compare hospitals", body: "ask these 3 questions" },
  { kicker: "QUESTION 1", title: "What records will they review?", body: "Ask before you send anything." },
  { kicker: "QUESTION 2", title: "What does the estimate include?", body: "Inclusions | exclusions | validity" },
  { kicker: "QUESTION 3", title: "How will follow-up work?", body: "Ask who answers after you return." },
  { kicker: "NEXT STEP", title: "Request a documented pathway", body: "General education - not medical advice" },
];
const narration = "Before you compare hospitals for knee replacement abroad, ask these three questions. First, what records will the hospital review before it responds? Second, what does the written estimate include, and what does it leave out? Third, how will follow-up communication work after you return home? Canopus Care helps organize a documented coordination pathway. This is general education, not medical advice. Clinical decisions stay with qualified hospital teams.";
const escapeFilter = (value) => String(value)
  .replaceAll("\\", "\\\\")
  .replaceAll(":", "\\:")
  .replaceAll("'", "\\'")
  .replaceAll(",", "\\,")
  .replaceAll("?", "\\?")
  .replaceAll("%", "\\%");
const psQuote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const run = (args) => execFileSync("ffmpeg", args, { stdio: process.env.FACTORY_FFMPEG_DEBUG === "1" ? "inherit" : "ignore" });

if (process.platform !== "win32") throw new Error("The local English voice preview currently requires Windows SAPI.");
if (!existsSync(source)) throw new Error(`Doctor reference image not found: ${source}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "style-sheet.md"), "docs/DOCTOR_SHORT_STYLE_SHEET.md\n");
writeFileSync(join(dir, "voiceover-script.txt"), narration);
const audio = join(dir, "voiceover-local.wav");
const voice = process.env.FACTORY_LOCAL_VOICE || "Microsoft David Desktop";
const ttsProvider = (process.env.FACTORY_TTS_PROVIDER || "windows-sapi").toLowerCase();
if (ttsProvider === "pocket") {
  // Optional offline Pocket TTS adapter. Install with `pip install pocket-tts` when desired.
  // The model runs locally; no patient data or script text is sent to a hosted voice API.
  const pocketVoice = process.env.FACTORY_POCKET_VOICE || "alba";
  const python = process.env.FACTORY_PYTHON || "python";
  const pocketScript = [
    "import sys",
    "import scipy.io.wavfile",
    "from pocket_tts import TTSModel",
    "text_path, output_path, voice_name = sys.argv[1], sys.argv[2], sys.argv[3]",
    "model = TTSModel.load_model()",
    "state = model.get_state_for_audio_prompt(voice_name)",
    "audio = model.generate_audio(state, open(text_path, encoding='utf-8').read())",
    "scipy.io.wavfile.write(output_path, model.sample_rate, audio.numpy())",
  ].join("; ");
  execFileSync(python, ["-c", pocketScript, join(dir, "voiceover-script.txt"), audio, pocketVoice], { stdio: "inherit" });
} else {
  const speech = `Add-Type -AssemblyName System.Speech; $s=New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SelectVoice(${psQuote(voice)}); $s.Rate=-1; $s.Volume=100; $s.SetOutputToWaveFile(${psQuote(audio)}); $s.Speak((Get-Content -Raw ${psQuote(join(dir, "voiceover-script.txt"))})); $s.Dispose()`;
  execFileSync("powershell", ["-NoProfile", "-Command", speech], { stdio: "ignore" });
}

const segmentFiles = [];
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i]; const out = join(dir, `scene-${i + 1}.mp4`); segmentFiles.push(out);
  const filter = [
    `scale=1080:1920:force_original_aspect_ratio=increase`, `crop=1080:1920`,
    `zoompan=z='min(zoom+0.00045,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=30`,
    `drawbox=x=0:y=0:w=1080:h=1920:color=0x10251d@0.22:t=fill`,
    `drawbox=x=0:y=0:w=1080:h=230:color=0x10251d@0.86:t=fill`,
    `drawbox=x=0:y=1590:w=1080:h=330:color=0x10251d@0.90:t=fill`,
    `drawtext=fontfile=${fontBold}:text='CANOPUS CARE':fontcolor=0xe6f4ec:fontsize=28:x=70:y=58`,
    `drawtext=fontfile=${fontBold}:text='FICTIONAL AI EDUCATOR':fontcolor=0xb8d7c6:fontsize=18:x=70:y=112`,
    `drawtext=fontfile=${fontBold}:text='${escapeFilter(s.kicker)}':fontcolor=0x8fe0b4:fontsize=25:x=70:y=285`,
    `drawtext=fontfile=${fontBold}:text='${escapeFilter(s.title)}':fontcolor=white:fontsize=52:x=70:y=360`,
    `drawtext=fontfile=${fontRegular}:text='${escapeFilter(s.body)}':fontcolor=0xe6f4ec:fontsize=30:x=70:y=520`,
    `drawtext=fontfile=${fontRegular}:text='General education - clinical decisions stay with the treating team':fontcolor=0xd2e8dc:fontsize=19:x=70:y=1690`,
    `format=yuv420p`].join(",");
  run(["-y", "-loop", "1", "-i", source, "-t", "5", "-vf", filter, "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18", out]);
}
const concat = join(dir, "concat.txt");
writeFileSync(concat, segmentFiles.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n"));
const silent = join(dir, "assembled-silent.mp4");
run(["-y", "-f", "concat", "-safe", "0", "-i", concat, "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-an", silent]);
const final = join(dir, "final-review.mp4");
run(["-y", "-i", silent, "-i", audio, "-map", "0:v:0", "-map", "1:a:0", "-shortest", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", final]);
const srt = scenes.map((scene, i) => `${i + 1}\n00:00:${String(i * 5).padStart(2, "0")},000 --> 00:00:${String((i + 1) * 5).padStart(2, "0")},000\n${i === 0 ? "Before you compare hospitals, ask these three questions." : scene.title}`).join("\n\n");
writeFileSync(join(dir, "captions-review.srt"), srt);
const voiceover = ttsProvider === "pocket"
  ? { status: "LOCAL_POCKET_TTS", provider: "pocket-tts", voice, pocketVoice: process.env.FACTORY_POCKET_VOICE || "alba", file: "voiceover-local.wav" }
  : { status: "LOCAL_PREVIEW", provider: "windows-speech", voice, file: "voiceover-local.wav" };
writeFileSync(join(dir, "production-package.json"), JSON.stringify({ ok: true, title: profile.title, format: "1080x1920 9:16", duration_seconds: 25, presenter: "fictional AI educator", voiceover, captions: "captions-review.srt", final: "final-review.mp4", style_sheet: "docs/DOCTOR_SHORT_STYLE_SHEET.md", publish: false, review: "human approval required" }, null, 2));
console.log(JSON.stringify({ ok: true, id, final: `outputs/factory/video-sequences/${id}/final-review.mp4`, voice, durationSeconds: 25 }));
