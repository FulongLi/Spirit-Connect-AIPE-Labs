---
title: "Power semiconductor ageing from operational data"
lang: en
permalink: /explorations/semiconductor-ageing-from-operational-data/
translation_key: semiconductor-ageing-from-operational-data
status: concept
question: "Can power semiconductor degradation be estimated from the data a converter already measures for control, without dedicated diagnostic measurements?"
description: "An open question on whether drifts in thermal resistance and on-state voltage can be separated from operating-point, ambient and sensor variation using only the currents, voltages and heatsink temperature a converter already logs."
domains: [devices]
opened: 2026-10-08
updated: 2026-10-08
featured: false
math: true
ai_disclosure: "Drafted with AI assistance and published by AIPE Labs for open review. No independent engineer has reviewed it yet. The references are widely cited publications listed for orientation; check each one before relying on it."
evidence: []
hub:
  uses: [aipe.semiconductor-database, aipe.simulation-skills]
  produces: []
learn:
  - title: "Power Semiconductor Devices"
    url: /power/devices/
    kind: "Engineering domain"
  - title: "Power Cycling Reliability: Controlled Self-Heating and Degradation Evidence"
    url: /resources/blog/power-cycling-reliability/
    kind: "Engineering article"
  - title: "Measuring Junction Temperature: Calibration, TSEPs and Measurement Delay"
    url: /resources/blog/junction-temperature-measurement/
    kind: "Engineering article"
  - title: "Transient Thermal Impedance: From Heating Curves to Validated RC Models"
    url: /resources/blog/transient-thermal-impedance/
    kind: "Engineering article"
  - title: "From Mission Profile to Lifetime: Damage Models, Weibull Statistics and Uncertainty"
    url: /resources/blog/mission-profile-lifetime-estimation/
    kind: "Engineering article"
---

## Research question

Power modules in inverters, drives and DC–DC converters wear out. Bond wires crack and lift off; solder layers fatigue and delaminate. Laboratory condition monitoring detects this with dedicated measurements — on-state voltage at a calibrated current, thermal impedance from a heating or cooling curve — but most converters in the field do not perform those tests.

The question is:

> Can degradation of a power module be estimated **from the signals a converter already measures for control** — phase currents, DC-link voltage, switching commands and a heatsink or baseplate temperature sensor — without added sensors, test modes or downtime?

If it can, existing converters could gain condition monitoring through firmware and data analysis alone. If it cannot, it is valuable to know which minimal additional measurement would make it possible.

## Hypothesis

Ageing changes relationships between quantities that are already measured:

- **Solder degradation** raises the thermal resistance between junction and case, so for the same estimated losses the temperature distribution inside the module changes, and the temperature seen by an on-board sensor responds differently to load steps.
- **Bond-wire degradation** raises the on-state voltage, which slightly increases conduction losses and changes the voltage error that the controller already compensates (for example in dead-time or voltage-feedforward terms).

The hypothesis is that a model-based estimator — a reduced thermal network driven by losses computed from measured currents, voltages and switching states, with slowly varying parameters — can track these changes over weeks or months and separate them from variation in operating point, ambient temperature, cooling performance and sensor drift.

For a simple thermal network, the steady-state junction temperature is

$$
T_j = T_\text{a} + P_\text{loss}\,\bigl(R_{\text{th,jc}} + R_{\text{th,ch}} + R_{\text{th,ha}}\bigr),
$$

but a sensor on the heatsink sees mainly the $$R_{\text{th,ha}}$$ part. Whether a change in $$R_{\text{th,jc}}$$ is observable through such a sensor — through dynamics rather than steady state — is the crux of the question.

## Existing knowledge

The following are established and are the starting point; they are not claims of this exploration.

- **Failure mechanisms and precursors.** Bond-wire lift-off and solder fatigue are dominant wear-out mechanisms in power modules. Rising on-state voltage and rising thermal resistance are widely used precursors, and condition-monitoring methods built on them have been reviewed extensively [1], [2], [3].
- **Junction temperature estimation.** Temperature-sensitive electrical parameters (TSEPs) and thermal models are the standard ways to estimate junction temperature without direct access to the die [4].
- **Lifetime models.** Power cycling lifetime depends on temperature swing, mean temperature, heating time and other factors, captured in empirical models such as that of Bayerer et al. [5]; system-level reliability design is surveyed in [6].
- **Accelerated-ageing data.** Public accelerated-ageing datasets exist, for example the IGBT ageing data published by the NASA Ames Prognostics Center of Excellence. Their suitability for this question has not been assessed here.

How the question differs: most published monitoring methods add a measurement (on-state voltage sensing circuits, dedicated test pulses, or junction-temperature sensing). This exploration asks what is achievable with **no added hardware**, and treats the separation of ageing from confounding effects as the main problem rather than an afterthought.

