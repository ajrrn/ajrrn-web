# Contributing

Thanks for your interest in the AJRRN website. Contributions are welcome —
especially corrections to the French, Spanish and Arabic translations, which
are produced with generative AI and reviewed by our team.

## The easiest ways to help

- **Found a typo, a translation error or a broken link?** Open an
  [issue](../../issues) telling us the page (URL) and what should change — or,
  if you are comfortable with GitHub, edit the markdown file directly and open
  a pull request. Every page is a file under `src/content/<language>/`; see
  [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) for the layout.
- **Accessibility problem?** Please tell us (issue or email
  ajrrn@yorku.ca) — including the browser or assistive technology you use.
- **Security problem?** See [SECURITY.md](SECURITY.md); please don't open a
  public issue.

## What we can and cannot accept

- Editorial decisions about *what* the site says — news, events, who is
  listed, how the network describes itself — rest with the AJRRN team. Pull
  requests that change wording are very welcome; ones that add or remove
  substantive content will usually be discussed in an issue first.
- Please keep the four language versions consistent: a fix to the English
  text normally needs the same fix in `fr/`, `es/` and `ar/`
  (see [docs/TRANSLATION.md](docs/TRANSLATION.md)). If you can only correct
  one language, that's fine — say so in the PR and we'll do the rest.
- We do not add third-party services (analytics, embeds, external scripts or
  fonts) — the site's privacy policy promises there are none.
- Design changes should follow [docs/DESIGN.md](docs/DESIGN.md): plain,
  accessible, white background, the two logo colours.

## Working on the code

```bash
npm install
npm run dev        # http://localhost:8080/en/ (also /fr/, /es/, /ar/)
npm run check      # build + Worker tests + link check + accessibility audit
```

`npm run check` must pass before a pull request can be merged (it runs in CI
too). For anything visual, `npm run test:screenshots` writes phone / tablet /
desktop screenshots for every language into `screenshots/` — please look at
the Arabic (right-to-left) ones as well.

Branch → pull request → checks pass → merge; `main` is protected, so this
is the only way in, and merging deploys to production automatically. See
[docs/WORKFLOW.md](docs/WORKFLOW.md).

## Licence and credit

Code contributions are accepted under the repository's MIT licence (see
[LICENSE](LICENSE)); site content and the AJRRN logos are not covered by that
licence. By contributing you agree your contribution can be used under those
terms. We're happy to credit contributors in commit history and, for
substantial help, on the site.
