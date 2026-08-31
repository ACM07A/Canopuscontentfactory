import { getResourceArticlePaths, renderResourceArticle } from "../server/resource_pages.mjs";

const root = process.cwd();
const corridorPaths = getResourceArticlePaths().filter((path) => /^\/(ke|tz|ng|ae)\/treatments\//.test(path));
const failures = [];
const expectedCountry = { ke: "Kenya", tz: "Tanzania", ng: "Nigeria", ae: "United Arab Emirates" };

function textFrom(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

if (corridorPaths.length !== 42) failures.push(`Expected 42 canonical corridor pages after BMT deduplication, found ${corridorPaths.length}`);

for (const path of corridorPaths) {
  const countryCode = path.split("/")[1];
  const country = expectedCountry[countryCode];
  const html = renderResourceArticle(path, root, "https://www.canopuscare.com");
  const text = textFrom(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  if (!html) failures.push(`${path}: did not render`);
  if (words < 3500) failures.push(`${path}: only ${words} rendered words`);
  if (!html.includes('<meta name="robots" content="noindex,nofollow">')) failures.push(`${path}: corridor review gate is not noindex`);
  for (const heading of [
    `What changes when you travel from ${country}`,
    `The ${country} record-to-hospital workflow`,
    `Medical visa planning from ${country}`,
    "Payment planning",
    "Companion planning",
    "Your return-home handoff",
    "Frequently asked questions",
  ]) {
    if (!text.includes(heading)) failures.push(`${path}: missing ${heading}`);
  }
  if (!/Government of India official visa portal/i.test(text)) failures.push(`${path}: missing official visa source`);
  if (!/Canopus Care is a facilitator|It is not a hospital/i.test(text)) failures.push(`${path}: missing facilitator boundary`);
  if (/localisation status|high-conversion|keyword-intent|competitor-level|designed to be read with a caregiver|Fertility pages must be careful|transplant vertical|\/docs\/content-engine\/09_SOURCE_REGISTER\.md/i.test(text)) failures.push(`${path}: contains internal or audited boilerplate`);
  if (/(?:we|Canopus Care|the hospital) guarantees? (?:an? )?(?:outcome|visa|approval|cure)|best hospital|success rate of \d/i.test(text)) failures.push(`${path}: contains an unsupported claim pattern`);
}

console.log(JSON.stringify({ pages: corridorPaths.length, checks: "depth, country modules, sources, safety, review gate", failures }, null, 2));
if (failures.length) process.exitCode = 1;
