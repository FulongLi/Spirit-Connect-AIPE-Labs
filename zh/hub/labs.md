---
layout: hub
title: 实验 — AIPE Hub
lang: zh
permalink: /zh/hub/labs/
hub_category: labs
description: 来自 AIPE 学院、基于开源工具的可复现电力工程实验，以及接下来规划的实验。
---
<div class="hub-context-grid">
  <div>
    <span class="section-kicker">规划中的实验</span>
    <h2>接下来的实验</h2>
    <p>实验由 AIPE 学院发布。以下实验尚处于规划阶段、还不可用，因此没有提供链接。目前已发布的实验内容为英文。</p>
    <p><a href="{{ '/academy/#labs' | relative_url }}">前往学院的开放实验 →</a></p>
  </div>
  <ul class="hub-context-links hub-planned">
    {%- for lab in site.data.hub.planned_labs %}
    <li><span class="hub-planned-name">{{ lab.zh }}</span>{% include status-badge.html status='planned' lang='zh' %}</li>
    {%- endfor %}
  </ul>
</div>
