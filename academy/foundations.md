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
- title: 电力电子之前：先修课程路线
  url: /academy/foundations/prerequisite-path-zh/
- title: Devices and switching models
  url: /academy/power-electronics/components/
permalink: /academy/foundations/foundations/
prerequisite_links:
- title: Orientation and learning methods
  url: /academy/foundations/orientation/
render_with_liquid: false
source_path: curriculum/01-foundations/README.md
source_sha256: f81b5b9165ed920d1e51d9de59f33616dac560073c1eeb6c4443d19cb220d82f
title: Foundations readiness map
zh_url: /academy/foundations/prerequisite-path-zh/
---

For beginners, start with the [prerequisite path (中文)](/academy/foundations/prerequisite-path-zh/) and [first lesson](/academy/foundations/first-circuit-zh/). The path separates what is needed before basic converter analysis from what can be learned later alongside control and design. See the [MIT / Princeton source review](https://github.com/FulongLi/AIPE-Academy/blob/main/references/undergraduate-foundations-review.zh-CN.md) for the evidence behind this structure.

## Purpose

This stage builds the minimum electrical, mathematical, and measurement intuition required before converter analysis.

The goal is not to become a mathematician first. The goal is to know enough to reason about power, energy, waveforms, and circuits without getting lost.

## Core Topics

- voltage, current, resistance, power, and energy
- Ohm's law, KCL, KVL, and equivalent circuits
- capacitors and inductors as energy storage elements
- transient response and time constants
- RMS, average value, ripple, and frequency
- ideal sources, switches, and loads
- basic measurement thinking: voltage probes, current probes, oscilloscopes, and meters
- algebra, complex numbers, derivatives, integrals, and first-order differential equations as needed

## Must-Know Ideas

- Voltage is across two points; current flows through a path.
- Power is the rate of energy transfer.
- Capacitors resist sudden voltage change; inductors resist sudden current change.
- Real circuits have parasitics, limits, noise, and measurement error.
- Waveforms carry information about how energy moves.

## Practice Projects

- Calculate power and energy for simple DC loads.
- Simulate RC and RL transients.
- Plot square waves, triangular ripple, average value, and RMS value in Python.
- Use an AI tutor to explain each equation in words.

## Exit Criteria

Before moving on, the learner should be able to:

- solve simple resistor, capacitor, and inductor circuits
- explain capacitor voltage and inductor current continuity
- compute average power in simple cases
- read a basic waveform and describe what is changing
