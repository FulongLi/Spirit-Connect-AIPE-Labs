---
layout: agent
title: "AIPE-Sketch: From Circuit Connections to a Clear Schematic"
permalink: /resources/ai-agent-team/aipe-sketch/
description: "Use AIPE-Sketch with Codex or Claude Code: copy one link, describe a circuit in natural language, and generate a checked SVG schematic."
role: Schematic generation
intro: Describe the electrical connections. Let AIPE-Sketch handle the placement, wires, and labels.
repository: https://github.com/FulongLi/AIPE-Sketch
video: /videos/AIPE-Sketch.mp4
video_poster: /images/general/aipe-sketch-video-poster.png
video_alt: Animated introduction to the AIPE-Sketch schematic workflow
---

## Draw a circuit with one link
{: #overview }

**AIPE-Sketch turns circuit connections into a clear SVG schematic.** To get started,
you do not need to learn its Python API or remember terminal commands. Give the repository
link to Codex, Claude Code, or another coding agent, then describe the circuit you want in
natural language.

<div class="agent-link">
  <code id="aipe-sketch-url">https://github.com/FulongLi/AIPE-Sketch</code>
  <button class="copy-btn" data-copy-target="aipe-sketch-url" aria-live="polite">Copy link</button>
</div>

The coding agent reads the repository, prepares the circuit description, runs AIPE-Sketch,
and returns the generated files. You stay in control by describing changes in ordinary language.

## Quick start with Codex or Claude Code
{: #quick-start }

1. Open Codex or Claude Code in the folder where you want to work.
2. Copy the repository link above, or copy the ready-made prompt below.
3. Paste it into the agent and describe your circuit.
4. Review the SVG and any connectivity warnings with the agent.

<div class="agent-link">
  <code id="aipe-sketch-prompt">Read https://github.com/FulongLi/AIPE-Sketch and use it to draw the circuit I describe. Set up and run the tool for me, ask if any connection is unclear, generate an SVG, and run the connectivity checks.</code>
  <button class="copy-btn" data-copy-target="aipe-sketch-prompt" aria-live="polite">Copy prompt</button>
</div>

You can then continue naturally: “Move the output capacitor closer to the load,” “add the
component values,” or “change this to a synchronous buck and redraw it.” The agent may ask
for permission to access GitHub or run local commands.

## What it can do
{: #capabilities }

- Draw common power-electronics circuits, including buck, boost, bridge, inverter, DAB,
  and LLC examples.
- Place supported electrical symbols, route wires, and arrange labels automatically.
- Recognise series paths, parallel branches, bridge legs, and transformer isolation.
- Redraw the schematic after you change components, values, labels, or connections.
- Compare the drawn geometry with the declared circuit and report possible breaks or shorts.

## What to tell the agent
{: #custom-circuit }

Use normal sentences. Include whatever you already know:

- the topology or purpose of the circuit;
- the components and important values;
- how the components connect;
- the labels you want to see; and
- the preferred output filename.

For example:

> Draw a buck converter with a 48 V input, MOSFET, diode, 100 µH inductor,
> 470 µF output capacitor, and 10 Ω load. Label the input and output, save the result
> as `out/my-buck.svg`, and run the connectivity checks. Ask me before assuming any
> connection that I have not specified.

If you only know part of the circuit, say so. The agent can ask for the missing information
before it draws.

## What files you get
{: #outputs }

- **SVG schematic (`.svg`):** the current native output. Open it in a browser or edit it
  in a vector tool such as Inkscape.
- **Reproducible circuit source (`.py`):** the coding agent can save the Python netlist it
  used, so you can revise and regenerate the drawing later.
- **Check results:** the terminal reports connectivity warnings and drawing-quality details
  for the agent to explain or resolve.

AIPE-Sketch currently exports SVG. It does not yet export SPICE, simulation models, or PCB files.

## Before you use the result
{: #limits }

The connectivity check confirms that the picture matches the circuit description; it does
not prove that the converter will operate correctly. Review component orientation, values,
ratings, labels, and all warnings before using the drawing in engineering work.

Complex or ambiguous circuits may need extra instructions or a manual layout adjustment.
Developers who want the Python API, command-line options, architecture, and test details can
continue with the repository [README](https://github.com/FulongLi/AIPE-Sketch/blob/main/README.md).
