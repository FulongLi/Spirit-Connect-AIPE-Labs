---
layout: default
title: PCB Rogowski Coil Design Reference
permalink: /resources/design-references/rogowski-coil/
description: Principles, geometry, winding patterns and design considerations for a high-precision PCB Rogowski coil current transducer — plus a demo-ready prototype available to order.
math: true
---

<style>
  .rc-eq { overflow-x: auto; overflow-y: hidden; margin: 1.4rem 0; padding: .4rem 0; }
  .rc-table-wrap { overflow-x: auto; margin-top: 2.2rem; }
  .rc-table { width: 100%; border-collapse: collapse; font-size: .96rem; min-width: 540px; }
  .rc-table caption { text-align: left; color: var(--fg-dim); font-size: .9rem; margin-bottom: .8rem; }
  .rc-table th, .rc-table td { text-align: left; padding: .7rem .9rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  .rc-table thead th { border-bottom: 2px solid var(--border-hover); font-weight: 700; }
  .rc-table tbody th { font-weight: 600; white-space: nowrap; }
  .rc-figure { margin: 0; }
  .rc-figure img { width: 100%; border-radius: var(--radius-sm); background: var(--bg-white); }
  .rc-figure figcaption { color: var(--fg-dim); font-size: .9rem; margin-top: .7rem; line-height: 1.55; }
  .rc-note { color: var(--fg-dim); font-size: .92rem; margin-top: 1.6rem; }
</style>

<header class="hero hero-compact">
  <div class="container">
    <h1>PCB Rogowski Coil</h1>
    <p class="lead">A high-precision, air-cored current transducer printed directly on a PCB — wide bandwidth, no saturation, and repeatable geometry for validation, monitoring and control. This page covers how it works, why the coil shape matters, and how ours is built.</p>
    <p class="reference-note">{% include status.html key="hardware-tested" %} Designed, fabricated and bench-verified. Figures in the table below are design-envelope targets, not a guaranteed datasheet.</p>
    <div class="hero-actions">
      <a href="#order" class="btn btn-primary">Order a demo board</a>
      <a href="#principles" class="btn btn-ghost">How it works ↓</a>
    </div>
  </div>
</header>

<section class="section section-feature">
  <div class="container">
    <div class="feature-content">
      <div class="feature-text">
        <h2>A current sensor with no core to saturate</h2>
        <p class="lead">
          A Rogowski coil is a toroidal winding with an <strong>air core</strong> wrapped around the conductor
          it measures. With no magnetic material, it never saturates, stays linear from a few amps to many
          kiloamps, and adds almost no impedance to the circuit under test. Building it on a PCB makes every
          turn geometrically identical, so sensitivity is repeatable and stray-field rejection is far better
          than a hand-wound coil.
        </p>
        <p>
          Our reference board integrates the coil, an active integrator and output conditioning on a single
          PCB, giving a ready-to-probe current output for double-pulse tests, converter validation and
          switching-loss measurement.
        </p>
      </div>
      <div class="feature-visual">
        <div class="visual-placeholder">
          <img class="reference-visual" src="{{ '/accessories/transducers/images/RogT1_d.png' | relative_url }}" alt="PCB Rogowski coil transducer board, 3D render">
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="principles">
  <div class="container">
    <h2>1. Basic principle</h2>
    <p class="lead">The coil responds to the <em>rate of change</em> of current, and an integrator turns that back into a current reading.</p>
    <p>
      Ampère's law relates the magnetic field around a conductor to the current it carries. A Rogowski coil
      is a uniform winding of \(N\) turns forming a closed toroid around that conductor. The changing magnetic
      field links the turns, and by Faraday's law the coil produces an electromotive force proportional to how
      fast the current changes:
    </p>
    <div class="rc-eq">
      \[ e(t) = -\,M\,\frac{di(t)}{dt}, \qquad M = \frac{\mu_0\,N\,A}{\ell} = \frac{\mu_0\,N\,A}{2\pi r}. \]
    </div>
    <p>
      Here \(M\) is the mutual inductance between the coil and the conductor, \(A\) is the cross-sectional area
      of one turn, \(\ell = 2\pi r\) is the mean magnetic path length and \(\mu_0\) is the permeability of free
      space. Because the core is air, \(M\) depends only on geometry — that is the source of the coil's
      linearity and its immunity to saturation.
    </p>
    <p>
      The raw output is proportional to \(di/dt\), so to recover the current itself the signal is integrated.
      With an active (op-amp) integrator of input resistance \(R_i\) and feedback capacitance \(C_i\), the
      conditioned output becomes proportional to the current, and the transducer sensitivity is:
    </p>
    <div class="rc-eq">
      \[ v_{\text{out}}(t) = \frac{1}{R_i C_i}\int e(t)\,dt = \frac{M}{R_i C_i}\,i(t), \qquad S = \frac{M}{R_i C_i}\ \left[\frac{\text{V}}{\text{A}}\right]. \]
    </div>
    <p>
      At very high frequencies the coil can instead be operated in <strong>self-integrating</strong> mode: if it
      is terminated in a resistor \(R\) small compared with its own reactance (\(R \ll \omega L_c\)), the coil's
      inductance performs the integration and the voltage across \(R\) is already proportional to the current.
      Practical wideband probes combine both regimes.
    </p>
    <div class="grid">
      <div class="card">
        <h3>What it does well</h3>
        <p>No saturation, wide linear dynamic range, very wide bandwidth, negligible insertion impedance, inherent galvanic isolation, light and thin.</p>
      </div>
      <div class="card">
        <h3>What to watch</h3>
        <p>It cannot measure DC (it needs \(di/dt\)), the output must be integrated, and a poorly shaped coil is sensitive to conductor position and to nearby currents.</p>
      </div>
      <div class="card">
        <h3>Where it is used</h3>
        <p>Switching-current and \(di/dt\) capture in converters, double-pulse and short-circuit tests, protection and metering, and busbar current monitoring.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>2. Building the coil on a PCB</h2>
    <p class="lead">Two rows of vias and the copper traces between them form the toroidal turns; the layout is what makes the sensor accurate.</p>
    <p>
      Each turn is made from a radial trace on the top copper layer, a via down to the bottom layer, a return
      trace, and a via back up — repeated around the aperture. An inner ring of vias and an outer ring define
      the winding, and the number of via pairs sets the turn count \(N\). Because a photo-plotted PCB places
      every via and trace to a few micrometres, all turns enclose almost exactly the same area, so the sensor's
      sensitivity is consistent from board to board.
    </p>
    <p>
      A single loop of \(N\) turns going once around the toroid also forms one large loop <em>around the toroid
      axis</em>. That parasitic loop would pick up any changing field passing through the whole coil — including
      from nearby conductors. To cancel it, the winding is closed with a <strong>return turn</strong>: the signal
      is brought back through the centre of the toroid (a concentric return trace) so the net enclosed area of
      that outer loop is zero. Good return-path symmetry is the single most important factor in rejecting
      external fields and in making the reading independent of where the conductor sits inside the aperture.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Turn count &amp; area</h3>
        <p>Sensitivity scales with \(N\) and turn area \(A\). But more turns raise coil inductance and lower the self-resonant frequency, trading bandwidth for sensitivity.</p>
      </div>
      <div class="card">
        <h3>Turn uniformity</h3>
        <p>Equal angular spacing makes the response independent of conductor position and rejects currents outside the loop. Uneven turns create position error.</p>
      </div>
      <div class="card">
        <h3>Return symmetry</h3>
        <p>A concentric return trace, or a second counter-wound layer, cancels the net enclosing loop and suppresses response to uniform external and \(dv/dt\)-coupled fields.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>3. Coil geometry and winding patterns</h2>
    <p class="lead">The aperture shape and the way the turns are drawn set the trade-off between sensitivity, bandwidth, field rejection and mechanical fit.</p>

    <h3>Aperture shape</h3>
    <p>
      A <strong>circular</strong> aperture gives the most uniform field around the winding and the lowest
      sensitivity to where a round conductor sits inside it — the natural choice for cables and round busbars.
      A <strong>rounded-rectangular (racetrack)</strong> aperture fits flat busbars, module terminals and
      wide PCB tracks; the field is slightly less uniform near the corners, so turn spacing has to be managed
      carefully there, but it is far more practical for real power-module geometry.
    </p>

    <h3>Winding pattern</h3>
    <p>The trace pattern between the two via rings is where most of the design creativity lives:</p>
    <div class="rc-table-wrap">
      <table class="rc-table">
        <caption>Common PCB Rogowski winding patterns and their character.</caption>
        <thead>
          <tr><th>Pattern</th><th>How it is drawn</th><th>Strengths</th><th>Trade-offs</th></tr>
        </thead>
        <tbody>
          <tr>
            <th>Radial spoke</th>
            <td>Straight radial traces between an inner and outer via ring.</td>
            <td>Simple, highly uniform, easy to make repeatable; predictable sensitivity.</td>
            <td>Turn density limited by via pitch on the inner ring.</td>
          </tr>
          <tr>
            <th>Fishbone / herringbone</th>
            <td>Turns tilted like a fish skeleton, alternating angle around the loop.</td>
            <td>Packs more turns for a given radius, and the alternating tilt helps balance the return loop, improving external-field rejection.</td>
            <td>Slightly more complex geometry; angle must stay symmetric or it adds position error.</td>
          </tr>
          <tr>
            <th>Spiral / clover</th>
            <td>Each turn spirals slightly, or the aperture is lobed.</td>
            <td>Fits awkward mechanical openings and can raise coupling for a given footprint.</td>
            <td>Field uniformity harder to guarantee; needs careful modelling.</td>
          </tr>
          <tr>
            <th>Differential / counter-wound</th>
            <td>Two opposing windings (or two layers wound in opposite senses) read the same current.</td>
            <td>Strong rejection of external fields and \(dv/dt\)-coupled common-mode noise; excellent for noisy converters.</td>
            <td>Roughly twice the layout area and complexity for the same aperture.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>Representative variants</h3>
    <p>
      The boards below are variants of the same reference platform — the coil geometry on the left changes
      while the integrator and conditioning chain on the right stay common. They illustrate how aperture shape
      and turn density are traded against the target application.
    </p>
    <div class="grid">
      <figure class="rc-figure">
        <img src="{{ '/accessories/transducers/images/RogT1_t.png' | relative_url }}" alt="Circular-aperture PCB Rogowski coil, moderate turn density">
        <figcaption><strong>Type 1 — circular, moderate density.</strong> General-purpose round-conductor sensing with a balanced sensitivity/bandwidth point.</figcaption>
      </figure>
      <figure class="rc-figure">
        <img src="{{ '/accessories/transducers/images/RogT2_t.png' | relative_url }}" alt="Circular-aperture PCB Rogowski coil, high turn density">
        <figcaption><strong>Type 2 — circular, high density.</strong> More turns for higher sensitivity, at some cost to the upper bandwidth.</figcaption>
      </figure>
      <figure class="rc-figure">
        <img src="{{ '/accessories/transducers/images/RogT3_t.png' | relative_url }}" alt="Rounded-rectangular aperture PCB Rogowski coil">
        <figcaption><strong>Type 3 — racetrack aperture.</strong> Shaped to slip over flat busbars and module terminals.</figcaption>
      </figure>
      <figure class="rc-figure">
        <img src="{{ '/accessories/transducers/images/RogT4_t.png' | relative_url }}" alt="Larger rounded-rectangular aperture PCB Rogowski coil">
        <figcaption><strong>Type 4 — wide racetrack.</strong> Larger aperture and denser winding for higher-current busbars.</figcaption>
      </figure>
      <figure class="rc-figure">
        <img src="{{ '/accessories/transducers/images/RogT5_t.png' | relative_url }}" alt="Rounded-rectangular PCB Rogowski coil with concentric return trace">
        <figcaption><strong>Type 5 — optimised return.</strong> A concentric return path emphasises external-field and common-mode rejection.</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>4. How shape affects performance</h2>
    <p class="lead">Every geometric choice pulls on the same handful of specifications.</p>
    <div class="grid">
      <div class="card">
        <h3>Sensitivity</h3>
        <p>Rises with turn count \(N\), turn area \(A\) and smaller mean radius \(r\), since \(M \propto NA/r\). Denser windings and tighter apertures read more volts per amp.</p>
      </div>
      <div class="card">
        <h3>Bandwidth</h3>
        <p>The low end is set by the integrator; the high end by coil self-resonance \(f_r = 1/(2\pi\sqrt{L_c C_c})\). Fewer turns and shorter loops push resonance — and usable bandwidth — higher.</p>
      </div>
      <div class="card">
        <h3>External-field rejection</h3>
        <p>Uniform turns plus a symmetric return loop reject nearby currents and uniform fields. Fishbone and counter-wound patterns are chosen when the environment is electrically noisy.</p>
      </div>
      <div class="card">
        <h3>Position insensitivity</h3>
        <p>A uniform, symmetric winding gives nearly the same reading wherever the conductor sits in the aperture. Non-uniform turns or corner crowding in a racetrack add position error.</p>
      </div>
      <div class="card">
        <h3>\(dv/dt\) immunity</h3>
        <p>Fast switching couples capacitively into the coil. A guarded, differential or counter-wound layout cancels that common-mode injection so the current signal stays clean.</p>
      </div>
      <div class="card">
        <h3>Mechanical fit</h3>
        <p>Aperture shape and size are dictated by the conductor: round for cables, racetrack for busbars. The largest aperture that still couples enough flux is usually the right call.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>5. Design considerations</h2>
    <p class="lead">Turning the geometry into a usable instrument means designing the electronics and calibration around it.</p>
    <div class="grid">
      <div class="card">
        <h3>Integrator &amp; droop</h3>
        <p>An active integrator sets the low-frequency limit and DC-stabilising feedback prevents output drift. Its RC time constant trades low-frequency droop against noise gain.</p>
      </div>
      <div class="card">
        <h3>Termination &amp; resonance</h3>
        <p>Damping the coil controls the self-resonant peak and keeps the phase response flat across the band, avoiding ringing on fast edges.</p>
      </div>
      <div class="card">
        <h3>Noise &amp; shielding</h3>
        <p>Low-sensitivity coils need low-noise front ends. A grounded guard ring and careful reference routing keep capacitive pickup out of the signal.</p>
      </div>
      <div class="card">
        <h3>Calibration &amp; temperature</h3>
        <p>Because sensitivity is geometric, each variant is calibrated once against a reference, and the mild temperature coefficient of the integrator components is characterised.</p>
      </div>
    </div>

    <div class="rc-table-wrap">
      <table class="rc-table">
        <caption>Reference-design envelope — indicative targets, configurable per variant, not a guaranteed datasheet.</caption>
        <thead>
          <tr><th>Parameter</th><th>Typical reference value</th></tr>
        </thead>
        <tbody>
          <tr><th>Aperture</th><td>Circular ~20–40 mm, or racetrack for busbars (custom on request)</td></tr>
          <tr><th>Turns</th><td>~40–120, set by via pitch and pattern</td></tr>
          <tr><th>Sensitivity</th><td>Configurable via the integrator (e.g. a few mV/A after conditioning)</td></tr>
          <tr><th>Bandwidth</th><td>Sub-kHz low corner to tens of MHz, depending on integrator and damping</td></tr>
          <tr><th>Peak current</th><td>No saturation limit — from amps to kiloamps</td></tr>
          <tr><th>Output</th><td>Buffered voltage on SMA/coax, integrator on board</td></tr>
          <tr><th>Isolation</th><td>Inherent — no galvanic connection to the primary</td></tr>
        </tbody>
      </table>
    </div>
    <p class="rc-note">
      Values above describe the design envelope for orientation. Final specifications depend on the selected
      aperture, winding pattern and integrator, and are confirmed at calibration for each build.
    </p>
  </div>
</section>

<section class="section collaboration-section" id="order">
  <div class="container narrow-center">
    <h2>The prototype is built — and demo-ready</h2>
    <p class="lead">
      We have designed, fabricated and bench-verified the PCB Rogowski coil boards shown above, with the coil,
      active integrator and output conditioning integrated on a single PCB. A demo unit is ready to ship so you
      can evaluate it on your own switching waveforms.
    </p>
    <div class="hero-actions">
      <a href="{{ '/contact/' | relative_url }}" class="btn btn-primary">Order online / request a quote</a>
      <a href="{{ '/contact/' | relative_url }}" class="btn btn-ghost">Talk to us about a custom aperture</a>
    </div>
    <p class="reference-note"><strong>Demo units in stock · custom variants ~one month lead time.</strong></p>
  </div>
</section>
