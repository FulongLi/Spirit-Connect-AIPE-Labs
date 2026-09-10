---
layout: default
title: Blogs
permalink: /resources/blog/
description: Engineering notes, research updates, and ideas from the team building AI-assisted power electronics tools.
---

<header class="hero hero-compact">
  <div class="container">
    <h1>Blogs</h1>
    <p class="lead">
      Engineering notes, research updates, and ideas from the team building
      AI-assisted power electronics tools.
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <aside class="blog-series-intro">
      <h2>Learn to design a three-stage solid-state transformer</h2>
      <p>Follow one teaching system from applications and circuit principles through modelling, control, magnetic design and modular integration.</p>
      <a href="{% post_url 2026-09-10-three-stage-solid-state-transformer %}">Open the SST learning series →</a>
    </aside>
    {% if site.posts.size > 0 %}
    <div class="grid post-grid">
      {% for post in site.posts %}
      <a class="card post-card" href="{{ post.url | relative_url }}">
        <span class="small">{{ post.date | date: "%-d %B %Y" }}{% if post.author %} · {{ post.author }}{% endif %}</span>
        <h3>{{ post.title }}</h3>
        <p>{{ post.description | default: post.excerpt | strip_html | truncate: 150 }}</p>
        <span class="post-card-more">Read more →</span>
      </a>
      {% endfor %}
    </div>
    {% else %}
    <p class="lead">First posts are on the way — check back soon.</p>
    {% endif %}
  </div>
</section>
