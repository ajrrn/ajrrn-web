// Site-wide settings.  Editors: most *text* lives in src/content/<lang>/site.md,
// not here.  This file holds structural settings (languages, hostnames, build mode).

const productionDomain = process.env.SITE_DOMAIN || "ajrrn.org";

const languages = [
  { code: "en", name: "English", dir: "ltr", dateLocale: "en-CA", host: productionDomain },
  { code: "fr", name: "Français", dir: "ltr", dateLocale: "fr-CA", host: `fr.${productionDomain}` },
  { code: "es", name: "Español", dir: "ltr", dateLocale: "es", host: `es.${productionDomain}` },
  { code: "ar", name: "العربية", dir: "rtl", dateLocale: "ar-u-nu-latn", host: `ar.${productionDomain}` },
];

/**
 * SITE_MODE controls how links are written into the HTML:
 *  - "path"      → /fr/about/  (local dev, branch preview deployments)
 *  - "subdomain" → https://fr.ajrrn.org/about/  (production, main branch)
 * The build output is identical in both modes (/en/, /fr/, ...); only the
 * hrefs differ.  The Cloudflare Worker maps hostnames to those directories.
 */
const mode = process.env.SITE_MODE || (process.env.WORKERS_CI_BRANCH === "main" ? "subdomain" : "path");

export default {
  name: "AJRRN",
  fullName: "Algorithmic Justice for Refugees Research Network",
  domain: productionDomain,
  languages,
  defaultLanguage: "en",
  mode,
  isProduction: mode === "subdomain",
  hostFor(code) {
    return languages.find((l) => l.code === code)?.host || productionDomain;
  },
  buildTime: new Date().toISOString(),
};
