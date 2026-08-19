# Content guide

All content lives in `src/content/<language>/`, one folder per language:
`en` (English — the source of truth), `fr`, `es`, `ar`. **The four folders have
the same structure and the same file names.** The file name is what ties the
translations of a page together, so never rename a file in one language only.

**Any edit to `en/` is mirrored in `fr/`, `es/` and `ar/` in the same
change** — new files, deleted files, changed text, changed front matter. When
the edit is made with Claude Code this is done automatically unless you ask
for English only; see [TRANSLATION.md](TRANSLATION.md).

```
src/content/en/
├── site.md              site-wide text: name, contact, footer, interface labels
├── navigation.md        the menus (main menu + footer menu)
├── index.md             home page
├── 404.md               "page not found"
├── about/index.md       About the network
├── people/index.md      + one file per person
├── partners/index.md    + one file per partner organization
├── funders/index.md     Funders (SSHRC acknowledgement — wording fixed by the funder)
├── projects/index.md    Projects page (research areas) + one file per project
├── publications/index.md + one file per publication
├── opportunities/index.md + one file per opportunity
├── news/index.md        News & events page (intro) + one file per announcement
├── events/              one file per event (listed on the News & events page; no index.md)
├── contact/index.md
└── privacy/index.md
```

A markdown file has two parts: **front matter** (the block between `---`
lines, `key: value`) and the **body** (markdown text). Front matter carries
structured data (title, date, …); the body is the text of the page.

## Common front-matter fields

| Field | Used on | Notes |
|---|---|---|
| `title` | every page | Shown as the heading and in the browser tab |
| `description` | pages | One sentence for search engines / link previews (optional) |
| `summary` | items | One or two sentences shown in lists (optional but recommended) |
| `date` | news, events, publications, opportunities | `YYYY-MM-DD` |
| `draft: true` | any item | Hides the item from lists (the page is still built) |
| `permalink` | any page | Override the URL, e.g. `permalink: /fr/a-propos/` — must start with the language code |

Dates are always written `YYYY-MM-DD` and are displayed in each language's
own format automatically.

## Section pages (`<section>/index.md`)

The body of `news/index.md`, `publications/index.md`, etc. is the introduction
shown above the automatically generated list. `news/index.md` is the **News &
events** page: it lists upcoming events, then all announcements, then past
events. Event files live in `events/` but have no list page of their own
(`/events/` redirects to `/news/`).

## Items

### News / announcements — `news/YYYY-MM-slug.md`

```yaml
---
title: AJRRN launches its website
date: 2026-09-01
summary: One or two sentences shown in the list and on the home page.
---
Body text in markdown.
```

The three most recent items appear on the home page.

### Events — `events/YYYY-MM-slug.md`

```yaml
---
title: "Webinar: Introducing the AJRRN"
date: 2026-10-15          # start date
end: 2026-10-16           # optional end date
time: "12:00–13:00 (Toronto, UTC−4)"   # free text, optional
location: Online          # free text
online: true              # optional
link: https://…           # registration / event page, optional
summary: …
---
```

Events are split into *upcoming* and *past* automatically on the News &
events page (an event stays "upcoming" until the end of its `end` date, or its
`date` if there is no `end`). Upcoming events also appear on the home page.

### Publications — `publications/YYYY-slug.md`

```yaml
---
title: …
authors: A. Author, B. Author
date: 2026-07-01
venue: Journal name / Report / Policy brief
pubtype: article          # free text tag, optional
link: https://…           # open-access copy, optional
summary: …
---
```

### Opportunities — `opportunities/YYYY-MM-slug.md`

```yaml
---
title: …
date: 2026-09-01
deadline: 2026-12-01      # optional
category: study           # work | study | participate  (controls grouping)
location: York University, Toronto
link: https://…           # optional
summary: …
---
```

### Projects — `projects/slug.md`

```yaml
---
title: …
stream: A                 # A = human rights and digital border governance,
                          # B = rights‑enhancing technologies (internal key; the
                          # page shows the area's name from site.md, never "Stream A")
status: Planned           # free text, optional
summary: …
order: 1                  # optional; lower numbers first
---
```

### People — `people/firstname-lastname.md`

```yaml
---
name: Jane Doe
title: Jane Doe           # same as name
role: Project Director
affiliation: Osgoode Hall Law School, York University
email: jane@example.org   # optional, shown as a mailto link
group: staff              # staff | affiliate  (controls which list: "Team" or "Research affiliates")
link: https://…           # external profile page; the name links there (optional)
order: 1                  # optional; lower numbers first
---
```

People do not get pages of their own on this site: they are listed on the
People page and their name links to the external `link` if there is one. The
markdown body is currently not displayed (kept for future use).

### Partners — `partners/slug.md`

```yaml
---
name: Organization name
title: Organization name
location: City, Country
type: Community organization
link: https://…           # the name links to the partner's website
order: 1
---
```

Like people, partners are listed on the Partners page (name → external
website) and do not get pages of their own.

## Menus — `navigation.md`

```yaml
main:                     # the top menu: About · Projects · News & events · Opportunities
  - label: About
    url: /about/
    children:             # optional: shown as a sub-menu on those pages
      - label: About the network
        url: /about/
      - label: People
        url: /people/
      - label: Funders
        url: /funders/
      - label: Contact
        url: /contact/
footer:                   # the footer menu
  - label: Privacy policy
    url: /privacy/
```

URLs are relative to the language root: `/about/` means `ajrrn.org/about/` on
the English site and `fr.ajrrn.org/about/` on the French one. External links
(`https://…`) are also allowed.

## Site-wide text — `site.md`

Everything a visitor reads that is not part of a page:

| Key | Where it appears |
|---|---|
| `name`, `full_name`, `tagline`, `description` | browser tab titles, link previews, defaults |
| `translation_notice` | banner at the top of every page of that language (empty in English) |
| `contact.email`, `contact.address_label`, `contact.organization`, `contact.address_lines` | the Contact page (the footer has no contact block — logo and site links only) |
| `footer.land` | land acknowledgement band above the copyright |
| `footer.copyright` | copyright line |
| `ui.*` | interface labels — "Read more", "Upcoming events", "Menu", "Site links", … |

Change wording here, not in the templates.

## Links and images inside markdown

- Link to other pages of the site with language-root-relative paths:
  `[People](/people/)`. The build turns them into the correct address for the
  language and environment.
- Put images and documents in `src/assets/img/` or `src/assets/docs/` and
  reference them as `/assets/img/file.png`. Give every image meaningful `alt`
  text: `![Description of the image](/assets/img/file.png)`.
- Avoid embedding third-party content (videos, maps, social posts): the site's
  privacy policy promises there is none. Link to it instead.

## Adding a whole new page

1. Create `src/content/en/<slug>/index.md` with `title` and body.
2. Create the same file in `fr/`, `es/`, `ar/` (see TRANSLATION.md).
3. Add it to `navigation.md` in each language if it should appear in a menu.

## Adding a new language

1. Add the language to `src/_data/site.js` (code, name, direction, date
   locale, hostname).
2. Copy `src/content/en/` to `src/content/<code>/` and translate.
3. Add the language code to `worker/router.js` (`DEFAULT_CONFIG.languages`) and a
   `<code>.ajrrn.org` custom domain to `wrangler.jsonc`.
