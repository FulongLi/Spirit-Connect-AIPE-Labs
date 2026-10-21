---
academic_references: []
academy_page: true
canonical_source_url: https://github.com/FulongLi/AIPE-Academy/blob/main/curriculum/03-converters/README.md
concept: converters-stage
covers:
- pe.boost
- pe.rectifiers
- pe.inverters
- pe.isolated
- pe.losses
domain: power-electronics
en_url: /academy/power-electronics/converters/
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
module: pe.topologies
next_links:
- title: 'Buck converter fundamentals: from switch states to ripple and conduction
    modes'
  url: /academy/power-electronics/buck-converter-fundamentals/
- title: 'Buck converter: from principles to design'
  url: /academy/power-electronics/buck-converter/
- title: Predict and check an ideal buck converter
  url: /academy/power-electronics/buck-open-lab/
- title: Dynamics, transfer functions and control
  url: /academy/power-electronics/dynamics-and-control/
permalink: /academy/power-electronics/converters/
prerequisite_links:
- title: Devices and switching models
  url: /academy/power-electronics/components/
render_with_liquid: false
source_path: curriculum/03-converters/README.md
source_revision: f4d8d4d4b35fc6de376c58afd127c43ba0fec20a
source_sha256: 24772bb3427435be9368b06441efa3b4bb479402c6b40ceead21917a20ddb480
title: Steady-state converters
track: dc-dc-conversion
translation_status: original
translations:
  en: /academy/power-electronics/converters/
  zh: null
zh_url: /zh/academy/
---

## Purpose

This stage studies the core switching converter topologies and their steady-state behavior.

It is the heart of the beginner-to-intermediate path.

## Core Topics

- buck, boost, buck-boost, inverting buck-boost, SEPIC, Cuk, flyback, forward, half-bridge, full-bridge, and resonant converter awareness
- PWM, duty cycle, switching frequency, ripple, and volt-second balance
- continuous conduction mode and discontinuous conduction mode
- steady-state conversion ratios
- equivalent circuits, losses, efficiency, and thermal estimates
- switch realization and current paths
- waveform interpretation

## Must-Know Ideas

- Converters work by repeatedly storing and releasing energy.
- Inductor volt-second balance and capacitor charge balance are central analysis tools.
- Duty cycle controls the average output, but real devices add loss and delay.
- CCM and DCM can make the same circuit behave very differently.
- The same topology can look simple on paper and become difficult in hardware.

## Practice Projects

- Derive and simulate an ideal buck converter.
- Compare buck converter waveforms in CCM and DCM.
- Estimate efficiency using conduction and switching losses.
- Create annotated current-path diagrams for buck and boost converters.
- Ask an AI tutor to generate misconception checks for each topology.

## Exit Criteria

Before moving on, the learner should be able to:

- explain buck, boost, and buck-boost operation from switch states
- compute ideal conversion ratios
- estimate inductor current ripple and capacitor voltage ripple
- identify CCM and DCM from waveforms
- simulate a simple converter and explain the result

