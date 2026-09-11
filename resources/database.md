---
layout: default
title: Engineering Databases
permalink: /resources/database/
description: Power semiconductor and magnetics databases for power electronics analysis, component selection, modelling, and design automation.
---

<header class="hero hero-compact">
  <div class="container">
    <h1>Engineering Databases</h1>
    <p class="lead">
      Reusable device and magnetics data for power electronics analysis,
      component selection, modelling, and AI-assisted design workflows.
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <div class="grid grid-two">
      <a class="card post-card" href="{{ '/database/transistors/' | relative_url }}">
        {% include fig-db-card-transistor.html lang=page.lang %}
        <span class="small">Power semiconductors</span>
        <h3>Transistor Database</h3>
        <p>SiC, GaN, IGBT, and silicon device specifications, switching characteristics, thermal properties, and selection references.</p>
        <ul class="db-tags">
          <li>I–V &amp; C–V curves</li>
          <li>Double-pulse waveforms</li>
          <li>E<sub>on</sub> / E<sub>off</sub> tables</li>
          <li>Z<sub>th</sub> networks</li>
        </ul>
        <span class="post-card-more">Browse transistor data →</span>
      </a>
      <a class="card post-card" href="{{ '/database/magnetics/' | relative_url }}">
        {% include fig-db-card-magnetics.html lang=page.lang %}
        <span class="small">Magnetic components</span>
        <h3>Magnetics Database</h3>
        <p>Core materials, loss parameters, winding information, and thermal data for transformer and inductor design.</p>
        <ul class="db-tags">
          <li>Core geometries</li>
          <li>Loss surfaces</li>
          <li>µ vs DC bias</li>
          <li>Winding conductors</li>
        </ul>
        <span class="post-card-more">Browse magnetics data →</span>
      </a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Built for calculation, not for browsing</h2>
    <p class="lead section-lead-spaced">
      A datasheet PDF is written for a human reading one part at a time. These databases are written for a solver
      sweeping thousands of combinations — so everything is stored as curves, surfaces and networks, with the
      measurement conditions attached to every number.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Curves, not headline numbers</h3>
        <p>C<sub>oss</sub>(V), P<sub>v</sub>(f, B̂, T), µ(H<sub>dc</sub>), Z<sub>th</sub>(t). Single-point values hide exactly the behaviour that decides whether a design closes.</p>
      </div>
      <div class="card">
        <h3>Conditions travel with the value</h3>
        <p>Bias voltage, junction temperature, gate resistance, loop inductance, excitation waveform. A number without its conditions cannot be compared across vendors.</p>
      </div>
      <div class="card">
        <h3>Measured where it matters</h3>
        <p>Digitised datasheet data is marked as such. Bench-measured data carries the fixture, instrument and uncertainty, so you know which is which.</p>
      </div>
      <div class="card">
        <h3>Loss models that close</h3>
        <p>Switching energy and thermal networks solve together against a mission profile, giving junction temperature and efficiency instead of an optimistic estimate.</p>
      </div>
      <div class="card">
        <h3>Machine-readable</h3>
        <p>Structured records feed scripts, optimisers and AI design agents directly — the same data behind our own converter and magnetics sizing tools.</p>
      </div>
      <div class="card">
        <h3>Traceable</h3>
        <p>Every entry keeps its source, revision and date, so a design review can retrace where a parameter came from years later.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow-center">
    <h2>Need a device or core we do not list?</h2>
    <p class="lead">
      We characterise parts to order — static, dynamic and thermal for semiconductors; loss, permeability and
      winding data for magnetics — and add them to the library in the same format.
    </p>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/contact/' | relative_url }}">Request a characterisation</a>
      <a class="btn btn-ghost" href="{{ '/power/devices/characterisation/' | relative_url }}">How we measure</a>
    </div>
  </div>
</section>
