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
- Content pages: optional section sub-menu (About · People · Partners), an
  h1 with a purple rule, prose.
- Lists (news, events, …) are simple bordered rows: date · title · summary.
  No card grids, no images required.
- Breakpoints: menu collapses behind a "Menu" button under 52em (~832px);
  footer stacks; meta tables become single-column under 30em.
- RTL: the stylesheet uses logical properties (`margin-inline-start`, …) so
  Arabic mirrors correctly with `dir="rtl"` on `<html>`.

## Accessibility checklist

- Skip link, landmark elements, `aria-current` on active nav items,
  `aria-expanded` on the menu button, visible focus outlines.
- Colour contrast ≥ 4.5:1 for all text.
- Everything works without JavaScript (the menu is simply expanded).
- Images have `alt` text; the logo alt is the full network name.
- `lang` and `dir` on every page; `hreflang` alternates in `<head>`.
