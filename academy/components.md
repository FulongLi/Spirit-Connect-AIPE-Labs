---
academic_references: []
academy_page: true
canonical_source_url: https://github.com/FulongLi/AIPE-Academy/blob/main/curriculum/02-components/README.md
concept: components-stage
covers:
- pe.passives
domain: power-electronics
en_url: /academy/power-electronics/components/
estimated_time: 30
lab_urls: []
labs: []
lang: en
layout: academy
lesson_format: legacy
lesson_status: outline
lesson_type: stage
level: undergraduate
math: true
module: pe.devices
next_links:
- title: Steady-state converters
  url: /academy/power-electronics/converters/
permalink: /academy/power-electronics/components/
prerequisite_links:
- title: Foundations readiness map
  url: /academy/foundations/foundations/
render_with_liquid: false
source_path: curriculum/02-components/README.md
source_revision: 928720f55ab6982bfab8050ed75224c54cc4ccba
source_sha256: bc580623a495a2a2227aa8be07829ba76383b9de73e4a19ae01e8eac156d17c4
title: Devices and switching models
track: devices-and-components
translation_status: original
translations:
  en: /academy/power-electronics/components/
  zh: null
zh_url: /zh/academy/
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

