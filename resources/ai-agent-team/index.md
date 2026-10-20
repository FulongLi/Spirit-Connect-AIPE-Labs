---
layout: default
title: AI Agent Team
permalink: /resources/ai-agent-team/
description: Meet the specialist agents and tools in the AIPE Labs ecosystem, discover what each does, and learn how to use it.
---

<header class="agent-team-hero library-hero">
  <div class="container">
    {% include hub-breadcrumb.html category='tools' %}
    <span class="section-kicker">Specialist engineering tools</span>
    <h1>A team built around the engineering workflow.</h1>
    <p class="lead">Each AIPE Labs tool owns a clear part of the path from an engineering idea to a result that can be inspected, tested and reused.</p>
  </div>
</header>

{%- assign sketcher = site.data.agents | where: "key", "sketch" | first %}
<section class="section agent-team-feature-section">
  <div class="container">
    <a class="agent-team-feature" href="{{ sketcher.page | relative_url }}">
      <div class="agent-team-feature-copy">
        <div class="agent-team-status"><span></span>Available now · {{ sketcher.licence.label.en }}</div>
        <p class="agent-team-index">Agent tool 01</p>
        <h2>{{ sketcher.name }}</h2>
        <p class="lead">Turn circuit descriptions into clear, electrically checked SVG schematics. {{ sketcher.name }} installs as a Codex or Claude Code plugin, arranges symbols and wires, and checks that the drawing matches the circuit you described.</p>
        <div class="agent-team-tags" aria-label="{{ sketcher.name }} capabilities">
          <span>Codex &amp; Claude Code plugin</span><span>SVG + JSON report</span><span>Electrical validation</span>
        </div>
        <strong class="agent-team-link">Meet {{ sketcher.name }} and start drawing →</strong>
      </div>
      <div class="agent-team-feature-visual">
        <div class="agent-tool-window">
          <video class="agent-tool-video" autoplay muted loop playsinline preload="metadata" poster="{{ sketcher.video_poster | relative_url }}" aria-label="Preview of the {{ sketcher.name }} Quick Start tutorial">
            <source src="{{ sketcher.video | relative_url }}" type="video/mp4">
          </video>
        </div>
      </div>
    </a>
  </div>
</section>

<section class="section agent-team-more">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">More agents</span><h2>Also in the team.</h2></div>
    </div>
    <div class="hub-project-grid">
      {%- for agent in site.data.agents %}{% unless agent.key == 'sketch' %}
      {% include agent-plugin-card.html agent=agent lang='en' %}
      {%- endunless %}{% endfor %}
    </div>
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
