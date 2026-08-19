// Integration test: runs the real Worker in Miniflare (bundled with wrangler)
// against the built site in ./_site, and exercises production hostnames and
// preview hostnames.  Run `npm run build` first (npm run check does this).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

const built = fs.existsSync(path.resolve("_site/en/index.html"));
const skip = built ? false : "run `npm run build` first";

// Mirrors wrangler.jsonc.  (convertV4MiniflareOptions keeps this readable
// across Miniflare's v4/v5 option shapes.)
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
    assets: {
      directory: "./_site",
      binding: "ASSETS",
      run_worker_first: ["/*", "!/assets/*"],
      routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: true },
      assetConfig: { html_handling: "auto-trailing-slash", not_found_handling: "none" },
    },
  })
);

const get = (url) => mf.dispatchFetch(url, { redirect: "manual" });

test.after(async () => {
  await mf.dispose();
});

test("integration: production apex serves the English home page", { skip }, async () => {
  const res = await get("https://ajrrn.org/");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<html lang="en"/);
  assert.match(html, /Algorithmic Justice for Refugees/);
  assert.equal(res.headers.get("x-frame-options"), "DENY");
});

test("integration: language subdomain serves that language", { skip }, async () => {
  const res = await get("https://fr.ajrrn.org/about/");
  assert.equal(res.status, 200);
  assert.match(await res.text(), /<html lang="fr"/);
  const ar = await get("https://ar.ajrrn.org/");
  assert.equal(ar.status, 200);
  assert.match(await ar.text(), /<html lang="ar" dir="rtl"/);
});

test("integration: trailing-slash redirect keeps the public URL form", { skip }, async () => {
  const res = await get("https://fr.ajrrn.org/about");
  assert.ok([301, 307, 308].includes(res.status), `status ${res.status}`);
  assert.equal(res.headers.get("location"), "https://fr.ajrrn.org/about/");
});

test("integration: language prefix on production host redirects to subdomain", { skip }, async () => {
  const res = await get("https://ajrrn.org/es/projects/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://es.ajrrn.org/projects/");
});

test("integration: old events list redirects to news & events", { skip }, async () => {
  const res = await get("https://es.ajrrn.org/events/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://es.ajrrn.org/news/");
});

test("integration: www redirects to apex", { skip }, async () => {
  const res = await get("https://www.ajrrn.org/news/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://ajrrn.org/news/");
});

test("integration: shared assets served on every host", { skip }, async () => {
  for (const host of ["ajrrn.org", "fr.ajrrn.org", "x-ajrrn-web.acct.workers.dev"]) {
    const res = await get(`https://${host}/assets/css/site.css`);
    assert.equal(res.status, 200, host);
    assert.match(res.headers.get("content-type") || "", /text\/css/);
  }
});

test("integration: 404 uses the language's 404 page with a 404 status", { skip }, async () => {
  const en = await get("https://ajrrn.org/does-not-exist/");
  assert.equal(en.status, 404);
  assert.match(await en.text(), /<html lang="en"/);
  const fr = await get("https://fr.ajrrn.org/does-not-exist/");
  assert.equal(fr.status, 404);
  assert.match(await fr.text(), /<html lang="fr"/);
});

test("integration: preview host uses path-based languages", { skip }, async () => {
  const root = await get("https://abc-ajrrn-web.acct.workers.dev/");
  assert.equal(root.status, 302);
  assert.equal(root.headers.get("location"), "https://abc-ajrrn-web.acct.workers.dev/en/");
  const fr = await get("https://abc-ajrrn-web.acct.workers.dev/fr/about/");
  assert.equal(fr.status, 200);
  assert.match(await fr.text(), /<html lang="fr"/);
  const slash = await get("https://abc-ajrrn-web.acct.workers.dev/fr/about");
  assert.ok([301, 307, 308].includes(slash.status));
  assert.equal(slash.headers.get("location"), "https://abc-ajrrn-web.acct.workers.dev/fr/about/");
});

test("integration: sitemap and robots are per language", { skip }, async () => {
  const sm = await get("https://es.ajrrn.org/sitemap.xml");
  assert.equal(sm.status, 200);
  assert.match(await sm.text(), /<loc>https:\/\/es\.ajrrn\.org\//);
  const rb = await get("https://ajrrn.org/robots.txt");
  assert.equal(rb.status, 200);
});
