# AIPE — Labs Website

[![Jekyll](https://img.shields.io/badge/Jekyll-4.3-blue)](https://jekyllrb.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-enabled-brightgreen)](https://pages.github.com/)

AIPE - **AI for Power Engineering** - is the open engineering platform for power and energy built around
three parts: **Learn** established knowledge in AIPE Academy, **Build** with reusable data, models,
designs, tools and labs in AIPE Hub, and **Explore** open research questions in AIPE Frontiers. This
repository is the human-facing presentation layer of that ecosystem (Registry id `aipe.presentation`): a
Jekyll site that publishes [aipel.co.uk](https://aipel.co.uk/) together with the Registry's
agent-readable (`aipe.md`) and machine-readable (`aipe.json`) endpoints. It does not implement the
databases, agents or tools; each lives in its own repository and stays the source of truth.

## Features

- Hub, Engineering, Academy and Frontiers sections with English and Chinese mirrors, in-page tabs and
  stable redirects from superseded URLs
- Academy lessons, knowledge graph and academic references published from a pinned AIPE Academy revision
  (hash-locked and generated, never hand-edited)
- Hub project cards driven by `_data/hub.yml`, with detailed metadata left to the Registry;
  `aipe.md` / `aipe.json` served unchanged
- Frontiers topics carry an evidence status that the build checks against the recorded evidence, so
  hypotheses are never shown as results
- Articles and news classified LEARN / RESEARCH / BUILD / NEWS; team and agent pages rendered from data
  files
- Python tooling and tests that check synchronisation, hub data, content ownership, the public build and
  site links before publishing

## Installation

The Python checks need Python 3.10 or newer and PyYAML; building the site needs Ruby 3.3 with Bundler
(`bundle install`), as in CI.

```sh
python -m pip install -r requirements-dev.txt
```

## Usage

```sh
python tools/sync_ecosystem.py --check
python tools/hub_data.py --check
python tools/content_data.py --check
python -m unittest discover -s tests -v
bundle exec jekyll serve          # requires Ruby and Bundler; then open http://localhost:4000/
```

Give a compatible coding agent `https://aipel.co.uk/aipe.md` to discover AIPE capabilities; it is a public
index, not an executable model or application.

## Project Information

- Version: not versioned as a package; the site presents AIPE ecosystem v0.1 (`aipe.yaml`
  `schema_version` 0.1.0) and builds with Jekyll 4.3.4 (`Gemfile.lock`)
- Status: Prototype (`aipe.yaml`: status `active`, maturity `prototype`); the site is live at aipel.co.uk,
  the AIPE Plugin entry is planned
- Developer: Fulong Li
- Organisation: Spirit Connect / AIPE Labs (Cardiff, United Kingdom;
  [info@spiritconnect.co.uk](mailto:info@spiritconnect.co.uk))
- License: CC BY 4.0 ([LICENSE.md](LICENSE.md)); content mirrored from AIPE Registry and AIPE Academy
  keeps its source licences

## Documentation

- [Site structure, sections and editorial conventions](docs/site-structure.md)
- [Development: local build, pre-publish checks, adding a capability](docs/development.md)
- [Ecosystem synchronisation, ownership and URL contract](docs/ecosystem-v0.1.md) ·
  [Capability manifest](aipe.yaml)
- [AIPE Plugin architecture note](docs/aipe-plugin-architecture.md) ·
  [Content migration map](docs/content-migration-map.md) ·
  [Frontiers entry template](docs/exploration-template.md)
