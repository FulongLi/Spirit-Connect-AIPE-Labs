---
layout: default
title: 面向 Coding Agent 的电力电子 AI 开放资源
lang: zh
permalink: /zh/
description: 通过一条链接，让 Claude Code、Codex、Cursor 等 Coding Agent 接入 AIPE Labs 的电力电子开放知识、工具、专业智能体与工程工作流。
image: /images/background/sst.png
---

<header class="hero home-hero">
  <div class="container">
    <span class="badge">电力电子 AI 智能体</span>
    <h1>为 AI 供能的电力系统，由 AI 来设计</h1>
    <p class="lead">
      我们正在打造电力电子 AI 智能体，让智能系统设计与为其供能的能源基础设施形成闭环
      —— 从半导体器件到变换器，再到电网。
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#agent-link">复制 AIPE 链接</a>
      <a class="btn btn-ghost" href="https://github.com/FulongLi" target="_blank" rel="noopener">查看开源项目 ↗</a>
    </div>

    <div class="workflow-panel" aria-label="Coding Agent 如何使用 AIPE Labs 资源索引">
      <div class="workflow-toolbar">
        <span class="workflow-brand"><span class="status-dot"></span> AIPE Labs 资源图谱</span>
        <span class="workflow-status">开放 · 持续建设中</span>
      </div>
      <div class="workflow-prompt">
        <span class="workflow-label">你</span>
        <p>阅读 <strong>aipel.co.uk/aipe.txt</strong>，找到合适的 AIPE 资源，帮助我分析一台 DAB 变换器。</p>
      </div>
      <div class="workflow-route" aria-hidden="true">
        <span>Coding Agent</span><b>→</b><span class="workflow-index">aipe.txt</span><b>→</b><span>相关资源</span>
      </div>
      <div class="workflow-resources">
        <span>仿真</span><span>有限元分析</span><span>器件</span>
        <span>磁性元件</span><span>变换器</span><span>验证</span>
      </div>
    </div>
  </div>
</header>

<section class="section section-alt agent-entry" id="agent-link">
  <div class="container narrow-center">
    <span class="badge">免费 · 开放 · 无需 API Key</span>
    <h2>一条链接，就是整个生态的入口</h2>
    <p class="lead">
      <code>aipe.txt</code> 是一份专门为 AI 智能体编写的纯文本索引。它帮助智能体根据当前任务，
      找到最相关的 AIPE Labs 资源；不需要安装新应用、注册账号，也不受封闭平台限制。
    </p>
    <div class="agent-link">
      <code id="agent-url">https://aipel.co.uk/aipe.txt</code>
      <button class="copy-btn" data-copy-target="agent-url" data-copied-label="已复制!" aria-live="polite">复制链接</button>
    </div>
    <p class="agent-steps">把链接粘贴给你的 Coding Agent，然后直接描述你想完成的工程任务。</p>
    <div class="prompt-grid">
      <div class="prompt-card"><span>仿真</span><p>“找到可用的 AIPE 资源，帮助我建立并检查这台变换器的仿真模型。”</p></div>
      <div class="prompt-card"><span>有限元分析</span><p>“使用 AIPE 索引，帮我规划磁场或热场有限元分析流程。”</p></div>
      <div class="prompt-card"><span>设计与验证</span><p>“根据这个规格，找到相关的器件、磁性元件、控制与验证资源。”</p></div>
    </div>
    <a class="text-link" href="{{ '/zh/plugin/' | relative_url }}">了解如何在 Coding Agent 中使用 AIPE →</a>
  </div>
</section>

