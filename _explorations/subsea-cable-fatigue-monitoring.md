---
title: "Sensor-reduced subsea cable fatigue monitoring"
lang: en
permalink: /explorations/subsea-cable-fatigue-monitoring/
translation_key: subsea-cable-fatigue-monitoring
status: concept
question: "Can fatigue damage in a dynamic subsea power cable be estimated from measurements at accessible locations, without conventional sensors along the submerged cable?"
description: "An open question on whether hang-off motion, platform measurements and a physics-based cable model can reconstruct the load history, and therefore the fatigue damage, at the critical points of a dynamic subsea cable."
domains: [systems]
opened: 2026-10-08
updated: 2026-10-08
featured: false
math: true
ai_disclosure: "Drafted with AI assistance and published by AIPE Labs for open review. No independent engineer has reviewed it yet. The references are widely cited publications and standards listed for orientation; check each one, and the current edition of any standard, before relying on it."
evidence: []
hub:
  uses: [aipe.simulation-skills]
  produces: []
learn:
  - title: "From Mission Profile to Lifetime: Damage Models, Weibull Statistics and Uncertainty"
    url: /resources/blog/mission-profile-lifetime-estimation/
    kind: "Engineering article · damage accumulation"
---

## Research question

Floating offshore wind turbines are connected by **dynamic** power cables: cables that hang from a moving platform through the water column before reaching the seabed. Wave-induced platform motion makes the cable bend and stretch millions of times over its life. Fatigue damage concentrates at a few locations — typically where the cable leaves the bend stiffener at the hang-off, and near the touchdown point on the seabed — and those locations are underwater and hard to instrument.

The question is:

> Can the fatigue damage accumulated at the critical sections of a dynamic subsea cable be **estimated from measurements made only at accessible locations** — the platform, the hang-off and the electrical terminals — with enough accuracy to support inspection and replacement decisions?

A reliable answer would allow fatigue to be tracked on existing cables that were installed without distributed strain sensing, and would reduce the instrumentation needed on new ones.

## Hypothesis

Along most of its length, a dynamic cable's motion is driven by the motion imposed at the hang-off and by the waves and current acting on it. The platform's motion can be measured accurately with inertial sensors, and met-ocean conditions are often measured or hindcast. The hypothesis is that:

1. a physics-based cable model (finite-element or lumped-mass) driven by the **measured hang-off motion** can predict curvature and tension histories at the critical sections;
2. a state estimator — for example a Kalman filter or a modal-expansion "virtual sensor" — can correct that model using the available measurements, so that model and environmental uncertainty do not grow without bound; and
3. the reconstructed stress histories, processed with rainflow counting, S–N curves and Miner's rule, give a damage estimate whose uncertainty is small enough to be useful.

Fatigue damage under Miner's rule is the sum of cycle ratios:

$$
D = \sum_i \frac{n_i}{N_i}, \qquad \text{with failure conventionally assumed as } D \to 1,
$$

where $$n_i$$ is the number of cycles counted at stress range $$\Delta\sigma_i$$ and $$N_i$$ the number of cycles to failure at that range from the S–N curve. Because $$N_i$$ falls steeply with stress range, modest errors in reconstructed curvature can produce large errors in $$D$$ — which is why the estimator's uncertainty is the central question.

An additional, more speculative idea: where a cable already carries optical fibre for temperature sensing, or where conductor current is logged, those signals might help constrain the cable's thermal state and therefore temperature-dependent material properties. Whether they carry any useful fatigue information is unknown.

## Existing knowledge

The following are established and are the starting point; they are not claims of this exploration.

- **Fatigue assessment.** Cumulative damage under variable-amplitude loading is commonly assessed with S–N curves and the Palmgren–Miner rule [1]. Offshore fatigue design practice, including S–N curves and stress-concentration treatment, is codified in recommended practices such as DNV-RP-C203 [2], and subsea power cable design is addressed by DNV-RP-F401 [3].
- **Dynamic cables for floating wind.** The configuration of dynamic inter-array cables (lazy-wave shapes, buoyancy modules, bend stiffeners) strongly affects fatigue loading and has been studied with numerical design optimisation [4].
- **Virtual sensing.** Response at unmeasured locations of offshore structures has been estimated from a limited number of sensors by modal decomposition and expansion, for example on monopile offshore wind turbines [5]. State estimation by Kalman filtering is a standard framework for combining a dynamic model with noisy measurements [6].
- **Riser monitoring.** Motion- and strain-based fatigue monitoring of flexible risers and umbilicals is an established practice in the offshore oil and gas industry; its methods are a natural reference point for power cables.

