---
layout: default
title: AIPE Plugin — Engineering Capabilities for Coding Agents
permalink: /plugin/
description: Use AIPE data, engineering tools, simulation skills and design workflows directly from Codex, Claude Code or another coding agent. Available today without installing anything; an installable AIPE Plugin is coming next.
image: /images/background/sst.png
---
{%- comment -%}
  Public product page. Implementation detail (Registry, Core, router, loader,
  orchestrator) lives in docs/aipe-plugin-architecture.md, not here.
{%- endcomment -%}
{%- assign registry = site.data.registry.capabilities -%}
{%- assign rec_skills = registry | where: "id", "aipe.simulation-skills" | first -%}
{%- assign rec_site = registry | where: "id", "aipe.presentation" | first -%}
<main class="agent-guide plugin-page">
<header class="plugin-hero">
  <div class="container">
    <span class="section-kicker">AIPE Plugin</span>
    <h1>Bring AIPE engineering capabilities into your coding agent.</h1>
    <p class="lead">Use AIPE data, engineering tools, simulation skills and design workflows directly from Codex, Claude Code, or another coding agent.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#codex">Use with Codex</a>
      <a class="btn btn-primary" href="#claude-code">Use with Claude Code</a>
      <a class="btn btn-ghost" href="{{ rec_skills.repository }}" rel="noopener">View on GitHub ↗</a>
    </div>
    <p class="plugin-status-note" id="status"><span id="next"></span>Use the public index today. The installable plugin is still in design. <a href="#future">View the plan →</a></p>
  </div>
</header>

<nav class="hub-tabs section-tabs" aria-label="Plugin sections">
  <div class="container">
    <a href="#codex">Codex</a>
    <a href="#claude-code">Claude Code</a>
  </div>
</nav>

<section class="section" id="now">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">How to use AIPE today</span><h2>Start with one prompt.</h2></div>
      <p>Paste this into your coding agent. It points the agent to AIPE’s agent-readable index, <code>aipe.md</code>, so it can find the right capabilities for your task.</p>
    </div>
    <div class="agent-link plugin-prompt">
      <code id="agent-prompt">Read https://aipel.co.uk/aipe.md, find the relevant AIPE capabilities, and help me with my power electronics task.</code>
      <button class="copy-btn" data-copy-target="agent-prompt">Copy</button>
    </div>
    <div class="plugin-agents">
      <article class="plugin-agent" id="codex">
        <span class="access-kicker">Use with Codex</span>
        <h3>Codex</h3>
        <ol>
          <li>Paste the prompt above into Codex, then describe your engineering task.</li>
          <li>For simulation, CAD, PCB or field-analysis work, copy the skill folder you need from <a href="{{ rec_skills.repository }}" rel="noopener">AIPE Simulation Skills</a> into your Codex skills directory.</li>
          <li>Invoke it by name, for example <code>$pe-ltspice-power-electronics</code>, and give it the topology, operating range and what you are trying to prove.</li>
        </ol>
        <p class="plugin-note">Skill installation follows the Simulation Skills repository’s own instructions.</p>
      </article>
      <article class="plugin-agent" id="claude-code">
        <span class="access-kicker">Use with Claude Code</span>
        <h3>Claude Code</h3>
        <ol>
          <li>Paste the prompt above into Claude Code, then describe your engineering task.</li>
          <li>Ask it to read the <code>SKILL.md</code> and only the relevant <code>references/</code> of the Simulation Skill that matches your tool.</li>
          <li>Keep calculations reviewable: ask for stated assumptions, original sources and the checks it ran.</li>
        </ol>
        <p class="plugin-note">Skills use the same <code>SKILL.md</code> folder structure, but AIPE has not yet validated installing them as Claude Code skills.</p>
      </article>
    </div>
  </div>
</section>

<section class="section" id="capabilities">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">What it can access</span><h2>Engineering capabilities, ready for your agent.</h2></div>
      <p>Each area lists the AIPE projects behind it and how mature they are, so you know what to rely on and what to check.</p>
    </div>
    {% include plugin-capabilities.html lang='en' %}
  </div>
</section>

<section class="section plugin-future-section" id="future">
  <div class="container"><details class="editorial-details"><summary>Coming next: the installable AIPE Plugin</summary>
    <div class="hub-section-heading">
      <div><span class="section-kicker">Coming next</span><h2>The installable AIPE Plugin.</h2></div>
      <p>Install it once, and your agent will recognise the engineering task in your project, bring in the matching AIPE capabilities at a fixed version, and keep assumptions and evidence open for review. It stays lightweight: data, tools and skills keep evolving in their own projects.</p>
    </div>
    <ul class="plugin-promises">
      <li>Works inside your existing project and tools.</li>
      <li>States how mature each capability is before your agent relies on it.</li>
      <li>Keeps calculations, sources and checks reviewable.</li>
      <li>Loads each capability from where it is maintained, rather than bundling copies.</li>
    </ul>
  </details></div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title-centred">Frequently asked questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Can I install the AIPE Plugin?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Not yet. The installable plugin is in design and no package has been released. Today you can give your agent the prompt above, and copy individual Simulation Skills into a Codex skills directory as their repository describes.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Which agents can use AIPE?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Any agent that can read a public web page, including Codex, Claude Code, Cursor and custom agent frameworks with web access.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does it send my project data to AIPE Labs?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Reading AIPE’s public pages does not send project files to AIPE Labs. Information entered into a third-party agent is handled under that provider’s terms and your organisation’s policies.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Can the output replace engineering review?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Every AIPE capability states its limitations. Use it to speed up discovery and analysis, then verify important results against original datasheets, models, standards, simulations and measurements.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Where are the technical details for developers?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Agents read the index at <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a>, and scripts can use the same information as <a href="{{ '/aipe.json' | relative_url }}"><code>aipe.json</code></a>. The proposed plugin design is described in the <a href="{{ rec_site.repository }}/blob/main/docs/aipe-plugin-architecture.md" rel="noopener">architecture notes on GitHub</a>.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section collaboration-section agent-guide-cta">
  <div class="container narrow-center">
    <h2>Try AIPE with your coding agent</h2>
    <p class="lead">
      Copy the prepared prompt into your coding agent, or contact us to discuss research collaboration,
      engineering pilots and early work on the AIPE Plugin.
    </p>
    <div class="hero-actions">
      <button type="button" class="btn btn-primary" data-copy-target="agent-prompt">Copy AIPE prompt</button>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Contact us</a>
    </div>
  </div>
</section>
</main>
