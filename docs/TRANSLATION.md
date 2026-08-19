# Translations

The site exists in **English (source), French, Spanish and Arabic**. Each
language is a complete copy of the content folder:

```
src/content/en/   ← write and edit here first
src/content/fr/
src/content/es/
src/content/ar/
```

Same file names, same front-matter keys; only the human-readable text differs.
The URL structure is shared, so `about/index.md` is `ajrrn.org/about/`,
`fr.ajrrn.org/about/`, `es.ajrrn.org/about/` and `ar.ajrrn.org/about/`.

## How translations are made

Translations are produced by **generative AI (Claude, via Claude Code)** from
the English text and committed as ordinary markdown files. There is no
translation plugin or runtime service. Every non-English page carries a
notice (the `translation_notice` value in that language's `site.md`) saying
that it was translated with generative AI and that the English version is
authoritative, and inviting readers to report errors. Human review and
correction of the translated files is always welcome — just edit the file.

## Keeping the languages in sync

**Every change to the English site is also a change to the French, Spanish
and Arabic sites.** Whenever English content changes — a page body, a
front-matter value, a new or removed file (person, partner, news item, event…),
a menu label, an interface string in `site.md` — the same change is made in
`fr/`, `es/` and `ar/` in the same commit / pull request, so that the four
sites never drift apart.

In a Claude Code session this happens automatically: Claude is instructed
(see `CLAUDE.md`) to translate and apply any English change to the other three
languages as part of the same task, without being asked. You do not need to
request it. If you genuinely want a change in English only (for example a
draft you will finish later), say so explicitly — "English only, don't
translate yet" — and Claude will leave the other languages alone and tell you
they are out of sync. To catch up later:

> Translate the changes made in `src/content/en/news/2026-10-x.md` into
> French, Spanish and Arabic, following docs/TRANSLATION.md, and create/update
> the matching files.

Rules for anyone (human or AI) translating:

1. **Do not change** file names, YAML keys, dates, URLs (`url:`, `link:`,
   markdown link targets), `permalink` (except the language code), booleans,
   `order`, `stream`, `category`, `group`, `pubtype`, email addresses.
2. **Do translate** all other front-matter values and the body.
3. Keep the markdown structure identical (headings, lists, links, emphasis).
4. Keep proper names as they are (Refugee Law Lab, York University, …), with a
   short gloss if helpful.
5. Quote YAML values that contain `: ` or start with a special character.
6. Arabic pages are right-to-left; the templates handle direction
   automatically (`dir="rtl"`). Use Western digits (0–9) unless there is a
   reason not to. Dates are formatted per language by the build.
7. Run `npm run check`: the link checker fails if a page exists in English but
   not in another language. (It cannot tell whether the *text* inside a file
   is up to date — that is why translations are made in the same change as
   the English edit.)

## Terminology (agreed choices — extend as needed)

| English | Français | Español | العربية |
|---|---|---|---|
| Algorithmic Justice for Refugees Research Network | Réseau de recherche sur la justice algorithmique pour les personnes réfugiées | Red de Investigación sobre Justicia Algorítmica para Personas Refugiadas | شبكة أبحاث العدالة الخوارزمية للاجئين |
| rights‑enhancing technologies | technologies favorables aux droits | tecnologías que fortalecen los derechos | التقنيات المعزِّزة للحقوق |
| border control | contrôle des frontières | control fronterizo | مراقبة الحدود |
| forced migration | migration forcée | migración forzada | الهجرة القسرية |
| displaced people | personnes déplacées | personas desplazadas | الأشخاص النازحون |
| people on the move | personnes en déplacement | personas en movimiento | الأشخاص المتنقلون |
| research areas (no "Stream A/B" labels — funder jargon): Human rights and digital border governance / Rights‑enhancing technologies | domaines de recherche : Droits de la personne et gouvernance numérique des frontières / Technologies favorables aux droits | áreas de investigación: Derechos humanos y gobernanza digital de las fronteras / Tecnologías que fortalecen los derechos | مجالات البحث: حقوق الإنسان والحوكمة الرقمية للحدود / التقنيات المعزِّزة للحقوق |
| Consultative Committee | Comité consultatif | Comité Consultivo | اللجنة الاستشارية |
| open access / open source | libre accès / (outils) libres | acceso abierto / código abierto | الوصول المفتوح / مفتوحة المصدر |
| SSHRC | CRSH (Conseil de recherches en sciences humaines du Canada) | SSHRC (Consejo de Investigación en Ciencias Sociales y Humanidades de Canadá) | SSHRC (مجلس أبحاث العلوم الاجتماعية والإنسانية في كندا) |
| Menu: About / Projects / Publications / News & events / Opportunities / Contact | À propos / Projets / Publications / Actualités et événements / Occasions / Contact | Sobre la red / Proyectos / Publicaciones / Noticias y eventos / Oportunidades / Contacto | عن الشبكة / المشاريع / المنشورات / الأخبار والفعاليات / الفرص / اتصل بنا |
| People / Partners / Funders / Contact (About sub-menu) | Notre équipe / Partenaires / Bailleurs de fonds / Contact | Personas / Organizaciones aliadas / Financiadores / Contacto | الفريق / الشركاء / الجهات المموِّلة / اتصل بنا |
| Funder wording (fixed by SSHRC; en/fr are their official texts): "The AJRRN draws on research supported by the Social Sciences and Humanities Research Council of Canada." | « L’AJRRN s’appuie sur des recherches financées par le Conseil de recherches en sciences humaines du Canada. » | «La AJRRN se basa en investigaciones financiadas por el Consejo de Investigación en Ciencias Sociales y Humanidades de Canadá (SSHRC).» | «تستند شبكة AJRRN إلى أبحاث ممولة من مجلس أبحاث العلوم الاجتماعية والإنسانية في كندا (SSHRC).» |
| Research affiliates (People page heading) | Chercheuses et chercheurs affiliés | Personas investigadoras afiliadas | الباحثون المنتسبون |
| Co-applicant / Collaborator (roles on the People page) | Cocandidat·e / Collaborateur·rice | Cosolicitante / Colaborador/a | مقدِّم/ة طلب مشارك/ة / متعاون/ة |
| Host address | Adresse de l'hôte | Dirección de la institución anfitriona | عنوان الجهة المضيفة |

(The table reflects the choices made so far; the translated files themselves
are authoritative — update this table when you change a term.)
