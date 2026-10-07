# AIPE presentation integration

AIPE means **AI for Power Engineering**. This website presents capabilities and
education maintained in other repositories. Registry owns capability discovery;
Academy owns canonical teaching material. This repository still owns branding,
navigation, SEO and editorial RESEARCH/BUILD/NEWS content.

## Reproducible synchronization

```sh
python -m pip install -r requirements-dev.txt
python tools/sync_ecosystem.py --registry ../AIPE-Registry --academy ../AIPE-Academy
python tools/hub_data.py --write
python tools/sync_ecosystem.py --check
python tools/hub_data.py --check
python -m unittest discover -s tests -v
bundle exec jekyll build --strict_front_matter
python tools/check_public_build.py _site
python tools/check_site_links.py _site
```

Before refresh, validate the Registry and Academy source checkouts and commit
their changes. The synchronizer reads generated Registry JSON/Markdown and the
Academy catalogue, verifies lesson hashes/references, converts relative links,
and copies teaching assets. It rejects source Liquid and path escapes before
writing. Only generated presentation artifacts are copied; no external code is
executed. Text uses canonical UTF-8/LF for Windows/Linux reproducibility.
CI uses Ruby 3.3 and Bundler 2.6.9; the legacy Bundler 1.17 lock metadata was
incompatible with Ruby 3.3. Existing gem dependency versions remain pinned.

`_data/ecosystem-lock.json` records canonical source identities, actual checkout
repositories, immutable commits, input hashes and every generated artifact hash.
CI checks out Academy at that exact reviewed revision and regenerates its pages
before Jekyll. Registry output is consumed as a hash-locked data snapshot. Updates
to either source require an explicit refresh and reviewable PR; builds never
follow an unpinned `main` or silently rewrite another repository. Contributors
can validate and build the committed presentation offline after dependencies are
installed. A source checkout in a fork is recorded as such until its PR is merged.

Public endpoints are `/aipe.json` and `/aipe.md` (raw generated files), and
`/academy/<domain>/<slug>/`. Folder changes in Academy do not change lesson URLs.
Retiring a generated URL requires a reviewed redirect; synchronization refuses
to silently delete it. The Academy index shows whether each item is an outline,
draft or available lesson. Public readers do not need to open GitHub for lessons.
Supporting curriculum-research documents may link to their canonical repository.
The former manually curated index is preserved unchanged as
[the historical v0 resource index](../legacy/aipe-resource-index-v0.md), so useful
legacy hardware/reference links remain accessible without polluting Registry's
canonical capability set. Its original terminology describes that older snapshot.

## Hub presentation data

The public site is organised as an **AIPE Hub** (artifact dimension: Data,
Models, Designs, Tools & Agents, Labs) and **Engineering** domains (Devices,
Magnetics, Converters, Control, Energy Storage, Microgrids, Energy Systems).
Both views, the homepage feed, the Plugin page capability cards and the
client-side search index are rendered from these data files:

| File | Owner | Role |
| --- | --- | --- |
| `_data/registry.json` | derived | Byte-identical mirror of `/aipe.json`. GitHub Pages cannot read a root file from Liquid, so `tools/hub_data.py --write` copies it after every Registry sync. Never edit it by hand. |
| `_data/hub.yml` | this site | Placement only: Hub category, engineering domains, featured order and on-site pages for each artifact. Registry artifacts carry no restated metadata; only website-owned artifacts (`id: site.*`) describe themselves. |
| `_data/academy.yml` | this site | Groups generated lesson URLs into learning stages for `/academy/` and `/zh/academy/`, with stage labels and a Hub route in both languages. Lesson titles, language, status and durations come from the generated pages. |
| `_data/plugin.yml` | this site | The plain-language capability areas on `/plugin/`; each names the Registry IDs it draws on, whose names and maturity are read from the mirror. |

Registry descriptions are English. Each Registry placement in `_data/hub.yml`
carries a reviewed `zh_summary`, so Chinese cards and search never show the
English description; capability identifiers and limitations are not shown on
Chinese cards, which instead point to the English technical index.

`tools/hub_data.py --check` (also run by `tests/test_hub.py` and CI) fails when
the mirror drifts from `/aipe.json`, when a Registry capability is not placed
exactly once, or when an ID, file or URL does not resolve. A Registry refresh that
adds a capability therefore needs a one-line placement in `_data/hub.yml` in the
same reviewed PR. A new Academy lesson not yet placed in a stage only produces a
warning: `/academy/` lists it automatically under "More from the catalogue".

### Academy language separation

The Academy has two single-language entry points rendered by
`_layouts/academy.html`: `/academy/` (the generated, hash-locked
`academy/index.md`) lists lessons whose front matter says `lang: en`, and
`/zh/academy/` (the site-owned `zh/academy/index.md`) lists `lang: zh` lessons.
Neither falls back to the other language: a stage without a lesson in the page
language shows a planned state, and Prerequisite/Continue links on a lesson are
limited to lessons in the same language. The catalogue table is rebuilt from the
same filtered lessons; the generated bilingual table inside `academy/index.md` is
kept byte-for-byte but no longer displayed. Generated lessons still carry
`zh_url: /academy/foundations/prerequisite-path-zh/`; the navbar ignores those
fields on Academy pages and switches between the two entry points instead. A
future Academy refresh can drop them in `tools/sync_ecosystem.py`; that is a
hash-locked regeneration and needs its own reviewed PR. Wording inside lesson
bodies (for example "prerequisite path (中文)" in the English foundations outline)
is canonical Academy content and is corrected in AIPE Academy, not here.
`aipe.md` and `aipe.json` keep their role as the agent- and machine-readable
Registry interfaces; the installable AIPE Plugin is planned
([architecture note](aipe-plugin-architecture.md)) and the site labels it so.

Former `Resources` navigation was replaced without moving any page. `/resources/`
and `/power/` (previously unpublished) now redirect to `/hub/` and
`/engineering/`, and their Chinese equivalents likewise.

## Content ownership and URL preservation

`_data/blog-ownership.json` classifies all current English/Chinese posts as
LEARN, RESEARCH, BUILD or NEWS with an ownership decision. Classification does
not automatically move an article. Most current posts are educational tutorials;
editorial categories remain available for future posts.

The English buck-converter tutorial is the first migration pilot. Academy holds
the attributed editable teaching source and an open Python lab. The original
website URL retains its historical article, figures and interactive explorer;
its canonical tag and notice point to the Academy lesson. This historical copy
is intentionally retained to preserve existing links and functionality. Future
teaching corrections belong in Academy. Its Chinese counterpart and all other
posts retain their original paths pending individual migration reviews.

The Academy has no invented bilingual counterpart URLs. Equivalent-language SEO
links connect only `/academy/` and `/zh/academy/`; individual lessons omit them
unless translations are explicitly provided.

## Delivery boundary

This change does not deploy or merge the site. Core and Registry initialization
are implemented locally but their upstream repositories were empty and GitHub
refused forks. Until a maintainer supplies an initial baseline, Registry snapshots
represent the reviewed local integration, not a published Registry release. The
source lock records this limitation; it must not claim a remotely available tag.
After those PRs merge, refresh from published commits and review the resulting
website diff. Existing AIPS names remain transitional; no legacy repository is
deleted or archived.
