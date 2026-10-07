---
layout: default
title: AIPE Plugin — Engineering Capabilities for Coding Agents
permalink: /plugin/
description: Bring AIPE power engineering capabilities into Codex, Claude Code and other coding agents. Available now through the agent-readable aipe.md Registry; an installable AIPE Plugin is planned.
image: /images/background/sst.png
---
{%- assign registry = site.data.registry.capabilities -%}
{%- assign rec_registry = registry | where: "id", "aipe.registry" | first -%}
{%- assign rec_core = registry | where: "id", "aipe.core" | first -%}
{%- assign rec_skills = registry | where: "id", "aipe.simulation-skills" | first -%}
<main class="agent-guide plugin-page">
<header class="plugin-hero">
  <div class="container">
    <span class="section-kicker">AIPE Plugin · Agent integration</span>
    <h1>Bring AIPE engineering capabilities into your coding agent.</h1>
    <p class="lead">A thin layer between your coding agent and the AIPE Registry: find the right data, tools and skills for the task, then work inside your own engineering project.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#codex">Use with Codex</a>
      <a class="btn btn-primary" href="#claude-code">Use with Claude Code</a>
      <a class="btn btn-ghost" href="{{ '/aipe.md' | relative_url }}">View AIPE Registry</a>
      <a class="btn btn-ghost" href="{{ rec_skills.repository }}" rel="noopener">Agent skills on GitHub ↗</a>
    </div>
    <div class="plugin-status">
      <div>
        <span class="plugin-status-label">Current</span>
        <p><strong>Agent-readable Registry via <code>aipe.md</code></strong> {% include status-badge.html status='available' %}</p>
        <p>Machine-readable index <code>aipe.json</code> and SKILL.md-based <a href="{{ '/hub/tools/' | relative_url }}">Simulation Skills</a>.</p>
      </div>
      <div>
        <span class="plugin-status-label">Next</span>
        <p><strong>Installable AIPE Plugin</strong> {% include status-badge.html status='planned' %}</p>
        <p>In design. No plugin package has been released yet, so there is nothing to install.</p>
      </div>
    </div>
  </div>
</header>

<section class="section section-alt" id="now">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Available now · zero install</span><h2>Give your agent one link.</h2></div>
      <p><code>aipe.md</code> is the public, agent-readable interface to the AIPE Registry, generated from validated capability manifests. Any agent that can fetch a URL can use it — no account, API key or extension.</p>
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
        <p class="plugin-note">Skill installation follows the Simulation Skills repository's own instructions.</p>
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

<section class="section" id="architecture">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Architecture</span><h2>Thin by design.</h2></div>
      <p>The plugin will route, discover, load and orchestrate. It will not copy AIPE repositories: each specialist repository remains the source of truth for its data, tools and skills. Until the plugin ships, <code>aipe.md</code> fills its place as the zero-install fallback.</p>
    </div>
    <ol class="plugin-stack">
      <li>
        <span class="plugin-layer">Your agent</span>
        <div><strong>Coding agent</strong><p>Codex, Claude Code or another agent working in your project.</p></div>
      </li>
      <li class="plugin-stack-planned">
        <span class="plugin-layer">Integration</span>
        <div><strong>AIPE Plugin</strong><p>Router · discovery · capability loader · orchestrator. Today: <code>aipe.md</code>.</p></div>
        {% include status-badge.html status='planned' %}
      </li>
      <li>
        <span class="plugin-layer">Discovery</span>
        <div><strong>{{ rec_registry.name }}</strong><p>{{ rec_registry.description }}</p></div>
        {% include status-badge.html status=rec_registry.maturity %}
      </li>
      <li>
        <span class="plugin-layer">Common language</span>
        <div><strong>{{ rec_core.name }}</strong><p>{{ rec_core.description }}</p></div>
        {% include status-badge.html status=rec_core.maturity %}
      </li>
      <li class="plugin-stack-base">
        <span class="plugin-layer">Capabilities</span>
        <div>
          <strong>Specialist repositories</strong>
          <p>
            {%- for category in site.data.hub.categories %}<a href="{{ category.url | relative_url }}">{{ category.title.en }}</a>{% unless forloop.last %} · {% endunless %}{% endfor -%}
          </p>
        </div>
      </li>
    </ol>
  </div>
</section>

