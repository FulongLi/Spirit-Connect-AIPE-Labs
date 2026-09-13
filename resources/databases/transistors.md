---
layout: default
title: Transistor Database
permalink: /resources/databases/transistors/
description: SiC, GaN, IGBT and silicon MOSFET database — measured switching waveforms, capacitance curves, switching-energy tables and thermal networks for power electronics design automation.
---

<header class="hero">
  <div class="container">
    <h1>Transistor Database</h1>
    <p class="lead">SiC/GaN/IGBT selection under your mission profile.</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>Comprehensive Device Library</h2>
    <p class="lead">
      Our transistor database includes detailed specifications, switching characteristics, and thermal properties
      for a wide range of power semiconductor devices.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Wide-Bandgap Devices</h3>
        <p>Silicon Carbide (SiC) and Gallium Nitride (GaN) transistors with comprehensive switching loss data and thermal models.</p>
      </div>
      <div class="card">
        <h3>Traditional Semiconductors</h3>
        <p>IGBT and MOSFET libraries with datasheet parameters and validated performance models.</p>
      </div>
      <div class="card">
        <h3>Mission Profile Analysis</h3>
        <p>Device selection optimised for your specific operating conditions, efficiency targets, and thermal constraints.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>What a device record contains</h2>
    <p class="lead section-lead-spaced">
      A part number and a few headline numbers are not enough to size a converter. Every entry is stored as
      <em>curves and waveforms</em> — the form a loss model, a thermal solver, or an AI design agent can actually consume.
    </p>

    <div class="db-figure-wide">
      {% include fig-transistor-dpt.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-transistor-iv.html lang=page.lang %}
      {% include fig-transistor-cv.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-transistor-esw.html lang=page.lang %}
      {% include fig-transistor-zth.html lang=page.lang %}
    </div>

    <p class="small db-figure-note">
      Figures are illustrative of the stored data format. Background reading:
      <a href="{% post_url 2026-09-10-double-pulse-testing %}">double-pulse testing</a> ·
      <a href="{% post_url 2026-09-10-static-electrical-characterisation %}">static characterisation</a> ·
      <a href="{% post_url 2026-09-10-gate-charge-capacitance-dynamic-resistance %}">gate charge &amp; capacitance</a> ·
      <a href="{% post_url 2026-09-10-transient-thermal-impedance %}">transient thermal impedance</a>.
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Parameter coverage</h2>
    <p class="lead section-lead-spaced">
      Fields carried per device, with the test conditions attached. A value without its conditions is not data — so
      bias, temperature, gate drive and loop inductance travel with every number.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Static &amp; package</h3>
        <ul class="db-spec-list">
          <li><b>V<sub>DS</sub> / V<sub>CES</sub></b> <span>blocking voltage</span></li>
          <li><b>R<sub>DS(on)</sub>(T<sub>j</sub>)</b> <span>mΩ, normalised curve</span></li>
          <li><b>I<sub>D</sub>–V<sub>DS</sub> families</b> <span>per V<sub>GS</sub>, per T<sub>j</sub></span></li>
          <li><b>V<sub>th</sub>, g<sub>fs</sub></b> <span>with hysteresis where relevant</span></li>
          <li><b>Body / freewheel diode</b> <span>V<sub>F</sub>, Q<sub>rr</sub>, t<sub>rr</sub></span></li>
          <li><b>Package &amp; footprint</b> <span>creepage, stray L, kelvin source</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>Dynamic</h3>
        <ul class="db-spec-list">
          <li><b>C<sub>iss</sub>, C<sub>oss</sub>, C<sub>rss</sub>(V)</b> <span>full curve, not a point</span></li>
          <li><b>Q<sub>g</sub>, Q<sub>gd</sub>, Q<sub>oss</sub>, E<sub>oss</sub></b> <span>integrated from curves</span></li>
          <li><b>E<sub>on</sub>, E<sub>off</sub></b> <span>vs I, V<sub>DC</sub>, T<sub>j</sub>, R<sub>g</sub></span></li>
          <li><b>dv/dt, di/dt</b> <span>measured, per gate resistor</span></li>
          <li><b>Overshoot &amp; ringing</b> <span>with stated loop inductance</span></li>
          <li><b>Raw DPT waveforms</b> <span>CSV, re-analysable</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>Thermal &amp; reliability</h3>
        <ul class="db-spec-list">
          <li><b>R<sub>th(j-c)</sub>, R<sub>th(j-a)</sub></b> <span>K/W, stated boundary</span></li>
          <li><b>Z<sub>th</sub> network</b> <span>Foster / Cauer R–C ladder</span></li>
          <li><b>SOA &amp; short-circuit</b> <span>withstand time, energy</span></li>
          <li><b>Power-cycling data</b> <span>ΔT<sub>j</sub> vs cycles-to-fail</span></li>
          <li><b>Derating rules</b> <span>voltage, current, temperature</span></li>
          <li><b>Model links</b> <span>SPICE, PLECS, ANN surrogate</span></li>
        </ul>
      </div>
    </div>
    <ul class="db-tags">
      <li>SiC MOSFET</li>
      <li>SiC JFET / cascode</li>
      <li>GaN HEMT (e-mode)</li>
      <li>GaN cascode</li>
      <li>Si MOSFET</li>
      <li>Si superjunction</li>
      <li>IGBT (discrete)</li>
      <li>IGBT module</li>
      <li>Reverse-conducting &amp; RB devices</li>
      <li>SiC Schottky diode</li>
    </ul>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>How it feeds a design</h2>
    <div class="grid">
      <div class="card">
        <h3>Shortlist under constraints</h3>
        <p>Filter by blocking voltage, current, package and cost, then rank by computed loss at <em>your</em> operating point rather than by datasheet headline figures.</p>
      </div>
      <div class="card">
        <h3>Close the electro-thermal loop</h3>
        <p>Switching-energy tables and Z<sub>th</sub> networks solve together, so junction temperature, loss and derating converge instead of being assumed.</p>
      </div>
      <div class="card">
        <h3>Feed the agent</h3>
        <p>The same records are exposed to AI-assisted design workflows, so a device choice comes back with the conditions and measurements that justify it.</p>
      </div>
    </div>
    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/power/devices/characterisation/' | relative_url }}">Device characterisation</a>
      <a class="btn btn-ghost" href="{{ '/resources/databases/magnetics/' | relative_url }}">Magnetics database</a>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Request access</a>
    </div>
  </div>
</section>
