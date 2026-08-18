// Eleventy configuration for the AJRRN website.
// See docs/ARCHITECTURE.md for an overview of how the pieces fit together.

import site from "./src/_data/site.js";

const LANGS = site.languages.map((l) => l.code);
const LANG_RE = new RegExp(`^/(${LANGS.join("|")})(/|$)`);

// Content sections that are collections of items (one markdown file per item).
const ITEM_SECTIONS = [
  "news",
  "events",
  "publications",
  "opportunities",
  "projects",
  "people",
  "partners",
];

/** Split a filePathStem like "/en/news/2026-09-launch" into its parts. */
function parseStem(stem) {
  const parts = stem.split("/").filter(Boolean);
  const lang = LANGS.includes(parts[0]) ? parts[0] : null;
  const rest = lang ? parts.slice(1) : parts;
  const isHome = rest.length === 0 || (rest.length === 1 && rest[0] === "index");
  const section = isHome ? "home" : rest[0];
  const isIndex = isHome || rest[rest.length - 1] === "index";
  return { lang, section, isIndex, rest };
}

/**
 * Convert a built URL (always /<lang>/path/) into the href that should be
 * written into the HTML.  In "path" mode (local dev, preview deployments)
 * this is the identity.  In "subdomain" mode (production) the language
 * prefix is stripped, and links to *other* languages become absolute
 * URLs on the language's subdomain.
 */
