---
layout: default
title: 在 Coding Agent 中使用 AIPE Labs
lang: zh
permalink: /zh/plugin/
description: 通过一条开放链接，让 Claude Code、Codex、Cursor 等 Coding Agent 发现 AIPE Labs 的电力电子知识、工具、专业智能体与工程工作流。
image: /images/background/sst.png
---

<main class="agent-guide">
<header class="hero hero-compact">
  <div class="container">
    <h1>在你的 Coding Agent 中使用 AIPE Labs</h1>
    <p class="lead">
      通过一条开放链接，让 <strong>Claude Code</strong>、<strong>Codex</strong>、Cursor
      或其他具备联网能力的 Coding Agent 发现 AIPE Labs 工程资源。
    </p>
    <div class="agent-link">
      <code id="agent-prompt">请阅读 https://aipel.co.uk/aipe.md，找到相关的 AIPE Labs 资源，并帮助我完成电力电子工程任务。</code>
      <button class="copy-btn" data-copy-target="agent-prompt" data-copied-label="已复制">复制</button>
    </div>
    <p class="agent-steps">将提示词粘贴到你现有的智能体中，然后描述工程任务。</p>
  </div>
</header>

<section class="section section-alt">
  <div class="container">
    <h2>为什么使用 AIPE 索引</h2>
    <p class="lead">
      这份索引为智能体提供一张稳定的资源地图，连接 AIPE Labs 已发布的知识、
      数据、设计参考、软件包与专业智能体。
    </p>
    <div class="grid">
      <div class="card">
        <h3>一条提示词，无需配置</h3>
        <p>读取公开资源无需 AIPE 账号、API Key、浏览器扩展或独立应用。</p>
      </div>
      <div class="card">
        <h3>资源保持连接</h3>
        <p>器件数据、磁性元件、变换器拓扑、原型设计参考与开源工具都通过同一份持续维护的索引连接。</p>
      </div>
      <div class="card">
        <h3>留在现有工作流中</h3>
        <p>任何能够读取公开 URL 的 Coding Agent 都可以使用，无需把项目迁移到另一个平台。</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>从一个工程问题开始</h2>
    <p class="lead">
      让智能体把索引作为资源地图，同时要求它明确说明假设、引用原始来源，
      并保持关键计算过程可以复核。
    </p>
    <div class="grid">
      <div class="card">
        <h3>筛选器件</h3>
        <p>“为 10&nbsp;kW、800&nbsp;V DC–DC 功率级筛选 SiC 器件，并说明选型约束。”</p>
      </div>
      <div class="card">
        <h3>设计磁性元件</h3>
        <p>“查找相关磁性材料数据，帮助我规划 100&nbsp;kHz DAB 变压器设计。”</p>
      </div>
      <div class="card">
        <h3>比较拓扑</h3>
        <p>“针对这个规格比较 LLC 与 DAB，包括功率流、隔离、软开关和控制方式。”</p>
      </div>
      <div class="card">
        <h3>估算损耗</h3>
        <p>“查找可用的表征与建模资源，然后组织一份能够复核的损耗计算。”</p>
      </div>
      <div class="card">
        <h3>规划仿真</h3>
        <p>“使用 AIPE 资源规划仿真或有限元工作流，并列出验证检查项。”</p>
      </div>
      <div class="card">
        <h3>准备验证</h3>
        <p>“起草变换器测试计划，覆盖测量、工况、保护、不确定性和通过标准。”</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title-centred">关于这个入口</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false"><span class="faq-q-label"><code>aipe.md</code> 是什么？</span><span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>它是 AIPE Labs 面向智能体的正式 Markdown 资源索引，介绍当前可用内容，并把智能体连接到相关工具、数据集、工程页面与代码仓库。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Claude/Codex 插件需要安装吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不需要。“插件”是导航中对这个智能体入口的名称。Coding Agent 会直接读取公开的 Markdown 索引，不需要安装浏览器扩展或软件包。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">哪些智能体可以使用？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>任何能访问公开 URL 的智能体都可以使用，包括 Claude Code、Codex、Cursor 以及具备联网能力的自定义智能体框架。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">读取索引会把项目数据发送给 AIPE Labs 吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不会。读取公开索引不会向 AIPE Labs 发送项目文件。你输入第三方智能体的信息仍由相应服务商条款和所在机构的政策管理。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">输出结果可以替代工程审核吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不可以。资源可以加速检索与分析，但重要输出仍应对照原始数据手册、模型、标准、仿真和测量结果进行验证。</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section collaboration-section agent-guide-cta">
  <div class="container narrow-center">
    <h2>把 AIPE 链接交给你的智能体</h2>
    <p class="lead">
      把准备好的提示词复制到你的 Coding Agent，或者联系我们讨论科研合作、工程试点与更深入的集成。
    </p>
    <div class="hero-actions">
      <button type="button" class="btn btn-primary" data-copy-target="agent-prompt" data-copied-label="已复制">复制 AIPE 提示词</button>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">联系我们</a>
    </div>
  </div>
</section>
</main>
