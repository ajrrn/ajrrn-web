// Links that leave the site open in a new tab.
//
// Applied to every rendered HTML page by the "external-links" transform in
// eleventy.config.js, so content authors keep writing plain markdown links.
// A link is external when its href is an absolute http(s) URL whose host is
// not ajrrn.org or one of its subdomains. Root-relative links, #anchors,
// mailto: and tel: links are left alone, as is any <a> that already has a
// target attribute.

/** True if `href` is an http(s) URL pointing outside `domain` (and its subdomains). */
export function isExternal(href, domain) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  return host !== domain && !host.endsWith(`.${domain}`);
}

/** Add target="_blank" and rel="noopener" to every external <a> in `html`. */
export function openExternalLinksInNewTab(html, domain) {
  return html.replace(/<a\s[^>]*>/gi, (tag) => {
    const href = tag.match(/\shref="([^"]*)"/i);
    if (!href || !isExternal(href[1].replace(/&amp;/g, "&"), domain)) return tag;
    if (/\starget=/i.test(tag)) return tag;
    let out = tag;
    const rel = out.match(/\srel="([^"]*)"/i);
    if (rel) {
      const values = rel[1].split(/\s+/).filter(Boolean);
      if (!values.includes("noopener")) values.push("noopener");
      out = out.replace(rel[0], ` rel="${values.join(" ")}"`);
    } else {
      out = out.replace(/\s*>$/, ' rel="noopener">');
    }
    return out.replace(/\srel="/, ' target="_blank" rel="');
  });
}
