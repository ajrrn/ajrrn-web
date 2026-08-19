# Launch checklist

Things that are still placeholders or assumptions and should be confirmed
before (or soon after) the site goes public. Last reviewed 2026-08-19.

## Content
- [ ] `contact.email` in each `site.md` is `ajrrn@yorku.ca` — make sure the mailbox is monitored.
- [ ] Land acknowledgement (`footer.land`) uses York University's wording; the French/Spanish/Arabic renderings were AI-translated — have them checked.
- [x] Funder acknowledgement — `funders/index.md` (About → Funders) carries SSHRC's required wording and the SSHRC signature (`src/assets/img/sshrc-signature-en.png` / `-fr.png`, from SSHRC's official package; English-first version on en/es/ar pages, French-first on fr).
- [ ] `people/` — lists the Director, the human-rights lead and the Project Manager (external links; no email addresses) under "Team", and the 12 other co-applicants and the collaborator (Todd Miller) from the SSHRC application under "Research affiliates" (role "Co-applicant" / "Collaborator", affiliation and an external profile link). Confirm with each affiliate that they agree to be listed, and how they want their name, affiliation and link shown; replace the roles with more descriptive ones if preferred.
- [ ] `partners/` — lists the host (Refugee Law Lab) and the 11 partner organizations named in the SSHRC application, with links; confirm each partner agrees to be listed and how it wants to be named/linked (names are currently as on the application), and add new partners as they join.
- [x] `publications/` — two real entries (Bill C‑2 consultation report, 2025; *Border Necrotechnics*, 2026); placeholders removed.
- [ ] `opportunities/` — one real posting (Osgoode JD research assistant, Aug 2026; its deadline was 14 Aug 2026 — remove or update once filled); the *study* and *participate* entries are still placeholders. `projects/` still has 2 sample entries. Replace them with real items — or delete them, in which case the list pages show a "nothing here yet" note.
- [ ] Events: the 22 Sept 2026 launch entry has no registration link yet (`link: ""`); add it when available.
- [ ] Privacy policy (`privacy/index.md`) — no longer marked as a draft (2026-08-19); review with the university's privacy office if required; it currently states: no cookies, no analytics, no third-party embeds, Cloudflare as host.
- [ ] Home page intro text and the About page — reviewed by the team.
- [ ] Translations — human review of the French, Spanish and Arabic files, especially `site.md` (interface labels) and the About/Privacy pages.
- [ ] Logo usage in the header on Arabic pages: the logo wordmark is English; consider adding an Arabic wordmark image later.

## Technical
- [x] Cloudflare setup complete (docs/CLOUDFLARE-SETUP.md); all five hostnames verified live 2026-08-18 (`scripts/smoke-production.sh`).
- [x] Repository public; `main` protected by the "Protect main" ruleset (PR + `check` + `Workers Builds: ajrrn-web` required). Org admins can bypass — consider removing that once more people have write access.
- [x] Colour logo: the designer's native SVG export is in place (`src/assets/img/ajrrn-logo-colour.svg`, 2026-08-19; see docs/DESIGN.md).
- [x] Favicon / app icon: the designer's square mark is in place (2026-08-19) — `favicon.svg` is the vector mark cropped from the logo SVG; `favicon-32.png`, `apple-touch-icon.png` (white background) and `logo-mark-512.png` are derived from the designer's `AJRRN Favicon@300x.png` (kept in `initial_docs/`).
- [ ] Still to ask the designer for: a white/reverse SVG of the logo.
- [ ] Open Graph image (`src/assets/img/og-image.png`) — replace with a designed one if desired.
- [x] Production `robots.txt` allows crawling and lists each language's sitemap. Note: the Cloudflare zone has *managed robots.txt* on, which prepends rules blocking AI crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, …) — change under the zone's Bots / AI Crawl Control settings if you want otherwise.
- [ ] Optional: email/newsletter, social links — the site intentionally has none; decide whether to add plain links (no embeds).