<section class="section">
  <div class="container">
    <span class="section-badge">开放建设</span>
    <h2>从开放索引，逐步走向完整的工程智能体</h2>
    <p class="lead">
      产品从开发者今天就能使用的开放资源开始。随着新工具、专业智能体、数据集和经过验证的
      工程流程持续发布，整个生态也会不断成长。
    </p>
    <div class="grid roadmap-grid">
      <div class="card roadmap-card">
        <span class="roadmap-state state-live">现在可用</span><span class="roadmap-number">01</span>
        <h3>开放资源索引</h3>
        <p><code>aipe.txt</code> 为 Coding Agent 提供一个稳定入口，连接 AIPE Labs 的知识与开源生态。</p>
      </div>
      <div class="card roadmap-card">
        <span class="roadmap-state state-growing">持续建设中</span><span class="roadmap-number">02</span>
        <h3>工具与专业智能体</h3>
        <p>把仿真、有限元、器件、磁性元件、变换器与验证资源，逐步组织成可复用的智能体工作流。</p>
      </div>
      <div class="card roadmap-card">
        <span class="roadmap-state state-vision">长期平台</span><span class="roadmap-number">03</span>
        <h3>电力电子 AI 智能体</h3>
        <p>一个贯通器件、变换器与系统的物理引导设计伙伴，与研究机构和产业伙伴共同建设。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>覆盖每一个工程尺度</h2>
    <p class="lead">AIPE Labs 连接电力电子工程师日常工作的多个层级，让智能体获得超越单一计算的完整上下文。</p>
    <div class="grid scope-grid">
      <a class="card scope-card" href="{{ '/zh/power/devices/' | relative_url }}">
        <img src="{{ '/images/research/components.png' | relative_url }}" alt="功率半导体器件" loading="lazy" decoding="async">
        <span class="scope-kicker">01 · 元件层</span><h3>器件与磁性元件</h3>
        <p>器件表征、模型、数据、损耗估算、热特性与磁性元件设计资源。</p><strong>查看器件资源 →</strong>
      </a>
      <a class="card scope-card" href="{{ '/zh/power/converters/' | relative_url }}">
        <img src="{{ '/images/research/converter.png' | relative_url }}" alt="功率变换器设计" loading="lazy" decoding="async">
        <span class="scope-kicker">02 · 变换器层</span><h3>变换器与控制</h3>
        <p>拓扑比较、变换器建模、控制、优化与可复现设计流程。</p><strong>查看变换器资源 →</strong>
      </a>
      <a class="card scope-card" href="{{ '/zh/power/microgrids/' | relative_url }}">
        <img src="{{ '/images/research/microgrids.png' | relative_url }}" alt="电力电子系统与微电网" loading="lazy" decoding="async">
        <span class="scope-kicker">03 · 系统层</span><h3>系统与微电网</h3>
        <p>直流配电、微电网架构、系统集成、任务工况与验证规划。</p><strong>查看系统资源 →</strong>
      </a>
    </div>
  </div>
</section>

<section class="section collaboration-section">
  <div class="container collaboration-layout">
    <div>
      <span class="section-badge">社区 + 合作</span>
      <h2>今天就要有用，也要足够有野心</h2>
      <p class="lead">
        我们欢迎开发者使用或贡献资源，欢迎研究人员共同验证新的工程流程，也期待与企业、
        投资机构和战略合作伙伴一起建设下一代 AI 辅助电力电子工程平台。
      </p>
      <div class="hero-actions align-left">
        <a class="btn btn-primary" href="{{ '/zh/contact/' | relative_url }}">讨论合作</a>
        <a class="btn btn-ghost" href="{{ '/zh/resources/prototypes/' | relative_url }}">查看设计工作</a>
      </div>
    </div>
    <div class="collaboration-list">
      <div><span>01</span><p><strong>开发者</strong><br>使用索引、测试资源，并贡献开放工具。</p></div>
      <div><span>02</span><p><strong>科研伙伴</strong><br>把研究方法和数据转化为可复现的智能体工作流。</p></div>
      <div><span>03</span><p><strong>产业与战略伙伴</strong><br>用真实工程问题验证技术，并共同塑造平台。</p></div>
    </div>
  </div>
</section>

<section class="section section-alt partners-section">
  <div class="container">
    <h2>合作伙伴</h2>
    <p>连接人工智能、电力电子与能源系统研究的学术和产业合作关系。</p>
    <div class="partner-grid">
      <img src="{{ '/images/general/CU_logo.png' | relative_url }}" alt="卡迪夫大学" loading="lazy" decoding="async">
      <img src="{{ '/images/general/SHI_logo.png' | relative_url }}" alt="住友重机械工业" loading="lazy" decoding="async">
      <img src="{{ '/images/general/SHU_logo.png' | relative_url }}" alt="上海大学" loading="lazy" decoding="async">
      <img src="{{ '/images/general/PX_logo.png' | relative_url }}" alt="泮芯科技" loading="lazy" decoding="async">
      <img src="{{ '/images/general/LU_logo.png' | relative_url }}" alt="拉夫堡大学" loading="lazy" decoding="async">
      <img src="{{ '/images/general/UG_logo.webp' | relative_url }}" alt="格拉斯哥大学" loading="lazy" decoding="async">
    </div>
  </div>
</section>
