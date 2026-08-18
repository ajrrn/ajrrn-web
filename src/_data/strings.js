// Loads UI strings + site text for each language from src/content/<lang>/site.md
// (front matter).  Editors change wording there, not here.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import site from "./site.js";

const root = path.resolve("src/content");

export default function () {
  const out = {};
  for (const { code } of site.languages) {
    const file = path.join(root, code, "site.md");
    if (!fs.existsSync(file)) continue;
    const parsed = matter(fs.readFileSync(file, "utf8"));
    out[code] = { ...parsed.data, _body: parsed.content.trim() };
  }
  // Fall back to English for any missing key so a half-translated site still builds.
  const en = out[site.defaultLanguage] || {};
  for (const code of Object.keys(out)) {
    out[code] = { ...en, ...out[code], ui: { ...(en.ui || {}), ...(out[code].ui || {}) } };
  }
  return out;
}
