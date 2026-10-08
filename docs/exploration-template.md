# AIPE Exploration template

An Exploration is an open research question or investigation published at
`/explorations/<slug>/` (English) or `/zh/explorations/<slug>/` (Chinese). It
separates what is established from what is proposed, and states exactly what
evidence exists. Copy the template below into `_explorations/<slug>.md` or
`_explorations/zh/<slug>.md`, then run:

```sh
python tools/content_data.py --check
python -m unittest discover -s tests -v
```

The check fails when the status is not supported by the recorded evidence, when
a section is missing or out of order, or when a Hub artifact, domain or link does
not resolve. The shared vocabulary (statuses, evidence kinds, principles) is in
[`_data/explorations.yml`](../_data/explorations.yml).

## Rules

- **Do not invent results.** No simulation output, measurement or reference may
  appear unless it exists and is linked. "None yet" is a valid finding.
- **Separate established knowledge from the hypothesis.** "Existing knowledge"
  cites published work; everything else is labelled as proposal or result.
- **AI reasoning is not validation.** Record AI-assisted analysis as such, check
  every step, and verify every reference against its original source.
- **Simulation is not physical feasibility; human review is not experimental
  validation; neither is journal peer review.** The status labels say which.
- **Negative and inconclusive results are published.** Use `refuted` when the
  evidence contradicts the hypothesis, and keep the page.
- **One language per page.** A translation shares the file name and
  `translation_key`, lives in `_explorations/zh/`, and must carry the same status.
  Do not machine-translate an entry without review; an untranslated entry is
  simply absent from the other language's listing.

## Status and evidence

The status names the strongest evidence recorded so far. It is not a fixed
sequence: an entry can go from Concept straight to Refuted.

| Status | Requires in `evidence` |
| --- | --- |
| `concept` | nothing |
| `under-investigation` | at least one of `literature`, `ai-analysis`, `derivation` |
| `modelled` | a `model` item |
| `simulated` | a `simulation` item |
| `human-reviewed` | a `human-review` item naming the `reviewer` |
| `experimentally-validated` | an `experiment` item |
| `refuted` | any evidence item |

`model`, `simulation` and `experiment` items must `link` to their files or data.
Only entries with recorded evidence may set `featured: true`.

## Hub artifacts

`hub.uses` lists artifacts the investigation could use; `hub.produces` lists
artifacts it has produced. Both take IDs placed in `_data/hub.yml` (a Registry
ID such as `aipe.semiconductor-database`, a website ID such as
`site.llc-fha-gain`, or an Academy lab URL). Linking an artifact never changes
its maturity: a produced dataset or model is placed in the Hub with its own
status, through the normal Registry or `_data/hub.yml` review.

## Template

```markdown
---
title: "Short, specific title"
lang: en                                  # zh for _explorations/zh/
permalink: /explorations/<slug>/          # /zh/explorations/<slug>/ for zh
translation_key: <slug>                   # equals the file name
status: concept
question: "One-sentence research question, ending in a question mark?"
description: "One or two sentences for search results and social cards."
domains: [converters]                     # keys from _data/hub.yml domains
opened: 2026-10-08
updated: 2026-10-08
featured: false
math: true                                # only if the page uses equations
ai_disclosure: "How AI was used to prepare this page, and what has (not) been reviewed."
evidence: []
# evidence:
#   - kind: simulation                    # see _data/explorations.yml evidence_kinds
#     summary: "What was done and what it showed, including its limits."
#     date: 2026-11-01
#     link: https://github.com/<owner>/<repo>/tree/<commit>/simulations
#   - kind: human-review
#     summary: "Checked the derivation in sections 2–3; open concerns recorded in issue #12."
#     reviewer: "Name, affiliation"
#     date: 2026-11-15
hub:
  uses: []                                # Hub artifact IDs this work could use
  produces: []                            # Hub artifact IDs this work produced
learn:                                    # background reading in the same language
  - title: "Page title"
    url: /academy/...
    kind: "AIPE Academy"
---

## Research question

What question is being answered, why it matters and what it would make possible.

## Hypothesis

The proposal, why it might work, the physical principles and assumptions behind
it, and what result would falsify it.

## Existing knowledge

Established theory, technology and literature, with references. How the
proposal differs from existing approaches.

## AI-assisted investigation

The method: derivation, numerical analysis, modelling, simulation, literature
comparison or AI-assisted reasoning. State assumptions, software tools and model
limitations. Before any work is done, describe the planned method.

## Preliminary findings

Actual results only, with observations separated from interpretations. If there
are none, say so.

## Limitations and unknowns

Uncertainties, obstacles, assumptions that may be invalid and alternative
explanations.

## Human review and validation

What scientists and engineers need to review, and the experiments, measurements
or further simulations that could confirm or falsify the hypothesis.

## Open contributions

How others can take part, with links to repositories, datasets, simulation files
or discussions that exist.

### References

1. Authors, "Title," *Venue*, volume, year.
```

Headings for Chinese entries are 研究问题, 假设, 已有知识, AI 辅助研究, 初步发现,
局限与未知, 人工评审与验证 and 开放贡献.
