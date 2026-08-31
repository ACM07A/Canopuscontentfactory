import { readFileSync } from "node:fs";

const baseUrl = process.env.RESOURCE_AUDIT_BASE_URL || "http://127.0.0.1:5173";
const articles = JSON.parse(readFileSync("content/generated_resource_articles.json", "utf8"));
const scaffoldLeak = /this page is for|page for compliant|content brief|localisation status|deep planning workbook/i;

const rows = await Promise.all(articles.map(async (article) => {
  const response = await fetch(`${baseUrl}${article.slug}`);
  const html = await response.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .trim();

  return {
    slug: article.slug,
    type: article.type,
    status: response.status,
    words: text.split(/\s+/).length,
    indexable: html.includes('name="robots" content="index,follow'),
    internalNavLeak: html.includes(">Demo</a>"),
    scaffoldLeak: scaffoldLeak.test(text),
  };
}));

const minimumWords = {
  canonical_treatment: 3000,
  tool: 750,
  b2b_icp: 1700,
  corridor_treatment_candidate: 3500,
};

const failures = rows.filter((row) => (
  row.status !== 200
  || (row.type === "corridor_treatment_candidate" ? row.indexable : !row.indexable)
  || row.internalNavLeak
  || row.scaffoldLeak
  || row.words < minimumWords[row.type]
));

const sorted = [...rows].sort((a, b) => a.words - b.words);
console.log(JSON.stringify({
  pages: rows.length,
  failures: failures.length,
  shortest: sorted[0],
  longest: sorted.at(-1),
}, null, 2));

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
