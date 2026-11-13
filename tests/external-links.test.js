import test from "node:test";
import assert from "node:assert/strict";
import { isExternal, openExternalLinksInNewTab } from "../src/_lib/external-links.js";

const D = "ajrrn.org";
const run = (html) => openExternalLinksInNewTab(html, D);

test("isExternal: other sites are external; ajrrn.org and its subdomains are not", () => {
  assert.equal(isExternal("https://www.migrationtechmonitor.com/", D), true);
  assert.equal(isExternal("http://example.com", D), true);
  assert.equal(isExternal("https://ajrrn.org/about/", D), false);
  assert.equal(isExternal("https://fr.ajrrn.org/about/", D), false);
  assert.equal(isExternal("https://notajrrn.org/", D), true);
  assert.equal(isExternal("/about/", D), false);
  assert.equal(isExternal("#main", D), false);
  assert.equal(isExternal("mailto:info@example.org", D), false);
});

test("external links get target=_blank and rel=noopener", () => {
  assert.equal(
    run('<a href="https://example.com/">x</a>'),
    '<a href="https://example.com/" target="_blank" rel="noopener">x</a>'
  );
});

test("an existing rel is kept and noopener added once", () => {
  assert.equal(
    run('<a href="https://example.com/" rel="me">x</a>'),
    '<a href="https://example.com/" target="_blank" rel="me noopener">x</a>'
  );
  assert.equal(
    run('<a rel="noopener" href="https://example.com/">x</a>'),
    '<a target="_blank" rel="noopener" href="https://example.com/">x</a>'
  );
});

test("internal links, anchors, mailto and links with a target are unchanged", () => {
  for (const html of [
    '<a href="/en/about/">x</a>',
    '<a href="https://fr.ajrrn.org/">x</a>',
    '<a href="#main">x</a>',
    '<a href="mailto:a@example.org">x</a>',
    '<a href="https://example.com/" target="_self">x</a>',
    '<a class="item-title">x</a>',
  ]) {
    assert.equal(run(html), html);
  }
});

test("URLs with &amp; in the query are handled", () => {
  assert.match(run('<a href="https://example.com/?a=1&amp;b=2">x</a>'), /target="_blank"/);
});
