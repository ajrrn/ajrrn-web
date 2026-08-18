# Editing workflow

`main` is protected by a GitHub ruleset ("Protect main"): changes reach it
only through a pull request whose checks pass; force-pushes and deletion are
blocked. Merging into `main` deploys to production. Every change to the site
— a new announcement, a fixed typo, a new page — therefore follows the same
path:

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
4. **Open a pull request** into `main`. Review the preview. The PR can be
   merged once both required checks are green: `check` (GitHub Actions) and
   `Workers Builds: ajrrn-web` (Cloudflare preview build). No second reviewer
   is required at the moment (required approvals = 0).
5. **Merge.** Cloudflare builds `main` and deploys to production
   (`ajrrn.org`, `fr.ajrrn.org`, `es.ajrrn.org`, `ar.ajrrn.org`) within a
   minute or two. Delete the branch afterwards.

Note: the ruleset currently lets *organization admins* bypass it, so an admin
can still push straight to `main` (GitHub records the bypass). Please don't —
use a PR anyway. The ruleset lives under *Settings → Rules → Rulesets*.

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
npm run check              # build + tests + link check + accessibility audit
npm run test:screenshots   # writes phone/tablet/desktop screenshots to ./screenshots
```

The link checker also fails if a page exists in English but is missing in
another language. After a production deploy, `bash scripts/smoke-production.sh`
verifies the live hostnames.
