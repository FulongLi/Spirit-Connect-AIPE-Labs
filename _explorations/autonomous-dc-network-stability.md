---
title: "Autonomous DC network stability"
lang: en
permalink: /explorations/autonomous-dc-network-stability/
translation_key: autonomous-dc-network-stability
status: concept
question: "Can interconnected DC converters keep a network stable using only local control and locally checkable design rules, without centralised coordination?"
description: "An open question on whether per-converter, locally verifiable conditions can guarantee small-signal stability of a DC network with constant-power loads, and how conservative such conditions would be."
domains: [microgrids, control, converters]
opened: 2026-10-08
updated: 2026-10-08
featured: false
math: true
ai_disclosure: "Drafted with AI assistance and published by AIPE Labs for open review. No independent engineer has reviewed it yet. The references are widely cited publications listed for orientation; check each one before relying on it."
evidence: []
hub:
  uses: [aipe.simulation-skills]
  produces: []
learn:
  - title: "Microgrids"
    url: /power/microgrids/
    kind: "Engineering domain"
  - title: "Dynamics, transfer functions and control"
    url: /academy/power-electronics/dynamics-and-control/
    kind: "AIPE Academy"
  - title: "Small-Signal Modelling from First Principles: A Boost Converter Derivation"
    url: /resources/blog/small-signal-modelling-boost-converter/
    kind: "Engineering article"
---

## Research question

When several DC–DC converters share a DC bus — in a data-centre distribution system, a ship, an EV charging hub or a PV-and-storage microgrid — stability is usually checked for the complete system: someone gathers every converter's model, the cable parameters and the loads, and analyses the whole. That works for a fixed design. It does not work for a network that grows, where converters from different suppliers are added, removed or reconfigured, and where no single party knows every model.

The question is therefore:

> For a DC network of locally controlled sources and tightly regulated loads, is there a set of **design rules that each converter can check using only its own model and terminal behaviour**, such that any interconnection satisfying the rules is small-signal stable — and how much performance does such a guarantee cost?

If the answer is yes, a converter could carry a local "stability certificate", and networks could be assembled plug-and-play without a central controller or a system-wide study. If the answer is no, it is useful to know which coordination is truly unavoidable.

## Hypothesis

Interconnections of passive systems are stable, and passive cables (series resistance and inductance, shunt capacitance) do not destroy passivity. The difficulty is that a tightly regulated converter load draws constant power and therefore behaves, at low frequency, like a negative incremental resistance:

$$
i = \frac{P}{v} \quad\Rightarrow\quad \frac{\partial i}{\partial v} = -\frac{P}{V^2}, \qquad r_\text{inc} = -\frac{V^2}{P}.
$$

A negative resistance is not passive, so a general passivity argument does not apply directly.

The hypothesis is that stability can still be guaranteed by local rules if:

1. each **source** converter, under its own droop or voltage control, presents an output impedance whose real part is positive over all frequencies and exceeds a margin set by its own rating; and
2. each **load** converter's input admittance is shaped by its own controller so that its non-passive region is confined to frequencies below a stated bound and its magnitude stays below a stated limit there;

with the two bounds chosen so that the excess damping offered by sources always covers the deficit created by loads, regardless of how they are connected. The proposal rests on standard assumptions: small-signal behaviour around an equilibrium, averaged converter models, lumped cable models and no communication between converters.

What would falsify it: a network in which every converter satisfies its local rule, yet the interconnection has an eigenvalue in the right half-plane (in a validated model) or sustains an oscillation (in hardware).

## Existing knowledge

The following results are established and are the starting point; they are not claims of this exploration.

- **Impedance-ratio criteria.** Middlebrook showed that an input filter can destabilise a regulated converter and stated the condition in terms of the ratio between the filter's output impedance and the converter's input impedance [1]. Later work turned this into "forbidden regions" for the impedance ratio in distributed DC power systems [2].
- **Constant-power-load instability.** Tightly regulated loads introduce negative incremental impedance and can destabilise DC systems; this is well documented, with modelling and control remedies, for vehicle power systems [3].
- **Droop and hierarchical control.** Primary droop control shares load among DC sources without communication; secondary and tertiary layers restore voltage and optimise operation, usually with communication [4]. Reviews of DC microgrid control describe stabilisation techniques including virtual impedance and active damping [5].
- **Reduced-order stability analysis.** Reduced-order models of low-voltage DC microgrids with droop-controlled sources and constant-power loads have been used to derive stability conditions for specific configurations [6].

How the question differs: impedance criteria are usually applied at a single source–load interface, or require aggregate impedances that depend on the whole network. This exploration asks whether a condition can be **decomposed per device** so that it composes over arbitrary interconnections within a stated class, and then measures how conservative it is compared with an exact system-wide check.

## AI-assisted investigation

No investigation has been carried out yet. The proposed method is:

