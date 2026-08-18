# Editing workflow

Every change to the site — a new announcement, a fixed typo, a new page —
follows the same path:

1. **Create a branch** from `main` (for example `news/2026-10-webinar`).
2. **Edit or add markdown files** under `src/content/` (see
   [CONTENT-GUIDE.md](CONTENT-GUIDE.md)). Add the same change to all four
   languages (see [TRANSLATION.md](TRANSLATION.md)).
3. **Push the branch.** Two things happen automatically:
   - GitHub Actions builds the site and runs the checks (see the ✔/✘ next to
     the commit).
   - Cloudflare Workers Builds builds the branch and publishes a **preview
     URL** (shown in the Cloudflare dashboard and in the commit status). On
     preview URLs the languages live in the path:
     `https://<preview>.workers.dev/en/`, `/fr/`, `/es/`, `/ar/`.
4. **Open a pull request** into `main`. Review the preview.
5. **Merge.** Cloudflare builds `main` and deploys to production
   (`ajrrn.org`, `fr.ajrrn.org`, `es.ajrrn.org`, `ar.ajrrn.org`) within a
   minute or two.

## Local preview (optional)

```bash
npm install
npm run dev        # http://localhost:8080/en/ — rebuilds as you save
```

`npm run preview` runs the real Cloudflare Worker locally on
http://127.0.0.1:8787 (wrangler treats it as `ajrrn.org`, so this shows the
English production behaviour; use `npm run dev` to browse all languages).

## Checks you can run

```bash
npm run check              # build + unit/integration tests + link check
npm run test:screenshots   # writes phone/tablet/desktop screenshots to ./screenshots
```

The link checker also fails if a page exists in English but is missing in
another language.
