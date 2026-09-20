---
layout: default
title: AI Agent Team
permalink: /resources/ai-agent-team/
description: Meet the specialist agents and tools in the AIPE Labs ecosystem, discover what each does, and learn how to use it.
---

<header class="agent-team-hero library-hero">
  <div class="container">
    <span class="section-kicker">Specialist engineering tools</span>
    <h1>A team built around the engineering workflow.</h1>
    <p class="lead">Each AIPE Labs tool owns a clear part of the path from an engineering idea to a result that can be inspected, tested and reused.</p>
  </div>
</header>

<section class="section agent-team-feature-section">
  <div class="container">
    <a class="agent-team-feature" href="{{ '/resources/ai-agent-team/aipe-sketch/' | relative_url }}">
      <div class="agent-team-feature-copy">
        <div class="agent-team-status"><span></span>Available now · Open source</div>
        <p class="agent-team-index">Agent tool 01</p>
        <h2>AIPE-Sketch</h2>
        <p class="lead">Turn electrical connectivity into a clear SVG schematic. AIPE‑Sketch plans component placement, routes wires and checks that the drawing still represents the circuit you described.</p>
        <div class="agent-team-tags" aria-label="AIPE-Sketch capabilities">
          <span>Graph planning</span><span>SVG output</span><span>Connectivity checks</span>
        </div>
        <strong class="agent-team-link">Meet AIPE-Sketch and start drawing →</strong>
      </div>
      <div class="agent-team-feature-visual">
        <div class="agent-tool-window">
          <video class="agent-tool-video" autoplay muted loop playsinline preload="metadata" poster="{{ '/images/general/aipe-sketch-video-poster.png' | relative_url }}" aria-label="Animated introduction to the AIPE-Sketch schematic workflow">
            <source src="{{ '/videos/AIPE-Sketch.mp4' | relative_url }}" type="video/mp4">
          </video>
        </div>
      </div>
    </a>
  </div>
</section>

<section class="section section-alt agent-team-method">
  <div class="container">
    <div class="agent-team-method-heading">
      <span class="section-kicker">How the team is organised</span>
      <h2>Small tools, explicit responsibilities.</h2>
    </div>
    <div class="agent-team-principles">
      <div><span>01</span><h3>Describe</h3><p>Keep the engineering intent in a form that both people and coding agents can inspect.</p></div>
      <div><span>02</span><h3>Generate</h3><p>Use a deterministic backend for the drawing, model, dataset or calculation being produced.</p></div>
      <div><span>03</span><h3>Verify</h3><p>Return checks, warnings and source data alongside the result instead of hiding uncertainty.</p></div>
    </div>
  </div>
</section>
