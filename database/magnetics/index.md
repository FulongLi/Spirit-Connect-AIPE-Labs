---
layout: default
title: Magnetic Database
permalink: /database/magnetics/
description: Magnetics database — core geometries, ferrite and powder core materials, measured loss surfaces, permeability under DC bias, and winding conductor data for transformer and inductor design automation.
---

<header class="hero">
  <div class="container">
    <h1>Magnetic Database</h1>
    <p class="lead">Core materials, Steinmetz parameters, winding windows, and thermal data — for automated magnetics sizing.</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>Magnetic Component Library</h2>
    <p class="lead">
      Access comprehensive data on core materials, winding configurations, and thermal characteristics
      to enable automated transformer and inductor design.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Core Materials</h3>
        <p>Ferrite, powder core, and nanocrystalline materials with B-H curves, Steinmetz parameters, and frequency-dependent loss models.</p>
      </div>
      <div class="card">
        <h3>Winding Optimisation</h3>
        <p>Winding window analysis, copper loss calculations, and thermal derating for optimal power density and efficiency.</p>
      </div>
      <div class="card">
        <h3>Thermal Data</h3>
        <p>Thermal resistance models and safe operating area limits for reliable magnetics design under mission profiles.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>What the library holds</h2>
    <p class="lead section-lead-spaced">
      A magnetic component is three things at once — a shape, a material, and a winding. All three are stored
      together, because changing any one of them moves the loss, the temperature rise and the fit in the window.
    </p>

    <div class="db-figure-wide">
      {% include fig-magnetics-cores.html lang=page.lang %}
    </div>

    <div class="db-figure-wide">
      {% include fig-magnetics-windings.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-magnetics-coreloss.html lang=page.lang %}
      {% include fig-magnetics-permeability.html lang=page.lang %}
    </div>

    <p class="small db-figure-note">
      Figures are illustrative of the stored data format. Related reading:
      <a href="{% post_url 2026-09-10-sst-high-frequency-transformer-design %}">high-frequency transformer design</a>.
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Parameter coverage</h2>
    <p class="lead section-lead-spaced">
      Fields carried per core, per material and per conductor — enough to size a transformer or inductor,
      predict its loss split, and check it fits before anything is wound.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Core geometry</h3>
        <ul class="db-spec-list">
          <li><b>Shape &amp; size code</b> <span>E, ER, ETD, PQ, RM, ELP, toroid</span></li>
          <li><b>A<sub>e</sub>, ℓ<sub>e</sub>, V<sub>e</sub></b> <span>effective magnetic parameters</span></li>
          <li><b>Window A<sub>w</sub>, MLT</b> <span>winding area, mean length of turn</span></li>
          <li><b>A<sub>L</sub> vs gap</b> <span>per gap length, incl. fringing</span></li>
          <li><b>Mass &amp; surface area</b> <span>for loss density and cooling</span></li>
          <li><b>R<sub>th</sub> / natural convection</b> <span>K/W vs air flow</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>Core materials</h3>
        <ul class="db-spec-list">
          <li><b>Ferrite</b> <span>MnZn power grades, NiZn</span></li>
          <li><b>Powder cores</b> <span>sendust, high-flux, MPP, iron powder</span></li>
          <li><b>Nanocrystalline &amp; amorphous</b> <span>tape-wound cores</span></li>
          <li><b>B–H loop, B<sub>sat</sub>(T)</b> <span>measured, temperature resolved</span></li>
          <li><b>Loss surface P<sub>v</sub>(f, B̂, T)</b> <span>+ Steinmetz / iGSE fits</span></li>
          <li><b>µ<sub>i</sub>, µ(H<sub>dc</sub>), Curie point</b> <span>bias roll-off, thermal limits</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>Winding materials</h3>
        <ul class="db-spec-list">
          <li><b>Solid round wire</b> <span>AWG / metric, grade, build</span></li>
          <li><b>Litz wire</b> <span>strand count × diameter, construction</span></li>
          <li><b>Copper foil / strip</b> <span>thickness × height, edge treatment</span></li>
          <li><b>PCB planar turns</b> <span>copper weight, stack-up, via array</span></li>
          <li><b>ρ(T), skin depth δ(f)</b> <span>AC resistance ratio F<sub>R</sub></span></li>
          <li><b>Insulation &amp; creepage</b> <span>triple-insulated, margin tape, class</span></li>
        </ul>
      </div>
    </div>
    <ul class="db-tags">
      <li>Gapped inductors</li>
      <li>PFC boost inductors</li>
      <li>LLC resonant tanks</li>
      <li>Integrated L<sub>r</sub> / L<sub>m</sub></li>
      <li>DAB / SST transformers</li>
      <li>Planar transformers</li>
      <li>Common-mode chokes</li>
      <li>Current-sense transformers</li>
      <li>Flyback coupled inductors</li>
    </ul>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Magnetics measurement</h2>
    <p class="lead">
      Accurate current sensing supports magnetics validation, loss extraction, and closed-loop testing. Our PCB Rogowski coil design reference covers a precision sensor for converter and inductor characterisation workflows.
    </p>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/resources/prototypes/rogowski-coil/' | relative_url }}">Rogowski coil design reference</a>
      <a class="btn btn-ghost" href="{{ '/database/transistors/' | relative_url }}">Transistor database</a>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Contact us</a>
    </div>
  </div>
</section>
