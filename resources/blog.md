---
layout: default
title: Blog
permalink: /resources/blog/
description: Engineering notes, research updates, and ideas from the team building the Power Electronics AI Agent.
---

<header class="hero hero-compact">
  <div class="container">
    <h1>Blog</h1>
    <p class="lead">
      Engineering notes, research updates, and ideas from the team building
      the Power Electronics AI Agent.
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    {% if site.posts.size > 0 %}
    <div class="grid post-grid">
      {% for post in site.posts %}
      <a class="card post-card" href="{{ post.url | relative_url }}">
        <span class="small">{{ post.date | date: "%-d %B %Y" }}</span>
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
