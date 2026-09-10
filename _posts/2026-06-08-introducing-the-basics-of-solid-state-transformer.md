---
layout: post
title: "Introducing the Basics of Solid-State Transformer"
description: "How solid-state transformers could connect medium-voltage utility feeds directly to the 800 VDC bus architecture emerging in next-generation AI data centres."
date: 2026-06-08
author: "Dr. Fulong Li"
zh_url: /zh/resources/blog/
---

AI data centres are becoming power systems in their own right. As accelerated-computing
racks move from tens of kilowatts towards hundreds of kilowatts and, eventually, the
megawatt scale, the path from the utility grid to the processors matters almost as much
as the processors themselves.

This is where two developments meet: the **solid-state transformer (SST)** and the
**800 VDC distribution architecture** being developed for future NVIDIA-based AI
infrastructure. The first changes how voltage conversion and isolation can be performed;
the second changes how power is distributed through the data hall and delivered to the
compute rack.

## What is a solid-state transformer?

A conventional transformer transfers energy magnetically at the grid frequency of
50 or 60 Hz. It is efficient, robust and well understood, but it is also passive: voltage
conversion, rectification, regulation and power-quality control generally require
additional equipment around it.

An SST combines high-frequency power converters with a medium-frequency transformer.
A typical medium-voltage-to-DC implementation contains three functional stages:

1. A controlled front end converts medium-voltage AC into DC and manages input current
   quality.
2. An isolated DC-DC stage switches at a much higher frequency than the grid. The higher
   frequency allows the magnetic components to be substantially smaller.
3. An output stage regulates the required DC bus voltage and coordinates with downstream
   loads, energy storage and protection systems.

The exact circuit may use cascaded or modular multilevel cells, dual-active-bridge (DAB)
converters, resonant converters, or a combination of these. The important idea is not
one particular topology. It is that galvanic isolation, voltage transformation and active
control are integrated into a modular power-electronic system.

That integration can provide capabilities that a line-frequency transformer alone cannot:
bidirectional power flow, fast voltage regulation, power-factor control, load shaping,
and direct connection to batteries or other DC resources. These benefits come with added
engineering demands, including semiconductor losses, insulation coordination, EMI,
cooling, fault isolation and control-system reliability.

## Why 800 VDC is relevant to AI data centres

Today's AI racks commonly distribute power internally at approximately 54 VDC. This is
practical at lower power, but current becomes difficult to manage as rack power rises.
For an idealised 1 MW load, 54 V corresponds to about 18.5 kA; at 800 V, the same power
corresponds to 1.25 kA. Real systems must also account for conversion losses, redundancy
and transient headroom, but the scale of the difference remains clear.

Lower current means smaller conductors, lower I²R losses and less space devoted to
copper busbars. It also allows power conversion to move out of the compute rack, leaving
more rack volume and cooling capacity for processors and networking.

[NVIDIA's published 800 VDC architecture](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)
centralises the conversion to 800 VDC and distributes it through the data hall to future
compute racks. The 800 V bus does not power GPU silicon directly: isolated or non-isolated
DC-DC converters near the compute trays still step the voltage down to the intermediate
and point-of-load rails required by the electronics.

## Where the SST fits

There are several possible stages in the transition to an 800 VDC facility. Existing data
centres may retain their line-frequency transformers and AC infrastructure, then add
centralised or row-level AC-to-800 VDC conversion. A purpose-built facility can go further.

In the longer-term arrangement, an SST can accept a medium-voltage AC input and produce a
regulated, galvanically isolated 800 VDC output. This can replace the conventional sequence
of medium-voltage transformer, low-voltage AC switchgear and distributed rack-level
rectifiers with a shorter conversion chain:

**Medium-voltage AC → modular SST → 800 VDC busway → rack DC-DC converters → processors**

The result is not simply a smaller transformer. The SST becomes an actively controlled
interface between the grid and the AI load. It can regulate the DC bus, limit disturbances,
coordinate energy storage and potentially smooth the rapid power variations created by
GPU workloads before they propagate upstream.

This distinction is important: 800 VDC does not require an SST on day one, and an SST is
not automatically the best answer for every site. NVIDIA has described both conventional
transformer-based and SST approaches as part of the industry evaluation. The practical
choice depends on facility scale, grid connection voltage, availability targets, efficiency,
maintenance strategy and the maturity of DC protection equipment.

## The engineering questions that matter

For SSTs to become a dependable part of data-centre infrastructure, designers need to
solve several system-level problems:

- **Efficiency across the load profile.** A small loss percentage becomes substantial at
  megawatt scale, especially when conversion is continuous.
- **Modularity and availability.** Series-connected medium-voltage cells must share voltage
  correctly, and a failed module should be isolated without taking an entire power block offline.
- **DC fault protection.** Unlike AC, DC has no natural current zero crossing. Detection,
  interruption, grounding and safe maintenance procedures must be designed as one system.
- **Insulation and thermal design.** Fast wide-bandgap switching enables higher power density,
  but also creates high dv/dt, common-mode currents and demanding electric-field conditions.
- **Control interaction.** The SST, bus capacitors, battery systems and thousands of downstream
  converters must remain stable during workload steps, grid events and equipment faults.

These are exactly the kinds of coupled trade-offs that make the SST a compelling target for
AI-assisted engineering: topology, semiconductor selection, magnetics, control, thermal
management and reliability cannot be optimised independently.

## A new grid-to-chip boundary

The shift to 800 VDC moves the boundary between facility power and IT power. The SST could
move it further still, creating a programmable medium-voltage-to-DC interface designed around
the behaviour of the compute load.

The opportunity is significant: fewer conversion stages, lower distribution current, better
use of copper and space, and tighter coordination between the grid, energy storage and compute.
The challenge is equally significant: the new architecture must match the efficiency,
serviceability and long-term dependability expected from conventional data-centre power systems.

For a closer look at the converter building blocks, see our
[Solid-State Transformer design reference](/resources/prototypes/sst/).
