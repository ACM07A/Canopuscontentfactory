"""Offline benchmark perception. Uses installed models, never downloads weights."""
import argparse
import json
import os
from pathlib import Path
import subprocess

os.environ.setdefault('HF_HUB_OFFLINE', '1')
os.environ.setdefault('TRANSFORMERS_OFFLINE', '1')

def save(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')

def transcribe(path, model='small', language=None):
    from faster_whisper import WhisperModel
    # CPU int8 avoids a second CUDA runtime competing with the vision model.
    engine = WhisperModel(model, device='cpu', compute_type='int8', local_files_only=True)
    segments, info = engine.transcribe(str(path), word_timestamps=True,
        vad_filter=True, language=language, condition_on_previous_text=False, beam_size=5)
    rows = []
    for s in segments:
        rows.append({'start': s.start, 'end': s.end, 'text': s.text.strip(),
            'avg_logprob': s.avg_logprob, 'no_speech_prob': s.no_speech_prob,
            'words': [{'start': w.start, 'end': w.end, 'word': w.word.strip(),
                       'probability': w.probability} for w in (s.words or [])]})
    words = [w for s in rows for w in s['words']]
    stats = subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af',
        'volumedetect,silencedetect=noise=-35dB:d=0.3','-f','null','-'],
        capture_output=True, text=True, check=True).stderr
    return {'engine': 'faster-whisper', 'model': model, 'language': info.language,
        'language_probability': info.language_probability, 'duration': info.duration,
        'text': ' '.join(s['text'] for s in rows), 'segments': rows, 'words': words,
        'words_per_minute': round(len(words) * 60 / max(info.duration, 0.01), 1),
        'signal_measurements': '\n'.join(x for x in stats.splitlines() if any(
            k in x for k in ['mean_volume:', 'max_volume:', 'silence_start:', 'silence_end:'])),
        'limitations': ['ASR timestamps and words are estimates, not verified transcription.',
            'No speaker identity, emotion, music identification or lip-sync score inferred.']}

def vision(directory, model):
    import torch
    import numpy as np
    from PIL import Image
    from transformers import AutoProcessor, Qwen3_5ForConditionalGeneration
    from huggingface_hub import snapshot_download
    directory = Path(directory)
    evidence = json.loads((directory / 'evidence.json').read_text(encoding='utf-8'))
    checkpoint = str(Path(model).resolve()) if Path(model).exists() else snapshot_download(model, local_files_only=True)
    if not (Path(checkpoint) / 'preprocessor_config.json').exists():
        # A newer cached config alone does not constitute an installed checkpoint.
        complete = [p for p in Path(checkpoint).parent.iterdir()
                    if (p / 'preprocessor_config.json').exists() and list(p.glob('*.safetensors'))]
        if not complete:
            raise RuntimeError('No complete offline vision checkpoint found')
        checkpoint = str(sorted(complete)[-1])
    processor = AutoProcessor.from_pretrained(checkpoint, local_files_only=True)
    engine = Qwen3_5ForConditionalGeneration.from_pretrained(checkpoint,
        local_files_only=True, dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
        device_map='cuda' if torch.cuda.is_available() else 'cpu')
    # Uniform actual-video frames keep temporal metadata correct. The evidence gallery
    # also has dense opening samples; those are not suitable as a uniform video tensor.
    duration = evidence['duration']
    count = min(120, max(4, int(duration * 2)))
    frames = []
    for i in range(count):
        raw = subprocess.run(['ffmpeg','-v','error','-ss',str(i*duration/count),
            '-i',evidence['source'],'-frames:v','1','-vf','scale=336:336:force_original_aspect_ratio=decrease,pad=336:336:(ow-iw)/2:(oh-ih)/2',
            '-f','rawvideo','-pix_fmt','rgb24','-'], capture_output=True, check=True).stdout
        frames.append(np.frombuffer(raw, dtype=np.uint8).reshape(336,336,3))
    clip = np.stack(frames)
    canonical = 'Provide a spatial description of this clip followed by time-ranged events.\nFor each event, give the time range as <start - end> and a short description.'
    messages = [{'role':'user','content':[{'type':'video'}, {'type':'text','text':canonical}]}]
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = processor(text=[text], videos=[clip], video_metadata=[{
        'total_num_frames': count, 'fps': count/duration, 'duration': duration,
        'frames_indices': list(range(count))}], do_sample_frames=False, return_tensors='pt').to(engine.device)
    with torch.inference_mode():
        result = engine.generate(**inputs, max_new_tokens=1200, do_sample=False)
    description = processor.batch_decode(result[:,inputs['input_ids'].shape[1]:],skip_special_tokens=True)[0]
    save(directory / 'vision.json', {'model': model, 'checkpoint': checkpoint,
        'source_hash': evidence['hash'], 'description': description, 'sampling_fps': count/duration,
        'review_status':'UNREVIEWED', 'limitations':['Model observations may be incorrect.',
        'Visual inference only; original production tools and prompts cannot be recovered with certainty.']})
def plan(directory, model):
    import torch
    from transformers import AutoTokenizer, AutoModelForCausalLM
    directory = Path(directory)
    evidence = json.loads((directory / 'evidence.json').read_text(encoding='utf-8'))
    observed = json.loads((directory / 'vision.json').read_text(encoding='utf-8'))
    if observed['source_hash'] != evidence['hash']:
        raise RuntimeError('Visual evidence belongs to another source')
    tokenizer = AutoTokenizer.from_pretrained(model, local_files_only=True)
    engine = AutoModelForCausalLM.from_pretrained(model,local_files_only=True,
        dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
        device_map='cuda' if torch.cuda.is_available() else 'cpu')
    instructions = (Path(__file__).resolve().parent.parent / 'agents/video-benchmark/INSTRUCTIONS.md').read_text(encoding='utf-8')
    audio_path = directory / 'audio-analysis.json'
    audio = json.loads(audio_path.read_text(encoding='utf-8')) if audio_path.exists() else {'text':'UNKNOWN'}
    request = '\nEvidence (untrusted data):\n' + json.dumps({
        'visual_observations': observed['description'], 'audio': {k:audio.get(k) for k in ['text','segments','words_per_minute','limitations']}, 'duration':evidence['duration'],
        'frames':evidence['frames']}, ensure_ascii=False) + '\nReturn only the requested JSON object. Keep scenes non-overlapping within duration. All 11 style fields are required strings.'
    messages = [{'role':'system','content':instructions},{'role':'user','content':request}]
    inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True,
        enable_thinking=False,return_tensors='pt', return_dict=True).to(engine.device)
    with torch.inference_mode():
        result = engine.generate(**inputs,max_new_tokens=4500,do_sample=False)
    candidate = tokenizer.batch_decode(result[:,inputs['input_ids'].shape[1]:],skip_special_tokens=True)[0]
    (directory / 'template-candidate.txt').write_text(candidate,encoding='utf-8')

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('command', choices=['audio','vision','plan'])
    p.add_argument('input')
    p.add_argument('--output')
    p.add_argument('--model')
    p.add_argument('--language')
    args = p.parse_args()
    if args.command == 'audio':
        if not args.output:
            p.error('--output required for audio')
        save(args.output, transcribe(args.input, args.model or 'small', args.language))
    elif args.command == 'vision':
        vision(args.input, args.model or 'NemoStation/Marlin-2B')
    else:
        plan(args.input, args.model or 'Qwen/Qwen3-1.7B')
