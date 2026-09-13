---
layout: default
title: 设计参考
lang: zh
permalink: /zh/resources/design-references/
description: 使用 AIPE 能力完成的工程案例 —— 变换器、固态变压器与电力电子测量设计参考。
---

<header class="hero hero-compact">
  <div class="container">
    <h1>设计参考</h1>
    <p class="lead">
      使用 AIPE 能力完成的工程案例。每一项都标明所涉及的工程领域与推进程度 ——
      解析分析、仿真还是硬件 —— 便于作为证据来判断，而不是当作宣传来阅读。
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    {% include resource-cards.html items=site.data.resources.design_references %}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>设计参考的作用</h2>
    <p class="lead section-lead-spaced">
      设计参考不是产品页面，而是一条工程路径的完整记录，写得足够明确，
      让你既可以沿着同样的路径走一遍，也可以对它提出质疑。
    </p>
    <div class="grid">
      <div class="card">
        <h3>写清输入条件</h3>
        <p>规格、工作点与假设都写在开头，因此结论可以对照它所依据的工况来复核。</p>
      </div>
      <div class="card">
        <h3>展示完整流程</h3>
        <p>需求、拓扑、器件选型、磁性元件、建模、控制与验证，按工程师实际遇到的顺序呈现。</p>
      </div>
      <div class="card">
        <h3>如实标注成熟度</h3>
        <p>解析分析、仿真与台架实测分别标注。计划中的工作绝不会写成已完成的结果。</p>
      </div>
    </div>
    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/zh/resources/' | relative_url }}">查看能力体系</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">讨论设计需求</a>
    </div>
  </div>
</section>
