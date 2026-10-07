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
source_sha256: 24772bb3427435be9368b06441efa3b4bb479402c6b40ceead21917a20ddb480
title: Steady-state converters
zh_url: /academy/foundations/prerequisite-path-zh/
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

