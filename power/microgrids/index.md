---
layout: default
title: Microgrids
permalink: /power/microgrids/
description: Integrating wind, solar PV, fuel cells and energy storage within DC, AC and hybrid AC/DC microgrids — from power interfaces to control, protection and energy management.
---

<header class="hero">
  <div class="container">
    <h1>Microgrids</h1>
    <p class="lead">Integrating renewable generation and storage while designing, modelling, and controlling resilient DC and AC microgrids.</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>Microgrid Solutions</h2>
    <p class="lead">
      A microgrid is a bounded set of sources, storage and loads that can operate connected to the utility or on its
      own. That single capability — islanding — is what makes the architecture choice consequential: everything about
      control, protection and power quality follows from which bus the energy actually sits on.
    </p>
    <div class="grid">
      <div class="card">
        <h3>DC Microgrids</h3>
        <p>Efficient DC power distribution systems with advanced control strategies for optimal energy management and reliability.</p>
      </div>
      <div class="card">
        <h3>AC Microgrids</h3>
        <p>Grid-connected and islanded AC microgrid architectures with seamless transition capabilities and power quality management.</p>
      </div>
      <div class="card">
        <h3>Hybrid AC/DC Architectures</h3>
        <p>Integrated systems combining the benefits of both AC and DC distribution for maximum efficiency and flexibility.</p>
      </div>
    </div>
  </div>
</section>

{% include microgrid-energy-sources.html lang=page.lang %}

<section class="section">
  <div class="container">
    <h2>Three architectures, three different problems</h2>
    <p class="lead section-lead-spaced">
      The bus is the architecture. Choosing DC, AC or both decides how many conversion stages sit between a panel and
      a load, what quantity carries power-balance information, and what you have to do to clear a fault.
    </p>

    <div class="db-figure-grid">
      {% include fig-microgrid-dc.html lang=page.lang %}
      {% include fig-microgrid-ac.html lang=page.lang %}
    </div>

    <div class="db-figure-wide">
      {% include fig-microgrid-hybrid.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>What DC gets right</h3>
        <p>PV, batteries, fuel cells, LED lighting, variable-speed drives and EV charging are all natively DC. Putting them on a DC bus removes a conversion stage each way, and with it the losses and the hardware.</p>
        <p>There is no frequency, no phase angle, no reactive power and no synchronisation. Power sharing needs one variable — bus voltage.</p>
      </div>
      <div class="card">
        <h3>What DC makes hard</h3>
        <p>DC fault current has no natural zero crossing, so interruption needs solid-state or hybrid breakers and deliberate fault-current limiting, with selectivity designed rather than inherited.</p>
        <p>Tightly regulated converters look like constant-power loads. Their negative incremental impedance destabilises the bus unless source impedance and bus capacitance are designed against it.</p>
      </div>
      <div class="card">
        <h3>Where AC still wins</h3>
        <p>Protection practice, switchgear, transformers, metering and motor loads all already exist and are certified. Voltage transformation is a passive component.</p>
        <p>The cost is control: frequency and voltage both carry power balance, at least one converter has to be grid-forming, and islanding and reconnection have to happen without a phase step.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Control and operation</h2>
    <p class="lead section-lead-spaced">
      A microgrid has no infinite bus to lean on. In island mode the converters themselves have to set voltage and
      frequency, share load without fighting each other, and hand back to the utility cleanly when it returns.
    </p>

    <div class="db-figure-grid">
      {% include fig-microgrid-droop.html lang=page.lang %}
      {% include fig-microgrid-control.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>Grid-forming vs grid-following</h3>
        <p>A grid-following converter needs an existing voltage to lock a PLL onto — perfect when the utility is present, useless the instant it is not. A grid-forming converter behaves as a voltage source behind an impedance and establishes the reference itself. An islandable microgrid needs at least one, and usually needs them to share.</p>
      </div>
      <div class="card">
        <h3>Islanding and resynchronisation</h3>
        <p>Detecting the island, transferring without a load interruption, then matching voltage, phase and frequency before reclosing. Passive detection has a non-detection zone; active methods inject a small perturbation. The transfer is where most commissioning problems appear.</p>
      </div>
      <div class="card">
        <h3>Inertia that is not there</h3>
        <p>A converter-dominated microgrid has almost no rotating inertia, so the rate of change of frequency after a disturbance is high. Virtual synchronous machine and synthetic inertia schemes emulate it, trading storage headroom and bandwidth for a slower, more forgiving frequency response.</p>
      </div>
      <div class="card">
        <h3>Protection with limited fault current</h3>
        <p>Converters cannot supply the multiples of rated current that overcurrent protection assumes. Islanded settings differ from grid-connected ones, and coordination often needs directional, differential or communication-assisted schemes rather than time grading.</p>
      </div>
      <div class="card">
        <h3>Power quality and harmonics</h3>
        <p>Switching converters supply the harmonics, and weak islanded networks have high grid impedance, so distortion and resonance interact. Filter design and converter output impedance shaping stop being independent problems.</p>
      </div>
      <div class="card">
        <h3>Energy management</h3>
        <p>Above the fast loops, the dispatch problem: forecast, state of charge, degradation cost, tariffs, and the exchange schedule with the utility. This layer decides economics; the layers below decide whether the system stays up.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>The solid-state transformer — a power router</h2>
    <p class="lead section-lead-spaced">
      An SST is the clearest answer to the hybrid question. Instead of a line-frequency transformer plus separate
      converters bolted around it, one multistage device provides the medium-voltage connection, the isolation and
      every port the microgrid needs — with controllable power flow between them.
    </p>

    <div class="db-figure-wide">
      {% include fig-microgrid-sst.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>What it replaces</h3>
        <p>The line-frequency transformer. Isolation moves to a high-frequency transformer inside the isolated DC–DC stage, which is why the magnetics shrink by an order of magnitude in volume.</p>
      </div>
      <div class="card">
        <h3>What it adds</h3>
        <p>Bidirectional power flow, voltage regulation independent of turns ratio, a native DC port at the internal link, reactive support and harmonic control at the MV side, and ride-through behaviour that a passive transformer cannot offer.</p>
      </div>
      <div class="card">
        <h3>What it costs</h3>
        <p>Series-connected medium-voltage cells, isolation coordination, cell-voltage balancing, distributed control, and efficiency that must beat a 99 %-efficient passive component to justify itself.</p>
      </div>
    </div>

    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{% post_url 2026-09-10-three-stage-solid-state-transformer %}">SST architecture guide</a>
      <a class="btn btn-ghost" href="{{ '/resources/prototypes/sst/' | relative_url }}">SST design reference</a>
      <a class="btn btn-ghost" href="{{ '/power/converters/' | relative_url }}">Converter topologies</a>
    </div>

    <p class="small db-figure-note">
      The full series works through it stage by stage:
      <a href="{% post_url 2026-06-08-introducing-the-basics-of-solid-state-transformer %}">applications and motivation</a> ·
      <a href="{% post_url 2026-09-10-three-stage-solid-state-transformer %}">architecture</a> ·
      <a href="{% post_url 2026-09-10-sst-ac-dc-front-end %}">AC–DC front end</a> ·
      <a href="{% post_url 2026-09-10-dab-converter-from-principles-to-control %}">DAB isolation stage</a> ·
      <a href="{% post_url 2026-09-10-sst-dc-ac-output-stage %}">DC–AC output stage</a> ·
      <a href="{% post_url 2026-09-10-modular-sst-system-integration %}">modular integration and testing</a>.
    </p>
  </div>
</section>
