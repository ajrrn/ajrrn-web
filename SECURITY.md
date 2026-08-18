# Security policy

This repository contains the source of the AJRRN website (ajrrn.org and its
language subdomains). The site is static: it sets no cookies, has no accounts,
no forms and no databases, and it stores no information about visitors (see
the site's [privacy policy](src/content/en/privacy/index.md)). It is served
by a small Cloudflare Worker (`worker/`).

## Reporting a vulnerability

If you find a security problem — for example in the Worker, the security
headers, the build/deploy configuration, or a dependency — please email
**ajrrn@yorku.ca** with "website security" in the subject line. Please do not
open a public GitHub issue for security problems until we have had a chance to
fix them.

Include what you found, how to reproduce it, and how we can reach you. We will
acknowledge your report within a week and tell you what we intend to do. There
is no bug bounty programme; we are a small non-profit research network, but we
are grateful for responsible reports and happy to credit you if you wish.

## Scope

In scope: this repository, ajrrn.org, www.ajrrn.org, fr.ajrrn.org,
es.ajrrn.org, ar.ajrrn.org.

Out of scope: the websites of partner organizations we link to, York
University systems, GitHub and Cloudflare themselves (report those to the
respective organizations), and denial-of-service or volumetric testing —
please do not load-test the site.

## Dependencies and updates

Build-time dependencies are listed in `package.json`; there are no runtime
dependencies beyond the Cloudflare Workers platform. GitHub's dependency
alerts are enabled for the repository; updates are applied through the normal
pull-request workflow.
