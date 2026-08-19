import test from "node:test";
import assert from "node:assert/strict";
import { resolve, languageForHost, publicLocation } from "../worker/router.js";

const u = (s) => new URL(s);

test("languageForHost maps production hostnames", () => {
  assert.equal(languageForHost("ajrrn.org"), "en");
  assert.equal(languageForHost("fr.ajrrn.org"), "fr");
  assert.equal(languageForHost("AR.ajrrn.org"), "ar");
  assert.equal(languageForHost("ajrrn-web.foo.workers.dev"), null);
  assert.equal(languageForHost("localhost"), null);
});

test("production apex serves English directory", () => {
  assert.deepEqual(resolve(u("https://ajrrn.org/")), { type: "asset", path: "/en/", lang: "en" });
  assert.deepEqual(resolve(u("https://ajrrn.org/about/")), { type: "asset", path: "/en/about/", lang: "en" });
});

test("production language subdomains serve their directory", () => {
  assert.deepEqual(resolve(u("https://fr.ajrrn.org/")), { type: "asset", path: "/fr/", lang: "fr" });
  assert.deepEqual(resolve(u("https://es.ajrrn.org/events/x/")), { type: "asset", path: "/es/events/x/", lang: "es" });
  assert.deepEqual(resolve(u("https://ar.ajrrn.org/sitemap.xml")), { type: "asset", path: "/ar/sitemap.xml", lang: "ar" });
});

test("shared assets are served from the root on any host", () => {
  assert.deepEqual(resolve(u("https://fr.ajrrn.org/assets/css/site.css")), { type: "asset", path: "/assets/css/site.css", lang: null });
  assert.deepEqual(resolve(u("https://x.workers.dev/assets/img/a.png")), { type: "asset", path: "/assets/img/a.png", lang: null });
});

test("language prefixes on production hosts redirect to the subdomain", () => {
  assert.deepEqual(resolve(u("https://ajrrn.org/fr/about/")), { type: "redirect", status: 301, location: "https://fr.ajrrn.org/about/" });
  assert.deepEqual(resolve(u("https://ajrrn.org/en/about/?a=1")), { type: "redirect", status: 301, location: "https://ajrrn.org/about/?a=1" });
  assert.deepEqual(resolve(u("https://fr.ajrrn.org/fr/")), { type: "redirect", status: 301, location: "https://fr.ajrrn.org/" });
  assert.deepEqual(resolve(u("https://fr.ajrrn.org/es")), { type: "redirect", status: 301, location: "https://es.ajrrn.org/" });
});

test("moved paths redirect to their new location (events list -> news & events)", () => {
  assert.deepEqual(resolve(u("https://ajrrn.org/events/")), { type: "redirect", status: 301, location: "https://ajrrn.org/news/" });
  assert.deepEqual(resolve(u("https://fr.ajrrn.org/events")), { type: "redirect", status: 301, location: "https://fr.ajrrn.org/news/" });
  assert.deepEqual(resolve(u("https://ajrrn.org/es/events/?a=1")), { type: "redirect", status: 301, location: "https://es.ajrrn.org/news/?a=1" });
  assert.deepEqual(resolve(u("http://localhost:8787/ar/events/")), { type: "redirect", status: 301, location: "/ar/news/" });
  assert.deepEqual(resolve(u("http://localhost:8787/events/")), { type: "redirect", status: 301, location: "/en/news/" });
  // Event pages themselves have not moved.
  assert.deepEqual(resolve(u("https://ajrrn.org/events/2026-09-22-network-launch/")), { type: "asset", path: "/en/events/2026-09-22-network-launch/", lang: "en" });
});

test("www redirects to apex", () => {
  assert.deepEqual(resolve(u("https://www.ajrrn.org/news/?x=y")), { type: "redirect", status: 301, location: "https://ajrrn.org/news/?x=y" });
});

test("preview hosts use path-based languages", () => {
  assert.deepEqual(resolve(u("https://abc-ajrrn-web.foo.workers.dev/")), { type: "redirect", status: 302, location: "/en/" });
  assert.deepEqual(resolve(u("http://localhost:8787/fr/about/")), { type: "asset", path: "/fr/about/", lang: "fr" });
  assert.deepEqual(resolve(u("http://localhost:8787/about/")), { type: "asset", path: "/en/about/", lang: "en" });
});

test("two-letter non-language prefixes are not treated as languages", () => {
  assert.deepEqual(resolve(u("https://ajrrn.org/de/")), { type: "asset", path: "/en/de/", lang: "en" });
});

test("publicLocation strips the language prefix on production hosts", () => {
  assert.equal(publicLocation("/fr/about/", u("https://fr.ajrrn.org/about")), "https://fr.ajrrn.org/about/");
  assert.equal(publicLocation("https://fr.ajrrn.org/fr/about/?q=1", u("https://fr.ajrrn.org/about?q=1")), "https://fr.ajrrn.org/about/?q=1");
  assert.equal(publicLocation("/en/about/", u("https://ajrrn.org/about")), "https://ajrrn.org/about/");
  // Preview: paths are already public.
  assert.equal(publicLocation("/fr/about/", u("http://localhost:8787/fr/about")), "/fr/about/");
});
