"""Explicit one-time planner setup. Verified ranged downloads for large-file proxies."""
from concurrent.futures import ThreadPoolExecutor
import hashlib
from pathlib import Path
import os
import httpx
from huggingface_hub import HfApi, snapshot_download

MODEL = 'Qwen/Qwen3-1.7B'
info = HfApi().model_info(MODEL, files_metadata=True)
snapshot = Path(snapshot_download(MODEL, revision=info.sha,
    allow_patterns=['*.json','*.txt','*.jinja']))
chunk_size = 16 * 1024 * 1024
for entry in info.siblings:
    if not entry.rfilename.endswith('.safetensors'):
        continue
    target = snapshot / entry.rfilename
    expected = entry.lfs.sha256
    if target.exists() and hashlib.file_digest(target.open('rb'), 'sha256').hexdigest() == expected:
        continue
    staging = target.with_suffix('.download')
    with staging.open('wb') as stream:
        stream.truncate(entry.size)
    url = f'https://huggingface.co/{MODEL}/resolve/{info.sha}/{entry.rfilename}'
    def fetch(start):
        end = min(start + chunk_size, entry.size) - 1
        with httpx.Client(follow_redirects=True, timeout=90) as client:
            response = client.get(url, headers={'Range':f'bytes={start}-{end}'})
        response.raise_for_status()
        if response.status_code != 206 or response.headers.get('content-range') != f'bytes {start}-{end}/{entry.size}' or len(response.content) != end-start+1:
            raise RuntimeError('Server did not honor requested range; refusing corrupt weights')
        with staging.open('r+b') as stream:
            stream.seek(start)
            stream.write(response.content)
        return len(response.content)
    total=0
    with ThreadPoolExecutor(max_workers=16) as pool:
        for size in pool.map(fetch,range(0,entry.size,chunk_size)):
            total += size
            print(f'{entry.rfilename}: {total}/{entry.size}',flush=True)
    with staging.open('rb') as stream:
        if hashlib.file_digest(stream,'sha256').hexdigest() != expected:
            raise RuntimeError('Weight SHA256 mismatch')
    os.replace(staging,target)
print(snapshot,flush=True)
