# Launch checklist

Things that are placeholders or assumptions in the first version and should be
confirmed before (or soon after) the site goes public.

## Content
- [ ] `contact.email` in each `site.md` is `ajrrn@yorku.ca` — make sure the mailbox is monitored.
- [ ] Land acknowledgement (`footer.land`) uses York University's wording; the French/Spanish/Arabic renderings were AI-translated — have them checked.
- [ ] Funder acknowledgement (e.g. SSHRC) — not yet mentioned anywhere; add to About / footer once confirmed.
- [ ] `people/` — the sample entries name the Director and Stream A lead from the grant application; confirm names, roles and consent for everyone listed, and add photos/bios only with consent.
- [ ] `partners/` — the sample entries name three organizations from the application; confirm each partner agrees to be listed and how it wants to be named/linked.
- [ ] Remove or replace all files marked "(placeholder)" in news, events, publications, opportunities, projects.
- [ ] Privacy policy (`privacy/index.md`) — review with the university's privacy office if required; it currently states: no cookies, no analytics, no third-party embeds, Cloudflare as host.
- [ ] Home page intro text and the About page — reviewed by the team.
- [ ] Translations — human review of the French, Spanish and Arabic files, especially `site.md` (interface labels) and the About/Privacy pages.
- [ ] Logo usage in the header on Arabic pages: the logo wordmark is English; consider adding an Arabic wordmark image later.

## Technical
- [ ] Cloudflare setup complete (docs/CLOUDFLARE-SETUP.md), all five hostnames working with HTTPS.
- [ ] Branch protection on `main`.
- [ ] Open Graph image (`src/assets/img/og-image.png`) — replace with a designed one if desired.
- [ ] Verify search engines: production `robots.txt` allows crawling; each language's `sitemap.xml` is listed there.
- [ ] Optional: email/newsletter, social links — the site intentionally has none; decide whether to add plain links (no embeds).
