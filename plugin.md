---
layout: default
title: Use AIPE Labs with Your Coding Agent
permalink: /plugin/
description: Give Claude Code, Codex, Cursor, and other coding agents an open entry point to AIPE Labs power electronics knowledge, tools, specialist agents, and workflows.
image: /images/background/sst.png
---

<main class="agent-guide">
<header class="hero hero-compact">
  <div class="container">
    <span class="badge">No installation · no API key</span>
    <h1>Use AIPE Labs with your coding agent</h1>
    <p class="lead">
      Give <strong>Claude Code</strong>, <strong>Codex</strong>, Cursor, or another web-enabled
      coding agent one open link to the AIPE Labs engineering resources.
    </p>
    <div class="agent-link">
      <code id="agent-prompt">Read https://aipel.co.uk/aipe.md, find the relevant AIPE Labs resources, and help me with my power electronics task.</code>
      <button class="copy-btn" data-copy-target="agent-prompt">Copy</button>
    </div>
    <p class="agent-steps">Paste the prompt into your existing agent, then describe the engineering task.</p>
  </div>
</header>

<section class="section section-alt">
  <div class="container">
    <span class="section-badge">ONE OPEN ENTRY POINT</span>
    <h2>Why use the AIPE index</h2>
    <p class="lead">
      The index gives an agent a stable map of the knowledge, data, design references,
      packages, and specialist agents that AIPE Labs has published.
    </p>
    <div class="grid">
      <div class="card">
        <h3>One prompt, no setup</h3>
        <p>No account, AIPE API key, extension, or separate application is required to read the public resources.</p>
      </div>
      <div class="card">
        <h3>Resources stay connected</h3>
        <p>Device data, magnetics, converter topologies, prototype design references, and open-source tools remain reachable through one maintained index.</p>
      </div>
      <div class="card">
        <h3>Works in your current workflow</h3>
        <p>Any coding agent that can retrieve a public URL can use the index without moving your work into a separate platform.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <span class="section-badge">EXAMPLE TASKS</span>
    <h2>Start with an engineering question</h2>
    <p class="lead">
      Ask the agent to use the index as a resource map, then require it to state assumptions,
      cite original sources, and keep important calculations reviewable.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Shortlist devices</h3>
        <p>“Shortlist SiC devices for a 10&nbsp;kW, 800&nbsp;V DC–DC stage and explain the selection constraints.”</p>
      </div>
      <div class="card">
        <h3>Size magnetics</h3>
        <p>“Find the relevant magnetic data and help me plan a transformer design for a 100&nbsp;kHz DAB.”</p>
      </div>
      <div class="card">
        <h3>Compare topologies</h3>
        <p>“Compare LLC and DAB for this specification, including power flow, isolation, soft switching, and control.”</p>
      </div>
      <div class="card">
        <h3>Estimate losses</h3>
        <p>“Locate available characterisation and modelling resources, then structure a reviewable loss calculation.”</p>
      </div>
      <div class="card">
        <h3>Plan simulation</h3>
        <p>“Use the AIPE resources to outline a simulation or finite-element workflow and its validation checks.”</p>
      </div>
      <div class="card">
        <h3>Prepare validation</h3>
        <p>“Draft a converter test plan covering sensing, operating points, protection, uncertainty, and pass criteria.”</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <span class="section-badge section-badge-centred">COMMON QUESTIONS</span>
    <h2 class="section-title-centred">Frequently asked questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false"><span class="faq-q-label">What is <code>aipe.md</code>?</span><span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>It is the canonical Markdown resource index for AIPE Labs. It describes the resources currently available and links an agent to the relevant tools, datasets, engineering pages, and repositories.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Is the Claude/Codex Plugin something I install?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. “Plugin” is the navigation name for this agent entry point. Your coding agent reads the public Markdown index directly; there is no browser extension or software package to install.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Which agents can use it?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Any agent that can retrieve a public URL can use it, including Claude Code, Codex, Cursor, and custom agent frameworks with web access.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does the index send my project data to AIPE Labs?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Reading the public index does not send project files to AIPE Labs. Information entered into a third-party agent is handled under that provider’s terms and your organisation’s policies.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Can the output replace engineering review?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Use the resources to accelerate discovery and analysis, then verify important outputs against original datasheets, models, standards, simulations, and measurements.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section collaboration-section agent-guide-cta">
  <div class="container narrow-center">
    <span class="section-badge">START HERE</span>
    <h2>Give your agent the AIPE link</h2>
    <p class="lead">
      Copy the prepared prompt into your coding agent, or contact us to discuss research collaboration,
      engineering pilots, and deeper integrations.
    </p>
    <div class="hero-actions">
      <button type="button" class="btn btn-primary" data-copy-target="agent-prompt">Copy AIPE prompt</button>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Contact us</a>
    </div>
  </div>
</section>
</main>
