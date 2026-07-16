---
layout: default
title: Claude Code/Codex Plugin
permalink: /plugin/
description: The AIPE Labs plugin for Claude Code and Codex — one prompt gives your AI coding agent access to power electronics databases, design references, and case studies.
---

<header class="hero hero-compact">
  <div class="container">
    <h1>AIPE Labs plugin for Claude Code &amp; Codex</h1>
    <p class="lead">
      Enter the prompt below into <strong>Claude Code</strong>, <strong>Codex</strong>, or any AI coding agent.
    </p>
    <div class="agent-link">
      <code id="agent-prompt">Read aipel.co.uk/aipe.txt to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt">Copy</button>
    </div>
    <div class="demo-panel">
      <video autoplay muted loop playsinline>
        <source src="{{ '/images/vids/main.mp4' | relative_url }}" type="video/mp4">
      </video>
    </div>
  </div>
</header>

<section class="section section-alt">
  <div class="container" style="text-align:center;">
    <h2>Why AIPE Labs in your agent</h2>
    <p class="lead" style="margin-inline:auto;">
      Most ways to bring domain data into an AI workflow mean a new app, new logins, and API keys to manage.
      The AIPE Labs plugin skips all of that.
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
        <h3>Runs on your agent's usage</h3>
        <p>The plugin works inside your Claude Code or Codex session and runs on the plan you
        already have — no separate credits and no extra subscription.</p>
      </div>
    </div>
    <p class="lead" style="margin:3rem auto 0;">To install, paste this into your agent:</p>
    <div class="agent-link">
      <code id="agent-prompt-2">Read aipel.co.uk/aipe.txt to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt-2">Copy</button>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>What can AIPE Labs do in your agent</h2>
    <p class="lead">
      Pick a job and your agent runs it with our data — no new app, no export, no context switch.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Shortlist devices</h3>
        <p>“Shortlist SiC devices for a 10 kW, 800 V DC-DC stage” — the agent searches our transistor
        database against your voltage, current, and thermal constraints.</p>
      </div>
      <div class="card">
        <h3>Size magnetics</h3>
        <p>“Size the transformer for a 100 kHz DAB” — core material options, Steinmetz parameters,
        and winding windows come straight from the magnetics database.</p>
      </div>
      <div class="card">
        <h3>Compare topologies</h3>
        <p>“LLC or DAB for this spec?” — the agent pulls our converter design references and lays out
        the efficiency, density, and control trade-offs.</p>
      </div>
      <div class="card">
        <h3>Estimate losses &amp; thermals</h3>
        <p>“Estimate losses at full load” — switching and conduction losses from characterisation data,
        with thermal limits checked against device ratings.</p>
      </div>
      <div class="card">
        <h3>Learn from case studies</h3>
        <p>“How did AIPE Labs design their 2 kW DAB?” — the agent walks through our validated
        prototype case studies and applies the same flow to your design.</p>
      </div>
      <div class="card">
        <h3>Plan validation</h3>
        <p>“Draft a test plan for this converter” — test matrices and measurement workflows modelled
        on our own lab validation practice.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 style="text-align:center;">Frequently asked questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What is the AIPE Labs plugin?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>It is the simplest way to bring power electronics knowledge into your AI coding agent. One prompt points the agent at our index file, aipe.txt, and from there it can reach our device and magnetics databases, design references, prototype case studies, and the skills and packages we publish on GitHub.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">How do I install it?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>There is nothing to install. Copy the prompt at the top of this page, paste it into Claude Code, Codex, or any AI coding agent with web access, and the agent loads the resources itself — no account, no API key, no configuration.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What is aipe.txt?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>A plain-text index written for language models. It summarizes everything AIPE Labs publishes — our skills, packages, and agents on GitHub, plus the databases and design references on this site — with a link and a one-line description for each, so an agent can navigate straight to what it needs.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Where do the skills and packages live?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>On our <a href="https://github.com/FulongLi" target="_blank">GitHub</a>. We are actively building power electronics packages, skills, and agents there — aipe.txt always points to the latest, so your agent picks up new skills as soon as they are published.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does it work with agents other than Claude Code and Codex?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Yes. Any AI agent that can fetch a URL can use it — Claude Code, Codex, Cursor, or your own agent framework. The index is plain text, so nothing about it is tool-specific.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does it cost anything?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. The plugin runs inside your existing agent session on the plan you already have. For the full Power Electronics AI Agent — physics-guided optimization, control synthesis, and validation workflows — <a href="{{ '/contact/' | relative_url }}">get in touch</a>.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container" style="text-align:center;">
    <h2>Go further with the AI Agent</h2>
    <p class="lead" style="margin-inline:auto;">
      The plugin gives your agent our data. The full Power Electronics AI Agent adds physics-guided
      optimization, control synthesis, and validation workflows on top.
    </p>
    <div class="hero-actions" style="margin-top:2rem;">
      <a class="btn btn-primary" href="{{ '/company/services/' | relative_url }}">Explore the AI Agent</a>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Contact us</a>
    </div>
  </div>
</section>