1. **Derivation.** Write averaged small-signal models for droop-controlled buck sources and constant-power loads with input filters, and for a network of RLC lines. Express the network as an interconnection of port-Hamiltonian or impedance blocks and attempt to derive local sufficient conditions (passivity margins and bounded non-passive regions). AI assistance would be used to explore candidate formulations and check algebra; each step would be recorded so a reviewer can follow it.
2. **Numerical comparison.** Generate random networks within a defined class (number of nodes, cable lengths, ratings), compute exact eigenvalues of the linearised system, and compare with the local rule. Report how often the rule rejects stable networks (conservativeness) and whether it ever accepts an unstable one (which would refute it).
3. **Switched simulation.** Check selected boundary cases with switched converter models to see whether averaged-model conclusions survive switching ripple, digital delay and current limits.

Proposed tools: Python with NumPy and SciPy for models and eigenvalue sweeps, and open circuit simulators for switched cases. All code and parameter sets would be published before the status changes to Modelled or Simulated.

## Preliminary findings

None. This exploration is at the Concept stage: no derivation, model or simulation has been completed, so there are no observations or interpretations to report. The equation in the Hypothesis section is a standard textbook result, not a finding of this work.

## Limitations and unknowns

- **Small-signal only.** Even a small-signal-stable network can collapse after a large disturbance; constant-power loads are known to have limited large-signal regions of attraction. A local small-signal rule says nothing about that.
- **Model fidelity.** Averaged models omit switching ripple, sampling and PWM delays, which often limit how much damping a digital controller can add.
- **Nonlinearities.** Current limits, saturation and mode changes (for example a source entering current limit) change terminal behaviour precisely when stability matters.
- **Conservativeness.** A guaranteed rule may forbid designs that work well in practice. If the cost is large, the rule may be correct and still useless.
- **Network class.** Results will depend on the assumed class: radial or meshed, cable lengths, presence of storage with its own control. A rule proven for one class may not transfer.
- **Alternative explanations.** If simulated networks are stable, the reason could be cable resistance damping or parameter choices rather than the local rule itself; comparisons must isolate the rule's contribution.

## Human review and validation

What engineers and scientists would need to review:

- whether the chosen port definitions and passivity conditions are applied at the correct terminals, including the sign conventions of source and load ports;
- whether the derivation's assumptions (time-scale separation, lumped lines, ideal sensing) are stated and justified;
- whether the random network class is representative of real DC distribution systems.

Experiments and simulations that could confirm or falsify the hypothesis:

- **Impedance measurement.** On a laboratory DC bus (for example 48 V or 380 V) with three or four converters and programmable electronic loads in constant-power mode, measure each converter's output or input impedance with a frequency-response analyser and check it against the local rule.
- **Boundary test.** Increase constant-power load until oscillation appears, and compare the measured boundary with the boundary predicted by the exact model and by the local rule.
- **Adversarial search.** Search numerically for interconnections in which every device satisfies the rule but the system is unstable. Finding one in a validated model would refute the hypothesis as stated.

## Open contributions

Useful contributions at this stage:

- a critique of the hypothesis or a pointer to existing work that already answers the question (which would be a valid outcome);
- measured output- or input-impedance data from real DC converters, with test conditions;
- a first averaged model of a small network that others can rerun.

Use the links at the end of this page to discuss the question or suggest a change. Contributed models and data will be linked from the evidence record with their own limitations, and reusable parts will be offered to the [AIPE Hub]({{ '/hub/' | relative_url }}).

### References

1. R. D. Middlebrook, "Input filter considerations in design and application of switching regulators," *IEEE Industry Applications Society Annual Meeting*, 1976.
2. X. Feng, J. Liu and F. C. Lee, "Impedance specifications for stable DC distributed power systems," *IEEE Transactions on Power Electronics*, vol. 17, no. 2, 2002.
3. A. Emadi, A. Khaligh, C. H. Rivetta and G. A. Williamson, "Constant power loads and negative impedance instability in automotive systems: definition, modeling, stability, and control of power electronic converters and motor drives," *IEEE Transactions on Vehicular Technology*, vol. 55, no. 4, 2006.
4. J. M. Guerrero, J. C. Vasquez, J. Matas, L. G. de Vicuña and M. Castilla, "Hierarchical control of droop-controlled AC and DC microgrids — a general approach toward standardization," *IEEE Transactions on Industrial Electronics*, vol. 58, no. 1, 2011.
5. T. Dragičević, X. Lu, J. C. Vasquez and J. M. Guerrero, "DC microgrids — Part I: a review of control strategies and stabilization techniques," *IEEE Transactions on Power Electronics*, vol. 31, no. 7, 2016.
6. S. Anand and B. G. Fernandes, "Reduced-order model and stability analysis of low-voltage DC microgrid," *IEEE Transactions on Industrial Electronics*, vol. 60, no. 11, 2013.