<section class="section section-alt" id="next">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Next · planned</span><h2>The installable AIPE Plugin.</h2></div>
      <p>A proposed <code>AIPE-Plugin</code> repository, not yet created. These are the responsibilities it is being designed around; none of them is available as an installable package today.</p>
    </div>
    <div class="plugin-roles">
      <div><span>01</span><h3>Router</h3><p>Recognise the engineering task in the user's project and decide which AIPE capabilities could help.</p></div>
      <div><span>02</span><h3>Discovery layer</h3><p>Query the Registry for capabilities with matching type, domain, maturity and tool requirements.</p></div>
      <div><span>03</span><h3>Capability loader</h3><p>Load the specific skill, tool or dataset interface from its canonical repository at a pinned revision.</p></div>
      <div><span>04</span><h3>Orchestrator</h3><p>Sequence capabilities through Core engineering state, keeping assumptions and evidence reviewable.</p></div>
    </div>
    <ul class="plugin-principles">
      <li>Contains no copies of specialist repositories.</li>
      <li>Reads the same Registry as the website, <code>aipe.md</code> and <code>aipe.json</code>.</li>
      <li>Works inside the user's existing project and tools.</li>
      <li>States maturity and limitations before an agent relies on a capability.</li>
    </ul>
  </div>
</section>

<section class="section" id="capabilities">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">What an agent can reach today</span><h2>Registry capabilities.</h2></div>
      <p>Generated from the published <a href="{{ '/aipe.json' | relative_url }}">aipe.json</a>. Integration describes how far each capability maps onto AIPE Core: <code>native</code>, <code>mapped</code> or <code>none</code>.</p>
    </div>
    <div class="plugin-table-wrap">
      <table class="plugin-table">
        <thead><tr><th scope="col">Capability</th><th scope="col">Type</th><th scope="col">Maturity</th><th scope="col">Integration</th><th scope="col">Capabilities</th></tr></thead>
        <tbody>
          {%- for rec in registry %}
          <tr>
            <th scope="row"><a href="{{ rec.repository }}" rel="noopener">{{ rec.name }}</a><code>{{ rec.id }}</code></th>
            <td>{{ site.data.hub.type_labels[rec.type].en | default: rec.type }}</td>
            <td>{% include status-badge.html status=rec.maturity %}</td>
            <td>{{ rec.compatibility.integration }}</td>
            <td>{{ rec.capabilities | join: ", " }}</td>
          </tr>
          {%- endfor %}
        </tbody>
      </table>
    </div>
    <div class="plugin-tools">
      <h3>Tools covered by {{ rec_skills.name }}</h3>
      <p>Open-source tools are the default path; commercial workflows are optional and need their own licences.</p>
      <ul>
        {%- for tool in rec_skills.tools %}
        <li class="plugin-tool-{{ tool.licence_class }}"><a href="{{ tool.url }}" rel="noopener">{{ tool.name }}</a><span>{{ tool.licence_class | replace: '_', ' ' }}</span></li>
        {%- endfor %}
      </ul>
    </div>
  </div>
</section>

<section class="section section-alt" id="access">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">One ecosystem, three interfaces</span><h2>Human, agent and machine.</h2></div>
      <p>People browse the website, agents read <code>aipe.md</code>, and scripts read <code>aipe.json</code>. All three come from the same Registry, so they never disagree about what exists.</p>
    </div>
    {% include access-interfaces.html lang='en' %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title-centred">Frequently asked questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false"><span class="faq-q-label">What is <code>aipe.md</code>?</span><span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>It is the public, agent-readable interface to the AIPE Registry, generated from validated capability manifests. It lists each capability with its type, maturity, integration, licence, limitations and canonical repository. <code>aipe.json</code> carries the same information for machines.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Can I install the AIPE Plugin?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Not yet. The installable plugin is planned and no package has been released. Today your agent reads <code>aipe.md</code> directly, and individual Simulation Skills can be copied into a Codex skills directory as their repository describes.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Will the plugin bundle all AIPE repositories?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. The plugin is designed to stay thin: it discovers capabilities through the Registry and loads them from their canonical repositories. Databases, tools and skills keep evolving in their own repositories.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Which agents can use it?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Any agent that can retrieve a public URL can use <code>aipe.md</code>, including Codex, Claude Code, Cursor and custom agent frameworks with web access.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Does the index send my project data to AIPE Labs?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Reading the public index does not send project files to AIPE Labs. Information entered into a third-party agent is handled under that provider’s terms and your organisation’s policies.</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Can the output replace engineering review?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. Every Registry entry states its limitations. Use the capabilities to accelerate discovery and analysis, then verify important outputs against original datasheets, models, standards, simulations and measurements.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section collaboration-section agent-guide-cta">
  <div class="container narrow-center">
    <h2>Give your agent the AIPE link</h2>
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
