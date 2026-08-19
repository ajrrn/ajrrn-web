# Launch checklist

Things that are still placeholders or assumptions and should be confirmed
before (or soon after) the site goes public. Last reviewed 2026-08-19.

## Content
- [ ] `contact.email` in each `site.md` is `ajrrn@yorku.ca` — make sure the mailbox is monitored.
- [ ] Land acknowledgement (`footer.land`) uses York University's wording; the French/Spanish/Arabic renderings were AI-translated — have them checked.
- [ ] Funder acknowledgement — SSHRC is named in the June 2026 news item; decide whether to add a standing acknowledgement to the About page or footer.
- [ ] `people/` — lists the Director, the human-rights lead and the Project Manager (external links, project-manager email shown) under "Team", and the 12 other co-applicants and the collaborator (Todd Miller) from the SSHRC application under "Research affiliates" (role "Co-applicant" / "Collaborator", affiliation and an external profile link). Confirm with each affiliate that they agree to be listed, and how they want their name, affiliation and link shown; replace the roles with more descriptive ones if preferred.
- [ ] `partners/` — lists the host (Refugee Law Lab) and the 11 partner organizations named in the SSHRC application, with links; confirm each partner agrees to be listed and how it wants to be named/linked (names are currently as on the application), and add new partners as they join.
- [ ] Still placeholders: `publications/` (2 sample entries), `opportunities/` (3 sample entries), `projects/` (2 sample entries). Replace them with real items — or delete them, in which case the list pages show a "nothing here yet" note.
- [ ] Events: the 22 Sept 2026 launch entry has no registration link yet (`link: ""`); add it when available.
- [ ] Privacy policy (`privacy/index.md`) — review with the university's privacy office if required; it currently states: no cookies, no analytics, no third-party embeds, Cloudflare as host.
- [ ] Home page intro text and the About page — reviewed by the team.
- [ ] Translations — human review of the French, Spanish and Arabic files, especially `site.md` (interface labels) and the About/Privacy pages.
- [ ] Logo usage in the header on Arabic pages: the logo wordmark is English; consider adding an Arabic wordmark image later.

## Technical
- [x] Cloudflare setup complete (docs/CLOUDFLARE-SETUP.md); all five hostnames verified live 2026-08-18 (`scripts/smoke-production.sh`).
- [x] Repository public; `main` protected by the "Protect main" ruleset (PR + `check` + `Workers Builds: ajrrn-web` required). Org admins can bypass — consider removing that once more people have write access.
- [x] Colour logo: the designer's native SVG export is in place (`src/assets/img/ajrrn-logo-colour.svg`, 2026-08-19; see docs/DESIGN.md).
- [ ] Still to ask the designer for: a white/reverse SVG of the logo and a square mark for the favicon / app icon (the current `favicon.svg`, `logo-mark-512.png`, `apple-touch-icon.png` and `og-image.png` derive from the earlier extracted artwork).
- [ ] Open Graph image (`src/assets/img/og-image.png`) — replace with a designed one if desired.
- [x] Production `robots.txt` allows crawling and lists each language's sitemap. Note: the Cloudflare zone has *managed robots.txt* on, which prepends rules blocking AI crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, …) — change under the zone's Bots / AI Crawl Control settings if you want otherwise.
- [ ] Optional: email/newsletter, social links — the site intentionally has none; decide whether to add plain links (no embeds).
