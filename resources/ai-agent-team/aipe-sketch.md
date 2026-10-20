---
layout: agent
title: "AIPE Sketcher — AI-Powered Electrical Schematic Generation"
permalink: /resources/ai-agent-team/aipe-sketch/
description: "Install AIPE Sketcher as a Codex or Claude Code plugin, describe a circuit in plain English, and get an electrically checked SVG schematic with a JSON validation report."
role: Schematic generation
intro: Turn circuit descriptions into clear, electrically checked SVG schematics with AIPE Sketcher.
agent: sketch
start: install-codex
video_alt: "AIPE Sketcher Quick Start tutorial (99 seconds, captions, no sound): install the plugin, describe a circuit, get a schematic"
sections:
  - {id: overview, label: "Overview"}
  - {id: install-codex, label: "Install with Codex"}
  - {id: install-claude-code, label: "Install with Claude Code"}
  - {id: quick-start, label: "Generate your first schematic"}
  - {id: capabilities, label: "What it can do"}
  - {id: outputs, label: "Output files"}
  - {id: limits, label: "Before you use it"}
  - {id: licence, label: "Licence"}
---

## Describe it. Generate it. Validate it.
{: #overview }

**AIPE Sketcher turns a circuit description into a clean SVG schematic and checks that the
drawing is electrically faithful to it.** Describe the circuit to Codex or Claude Code in
plain English, or name a reference converter, and AIPE Sketcher draws it with a standard
symbol library and reports what it checked.

It installs as a native plugin in Codex and Claude Code. Drawing and validation run locally
on your computer: it needs Python 3.9 or newer, and no API key, cloud service or extra
package installation.

The 99-second Quick Start video above shows the installation and a first schematic. It has
captions and no sound. Its Codex and Claude Code windows are simplified reconstructions of
the apps, not screen recordings; the agent replies and the schematic come from a real run.

## Install with Codex
{: #install-codex }

In the Codex app (Codex in the ChatGPT desktop app works too):

1. Open Codex.
2. Go to **Plugins**.
3. Choose **Add a marketplace**, enter `FulongLi/AIPE-Sketcher` as the source and confirm
   with **Add marketplace**.
4. Select **AIPE Sketcher** in the list and click **Install**.
5. Start a new chat and describe the circuit you want.

Prefer the command line? Run these two commands, then restart Codex:

{% include agent-plugin-install.html agent='sketch' host='codex' lang='en' %}

## Install with Claude Code
{: #install-claude-code }

In a Claude Code session, enter these two commands one at a time:

{% include agent-plugin-install.html agent='sketch' host='claude' lang='en' %}

From a terminal, the same steps are `claude plugin marketplace add FulongLi/AIPE-Sketcher`
and `claude plugin install aipe-sketcher@aipe-sketcher`. Claude uses AIPE Sketcher
on its own when you ask for a schematic; you can also call it as `/aipe-sketcher:schematic`.

**Both apps need Python 3.9 or newer** (`python3` on macOS and Linux, `py -3` on Windows)
for the local drawing engine. Updating, removing and checking an installation are covered
in the repository's [plugin installation guide](https://github.com/FulongLi/AIPE-Sketcher/blob/main/docs/plugins.md).

## Generate your first schematic
{: #quick-start }

Once the plugin is installed, start a new chat and paste this request:

{% include agent-prompt.html agent='sketch' lang='en' id='aipe-sketcher-prompt' %}

The agent writes the circuit, draws it, checks it and replies with links to the SVG
schematic and its validation report, along with any assumptions it made. You can then
continue in plain language: “label the transformer turns ratio,” “add an output
inductor,” or “draw a synchronous buck converter instead.”

For your own circuit, include whatever you already know: the topology or purpose, the
components and important values, how they connect, the labels you want and an output
filename. For example:

> Using AIPE Sketcher, draw a buck converter with a 48 V input, a MOSFET, a diode, a 100 µH
> inductor, a 470 µF output capacitor and a 10 Ω load. Label the input and output, and ask
> me before assuming any connection I have not specified.

## What it can do
{: #capabilities }

- **Generate electrical schematics from circuit descriptions** given in plain language
  through your AI agent.
- **Draw common power-electronics reference topologies** by name, including buck, boost,
  half and full bridge, dual active bridge, LLC resonant and three-phase inverter circuits.
- **Arrange symbols and connections automatically**: component placement, wire routing
  and labels.
- **Validate the drawing against the electrical circuit**: it reads the connections back
  from the drawn wires and refuses to save a drawing that differs from the circuit.
- **Export SVG schematics and JSON validation reports.**
- **Run locally** through Codex, Claude Code or the standalone Python command line.

## What files you get
{: #outputs }

- **SVG schematic (`.svg`):** open it in a browser or edit it in a vector tool such as
  Inkscape.
- **Validation report (`.report.json`):** electrical validation, drawing connectivity, layout
  quality, and the assumptions and limitations of that drawing.
- **Circuit description (`.json`):** the components, ports and connections that were
  drawn, so the schematic can be revised and regenerated.

Developers can use the same engine without an agent through the `aipe-sketcher` command
line or the Python API; see the [command-line guide](https://github.com/FulongLi/AIPE-Sketcher/blob/main/docs/cli.md).
AIPE Sketcher does not export SPICE, simulation models or PCB files.

## Before you use the result
{: #limits }

Validation confirms that the drawing matches the circuit it was given. It does not
establish component ratings, hardware safety or circuit performance. Review component
orientation, values, labels, the assumptions in the report and every warning before using
the drawing in engineering work.

Complex or ambiguous circuits may need more detail in your request, and not every symbol
or layout is supported yet; unsupported cases are reported rather than drawn. Architecture,
known limits and test details are in the repository
[README](https://github.com/FulongLi/AIPE-Sketcher/blob/main/README.md).

## Licence
{: #licence }

AIPE Sketcher is source-available, not open source. It is **free for personal,
non-commercial use**; commercial use requires prior written permission. See the
[LICENSE](https://github.com/FulongLi/AIPE-Sketcher/blob/main/LICENSE). The bundled
electrical symbol sheet is separate third-party material released under CC0 1.0.
