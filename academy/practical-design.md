---
academic_references: []
academy_page: true
canonical_source_url: https://github.com/FulongLi/AIPE-Academy/blob/main/curriculum/05-practical-design/README.md
concept: practical-design-stage
covers:
- pe.magnetics
- pe.thermal
- pe.gate-driving
- pe.emi-pcb
domain: power-electronics
en_url: /academy/power-electronics/practical-design/
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
module: pe.practical
next_links:
- title: Systems and applications
  url: /academy/power-electronics/systems-applications/
permalink: /academy/power-electronics/practical-design/
prerequisite_links:
- title: Dynamics, transfer functions and control
  url: /academy/power-electronics/dynamics-and-control/
render_with_liquid: false
source_path: curriculum/05-practical-design/README.md
source_revision: 928720f55ab6982bfab8050ed75224c54cc4ccba
source_sha256: 8195423937dd858df65190c6c055eef95d1a832e9ec61fe5575b48be5a1366a3
title: Magnetics and practical design
track: practical-design
translation_status: original
translations:
  en: /academy/power-electronics/practical-design/
  zh: null
zh_url: /zh/academy/
---

## Purpose

This stage connects textbook-style converter knowledge to real engineering constraints.

It should make learners respect hardware without making them afraid of it.

## Core Topics

- magnetic component design: inductors, transformers, saturation, core loss, copper loss, leakage
- gate driving, dead time, bootstrap supplies, level shifting, and isolation
- PCB layout, current loops, grounding, parasitic inductance, ringing, and measurement artifacts
- EMI, input filters, shielding, and regulatory awareness
- thermal design, heatsinks, airflow, thermal resistance, and junction temperature
- protection: overcurrent, overvoltage, undervoltage, short circuit, temperature, and fault recovery
- safety: high voltage, stored energy, isolation, discharge paths, fusing, and safe lab habits
- documentation, design reviews, and test plans

## Must-Know Ideas

- Layout is part of the circuit.
- Heat is a design signal.
- Protection is not optional in real systems.
- EMI problems are easier to prevent than to debug.
- Safety must appear before hardware ambition.

## Practice Projects

- Review a converter PCB layout and mark high di/dt loops.
- Estimate junction temperature from power loss and thermal resistance.
- Design a simple input filter conceptually and discuss stability risk.
- Write a test plan before powering a circuit.
- Ask an AI tutor to perform a design review on your schematic assumptions.

## Exit Criteria

Before moving on, the learner should be able to:

- explain why layout changes converter behavior
- estimate whether a device may overheat
- identify basic protection needs
- describe common EMI sources
- write a cautious first-power-up checklist

