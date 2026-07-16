---
layout: default
title: Claude Code/Codex 插件
lang: zh
permalink: /zh/plugin/
description: 面向 Claude Code 与 Codex 的 AIPE Labs 插件 —— 一条提示词即可让你的 AI 编程智能体访问电力电子数据库、设计参考与案例研究。
---

<header class="hero hero-compact">
  <div class="container">
    <h1>面向 Claude Code 与 Codex 的 AIPE Labs 插件</h1>
    <p class="lead">
      将下面的提示词输入 <strong>Claude Code</strong>、<strong>Codex</strong> 或任意 AI 编程智能体。
    </p>
    <div class="agent-link">
      <code id="agent-prompt">Read aipel.co.uk/aipe.txt to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt" data-copied-label="已复制!">复制</button>
    </div>
    <div class="demo-panel">
      <video autoplay muted loop playsinline>
        <source src="{{ '/images/vids/main.mp4' | relative_url }}" type="video/mp4">
      </video>
    </div>
  </div>
</header>

<section class="section section-alt">
  <div class="container" style="text-align:center;">
    <h2>为什么在你的智能体中使用 AIPE Labs</h2>
    <p class="lead" style="margin-inline:auto;">
      大多数将领域数据引入 AI 工作流的方式，都意味着新应用、新账号和需要管理的 API 密钥。
      AIPE Labs 插件把这些全部省去。
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
        <h3>使用你已有的额度</h3>
        <p>插件在你的 Claude Code 或 Codex 会话内运行，使用你现有的订阅额度 —— 无需单独的积分，也没有额外订阅。</p>
      </div>
    </div>
    <p class="lead" style="margin:3rem auto 0;">安装方式：将这条提示词粘贴到你的智能体中：</p>
    <div class="agent-link">
      <code id="agent-prompt-2">Read aipel.co.uk/aipe.txt to load the AIPE Labs power electronics resources and help me start a design.</code>
      <button class="copy-btn" data-copy-target="agent-prompt-2" data-copied-label="已复制!">复制</button>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>AIPE Labs 能在你的智能体中做什么</h2>
    <p class="lead">
      选择一项任务，你的智能体就会基于我们的数据来执行 —— 无需新应用、无需导出、无需切换上下文。
    </p>
    <div class="grid">
      <div class="card">
        <h3>器件选型</h3>
        <p>“为 10 kW、800 V 的 DC-DC 级筛选 SiC 器件” —— 智能体依据你的电压、电流与热约束搜索我们的晶体管数据库。</p>
      </div>
      <div class="card">
        <h3>磁性元件设计</h3>
        <p>“为 100 kHz 的 DAB 设计变压器” —— 磁芯材料选项、Steinmetz 参数与绕组窗口直接来自磁性元件数据库。</p>
      </div>
      <div class="card">
        <h3>拓扑对比</h3>
        <p>“这个规格选 LLC 还是 DAB？” —— 智能体调取我们的变换器设计参考，列出效率、功率密度与控制的权衡。</p>
      </div>
      <div class="card">
        <h3>损耗与热估算</h3>
        <p>“估算满载损耗” —— 基于表征数据计算开关与导通损耗，并对照器件额定值校核热限制。</p>
      </div>
      <div class="card">
        <h3>借鉴案例研究</h3>
        <p>“AIPE Labs 的 2 kW DAB 是怎么设计的？” —— 智能体讲解我们经过验证的原型案例，并将同样的流程应用到你的设计。</p>
      </div>
      <div class="card">
        <h3>验证规划</h3>
        <p>“为这台变换器起草测试方案” —— 以我们实验室验证实践为蓝本的测试矩阵与测量工作流。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 style="text-align:center;">常见问题</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">什么是 AIPE Labs 插件？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>这是把电力电子知识带入你的 AI 编程智能体的最简单方式。一条提示词让智能体读取我们的索引文件 aipe.txt，由此即可访问器件与磁性元件数据库、设计参考、原型案例研究，以及我们发布在 GitHub 上的技能与工具包。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">如何安装？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>无需安装。复制本页顶部的提示词，粘贴到 Claude Code、Codex 或任意具备联网能力的 AI 编程智能体中，智能体会自行加载资源 —— 无需账号、无需 API 密钥、无需配置。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">aipe.txt 是什么？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>一份为语言模型编写的纯文本索引。它汇总了 AIPE Labs 发布的一切 —— GitHub 上的技能、工具包与智能体，以及本网站上的数据库与设计参考 —— 每一项都附有链接与一句话说明，让智能体能直达所需内容。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">技能与工具包在哪里？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>在我们的 <a href="https://github.com/FulongLi" target="_blank">GitHub</a> 上。我们正在那里积极构建电力电子工具包、技能与智能体 —— aipe.txt 始终指向最新内容，新技能一经发布，你的智能体即可使用。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">除了 Claude Code 和 Codex，其他智能体可以用吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>可以。任何能访问 URL 的 AI 智能体都能使用 —— Claude Code、Codex、Cursor，或你自己的智能体框架。索引是纯文本，不绑定任何工具。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">需要付费吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不需要。插件在你现有的智能体会话中运行，使用你已有的订阅。若需要完整的电力电子 AI 智能体 —— 物理引导优化、控制综合与验证工作流 —— 请<a href="{{ '/zh/contact/' | relative_url }}">联系我们</a>。</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container" style="text-align:center;">
    <h2>更进一步：AI 智能体</h2>
    <p class="lead" style="margin-inline:auto;">
      插件为你的智能体提供数据。完整的电力电子 AI 智能体在此之上，
      还提供物理引导的优化、控制综合与验证工作流。
    </p>
    <div class="hero-actions" style="margin-top:2rem;">
      <a class="btn btn-primary" href="{{ '/zh/company/services/' | relative_url }}">了解 AI 智能体</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">联系我们</a>
    </div>
  </div>
</section>
