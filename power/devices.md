---
layout: default
title: Power Semiconductor Devices
math: true
permalink: /power/devices/
description: How the switch is realised — power diodes, MOSFETs, IGBTs, SiC and GaN. Conduction physics, device capacitances, leakage, package parasitics and switching loss for power electronics design automation.
---

<header class="hero">
  <div class="container">
    <h1>Power Semiconductor Devices</h1>
    <p class="lead">How the switch is realised: conduction physics, capacitance, leakage and package parasitics — and why SiC and GaN changed the answer.</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>Realising the switch</h2>
    <p class="lead eq-lead">
      A converter schematic contains ideal switches. Silicon does not. The bridge between the two is the question
      Erickson and Maksimović put at the centre of <em>switch realization</em>: in which quadrants of the
      \(( v,\, i )\) plane must this switch operate? The topology answers that, and the answer narrows the device
      choice before any datasheet is opened.
    </p>

    <div class="db-figure-wide">
      {% include fig-device-quadrants.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>Single-quadrant (SPST)</h3>
        <p>Conducts one polarity of current, blocks one polarity of voltage. A bare transistor does it. The buck, boost and forward converters need nothing more — the passive switch is a diode.</p>
      </div>
      <div class="card">
        <h3>Current-bidirectional</h3>
        <p>Conducts either polarity, blocks one. A MOSFET gives this for free: the body diode is the antiparallel path. Every voltage-source inverter leg and every synchronous rectifier lives here.</p>
      </div>
      <div class="card">
        <h3>Voltage-bidirectional</h3>
        <p>Conducts one polarity, blocks either. Needs a series diode — which is why current-source inverters and thyristor rectifiers use devices that are poor at reverse blocking on their own.</p>
      </div>
    </div>
    <p class="small db-figure-note">
      A synchronous rectifier is worth naming separately: it is a current-bidirectional switch used <em>as</em> the passive switch,
      replacing a diode drop with \(I \cdot R_{DS(on)}\). That substitution only pays while the on-state resistance stays below
      the diode's forward voltage divided by the current — which is exactly the trade-off the rest of this page is about.
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Conduction: majority and minority carriers</h2>
    <p class="lead eq-lead">
      A power device blocks voltage across a lightly doped drift region. There are only two ways to make that
      region conduct, and everything else about a device family follows from which one it uses.
    </p>

    <h3>Unipolar — the drift region conducts ohmically</h3>
    <p>
      In a MOSFET, HEMT or Schottky diode only majority carriers move. The drift region behaves as a resistor,
      so the on-state is a straight line through the origin:
    </p>
    <div class="eq-block">\[ v_{DS} = I \cdot R_{DS(on)}(T_j), \qquad R_{DS(on)} \propto T_j^{\,\alpha},\ \ \alpha \approx 2.3\ \text{(Si)},\ \ 1.6\text{–}2.0\ \text{(SiC)} \]</div>
    <p>
      That positive temperature coefficient is a feature, not a defect: a device that heats up takes less current,
      so paralleled dice share without external ballasting. The price is that \(R_{DS(on)}\) rises steeply with
      the required blocking voltage — the subject of the unipolar limit below.
    </p>

    <h3>Bipolar — injected carriers modulate the conductivity</h3>
    <p>
      A PiN diode, BJT or IGBT floods its drift region with injected minority carriers. The region's resistivity
      collapses, and the on-state becomes a junction offset plus a small residual resistance:
    </p>
    <div class="eq-block">\[ v_{CE} = V_{CE0} + I \cdot r_{CE} \]</div>
    <p>
      This is almost independent of blocking voltage, which is why IGBTs still own 3.3 kV and above. The charge
      that buys the low on-state has to be removed before the device can block again:
    </p>
    <div class="eq-block">\[ Q_{stored} = I_F \,\tau, \qquad E_{tail} \approx V_{DC}\, Q_{stored} \]</div>
    <p class="eq-where">
      \(\tau\) is the minority-carrier lifetime. Short it (lifetime killing, irradiation) and switching gets faster
      while the on-state voltage rises. That single knob is the entire bipolar speed-versus-conduction trade-off.
    </p>

    <div class="db-figure-grid">
      {% include fig-device-onstate.html lang=page.lang %}
      {% include fig-device-recovery.html lang=page.lang %}
    </div>

    <h3>Recovered charge is paid for by the other transistor</h3>
    <p>
      When a diode is commutated off at a rate \(di/dt\), the stored charge appears as reverse current. The peak and
      the recovered charge are tied together by the commutation slope:
    </p>
    <div class="eq-block">\[ I_{RRM} = \sqrt{2\,Q_{rr}\left|\frac{di}{dt}\right|}, \qquad Q_{rr} \approx \tfrac{1}{2} I_{RRM}\, t_{rr}, \qquad E_{rr} \approx Q_{rr}\, V_{DC} \]</div>
    <p class="eq-where">
      \(E_{rr}\) is dissipated in the <em>opposing</em> transistor as extra turn-on loss, on top of its own overlap
      loss, and \(Q_{rr}\) itself grows with temperature and with \(di/dt\). A SiC Schottky diode has no stored
      charge: its reverse current is only displacement current into \(C_j\), essentially independent of temperature.
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Blocking: leakage, bandgap and thermal runaway</h2>
    <p class="lead eq-lead">
      The off state is not free either. Reverse leakage is set by the intrinsic carrier concentration, and that
      depends exponentially on the bandgap — the property that actually separates wide-bandgap material from silicon.
    </p>
    <div class="eq-block">\[ n_i \propto T^{3/2} e^{-E_g / 2kT}, \qquad I_{leak} \propto n_i^{2}\ \text{(diffusion)} \quad\text{or}\quad n_i\ \text{(generation)} \]</div>
    <p>
      Silicon's \(E_g\) is 1.12 eV; 4H-SiC is 3.26 eV and GaN 3.4 eV. At room temperature that is more than ten orders
      of magnitude in \(n_i\). Blocking loss \(P_{off} = V_{DC} I_{leak}\) is usually negligible — until it is not,
      because leakage rises faster with temperature than the package can remove heat:
    </p>
    <div class="eq-block">\[ \frac{\partial P_{off}}{\partial T_j}\, R_{th(j-a)} \;>\; 1 \quad\Longrightarrow\quad \text{thermal runaway} \]</div>

    <div class="db-figure-grid">
      {% include fig-device-leakage.html lang=page.lang %}
      {% include fig-device-unipolar-limit.html lang=page.lang %}
    </div>

    <h3>Why the drift region sets the price</h3>
    <p>
      For a one-dimensional non-punch-through drift region held off at breakdown, the specific on-resistance has a
      closed form — Baliga's unipolar limit:
    </p>
    <div class="eq-block">\[ R_{on,sp} = \frac{4\,V_{BR}^{2}}{\varepsilon_s\, \mu_n\, E_c^{3}} \qquad\Longrightarrow\qquad \mathrm{BFOM} = \varepsilon_s\, \mu_n\, E_c^{3} \]</div>
    <p class="eq-where">
      \(\varepsilon_s\) is the permittivity, \(\mu_n\) the electron mobility and \(E_c\) the critical field for
      avalanche. \(E_c\) enters cubed, so a material with eight times the critical field buys roughly five hundred
      times the figure of merit — the same blocking voltage held off by a drift region an order of magnitude thinner
      and far more heavily doped. Empirically the limit tracks \(R_{on,sp} \propto V_{BR}^{2.4\text{–}2.5}\).
    </p>

    <div class="data-table-wrap">
      <table class="data-table">
        <caption>Representative room-temperature material properties. Exact values vary with orientation, doping and source — treat them as order-of-magnitude comparisons.</caption>
        <thead>
          <tr><th>Property</th><th>Si</th><th>4H-SiC</th><th>GaN</th></tr>
        </thead>
        <tbody>
          <tr><td>Bandgap E<sub>g</sub> (eV)</td><td>1.12</td><td>3.26</td><td>3.40</td></tr>
          <tr><td>Critical field E<sub>c</sub> (MV/cm)</td><td>≈0.3</td><td>≈2.5</td><td>≈3.3</td></tr>
          <tr><td>Electron mobility µ<sub>n</sub> (cm²/V·s)</td><td>1400</td><td>≈950</td><td>≈1500 (2DEG ≫)</td></tr>
          <tr><td>Saturation velocity v<sub>sat</sub> (10<sup>7</sup> cm/s)</td><td>1.0</td><td>2.0</td><td>2.5</td></tr>
          <tr><td>Thermal conductivity (W/cm·K)</td><td>1.5</td><td>3.7–4.9</td><td>1.3 (GaN-on-Si lower)</td></tr>
          <tr><td>Commercial structure</td><td>vertical, superjunction</td><td>vertical (DMOS / trench)</td><td>lateral HEMT</td></tr>
          <tr><td>Reverse conduction</td><td>body diode (slow, Q<sub>rr</sub>)</td><td>body diode (fast, low Q<sub>rr</sub>)</td><td>2DEG, no junction — high V<sub>SD</sub></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Inside a modern device</h2>
    <p class="lead eq-lead">
      Structure is not decoration. Where the terminals sit relative to the depletion region decides how large each
      parasitic capacitance is, how nonlinear it is, and whether the device has a body diode at all.
    </p>

    <div class="db-figure-wide">
      {% include fig-device-crosssection.html lang=page.lang %}
    </div>

    <h3>Capacitances are depletion capacitances</h3>
    <p>
      Every inter-terminal capacitance in a power device is a junction capacitance, so it varies strongly with the
      voltage across it:
    </p>
    <div class="eq-block">\[ C_j(v) = \frac{C_{j0}}{\left(1 + v/V_{bi}\right)^{m}}, \qquad m = \tfrac{1}{2}\ \text{(abrupt)},\ \ \tfrac{1}{3}\ \text{(graded)} \]</div>
    <p>Datasheets publish terminal combinations rather than the physical elements:</p>
    <div class="eq-block">\[ C_{iss} = C_{gs} + C_{gd}, \qquad C_{oss} = C_{ds} + C_{gd}, \qquad C_{rss} = C_{gd} \]</div>
    <p>
      Because \(C_{oss}\) is voltage-dependent, the charge stored in it and the energy stored in it are different
      integrals, and neither equals \(\tfrac{1}{2}C_{oss}V^2\) at a single quoted capacitance:
    </p>
    <div class="eq-block">\[ Q_{oss} = \int_0^{V_{DC}} C_{oss}(v)\,dv, \qquad E_{oss} = \int_0^{V_{DC}} v\, C_{oss}(v)\,dv \]</div>
    <p class="eq-where">
      This is why vendors publish two "equivalent" capacitances — a charge-equivalent \(C_{o(er)}\) and an
      energy-equivalent \(C_{o(tr)}\) — and why substituting one for the other quietly corrupts a ZVS dead-time
      calculation. Store the curve, integrate what you actually need.
    </p>

    <h3>Gate charge and the Miller plateau</h3>
    <p>
      Driving the gate costs real power, and during the voltage transition the entire gate current goes into
      \(C_{gd}\) — which is what sets \(dv/dt\):
    </p>
    <div class="eq-block">\[ P_{drive} = Q_g V_{GS}\, f_{sw}, \qquad \frac{dv_{DS}}{dt} = \frac{I_G}{C_{gd}(v)} = \frac{V_{drive} - V_{pl}}{R_g\, C_{gd}(v)} \]</div>

    <div class="grid">
      <div class="card">
        <h3>Threshold and its drift</h3>
        <p>SiC MOSFETs show \(V_{th}\) hysteresis and bias-temperature instability from interface traps at the SiC/SiO₂ boundary. A threshold measured after a positive gate sweep is not the one the device shows in circuit — which is why the measurement condition has to be recorded with the number.</p>
      </div>
      <div class="card">
        <h3>Reverse conduction</h3>
        <p>A SiC body diode conducts at 3–4 V and carries little stored charge. A GaN HEMT has no body diode at all: reverse current flows in the 2DEG once \(V_{SD}\) exceeds roughly \(V_{th} + I R\), so dead-time loss dominates and dead time must be minimised, not padded.</p>
      </div>
      <div class="card">
        <h3>Dynamic on-resistance</h3>
        <p>GaN devices show \(R_{DS(on)}\) that depends on recent blocking-voltage history — charge trapping in the buffer that releases slowly. Static curve-tracer data will not reveal it; only switching-condition measurement will.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Package, parasitics and switching loss</h2>
    <p class="lead eq-lead">
      By the time a die is in a package and the package is on a board, the switching waveform belongs as much to the
      layout as to the silicon. Faster devices did not remove this problem; they made it the dominant one.
    </p>

    <div class="db-figure-wide">
      {% include fig-device-loop.html lang=page.lang %}
    </div>

    <p>
      For a clamped inductive load — the standard hard-switching case, and what a double-pulse test reproduces — the
      switching energies are the overlap integrals of the transition, and the loss is what the heatsink has to remove:
    </p>
    <div class="eq-block">\[ E_{on} = \int_{t_{on}} v_{DS}\, i_D\, dt, \qquad E_{off} = \int_{t_{off}} v_{DS}\, i_D\, dt, \qquad P_{sw} = \left(E_{on} + E_{off} + E_{rr}\right) f_{sw} \]</div>
    <p>The parasitics then set what those integrals actually look like:</p>
    <div class="eq-block">\[ \Delta V = L_{\sigma}\frac{di}{dt}, \qquad f_{ring} = \frac{1}{2\pi\sqrt{L_{\sigma} C_{oss}}}, \qquad v_{gs,\text{eff}} = v_{drive} - L_{s}\frac{di_D}{dt} \]</div>
    <p class="eq-where">
      The first term is why a 1200 V device gets specified for a 600 V bus. The second is the ringing frequency your
      EMI filter has to live with. The third is common-source feedback: \(L_s\) sits in the power loop and the gate
      loop simultaneously, so drain current slows its own turn-on — the reason a Kelvin source pin exists.
    </p>

    <div class="grid">
      <div class="card">
        <h3>Cross-talk through C<sub>gd</sub></h3>
        <p>A fast \(dv/dt\) on the off device capacitively divides across \(C_{gd}\) and \(C_{gs}\). Parasitic turn-on follows whenever</p>
        <div class="eq-block">\[ \frac{C_{gd}}{C_{gd}+C_{gs}}\,V_{DC} > V_{th} \]</div>
        <p>Negative gate bias, a low-impedance off-state path, or an active Miller clamp are the three usual answers.</p>
      </div>
      <div class="card">
        <h3>The thermal path</h3>
        <p>Junction-to-case resistance is only the first term. Solder, substrate, baseplate and interface material each add a stage, and each has its own time constant — which is why a single \(R_{th}\) cannot predict junction temperature under a real mission profile and a Foster or Cauer ladder can.</p>
      </div>
      <div class="card">
        <h3>Insulation and creepage</h3>
        <p>Package geometry also fixes clearance, creepage and partial-discharge inception. For SiC at 1200 V and above these frequently constrain the layout before the electrical parasitics do.</p>
      </div>
    </div>

    <p class="small db-figure-note">
      Further reading — R. W. Erickson and D. Maksimović, <em>Fundamentals of Power Electronics</em>, ch. 4
      (switch realization) and B. J. Baliga, <em>Fundamentals of Power Semiconductor Devices</em>. On this site:
      <a href="{% post_url 2026-09-10-static-electrical-characterisation %}">static characterisation</a> ·
      <a href="{% post_url 2026-09-10-gate-charge-capacitance-dynamic-resistance %}">gate charge, capacitance &amp; dynamic resistance</a> ·
      <a href="{% post_url 2026-09-10-double-pulse-testing %}">double-pulse testing</a> ·
      <a href="{% post_url 2026-09-10-transient-thermal-impedance %}">transient thermal impedance</a> ·
      <a href="{% post_url 2026-09-10-power-semiconductor-characterisation-guide %}">characterisation guide</a>.
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Measurement partner — Panxin Technology</h2>
    <p class="lead eq-lead">
      None of the numbers above can be taken on trust. Everything on this page is only useful once it has been
      measured on the actual part, under stated conditions, on equipment built for the job.
    </p>
    <div class="partner-band">
      <div class="partner-band-mark">
        <img src="{{ '/images/general/PX_logo.png' | relative_url }}" alt="Panxin Technology" loading="lazy" decoding="async">
      </div>
      <div class="partner-band-body">
        <p>
          <strong>Panxin Technology</strong> is our characterisation partner for power semiconductors. Their electrical
          and thermal test platforms produce the static curves, double-pulse waveforms, capacitance and gate-charge data,
          and transient thermal impedance measurements that sit behind our device models and the transistor database.
        </p>
        <p>
          Splitting the work this way keeps the boundary honest: they measure, we model, and every parameter we publish
          can be traced back to a test with its conditions attached.
        </p>
        <div class="hero-actions section-actions">
          <a class="btn btn-primary" href="{{ '/power/devices/characterisation/' | relative_url }}">Characterisation &amp; modelling</a>
          <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Request a measurement</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-feature devices-page-strip devices-page-strip--a">
  <div class="container">
    <div class="feature-content">
      <div class="feature-text">
        <h2>Transistor Database</h2>
        <p class="lead">
          Everything on this page, stored per part as curves rather than headline numbers — SiC, GaN and IGBT
          specifications, switching waveforms, capacitance curves and thermal networks, built for automated device
          selection and mission-profile-aware design.
        </p>
        <div class="feature-actions">
          <a href="{{ '/resources/databases/transistors/' | relative_url }}" class="btn btn-primary">View database</a>
          <a href="{{ '/contact/' | relative_url }}" class="btn btn-ghost">Contact us</a>
        </div>
      </div>
      <div class="feature-visual">
        <img class="devices-page-case-img" src="{{ '/power/converters/testing/Database/database.jpg' | relative_url }}" alt="Transistor database">
      </div>
    </div>
  </div>
</section>
