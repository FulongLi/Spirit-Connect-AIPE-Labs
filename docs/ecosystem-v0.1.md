# AIPE presentation integration

AIPE means **AI for Power Engineering**. This website presents capabilities and
education maintained in other repositories. Registry owns capability discovery;
Academy owns canonical teaching material. This repository still owns branding,
navigation, SEO and editorial RESEARCH/BUILD/NEWS content.

## Reproducible synchronization

```sh
python -m pip install -r requirements-dev.txt
python tools/sync_ecosystem.py --registry ../AIPE-Registry --academy ../AIPE-Academy
python tools/sync_ecosystem.py --check
python -m unittest discover -s tests -v
bundle exec jekyll build --strict_front_matter
python tools/check_public_build.py _site
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

The Academy has no invented bilingual counterpart URLs: its navigation links to
actual English and Chinese entry points, and equivalent-language SEO links are
omitted unless translations are explicitly provided.

## Delivery boundary

This change does not deploy or merge the site. Core and Registry initialization
are implemented locally but their upstream repositories were empty and GitHub
refused forks. Until a maintainer supplies an initial baseline, Registry snapshots
represent the reviewed local integration, not a published Registry release. The
source lock records this limitation; it must not claim a remotely available tag.
After those PRs merge, refresh from published commits and review the resulting
website diff. Existing AIPS names remain transitional; no legacy repository is
deleted or archived.
