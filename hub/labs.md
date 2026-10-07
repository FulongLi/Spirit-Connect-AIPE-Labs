---
layout: hub
title: Labs — AIPE Hub
lang: en
permalink: /hub/labs/
hub_category: labs
description: Reproducible power engineering labs from AIPE Academy, built on open tools, plus the labs planned next.
---
<div class="hub-context-grid">
  <div>
    <span class="section-kicker">Planned labs</span>
    <h2>What comes next</h2>
    <p>Labs are published by AIPE Academy. The labs below are proposed and not yet available, so none is linked.</p>
    <p><a href="{{ '/academy/#labs' | relative_url }}">Open labs in the Academy →</a></p>
  </div>
  <ul class="hub-context-links hub-planned">
    {%- for lab in site.data.hub.planned_labs %}
    <li><span class="hub-planned-name">{{ lab.en }}</span>{% include status-badge.html status='planned' lang='en' %}</li>
    {%- endfor %}
  </ul>
</div>
