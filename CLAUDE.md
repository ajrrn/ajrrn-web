# Notes for Claude Code (and other AI assistants) working in this repo

This is the AJRRN website: Eleventy static site + Cloudflare Worker. Read
`README.md` and `docs/` first — especially `docs/CONTENT-GUIDE.md`,
`docs/TRANSLATION.md` and `docs/ARCHITECTURE.md`.

## Ground rules

- **Content changes go in `src/content/<lang>/` only.** Templates, CSS and
  the Worker rarely need to change for content work.
- **Four languages, always — in the same change.** Whenever you change
  anything a visitor can read on the English site (a page body, front matter,
  a new or deleted person/partner/news/event file, a menu label, a `site.md`
  interface string, `alt` text…), make the equivalent change in `fr/`, `es/`
  and `ar/` *as part of the same task*, without being asked: same file names,
  same front-matter keys, translated values. Do this by default even when the
  request only mentions "the site" or "the English page". The **only**
  exception is when the user explicitly says not to translate (e.g. "English
  only for now") — then say in your summary that the other languages are out
  of sync. Translations are done by you (Claude) and committed as markdown;
  never add a translation plugin or service. Keep the terminology table in
  `docs/TRANSLATION.md` up to date, and run `npm run check` (its
  completeness check catches missing files, but not untranslated text).
- **No third-party services** other than GitHub and Cloudflare: no analytics,
  fonts from CDNs, embeds, forms posting elsewhere, CDN scripts. The Content
  Security Policy in `worker/index.js` only allows same-origin resources.
- **Design:** white background, plain and calm; purple `#663399` and mint
  `#66cc99` from the logo; Freeman for headings; system font for body. No
  animations, no gimmicks. See `docs/DESIGN.md`.
- **Accessibility and RTL:** use logical CSS properties; test Arabic pages;
  keep `alt` text and headings meaningful.
- Run `npm run check` before finishing any change (build + Worker tests +
  link/translation-completeness check + axe accessibility audit). For visual
  changes also run `npm run test:screenshots` and look at the 320/390/820/1366px
  output in every language (Arabic is RTL).
- People and partners have no pages of their own: names link outward via
  `link:`. Don't add internal links to `/people/<slug>/`.
- Headings inside markdown bodies start at `##` (the page title is the h1).
- Don't label the two research areas "Stream A" / "Stream B" anywhere a
  visitor can read (that is funder jargon); use their names — *Human rights
  and digital border governance* and *Rights‑enhancing technologies*. The
  `stream: A|B` front-matter key stays as an internal key.
- Menu: About (About the network · People · Partners · Funders · Contact) · Projects
  (Projects · Publications) · News & events (`/news/`, which also lists
  events; `/events/` redirects there) · Opportunities. Don't add top-level
  items without asking.
- The header/footer logo is `src/assets/img/ajrrn-logo-colour.svg` (vector);
  don't reintroduce the PNG in templates.
- `docs/LAUNCH-CHECKLIST.md` tracks what is still placeholder — keep it current
  when you replace placeholder content.
- Don't commit `initial_docs/`, `initial_instructions.md`, `_site/`, `screenshots/`
  (all in `.gitignore`).

## Deployment and git workflow

Live since 2026-08-18: `main` deploys to ajrrn.org (+ fr/es/ar) via Cloudflare
Workers Builds; other branches get preview URLs. `main` is protected by a
ruleset — **never push to `main` directly** (an org-admin token could bypass
it; don't). Work on a branch, push it, open a PR with `gh pr create`, and
leave the PR for the user to review and merge unless they ask you to merge it
once the `check` and `Workers Builds: ajrrn-web` checks are green. After
changing the Worker or wrangler.jsonc, run `bash scripts/smoke-production.sh`
once it is deployed. The repository is public: don't commit drafts of
embargoed announcements before their publication date.

## Handy commands

```
npm run dev              # local dev server, http://localhost:8080/en/
npm run check            # build + tests + link check
npm run test:screenshots # screenshots into ./screenshots
SITE_MODE=subdomain npx eleventy   # production-style links (for inspection)
```
