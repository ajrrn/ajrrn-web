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

When you change English content, make the same change in the other three
folders. The easiest way, in a Claude Code session in this repository:

> Translate the changes I just made in `src/content/en/news/2026-10-x.md` into
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
   not in another language.

## Terminology (agreed choices — extend as needed)

| English | Français | Español | العربية |
|---|---|---|---|
| Algorithmic Justice for Refugees Research Network | Réseau de recherche sur la justice algorithmique pour les personnes réfugiées | Red de Investigación sobre Justicia Algorítmica para Personas Refugiadas | شبكة أبحاث العدالة الخوارزمية للاجئين |
| rights‑enhancing technologies | technologies favorables aux droits | tecnologías que fortalecen los derechos | التقنيات المعزِّزة للحقوق |
| border control | contrôle des frontières | control fronterizo | مراقبة الحدود |
| forced migration | migration forcée | migración forzada | الهجرة القسرية |
| displaced people | personnes déplacées | personas desplazadas | الأشخاص النازحون |
| people on the move | personnes en déplacement | personas en movimiento | الأشخاص المتنقلون |
| research streams (Stream A / B) | axes de recherche (Axe A / B) | líneas de investigación (Línea A / B) | المسارات البحثية (المسار أ / ب) |
| Consultative Committee | Comité consultatif | Comité Consultivo | اللجنة الاستشارية |
| open access / open source | libre accès / (outils) libres | acceso abierto / código abierto | الوصول المفتوح / مفتوحة المصدر |
| SSHRC | CRSH (Conseil de recherches en sciences humaines du Canada) | SSHRC (Consejo de Investigación en Ciencias Sociales y Humanidades de Canadá) | SSHRC (مجلس أبحاث العلوم الاجتماعية والإنسانية في كندا) |
| Menu: About / Projects / Publications / Events / News / Opportunities / Contact | À propos / Projets / Publications / Événements / Actualités / Occasions / Contact | Sobre la red / Proyectos / Publicaciones / Eventos / Noticias / Oportunidades / Contacto | عن الشبكة / المشاريع / المنشورات / الفعاليات / الأخبار / الفرص / اتصل بنا |
| People / Partners (About sub-menu) | Notre équipe / Partenaires | Personas / Organizaciones aliadas | الفريق / الشركاء |
| Host address | Adresse de l'hôte | Dirección de la institución anfitriona | عنوان الجهة المضيفة |
| "(placeholder)" | "(provisoire)" | "(provisional)" | "(نص مؤقت)" |

(The table reflects the choices made so far; the translated files themselves
are authoritative — update this table when you change a term.)