How the question differs: power cables have their own construction (conductor, insulation, armour layers) and failure modes, and are often installed without distributed strain sensing. The exploration asks specifically whether measurements **outside the water** are sufficient, and quantifies the resulting uncertainty in damage rather than in displacement.

## AI-assisted investigation

No investigation has been carried out yet. The proposed method is:

1. **Literature comparison.** Map what has been published on hang-off-driven fatigue estimation for risers, umbilicals and power cables, to establish whether this question has already been answered and where the gaps are. AI assistance would be used to search and summarise; every reference would be checked against the original source.
2. **Observability analysis.** For a linearised cable model, determine which states at the bend-stiffener exit and touchdown are observable from hang-off motion and platform measurements, and how observability changes with sea state and current.
3. **Synthetic twin study.** Simulate a "true" cable with an open-source lumped-mass solver (for example MoorDyn) under irregular waves and current, with parameters the estimator does not know exactly. Estimate damage from hang-off data only and compare with the true damage. Use a different model or discretisation for the truth than for the estimator to avoid the "inverse crime" of testing a method on data generated by itself.

All models, sea states and scripts would be published before the status changes to Modelled or Simulated.

## Preliminary findings

None. This exploration is at the Concept stage: no model, analysis or simulation has been completed, so there are no observations or interpretations to report. The Miner's-rule expression above is standard practice, not a finding of this work.

## Limitations and unknowns

- **Bending hysteresis.** The bending stiffness of an armoured cable depends on friction between layers and is hysteretic; a simple beam model may misrepresent curvature at the critical sections.
- **Changing properties.** Marine growth changes mass and hydrodynamic drag over the years; buoyancy modules can lose buoyancy or shift. An estimator calibrated at installation may drift.
- **Seabed interaction.** Touchdown behaviour depends on soil, trenching and scour, which are rarely measured.
- **Current profile.** Currents along the water column are seldom measured continuously, yet they affect cable shape.
- **Fatigue data scatter.** S–N curves for cable components carry large scatter; damage estimates inherit it regardless of how well loads are reconstructed.
- **Electrical observables.** Temperature and current signals may be insensitive to mechanical state; including them could add complexity without information.
- **Alternative explanations.** Good agreement in a synthetic study may reflect a truth model that is too similar to the estimator, rather than a method that will work at sea.

## Human review and validation

What engineers and scientists would need to review:

- the cable mechanics model, especially bending-stiffness treatment and boundary conditions at the bend stiffener and seabed;
- the fatigue methodology: hot-spot definition, S–N curve selection and treatment of mean stress;
- whether the synthetic study genuinely separates the truth model from the estimator.

Experiments that could confirm or falsify the hypothesis:

- **Scale-model test.** An instrumented model cable in a wave basin, with strain gauges or optical strain sensing along its length as ground truth, and hang-off motion as the only input to the estimator. Compare estimated and measured curvature histories and damage.
- **Full-scale comparison.** Compare estimates against a cable fitted with distributed strain sensing, or against inspection findings after retrieval.
- **Falsification criterion.** If the estimated damage is consistently biased, or its uncertainty is larger than the scatter already present in the S–N data, the approach does not add useful information and the hypothesis should be marked Refuted for that cable class.

## Open contributions

Useful contributions at this stage:

- pointers to published work that already answers this question for power cables, risers or umbilicals;
- open cable models, sea-state data or wave-basin datasets that could support a synthetic or scale-model study;
- review of the hypothesis by cable, offshore structures or fatigue specialists.

Use the links at the end of this page to discuss the question or suggest a change. Reusable models or datasets produced by the investigation will be offered to the [AIPE Hub]({{ '/hub/' | relative_url }}) with their own maturity and limitations.

### References

1. M. A. Miner, "Cumulative damage in fatigue," *Journal of Applied Mechanics*, vol. 12, 1945.
2. DNV, *DNV-RP-C203: Fatigue design of offshore steel structures* (recommended practice; check the current edition).
3. DNV, *DNV-RP-F401: Electrical power cables in subsea applications* (recommended practice; check the current edition).
4. M. U. T. Rentschler, F. Adam and P. Chainho, "Design optimization of dynamic inter-array cable systems for floating offshore wind turbines," *Renewable and Sustainable Energy Reviews*, vol. 111, 2019.
5. A. Iliopoulos, R. Shirzadeh, W. Weijtjens, P. Guillaume, D. Van Hemelrijck and C. Devriendt, "A modal decomposition and expansion approach for prediction of dynamic responses on a monopile offshore wind turbine using a limited number of vibration sensors," *Mechanical Systems and Signal Processing*, vol. 68–69, 2016.
6. R. E. Kalman, "A new approach to linear filtering and prediction problems," *Journal of Basic Engineering*, vol. 82, no. 1, 1960.
