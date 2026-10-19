---
layout: hub
title: 工作流 — AIPE Hub
lang: zh
permalink: /zh/hub/workflows/
hub_category: workflows
description: AIPE Hub 中端到端的电力工程工作流——变换器、固态变压器与电流传感参考设计，以及基于开源工具、可复现的学院实验。
---
<div class="hub-context-grid">
  <div>
    <span class="section-kicker">参考设计</span>
    <h2>原型设计参考</h2>
    <p>参考设计汇集了变换器、磁性元件或测量系统背后的设计决策，便于评审和复用。每个页面都说明了哪些部分属于分析、哪些属于硬件。</p>
    <span class="section-kicker">规划中的实验</span>
    <h2>接下来的实验</h2>
    <p>实验由 AIPE 学院发布。这里列出的实验尚处于规划阶段、还不可用，因此没有提供链接。目前已发布的实验内容为英文，首批中文实验正在规划中。<a href="{{ '/zh/academy/#labs' | relative_url }}">前往学院的开放实验 →</a></p>
  </div>
  <div>
    <ul class="hub-context-links">
      <li><a href="{{ '/zh/resources/prototypes/' | relative_url }}">原型设计参考 <span>完整集合</span></a></li>
      <li><a href="{{ '/zh/hub/data/' | relative_url }}">数据与模型 <span>教程背后的网表与脚本</span></a></li>
      <li><a href="{{ '/zh/contact/' | relative_url }}">提交设计 <span>贡献参考设计</span></a></li>
    </ul>
    <ul class="hub-context-links hub-planned">
      {%- for lab in site.data.hub.planned_labs %}
      <li><span class="hub-planned-name">{{ lab.zh }}</span>{% include status-badge.html status='planned' lang='zh' %}</li>
      {%- endfor %}
    </ul>
  </div>
</div>
