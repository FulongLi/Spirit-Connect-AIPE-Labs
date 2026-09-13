# AIPE Labs

[![Jekyll](https://img.shields.io/badge/Jekyll-4.0-blue)](https://jekyllrb.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-enabled-brightgreen)](https://pages.github.com/)
[![Category: power engineering](https://img.shields.io/badge/category-power%20engineering-lightgrey)](https://aipel.co.uk/)
[![Status: active](https://img.shields.io/badge/status-active-success)](https://aipel.co.uk/)

Public website and agent-readable capability index for [AIPE Labs](https://aipel.co.uk/), an open platform for **AI in power engineering**.

## The platform model

The whole repository is organised around one model. Read this before moving anything.

| Layer | What it is | Where it lives |
| --- | --- | --- |
| **Knowledge** | Engineering explanation, design equations, testing methodology, standards | `power/` — one page per engineering domain |
| **Databases** | The same engineering reality as machine-readable data: curves, surfaces, loss models, thermal networks, with measurement conditions | `resources/databases/` |
| **Tools** | One bounded engineering operation each: input → operation → output | registered in `_data/resources.yml` |
| **Agents** | Specialist reasoning that reads knowledge, queries databases, calls tools and judges the result | registered in `_data/resources.yml` (none published yet) |
| **Workflows** | Knowledge, data, tools and agents combined into a complete engineering task | registered in `_data/resources.yml` |
| **Design References** | Worked examples showing what the combination produces | `resources/design-references/` |

Knowledge is organised into four **engineering domains** — Devices, Magnetics, Converters, Systems — defined once in `_data/domains.yml`. Every database, tool, agent, workflow and design reference is tagged with those domain ids.

Use **Design Reference** as the term for a worked engineering example. Not "prototype", not "case study", not "reference design". The old `/case-studies/` and `/resources/prototypes/` URLs survive only as redirect stubs in `redirects/`.

Use **Engineering Notes** as the public name for `/resources/blog/`. The permalink keeps the word `blog`; the label does not.

## Two interfaces, one registry

The site serves people; `aipe.md` serves coding agents. Both are generated from the same registries, so they cannot describe different ecosystems.

```text
https://aipel.co.uk/          human interface
https://aipel.co.uk/aipe.md   machine interface  (built from aipe-index.html)
```

`aipe-index.html` carries an `.html` extension deliberately: Jekyll converts any `.md` source to HTML, and this file must publish as plain Markdown. The `.html` source is passed through untouched while Liquid still runs.

## Shared data

| File | Purpose |
| --- | --- |
| `_data/domains.yml` | The four engineering domains, with bilingual labels and card artwork |
| `_data/capabilities.yml` | Engineering tasks — Design, Analyse, Simulate, Validate, Build, Document — each with an honest statement of what supports it today |
| `_data/resources.yml` | The capability registry: databases, tools, agents, workflows, design references |
| `_data/statuses.yml` | The maturity vocabulary, and the rule for using it |
| `_data/navigation.yml` | Navbar and footer structure for both languages |
| `_data/partners.yml` | Partner logos and alt text |
| `_data/i18n.yml` | Short UI strings used inside shared includes |

Edit the registry, not the markup. A new database, tool, agent, workflow or design reference should appear on the homepage, on `/resources/`, on its catalogue page and in `aipe.md` from a single entry.

### Engineering honesty

Every registry entry carries a `status` from `_data/statuses.yml`, and it is rendered on the page. A status is a claim about evidence, not ambition — do not promote one to make a page read better. `analytical` is not `simulated`; `simulated` is not `hardware-tested`. An empty layer (`agents:` today) is an honest answer and is rendered as such.

The same rule applies to page copy, not just to registry entries. No AIPE specialist agent is published, so no page may describe one working — not as "the AI Agent", not as automated search, tuning or test-plan generation. A page describing a `documented` workflow says that the steps are published, not that a pipeline ran.

The English and Chinese versions of a page make the same claims. When a claim is corrected in one language, correct it in the other in the same change.

## Project structure

```text
├── _data/                 Shared registries — see the table above
├── _includes/             Shared markup: navbar, footer, cards, engineering figures
├── _layouts/              default, post, legal, redirect
├── _posts/                Engineering notes
├── _sass/                 Stylesheet partials, imported in order by assets/style.scss
├── power/                 Engineering knowledge, one page per domain
│   ├── devices.md         /power/devices/
│   ├── devices/           /power/devices/characterisation/
│   ├── magnetics.md       /power/magnetics/
│   ├── converters.md      /power/converters/
│   └── systems.md         /power/systems/  (microgrids are covered here)
├── resources/             The capability stack
│   ├── index.md           /resources/
│   ├── databases.md       /resources/databases/          catalogue
│   ├── databases/         /resources/databases/*/        the database pages
│   ├── design-references.md   /resources/design-references/       catalogue
│   ├── design-references/     /resources/design-references/*/     the references
│   └── blog.md            /resources/blog/                    Engineering Notes
├── company/               About, team, careers, FAQ
├── legal/                 Privacy, terms, cookies
├── redirects/             Redirect stubs for superseded public URLs (en/ and zh/)
├── zh/                    Chinese pages, mirroring the English tree
├── accessories/           Rogowski-coil board renders, kept at their original public paths
├── assets/                Stylesheet, engineering-note figures, circuit data, downloads
├── images/                Photographs, logos and card artwork
├── tools/                 Figure-generation scripts (excluded from the build)
├── aipe-index.html        Source of /aipe.md
├── aipe.txt               Compatibility stub pointing at /aipe.md
└── index.md               English homepage
```

Source paths mirror public URLs. Two exceptions, both deliberate:

- `redirects/` exists only to keep old public URLs working — never delete a stub without checking what links to it.
- `accessories/transducers/images/` holds the Rogowski board renders at the paths they were first published at. Moving them would break externally hot-linked images and cannot be redirected the way a page can, so they stay.

## English and Chinese

Every English page has a Chinese counterpart at the same path under `/zh/`. Navigation labels come from `_data/navigation.yml` and `_data/domains.yml`, which carry both languages side by side, so the two navigations cannot drift apart. Adding an English page means adding its Chinese counterpart.

Body copy stays in the page, in its own language. Do not force translated prose into a data file.

A registry entry whose page exists in English only (an engineering note, for example) must set `lang_neutral: true` so the `/zh` prefix is not applied to it.

Engineering notes are the one deliberate exception to the mirror rule: they are published in English only. Every post must therefore set `zh_url: /zh/resources/blog/` in its front matter, so the language switcher lands on the Chinese notes index instead of a page that does not exist.

## Styling

Plain Jekyll and Sass — no React, no Tailwind, no SPA framework. `assets/style.scss` imports the partials in `_sass/` and the import order *is* the cascade, so do not reorder it casually.

CSS `min()` and `max()` are written as `#{"min(...)"}` throughout `_sass/`: Sass owns those function names, and libsass — which GitHub Pages uses — fails on CSS units it cannot compare. The interpolation passes the CSS through untouched on both libsass and dart-sass.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000/`.

## Language and editorial conventions

English copy uses British English. Public navigation labels, page titles, URL paths, and cross-language links should remain aligned across the English and Chinese versions.

## Licence and contact

See [LICENSE.md](LICENSE.md) for licensing details.

- Email: [info@spiritconnect.co.uk](mailto:info@spiritconnect.co.uk)
- Location: Cardiff, United Kingdom
- Website: [https://aipel.co.uk](https://aipel.co.uk/)
