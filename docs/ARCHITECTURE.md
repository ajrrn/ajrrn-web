# Architecture

## In one paragraph

Markdown in `src/content/<lang>/` is built by **Eleventy** into static HTML in
`_site/<lang>/` (plus shared `_site/assets/`). A small **Cloudflare Worker**
(`worker/`) sits in front of those static files and decides which language
folder to serve from, based on the hostname (`fr.ajrrn.org` → `/fr/`). Cloudflare
**Workers Builds** watches the GitHub repository: branches become preview
deployments, `main` becomes production.

```
GitHub repo ──push──▶ Cloudflare Workers Builds
                        │  npm ci; npm run build (Eleventy) ; wrangler deploy / versions upload
                        ▼
                Worker "ajrrn-web"  +  static assets (_site/)
                        │
      ┌─────────────────┼──────────────────────┬─────────────────────┐
  ajrrn.org        fr.ajrrn.org           es.ajrrn.org          ar.ajrrn.org
  → /en/…          → /fr/…                → /es/…               → /ar/…
                       *.workers.dev preview: /en/… /fr/… /es/… /ar/…
```

## Build (Eleventy)

- Input directory: `src/content`. Output: `_site`. Config: `eleventy.config.js`.
- Every markdown file becomes a page at `/<lang>/<path>/`. The language is
  derived from the first folder. Nothing needs to be declared per file.
- `layouts/default.njk` picks a view from the computed `kind` of a page:
  `home`, `page`, `list-<section>`, `item-<section>`, `notfound`. Content
  files never need to name a layout (they can override with `layout:` or
  `kind:` if ever needed).
- Collections (`news`, `events`, `publications`, `opportunities`, `projects`,
  `people`, `partners`) are built from folder names (news and events are
  listed together on the News & events page, `news/index.md`; there is no
  `events/index.md`); the `translations`
  collection maps each page to its counterparts in other languages (used by
  the language switcher, `hreflang` links and the sitemap).
- `src/_data/strings.js` and `navigation.js` read `site.md` / `navigation.md`
  from each language folder so that interface text and menus are also
  editable as markdown. Missing keys fall back to English.
- Two **link modes**, chosen by `SITE_MODE` (`src/_data/site.js`):
  - `path` (default; local dev, previews): links look like `/fr/about/`.
  - `subdomain` (production): links look like `/about/` within a language and
    `https://fr.ajrrn.org/about/` across languages.
  The HTML output is otherwise identical — the folders are always `/<lang>/`.
  A transform in `eleventy.config.js` rewrites every root-relative `href`/`src`
  accordingly, so authors can always write `/about/` in markdown.
- People and partners are listed on their section pages and link outward
  (`link:`); a preprocessor in `eleventy.config.js` sets `permalink: false` on
  those items so they don't get pages of their own.
- Per-language `sitemap.xml`, `robots.txt` (disallow-all in preview builds) and
  `404.html` are generated. Preview builds add `<meta name="robots" content="noindex">`.
- `npm run build` empties `_site/` first (Eleventy does not remove stale output).

## Serving (Cloudflare Worker)

`worker/router.js` is pure logic (unit-tested in `tests/router.test.js`):

| Request | Result |
|---|---|
| `ajrrn.org/x` | asset `/en/x` |
| `fr.ajrrn.org/x` | asset `/fr/x` |
| `ajrrn.org/fr/x` | 301 → `https://fr.ajrrn.org/x` |
| `www.ajrrn.org/x` | 301 → `https://ajrrn.org/x` |
| `ajrrn.org/events/` (moved path) | 301 → `https://ajrrn.org/news/` — see `movedPaths` in `router.js` |
| `*.workers.dev/` | 302 → `/en/` |
| `*.workers.dev/fr/x` | asset `/fr/x` |
| any host `/assets/…` | asset as-is (served without invoking the Worker) |
| missing page | that language's `404.html` with status 404 |

`worker/index.js` applies that decision using the `ASSETS` binding, fixes up
redirects the asset server emits (trailing slashes), and adds security
headers (CSP allowing only same-origin resources, no framing, etc.).

`tests/worker.integration.test.js` runs the real Worker in Miniflare against
`_site/` to check all of the above end to end. `scripts/check-links.js`
verifies every internal link/asset resolves and that every English page has a
counterpart in every language; `scripts/a11y.js` runs an axe-core audit on
every page; `scripts/screenshots.js` captures 320/390/820/1366px screenshots.
`npm run check` runs build + tests + link check + a11y, and CI runs the same.

## Environments

| | Hostname | Link mode | Robots |
|---|---|---|---|
| Local `npm run dev` | localhost:8080 | path | noindex |
| Local `npm run preview` (wrangler) | 127.0.0.1:8787 (treated as ajrrn.org) | path | noindex |
| Branch preview (Workers Builds) | `<id>-ajrrn-web.<account>.workers.dev` | path | noindex |
| Production (`main`) | ajrrn.org + language subdomains | subdomain | index |

Production builds run `SITE_MODE=subdomain` (see the deploy command in
`docs/CLOUDFLARE-SETUP.md`); if the variable is missing, `site.js` also
switches to subdomain mode when Workers Builds reports the branch as `main`.

## Dependencies

Runtime: none (static files + a ~100-line Worker). Build/dev:
`@11ty/eleventy`, `gray-matter`, `wrangler` (includes Miniflare for tests),
`playwright` (screenshots only). No CSS/JS frameworks; the stylesheet is a
single hand-written file, and the only JavaScript on the page is the mobile
menu toggle.
