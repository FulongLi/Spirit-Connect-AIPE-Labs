---
layout: post
title: "LLC Resonant Converter: From Zero to Everything"
description: "Why resonance beats hard switching — the LLC tank, FHA gain curves, ZVS, the capacitive region to avoid, and how to design and simulate one."
date: 2025-12-16
author: "Dr. Fulong Li"
math: true
converter_series: true
zh_url: /zh/resources/blog/
---

Every converter so far in this series switches **hard**: the device turns on while it is still blocking voltage, and turns off while it is still carrying current. During each of those overlaps the instantaneous power is large, and the energy lost is proportional to the switching frequency. Push the frequency up to shrink the magnetics, and switching loss eventually eats the entire efficiency budget.

The **LLC resonant converter** breaks that trade-off. By shaping the current with a resonant tank, it arranges for each switch to turn on when the voltage across it is already **zero**. Switching loss largely vanishes, frequencies of hundreds of kilohertz become practical, and efficiencies above 96 % are routine. This is why the LLC has displaced the hard-switched [half-bridge]({% post_url 2026-09-11-push-pull-half-bridge-full-bridge %}) in almost every modern computer, server and television power supply.

It is also the first converter in this series that is **not** regulated by duty cycle. It is regulated by **frequency**, and that changes how you think about the whole design.

This article works through a **390 V to 12 V, 240 W** LLC — the canonical application, converting a PFC output bus to a low-voltage rail.

> **First draft — design example, not a validated reference board.** Values are analytical starting points. The FHA model below is a sizing tool, not a certification; verify with a switching simulation. Native simulator execution and hardware measurements are not included.

