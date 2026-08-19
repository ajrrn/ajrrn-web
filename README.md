# AJRRN website

Source code and content of the website of the **Algorithmic Justice for Refugees
Research Network** — https://ajrrn.org (English), https://fr.ajrrn.org (French),
https://es.ajrrn.org (Spanish), https://ar.ajrrn.org (Arabic).

The site is a plain, static, multilingual website:

- **Content is markdown.** Every page, announcement, event, publication,
  opportunity, project, person, partner — and the menus and interface labels —
  is a markdown file under [`src/content/`](src/content/). Non-technical
  editors only ever need to touch that folder. See
  [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).
- **Built with [Eleventy](https://www.11ty.dev/)** into static HTML in `_site/`.
- **Served by a Cloudflare Worker** (`worker/`) that maps the language
  subdomains to language folders. Deployed by Cloudflare Workers Builds from
  GitHub: every branch gets a preview URL; merging into `main` deploys to
  production. See [docs/CLOUDFLARE-SETUP.md](docs/CLOUDFLARE-SETUP.md).
- **No third-party services** other than GitHub and Cloudflare: no analytics,
  no cookies, no external fonts or scripts.
- **Translations** into French, Spanish and Arabic are produced with generative
  AI (Claude) from the English source and stored as ordinary markdown files —
  see [docs/TRANSLATION.md](docs/TRANSLATION.md). Every translated page says so.
  Every change to the English content is mirrored in the three other languages
  in the same change (Claude does this automatically unless told not to).

## Quick start

```bash
npm install          # once
npm run dev          # http://localhost:8080/en/  (live reload; language in the path)
npm run preview      # build + run the real Worker locally with wrangler
npm run check        # build + Worker tests + link check + axe accessibility audit
npm run test:screenshots   # 320/390/820/1366px screenshots into ./screenshots
npm run test:a11y    # axe-core audit of every page (also part of check)
```

Requires Node.js 20 or newer (`.node-version` says 22, which is what Cloudflare
uses to build).

## Repository layout

```
src/content/<lang>/     all content (markdown) — en, fr, es, ar
src/_includes/          Nunjucks layouts, views and partials
src/_data/              site settings + loaders for site.md / navigation.md
src/assets/             CSS, JS, fonts (Freeman, OFL), images (SVG logo, icons, OG image)
worker/                 Cloudflare Worker (router.js is pure logic, tested)
tests/                  node:test unit tests + Miniflare integration tests
scripts/                link checker, screenshot script
docs/                   documentation
eleventy.config.js      build configuration
wrangler.jsonc          Cloudflare Workers configuration
```

## Documentation

- [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) — how to add/edit pages, news, events, people…
- [docs/TRANSLATION.md](docs/TRANSLATION.md) — how the four language versions are kept in sync
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the build, the Worker and the languages fit together
- [docs/CLOUDFLARE-SETUP.md](docs/CLOUDFLARE-SETUP.md) — step-by-step Cloudflare setup (one-off)
- [docs/DESIGN.md](docs/DESIGN.md) — colours, type, layout rules
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — branch → preview → pull request → production
- [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) — what is still placeholder / to confirm before launch

## Status (2026-08-18)

First version live at ajrrn.org (+ fr/es/ar subdomains) via Cloudflare
Workers Builds; `main` deploys to production, other branches get preview URLs
(`scripts/smoke-production.sh` checks the live site). The repository is
public and `main` is protected: all changes go through pull requests with
passing checks (see [docs/WORKFLOW.md](docs/WORKFLOW.md)). Real content so far: home, About, People (3
staff + 13 research affiliates), Partners (12), Projects page text, Contact, Privacy policy (draft), one
news item (SSHRC grant), one event (launch, 22 Sept 2026). Publications,
opportunities and project *entries* are still sample placeholders — see
`docs/LAUNCH-CHECKLIST.md`.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## Licence

Code: MIT (see [LICENSE](LICENSE)). Content and logos: © AJRRN. Freeman
typeface: SIL OFL 1.1.
