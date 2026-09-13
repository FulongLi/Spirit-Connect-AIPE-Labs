---
layout: default
title: DAB Converter Design Reference
permalink: /resources/prototypes/dab/
description: Design reference for AI-assisted optimisation of a dual-active-bridge (DAB) converter.
---

<header class="hero">
  <div class="container">
    <h1>DAB Converter Design Reference</h1>
    <p class="lead">A design workflow for a DAB stage — switching devices, magnetics, control loops and validation. The teaching series starts with a separate 100 W cell example.</p>
  </div>
</header>

<section class="section"><div class="container"><p><a href="{% post_url 2026-09-10-dab-converter-from-principles-to-control %}">Read the DAB circuit, modelling and control tutorial →</a></p><p>The linked articles are analytical teaching drafts. They state their assumptions and distinguish planned models and hardware from completed validation.</p></div></section>

<section class="section">
  <div class="container">
    <h2>Design Optimisation Process</h2>
    <p class="lead">
      This design reference demonstrates how an AI-assisted workflow can systematically explore
      the design space to find optimal solutions for a dual-active-bridge converter.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Topology & Parameters</h3>
        <p>Automated search across phase count, transformer ratio, and filter values with comprehensive constraint checking and feasibility analysis.</p>
      </div>
      <div class="card">
        <h3>Control Synthesis</h3>
        <p>Phase-shift and triple-phase-shift modulation strategies with automated tuning of current and voltage regulation loops for optimal performance.</p>
      </div>
      <div class="card">
        <h3>Validation & Testing</h3>
        <p>Automated generation of HIL/SIL test matrices, efficiency/thermal maps, and data capture scripts for repeatable validation workflows.</p>
      </div>
    </div>
  </div>
</section>