function hrefFor(url, currentLang) {
  if (!url || typeof url !== "string") return url;
  if (/^(https?:)?\/\//.test(url) || url.startsWith("#") || url.startsWith("mailto:")) return url;
  if (site.mode !== "subdomain") return url;
  const m = url.match(LANG_RE);
  if (!m) return url; // e.g. /assets/...
  const lang = m[1];
  const path = url.slice(lang.length + 1) || "/";
  if (lang === currentLang) return path;
  return `https://${site.hostFor(lang)}${path}`;
}

/** Canonical (production) absolute URL for a built URL. */
function canonicalFor(url) {
  if (typeof url !== "string") return "";
  const m = url.match(LANG_RE);
  if (!m) return `https://${site.hostFor(site.defaultLanguage)}${url}`;
  const lang = m[1];
  const path = url.slice(lang.length + 1) || "/";
  return `https://${site.hostFor(lang)}${path}`;
}

export default function (eleventyConfig) {
  // Static assets are copied through untouched.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // Watch CSS/JS for changes during `npm run dev`.
  eleventyConfig.addWatchTarget("src/assets/");

  // Markdown: allow inline HTML, autolink URLs.
  eleventyConfig.amendLibrary("md", (md) => md.set({ html: true, linkify: true, breaks: false }));

  // ---- Global computed data -------------------------------------------------
  eleventyConfig.addGlobalData("eleventyComputed", {
    lang: (data) => data.lang || parseStem(data.page.filePathStem).lang || site.defaultLanguage,
    dir: (data) => {
      const l = data.lang || parseStem(data.page.filePathStem).lang || site.defaultLanguage;
      return site.languages.find((x) => x.code === l)?.dir || "ltr";
    },
    section: (data) => data.section || parseStem(data.page.filePathStem).section,
    isIndex: (data) => parseStem(data.page.filePathStem).isIndex,
    // What kind of page is this? Used by layouts/default.njk to pick a view.
    kind: (data) => {
      if (data.kind) return data.kind;
      const { section, isIndex } = parseStem(data.page.filePathStem);
      if (section === "home") return "home";
      if (ITEM_SECTIONS.includes(section)) return isIndex ? `list-${section}` : `item-${section}`;
      return "page";
    },
    // Key shared by all translations of the same page: the path without language.
    translationKey: (data) => data.page.filePathStem.replace(LANG_RE, "/").replace(/\/index$/, "/") || "/",
    // site.md and navigation.md hold data only; never build them as pages.
    permalink: (data) => {
      // Eleventy pre-populates permalink with "" when nothing was set.
      if (data.permalink !== undefined && data.permalink !== "") return data.permalink;
      if (/^\/[a-z]{2}\/(site|navigation)$/.test(data.page.filePathStem)) return false;
      return undefined; // Eleventy default: /<stem>/index.html
    },
    eleventyExcludeFromCollections: (data) =>
      data.eleventyExcludeFromCollections || /^\/[a-z]{2}\/(site|navigation)$/.test(data.page.filePathStem),
  });

  // site.md and navigation.md hold data only (read by src/_data/*.js); never build them as pages.
  eleventyConfig.ignores.add("src/content/*/site.md");
  eleventyConfig.ignores.add("src/content/*/navigation.md");

  // People and partners are listed on their section page and link outward
  // (`link:`); they do not get pages of their own.
  eleventyConfig.addPreprocessor("no-standalone-people-partners", "md", (data) => {
    const stem = (data.page?.inputPath || "").replace(/^\.?\/?src\/content/, "").replace(/\.md$/, "");
    const { section, isIndex, lang } = parseStem(stem);
    if (lang && !isIndex && (section === "people" || section === "partners") && !data.permalink) {
      data.permalink = false;
    }
  });

  // Every markdown page uses the dispatching layout unless it says otherwise.
  eleventyConfig.addGlobalData("layout", "layouts/default.njk");

  // ---- Collections ----------------------------------------------------------
  for (const section of ITEM_SECTIONS) {
    eleventyConfig.addCollection(section, (api) =>
      api
        .getAll()
        .filter((item) => {
          const p = parseStem(item.filePathStem);
          return p.lang && p.section === section && !p.isIndex && !item.data.draft;
        })
        .sort((a, b) => {
          // Explicit `order` wins; otherwise newest first by date.
          const ao = a.data.order ?? Number.POSITIVE_INFINITY;
          const bo = b.data.order ?? Number.POSITIVE_INFINITY;
          if (ao !== bo) return ao - bo;
          return (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0);
        })
    );
  }

  // Map translationKey -> { lang -> page } used by the language switcher.
  eleventyConfig.addCollection("translations", (api) => {
    const map = {};
    for (const item of api.getAll()) {
      const key = item.data.translationKey;
      const lang = item.data.lang;
      if (!key || !lang || !item.url) continue;
      map[key] ??= {};
      map[key][lang] = { url: item.url, title: item.data.title };
    }
    return map;
  });

  // ---- Link rewriting -------------------------------------------------------
  // Content authors write language-root-relative links in markdown ("/about/").
  // This transform turns every root-relative href/src in the rendered HTML into
  // the right form for the build mode (see hrefFor).  Links written with an
  // explicit language ("/fr/about/") are treated as cross-language links.
  eleventyConfig.addTransform("rewrite-links", function (content) {
    const out = this.page?.outputPath || "";
    if (typeof out !== "string" || !out.endsWith(".html")) return content;
    const m = out.match(/[\\/]_site[\\/]([a-z]{2})[\\/]/);
    const lang = m && LANGS.includes(m[1]) ? m[1] : site.defaultLanguage;
    return content.replace(/\b(href|src)="(\/[^"]*)"/g, (all, attr, url) => {
      if (url.startsWith("//") || url.startsWith("/assets/")) return all;
      const withLang = LANG_RE.test(url) ? url : `/${lang}${url}`;
      return `${attr}="${hrefFor(withLang, lang)}"`;
    });
  });

  // ---- Filters --------------------------------------------------------------
  eleventyConfig.addFilter("href", hrefFor);
  eleventyConfig.addFilter("canonical", canonicalFor);
  eleventyConfig.addFilter("byLang", (arr, lang) => (arr || []).filter((i) => i.data.lang === lang));
  eleventyConfig.addFilter("where", (arr, key, value) => (arr || []).filter((i) => i.data[key] === value));
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("upcoming", (arr, now = new Date()) =>
    (arr || [])
      .filter((i) => {
        const end = i.data.end ? new Date(i.data.end) : i.date;
        return end && end.getTime() >= now.getTime() - 24 * 3600 * 1000;
      })
      .sort((a, b) => a.date - b.date)
  );
  eleventyConfig.addFilter("past", (arr, now = new Date()) =>
    (arr || []).filter((i) => {
      const end = i.data.end ? new Date(i.data.end) : i.date;
      return !end || end.getTime() < now.getTime() - 24 * 3600 * 1000;
    })
  );
  eleventyConfig.addFilter("localeDate", (value, lang, style = "long") => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    const locale = site.languages.find((l) => l.code === lang)?.dateLocale || lang || "en";
    const opts =
      style === "short"
        ? { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }
        : style === "month"
          ? { year: "numeric", month: "long", timeZone: "UTC" }
          : { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" };
    return new Intl.DateTimeFormat(locale, opts).format(d);
  });
  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  });
  eleventyConfig.addFilter("langName", (code) => site.languages.find((l) => l.code === code)?.name || code);
  eleventyConfig.addFilter("startsWith", (s, prefix) => typeof s === "string" && s.startsWith(prefix));
  eleventyConfig.addFilter("keys", (obj) => Object.keys(obj || {}));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  // Human-readable form of a URL for link text: no scheme, no trailing slash, shortened.
  eleventyConfig.addFilter("displayUrl", (url, max = 48) => {
    if (typeof url !== "string") return url;
    let text = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (text.length > max) text = text.slice(0, max - 1) + "…";
    return text;
  });

  // Navigation helpers (kept in JS because Nunjucks `set` does not escape loops).
  const inItem = (item, pageUrl, home) => {
    if (!item || !pageUrl) return false;
    if (pageUrl === item.url) return true;
    if (item.url && item.url !== home && pageUrl.startsWith(item.url)) return true;
    return (item.children || []).some((c) => inItem(c, pageUrl, home));
  };
  eleventyConfig.addFilter("isActive", (item, pageUrl, lang) => inItem(item, pageUrl, `/${lang}/`));
  eleventyConfig.addFilter("sectionFor", (items, pageUrl, lang) =>
    (items || []).find((item) => item.children && inItem(item, pageUrl, `/${lang}/`)) || null
  );

  return {
    dir: {
      input: "src/content",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
