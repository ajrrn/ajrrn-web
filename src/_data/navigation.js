// Loads menus for each language from src/content/<lang>/navigation.md (front matter).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import site from "./site.js";

const root = path.resolve("src/content");

export default function () {
  const out = {};
  for (const { code } of site.languages) {
    const file = path.join(root, code, "navigation.md");
    if (!fs.existsSync(file)) continue;
    const parsed = matter(fs.readFileSync(file, "utf8"));
    // Prefix every relative url with the language so it matches built URLs.
    const prefix = (items) =>
      (items || []).map((item) => ({
        ...item,
        url: item.url && item.url.startsWith("/") ? `/${code}${item.url === "/" ? "/" : item.url}` : item.url,
        children: prefix(item.children),
      }));
    out[code] = { main: prefix(parsed.data.main), footer: prefix(parsed.data.footer) };
  }
  return out;
}
