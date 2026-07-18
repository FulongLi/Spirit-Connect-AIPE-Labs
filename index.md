---
layout: default
title: Power Electronics AI Resources for Coding Agents
description: Give Claude Code, Codex, Cursor, and other coding agents access to AIPE Labs' open power electronics knowledge, tools, specialist agents, and engineering workflows through one link.
image: /images/background/sst.png
---

<header class="hero home-hero">
  <div class="container">
    <h1>The AI that designs the power systems that power AI</h1>
    <p class="lead">
      We are connecting intelligent system design with the energy infrastructure that fuels it —
      from semiconductor device to converter to grid.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#agent-link">Copy the AIPE link</a>
      <a class="btn btn-ghost" href="https://github.com/AIPE-Labs" target="_blank" rel="noopener">Explore the open-source work ↗</a>
    </div>

    <div class="workflow-panel" aria-label="How a coding agent uses the AIPE Labs resource index">
      <div class="workflow-toolbar">
        <span class="workflow-brand"><span class="status-dot"></span> AIPE Labs resource graph</span>
        <span class="workflow-status">Open · growing in public</span>
      </div>
      <div class="workflow-prompt">
        <span class="workflow-label">YOU</span>
        <p>Read <strong>aipel.co.uk/aipe.md</strong> and find the best AIPE resources to help me analyse a DAB converter.</p>
      </div>
      <div class="workflow-route" aria-hidden="true">
        <span>Coding agent</span><b>→</b><span class="workflow-index">aipe.md</span><b>→</b><span>Relevant resources</span>
      </div>
      <div class="workflow-resources">
        <span>Simulation</span><span>Finite-element analysis</span><span>Devices</span>
        <span>Magnetics</span><span>Converters</span><span>Validation</span>
      </div>
    </div>
  </div>
</header>

<section class="section section-alt agent-entry" id="agent-link">
  <div class="container narrow-center">
    <h2>One link is the entry point</h2>
    <p class="lead">
      <code>aipe.md</code> is a Markdown index written for AI agents. It helps an agent discover
      the most relevant AIPE Labs resources for the task in front of you, without a new app,
      account, or closed platform.
    </p>
    <div class="agent-link">
      <code id="agent-url">https://aipel.co.uk/aipe.md</code>
      <button class="copy-btn" data-copy-target="agent-url" aria-live="polite">Copy link</button>
    </div>
    <p class="agent-steps">
      Paste the link into your coding agent, then describe the engineering task you want to complete.
    </p>
    <div class="prompt-grid">
      <div class="prompt-card"><span>SIMULATION</span><p>“Find the available AIPE resources for setting up and checking this converter simulation.”</p></div>
      <div class="prompt-card"><span>FINITE-ELEMENT ANALYSIS</span><p>“Use the AIPE index to help me plan a magnetic or thermal finite-element workflow.”</p></div>
      <div class="prompt-card"><span>DESIGN &amp; VALIDATION</span><p>“Find relevant device, magnetics, control, and validation resources for this specification.”</p></div>
    </div>
    <a class="text-link" href="{{ '/plugin/' | relative_url }}">See how to use AIPE with your coding agent →</a>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Engineering knowledge across every scale</h2>
    <p class="lead">
      AIPE Labs connects the layers that power electronics engineers already work across, so an
      agent can find context beyond a single isolated calculation.
    </p>
    <div class="grid scope-grid">
      <a class="card scope-card" href="{{ '/power/devices/' | relative_url }}">
        <img src="{{ '/images/research/components.png' | relative_url }}" alt="Power semiconductor devices" loading="lazy" decoding="async">
        <span class="scope-kicker">01 · COMPONENT LEVEL</span>
        <h3>Devices &amp; magnetics</h3>
        <p>Characterisation, modelling, component data, loss estimation, thermal behaviour, and magnetic design resources.</p>
        <strong>Explore device resources →</strong>
      </a>
      <a class="card scope-card" href="{{ '/power/converters/' | relative_url }}">
        <img src="{{ '/images/research/converter.png' | relative_url }}" alt="Power converter design" loading="lazy" decoding="async">
        <span class="scope-kicker">02 · CONVERTER LEVEL</span>
        <h3>Converters &amp; control</h3>
        <p>Topology comparison, converter modelling, control, optimisation, and repeatable design workflows.</p>
        <strong>Explore converter resources →</strong>
      </a>
      <a class="card scope-card" href="{{ '/power/microgrids/' | relative_url }}">
        <img src="{{ '/images/research/microgrids.png' | relative_url }}" alt="Power electronics systems and microgrids" loading="lazy" decoding="async">
        <span class="scope-kicker">03 · SYSTEM LEVEL</span>
        <h3>Systems &amp; microgrids</h3>
        <p>DC distribution, microgrid architecture, system integration, mission profiles, and validation planning.</p>
        <strong>Explore system resources →</strong>
      </a>
    </div>
  </div>
</section>

<section class="section collaboration-section">
  <div class="container collaboration-layout">
    <div>
      <h2>Built to be useful today — and ambitious enough to grow</h2>
      <p class="lead">
        We welcome developers who want to use or contribute resources, researchers who want to
        validate new workflows, and companies or strategic partners interested in building the
        next generation of AI-assisted power electronics engineering.
      </p>
      <div class="hero-actions align-left">
        <a class="btn btn-primary" href="{{ '/contact/' | relative_url }}">Discuss a collaboration</a>
        <a class="btn btn-ghost" href="{{ '/resources/prototypes/' | relative_url }}">Explore design work</a>
      </div>
    </div>
    <div class="collaboration-list">
      <div><span>01</span><p><strong>Developers</strong><br>Use the index, test resources, and contribute open tools.</p></div>
      <div><span>02</span><p><strong>Research partners</strong><br>Turn methods and datasets into repeatable agent workflows.</p></div>
      <div><span>03</span><p><strong>Industry &amp; strategic partners</strong><br>Pilot the technology on real engineering problems and help shape the platform.</p></div>
    </div>
  </div>
</section>

<section class="section section-alt partners-section">
  <div class="container">
    <h2>Partners &amp; collaborations</h2>
    <p>Academic and industrial relationships supporting our work across AI, power electronics, and energy systems.</p>
    <div class="partner-grid">
      <img src="{{ '/images/general/CU_logo.png' | relative_url }}" alt="Cardiff University" loading="lazy" decoding="async">
      <img src="{{ '/images/general/SHI_logo.png' | relative_url }}" alt="Sumitomo Heavy Industries" loading="lazy" decoding="async">
      <img src="{{ '/images/general/SHU_logo.png' | relative_url }}" alt="Shanghai University" loading="lazy" decoding="async">
      <img src="{{ '/images/general/PX_logo.png' | relative_url }}" alt="Panxin Technologies" loading="lazy" decoding="async">
      <img src="{{ '/images/general/LU_logo.png' | relative_url }}" alt="Loughborough University" loading="lazy" decoding="async">
      <img src="{{ '/images/general/UG_logo.webp' | relative_url }}" alt="University of Glasgow" loading="lazy" decoding="async">
    </div>
  </div>
</section>
