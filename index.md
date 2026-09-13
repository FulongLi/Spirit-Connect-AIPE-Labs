---
layout: default
title: AI for Power Engineering
description: AIPE Labs is an open platform for AI in power engineering — engineering knowledge, databases, tools, specialist agents and workflows spanning devices, magnetics, converters and systems. Open to engineers through this site and to coding agents through aipe.md.
image: /images/background/sst.png
---

<header class="hero home-hero">
  <div class="container">
    <h1>The AI that designs the power systems that power AI</h1>
    <p class="lead">
      AIPE Labs is an open platform for <strong>AI in power engineering</strong>.
      It brings engineering knowledge, machine-readable data, tools, specialist
      agents and workflows together so real engineering tasks can be carried
      out end to end — from semiconductor device to converter to grid.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#agent-link">Copy the AIPE link</a>
      <a class="btn btn-ghost" href="{{ '/resources/' | relative_url }}">Browse the resources</a>
    </div>

    <div class="workflow-panel" aria-label="How a coding agent uses the AIPE Labs capability index">
      <div class="workflow-toolbar">
        <span class="workflow-brand"><span class="status-dot"></span> AIPE Labs capability index</span>
        <span class="workflow-status">Open · growing in public</span>
      </div>
      <div class="workflow-prompt">
        <span class="workflow-label">YOU</span>
        <p>Read <strong>aipel.co.uk/aipe.md</strong> and find the best AIPE resources to help me analyse a DAB converter.</p>
      </div>
      <div class="workflow-route" aria-hidden="true">
        <span>Coding agent</span><b>→</b><span class="workflow-index">aipe.md</span><b>→</b><span>Relevant capabilities</span>
      </div>
      <div class="workflow-resources">
        <span>Knowledge</span><span>Databases</span><span>Tools</span>
        <span>Agents</span><span>Workflows</span><span>Design references</span>
      </div>
    </div>
  </div>
</header>

<section class="section section-alt agent-entry" id="agent-link">
  <div class="container">
    <h2 class="section-title-centred">Two ways into the same platform</h2>
    <div class="grid grid-two">
      <div class="card entry-card">
        <span class="scope-kicker">FOR ENGINEERS</span>
        <h3>This website</h3>
        <p>
          Engineering knowledge organised by domain, machine-readable databases,
          and design references you can read, argue with and reuse.
        </p>
        <a class="text-link" href="{{ '/resources/' | relative_url }}">Browse the capability stack →</a>
      </div>
      <div class="card entry-card">
        <span class="scope-kicker">FOR CODING AGENTS</span>
        <h3><code>aipe.md</code></h3>
        <p>
          The same ecosystem as a plain-Markdown index: what AIPE knows, which
          databases, tools, agents and workflows exist, and how they relate.
          No account, no extension, no closed platform.
        </p>
        <div class="agent-link">
          <code id="agent-url">https://aipel.co.uk/aipe.md</code>
          <button class="copy-btn" data-copy-target="agent-url" aria-live="polite">Copy link</button>
        </div>
        <a class="text-link" href="{{ '/plugin/' | relative_url }}">How to use it with your agent →</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>What can AIPE help you do?</h2>
    <p class="lead section-lead-spaced">
      The platform is organised around engineering tasks rather than academic
      categories. Each card says plainly what supports that task today.
    </p>
    {% include capability-cards.html %}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Four engineering domains</h2>
    <p class="lead section-lead-spaced">
      Knowledge, data and capabilities are tagged to the same four domains, so a
      device question and a system question reach the same library.
    </p>
    {% include domain-cards.html %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>How the platform is put together</h2>
    <p class="lead section-lead-spaced">
      Separating these layers is what lets an engineering task be assembled from
      parts. Design references are the evidence of what the combination produces.
    </p>
    <ol class="layer-flow">
      <li><strong>Knowledge</strong><span>Explanation, equations, methodology</span></li>
      <li><strong>Databases</strong><span>Machine-readable engineering data</span></li>
      <li><strong>Tools</strong><span>Input → operation → output</span></li>
      <li><strong>Agents</strong><span>Specialist reasoning and orchestration</span></li>
      <li><strong>Workflows</strong><span>A complete engineering task</span></li>
    </ol>
    <p class="small reference-note">
      Not every layer is equally mature. Databases and knowledge are published
      now; tools are early; no AIPE specialist agent is published yet, and the
      <a href="{{ '/resources/' | relative_url }}">resources page</a> marks the
      status of every entry.
    </p>

    <h3 class="layer-outcome-heading">What it produces</h3>
    {% include resource-cards.html items=site.data.resources.design_references %}
    <p><a class="text-link" href="{{ '/resources/design-references/' | relative_url }}">All design references →</a></p>
  </div>
</section>

<section class="section collaboration-section">
  <div class="container collaboration-layout">
    <div>
      <h2>Built to be useful today — and ambitious enough to grow</h2>
      <p class="lead">
        We welcome developers who want to use or contribute resources, researchers who want to
        validate new workflows, and companies or strategic partners interested in building the
        next generation of AI-assisted power engineering.
      </p>
      <div class="hero-actions align-left">
        <a class="btn btn-primary" href="{{ '/contact/' | relative_url }}">Discuss a collaboration</a>
        <a class="btn btn-ghost" href="https://github.com/AIPE-Labs" target="_blank" rel="noopener">Explore the open-source work ↗</a>
      </div>
    </div>
    <div class="collaboration-list">
      <div><span>01</span><p><strong>Developers</strong><br>Use the index, test resources, and contribute open tools.</p></div>
      <div><span>02</span><p><strong>Research partners</strong><br>Turn methods and datasets into repeatable agent workflows.</p></div>
      <div><span>03</span><p><strong>Industry &amp; strategic partners</strong><br>Pilot the technology on real engineering problems and help shape the platform.</p></div>
    </div>
  </div>
</section>

{% include partners.html intro="Academic and industrial relationships supporting our work across AI, power engineering, and energy systems." %}
