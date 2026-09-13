---
layout: default
title: Design References
permalink: /resources/design-references/
description: Worked engineering examples produced with AIPE capabilities — converter, solid-state transformer, and power-electronics measurement design references.
---

<header class="hero hero-compact">
  <div class="container">
    <h1>Design References</h1>
    <p class="lead">
      Worked engineering examples produced with AIPE capabilities. Each one shows
      the domains it touches and how far it has been taken — analysis, simulation
      or hardware — so it can be judged as evidence rather than read as a claim.
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    {% include resource-cards.html items=site.data.resources.design_references %}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>What a design reference is for</h2>
    <p class="lead section-lead-spaced">
      A design reference is not a product page. It is the record of one route
      through an engineering problem, kept explicit enough that you can follow
      the same route or argue with it.
    </p>
    <div class="grid">
      <div class="card">
        <h3>It names its inputs</h3>
        <p>Specification, operating points and assumptions are stated at the top, so a result can be checked against the case it was derived for.</p>
      </div>
      <div class="card">
        <h3>It shows the workflow</h3>
        <p>Requirement, topology, device selection, magnetics, modelling, control and validation appear in the order an engineer meets them.</p>
      </div>
      <div class="card">
        <h3>It is honest about maturity</h3>
        <p>Analytical work, simulation and bench-verified hardware are labelled differently. Planned work is never written up as a completed result.</p>
      </div>
    </div>
    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/resources/' | relative_url }}">The capability stack</a>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Discuss a design</a>
    </div>
  </div>
</section>
