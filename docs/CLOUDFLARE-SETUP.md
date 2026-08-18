# Cloudflare setup (one-off)

This connects the GitHub repository to Cloudflare so that every branch gets a
preview URL and `main` is published at ajrrn.org and its language subdomains.
Everything below is done once, in the Cloudflare dashboard, by someone with
admin access to the Cloudflare account and to the `ajrrn` GitHub organization.
Nothing in the repository needs to change (the Worker's configuration is
already in `wrangler.jsonc`).

You need: a Cloudflare account, control of the `ajrrn.org` domain at its
registrar, and admin rights on github.com/ajrrn/ajrrn-web.

## 1. Add the ajrrn.org zone to Cloudflare

1. Cloudflare dashboard → **Add a domain** (top-right *Add* menu, or *Domain
   Registration → Manage domains* if the domain is registered with Cloudflare).
   Enter `ajrrn.org`, choose the **Free** plan, continue.
2. Cloudflare scans existing DNS records. **Keep any MX / TXT records** (email,
   verification) it finds. **Delete any A, AAAA or CNAME records for
   `ajrrn.org`, `www`, `fr`, `es`, `ar`** — those hostnames must be free for
   the Worker to claim them in step 4 (an existing record blocks the automatic
   custom-domain setup). If the domain is brand new, there is nothing to delete.
3. Cloudflare shows two nameservers (e.g. `xxx.ns.cloudflare.com`). At your
   registrar, replace the domain's nameservers with those two. Propagation
   usually takes minutes, sometimes up to 24 h. The zone shows **Active** in
   the dashboard once done. (If the domain is registered with Cloudflare this
   step is automatic.)
4. Optional but recommended, in the zone: **SSL/TLS → Overview → Full (strict)**;
   **SSL/TLS → Edge Certificates → Always Use HTTPS: On**.

You can continue with steps 2–3 while the nameservers propagate; only the
custom domains (step 4) need the zone to be active.

## 2. Install the Cloudflare GitHub app on the `ajrrn` organization

1. Cloudflare dashboard → **Compute (Workers) → Workers & Pages** → **Create** →
   tab **Workers** → **Import a repository** (the git-integration path; the
   button may read *Connect to Git* / *Import a repository*).
2. Choose **GitHub** and authorize. When asked where to install the *Cloudflare
   Workers and Pages* GitHub app, pick the **`ajrrn` organization** (not your
   personal account) and grant access to **only the `ajrrn-web` repository**.
   If you are not an org owner, GitHub will send the org owners an approval
   request; the next step waits until they approve.

## 3. Create the Worker from the repository (Workers Builds)

Back in the Cloudflare *Import a repository* screen, select `ajrrn/ajrrn-web`
and fill in the build configuration:

| Setting | Value |
|---|---|
| Project / Worker name | `ajrrn-web` — **must match** `"name"` in `wrangler.jsonc` |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npm run build:production && npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Root directory | `/` (leave default) |
| Build variables | none required (Node version comes from `.node-version`) |

Notes:
- The *deploy* command for production rebuilds in `SITE_MODE=subdomain` so that
  links use `ajrrn.org`, `fr.ajrrn.org` … The plain build (used for previews)
  keeps the language in the path (`/fr/…`), which is what the preview URLs need.
- If the form does not have a separate "non-production branch deploy command",
  leave the default; Workers Builds uses `wrangler versions upload` for
  non-production branches automatically.
- Click **Save and Deploy**. The first build takes ~1–2 minutes. It runs
  `npm ci`, the build, then `wrangler deploy`. If the zone from step 1 is not
  active yet, the deploy step may fail on the custom domains — that is
  expected; re-run it after step 1 completes (Deployments → *Retry*), or
  temporarily comment out the `routes` block in `wrangler.jsonc` and restore
  it later.

When it succeeds you get a `https://ajrrn-web.<your-subdomain>.workers.dev`
URL. Open it: it should redirect to `/en/` and show the English site; `/fr/`,
`/es/`, `/ar/` show the other languages.

## 4. Custom domains (production hostnames)

`wrangler deploy` from `main` creates these automatically from the `routes`
list in `wrangler.jsonc`, each as a Cloudflare **custom domain** (DNS record +
certificate managed by Cloudflare):

- `ajrrn.org` (English)
- `www.ajrrn.org` (redirects to ajrrn.org)
- `fr.ajrrn.org`, `es.ajrrn.org`, `ar.ajrrn.org`

Check them under **the Worker → Settings → Domains & Routes**. If any is missing
(for example because the zone was not active at first deploy), add it there:
*Add → Custom domain → hostname → Add domain*. Certificates are issued in a
minute or two.

Test: `https://ajrrn.org/`, `https://fr.ajrrn.org/`, `https://ajrrn.org/fr/`
(should redirect to `https://fr.ajrrn.org/`), `https://www.ajrrn.org/`
(should redirect to `https://ajrrn.org/`), a wrong URL (should show the 404
page in the right language).

## 5. Previews for branches and pull requests

Nothing to configure beyond step 3, but check these switches on the Worker:

- **Settings → Domains & Routes → workers.dev**: enabled.
- **Settings → Domains & Routes → Preview URLs**: enabled.
- **Settings → Build** (Workers Builds): *Pull request comments* /
  *Preview URLs on PRs* enabled if offered — Cloudflare then posts the preview
  link on each PR and as a commit status.

Every push to a non-`main` branch produces a preview at a URL like
`https://<version-prefix>-ajrrn-web.<your-subdomain>.workers.dev` (also
listed under *Deployments* / *Versions* in the dashboard). Previews serve
`/en/`, `/fr/`, `/es/`, `/ar/` by path, are marked `noindex`, and have a
`robots.txt` that disallows crawling.

## 6. GitHub settings (recommended)

- **Branch protection on `main`**: require a pull request and require the
  "CI / check" status to pass before merging (Settings → Branches → Add rule).
- Grant the people who will edit content *Write* access; keep *Admin* to a few.

## 7. Cost and limits

The Workers **Free** plan allows 100,000 Worker requests per day. Files under
`/assets/` (CSS, fonts, images) are served without invoking the Worker and do
not count; page views do. If traffic grows past that, upgrade the account to
Workers Paid (US$5/month) — no code change needed. Workers Builds is free
within its build-minute limits.

## Troubleshooting

- **Build fails with `EBADENGINE` / Node version**: `.node-version` pins Node 22;
  make sure no dashboard variable overrides it (`NODE_VERSION`).
- **Deploy fails: "custom domain … DNS record already exists"**: delete the
  conflicting A/AAAA/CNAME record in the zone (step 1.2) and retry.
- **`fr.ajrrn.org` shows English**: the Worker is not receiving that
  hostname — check the custom domain exists on *this* Worker and that no
  other Worker/route claims `*.ajrrn.org`.
- **Links on production point to `/fr/…` and bounce through redirects**: the
  production build ran without `SITE_MODE=subdomain`; check the deploy command
  in step 3.
- **Preview URL shows a blank 404**: open `/en/` — the root of a preview
  redirects there; if the redirect fails, check the build log for Eleventy
  errors.
- **Local reproduction**: `npm run build && npm test` runs the Worker in
  Miniflare exactly as configured; `npx wrangler deploy --dry-run` validates
  `wrangler.jsonc` without deploying.

## Manual deploy (fallback)

Anyone with the Cloudflare account and `wrangler login` can deploy from a
laptop: `npm ci && npm run deploy`. Normally unnecessary — merging into `main`
does it.
