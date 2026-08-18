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

## Quick start

```bash
npm install          # once
npm run dev          # http://localhost:8080/en/  (live reload; language in the path)
npm run preview      # build + run the real Worker locally with wrangler
npm run check        # build + Worker tests + internal link check
npm run test:screenshots   # phone/tablet/desktop screenshots into ./screenshots
```

Requires Node.js 20 or newer (`.node-version` says 22, which is what Cloudflare
uses to build).

## Repository layout

```
src/content/<lang>/     all content (markdown) — en, fr, es, ar
src/_includes/          Nunjucks layouts, views and partials
src/_data/              site settings + loaders for site.md / navigation.md
src/assets/             CSS, JS, fonts (Freeman, OFL), images (logo, icons)
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

## Licence

Code: MIT (see [LICENSE](LICENSE)). Content and logos: © AJRRN. Freeman
typeface: SIL OFL 1.1.