## AI-assisted investigation

No investigation has been carried out yet. The proposed method is:

1. **Sensitivity and observability.** Using a Cauer or Foster thermal network that includes the sensor location, compute how strongly the sensor's response to load steps depends on junction-to-case resistance compared with case-to-heatsink and heatsink-to-ambient resistance. Estimate, for realistic sensor noise and resolution, the smallest detectable change.
2. **Synthetic ageing.** Combine a loss model (using device parameters, for example from the AIPE semiconductor database) with a thermal network, impose gradual degradation, and add ambient variation, cooling-fan wear, thermal-interface degradation and current-sensor drift. Test whether an estimator can attribute the change to the correct cause.
3. **Public data.** Assess whether existing accelerated-ageing datasets contain the signals a converter would have, and if so, evaluate the estimator on them.

Proposed tools: Python for models and estimation, with all scripts and parameters published before the status changes.

## Preliminary findings

None. This exploration is at the Concept stage: no model, analysis or simulation has been completed, so there are no observations or interpretations to report. The thermal-network equation above is a standard relation, not a finding of this work.

## Limitations and unknowns

- **Weak observability.** A heatsink sensor may be too far from the die, and too slow, for junction-to-case changes to be distinguishable from noise.
- **Confounding effects.** Cooling degradation (fan wear, dust, thermal-interface pump-out) raises temperatures in a similar way to solder ageing; ambient conditions and operating-point changes add further variation.
- **Loss-model uncertainty.** Losses computed from datasheet values carry errors of the same order as the effects being sought.
- **Device technology.** Silicon carbide MOSFETs show threshold-voltage drift that changes on-state behaviour without implying package ageing; methods developed for IGBTs may not transfer.
- **Baseline.** Any drift estimate needs a reliable baseline from commissioning, which many installed converters do not have.
- **Alternative explanations.** A detected "drift" could come from sensor ageing or firmware changes; the investigation must show it can rule these out.

## Human review and validation

What engineers and scientists would need to review:

- the thermal network and the assumed sensor location and dynamics;
- the loss model and its stated uncertainty;
- whether confounding effects are represented realistically.

Experiments that could confirm or falsify the hypothesis:

- **Power cycling with blind evaluation.** Age modules in a power cycling test while recording only signals a converter would have. Measure on-state voltage and thermal impedance separately as ground truth, and evaluate the estimator without access to it. Commonly used end-of-test criteria in power cycling (for example a fixed percentage rise in thermal resistance or on-state voltage) give a natural detection target; use the criteria of the applicable standard.
- **Confounder test.** Deliberately degrade cooling (reduced fan speed, degraded thermal interface) on a healthy module and check that the estimator does not report device ageing.
- **Falsification criterion.** If, with realistic noise, the estimator cannot separate device ageing from cooling degradation before the end-of-test criterion is reached, the hypothesis fails for that sensor arrangement.

## Open contributions

Useful contributions at this stage:

- pointers to work that has already achieved, or ruled out, monitoring without added sensors;
- operational converter data (currents, voltages, temperatures) with known module history, shared under a clear licence;
- review by device reliability or thermal-modelling specialists.

Use the links at the end of this page to discuss the question or suggest a change. Device data and models produced by the investigation will be offered to the [AIPE Hub]({{ '/hub/' | relative_url }}) with their own maturity and limitations.

### References

1. S. Yang, D. Xiang, A. Bryant, P. Mawby, L. Ran and P. Tavner, "Condition monitoring for device reliability in power electronic converters: a review," *IEEE Transactions on Power Electronics*, vol. 25, no. 11, 2010.
2. H. Oh, B. Han, P. McCluskey, C. Han and B. D. Youn, "Physics-of-failure, condition monitoring, and prognostics of insulated gate bipolar transistor modules: a review," *IEEE Transactions on Power Electronics*, vol. 30, no. 5, 2015.
3. U.-M. Choi, F. Blaabjerg and K.-B. Lee, "Study and handling methods of power IGBT module failures in power electronic converter systems," *IEEE Transactions on Power Electronics*, vol. 30, no. 5, 2015.
4. Y. Avenas, L. Dupont and Z. Khatir, "Temperature measurement of power semiconductor devices by thermo-sensitive electrical parameters — a review," *IEEE Transactions on Power Electronics*, vol. 27, no. 6, 2012.
5. R. Bayerer, T. Herrmann, T. Licht, J. Lutz and M. Feller, "Model for power cycling lifetime of IGBT modules — various factors influencing lifetime," *International Conference on Integrated Power Electronics Systems (CIPS)*, 2008.
6. H. Wang, M. Liserre and F. Blaabjerg, "Toward reliable power electronics: challenges, design tools, and opportunities," *IEEE Industrial Electronics Magazine*, vol. 7, no. 2, 2013.
