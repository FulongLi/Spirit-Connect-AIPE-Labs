---
layout: default
title: Use AIPE Labs with Your Coding Agent
permalink: /plugin/
description: Give Claude Code, Codex, Cursor, and other coding agents an open entry point to AIPE Labs power electronics knowledge, tools, specialist agents, and workflows.
image: /images/background/sst.png
---

<header class="hero hero-compact">
  <div class="container">
    <span class="badge">No installation · no API key</span>
    <h1>Use AIPE Labs with your coding agent</h1>
    <p class="lead">
      Enter the prompt below into <strong>Claude Code</strong>, <strong>Codex</strong>, or any AI coding agent.
    </p>
    <div class="agent-link">
      <code id="agent-prompt">Read aipel.co.uk/aipe.md to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt">Copy</button>
    </div>
    <p class="agent-steps">The link is an open resource index, not a software package you need to install.</p>
  </div>
</header>

<section class="section section-alt">
  <div class="container" style="text-align:center;">
    <h2>Why AIPE Labs in your agent</h2>
    <p class="lead" style="margin-inline:auto;">
      Most ways to bring domain data into an AI workflow mean a new app, new logins, and API keys to manage.
      The AIPE Labs resource link skips all of that.
    </p>
    <div class="grid" style="text-align:left;">
      <div class="card">
        <h3>One prompt, no setup</h3>
        <p>No API keys to generate, store, or manage. Paste one prompt and your agent reads our
        resource index directly — you are designing in minutes, inside the agent you already use.</p>
      </div>
      <div class="card">
        <h3>Every resource, one connection</h3>
        <p>Transistor and magnetics databases, design references, prototype case studies, and the
        skills and packages we publish on <a href="https://github.com/FulongLi" target="_blank">GitHub</a> —
        everything is reachable through the same link.</p>
      </div>
      <div class="card">
        <h3>Works inside your existing agent</h3>
        <p>The index uses the web access already available to your coding agent. AIPE Labs does not
        require a separate login, credit balance, or subscription to read the open resources.</p>
      </div>
    </div>
    <p class="lead" style="margin:3rem auto 0;">To start, paste this into your agent:</p>
    <div class="agent-link">
      <code id="agent-prompt-2">Read aipel.co.uk/aipe.md to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt-2">Copy</button>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>What can AIPE Labs do in your agent</h2>
    <p class="lead">
      Start with a job and let your agent discover the most relevant resources currently available through the index.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Shortlist devices</h3>
        <p>“Shortlist SiC devices for a 10 kW, 800 V DC-DC stage” — ask the agent to find available
        AIPE device data and selection tools relevant to your constraints.</p>
      </div>
      <div class="card">
        <h3>Size magnetics</h3>
        <p>“Size the transformer for a 100 kHz DAB” — ask the agent to locate magnetic design
        references, material data, and reusable workflows in the ecosystem.</p>
      </div>
      <div class="card">
        <h3>Compare topologies</h3>
        <p>“LLC or DAB for this spec?” — use the index to discover converter references and tools
        that support an efficiency, density, and control comparison.</p>
      </div>
      <div class="card">
        <h3>Estimate losses &amp; thermals</h3>
        <p>“Estimate losses at full load” — find relevant characterisation data, modelling packages,
        and thermal-analysis resources before carrying out the calculation.</p>
      </div>
      <div class="card">
        <h3>Learn from case studies</h3>
        <p>“How did AIPE Labs approach its 2 kW DAB?” — let the agent locate the published case study
        and any related design resources.</p>
      </div>
      <div class="card">
        <h3>Plan validation</h3>
        <p>“Draft a test plan for this converter” — find available measurement, sensing, and validation
        references to support a reviewable test plan.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 style="text-align:center;">Frequently asked questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What is the AIPE Labs resource link?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>It is a simple way to help an AI coding agent discover power electronics resources. One prompt points the agent at aipe.md, which links to the knowledge, tools, specialist agents, datasets, and engineering work that AIPE Labs publishes.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">How do I install it?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>There is nothing to install. Copy the prompt at the top of this page, paste it into Claude Code, Codex, or any AI coding agent with web access, and the agent loads the resources itself — no account, no API key, no configuration.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What is aipe.md?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>A Markdown index written for language models. It summarises everything AIPE Labs publishes — our skills, packages, and agents on GitHub, plus the databases and design references on this site — with a link and a one-line description for each, so an agent can navigate straight to what it needs.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Where do the skills and packages live?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>On our <a href="https://github.com/FulongLi" target="_blank">GitHub</a>. We are actively building power electronics packages, skills, and agents there — aipe.md always points to the latest, so your agent picks up new skills as soon as they are published.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does it work with agents other than Claude Code and Codex?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Yes. Any AI agent that can fetch a URL can use it — Claude Code, Codex, Cursor, or your own agent framework. The index is standard Markdown, so nothing about it is tool-specific.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does it cost anything?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. The index and linked open resources can be read inside your existing agent session. For collaboration around the full Power Electronics AI Agent — including physics-guided optimisation, control synthesis, and validation workflows — <a href="{{ '/contact/' | relative_url }}">get in touch</a>.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container" style="text-align:center;">
    <h2>Go further with the AI Agent</h2>
    <p class="lead" style="margin-inline:auto;">
      The open link helps your agent discover published resources. Our longer-term Power Electronics AI Agent
      brings those resources into physics-guided optimisation, control synthesis, and validation workflows.
    </p>
    <div class="hero-actions" style="margin-top:2rem;">
      <a class="btn btn-primary" href="{{ '/company/services/' | relative_url }}">Explore the AI Agent</a>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Contact us</a>
    </div>
  </div>
</section>
