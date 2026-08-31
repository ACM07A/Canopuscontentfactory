// Freepik/Magnific adapter. Use only model IDs explicitly marked unlimited by the account owner.
import { freepikStatus } from "../factory_registry.mjs";
const key = () => process.env.FREEPIK_API_KEY || "";
const base = () => process.env.FREEPIK_API_BASE || "https://api.magnific.com";
const assertModel = (model) => {
  if (!key()) throw new Error("FREEPIK_API_KEY is not configured");
  if (!freepikStatus().unlimitedModels.includes(model)) throw new Error(`Model '${model}' is not allowlisted as unlimited.`);
};
async function post(path, body) {
  const r = await fetch(`${base()}${path}`, { method: "POST", headers: { "content-type": "application/json", "x-magnific-api-key": key() }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`Freepik ${r.status}: ${(await r.text()).slice(0, 180)}`);
  return r.json();
}
async function get(path) {
  const r = await fetch(`${base()}${path}`, { headers: { "x-magnific-api-key": key() } });
  if (!r.ok) throw new Error(`Magnific ${r.status}: ${(await r.text()).slice(0, 180)}`);
  return r.json();
}
export function status() { return freepikStatus(); }
export async function createImage({ model, prompt, aspectRatio = "1:1", webhookUrl }) {
  assertModel(model); const j = await post(`/v1/ai/text-to-image/${model}`, { prompt, aspect_ratio: aspectRatio, ...(webhookUrl ? { webhook_url: webhookUrl } : {}) });
  return { provider: "freepik", type: "image", model, taskId: j.data?.task_id, status: j.data?.status || "CREATED" };
}
export async function createVideo({ model, prompt, image, duration = 5, webhookUrl }) {
  assertModel(model); const j = await post(`/v1/ai/image-to-video/${model}`, { prompt, image, duration: String(duration), ...(webhookUrl ? { webhook_url: webhookUrl } : {}) });
  return { provider: "freepik", type: "video", model, taskId: j.data?.task_id, status: j.data?.status || "CREATED" };
}
export async function getVideoTask({ model, taskId }) {
  assertModel(model); const j = await get(`/v1/ai/image-to-video/${model}/${encodeURIComponent(taskId)}`);
  return { provider: "freepik", type: "video", model, taskId, ...(j.data || j) };
}

export async function createVoiceover({ model = "elevenlabs-turbo-v2-5", text, voiceId, speed = 1, webhookUrl }) {
  assertModel(model); const j = await post(`/v1/ai/voiceover/${model}`, { text, voice_id: voiceId, speed, ...(webhookUrl ? { webhook_url: webhookUrl } : {}) });
  return { provider: "magnific", type: "voiceover", model, taskId: j.data?.task_id, status: j.data?.status || "CREATED" };
}

export async function getVoiceoverTask({ model = "elevenlabs-turbo-v2-5", taskId }) {
  assertModel(model); const j = await get(`/v1/ai/voiceover/${model}/${encodeURIComponent(taskId)}`);
  return { provider: "magnific", type: "voiceover", model, taskId, ...(j.data || j) };
}

export async function createLipSync({ model = "veed-fabric-1-0", imageUrl, audioUrl, resolution = "720p", webhookUrl }) {
  assertModel(model); const j = await post(`/v1/ai/lip-sync/${model}`, { image_url: imageUrl, audio_url: audioUrl, resolution, ...(webhookUrl ? { webhook_url: webhookUrl } : {}) });
  return { provider: "magnific", type: "lip-sync", model, taskId: j.data?.task_id, status: j.data?.status || "CREATED" };
}

export async function getLipSyncTask({ model = "veed-fabric-1-0", taskId }) {
  assertModel(model); const j = await get(`/v1/ai/lip-sync/${model}/${encodeURIComponent(taskId)}`);
  return { provider: "magnific", type: "lip-sync", model, taskId, ...(j.data || j) };
}
