// Checks that every internal link, image, stylesheet and script referenced in
// the built site (_site) points at a file that exists in the build.  Also checks
// that every English page has a counterpart in every other language.
// Usage: npm run build && node scripts/check-links.js
import fs from "node:fs";
import path from "node:path";
import site from "../src/_data/site.js";

const root = path.resolve("_site");
const langs = site.languages.map((l) => l.code);
const problems = [];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function existsInBuild(urlPath) {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]);
  const candidates = [clean, path.join(clean, "index.html"), `${clean}.html`];
  return candidates.some((c) => {
    const full = path.join(root, c);
    return fs.existsSync(full) && (fs.statSync(full).isFile() || fs.existsSync(path.join(full, "index.html")));
  });
}

const htmlFiles = [...walk(root)].filter((f) => f.endsWith(".html"));
const attrRe = /\b(?:href|src)="([^"]+)"/g;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const m of html.matchAll(attrRe)) {
    let url = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
    if (url.startsWith("//")) continue;
    // In production ("subdomain") builds, internal links are language-root
    // relative; map them back to the build directory of the page's language.
    if (site.mode === "subdomain" && !url.startsWith("/assets/")) {
      const lang = path.relative(root, file).split(path.sep)[0];
      if (!url.startsWith("/")) url = "/" + url;
      url = `/${lang}${url}`;
    }
    if (!url.startsWith("/")) url = path.posix.join(path.posix.dirname("/" + path.relative(root, file)), url);
    if (!existsInBuild(url)) problems.push(`${path.relative(root, file)} -> ${m[1]} (missing)`);
  }
}

// Every English page should exist in every language (same relative path).
const enPages = htmlFiles.filter((f) => path.relative(root, f).startsWith("en" + path.sep)).map((f) => path.relative(path.join(root, "en"), f));
for (const lang of langs) {
  if (lang === "en") continue;
  for (const rel of enPages) {
    if (!fs.existsSync(path.join(root, lang, rel))) problems.push(`missing translation: ${lang}/${rel}`);
  }
}

// Every page should declare its language and direction.
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const lang = path.relative(root, file).split(path.sep)[0];
  if (!langs.includes(lang)) continue;
  if (!html.includes(`<html lang="${lang}"`)) problems.push(`${path.relative(root, file)}: <html lang> is not "${lang}"`);
  const dir = site.languages.find((l) => l.code === lang).dir;
  if (!html.includes(`dir="${dir}"`)) problems.push(`${path.relative(root, file)}: dir is not "${dir}"`);
}

if (problems.length) {
  console.error(`check-links: ${problems.length} problem(s)\n` + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log(`check-links: OK (${htmlFiles.length} pages checked, ${langs.length} languages)`);
