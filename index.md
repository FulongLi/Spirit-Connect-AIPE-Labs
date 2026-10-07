---
layout: default
title: AIPE — The Open Engineering Hub for Power and Energy
description: Discover, share and run engineering data, models, designs and AI workflows for power electronics and energy systems — for engineers and the coding agents they work with.
image: /images/background/sst.png
---
{%- assign hub = site.data.hub -%}
{%- assign featured = "" | split: "" -%}
{%- assign hub_count = 0 -%}
{%- for item in hub.artifacts -%}
  {%- if item.featured -%}{%- assign featured = featured | push: item -%}{%- endif -%}
  {%- if item.category != 'platform' -%}{%- assign hub_count = hub_count | plus: 1 -%}{%- endif -%}
{%- endfor -%}
{%- assign featured = featured | sort: "featured" -%}
{%- assign lesson_count = 0 -%}
{%- for candidate in site.pages -%}{%- if candidate.academy_page and candidate.lesson_status -%}{%- assign lesson_count = lesson_count | plus: 1 -%}{%- endif -%}{%- endfor -%}
{%- assign article_count = site.posts | where: "lang", "en" | size -%}

<header class="home-hub-hero">
  <div class="container">
    <span class="section-kicker">AIPE · AI for Power Engineering</span>
    <h1>The open engineering hub for power and energy.</h1>
    <p class="lead">Discover, share and run engineering data, models, designs and AI workflows.</p>
    {% include hub-search.html lang='en' id='home' suggestions=true %}
    <dl class="home-stats">
      <div><dt>Registry capabilities</dt><dd><a href="{{ '/aipe.md' | relative_url }}">{{ site.data.registry.capabilities.size }}</a></dd></div>
      <div><dt>Hub artifacts</dt><dd><a href="{{ '/hub/' | relative_url }}">{{ hub_count }}</a></dd></div>
      <div><dt>Academy lessons</dt><dd><a href="{{ '/academy/' | relative_url }}">{{ lesson_count }}</a></dd></div>
      <div><dt>Engineering articles</dt><dd><a href="{{ '/resources/blog/' | relative_url }}">{{ article_count }}</a></dd></div>
    </dl>
  </div>
</header>

<section class="section home-explore">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Explore AIPE</span><h2>Reusable engineering artifacts, not isolated projects.</h2></div>
      <p>Every artifact states its type, engineering domain, maturity and integration, so engineers and agents can judge what is ready to use and what is still being built.</p>
    </div>
    <div class="hub-category-grid">
      {%- for category in hub.categories %}{% include hub-category-card.html category=category index=forloop.index lang='en' %}{% endfor %}
    </div>
  </div>
</section>

<section class="section section-alt home-featured">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Featured artifacts</span><h2>Start with what exists today.</h2></div>
      <p>Maturity, integration and repository for Registry entries come directly from the published <a href="{{ '/aipe.json' | relative_url }}">aipe.json</a>. Nothing here is restated by hand. <a href="{{ '/hub/' | relative_url }}">Browse the whole Hub →</a></p>
    </div>
    <div class="artifact-grid artifact-grid-feed">
      {%- for item in featured %}{% include artifact-card.html item=item compact=true lang='en' %}{% endfor %}
    </div>
  </div>
</section>

<section class="section home-domains">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Two directions of discovery</span><h2>Search by what it is, or by where it applies.</h2></div>
      <p>The Hub sorts artifacts by type. <a href="{{ '/engineering/' | relative_url }}">Engineering</a> sorts the same artifacts by domain, from the semiconductor die to the energy system. Empty cells mark where the hub has not grown yet.</p>
    </div>
    {% include domain-matrix.html lang='en' %}
  </div>
</section>

<section class="section section-alt home-academy">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">AIPE Academy</span><h2>Learn power electronics from first principles to AI-assisted engineering.</h2></div>
      <p>A staged curriculum with open labs. Each stage shows which lessons are outlines, drafts or available. <a href="{{ '/academy/' | relative_url }}">Open the Academy →</a></p>
    </div>
    <ol class="home-stages">
      {%- for stage in site.data.academy.stages %}
      <li><a href="{{ '/academy/#stage-' | append: stage.key | relative_url }}"><span>{{ stage.number }}</span><strong>{{ stage.title }}</strong><em>{{ stage.topics | join: ' · ' }}</em></a></li>
      {%- endfor %}
      <li><a href="{{ '/academy/#labs' | relative_url }}"><span>Lab</span><strong>Open labs</strong><em>Predict · run · compare · explain</em></a></li>
    </ol>
  </div>
</section>

<section class="section home-access" id="agent-link">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Not only for humans</span><h2>One ecosystem. Human, agent and machine interfaces.</h2></div>
      <p>The website, the agent-readable <code>aipe.md</code> and the machine-readable <code>aipe.json</code> are generated from the same Registry. Give a coding agent one link today; an installable <a href="{{ '/plugin/' | relative_url }}">AIPE Plugin</a> is next.</p>
    </div>
    <div class="agent-link home-agent-link">
      <code id="agent-url">https://aipel.co.uk/aipe.md</code>
      <button class="copy-btn" data-copy-target="agent-url" aria-live="polite">Copy link</button>
    </div>
    {% include access-interfaces.html lang='en' %}
  </div>
</section>

<section class="section section-alt home-loop">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">The AI that designs the power systems that power AI</span><h2>Closing the AI–power design loop.</h2></div>
      <p>Specialist repositories stay the source of truth. The Registry makes them discoverable, Core gives them a common engineering language, and results from simulation, hardware and validation return to the hub as data.</p>
    </div>
    {% include ecosystem-loop.html lang='en' %}
  </div>
</section>

<section class="section collaboration-section">
  <div class="container collaboration-layout">
    <div>
      <h2>Built in the open — and ambitious enough to grow</h2>
      <p class="lead">
        We welcome developers who want to publish or improve artifacts, researchers who want to
        turn methods and datasets into reusable workflows, and companies or strategic partners
        building the next generation of AI-assisted power engineering.
      </p>
      <div class="hero-actions align-left">
        <a class="btn btn-primary" href="{{ '/contact/' | relative_url }}">Discuss a collaboration</a>
        <a class="btn btn-ghost" href="https://github.com/AIPE-Labs" target="_blank" rel="noopener">Explore the open-source work ↗</a>
      </div>
    </div>
    <div class="collaboration-list">
      <div><span>01</span><p><strong>Developers</strong><br>Describe an artifact with an <code>aipe.yaml</code> manifest so the Registry can make it discoverable to people and agents.</p></div>
      <div><span>02</span><p><strong>Research partners</strong><br>Turn methods and datasets into repeatable, evidence-linked workflows.</p></div>
      <div><span>03</span><p><strong>Industry &amp; strategic partners</strong><br>Pilot the platform on real engineering problems and help shape it.</p></div>
    </div>
  </div>
</section>

<section class="section section-alt partners-section">
  <div class="container">
    <h2>Partners &amp; collaborations</h2>
    <p>Academic and industrial relationships supporting our work across AI, power electronics, and energy systems.</p>
    {% include partners-marquee.html %}
  </div>
</section>