**Reading route:** [why resonance](#why) → [the tank](#tank) → [gain curves](#gain) → [ZVS](#zvs) → [design](#design) → [light load](#lightload) → [control](#control) → [simulation](#simulation) → [applications](#applications).

## 1. Why resonance {#why}

In a hard-switched converter the switch current and voltage overlap during every transition, dissipating roughly

$$
P_{\mathrm{sw}}\approx\tfrac12V_{\mathrm{DS}}I_{\mathrm{sw}}(t_r+t_f)f_s.
\tag{1}
$$

Everything in that expression is fixed by the application except $$f_s$$ — so switching loss scales linearly with frequency, while the magnetics you are trying to shrink only scale as roughly $$1/f_s$$. The two effects fight, and there is an efficiency-optimal frequency beyond which raising $$f_s$$ makes things worse.

A resonant converter attacks the $$V_{\mathrm{DS}}I_{\mathrm{sw}}$$ product directly. Instead of chopping a voltage into a rectangular wave and filtering it, it drives a **resonant tank** whose current is nearly sinusoidal and **lags** the applied voltage. If the current still flows in the right direction when a switch turns off, that current will discharge the incoming switch's capacitance during the dead time — so the next device turns on at essentially **zero volts**.

That is **zero-voltage switching (ZVS)**, and equation (1) collapses because $$V_{\mathrm{DS}}$$ is zero at turn-on. The LLC achieves it across the entire load range, which is what makes it special.

## 2. The tank: three elements, two resonances {#tank}

The name describes the tank: two inductances and a capacitance, **L–L–C**.

```text
        S1          Lr        Cr
  Vin --o--o-------coil------||-----o----o  |E  secondary
        |  |                        |    |  |E  + rectifier
       ===  (switch node)          Lm    |  |E  + output LC
        |  |                        |    |
        o--o S2 ----------------------------o
```

- **$$L_r$$** — the series resonant inductance (often just the transformer's leakage inductance).
- **$$C_r$$** — the series resonant capacitor, which also blocks DC and so prevents flux walking for free.
- **$$L_m$$** — the transformer's **magnetising** inductance, deliberately made small so that it participates in the resonance instead of being a parasitic nuisance.

That last point is the conceptual leap. In a forward or bridge converter you want $$L_m$$ as large as possible. In an LLC, $$L_m$$ is a **design parameter**: it supplies the circulating current that achieves ZVS, and it creates a second resonance. An LLC transformer is therefore built with a deliberate air gap and deliberately loose coupling — it would be considered a badly built transformer anywhere else in this series.

The two resonances are:

$$
f_r=\frac{1}{2\pi\sqrt{L_rC_r}}
\qquad\text{(series resonance, with the output loaded)}
\tag{2}
$$

$$
f_m=\frac{1}{2\pi\sqrt{(L_r+L_m)C_r}}
\qquad\text{(lower resonance, output unloaded)}
\tag{3}
$$

When the output diodes conduct, the secondary clamps the transformer voltage and $$L_m$$ is effectively shorted out — so the circuit resonates at $$f_r$$. When they are not conducting, $$L_m$$ joins the tank and the resonance drops to $$f_m$$. The converter lives **between and around these two frequencies**, and that is why its behaviour is richer than anything driven by duty cycle.

For our example, with $$L_r=80\ \mu\mathrm{H}$$, $$C_r=33\ \mathrm{nF}$$ and $$L_m=400\ \mu\mathrm{H}$$:

$$
f_r=97.95\ \mathrm{kHz},\qquad f_m=39.99\ \mathrm{kHz}.
\tag{4}
$$

### The two design ratios

Everything about an LLC's character is captured by two dimensionless numbers:

$$
L_n=\frac{L_m}{L_r},
\qquad
Q=\frac{\sqrt{L_r/C_r}}{R_{ac}},
\qquad
R_{ac}=\frac{8}{\pi^2}n^2R_{\mathrm{load}}.
\tag{5}
$$

$$L_n$$ is the inductance ratio — small values give more gain range but more circulating current. $$Q$$ is the loaded quality factor, and because $$R_{ac}$$ depends on the load, **$$Q$$ changes with load**: light load means low $$Q$$, full load means high $$Q$$. The factor $$8/\pi^2$$ converts the square-wave-driven rectifier and load into the equivalent resistance seen by the fundamental.

For our design: $$L_n=5.0$$, $$R_{ac}=124.5\ \Omega$$ and $$Q=0.396$$ at full load.

## 3. The gain curve — the LLC's central design tool {#gain}

Assume only the fundamental of the square-wave excitation transfers power. This **first harmonic approximation (FHA)** gives the tank's voltage gain as a function of normalised frequency $$f_n=f_s/f_r$$:

$$
\boxed{M(f_n)=\cfrac{1}{\sqrt{\left(1+\cfrac{1}{L_n}-\cfrac{1}{L_nf_n^2}\right)^2+Q^2\left(f_n-\cfrac{1}{f_n}\right)^2}}}
\tag{6}
$$

and the output follows from the half-bridge excitation and the turns ratio:

$$
V_{\mathrm{out}}=M\cdot\frac{V_{\mathrm{in}}/2}{n}.
\tag{7}
$$

Evaluating (6) at $$L_n=5$$ across load:

| $$f_n$$ | Q=0.1 (light) | Q=0.2 | Q=0.396 (full) | Q=0.8 (overload) |
|---|---|---|---|---|
| 0.50 | 2.341 | 2.000 | 1.398 | 0.791 |
| 0.60 | 1.531 | 1.473 | 1.298 | 0.935 |
| 0.70 | 1.258 | 1.242 | 1.187 | 1.017 |
| 0.80 | 1.125 | 1.121 | 1.105 | 1.044 |
| 0.90 | 1.049 | 1.048 | 1.045 | 1.033 |
| **1.00** | **1.000** | **1.000** | **1.000** | **1.000** |
| 1.10 | 0.966 | 0.966 | 0.964 | 0.956 |
| 1.20 | 0.942 | 0.940 | 0.934 | 0.908 |
| 1.40 | 0.909 | 0.904 | 0.884 | 0.815 |

### Read three things from this table

**One.** At $$f_n=1$$ the gain is **exactly 1.000 for every load**. At series resonance the tank is purely resistive, $$L_m$$ is clamped out, and the converter behaves as an ideal transformer. This **load-independent point** is the anchor of every LLC design: choose $$n$$ so the converter sits at or near $$f_r$$ at its nominal input, and it will be efficient and well-behaved there regardless of load.

**Two.** **Above $$f_n=1$$ the gain is below 1** and only mildly load-dependent — a gentle, well-behaved buck region.

**Three.** **Below $$f_n=1$$ the gain rises above 1**, and it becomes strongly load-dependent. At light load the gain climbs steeply; at heavy load it is much flatter and eventually turns over. This asymmetry is the source of both the LLC's greatest strength (it can boost during input dropout) and its most awkward problems.

For our design, choosing $$n=16$$ puts the output at $$M=1$$ at

$$
V_{\mathrm{out}}=\frac{390/2}{16}=12.19\ \mathrm{V},
\tag{8}
$$

so the converter runs just above resonance to trim to 12.0 V — an ideal operating point.

### Peak gain sets the hold-up capability

At full load ($$Q=0.396$$) the gain peaks at

$$
M_{\mathrm{peak}}=1.399\quad\text{at}\quad f_n=0.490\ (48.0\ \mathrm{kHz}).
\tag{9}
$$

That headroom is what lets the converter keep regulating when the input sags — down to

$$
V_{\mathrm{in,min}}=\frac{2nV_{\mathrm{out}}}{M_{\mathrm{peak}}}=274\ \mathrm{V}.
\tag{10}
$$

In an offline supply that number *is* the **hold-up specification**: when mains is lost, the PFC bus decays from 390 V, and the LLC must keep the output alive until it falls to 274 V. Sizing the bulk capacitor and choosing $$L_n$$ and $$Q$$ are therefore the same design decision.

## 4. Zero-voltage switching, and the region you must never enter {#zvs}

The gain curve has a peak. To the **right** of that peak the tank is **inductive**: current lags voltage, and there is still inductive current available during the dead time to discharge the incoming switch's capacitance. **ZVS is achieved.**

To the **left** of the peak the tank becomes **capacitive**: current *leads* voltage. Now the switch turns on while its body diode is conducting in the wrong direction, and the diode is forced to hard-commutate with severe reverse recovery. Current spikes are large, losses are enormous, and bridge failure is common and fast.

> **The single most important LLC design rule: always operate on the inductive side of the peak-gain curve, at every load and every input voltage.**

For our design that means keeping $$f_s$$ above about **48 kHz** at full load. Because the peak moves with load, a practical controller enforces a **minimum frequency limit** and relies on overcurrent protection to prevent the tank being driven into the capacitive region during startup, overload or short circuit. Startup in particular begins with a fully discharged output — effectively a short — so LLCs universally start at high frequency and **sweep downward**, never the reverse.

ZVS also requires enough magnetising current to actually discharge the switch capacitance within the dead time:

$$
I_m\,t_{\mathrm{dead}}\ \ge\ 2C_{\mathrm{oss}}V_{\mathrm{in}}.
\tag{11}
$$

This is the constraint that stops you making $$L_m$$ arbitrarily large. A bigger $$L_m$$ means less circulating current and lower conduction loss — but below the threshold in (11) you lose ZVS and the efficiency advantage with it. Choosing $$L_n$$ is precisely this balance.

## 5. Designing the tank {#design}

| Quantity | Value |
|---|---|
| Input | 390 V nominal (PFC output) |
| Output | 12 V, 20 A, 240 W (0.6 Ω) |
| Turns ratio $$n$$ | 16 |
| $$L_r$$ | 80 µH |
| $$C_r$$ | 33 nF |
| $$L_m$$ | 400 µH ($$L_n=5$$) |
| $$f_r$$ | 97.95 kHz |

A workable sequence:

1. **Choose $$n$$** so that $$M=1$$ at nominal input: $$n=V_{\mathrm{in,nom}}/(2V_{\mathrm{out}})$$. This places the converter at the load-independent point where it is most efficient.
2. **Choose $$L_n$$** — typically 3 to 8. Lower gives more gain range and better hold-up but more circulating current and higher conduction loss. $$L_n=5$$ is a common compromise.
3. **Choose $$Q$$ at full load** — typically 0.3 to 0.5. Higher $$Q$$ means a sharper, more load-sensitive curve and a lower peak gain.
4. **Check the peak gain** against the minimum input voltage required, using (9) and (10). If the hold-up requirement is not met, reduce $$L_n$$ or $$Q$$ and iterate.
5. **Pick $$f_r$$**, then solve for the components: $$C_r=1/(2\pi f_rZ_o)$$ and $$L_r=Z_o/(2\pi f_r)$$, where $$Z_o=QR_{ac}$$.
6. **Verify the ZVS condition** (11) at high line and light load, where it is hardest.
7. **Re-verify in a switching simulation.** FHA is optimistic below resonance, where the waveforms are least sinusoidal — precisely the region that determines hold-up.

The [FHA gain-curve script]({{ '/assets/downloads/llc-converter/llc_fha_gain.m' | relative_url }}) performs steps 2–5 and plots the family of curves. It runs in MATLAB or GNU Octave with no toolbox.

**Do not forget the capacitor voltage.** $$C_r$$ carries the full resonant current and develops a large AC voltage — often several hundred volts peak, well above the output. It must be a high-quality, low-loss film capacitor with an adequate voltage rating; an underrated $$C_r$$ is a common cause of field failure.

## 6. The light-load problem {#lightload}

Look again at the gain table. At $$Q=0.1$$ the curve is almost flat between $$f_n=0.9$$ and $$f_n=1.4$$ — a gain change of only about 0.14 across a 55 % frequency change. As the load falls further the curve flattens more, and at no load the gain barely responds to frequency at all.

The consequence is that **frequency control loses authority at light load**. To reduce the output slightly, the controller must raise the frequency enormously — to several hundred kilohertz or beyond — where gate-drive and core losses rise and efficiency collapses just when the load is smallest.

Every practical LLC therefore uses **burst mode** at light load: the converter runs in short packets at a sensible frequency and then stops, regulating by duty of the burst rather than by frequency. This keeps light-load efficiency high — important for standby-power regulations — at the cost of low-frequency output ripple and, if the burst frequency lands in the audible band, **transformer singing**. Choosing the burst frequency and hysteresis to stay out of 20 Hz–20 kHz is a real design task, not an afterthought.

## 7. Control {#control}

An LLC is controlled by frequency, through a voltage-controlled oscillator, with a compensator driving it. Three properties make the loop unlike anything earlier in this series:

- **The plant is strongly non-linear.** The gain-versus-frequency slope varies enormously with operating point — steep below resonance, shallow above it, nearly flat at light load. A compensator tuned at one point can be sluggish or unstable at another.
- **Small-signal models are not simple.** The state variables oscillate at the switching frequency rather than sitting at a DC operating point, so the averaging used throughout this series does not apply directly. Extended describing-function methods are the usual analytical route; most practical designs lean on simulation and measurement.
- **The loop is usually slow.** Crossover frequencies of a few kilohertz are typical, with the output capacitor handling transients.

Practical designs use a Type II compensator around the optocoupler and reference, plus **hard frequency limits** at both ends — a minimum to stay inductive, and a maximum to bound light-load operation before burst mode takes over. Overcurrent protection must act on the **resonant current**, not just the output, because the dangerous condition is entering the capacitive region, which the output voltage does not reveal until it is too late.

At 20 A output, **synchronous rectification** is essential: diode drops would cost roughly 20 W, or 8 % of the rated power. Driving the synchronous MOSFETs correctly is non-trivial, because the conduction intervals are set by the resonant current, not by the primary gate signals — most controllers sense drain voltage to determine turn-off.

## 8. Simulate it {#simulation}

Open [llc_open_loop.cir]({{ '/assets/downloads/llc-converter/llc_open_loop.cir' | relative_url }}) and plot `V(out)`, `I(Lr)`, `V(a)` and the capacitor voltage `V(b,p)`.

The experiment that teaches the whole topology is a **frequency sweep**:

| Set `FSW` | Expect | Why |
|---|---|---|
| 98 k | $$V_{\mathrm{out}}\approx12.2$$ V | at resonance, $$M=1$$ |
| 80 k | higher output | below resonance, $$M>1$$ |
| 130 k | lower output | above resonance, $$M<1$$ |

Three waveform observations:

1. **`I(Lr)` is nearly sinusoidal**, not triangular. That is the resonant shaping that makes ZVS possible.
2. **`V(a)` has already reached zero before its switch turns on.** Zoom into a transition during the dead time and watch the switch node slew on its own — that is ZVS happening, and it is the single most convincing trace in this article.
3. **`V(b,p)` — the voltage on $$C_r$$ — is large**, far bigger than the output. Measure its peak and use it to select a real capacitor rating.

Then try the **dangerous** experiment, in simulation only: set `FSW` to 40 kHz, below the peak-gain frequency. The tank turns capacitive and the switch-node waveform loses its clean ZVS transition. On real hardware that condition destroys bridges; here it costs nothing to observe.

## 9. Where LLC converters are used {#applications}

**Computer, server and telecom power supplies.** Almost universally the isolated stage after a boost PFC front end, converting 390 V to 12 V. The 80 PLUS Titanium efficiency tiers are effectively unreachable with a hard-switched bridge.

**Consumer electronics.** Televisions, monitors, games consoles and high-power adapters, where efficiency, thermal performance and standby power all matter simultaneously.

**LED lighting.** High-efficiency isolated drivers where the natural current-source-like behaviour above resonance is convenient.

**EV on-board chargers and DC–DC modules.** Often as the **CLLC**, a symmetric variant with resonant elements on both sides that supports bidirectional flow — the resonant counterpart to the [dual active bridge]({% post_url 2026-09-10-dab-converter-from-principles-to-control %}).

**Where not to use one.** An LLC is at its best with a **narrow input range** — which is exactly what a PFC stage provides. Asked to cover a wide input, it needs a large gain range, which forces low $$L_n$$, high circulating current and poor efficiency at the extremes. If your input varies two-to-one or more, a [phase-shifted full bridge]({% post_url 2026-09-11-push-pull-half-bridge-full-bridge %}#psfb) or a two-stage architecture will usually beat it. Nor is an LLC a good fit where the load steps violently, since the frequency-controlled loop is comparatively slow.

---

## The series, end to end

That completes the converter series. Nine topologies, all analysed with the same two tools introduced in the very first article — **inductor volt-second balance** and **capacitor charge balance** — plus, where it applies, perturbation and linearisation around an operating point.

| Topology | Isolated | Ratio | Key characteristic |
|---|---|---|---|
| [Buck]({% post_url 2026-09-11-buck-converter-from-zero-to-everything %}) | no | $$D$$ | step down, no RHP zero, easiest to control |
| [Boost]({% post_url 2026-09-10-boost-converter-from-zero-to-everything %}) | no | $$1/D'$$ | step up, RHP zero, continuous input current |
| [Buck–boost]({% post_url 2026-09-11-buck-boost-converter-from-zero-to-everything %}) | no | $$D/D'$$ | either direction, inverted, worst RHP zero |
| [Ćuk / SEPIC / Zeta]({% post_url 2026-09-11-cuk-sepic-zeta-converters %}) | no | $$D/D'$$ | capacitive transfer, continuous port currents |
| [Flyback]({% post_url 2026-09-11-flyback-converter-from-zero-to-everything %}) | yes | $$D/(nD')$$ | cheapest isolation, stores then dumps, < 75 W |
| [Forward]({% post_url 2026-09-11-forward-converter-from-zero-to-everything %}) | yes | $$D/n$$ | isolated buck, $$D\le0.5$$, 75–500 W |
| [Push–pull / bridges]({% post_url 2026-09-11-push-pull-half-bridge-full-bridge %}) | yes | $$2D/n$$ | bidirectional core use, high power |
| LLC | yes | $$M(f_s)/n$$ | frequency controlled, ZVS, highest efficiency |
| [Dual active bridge]({% post_url 2026-09-10-dab-converter-from-principles-to-control %}) | yes | phase shift | bidirectional power flow |

The habit that carries across all of them is the one stated at the start: write down the requirement, explain the energy flow, calculate, simulate, build, measure and revise.

## Further study

Robert W. Erickson and Dragan Maksimović, [*Fundamentals of Power Electronics*, third edition, Springer, 2020](https://link.springer.com/book/10.1007/978-3-030-43881-4), for resonant converter analysis and soft-switching fundamentals. The derivations and numerical example here are presented independently; this article is not a reproduction of the textbook.
