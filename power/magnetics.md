---
layout: default
title: Magnetics
permalink: /power/magnetics/
description: The magnetics domain — core materials and geometries, loss and permeability behaviour, winding design, and high-frequency transformer and inductor sizing for power converters.
---

<header class="hero">
  <div class="container">
    <h1>Magnetics</h1>
    <p class="lead">
      The component that decides the size of a converter. Core shape, material
      and winding are chosen together, because moving any one of them moves the
      loss, the temperature rise and the fit in the window.
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>Where magnetics sits in the design chain</h2>
    <p class="lead">
      A magnetic component is never specified on its own. It inherits its
      excitation from the topology and the switching frequency, its thermal
      limit from the enclosure, and its tolerance from the control loop that has
      to live with it.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Set by the converter</h3>
        <p>Volt-seconds, current ripple, DC bias and waveform shape come from the topology and modulation. They fix the flux excursion before any core is chosen.</p>
      </div>
      <div class="card">
        <h3>Limited by loss and temperature</h3>
        <p>Core loss under the real excitation and winding loss at the real frequency content decide the temperature rise, which decides whether the design closes.</p>
      </div>
      <div class="card">
        <h3>Constrained by isolation</h3>
        <p>Creepage, clearance and insulation class set the winding arrangement, which sets leakage inductance — often a design parameter rather than a parasitic.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Shape, material and winding</h2>
    <p class="lead section-lead-spaced">
      The three choices are stored and reasoned about together. The figures
      below are the same ones that describe the magnetics database, because the
      knowledge and the data describe one subject.
    </p>

    <div class="db-figure-wide">
      {% include fig-magnetics-cores.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-magnetics-coreloss.html lang=page.lang %}
      {% include fig-magnetics-permeability.html lang=page.lang %}
    </div>

    <p class="small db-figure-note">
      Loss is a surface over frequency, flux density and temperature; permeability
      moves with DC bias. Single-point catalogue figures hide both, which is why
      the database stores curves and records the conditions with every value.
    </p>

    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/resources/databases/magnetics/' | relative_url }}">Magnetics database</a>
      <a class="btn btn-ghost" href="{{ '/power/converters/' | relative_url }}">Converter topologies</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Worked magnetics material</h2>
    <p class="lead">
      Current coverage is strongest around high-frequency isolation transformers,
      coupled inductors and loosely coupled coils. Optimisation and
      finite-element workflows are described in the notes rather than offered as
      an automated capability.
    </p>
    <div class="grid">
      <a class="card post-card" href="{% post_url 2026-09-10-sst-high-frequency-transformer-design %}">
        <span class="small">Transformer design</span>
        <h3>High-frequency transformer design</h3>
        <p>Turns, core selection, winding arrangement, leakage and loss for an isolated DC–DC stage.</p>
        <span class="post-card-more">Read the note →</span>
      </a>
      <a class="card post-card" href="{% post_url 2026-09-11-flyback-converter-from-zero-to-everything %}">
        <span class="small">Coupled inductor</span>
        <h3>Flyback magnetics</h3>
        <p>Energy storage in the gap, turns ratio, and why the flyback transformer is an inductor with a second winding.</p>
        <span class="post-card-more">Read the note →</span>
      </a>
      <a class="card post-card" href="{% post_url 2026-09-13-wireless-charging-phones-inductive-basics %}">
        <span class="small">Loosely coupled coils</span>
        <h3>Inductive power transfer</h3>
        <p>Coupling coefficient, compensation and what changes when the two windings are separated by an air gap.</p>
        <span class="post-card-more">Read the note →</span>
      </a>
    </div>
    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/resources/design-references/rogowski-coil/' | relative_url }}">Rogowski coil design reference</a>
      <a class="btn btn-ghost" href="{{ '/resources/blog/' | relative_url }}">All engineering notes</a>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Request magnetics data</a>
    </div>
  </div>
</section>
