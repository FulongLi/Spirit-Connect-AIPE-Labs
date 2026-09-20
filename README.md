# AIPE Labs

[![Jekyll](https://img.shields.io/badge/Jekyll-4.0-blue)](https://jekyllrb.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-enabled-brightgreen)](https://pages.github.com/)
[![Category: power electronics](https://img.shields.io/badge/category-power%20electronics-lightgrey)](https://aipel.co.uk/)
[![Status: active](https://img.shields.io/badge/status-active-success)](https://aipel.co.uk/)

This repository contains the public website and agent-readable resource index for [AIPE Labs](https://aipel.co.uk/). The project connects practical power engineering knowledge with coding agents so engineers can move more efficiently from research and modelling to design, validation, and documentation.

## One link for coding agents

Give a compatible coding agent this URL:

```text
https://aipel.co.uk/aipe.md
```

The Markdown index describes the resources that are currently available and points the agent towards relevant packages, specialist agents, databases, prototype design references, and engineering guidance. It is a public index, not an executable model or application.

## Website content

- **Power Engineering** — converters, power semiconductor devices, characterisation, and microgrids.
- **Resources** — engineering updates, prototype design references, component databases, and the AI Agent Team.
- **Claude/Codex Plugin** — a simple workflow for giving coding agents access to the public index.
- **Company** — the AIPE Labs story, team, news, careers, FAQs, and contact details.
- **English and Chinese pages** — mirrored navigation and content for both audiences.

## Project structure

```text
├── _data/           Translation, partner, and shared content data
├── _includes/       Shared navigation, footer, figures, and components
├── _layouts/        Default, post, legal, and redirect layouts
├── _posts/          Engineering articles and project updates
├── accessories/     Published engineering reference assets
├── assets/          Stylesheets, article figures, circuits, and downloads
├── company/         About, team, careers, and FAQ pages
├── database/        Magnetics and transistor database sections
├── legacy/          Redirects from superseded public URLs
├── legal/           Privacy, terms, and cookie pages
├── power/           Converter, device, and microgrid sections
├── resources/       Blog, database, prototype, and AI Agent Team sections
├── zh/              Chinese mirror of the public site structure
├── aipe.md          Agent-readable public index
└── index.md         English homepage
```

Source directories mirror the final public URL hierarchy. Existing public links under superseded paths such as `/case-studies/` are retained through the files in `legacy/`.

## Local development

The site is built with Jekyll and is compatible with GitHub Pages.

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000/`.

## Language and editorial conventions

English copy uses British English. Public navigation labels, page titles, URL paths, and cross-language links should remain aligned across the English and Chinese versions.

Blog articles live in `_posts/` (English) and `_posts/zh/` (Chinese). A translated article should use the same filename slug as its source and set `lang: zh`; the layouts then discover the matching article automatically and render language-switch and `hreflang` links. If matching slugs are not possible, give both files the same `translation_key`. Keep series navigation in the shared files under `_includes/` rather than duplicating it inside articles.

Generated build output (`_site/`, `.jekyll-cache/`), local dependencies (`vendor/`, `.bundle/`) and scratch output (`output/`) are ignored. Public assets belong in `assets/`, `images/` or `accessories/`; one-off generation utilities belong in `tools/` and are excluded from the published site.

Before publishing, run:

```bash
bundle exec jekyll build --trace
git diff --check
```

## Licence and contact

See [LICENSE.md](LICENSE.md) for licensing details.

- Email: [info@spiritconnect.co.uk](mailto:info@spiritconnect.co.uk)
- Location: Cardiff, United Kingdom
- Website: [https://aipel.co.uk](https://aipel.co.uk/)
