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
{%- for candidate in site.pages -%}{%- if candidate.academy_page and candidate.lesson_status and candidate.lang == 'en' -%}{%- assign lesson_count = lesson_count | plus: 1 -%}{%- endif -%}{%- endfor -%}
{%- assign article_count = site.posts | where: "lang", "en" | size -%}

<header class="home-hub-hero">
  <div class="container">
    <span class="section-kicker">AIPE · AI for Power Engineering</span>
    <h1>The open engineering hub for power and energy.</h1>
    <p class="lead">Discover, share and run engineering data, models, designs and AI workflows.</p>
    {% include hub-search.html lang='en' id='home' suggestions=true %}
    <dl class="home-stats">
      <div><dt>Hub artifacts</dt><dd><a href="{{ '/hub/' | relative_url }}">{{ hub_count }}</a></dd></div>
      <div><dt>Academy lessons</dt><dd><a href="{{ '/academy/' | relative_url }}">{{ lesson_count }}</a></dd></div>
      <div><dt>Engineering articles</dt><dd><a href="{{ '/resources/blog/' | relative_url }}">{{ article_count }}</a></dd></div>
      <div><dt>Engineering domains</dt><dd><a href="{{ '/engineering/' | relative_url }}">{{ hub.domains.size }}</a></dd></div>
    </dl>
  </div>
</header>

<section class="section home-explore">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">Explore AIPE</span><h2>Reusable engineering artifacts, not isolated projects.</h2></div>
      <p>Every artifact states its type, engineering domain and maturity, so you can see what is ready to use and what is still being built.</p>
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
      <p>Datasets, models, designs, tools and labs you can open, run and build on today. Each card shows how mature it is. <a href="{{ '/hub/' | relative_url }}">Browse the whole Hub →</a></p>
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
      <li><a href="{{ '/academy/#stage-' | append: stage.key | relative_url }}"><span>{{ stage.number }}</span><strong>{{ stage.title.en }}</strong><em>{{ stage.topics.en | join: ' · ' }}</em></a></li>
      {%- endfor %}
      <li><a href="{{ '/academy/#labs' | relative_url }}"><span>Lab</span><strong>Open labs</strong><em>Predict · run · compare · explain</em></a></li>
    </ol>
  </div>
</section>

<section class="section home-plugin" id="plugin">
  <div class="container home-plugin-layout">
    <div>
      <span class="section-kicker">AIPE Plugin</span>
      <h2>Use AIPE from your coding agent.</h2>
      <p class="lead">Bring AIPE data, engineering tools, simulation skills and design workflows into Codex, Claude Code or another coding agent, and work inside your own project.</p>
    </div>
    <div class="home-plugin-actions">
      <p><strong>Available now</strong> without installing anything. <strong>Coming next:</strong> an installable AIPE Plugin.</p>
      <a class="btn btn-primary" href="{{ '/plugin/' | relative_url }}">Explore AIPE Plugin</a>
    </div>
  </div>
</section>

<section class="section section-alt home-loop">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">The AI that designs the power systems that power AI</span><h2>Closing the AI–power design loop.</h2></div>
      <p>AI helps engineers design better power and energy systems, and those systems power the AI that comes next. Every project that learns, designs and validates in the open leaves better data, models and designs for the next one.</p>
    </div>
    {% include design-loop.html lang='en' %}
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
      <div><span>01</span><p><strong>Developers</strong><br>Publish or improve a dataset, model, design or tool so other engineers — and their agents — can find and reuse it.</p></div>
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
