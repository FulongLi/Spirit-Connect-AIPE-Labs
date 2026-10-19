---
layout: agent
title: "AIPE PCB Agent: From Requirements to a Rule-Checked KiCad Design"
permalink: /resources/ai-agent-team/aipe-pcb-agent/
description: "Use AIPE PCB Agent with Codex or Claude Code for AI-assisted power-electronics PCB design in KiCad, with native ERC/DRC checks and a recorded engineering review. An engineering prototype that requires human review."
role: PCB design and review
intro: AI-assisted power-electronics PCB engineering with reproducible KiCad automation, from stated requirements to routed, rule-checked boards and a written design review.
agent: pcb-agent
sections:
  - {id: overview, label: "Overview"}
  - {id: capabilities, label: "What it can do"}
  - {id: quick-start, label: "Getting started"}
  - {id: limits, label: "Important limitations"}
---

## Overview
{: #overview }

**AIPE PCB Agent helps a coding agent carry a power-electronics board from requirements to
a reviewable KiCad design.** It turns the task into explicit inputs and assumptions, drives
KiCad through reproducible automation, runs KiCad's own checks, and records a design review
that keeps every open issue visible.

It is an **engineering prototype**. Its example designs are review packages, not validated
hardware: nothing has been fabricated, energised or measured, and every result requires
human engineering review.

## What it can do
{: #capabilities }

- Translate a design task into SI-unit requirements with a separate assumption register,
  and produce reproducible calculations and component stress and loss estimates.
- Create KiCad schematic sheets and boards through scripted automation: component placement,
  stack-up and routing of the intended connections.
- Run KiCad's native ERC and DRC, unconnected-item and schematic-parity checks, and export
  schematic and board PDFs, Gerber and drill files.
- Review the design against a written PCB rule set, recording each rule as pass, fail,
  unverified or not applicable with its evidence.
- Draw on an engineering knowledge base learned from manufacturer reference designs, covering
  SiC gate drivers and their layout, DC-link capacitors, isolated gate bias, sensing and
  thermal placement.

The main worked example is a 400 V to 200 V, 5 kW SiC synchronous buck with a power board
and a control board, both routed with clean native ERC/DRC results, and a design review
that lists its release holds. See the
[V3 example package](https://github.com/FulongLi/AIPE-PCB-Agent/blob/main/examples/sic-buck-400v-200v-5kw-v3/README.md).

## Getting started
{: #quick-start }

You need Python 3.10 or newer and a KiCad installation. The agent discovers and records the
KiCad executables on your machine; installing any software requires your confirmation.

1. Open Codex or Claude Code in the folder where you want to work.
2. Copy the prompt below, paste it into the agent and describe your board: input and output
   ratings, topology, mechanical limits and anything already decided.
3. Let the agent inspect the environment first. From the repository root it can run
   `python -m automation.setup.detect_environment` and the test suite; the detector does not
   install software.
4. Review the ERC/DRC results, the assumption register and the design review with the agent
   before you rely on any part of the design.

{% include agent-prompt.html agent='pcb-agent' lang='en' %}

The [repository README](https://github.com/FulongLi/AIPE-PCB-Agent) and its
[workflow and acceptance gates](https://github.com/FulongLi/AIPE-PCB-Agent/blob/main/docs/agent-workflow.md)
describe the full process and the reproduction instructions for each example.

## Important limitations
{: #limits }

- **Human engineering review is required.** The current release is blocked pending hardware
  qualification and human review; no fabrication or energisation is approved.
- **Clean ERC/DRC is a CAD statement.** It shows that the drawing meets its rule set, not that
  the board is electrically, thermally, EMI or insulation safe.
- **Not hardware-validated.** No example board has been built or tested, and knowledge-base
  entries are reference-derived or analytically checked, not simulated or measured.
- **High voltage is dangerous.** Never build or power a design from this tool without a
  qualified engineer's review, test plan and safe laboratory practice.
