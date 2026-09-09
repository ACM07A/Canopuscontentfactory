// Freepik/Magnific adapter. Use only model IDs explicitly marked unlimited by the account owner.
import { freepikStatus } from "../factory_registry.mjs";
const key = () => process.env.FREEPIK_API_KEY || "";
const base = () => process.env.FREEPIK_API_BASE || "https://api.magnific.com";
const assertModel = (model) => {
  if (!key()) throw new Error("FREEPIK_API_KEY is not configured");
  if (!freepikStatus().unlimitedModels.includes(model)) throw new Error(`Model '${model}' is not allowlisted as unlimited.`);
};
async function post(path, body) {
  const r = await fetch(`${base()}${path}`, { method: "POST", headers: { "content-type": "application/json", "x-magnific-api-key": key() }, body: JSON.stringify(body), signal: AbortSignal.timeout(Number(process.env.FREEPIK_API_TIMEOUT_MS) || 45000) });
  if (!r.ok) throw new Error(`Freepik ${r.status}: ${(await r.text()).slice(0, 180)}`);
  return r.json();
}
async function get(path) {
  const r = await fetch(`${base()}${path}`, { headers: { "x-magnific-api-key": key() }, signal: AbortSignal.timeout(Number(process.env.FREEPIK_API_TIMEOUT_MS) || 30000) });
  if (!r.ok) throw new Error(`Magnific ${r.status}: ${(await r.text()).slice(0, 180)}`);
  return r.json();
}
async function stockGet(path) {
  const stockBase = process.env.FREEPIK_STOCK_API_BASE || "https://api.freepik.com";
  const r = await fetch(`${stockBase}${path}`, { headers: { accept: "application/json", "x-freepik-api-key": key() }, signal: AbortSignal.timeout(Number(process.env.FREEPIK_API_TIMEOUT_MS) || 30000) });
  if (!r.ok) throw new Error(`Freepik stock ${r.status}: ${(await r.text()).slice(0, 180)}`);
  return r.json();
}
export function status() { return freepikStatus(); }
export async function searchStock({ term, limit = 1 }) {
  if (!key()) throw new Error("FREEPIK_API_KEY is not configured");
  const qs = new URLSearchParams({ term, limit: String(limit), order: "relevance" });
  const j = await stockGet(`/v1/resources?${qs.toString()}`);
  const resource = j.data?.[0];
  if (!resource?.image?.source?.url) throw new Error(`Freepik stock returned no image for '${term}'`);
  return { provider: "freepik-stock", id: resource.id, title: resource.title, pageUrl: resource.url, imageUrl: resource.image.source.url, license: resource.licenses?.[0]?.type || "unknown", author: resource.author?.name || null };
}
export async function createImage({ model, prompt, aspectRatio = "1:1", webhookUrl }) {
  assertModel(model); const j = await post(`/v1/ai/text-to-image/${model}`, { prompt, aspect_ratio: aspectRatio, ...(webhookUrl ? { webhook_url: webhookUrl } : {}) });
  return { provider: "freepik", type: "image", model, taskId: j.data?.task_id, status: j.data?.status || "CREATED" };
}
export async function createVideo({ model, prompt, image, imageUrl, startImageUrl, endImageUrl, imageUrls, multiPrompt, multiShot = false, shotType = "customize", aspectRatio = "9:16", duration = 5, webhookUrl, generateAudio = false, negativePrompt }) {
  assertModel(model);
  const isKling3 = model === "kling-v3-pro" || model === "kling-v3-std" || model === "kling-v3-omni-pro" || model === "kling-v3-omni-std";
  const isKling26 = model === "kling-v2-6-pro";
  let path = `/v1/ai/image-to-video/${model}`;
  let body;
  if (isKling3) {
    path = `/v1/ai/video/${model}`;
    body = {
      prompt,
      ...(imageUrl ? { image_url: imageUrl } : {}),
      ...(startImageUrl ? { start_image_url: startImageUrl } : {}),
      ...(endImageUrl ? { end_image_url: endImageUrl } : {}),
      ...(Array.isArray(imageUrls) && imageUrls.length ? { image_urls: imageUrls } : {}),
      ...(Array.isArray(multiPrompt) && multiPrompt.length ? { multi_prompt: multiPrompt } : {}),
      ...(multiPrompt?.length ? { multi_shot: multiShot, shot_type: shotType } : {}),
      generate_audio: generateAudio,
      aspect_ratio: aspectRatio,
      duration: String(duration),
      ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      ...(webhookUrl ? { webhook_url: webhookUrl } : {}),
    };
  } else if (isKling26) {
    body = { prompt, duration: String(duration), aspect_ratio: aspectRatio === "9:16" ? "social_story_9_16" : aspectRatio === "1:1" ? "square_1_1" : "widescreen_16_9", generate_audio: generateAudio, ...(negativePrompt ? { negative_prompt: negativePrompt } : {}), ...(webhookUrl ? { webhook_url: webhookUrl } : {}) };
  } else {
    body = model.startsWith("veo-")
      ? { prompt, image, duration: Number(duration), resolution: "1080p", aspect_ratio: aspectRatio, generate_audio: generateAudio, ...(negativePrompt ? { negative_prompt: negativePrompt } : {}), ...(webhookUrl ? { webhook_url: webhookUrl } : {}) }
      : { prompt, image, duration: String(duration), ...(negativePrompt ? { negative_prompt: negativePrompt } : {}), ...(generateAudio ? { generate_audio: true } : {}), ...(webhookUrl ? { webhook_url: webhookUrl } : {}) };
  }
  const j = await post(path, body);
  return { provider: "freepik", type: "video", model, taskId: j.data?.task_id, status: j.data?.status || "CREATED" };
}
export async function getVideoTask({ model, taskId }) {
  assertModel(model); const path = model === "kling-v3-pro" || model === "kling-v3-std" || model === "kling-v3-omni-pro" || model === "kling-v3-omni-std" ? `/v1/ai/video/${model}/${encodeURIComponent(taskId)}` : `/v1/ai/image-to-video/${model}/${encodeURIComponent(taskId)}`; const j = await get(path);
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
