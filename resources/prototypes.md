---
layout: default
title: Design Prototypes
permalink: /resources/prototypes/
description: Hardware prototypes and AI-assisted design case studies — converters, transformers, magnetics, and measurement.
---

<header class="hero hero-compact">
  <div class="container">
    <span class="badge">Resources</span>
    <h1>Design Prototypes</h1>
    <p class="lead">
      Hardware we have designed, built, and validated — each one a testbed for the
      Power Electronics AI Agent's design workflows.
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <div class="grid">
      <a class="card post-card" href="{{ '/case-studies/dab/' | relative_url }}">
        <span class="small">Converter</span>
        <h3>Dual Active Bridge Converter</h3>
        <p>AI-assisted optimization of a dual-active-bridge (DAB) converter — topology, magnetics,
           and control co-designed in a single pass.</p>
        <span class="post-card-more">View case study →</span>
      </a>
      <a class="card post-card" href="{{ '/case-studies/sst/' | relative_url }}">
        <span class="small">System</span>
        <h3>Solid-State Transformer</h3>
        <p>AI-assisted design of a solid-state transformer (SST) for next-generation
           power distribution networks.</p>
        <span class="post-card-more">View case study →</span>
      </a>
      <a class="card post-card" href="{{ '/case-studies/magnetics/rogowski-coil/' | relative_url }}">
        <span class="small">Measurement</span>
        <h3>PCB Rogowski Coil</h3>
        <p>High-precision PCB Rogowski coil current transducers for power electronics
           validation and monitoring.</p>
        <span class="post-card-more">View case study →</span>
      </a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Design databases</h2>
    <p class="lead">The component data behind the prototypes — also readable by your AI agent via
      <a href="{{ '/aipe.txt' | relative_url }}">aipe.txt</a>.</p>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));">
      <a class="card post-card" href="{{ '/database/transistors/' | relative_url }}">
        <span class="small">Database</span>
        <h3>Transistor Database</h3>
        <p>Power semiconductor devices — SiC, GaN, and Si — with characterisation data.</p>
        <span class="post-card-more">Browse →</span>
      </a>
      <a class="card post-card" href="{{ '/database/magnetics/' | relative_url }}">
        <span class="small">Database</span>
        <h3>Magnetics Database</h3>
        <p>Magnetic components and core materials for converter design.</p>
        <span class="post-card-more">Browse →</span>
      </a>
    </div>
  </div>
</section>
