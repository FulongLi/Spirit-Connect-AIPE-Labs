---
layout: default
title: Solid-State Transformer Design Reference
permalink: /resources/design-references/sst/
description: Design reference for a modular solid-state transformer (SST) architecture — cell-level converter design through to system-level integration and control.
---

<header class="hero">
  <div class="container">
    <h1>Solid-State Transformer</h1>
    <p class="lead">A modular SST design reference — from cell-level converter design to system-level integration and control.</p>
    <p class="reference-note">{% include status.html key="analytical" %} Worked through with analysis and stated assumptions. No hardware result is reported on this page.</p>
  </div>
</header>

<section class="section"><div class="container"><p><a href="{% post_url 2026-09-10-three-stage-solid-state-transformer %}">Read the complete three-stage SST learning series →</a></p><p>The linked articles are analytical teaching drafts. They state their assumptions and distinguish planned models and hardware from completed validation.</p></div></section>

<section class="section">
  <div class="container">
    <h2>Why Solid-State Transformers?</h2>
    <p class="lead">
      Solid-state transformers replace bulky line-frequency transformers with compact, controllable
      power electronics — enabling bidirectional power flow, voltage regulation, and seamless integration
      of renewables, storage, and DC loads.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Multi-stage architecture</h3>
        <p>AC-DC rectification, isolated DC-DC conversion (DAB), and DC-AC inversion — each stage designed
        against one system specification rather than in isolation.</p>
      </div>
      <div class="card">
        <h3>Modular cell design</h3>
        <p>Cascaded H-bridge or modular multi-level cells, with device selection, magnetics sizing and
        thermal balancing treated as one problem across the modules.</p>
      </div>
      <div class="card">
        <h3>Medium-voltage operation</h3>
        <p>For medium-voltage designs, insulation coordination, dv/dt management and module voltage sharing require dedicated engineering and validation.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>What this design reference covers</h2>
    <p class="lead section-lead-spaced">
      This reference follows the <code>system-integration</code> workflow published in the
      <a href="{{ '/resources/' | relative_url }}">capability stack</a>. The workflow is
      <em>documented</em>: the sequence and the material for each step are published, but it is not an
      executable pipeline and nothing on this page was generated automatically.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Topology comparison</h3>
        <p>DAB, LLC and resonant CLLC cells compared for the isolation stage on efficiency, power
        density and fault tolerance, with the assumptions behind each comparison stated.</p>
      </div>
      <div class="card">
        <h3>Control co-design</h3>
        <p>Hierarchical control: cell-level soft-switching and current balancing, stage-level voltage
        regulation, and system-level power flow management, and how ownership is split between them.</p>
      </div>
      <div class="card">
        <h3>Validation planning</h3>
        <p>The test plan a build would need — efficiency mapping, thermal cycling and fault injection —
        written as milestones. No measurements are published here.</p>
      </div>
    </div>
    <p class="small reference-note">
      Databases used: transistor and magnetics records. Tool used: AIPE-Sketch for the schematics.
      No AIPE specialist agent is published, so no step on this page was produced by one.
    </p>
  </div>
</section>
