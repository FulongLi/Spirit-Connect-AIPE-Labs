---
layout: default
title: 资源总览
lang: zh
permalink: /zh/resources/
description: AIPE 能力体系 —— 面向电力工程的工程知识、数据库、工具、专业智能体、工作流与设计参考。
---

<header class="hero hero-compact">
  <div class="container">
    <h1>资源总览</h1>
    <p class="lead">
      AIPE 公开的全部资源，按照平台自身的结构排列：底层是知识与数据，上层是工具与智能体，
      由工作流把它们串联起来，再用设计参考展示最终结果。
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>各层之间的关系</h2>
    <p class="lead section-lead-spaced">
      每一层承担不同的职责。把它们区分清楚，工程任务才能由现成的部件组装出来，而不是每次从头重做。
    </p>
    <ol class="layer-list">
      <li><strong>知识</strong> —— 工程解释、设计公式、测试方法与标准，按工程领域组织。</li>
      <li><strong>数据库</strong> —— 同一套工程事实的机器可读形式：曲线、曲面、损耗模型与热网络，并附带测试条件。</li>
      <li><strong>工具</strong> —— 每个工具完成一项明确的操作：输入、运算、输出。</li>
      <li><strong>智能体</strong> —— 专业推理能力，读取知识、查询数据库、调用工具，并判断结果是否合理。</li>
      <li><strong>工作流</strong> —— 由以上各层组合而成的完整工程任务。</li>
      <li><strong>设计参考</strong> —— 展示这些能力组合后实际产出的工程案例。</li>
    </ol>
    <p class="small reference-note">
      下面每一项都标注了成熟度。<em>可用</em>表示现在即可使用；<em>实验阶段</em>表示尚早、接口与结果可能变化；
      <em>文档说明</em>表示它以工程参考资料的形式存在，而不是可直接执行的能力。
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>知识</h2>
    <p class="lead">覆盖四个工程领域，从开关器件一直到电网。</p>
    {% include domain-cards.html %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>数据库</h2>
    <p class="lead">
      基础工程数据。数据库不是零散的“资源”，而是工具、智能体与工作流用来把需求变成具体数值的依据。
    </p>
    {% include resource-cards.html items=site.data.resources.databases %}
    <p><a class="text-link" href="{{ '/zh/resources/databases/' | relative_url }}">浏览数据库目录 →</a></p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>工具</h2>
    <p class="lead">工具完成一项明确的工程操作，并给出可以复核的结果。</p>
    {% include resource-cards.html items=site.data.resources.tools %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>智能体</h2>
    <p class="lead">
      承担专业工程角色 —— 器件选型、磁性元件、控制、热设计、验证、文档 —— 并协调知识、数据与工具。
    </p>
    {% include resource-cards.html items=site.data.resources.agents %}
    <p class="small reference-note">
      AIPE 专业智能体尚未发布。在此之前，你可以让自己的 Coding Agent 读取能力索引
      <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a>
      （<a href="{{ '/zh/plugin/' | relative_url }}">使用方法</a>），
      直接使用这里公开的知识、数据与设计参考。
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>工作流</h2>
    <p class="lead">
      工作流把各层连成完整的工程任务：需求、拓扑、器件选型、磁性元件、建模、控制、仿真、热设计、制造与验证。
    </p>
    {% include resource-cards.html items=site.data.resources.workflows %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>设计参考</h2>
    <p class="lead">使用 AIPE 能力完成的工程案例。</p>
    {% include resource-cards.html items=site.data.resources.design_references %}
    <p><a class="text-link" href="{{ '/zh/resources/design-references/' | relative_url }}">全部设计参考 →</a></p>
  </div>
</section>

<section class="section section-alt">
  <div class="container narrow-center">
    <h2>工程笔记</h2>
    <p class="lead">
      上述资源背后的推导、测量与系列教程 —— 变换器拓扑、器件表征、磁性元件与系统集成。
    </p>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/zh/resources/blog/' | relative_url }}">阅读工程笔记</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">贡献资源</a>
    </div>
  </div>
</section>
