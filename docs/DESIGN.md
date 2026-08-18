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

`src/assets/img/ajrrn-logo-colour.svg` is a vector version of the colour logo,
extracted from the designer's style-card PDF (the logo is vector in the PDF;
converted with `pdftocairo -svg`, cropped and optimised with svgo). It is
crisp at any size or zoom. If the designer supplies a native SVG export of the
logo (text converted to outlines), drop it in under the same file name — it
will be smaller and cleaner than the extracted one (~400 KB uncompressed,
~17 KB over the wire). The PNG variants remain for the Open Graph image and
icons.

## Type

- **Headings:** Freeman (the logo typeface), self-hosted from
  `src/assets/fonts/` under the SIL Open Font License. It has no Arabic
  glyphs, so Arabic pages use the system sans-serif in bold for headings.
- **Body:** the visitor's system sans-serif stack — good rendering for Latin
  and Arabic scripts, zero font downloads, no third-party font service.
- Measure ~44rem for prose; base size 17px desktop / 16px small screens.

## Layout

- One container (max 72rem), header with logo + menu + language switcher,
  footer with about / links / contact.
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
