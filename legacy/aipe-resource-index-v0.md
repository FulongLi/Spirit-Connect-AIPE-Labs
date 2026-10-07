# AIPE Labs Resource Index

> AIPE (AI for Power Electronics) is an open-source community for AI-assisted power
> electronics automation — from requirements and device selection to converter design,
> simulation, optimisation, validation, and system integration. This Markdown file is
> the agent-readable index of the tools, packages, specialist agents, datasets, design
> references, research projects, and engineering notes published across the ecosystem.

## How to Use This Index

Give your coding agent this URL:

`https://aipel.co.uk/aipe.md`

Then describe the engineering task you want to complete. For example:

> Read https://aipel.co.uk/aipe.md, find the relevant AIPE Labs resources, and
> help me plan a magnetic finite-element analysis for a DAB converter.

The agent should treat linked resources as engineering references, check the licence
and documentation of each source, and verify important outputs against original
datasheets, models, simulations, standards, and measurements.

## GitHub Project Hubs

- [AIPE Labs community](https://github.com/AIPE-Labs) — The community home for
  open-source AI-assisted power electronics automation.
- [Fulong Li's GitHub projects](https://github.com/FulongLi) — The current project hub
  for AIPE tools, research code, converter resources, databases, sensing projects, and
  related power engineering work.
- [Spirit-Connect-AIPE-Labs](https://github.com/FulongLi/Spirit-Connect-AIPE-Labs) —
  Source repository for the AIPE Labs website and this resource index.

Repository ownership may move from the personal project hub to the AIPE Labs community
as projects mature. The links below point to their current public locations.

## Open-Source Tools, Packages, and Agents

### Design and Engineering Agents

- [AIPE Power Electronics Design Agent](https://github.com/FulongLi/AIPE-Power-Electronics-Design-Agent) —
  AI-assisted topology selection, converter calculations, magnetics design, component
  guidance, optimisation, and design reporting.
- [AIPE Converter Optimisation Agent](https://github.com/FulongLi/AIPE-Converter-Optimisation-Agent) —
  Converter volume-loss exploration, multi-objective optimisation, and surrogate modelling.
- [AIPE Simulation Agents](https://github.com/FulongLi/AIPE-Simulation-Agents) —
  Reusable agent workflows for circuit simulation, debugging, digital control,
  electromagnetics, and thermal analysis.
- [AIPE IEEE Paper Agent](https://github.com/FulongLi/AIPE-IEEE-Paper-Agent) —
  LaTeX and AI-assisted workflow for preparing IEEE-style engineering papers.

### Engineering Data, Models, and Libraries

- [AIPE Power Device Library](https://github.com/AIPE-Labs/AIPE-Power-Device-Library) —
  Community-owned power semiconductor device library.
- [AIPE Power Device Database](https://github.com/FulongLi/AIPE-Power-Device-Database) —
  Structured power semiconductor data and device-selection resources.
- [Power Electronics Device Library](https://github.com/FulongLi/PowerElectronicsDeviceLibrary) —
  Python-based power electronics device reference library.
- [AIPE MOSFET ANN Modelling](https://github.com/FulongLi/AIPE-MOSFET-ANN-Modelling) —
  Neural-network models for MOSFET electrical, loss, and thermal behaviour.
- [AIPE Magnetics Library](https://github.com/FulongLi/AIPE-Magnetics-Library) —
  Magnetic component data, design resources, and reference assets.
- [AIPE Inductor Design Example](https://github.com/FulongLi/AIPE-Magnetics-Agnet-Inductor-Design-Example) —
  Agent-assisted inductor design documentation and technical drawings.

### Schematics, Converters, and Systems

- [AIPE-Sketch](https://github.com/FulongLi/AIPE-Sketch) — Open-source Python
  circuit-to-SVG drawing backend with graph planning, routing, and connectivity validation.
- [AIPE Solid-State Transformer](https://github.com/FulongLi/AIPE-Solid-State-Transformer) —
  Solid-state transformer modelling, multi-stage conversion, control, and integration.
- [Isolated Converters](https://github.com/FulongLi/IsolatedCoverters) — Reference
  material and models for isolated converter topologies.
- [Non-Isolated Converters](https://github.com/FulongLi/NonisolatedCoverters) —
  Reference material and models for non-isolated converter topologies.
- [Buck Converter Optimisation](https://github.com/FulongLi/BuckConverterOptimisation) —
  Multi-objective buck-converter optimisation workflows.
- [DC Microgrid Test Bench](https://github.com/FulongLi/DCMicrogridTestBench) —
  Low-voltage DC microgrid platform for converter, control, and energy-management research.
- [Wireless Power Transfer Test Bench](https://github.com/FulongLi/WirelessPowerTransferTestBench) —
  Hardware and research resources for wireless power transfer.
- [AIPS Microgrid EMS Agent](https://github.com/FulongLi/AIPS-Microgrid-EMS-Agent) —
  Agent-based energy management for microgrids.
- [AIPS EV Charging Planning](https://github.com/FulongLi/AIPS-EV-Charging-Planning) —
  Grid-aware electric-vehicle charging-station planning.

### Magnetics, Sensing, and Thermal Design

- [PCB Rogowski Coil](https://github.com/FulongLi/PCB-Rogowski-Coil) — PCB-based
  Rogowski coil designs for current sensing and power electronics development.
- [PCB Current Transformer Transducer](https://github.com/FulongLi/Magnetics-PCBCurrentTransformerTransducer) —
  PCB current-transformer transducer research and design assets.
- [Heat Sink Optimisation](https://github.com/FulongLi/HeatSinkOptimisation) —
  Thermal modelling and heat-sink optimisation resources.

## AI Agent Team

- [AI Agent Team](https://aipel.co.uk/resources/ai-agent-team/) — Introductions to
  specialist agents and tools, their roles, and how to use them.
- [AIPE-Sketch Guide](https://aipel.co.uk/resources/ai-agent-team/aipe-sketch/) —
  Automatic circuit-to-SVG schematic generation, quick start, and Python usage.

## Power Engineering

### Devices and Characterisation

- [Devices](https://aipel.co.uk/power/devices/) — Semiconductor device testing,
  modelling, and electrical and thermal characterisation for SiC, GaN, and Si devices.
- [Device Characterisation](https://aipel.co.uk/power/devices/characterisation/) — Switching
  characteristics, switching losses, thermal resistance, and junction-temperature analysis.
- [Transistor Database](https://aipel.co.uk/database/transistors/) — Power semiconductor
  device data and selection references.

### Magnetics and Measurement

- [Magnetics Database](https://aipel.co.uk/database/magnetics/) — Magnetic components,
  core materials, and design data.
- [PCB Rogowski Coil](https://aipel.co.uk/resources/prototypes/rogowski-coil/) —
  Current-transducer design reference for power electronics measurement and validation.

### Converters and Control

- [Converters](https://aipel.co.uk/power/converters/) — Converter topologies, magnetics
  sizing, control synthesis, and multi-objective optimisation, including LLC, DAB,
  multilevel DC-AC, and interleaved buck/boost converters.
- [Dual Active Bridge Design Reference](https://aipel.co.uk/resources/prototypes/dab/) — DAB converter
  design reference covering devices, magnetics, and control.
- [Solid-State Transformer Design Reference](https://aipel.co.uk/resources/prototypes/sst/) — Modular
  solid-state transformer architecture and system-integration reference.

### Systems, Microgrids, and Energy Storage

- [Microgrids](https://aipel.co.uk/power/microgrids/) — DC distribution networks,
  AC/DC microgrids, system integration, and mission-profile design.

## Prototype Design References

- [Prototype Design References](https://aipel.co.uk/resources/prototypes/) — Hardware
  prototypes, engineering references, and AI-assisted design material.

## Engineering Databases

- [Database](https://aipel.co.uk/resources/database/) — Entry point for reusable
  semiconductor and magnetics data resources.
- [Transistor Database](https://aipel.co.uk/database/transistors/) — Power semiconductor
  device data and selection references.
- [Magnetics Database](https://aipel.co.uk/database/magnetics/) — Magnetic components,
  core materials, and design data.

## Guides and Updates

- [Use AIPE Labs with Your Coding Agent](https://aipel.co.uk/plugin/) — Instructions and
  examples for using this index with Claude, Codex, Cursor, or another web-enabled agent.
- [Blog](https://aipel.co.uk/resources/blog/) — Engineering notes and project updates.
- [News](https://aipel.co.uk/news/) — AIPE Labs milestones and collaboration updates.

## About and Collaboration

- [About AIPE Labs](https://aipel.co.uk/company/about/) — Mission, direction, and the
  design loop between AI and power infrastructure.
- [Frequently Asked Questions](https://aipel.co.uk/company/faq/) — Current scope,
  limitations, access, data handling, and contribution guidance.
- [Contact](https://aipel.co.uk/contact/) — Research collaboration, engineering pilots,
  open-source contribution, and strategic partnership enquiries.

## Project Status

AIPE Labs is under active development. The public resources linked above are available
now; coverage and maturity vary by topic. New tools, agents, datasets, and validated
workflows will be added to this index as they are published.
