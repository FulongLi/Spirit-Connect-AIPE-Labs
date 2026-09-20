---
layout: default
title: Engineering Databases
permalink: /resources/database/
description: Power semiconductor and magnetics databases for power electronics analysis, component selection, modelling, and design automation.
---

<header class="database-hero library-hero">
  <div class="container">
    <span class="section-kicker">Engineering evidence, structured</span>
    <h1>Data that behaves like part of the design.</h1>
    <p class="lead">Reusable device and magnetics data for component selection, loss modelling and AI-assisted engineering workflows — with the conditions and provenance kept attached.</p>
  </div>
</header>

<section class="section database-library-section">
  <div class="container">
    <div class="database-library-heading">
      <div>
        <span class="section-kicker">Two connected libraries</span>
        <h2>From switching event to magnetic component.</h2>
      </div>
      <p>The electrical and magnetic records are designed to meet inside the same converter calculation, rather than living as disconnected datasheet summaries.</p>
    </div>

    <div class="database-collection-grid">
      <a class="database-collection-card database-collection-card-dark" href="{{ '/database/transistors/' | relative_url }}">
        <div class="database-collection-copy">
          <div class="database-collection-meta"><span>Library 01</span><span>Power semiconductors</span></div>
          <h2>Transistor<br>Database</h2>
          <p>SiC, GaN, IGBT and silicon device specifications, switching characteristics, thermal properties and selection references.</p>
          <ul class="database-chip-list" aria-label="Transistor database coverage">
            <li>I–V &amp; C–V curves</li><li>Double-pulse waveforms</li><li>E<sub>on</sub> / E<sub>off</sub></li><li>Z<sub>th</sub> networks</li>
          </ul>
          <strong>Browse transistor data →</strong>
        </div>
        <div class="database-collection-visual">
          <span class="database-visual-label">Electrical behaviour · temperature · time</span>
          {% include fig-db-card-transistor.html lang=page.lang %}
          <div class="database-visual-axis"><span>Static</span><span>Switching</span><span>Thermal</span></div>
        </div>
      </a>

      <a class="database-collection-card database-collection-card-accent" href="{{ '/database/magnetics/' | relative_url }}">
        <div class="database-collection-copy">
          <div class="database-collection-meta"><span>Library 02</span><span>Magnetic components</span></div>
          <h2>Magnetics<br>Database</h2>
          <p>Core materials, loss parameters, winding information and thermal data for transformer and inductor design.</p>
          <ul class="database-chip-list" aria-label="Magnetics database coverage">
            <li>Core geometries</li><li>Loss surfaces</li><li>µ vs DC bias</li><li>Winding conductors</li>
          </ul>
          <strong>Browse magnetics data →</strong>
        </div>
        <div class="database-collection-visual">
          <span class="database-visual-label">Geometry · material · excitation</span>
          {% include fig-db-card-magnetics.html lang=page.lang %}
          <div class="database-visual-axis"><span>Core</span><span>Winding</span><span>Loss</span></div>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="section section-alt database-method-section">
  <div class="container">
    <div class="database-method-heading">
      <span class="section-kicker">Why the structure matters</span>
      <h2>Built for calculation,<br>not just browsing.</h2>
      <p>A datasheet is written for a person reading one part at a time. These records are written for a solver comparing thousands of operating points.</p>
    </div>
    <div class="database-principles">
      <div><span>01</span><h3>Curves over headline numbers</h3><p>C<sub>oss</sub>(V), P<sub>v</sub>(f, B̂, T), µ(H<sub>dc</sub>) and Z<sub>th</sub>(t) preserve the behaviour that decides whether a design closes.</p></div>
      <div><span>02</span><h3>Conditions stay attached</h3><p>Bias, temperature, gate resistance, loop inductance and excitation waveform travel with every value, so comparisons remain meaningful.</p></div>
      <div><span>03</span><h3>Sources remain traceable</h3><p>Digitised and measured records retain their source, revision, fixture and uncertainty for later review.</p></div>
      <div><span>04</span><h3>Models close the loop</h3><p>Switching energy, core loss and thermal networks solve together against an operating or mission profile.</p></div>
      <div><span>05</span><h3>Machine-readable by default</h3><p>Structured curves and surfaces feed scripts, optimisers and design agents without another transcription step.</p></div>
      <div><span>06</span><h3>Expandable through measurement</h3><p>Missing parts can be characterised using the same schema, keeping private and public engineering workflows aligned.</p></div>
    </div>
  </div>
</section>

<section class="section database-cta-section">
  <div class="container database-cta">
    <div>
      <span class="section-kicker">Extend the library</span>
      <h2>Need a device or core we do not list?</h2>
    </div>
    <div>
      <p>We characterise semiconductor and magnetic components to order, then return the data in the same reusable, traceable format.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="{{ '/contact/' | relative_url }}">Request a characterisation</a>
        <a class="btn btn-ghost" href="{{ '/power/devices/characterisation/' | relative_url }}">How we measure</a>
      </div>
    </div>
  </div>
</section>
