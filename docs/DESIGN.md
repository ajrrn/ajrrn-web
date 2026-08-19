# Design notes

Goal: a plain, calm, readable site for a social-justice academic research
network — not a corporate product page. White background, generous
whitespace, few decorative elements, nothing animated.

## Colour

From the AJRRN logo style card:

| Token | Value | Use |
|---|---|---|
| `--purple` | `#663399` | links, primary buttons, active states, heading rule |
| `--purple-dark` | `#4d2673` | hover states |
| `--purple-tint` | `#f3eef8` | subtle backgrounds (current language, notices) |
| `--mint` | `#66cc99` | accents only: focus outline, list-heading rules, meta bar edge |
| `--mint-dark` | `#2f8f62` | when mint must be *text* (tags) — mint on white is not readable |
| `--ink` / `--ink-soft` / `--muted` | greys | text hierarchy |

Mint (`#66cc99`) has ~2:1 contrast on white, so it is never used for text or
essential meaning — only as a small decorative accent.

## Logo

`src/assets/img/ajrrn-logo-colour.svg` is the designer's native SVG export of
the colour logo (received 2026-08-19; text as outlines, ~46 KB), which
replaced a version extracted from the style-card PDF. Its `viewBox` was
cropped from the export's padded artboard to the drawn artwork
(`12 27 444.75 207.75`) so that the purple square renders at the same size as
the earlier file at the tuned header heights (7.15rem desktop / 5rem / 4.25rem
in `site.css`); the artwork itself is untouched, including the mint strokes
that spill above and below the square. If a new export arrives, crop its
`viewBox` the same way (measure the drawn bounds, not the artboard) before
dropping it in under the same file name. The favicon/app icons are the designer's square mark: `favicon.svg` is that
mark cropped out of the logo SVG (viewBox `-11.75 11.2 232 232`, wordmark
removed); the PNG icons were resized from the designer's favicon PNG.
`og-image.png` still derives from the earlier extracted artwork.

The SSHRC signature on the Funders page (`sshrc-signature-en.png`/`-fr.png`)
comes from SSHRC's official package and must not be altered; it sits alone
with generous space (`.funder-logo`), on white, as their guidelines require.

## Type

- **Headings:** Freeman (the logo typeface), self-hosted from
  `src/assets/fonts/` under the SIL Open Font License. It has no Arabic
  glyphs, so Arabic pages use the system sans-serif in bold for headings.
- **Body:** the visitor's system sans-serif stack — good rendering for Latin
  and Arabic scripts, zero font downloads, no third-party font service.
- Measure 48rem for prose (text and list columns); base size 17px desktop / 16px small screens. The header, footer and home-page grid use the full 75rem container.

## Layout

- One container (max 75rem). Header: SVG logo (7.15rem tall on desktop,
  5rem on phones, 4.25rem under 30em) + menu + language switcher, all on one
  line down to ~832px in every language. Footer: logo · site links in three columns (About · People · Partners · Funders | Projects · Publications · News & events · Opportunities | Contact · Privacy policy)
  (email + host address), then a full-width land-acknowledgement band, then
  the copyright line. The language switcher lives only in the header.
- Content pages: optional section sub-menu (About · People · Partners; Projects · Publications), an
  h1 with a purple rule, prose.
- Lists (news, events, …) are simple bordered rows: date · title · summary.
  No card grids, no images required.
- Breakpoints: menu collapses behind a "Menu" button under 52em (~832px);
  footer stacks; meta tables become single-column under 30em.
- RTL: the stylesheet uses logical properties (`margin-inline-start`, …) so
  Arabic mirrors correctly with `dir="rtl"` on `<html>`.

## Accessibility

Automated: `npm run test:a11y` runs axe-core (WCAG 2.1 A/AA + best
practices) on every page in every language, on desktop and phone viewports
(with the mobile menu open too). It is part of `npm run check`.

Manual checklist (things automated tools cannot judge):

- Skip link; `header`/`nav`/`main`/`footer` landmarks; every `nav` has an
  `aria-label`; footer columns have visually-hidden headings.
- `aria-current` on the active menu item and language; `aria-expanded` /
  `aria-controls` on the menu button; the menu closes with Escape.
- Focus is always visible: 3px purple outline with an offset (≥ 3:1 against
  white and against the purple button because of the white gap).
- Colour contrast ≥ 4.5:1 for all text (mint is decorative only; the
  "muted" grey is `#616166`, the tag green `#1f6b48`).
- Everything works without JavaScript (the menu is simply expanded).
- Images have `alt` text; the header logo's alt is the full network name;
  the footer logo is decorative (`alt=""`).
- `lang` and `dir` on every page; language links carry `lang`/`hreflang`;
  `hreflang` alternates in `<head>`.
- Headings follow a strict outline (h1 → h2 → h3). Markdown authors: start
  body headings at `##`.
- Link text is meaningful (URLs are shown shortened, never as raw text of
  100 characters). External links open in the same tab.
- Text reflows to 320px wide without horizontal scrolling; layout uses
  relative units so browser zoom / text-size settings work.
- No motion, no autoplay, no time limits, no justified text.
