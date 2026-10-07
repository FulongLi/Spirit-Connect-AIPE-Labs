---
academy_page: true
en_url: /academy/
estimated_time: 30
lang: en
layout: academy
lesson_status: outline
lesson_type: stage
math: true
next_links:
- title: Steady-state converters
  url: /academy/power-electronics/converters/
permalink: /academy/power-electronics/components/
prerequisite_links:
- title: Foundations readiness map
  url: /academy/foundations/foundations/
render_with_liquid: false
source_path: curriculum/02-components/README.md
source_sha256: bc580623a495a2a2227aa8be07829ba76383b9de73e4a19ae01e8eac156d17c4
title: Devices and switching models
zh_url: /academy/foundations/prerequisite-path-zh/
---

## Purpose

This stage introduces the physical parts used in power converters and teaches the difference between ideal symbols and real components.

## Core Topics

- resistors, capacitors, inductors, transformers, and magnetic cores
- diodes, Schottky diodes, MOSFETs, IGBTs, SiC MOSFETs, and GaN HEMTs
- gate drivers, bootstrap circuits, isolation, sensors, fuses, and connectors
- datasheets and absolute maximum ratings
- parasitic resistance, capacitance, inductance, leakage, saturation, ESR, ESL, and thermal resistance
- packages, layout influence, and component selection tradeoffs

## Must-Know Ideas

- Every component has an ideal behavior and a real behavior.
- Switching devices are controlled valves for energy flow.
- Datasheets are engineering contracts, not marketing brochures.
- Parasitics often decide whether a design is quiet, efficient, reliable, or unstable.
- Thermal limits are electrical limits in disguise.

## Practice Projects

- Compare three MOSFET datasheets for the same voltage class.
- Estimate conduction loss for a diode and a MOSFET.
- Identify ESR and ripple current limits in capacitor datasheets.
- Build a component glossary with AI-generated explanations and your own corrections.

## Exit Criteria

Before moving on, the learner should be able to:

- explain what each major component does in a converter
- read the most important fields in a MOSFET, diode, capacitor, and inductor datasheet
- estimate simple conduction loss
- recognize why real components deviate from ideal models

