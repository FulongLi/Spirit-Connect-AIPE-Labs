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
- **Resources** — reusable building blocks and prototype design references.
- **Claude/Codex Plugin** — a simple workflow for giving coding agents access to the public index.
- **Company** — the AIPE Labs story, team, news, careers, FAQs, and contact details.
- **English and Chinese pages** — mirrored navigation and content for both audiences.

## Project structure

```text
├── _includes/       Shared navigation, footer, and scripts
├── _layouts/        Default, post, legal, and legacy redirect layouts
├── _posts/          News and project updates
├── accessories/     Engineering reference assets
├── assets/          Stylesheets and site assets
├── case-studies/    Source files for prototype design reference pages
├── company/         About, team, careers, and FAQ pages
├── database/        Magnetics and transistor database pages
├── legacy/          Redirects from superseded public URLs
├── legal/           Privacy, terms, and cookie pages
├── power/           Power engineering pages
├── resources/       Resource landing pages
├── zh/              Chinese-language pages
├── aipe.md          Agent-readable public index
└── index.md         English homepage
```

The source directories do not always match the final public URL. Prototype references, for example, are published under `/resources/prototypes/`. Existing public links under the former `/case-studies/` hierarchy are retained as redirects.

## Local development

The site is built with Jekyll and is compatible with GitHub Pages.

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
