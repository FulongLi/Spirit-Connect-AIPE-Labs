---
layout: default
title: 在 Coding Agent 中使用 AIPE Labs
lang: zh
permalink: /zh/plugin/
description: 通过一条开放链接，让 Claude Code、Codex、Cursor 等 Coding Agent 发现 AIPE Labs 的电力电子知识、工具、专业智能体与工程工作流。
image: /images/background/sst.png
---

<header class="hero hero-compact">
  <div class="container">
    <span class="badge">无需安装 · 无需 API Key</span>
    <h1>在你的 Coding Agent 中使用 AIPE Labs</h1>
    <p class="lead">
      将下面的提示词输入 <strong>Claude Code</strong>、<strong>Codex</strong> 或任意 AI 编程智能体。
    </p>
    <div class="agent-link">
      <code id="agent-prompt">Read aipel.co.uk/aipe.md to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt" data-copied-label="已复制!">复制</button>
    </div>
    <p class="agent-steps">这是一份开放资源索引，不是需要安装的软件包。</p>
  </div>
</header>

<section class="section section-alt">
  <div class="container" style="text-align:center;">
    <h2>为什么在你的智能体中使用 AIPE Labs</h2>
    <p class="lead" style="margin-inline:auto;">
      大多数将领域数据引入 AI 工作流的方式，都意味着新应用、新账号和需要管理的 API 密钥。
      AIPE Labs 资源链接把这些全部省去。
    </p>
    <div class="grid" style="text-align:left;">
      <div class="card">
        <h3>一条提示词，零配置</h3>
        <p>无需生成、保存或管理任何 API 密钥。粘贴一条提示词，你的智能体即可直接读取我们的资源索引
        —— 几分钟内就能在你熟悉的智能体里开始设计。</p>
      </div>
      <div class="card">
        <h3>全部资源，一个连接</h3>
        <p>晶体管与磁性元件数据库、设计参考、原型案例研究，以及我们发布在
        <a href="https://github.com/FulongLi" target="_blank">GitHub</a> 上的技能与工具包 ——
        全部资源通过同一条链接触达。</p>
      </div>
      <div class="card">
        <h3>在现有智能体内工作</h3>
        <p>索引使用 Coding Agent 已有的联网能力。读取开放资源不需要额外登录、积分余额或 AIPE Labs 订阅。</p>
      </div>
    </div>
    <p class="lead" style="margin:3rem auto 0;">开始使用：将这条提示词粘贴到你的智能体中：</p>
    <div class="agent-link">
      <code id="agent-prompt-2">Read aipel.co.uk/aipe.md to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt-2" data-copied-label="已复制!">复制</button>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>AIPE Labs 能在你的智能体中做什么</h2>
    <p class="lead">
      从一项任务开始，让智能体通过索引发现当前已经发布的相关资源。
    </p>
    <div class="grid">
      <div class="card">
        <h3>器件选型</h3>
        <p>“为 10 kW、800 V 的 DC-DC 级筛选 SiC 器件” —— 让智能体找到与约束相关的 AIPE 器件数据和选型工具。</p>
      </div>
      <div class="card">
        <h3>磁性元件设计</h3>
        <p>“为 100 kHz 的 DAB 设计变压器” —— 让智能体在生态中定位磁性设计参考、材料数据与可复用工作流。</p>
      </div>
      <div class="card">
        <h3>拓扑对比</h3>
        <p>“这个规格选 LLC 还是 DAB？” —— 通过索引寻找支持效率、功率密度与控制对比的变换器资源。</p>
      </div>
      <div class="card">
        <h3>损耗与热估算</h3>
        <p>“估算满载损耗” —— 先找到相关的表征数据、建模工具包与热分析资源，再完成计算。</p>
      </div>
      <div class="card">
        <h3>借鉴案例研究</h3>
        <p>“AIPE Labs 的 2 kW DAB 是如何开展的？” —— 让智能体定位已发布的案例和相关设计资源。</p>
      </div>
      <div class="card">
        <h3>验证规划</h3>
        <p>“为这台变换器起草测试方案” —— 找到可用的测量、传感与验证参考，支持形成可审查的测试方案。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 style="text-align:center;">常见问题</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">什么是 AIPE Labs 资源链接？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>这是帮助 Coding Agent 发现电力电子资源的一种简单方式。一条提示词让智能体读取 aipe.md，再从中找到 AIPE Labs 已发布的知识、工具、专业智能体、数据与工程工作。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">如何安装？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>无需安装。复制本页顶部的提示词，粘贴到 Claude Code、Codex 或任意具备联网能力的 AI 编程智能体中，智能体会自行加载资源 —— 无需账号、无需 API 密钥、无需配置。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">aipe.md 是什么？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>一份为语言模型编写的 Markdown 索引。它汇总了 AIPE Labs 发布的一切 —— GitHub 上的技能、工具包与智能体，以及本网站上的数据库与设计参考 —— 每一项都附有链接与一句话说明，让智能体能直达所需内容。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">技能与工具包在哪里？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>在我们的 <a href="https://github.com/FulongLi" target="_blank">GitHub</a> 上。我们正在那里积极构建电力电子工具包、技能与智能体 —— aipe.md 始终指向最新内容，新技能一经发布，你的智能体即可使用。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">除了 Claude Code 和 Codex，其他智能体可以用吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>可以。任何能访问 URL 的 AI 智能体都能使用 —— Claude Code、Codex、Cursor，或你自己的智能体框架。索引采用标准 Markdown，不绑定任何工具。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">需要付费吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不需要。索引与开放资源可以直接在现有智能体会话中读取。若希望围绕完整的电力电子 AI 智能体开展合作 —— 包括物理引导优化、控制综合与验证工作流 —— 请<a href="{{ '/zh/contact/' | relative_url }}">联系我们</a>。</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container" style="text-align:center;">
    <h2>更进一步：AI 智能体</h2>
    <p class="lead" style="margin-inline:auto;">
      开放链接帮助智能体发现已经发布的资源。长期的电力电子 AI 智能体将在此之上，
      连接物理引导优化、控制综合与验证工作流。
    </p>
    <div class="hero-actions" style="margin-top:2rem;">
      <a class="btn btn-primary" href="{{ '/zh/company/services/' | relative_url }}">了解 AI 智能体</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">联系我们</a>
    </div>
  </div>
</section>
