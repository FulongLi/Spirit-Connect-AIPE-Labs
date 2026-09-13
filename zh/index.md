---
layout: default
title: 面向电力工程的 AI 平台
lang: zh
permalink: /zh/
description: AIPE Labs 是面向电力工程的开放 AI 平台 —— 工程知识、数据库、工具、专业智能体与工作流，覆盖器件、磁性元件、变换器与系统。工程师通过本网站进入，Coding Agent 通过 aipe.md 进入。
image: /images/background/sst.png
---

<header class="hero home-hero">
  <div class="container">
    <h1>为 AI 供能的电力系统，由 AI 来设计</h1>
    <p class="lead">
      AIPE Labs 是面向<strong>电力工程的开放 AI 平台</strong>。
      它把工程知识、机器可读数据、工具、专业智能体与工作流整合在一起，
      让真实的工程任务可以端到端完成 —— 从半导体器件到变换器，再到电网。
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#agent-link">复制 AIPE 链接</a>
      <a class="btn btn-ghost" href="{{ '/zh/resources/' | relative_url }}">浏览全部资源</a>
    </div>

    <div class="workflow-panel" aria-label="Coding Agent 如何使用 AIPE Labs 能力索引">
      <div class="workflow-toolbar">
        <span class="workflow-brand"><span class="status-dot"></span> AIPE Labs 能力索引</span>
        <span class="workflow-status">开放 · 持续建设中</span>
      </div>
      <div class="workflow-prompt">
        <span class="workflow-label">你</span>
        <p>阅读 <strong>aipel.co.uk/aipe.md</strong>，找到合适的 AIPE 资源，帮助我分析一台 DAB 变换器。</p>
      </div>
      <div class="workflow-route" aria-hidden="true">
        <span>Coding Agent</span><b>→</b><span class="workflow-index">aipe.md</span><b>→</b><span>相关能力</span>
      </div>
      <div class="workflow-resources">
        <span>知识</span><span>数据库</span><span>工具</span>
        <span>智能体</span><span>工作流</span><span>设计参考</span>
      </div>
    </div>
  </div>
</header>

<section class="section section-alt agent-entry" id="agent-link">
  <div class="container">
    <h2 class="section-title-centred">同一个平台，两个入口</h2>
    <div class="grid grid-two">
      <div class="card entry-card">
        <span class="scope-kicker">面向工程师</span>
        <h3>本网站</h3>
        <p>
          按工程领域组织的工程知识、机器可读的数据库，以及可阅读、可质疑、可复用的设计参考。
        </p>
        <a class="text-link" href="{{ '/zh/resources/' | relative_url }}">浏览能力体系 →</a>
      </div>
      <div class="card entry-card">
        <span class="scope-kicker">面向 Coding Agent</span>
        <h3><code>aipe.md</code></h3>
        <p>
          同一套生态的纯 Markdown 索引：AIPE 掌握哪些知识，有哪些数据库、工具、智能体与工作流，
          以及它们之间的关系。无需账号、无需插件、不依赖封闭平台。
        </p>
        <div class="agent-link">
          <code id="agent-url">https://aipel.co.uk/aipe.md</code>
          <button class="copy-btn" data-copy-target="agent-url" data-copied-label="已复制!" aria-live="polite">复制链接</button>
        </div>
        <a class="text-link" href="{{ '/zh/plugin/' | relative_url }}">了解如何在 Coding Agent 中使用 →</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>AIPE 能帮你做什么？</h2>
    <p class="lead section-lead-spaced">
      平台按工程任务组织，而不是按学科分类。每张卡片都如实说明该任务目前由什么来支撑。
    </p>
    {% include capability-cards.html %}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>四个工程领域</h2>
    <p class="lead section-lead-spaced">
      知识、数据与能力都按同样的四个领域标注，因此器件层面的问题与系统层面的问题指向同一个资料库。
    </p>
    {% include domain-cards.html %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>平台是如何组织的</h2>
    <p class="lead section-lead-spaced">
      把这些层次区分开，工程任务才能由现成的部件组装出来。设计参考则是这种组合成果的证据。
    </p>
    <ol class="layer-flow">
      <li><strong>知识</strong><span>解释、公式与方法</span></li>
      <li><strong>数据库</strong><span>机器可读的工程数据</span></li>
      <li><strong>工具</strong><span>输入 → 运算 → 输出</span></li>
      <li><strong>智能体</strong><span>专业推理与编排</span></li>
      <li><strong>工作流</strong><span>一项完整的工程任务</span></li>
    </ol>
    <p class="small reference-note">
      各层的成熟度并不相同。数据库与知识已经公开；工具尚处早期；
      AIPE 专业智能体尚未发布。<a href="{{ '/zh/resources/' | relative_url }}">资源总览页面</a>
      标注了每一项的当前状态。
    </p>

    <h3 class="layer-outcome-heading">平台产出什么</h3>
    {% include resource-cards.html items=site.data.resources.design_references %}
    <p><a class="text-link" href="{{ '/zh/resources/design-references/' | relative_url }}">全部设计参考 →</a></p>
  </div>
</section>

<section class="section collaboration-section">
  <div class="container collaboration-layout">
    <div>
      <h2>今天就要有用，也要足够有野心</h2>
      <p class="lead">
        我们欢迎开发者使用或贡献资源，欢迎研究人员共同验证新的工程流程，也期待与企业、
        投资机构和战略合作伙伴一起建设下一代 AI 辅助电力工程平台。
      </p>
      <div class="hero-actions align-left">
        <a class="btn btn-primary" href="{{ '/zh/contact/' | relative_url }}">讨论合作</a>
        <a class="btn btn-ghost" href="https://github.com/AIPE-Labs" target="_blank" rel="noopener">查看开源项目 ↗</a>
      </div>
    </div>
    <div class="collaboration-list">
      <div><span>01</span><p><strong>开发者</strong><br>使用索引、测试资源，并贡献开放工具。</p></div>
      <div><span>02</span><p><strong>科研伙伴</strong><br>把研究方法和数据转化为可复现的智能体工作流。</p></div>
      <div><span>03</span><p><strong>产业与战略伙伴</strong><br>用真实工程问题验证技术，并共同塑造平台。</p></div>
    </div>
  </div>
</section>

{% include partners.html intro="连接人工智能、电力工程与能源系统研究的学术和产业合作关系。" %}
