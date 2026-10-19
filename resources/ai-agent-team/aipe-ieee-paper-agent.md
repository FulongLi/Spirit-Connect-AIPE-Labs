---
layout: agent
title: "AIPE IEEE Paper Agent: From Research Idea to IEEE Manuscript"
permalink: /resources/ai-agent-team/aipe-ieee-paper-agent/
description: "Use AIPE IEEE Paper Agent with Codex or Claude Code to turn a research idea into an evidence-linked paper plan and a LaTeX manuscript workspace built on official IEEE templates."
role: Research writing
intro: Turn a research idea into an evidence-linked paper plan, then into a LaTeX manuscript workspace built on the official template of your target IEEE venue.
agent: ieee-paper-agent
sections:
  - {id: overview, label: "Overview"}
  - {id: capabilities, label: "What it can do"}
  - {id: quick-start, label: "Getting started"}
  - {id: limits, label: "Important limitations"}
---

## Overview
{: #overview }

**AIPE IEEE Paper Agent is a structured workflow for research writing with a coding agent.**
It starts from the research idea rather than the prose: it builds the problem, gap, idea,
evidence and impact of the paper, maps every important question to the evidence that would
answer it, and only then drafts into a real venue template.

It never invents results or reference metadata. Missing evidence is marked as blocking,
important or optional, so you can see what work the paper still needs.

## What it can do
{: #capabilities }

- Turn a research idea into research questions, two to four verifiable contribution claims,
  and an evidence, figure and table plan.
- Create a LaTeX manuscript workspace from the official template of six IEEE venues: IEEE
  conferences, IEEE Transactions, IEEE Access, IEEE OJPEL, IEEE TAI and IEEE OJCSYS. The
  workspace keeps each template's document class and front matter and works on Overleaf.
- Index a BibTeX reference collection, audit citations for missing entries and duplicate keys,
  and check the LaTeX structure against the venue profile.
- Add an optional power-electronics domain pack with curated knowledge, terminology and
  literature guidance.
- Guide drafting and reviewer responses through maintained workflows for writing, citation
  rules and research reasoning.

## Getting started
{: #quick-start }

You need Python 3.10 or newer; no Python packages are required. To build a PDF, use a LaTeX
distribution or upload the generated workspace to Overleaf.

1. Open Codex or Claude Code in the folder where you want to work.
2. Copy the prompt below, replace the placeholder with your research idea, and paste it into the agent.
3. Review the paper plan and evidence gaps before any drafting starts.
4. Choose your venue. The agent creates the workspace with the repository's
   `scripts/create-manuscript.py` and runs the citation and LaTeX checks.

{% include agent-prompt.html agent='ieee-paper-agent' lang='en' %}

**Native installation.** The repository also documents packaged installs as a Codex skill, a
local Codex plugin marketplace or a Claude skill, built with its own release script. Follow
its [installation guide](https://github.com/FulongLi/AIPE-IEEE-Paper-Agent/blob/main/INSTALL.md).

## Important limitations
{: #limits }

- **You supply the evidence.** The agent plans and drafts around your results and references;
  it does not produce experimental results.
- **Checks are static.** The citation and LaTeX checks do not verify that citations are true or
  compile a PDF. Verify sources yourself and review the compiled paper.
- **A workspace is not a submission.** A new workspace contains explicit TODOs. Check the
  venue's current author instructions before you submit.
- **Licence is unresolved.** The repository-wide licence has not been stated yet, and
  third-party templates and assets keep their own rights.
