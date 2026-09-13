---
layout: default
title: DAB Converter Design Reference
permalink: /resources/design-references/dab/
description: Design reference for a dual-active-bridge (DAB) converter — devices, magnetics, control loops and validation planning.
---

<header class="hero">
  <div class="container">
    <h1>DAB Converter Design Reference</h1>
    <p class="lead">A design workflow for a DAB stage — switching devices, magnetics, control loops and validation. The teaching series starts with a separate 100 W cell example.</p>
    <p class="reference-note">{% include status.html key="analytical" %} Worked through with analysis and stated assumptions. No hardware result is reported on this page.</p>
  </div>
</header>

<section class="section"><div class="container"><p><a href="{% post_url 2026-09-10-dab-converter-from-principles-to-control %}">Read the DAB circuit, modelling and control tutorial →</a></p><p>The linked articles are analytical teaching drafts. They state their assumptions and distinguish planned models and hardware from completed validation.</p></div></section>

<section class="section">
  <div class="container">
    <h2>The design workflow</h2>
    <p class="lead">
      This design reference follows the <code>converter-design</code> workflow published in the
      <a href="{{ '/resources/' | relative_url }}">capability stack</a>: requirement, topology and
      modulation, device selection, magnetics, small-signal model, control design and a test plan.
      The workflow is <em>documented</em> — the steps and the material for each step are published,
      but it is not an executable pipeline.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Topology &amp; parameters</h3>
        <p>Phase count, transformer ratio and filter values are chosen against the specification, with the constraints and feasibility checks written out so the choice can be argued with.</p>
      </div>
      <div class="card">
        <h3>Control synthesis</h3>
        <p>Phase-shift and triple-phase-shift modulation, the small-signal model they lead to, and the current and voltage regulation loops derived from it.</p>
      </div>
      <div class="card">
        <h3>Validation planning</h3>
        <p>The test matrix, efficiency and thermal measurement points and pass criteria that a build would have to satisfy. Planning only — no measurements are published here.</p>
      </div>
    </div>
    <p class="small reference-note">
      Databases used: transistor and magnetics records. Tool used: AIPE-Sketch for the schematics.
      No AIPE specialist agent is published, so no step on this page was produced by one.
    </p>
  </div>
</section>
