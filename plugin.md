---
layout: default
title: AIPE Plugin — One Interface, Multiple Engineering Capabilities
permalink: /plugin/
description: Give Codex, Claude Code or another coding agent one prompt to discover AIPE's engineering agents, databases and tools, or use a standalone AIPE agent directly. An installable AIPE Plugin is planned.
image: /images/background/sst.png
---
{%- comment -%}
  Public product page with two sections: the unified AIPE Plugin entry point
  (today a capability-discovery prompt for aipe.md; installation and
  orchestration are planned) and the standalone agent cards from
  _data/agents.yml. Implementation detail lives in
  docs/aipe-plugin-architecture.md, not here.
{%- endcomment -%}
<main class="plugin-page">
<header class="plugin-hero">
  <div class="container">
    <span class="section-kicker">Use tools with coding agents</span>
    <h1>AIPE Plugin</h1>
    <p class="plugin-subtitle">One Interface. Multiple Engineering Capabilities.</p>
    <p class="lead">The goal is one interface through which your coding agent can discover and coordinate AIPE’s independent engineering agents, databases and tools.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#aipe-plugin">Start with one prompt</a>
      <a class="btn btn-ghost" href="#standalone">Standalone plugins</a>
    </div>
  </div>
</header>

<section class="section plugin-unified" id="aipe-plugin">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">AIPE Plugin</span><h2>Start with one prompt.</h2></div>
      <p>Paste this into Codex, Claude Code or another coding agent. It points the agent to <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a>, AIPE’s public, agent-readable index of engineering capabilities.</p>
    </div>
    <div class="agent-link plugin-prompt">
      <code id="aipe-plugin-prompt">Read https://aipel.co.uk/aipe.md, identify the AIPE engineering capabilities relevant to my task, and help me use the appropriate tools and agents.</code>
      <button class="copy-btn" type="button" data-copy-target="aipe-plugin-prompt" aria-live="polite">Copy prompt</button>
    </div>
    <div class="plugin-status">
      <div>
        <span class="plugin-status-label">Available now</span>
        <p><strong>Capability discovery</strong> {% include status-badge.html status='available' %}</p>
        <p>Your agent reads the index, finds the AIPE capabilities that fit your task and follows each one’s own documentation. Each tool is still set up on its own, as its repository describes.</p>
      </div>
      <div>
        <span class="plugin-status-label">Planned</span>
        <p><strong>Installable plugin and orchestration</strong> {% include status-badge.html status='planned' %}</p>
        <p>One installation that sets up AIPE agents and coordinates them across a task. In design: no plugin package has been released.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="standalone">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Standalone plugins</span><h2>Use one agent directly.</h2></div>
      <p>Each agent lives in its own repository. <strong>Copy prompt</strong> gives your coding agent an instruction to read that repository and use what it documents; it does not install anything.</p>
    </div>
    <div class="hub-project-grid">
      {%- for agent in site.data.agents %}
      {% include agent-plugin-card.html agent=agent lang='en' %}
      {%- endfor %}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title-centred">Frequently asked questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Which coding agents can use AIPE?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Any agent that can read a public web page and work in your project, including Codex and Claude Code. Some agents may ask for permission to access GitHub or run local commands.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does it send my project data to AIPE Labs?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Reading AIPE’s public pages and repositories does not send project files to AIPE Labs. Information entered into a third-party agent is handled under that provider’s terms and your organisation’s policies.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Can the output replace engineering review?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Every AIPE capability states its limitations. Use it to speed up discovery and analysis, then verify important results against original datasheets, models, standards, simulations and measurements.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Where are the technical details for developers?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Agents read <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a>; scripts can use the same index as <a href="{{ '/aipe.json' | relative_url }}"><code>aipe.json</code></a>. Each agent’s repository documents its own setup and checks.</p></div></div>
      </div>
    </div>
  </div>
</section>

{% include aipe-pathways.html current='plugin' lang='en' %}
</main>
