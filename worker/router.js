/**
 * Pure routing logic for the AJRRN Worker (no Cloudflare APIs, so it can be
 * unit-tested with plain Node).
 *
 * The build output has one directory per language: /en/, /fr/, /es/, /ar/,
 * plus shared /assets/.  This module decides, for an incoming request, whether
 * to redirect or which asset path to serve.
 *
 *  Production (custom domains):
 *    ajrrn.org/about/        -> asset /en/about/
 *    fr.ajrrn.org/about/     -> asset /fr/about/
 *    ajrrn.org/fr/about/     -> 301 https://fr.ajrrn.org/about/
 *    ajrrn.org/en/about/     -> 301 https://ajrrn.org/about/
 *    www.ajrrn.org/x         -> 301 https://ajrrn.org/x
 *
 *  Preview / local (any other hostname, e.g. *.workers.dev, localhost):
 *    host/                   -> 302 /en/
 *    host/fr/about/          -> asset /fr/about/
 *
 *  Any host:
 *    /assets/...             -> asset as-is
 */

export const DEFAULT_CONFIG = {
  domain: "ajrrn.org",
  defaultLanguage: "en",
  languages: ["en", "fr", "es", "ar"],
  // Paths that are language-independent and served from the root of the build.
  sharedPrefixes: ["/assets/"],
};

/** Map hostname -> language code, or null if this is not a production hostname. */
export function languageForHost(hostname, config = DEFAULT_CONFIG) {
  const host = hostname.toLowerCase();
  if (host === config.domain) return config.defaultLanguage;
  for (const lang of config.languages) {
    if (host === `${lang}.${config.domain}`) return lang;
  }
  return null;
}

function langPrefix(pathname, config) {
  const m = pathname.match(/^\/([a-z]{2})(\/|$)/);
  if (m && config.languages.includes(m[1])) {
    return { lang: m[1], rest: pathname.slice(m[1].length + 1) || "/" };
  }
  return null;
}

/**
 * Decide what to do with a request.
 * @param {URL} url
 * @param {object} config
 * @returns {{type:"redirect", status:number, location:string} | {type:"asset", path:string, lang:string|null}}
 */
export function resolve(url, config = DEFAULT_CONFIG) {
  const hostname = url.hostname.toLowerCase();
  let pathname = url.pathname;
  const search = url.search || "";

  // Collapse duplicate slashes.
  if (/\/\//.test(pathname)) pathname = pathname.replace(/\/{2,}/g, "/");

  // www -> apex.
  if (hostname === `www.${config.domain}`) {
    return { type: "redirect", status: 301, location: `https://${config.domain}${pathname}${search}` };
  }

  // Shared, language-independent files.
  if (config.sharedPrefixes.some((p) => pathname.startsWith(p))) {
    return { type: "asset", path: pathname, lang: null };
  }

  const hostLang = languageForHost(hostname, config);
  const prefixed = langPrefix(pathname, config);

  if (hostLang) {
    // Production: a language prefix in the path is redundant -> canonicalise.
    if (prefixed) {
      const targetHost = prefixed.lang === config.defaultLanguage ? config.domain : `${prefixed.lang}.${config.domain}`;
      return { type: "redirect", status: 301, location: `https://${targetHost}${prefixed.rest}${search}` };
    }
    return { type: "asset", path: `/${hostLang}${pathname}`, lang: hostLang };
  }

  // Preview / local: language lives in the path.
  if (prefixed) {
    return { type: "asset", path: pathname, lang: prefixed.lang };
  }
  if (pathname === "/" || pathname === "") {
    return { type: "redirect", status: 302, location: `/${config.defaultLanguage}/${search}` };
  }
  // Unprefixed path on a preview host: try the default language.
  return { type: "asset", path: `/${config.defaultLanguage}${pathname}`, lang: config.defaultLanguage };
}

/**
 * Rewrite a Location header produced by the asset server (which knows only the
 * /<lang>/... paths) into the public form for this request.
 */
export function publicLocation(location, requestUrl, config = DEFAULT_CONFIG) {
  if (!location) return location;
  let loc;
  try {
    loc = new URL(location, requestUrl);
  } catch {
    return location;
  }
  const hostLang = languageForHost(requestUrl.hostname, config);
  if (!hostLang) return loc.pathname + loc.search; // preview: paths already public
  const prefixed = langPrefix(loc.pathname, config);
  if (prefixed && prefixed.lang === hostLang) {
    return `https://${requestUrl.hostname}${prefixed.rest}${loc.search}`;
  }
  return loc.pathname + loc.search;
}
