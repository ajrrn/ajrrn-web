/**
 * AJRRN website Worker.
 *
 * Serves the static site built by Eleventy (in ./_site) and maps language
 * subdomains (fr.ajrrn.org, ...) to language directories (/fr/, ...).
 * All routing decisions live in ./router.js so they can be unit-tested.
 */
import { resolve, publicLocation, DEFAULT_CONFIG } from "./router.js";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
};

function withHeaders(response, extra = {}) {
  const res = new Response(response.body, response);
  for (const [k, v] of Object.entries({ ...SECURITY_HEADERS, ...extra })) res.headers.set(k, v);
  return res;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const config = { ...DEFAULT_CONFIG, domain: env.SITE_DOMAIN || DEFAULT_CONFIG.domain };
    const decision = resolve(url, config);

    if (decision.type === "redirect") {
      // Response.redirect() requires an absolute URL.
      return withHeaders(Response.redirect(new URL(decision.location, url).toString(), decision.status));
    }

    // Ask the static asset binding for the resolved path.
    const assetUrl = new URL(request.url);
    assetUrl.pathname = decision.path;
    let response = await env.ASSETS.fetch(new Request(assetUrl.toString(), request));

    // The asset server may redirect (e.g. to add a trailing slash) using the
    // internal /<lang>/ path; translate that into the public URL.
    if (response.status >= 300 && response.status < 400 && response.headers.has("Location")) {
      const location = publicLocation(response.headers.get("Location"), url, config);
      return withHeaders(Response.redirect(new URL(location, url).toString(), response.status));
    }

    // Language-aware 404 page.
    if (response.status === 404 && decision.lang) {
      const nf = new URL(request.url);
      nf.pathname = `/${decision.lang}/404.html`;
      const nfRes = await env.ASSETS.fetch(new Request(nf.toString(), { headers: request.headers }));
      if (nfRes.ok) {
        return withHeaders(new Response(nfRes.body, { status: 404, headers: nfRes.headers }));
      }
    }

    return withHeaders(response);
  },
};
