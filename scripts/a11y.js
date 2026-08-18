// Automated accessibility audit: loads every built page (all languages) in
// headless Chromium and runs axe-core (WCAG 2.1 A/AA rules).  Fails on any
// violation.  Automated checks catch only part of accessibility problems;
// see docs/DESIGN.md for the manual checklist.
// Usage: npm run build && node scripts/a11y.js
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import site from "../src/_data/site.js";

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

// Collect page URLs from the build.
const root = path.resolve("_site");
const pages = [];
for (const { code } of site.languages) {
  const dir = path.join(root, code);
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html" || e.name === "404.html") {
        const rel = path.relative(root, p).replace(/\\/g, "/").replace(/index\.html$/, "");
        pages.push("/" + rel);
      }
    }
  };
  walk(dir);
}

const mf = new Miniflare(
  convertV4MiniflareOptions({
    name: "ajrrn-web",
    modulesRoot: ".",
    modules: [
      { type: "ESModule", path: "worker/index.js" },
      { type: "ESModule", path: "worker/router.js" },
    ],
    compatibilityDate: "2026-08-01",
    compatibilityFlags: ["nodejs_compat"],
    bindings: { SITE_DOMAIN: "ajrrn.org" },
    port: 8798,
    assets: {
      directory: "./_site",
      binding: "ASSETS",
      run_worker_first: ["/*", "!/assets/*"],
      routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: true },
      assetConfig: { html_handling: "auto-trailing-slash", not_found_handling: "none" },
    },
  })
);
const baseUrl = (await mf.ready).toString().replace(/\/$/, "");

const browser = await chromium.launch();
const results = { pages: 0, violations: [] };
for (const [label, viewport] of [["desktop", { width: 1366, height: 900 }], ["phone", { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport, bypassCSP: true });
  const page = await context.newPage();
  for (const p of pages) {
    await page.goto(baseUrl + p, { waitUntil: "load" });
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () =>
      window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } })
    );
    results.pages++;
    for (const v of res.violations) {
      results.violations.push({ page: `${label} ${p}`, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) });
    }
    if (label === "phone") {
      // Also audit with the mobile menu open.
      await page.click(".nav-toggle");
      const res2 = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } }));
      for (const v of res2.violations) results.violations.push({ page: `${label}+menu ${p}`, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) });
    }
  }
  await context.close();
}
await browser.close();
await mf.dispose();

if (results.violations.length) {
  console.error(`a11y: ${results.violations.length} violation(s) on ${results.pages} page loads`);
  for (const v of results.violations) console.error(`  [${v.impact}] ${v.id} — ${v.help}\n     ${v.page}\n     ${v.nodes.join(" | ")}`);
  process.exit(1);
}
console.log(`a11y: OK — ${results.pages} page loads audited with axe-core, no violations`);
