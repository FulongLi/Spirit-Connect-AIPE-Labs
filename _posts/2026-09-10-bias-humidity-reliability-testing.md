---
layout: post
title: "Bias and Humidity Reliability Tests: HTRB, HTGB and Moisture Stress"
description: "Choose electrical and environmental stresses from the failure mechanism, control the specimen conditions and distinguish persistent damage from recoverable parameter drift."
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
math: true
device_testing_series: true
zh_url: /zh/resources/blog/
---

An off-state power switch still experiences electrical stress. A blocking voltage produces electric field in the semiconductor and its termination; gate bias stresses the gate structure. Temperature and moisture can change leakage, charge trapping and degradation rates. These effects require different experiments from repeated mechanical fatigue in [power cycling]({% post_url 2026-09-10-power-cycling-reliability %}).

The purpose of a bias or humidity test is to expose a specified failure mechanism under controlled conditions. The test name alone does not define its voltage, temperature, duration or acceptance limit. This chapter completes the environmental stress part of the [characterisation guide]({% post_url 2026-09-10-power-semiconductor-characterisation-guide %}).

## 1. Match each stress to a physical question

| Test family | Applied condition | Principal question and interpretation limit |
|---|---|---|
| High-temperature reverse bias, HTRB | Elevated temperature with the device blocking a specified voltage | Stability of blocking structures, termination and associated leakage; the gate state must be defined |
| High-temperature gate bias, HTGB | Elevated temperature with specified gate bias and other terminal connections | Gate-structure leakage and parameter stability; positive and negative bias can probe different responses |
| High-temperature operating life, HTOL | Elevated temperature with a defined operating circuit and electrical activity | Degradation under that operating mode; it is not a synonym for every high-temperature bias test |
| Temperature–humidity–bias, THB | Controlled temperature and humidity with defined electrical bias | Moisture-related leakage, surface conduction, corrosion or insulation degradation |
| High-humidity high-temperature reverse bias, H3TRB | A humidity/bias programme with the power device in a specified blocking state | Moisture sensitivity under blocking field; names and abbreviations vary between programmes |
| Highly accelerated stress test, HAST; unbiased HAST | Controlled elevated temperature, moisture and pressure, with or without bias as specified | Accelerated moisture exposure; its gradients and mechanisms need not reproduce a lower-temperature humidity test |

