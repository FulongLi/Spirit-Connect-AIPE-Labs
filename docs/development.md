# Development: local build, pre-publish checks and adding a capability

## Local development

The site is built with Jekyll and is compatible with GitHub Pages. CI uses Ruby 3.3 and Bundler 2.6.9.

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000/`.

The Python tooling (`tools/`, `tests/`) needs Python 3.10 or newer and PyYAML:

```bash
python -m pip install -r requirements-dev.txt
```

## Before publishing, run

```bash
python tools/sync_ecosystem.py --check
python tools/hub_data.py --check
python tools/content_data.py --check
python -m unittest discover -s tests -v
bundle exec jekyll build --trace
python tools/check_public_build.py _site
python tools/check_site_links.py _site
git diff --check
```

The Python checks run without Ruby; the Jekyll build and the two `_site` checks need the Ruby toolchain.
CI (`.github/workflows/validate-ecosystem.yml`) additionally checks out the pinned AIPE Academy revision
(`tools/academy_source_lock.py`), rebuilds the generated Academy pages (`tools/build_academy.py`) and builds
the site with `--strict_front_matter`.

## Adding a capability to the site

Hub cards never restate Registry metadata. To add a capability to the site, refresh the Registry snapshot,
run `python tools/hub_data.py --write`, and place the new ID in `_data/hub.yml`. See
[Hub presentation data](ecosystem-v0.1.md#hub-presentation-data).

## Ecosystem contract

AIPE means **AI for Power Engineering**. Capability metadata is maintained by AIPE Registry, and teaching
content by AIPE Academy. This site consumes reviewed outputs. See the
[synchronization, ownership and URL contract](ecosystem-v0.1.md) and the
[capability manifest](../aipe.yaml). The Academy entry point is published at
<https://aipel.co.uk/academy/>.

## Licence and contact

See [LICENSE.md](../LICENSE.md) for licensing details.

- Email: [info@spiritconnect.co.uk](mailto:info@spiritconnect.co.uk)
- Location: Cardiff, United Kingdom
- Website: <https://aipel.co.uk>
