import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getResourceArticlePaths, renderResourceArticle } from "../server/resource_pages.mjs";

const output = resolve(process.argv[2] || "outputs/canopus-content-review-articles.json");
const root = resolve(".");
const generated = JSON.parse(readFileSync("content/generated_resource_articles.json", "utf8"));
const generatedBySlug = new Map(generated.map((article) => [article.slug, article]));

function decode(value = "") {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryFor(path) {
  if (path.startsWith("/resources/")) return "Resource";
  if (path.startsWith("/partners/")) return "Partner";
  const key = path.split("/")[2] || "Treatment";
  return ({
    orthopaedics: "Orthopaedics",
    cardiac: "Cardiac",
    oncology: "Oncology",
    transplant: "Transplant",
    "spine-neurosurgery": "Spine and Neurosurgery",
    fertility: "Fertility",
    urology: "Urology",
    bariatric: "Bariatric",
    ophthalmology: "Ophthalmology",
  })[key] || "Treatment";
}

const articles = getResourceArticlePaths().map((slug) => {
  const html = renderResourceArticle(slug, root, "https://www.canopuscare.com");
  const generatedArticle = generatedBySlug.get(slug);
  const title = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || generatedArticle?.title || slug);
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || generatedArticle?.description || "Canopus Care review page");
  const articleHtml = html.match(/<article\b[^>]*class="[^"]*\barticle\b[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] || html;
  const excludedSections = new Set(["on this page", "get current hospital responses", "medical and planning sources"]);
  const sections = [...articleHtml.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
    .map((match) => decode(match[1]))
    .filter((section) => section && !excludedSections.has(section.toLowerCase()));
  const words = decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")).split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title,
    category: generatedArticle?.category || categoryFor(slug),
    type: generatedArticle?.type || "canonical_treatment",
    description,
    sections,
    words,
    html,
  };
});

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`Exported ${articles.length} review pages to ${output}`);
