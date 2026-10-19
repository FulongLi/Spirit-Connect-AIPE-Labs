---
layout: hub
title: Workflows — AIPE Hub
lang: en
permalink: /hub/workflows/
hub_category: workflows
description: End-to-end power engineering workflows in the AIPE Hub — converter, solid-state transformer and current-sensing design references, and reproducible Academy labs built on open tools.
---
<div class="hub-context-grid">
  <div>
    <span class="section-kicker">Reference designs</span>
    <h2>Prototype design references</h2>
    <p>Reference designs collect the decisions behind a converter, magnetic component or measurement system so they can be reviewed and reused. Each page states which parts are analysis and which are hardware.</p>
    <span class="section-kicker">Planned labs</span>
    <h2>What comes next</h2>
    <p>Labs are published by AIPE Academy. The labs listed here are proposed and not yet available, so none is linked. <a href="{{ '/academy/#labs' | relative_url }}">Open labs in the Academy →</a></p>
  </div>
  <div>
    <ul class="hub-context-links">
      <li><a href="{{ '/resources/prototypes/' | relative_url }}">Prototype design references <span>The full collection</span></a></li>
      <li><a href="{{ '/hub/data/' | relative_url }}">Data &amp; Models <span>Netlists and scripts behind the tutorials</span></a></li>
      <li><a href="{{ '/contact/' | relative_url }}">Propose a design <span>Contribute a reference design</span></a></li>
    </ul>
    <ul class="hub-context-links hub-planned">
      {%- for lab in site.data.hub.planned_labs %}
      <li><span class="hub-planned-name">{{ lab.en }}</span>{% include status-badge.html status='planned' lang='en' %}</li>
      {%- endfor %}
    </ul>
  </div>
</div>