An [Infineon device qualification report](https://www.infineon.com/assets/row/public/documents/24/316/infineon-imw65r007m2h-productqualificationreport-en.pdf) provides a concrete example of separately reported HTRB, HTGB and humidity-bias tests. Its conditions belong to that product and programme. The [AEC document catalogue](https://www.aecouncil.com/AECDocuments.html) identifies the qualification documents for discrete semiconductors and other component classes. Select the applicable document and revision before describing a test as compliant.

These families form a test inventory, not a requirement to apply every stress to every device. Device construction matters: a MOS gate, a GaN gate structure and the internal devices of a cascode do not share an interchangeable stress limit.

## 2. Define the electrical and thermal boundaries

Draw all terminal connections, including the gate state, source/emitter reference and any monitoring paths. Specify applied voltage at the specimen, polarity, ramp sequence, current compliance, bias interruptions and actual accumulated stress time. Series protection resistance can reduce the DUT voltage as leakage rises; log the terminal voltage rather than assuming the supply setting remains the stress.

In a simple one-dimensional dielectric approximation,

$$
E_{\mathrm{ox}}\approx\frac{V_{\mathrm{ox}}}{t_{\mathrm{ox}}}.
\tag{1}
$$

Here $$V_{\mathrm{ox}}$$ is the voltage across the oxide and $$t_{\mathrm{ox}}$$ its thickness. Terminal gate voltage is not automatically the oxide voltage: surface potential, trapped charge and the device structure affect the field. This equation explains the role of electrical field; it does not determine a permissible gate-stress voltage from terminal ratings alone.

Use the specimen temperature relevant to the mechanism. Chamber air temperature, package temperature and junction temperature can differ. During blocking stress,

$$
P_{\mathrm{leak}}=V_{\mathrm{block}}I_{\mathrm{leak}}.
\tag{2}
$$

For illustration, 600 V and 100 µA imply 60 mW; a rise to 1 mA implies 0.6 W. Whether that heating is significant depends on the actual thermal path. Temperature-dependent leakage can create positive feedback. Protection and logging must make a developing thermal excursion distinguishable from the nominal programme.

## 3. Control moisture at the specimen

Relative humidity is temperature-dependent. A self-heated package surface can experience a different local relative humidity from the chamber sensor. Specify sensor positions, specimen loading, airflow, soak, ramp and the time at which the required conditions are established.

Condensation is a separate physical condition from humid air. An unintended liquid film can change surface leakage and corrosion pathways. Control transitions into and out of the chamber; if condensation is intentionally part of the programme, document it explicitly.

Fixture contamination, ionic residues, insulation materials and connectors can dominate a low-leakage measurement. Run suitable blank-fixture and reference checks. Guarding can reduce unwanted measurement currents, but a guard must not remove a DUT surface path that the experiment is intended to assess.

{% include blog-figure.html file="bias-test-sequence" alt="Baseline, bias stress, timed readout and mechanism assessment" caption="The stress condition and the measurement condition are different. Record the transition between them so that recovery is not mistaken for an absence of degradation." %}

## 4. Establish the baseline and readout schedule

Measure the [static electrical baseline]({% post_url 2026-09-10-static-electrical-characterisation %}) before stress. Retain sample and lot identifiers, mounting, cleaning/preconditioning history, threshold extraction criterion, gate leakage, blocking leakage and on-state parameters.

The useful sequence is:

1. Verify fixture insulation and monitoring at reduced stress, then confirm specimen bias and temperature.
2. Apply the specified programme and log exposure, interruptions, leakage, actual voltage and chamber conditions.
3. Perform planned readouts with an explicit delay after stress removal, temperature and measurement order.
4. Repeat selected readouts after controlled recovery to distinguish transient shifts from persistent changes.
5. Investigate criterion crossings and preserve the failed specimen for physical analysis.

Bias-induced trapping can shift threshold or resistance and then partially recover. A reading one second after bias removal and a reading one hour later are different observations. Neither should be silently substituted for the other. Repeated readouts may themselves interrupt stress or alter charge state; record their timing.

For a parameter with a stable, nonzero baseline, a useful drift definition is

$$
\delta_x(t)=\frac{x(t)-x(0)}{x(0)}.
\tag{3}
$$

For near-zero leakage baselines, an absolute change or ratio with stated detection limits is often more meaningful. Do not turn a measurement below the noise floor into a precise percentage change.

## 5. Separate the DUT from the measurement system

A first measurement model is

$$
I_{\mathrm{meas}}=I_{\mathrm{DUT}}+I_{\mathrm{fixture}}+I_{\mathrm{offset}}.
\tag{4}
$$

Each term can depend on temperature, humidity and time. Subtracting one room-temperature blank does not correct an evolving chamber leakage path. Use appropriate reference measurements and carry their uncertainty into the result. With multiplexed channels, account for settling, switching transients and channel isolation.

A higher leakage current does not uniquely identify gate-oxide failure, termination damage or package-surface contamination. Repeat controlled electrical checks and use appropriate inspection or failure analysis to locate the mechanism. Preserve observations before cleaning, drying or destructive preparation changes the evidence.

## 6. Report exposure and failure evidence separately

Define failure criteria before testing, including the readout conditions and confirmation rule. Report electrical failures, recoverable drift, fixture interruptions and censored specimens separately. If a device fails between inspections, retain the last passing and first failing times instead of inventing an exact failure time.

A passing sample supports the stated programme and population. Estimating field life additionally requires a validated acceleration model, the same dominant mechanism across stress levels, and a service exposure model. Temperature, humidity and field cannot generally be combined by multiplying arbitrary acceleration factors. The [lifetime-estimation tutorial]({% post_url 2026-09-10-mission-profile-lifetime-estimation %}) develops that next step.
