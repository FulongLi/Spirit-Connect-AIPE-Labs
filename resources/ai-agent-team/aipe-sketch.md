---
layout: agent
title: "AIPE-Sketch: From Circuit Connections to a Clear Schematic"
permalink: /resources/ai-agent-team/aipe-sketch/
description: Discover AIPE-Sketch, an open-source circuit-to-SVG drawing tool, with a quick start, a Python example, and a workflow for coding agents.
role: Schematic generation
intro: Describe the electrical connections. Let AIPE-Sketch handle the placement, wires, and labels.
repository: https://github.com/FulongLi/AIPE-Sketch
---

## Meet the team's schematic drawing tool

A circuit diagram is often the first thing we need when explaining a converter, reviewing a design, or documenting a new idea. Drawing it by hand means arranging symbols, routing wires, and moving labels every time the circuit changes.

**AIPE-Sketch turns the circuit's electrical connections into an SVG schematic.** You describe the components and the nets joining their ports in Python; the tool analyses that structure and builds the drawing. Within our AI Agent Team, its role is schematic generation. The repository provides a Python library and command-line examples that a coding agent can use as part of an engineering workflow. Its automatic planner works from the circuit graph rather than an LLM service.

The project is available in the [AIPE-Sketch GitHub repository](https://github.com/FulongLi/AIPE-Sketch).

## What it takes care of

- **Structure and layout:** recognises patterns such as series paths, parallel branches, bridge legs, and transformer isolation, then translates their relationships into a drawing plan.
- **Symbols and wires:** uses the master SVG symbol library, places components, and routes horizontal and vertical wire segments.
- **Labels and repeated structures:** places labels with collision checks and gives recognised repeated bridge legs consistent geometry.
- **Connectivity validation:** reconstructs connections from the drawn geometry and compares them with the original circuit, catching unintended shorts or breaks.

The default pipeline evaluates 12 deterministic geometry candidates, rerouting and checking each one before selecting a result. The circuit description remains separate from coordinates and presentation, so you can change the electrical model without manually redrawing every component. See the [architecture notes](https://github.com/FulongLi/AIPE-Sketch/blob/main/docs/architecture.md) for the implementation.

## Start with a converter you recognise
{: #quick-start }

You need Git and Python 3. Clone the repository and run the examples from its root directory; the current core drawing path uses Python's standard library and the bundled symbol assets.

```bash
git clone https://github.com/FulongLi/AIPE-Sketch.git
cd AIPE-Sketch
python3 build.py buck dab
```

This generates `out/buck.svg` and `out/dab.svg`. Open either file in a browser or a vector editor such as Inkscape to inspect the schematic. The terminal also shows quality metrics, the selected candidate, and any drawing warnings.

The example set includes buck, boost, half-bridge, full-bridge, three-phase inverter, DAB, and LLC resonant circuits, alongside synthetic networks that exercise the drawing rules.

These commands help you explore the process:

```bash
python3 build.py                 # Generate all reference examples
python3 build.py --plan buck     # Inspect the analysis and relational plan
python3 build.py --checks buck   # Generate a drawing with detailed checks
python3 build.py --manual buck   # Compare with the saved manual baseline
```

## Draw your own circuit

Save the following as `my_circuit.py` in the repository root. It defines a voltage source, a 1 mH inductor, and a 10 Ω resistor, joined as a closed series branch.

```python
from aipe_sketch import Netlist, Schematic

circuit = Netlist('Inductive branch')
circuit.add('V1', 'voltage_source')
circuit.add('L1', 'inductor', inductance=0.001)
circuit.add('R1', 'resistor', resistance=10)

circuit.connect('input', 'V1.p', 'L1.a')
circuit.connect('output', 'L1.b', 'R1.a')
circuit.connect('return', 'V1.n', 'R1.b')

circuit.validate()
schematic = Schematic.from_netlist(circuit)
schematic.render('out/branch.svg')
```

Run `python3 my_circuit.py`, then open `out/branch.svg`.

Each `add()` creates a component with a semantic kind. Each `connect()` names a net and lists the component ports that belong to it: the source uses `p` and `n`, while these passive components use `a` and `b`. Net names describe electrical connections; they do not automatically become visible text. Values such as inductance and resistance belong to the electrical model, while optional drawing notation uses the separate `SchematicText` API.

Validate the circuit before drawing. Unknown ports, floating ports, and one-terminal nets are rejected. A new component kind also needs a matching symbol and port mapping before it can be rendered.

## Use it with your coding agent

Give your coding agent access to the repository and describe the components and connections you want. A useful first prompt is:

> Read the AIPE-Sketch README and inspect the buck example. Use the existing Netlist and Schematic APIs to generate its SVG, run the detailed drawing checks, and explain any warnings. Then help me adapt the circuit and regenerate the schematic.

For a custom circuit, ask the agent to write a `Netlist`, validate its ports and connections, render it with `Schematic.from_netlist()`, and inspect the output with you. This gives the agent a concrete drawing backend and keeps the electrical description available for review. The tool does not include a standalone conversational agent or a built-in natural-language-to-circuit interface.

## What to check before using the result

Connectivity checks confirm that the drawing matches the declared circuit; they do not establish that the circuit will operate correctly. Power-path inference is structural, and ambiguous or complex graphs may need review or an expert layout override. The current grammar recognises two-device bridge legs, and many symbols in the full master sheet still lack a supported engineering port map.

SVG generation is the current output. Simulation, SPICE, and other exporters are described as future backends. Review the schematic and its warnings before using it in your engineering work. The repository's [README](https://github.com/FulongLi/AIPE-Sketch/blob/main/README.md) documents the APIs and known limits; the [regression report](https://github.com/FulongLi/AIPE-Sketch/blob/main/docs/auto-planning-results.md) shows the reference circuits used to exercise automatic planning.
