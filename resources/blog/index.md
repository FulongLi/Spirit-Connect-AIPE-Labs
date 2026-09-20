---
layout: default
title: Blogs
lang: en
permalink: /resources/blog/
description: Engineering notes, research updates, and ideas from the team building AI-assisted power electronics tools.
translation_key: blog-index
---

{% assign english_posts = site.posts | where: "lang", "en" %}
{% assign featured_post = english_posts.first %}
{% assign converter_posts = english_posts | where: "converter_series", true %}
{% assign device_posts = english_posts | where: "device_testing_series", true %}
{% assign sst_posts = english_posts | where: "sst_series", true %}
{% assign wpt_posts = english_posts | where: "wpt_series", true %}
{% assign update_posts = english_posts | where_exp: "post", "post.converter_series != true" %}
{% assign update_posts = update_posts | where_exp: "post", "post.device_testing_series != true" %}
{% assign update_posts = update_posts | where_exp: "post", "post.sst_series != true" %}
{% assign update_posts = update_posts | where_exp: "post", "post.wpt_series != true" %}

<header class="blog-hero">
  <div class="container blog-hero-grid">
    <div>
      <span class="section-kicker">Engineering library</span>
      <h1>Ideas built from first principles.</h1>
    </div>
    <p class="lead">Deep technical guides for engineers working across converters, semiconductor devices, solid-state transformers and wireless power.</p>
  </div>
</header>

{% if featured_post %}
<section class="section blog-featured-section">
  <div class="container">
    <a class="blog-featured" href="{{ featured_post.url | relative_url }}">
      <div class="blog-featured-copy">
        <span class="blog-featured-label">Latest article · {{ featured_post.date | date: "%-d %B %Y" }}</span>
        <h2>{{ featured_post.title }}</h2>
        <p>{{ featured_post.description }}</p>
        <span class="blog-featured-link">Read the latest article →</span>
      </div>
      <div class="blog-featured-visual" aria-hidden="true">
        <span>AIPE</span>
        <strong>Engineering<br>notes</strong>
        <small>Device · Converter · System</small>
      </div>
    </a>
  </div>
</section>
{% endif %}

<section class="section section-alt blog-library">
  <div class="container">
    <div class="blog-library-intro">
      <div>
        <span class="section-kicker">Browse by series</span>
        <h2>A growing technical library</h2>
      </div>
      <p>{{ english_posts.size }} articles, organised by the engineering problem they help you understand.</p>
    </div>
    <nav class="blog-series-nav" aria-label="Blog series">
      <a href="#converter-series"><strong>{{ converter_posts.size }}</strong><span>Converter design</span></a>
      <a href="#device-series"><strong>{{ device_posts.size }}</strong><span>Device testing</span></a>
      <a href="#sst-series"><strong>{{ sst_posts.size }}</strong><span>Solid-state transformers</span></a>
      <a href="#wpt-series"><strong>{{ wpt_posts.size }}</strong><span>Wireless power</span></a>
      <a href="#updates"><strong>{{ update_posts.size }}</strong><span>AIPE updates</span></a>
    </nav>

    {% include blog-series-section.html id="converter-series" kicker="01 · From switching cycle to control" title="Converter design" description="Topology, modelling, magnetics, control and simulation for practical power converters." posts=converter_posts lang=page.lang %}
    {% include blog-series-section.html id="device-series" kicker="02 · Measure what the device is doing" title="Device testing and reliability" description="Electrical, thermal and reliability methods for power semiconductor characterisation." posts=device_posts lang=page.lang %}
    {% include blog-series-section.html id="sst-series" kicker="03 · Join the conversion stages" title="Solid-state transformers" description="Architecture, isolation, control and system integration for modular SSTs." posts=sst_posts lang=page.lang %}
    {% include blog-series-section.html id="wpt-series" kicker="04 · Transfer power across a gap" title="Wireless power transfer" description="Coupling, compensation and system design from phones to vehicles and underwater systems." posts=wpt_posts lang=page.lang %}
    {% include blog-series-section.html id="updates" kicker="05 · Building in public" title="AIPE Labs updates" description="Notes on the tools and open resources being developed across the AIPE Labs ecosystem." posts=update_posts lang=page.lang %}
  </div>
</section>
