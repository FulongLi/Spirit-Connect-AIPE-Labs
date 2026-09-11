---
layout: post
title: "Forward Converter: From Zero to Everything"
description: "An isolated buck — true transformer action, core reset, the duty limit, and the two-switch and active-clamp variants that fix its weaknesses."
date: 2025-12-14
author: "Dr. Fulong Li"
math: true
converter_series: true
zh_url: /zh/resources/blog/
---

The [flyback]({% post_url 2026-09-11-flyback-converter-from-zero-to-everything %}) stores energy in its core and dumps it into the output. That works beautifully at low power and becomes punishing above roughly 100 W, because every joule delivered has to be stored first.

The **forward converter** takes the opposite approach: it uses a genuine transformer that passes power to the secondary *at the same instant* the switch conducts. Nothing is stored in the core on purpose. The result is a converter that behaves, in every way that matters, like an **isolated buck**.

This article follows the same **48 V to 12 V, 30 W** specification at 100 kHz used for the other isolated topologies in this series.

> **First draft — design example, not a validated reference board.** The values are analytical starting points; the LTspice netlist is a teaching resource. Native simulator execution and hardware measurements are not included.

**Reading route:** [principles](#principles) → [the reset problem](#reset) → [design](#design) → [variants](#variants) → [control](#control) → [simulation](#simulation) → [applications](#applications).

## 1. An isolated buck {#principles}

```text
           Np : Ns        Dfwd      Lo
  Vin + --o---3||E---o-----|>|----coil----o---- Vout +
          |   3||E   |      |             |
         ===  3||E   |     Dfw          Cout || R
          |    ||    |      |             |
          Q  (reset) |      |             |
          |          |      |             |
  Vin - --o----------o------o-------------o---- isolated ground
```

The dots are on the **same** side this time — the opposite of a flyback. That one change transforms the behaviour:

- **Switch on:** the primary sees $$V_g$$, and the secondary immediately produces $$V_g/n$$ where $$n=N_p/N_s$$. The forward diode `Dfwd` conducts and delivers power **straight through** to the output inductor. Power flows while the switch is on.
- **Switch off:** the secondary voltage collapses, `Dfwd` blocks, and the output inductor current freewheels through `Dfw`, exactly as in a buck.

Look at the node between the two diodes. It sees $$V_g/n$$ while the switch is on and approximately zero while it is off — a clean rectangular waveform, precisely what a buck's switching node produces. Everything downstream *is* a buck.

Applying volt-second balance to the output inductor:

$$
\boxed{V=\frac{V_g}{n}D}.
\tag{1}
$$

Compare this with the buck's $$V=DV_g$$. The transformer contributes a fixed ratio $$1/n$$; the duty cycle does the regulating. And because the output inductor conducts continuously into the load, the forward converter inherits the buck's best property: **continuous output current and very low output ripple**.

There is one important structural difference from the flyback. The transformer here is a true transformer — primary and secondary currents flow **simultaneously**. The core is not an energy store, so it needs **no air gap**, and it can be much smaller for the same throughput power.

## 2. The reset problem, and where the duty limit comes from {#reset}

A real transformer still has a **magnetising inductance** $$L_m$$ in parallel with the ideal one. While the switch is on, $$V_g$$ is applied across it and the magnetising current ramps up:

$$
\frac{di_m}{dt}=\frac{V_g}{L_m}.
\tag{2}
$$

This current does no useful work — it just magnetises the core. And here is the problem: **the core must be demagnetised before the next cycle**, or the flux staircases upward, cycle after cycle, until the core saturates and the switch fails. Volt-second balance on the magnetising inductance is not optional; it is a survival requirement.

The classical solution adds a third **reset winding** with $$N_r$$ turns, arranged so that during the off interval the magnetising current flows out through a diode back into the input. The core sees $$-V_gN_p/N_r$$ during reset, so volt-second balance demands

$$
DV_g=(1-D)V_g\frac{N_p}{N_r}
\qquad\Longrightarrow\qquad
D_{\max}=\frac{1}{1+N_p/N_r}.
\tag{3}
$$

With the usual 1:1 reset winding ($$N_r=N_p$$), this gives the famous constraint:

$$
\boxed{D\le0.5}.
\tag{4}
$$

**This is the forward converter's defining limitation.** You cannot exceed 50 % duty, which caps the usable input range and forces a smaller $$n$$ than you might want. And the cost is paid twice, because during reset the switch must block the input *plus* the reflected reset voltage:

$$
V_{\mathrm{DS,off}}=V_g\left(1+\frac{N_p}{N_r}\right)=2V_g
\quad\text{for a 1:1 reset winding.}
\tag{5}
$$

At our 72 V maximum input that is **144 V**, requiring a 200 V device to switch a 48 V rail. Both of these penalties — the duty ceiling and the doubled voltage stress — are what the [variants in section 4](#variants) exist to solve.

## 3. Sizing the example {#design}

| Quantity | Value |
|---|---|
| Input voltage | 48 V nominal; 36–72 V range |
| Output | 12 V, 2.5 A, 30 W (4.8 Ω) |
| Switching frequency | 100 kHz |
| Turns ratio $$n=N_p/N_s$$ | 4:3 (1.333) |
| Output inductor | 150 µH |
| Output capacitance | 100 µF |

The turns ratio must be chosen so that duty stays under 0.5 at the **lowest** input:

| Input | Duty | $$V_{\mathrm{DS}}$$ (1-switch, 1:1 reset) | $$V_{\mathrm{DS}}$$ (two-switch) |
|---|---|---|---|
| 36 V | 0.444 | 72 V | 36 V |
| 48 V | 0.333 | 96 V | 48 V |
| 72 V | 0.222 | 144 V | 72 V |

At 36 V the duty reaches 0.444 — inside the 0.5 limit with a little margin, which is exactly how $$n$$ was chosen. Push the input range lower and you would have to reduce $$n$$, which raises the secondary voltage and the diode stress.

The secondary square wave is $$V_g/n=36\ \mathrm{V}$$. From there the output stage is sized as a plain buck:

$$
\Delta i_L=\frac{V(1-D)}{L_of_s}
=\frac{12\times0.6667}{150\ \mu\mathrm{H}\times100\ \mathrm{kHz}}=0.533\ \mathrm{A},
\tag{6}
$$

with $$I_L=I_o=2.5\ \mathrm{A}$$ and a 2.77 A peak. The output capacitor sees only the triangular ripple, giving the buck-like $$/8$$ result:

$$
\Delta v_o\approx\frac{\Delta i_L}{8C f_s}=6.7\ \mathrm{mV},
\qquad
I_{C,\mathrm{rms}}\approx\frac{\Delta i_L}{\sqrt{12}}=154\ \mathrm{mA}.
\tag{7}
$$

**Compare that with the flyback's 17.7 mV on 470 µF and 1.77 A of capacitor RMS current.** The forward converter achieves lower ripple with less than a quarter of the capacitance and roughly a tenth of the ripple current — because its output current never stops. This, more than anything else, is why the forward topology takes over as power rises.

## 4. Fixing the weaknesses: two-switch and active clamp {#variants}

### Two-switch forward

Put a switch in **both** primary legs, driven together, and add two clamp diodes to the opposite rails.

```text
  Vin + --o---Q1---o---3||E---o---Q2---o--- Vin -
          |        |   3||E   |        |
          |       Dc1  3||E  Dc2       |
          +--------+           +-------+
```

When both switches turn off, the magnetising current flows through the two clamp diodes back into the input. This has three simultaneous benefits:

- Each switch blocks **only $$V_g$$**, not $$2V_g$$ — a 100 V device now suffices for our 72 V maximum instead of a 200 V one.
- The magnetising energy is **returned to the input** rather than dissipated.
- **No reset winding** is needed, simplifying the transformer.

The duty limit remains $$D\le0.5$$, because the reset voltage is still $$V_g$$. The cost is a second switch and a high-side gate drive. This is the workhorse configuration for roughly 100 W to 500 W, and it is what the supplied netlist implements.

### Active-clamp forward

Replace the reset mechanism with a small MOSFET and a clamp capacitor. The clamp voltage becomes

$$
V_{\mathrm{clamp}}=\frac{V_g}{1-D},
\tag{8}
$$

which is 72 V at our nominal operating point. Two things improve dramatically:

- **The $$D\le0.5$$ limit disappears.** Duty can exceed 0.5, allowing a larger $$n$$, lower primary currents and a wider input range.
- **Zero-voltage switching** becomes available, because the magnetising and leakage energy is used to discharge the switch capacitance before turn-on. Switching loss drops sharply, enabling higher frequencies and smaller magnetics.

The trade-off is complexity: complementary gate drive with carefully chosen dead time, and a clamp voltage that rises with duty, so the device rating must cover the worst case.

| Variant | Switch stress | Duty limit | Reset energy | Typical use |
|---|---|---|---|---|
| Single-switch, reset winding | $$2V_g$$ | 0.5 | returned to input | low cost, < 150 W |
| Two-switch | $$V_g$$ | 0.5 | returned to input | 100–500 W workhorse |
| Active clamp | $$V_g/(1-D)$$ | none | recycled, enables ZVS | high efficiency, high density |

## 5. Control: the easiest plant in this series {#control}

Because the output stage is a buck, the small-signal model is a buck's — with the input scaled by the turns ratio:

$$
\boxed{G_{vd}(s)=\frac{V_g/n}{L_oCs^2+(L_o/R)s+1}}.
\tag{9}
$$

For this example $$G_{d0}=V_g/n=36\ \mathrm{V}$$ per unit duty, and

$$
f_0=\frac{1}{2\pi\sqrt{L_oC}}=1299.5\ \mathrm{Hz},
\qquad Q=R\sqrt{\frac{C}{L_o}}=3.92.
\tag{10}
$$

Those are **exactly the numbers from the [buck article]({% post_url 2026-09-11-buck-converter-from-zero-to-everything %})** — same $$L$$, same $$C$$, same $$R$$, so the same resonance and damping. Only the DC gain differs, scaled from 24 to 36 by the turns ratio. That is not a coincidence; it is the whole point of the topology.

**There is no right-half-plane zero.** Raising duty raises the output immediately, with no inverse response, because the output inductor feeds the load in both intervals. Of all the isolated converters here, the forward is the easiest to compensate, and a Type III compensator can place the crossover above resonance to reach a genuinely fast loop — typically $$f_s/10$$, or about 10 kHz.

The practical caveats are the same as for any isolated converter: the feedback must cross the isolation barrier through an optocoupler and reference, adding a pole and CTR tolerance, and the plant DC gain $$V_g/n$$ moves proportionally with input voltage, so evaluate margins at high line where the gain is largest.

## 6. Simulate it {#simulation}

Open [forward_2sw_open_loop.cir]({{ '/assets/downloads/forward-converter/forward_2sw_open_loop.cir' | relative_url }}) and plot `V(out)`, `V(n1)`, `I(Lo)` and `I(Lpri)`.

1. **`V(n1)` is a clean rectangle** switching between about 36 V and 0. That is the isolated buck's switching node — compare it directly with the buck article's `V(sw)`.
2. **`I(Lo)` is a triangle centred on 2.5 A** with about 0.53 A of ripple, never touching zero.
3. **`V(a)` never exceeds the input rail**, because the clamp diodes hold it there. This is the two-switch topology's headline benefit, visible in one trace.
4. **`I(Lpri)` contains a small ramp** riding on the reflected load current — that ramp is the magnetising current, and it returns to zero each cycle.

Then run the experiment that matters most: **set `DUTY` to 0.55 and re-run.** The magnetising current no longer resets. Watch it staircase upward cycle after cycle — that is a core walking into saturation, and it is the failure mode equation (4) exists to prevent. Seeing it happen in simulation is far more memorable than reading the inequality.

## 7. Where forward converters are used {#applications}

**Mid-power isolated supplies, roughly 75 W to 500 W.** Industrial and instrumentation power supplies, telecom rails, server and embedded-system supplies — the band where a flyback's stored-energy penalty bites but a full bridge is overkill.

**Telecom 48 V distributed power.** The two-switch forward is a classic choice for converting a −48 V telecom bus to intermediate rails, exactly the specification worked here.

**Applications needing low output ripple.** Because the output current is continuous, the forward converter produces far cleaner rails than a flyback for the same capacitance — valuable for analogue, RF and sensor supplies.

**Where not to use one.** Below about 75 W the extra magnetics, the output inductor and the reset arrangement cost more than a flyback is worth. Above roughly 500 W the transformer core is only used in **one direction of the B–H curve** — a single-ended topology magnetises and then resets, never swinging negative — so it is only half utilised. Beyond that power level it pays to excite the core in both directions, which is exactly what [push–pull, half-bridge and full-bridge]({% post_url 2026-09-11-push-pull-half-bridge-full-bridge %}) converters do. That is the next chapter.

## Further study

Robert W. Erickson and Dragan Maksimović, [*Fundamentals of Power Electronics*, third edition, Springer, 2020](https://link.springer.com/book/10.1007/978-3-030-43881-4), for transformer-isolated converter analysis and core reset. The derivations and numerical example here are presented independently; this article is not a reproduction of the textbook.
