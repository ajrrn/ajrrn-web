// Take screenshots of key pages at phone / tablet / desktop widths.
// Usage: npm run build && node scripts/screenshots.js [baseUrl] [outDir]
// Serves ./_site through the real Worker (Miniflare) unless a baseUrl is given.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

const outDir = process.argv[3] || "screenshots";
const pages = (process.env.PAGES || "/,/about/,/people/,/projects/,/events/,/news/,/opportunities/,/contact/,/privacy/,/nope/").split(",");
const langs = (process.env.LANGS || "en,fr,es,ar").split(",");
const viewports = {
  phone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 2 },
  desktop: { width: 1366, height: 900 },
};

let mf;
let baseUrl = process.argv[2];
if (!baseUrl) {
  mf = new Miniflare(
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
      port: 8799,
      assets: {
        directory: "./_site",
        binding: "ASSETS",
        run_worker_first: ["/*", "!/assets/*"],
        routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: true },
        assetConfig: { html_handling: "auto-trailing-slash", not_found_handling: "none" },
      },
    })
  );
  baseUrl = (await mf.ready).toString().replace(/\/$/, "");
}

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const problems = [];
for (const [name, vp] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor || 1, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
  const page = await context.newPage();
  let currentUrl = "";
  page.on("console", (msg) => {
    // A 404 page legitimately logs a 404 for itself.
    if (msg.type() === "error" && !currentUrl.endsWith("/nope/")) problems.push(`${name} console at ${currentUrl}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`${name} pageerror: ${err.message}`));
  for (const lang of langs) {
    for (const p of pages) {
      const url = `${baseUrl}/${lang}${p}`;
      currentUrl = url;
      const res = await page.goto(url, { waitUntil: "networkidle" });
      const status = res ? res.status() : 0;
      if (status !== 200 && !(p === "/nope/" && status === 404)) problems.push(`${status} ${url}`);
      // Horizontal overflow check: page must never scroll sideways.
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) problems.push(`horizontal overflow ${overflow}px at ${name} ${url}`);
      const file = path.join(outDir, `${lang}${p.replace(/\//g, "_") || "_"}-${name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      // Also capture the open mobile menu once per language.
      if (name === "phone" && p === "/") {
        await page.click(".nav-toggle");
        await page.screenshot({ path: path.join(outDir, `${lang}_menu-${name}.png`) });
      }
    }
  }
  await context.close();
}
await browser.close();
if (mf) await mf.dispose();
if (problems.length) {
  console.error("Problems found:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`Screenshots written to ${outDir}/`);
