export function freepikStatus() {
  const models = (process.env.FREEPIK_UNLIMITED_MODELS || "").split(",").map((x) => x.trim()).filter(Boolean);
  return { configured: !!process.env.FREEPIK_API_KEY, webhookConfigured: !!process.env.FREEPIK_WEBHOOK_SECRET, unlimitedModels: models, policy: "credit-consuming models blocked" };
}
