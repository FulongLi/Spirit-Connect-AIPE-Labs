# Content migration map: Learn, Build, Explore

AIPE is organised around three destinations — **Academy** (learn what we know),
**Hub** (build what we need) and **Explorations** (explore what we don't yet
know) — plus News for product updates. This document records where each kind of
content belongs, what the current article archive contains, and how articles
move without breaking links or duplicating canonical content.

The machine-readable source of truth is
[`_data/blog-ownership.json`](../_data/blog-ownership.json). `tools/content_data.py`
(run in CI and by `tests/test_content.py`) checks that every post is classified
exactly once and that each state is consistent.

## Destinations

| Category | Destination | URL | Canonical owner |
| --- | --- | --- | --- |
| LEARN | AIPE Academy | `/academy/`, `/zh/academy/` | AIPE Academy repository (hash-locked sync) |
| RESEARCH | AIPE Explorations | `/explorations/`, `/zh/explorations/` | This repository (`_explorations/`) |
| BUILD | AIPE Hub | `/hub/`, `/zh/hub/` | AIPE Registry (capabilities) and `_data/hub.yml` (placement) |
| NEWS | News & updates | `/news/`, `/zh/news/` | This repository |

Classification never moves an article by itself. Each post also records a
`migration_status`:

| State | Meaning |
| --- | --- |
| `migrated` | Canonical source lives in the destination. The historical article stays at its URL with a canonical link and a notice. |
| `candidate` | Approved for the next wave. The article stays canonical here until the destination copy is published. |
| `retained` | Stays canonical at its current URL pending an individual review. |
| `routed` | Stays at its URL and is linked from its destination; no canonical move is planned. |

## Audit (8 October 2026)

68 posts: 34 English and 34 Chinese, each English post with a Chinese
counterpart sharing its slug.

- **LEARN — 66 posts.** Converter design (8 topologies plus small-signal
  modelling), device testing and reliability (12), solid-state transformers and
  DAB (9), wireless power (3). All are tutorials on established engineering.
- **NEWS — 2 posts.** "One link to bring power electronics into your AI agent"
  (English and Chinese), an ecosystem announcement.
- **RESEARCH — 0 posts.** No existing article is an open investigation. New
  research questions are published as Explorations, not as blog posts.
- **BUILD — 0 posts.** Reusable designs and files already live in the Hub as
  `site.*` artifacts (DAB, SST and Rogowski-coil references, netlists, scripts).

## Migration waves

Waves are ordered so each one completes a coherent part of the Academy path and
reuses files already in the Hub. Chinese articles follow their English
counterpart once Academy publishes Chinese lessons for that stage; Academy
currently has Chinese lessons only in Foundations.

| Wave | Academy stage | English articles | State |
| --- | --- | --- | --- |
| 0 (pilot) | Power Electronics | buck converter | migrated |
| 1 | Power Electronics | boost converter, buck–boost converter | candidate |
| 1 | Design & Simulation | small-signal modelling of the boost converter | candidate |
| 2 | Power Electronics | Ćuk/SEPIC/Zeta, flyback, forward, push–pull/half-/full-bridge, LLC; device characterisation guide, static characterisation, gate charge, double-pulse testing, robustness | retained |
| 2 | Design & Simulation | junction temperature, steady-state thermal resistance, transient thermal impedance, power cycling, temperature cycling, bias–humidity testing, mission-profile lifetime | retained |
| 3 | Design & Simulation | DAB small-signal model, SST high-frequency transformer, three-phase dq modelling | retained |
| 3 | Systems & Energy | SST introduction, three-stage SST, AC–DC front end, DC–AC output stage, modular SST, DAB principles to control; wireless power for phones, EVs and underwater | retained |
| — | News | AI-agent announcement | routed (linked from the 16 July 2026 News item) |

Wave 1 is a set of candidates, not a completed migration: the Academy lessons
must be authored and reviewed in the AIPE Academy repository first.

## Procedure for migrating one article (from the buck pilot)

1. **In AIPE Academy:** add the attributed teaching source (equations, figures,
   references and downloadable files preserved), its catalogue entry and, where
   useful, an open lab. Record the origin in Academy's migration references.
   Review and merge there.
2. **In this repository:** refresh the pinned Academy revision with
   `tools/sync_ecosystem.py` (see [ecosystem-v0.1.md](ecosystem-v0.1.md)); place
   the new lesson in `_data/academy.yml`.
3. **Keep the historical URL.** Add `academy_source` and `canonical_url` to the
   original post so it shows the notice and points search engines to the lesson.
   Do not delete the post, its figures or its interactive elements.
4. **Update the ownership entry:** `canonical_owner: AIPE-Academy`,
   `migration_status: migrated`. The Academy landing page then stops listing the
   article under "Articles for this stage", because the lesson replaces it.
5. Run the full validation suite.

Retiring an article URL is a separate decision that needs a reviewed redirect
(see `_layouts/redirect.html` and `legacy/`). No article is deleted by a
migration wave.

## What the site shows in the meantime

- The **Academy** landing pages list, under each stage, the not-yet-migrated
  LEARN articles in the page's language ("Articles for this stage"), so the
  learning path is complete without duplicating canonical content.
- The **article library** states that tutorials are being reviewed for Academy
  and points to Explorations and News.
- **News** links the announcement article from its milestone.
