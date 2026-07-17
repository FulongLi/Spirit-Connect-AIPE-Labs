---
layout: default
title: 常见问题
lang: zh
permalink: /zh/company/faq/
description: 关于 AIPE Labs、aipe.md、Coding Agent 接入、开放资源、工程应用与合作方式的常见问题。
---

<header class="hero hero-compact">
  <div class="container">
    <span class="badge">常见问题</span>
    <h1>关于 AIPE Labs 的常见问题</h1>
    <p class="lead">了解开放资源索引如何工作、目前有哪些内容，以及开发者、研究人员和企业如何参与。</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">什么是 AIPE Labs？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>AIPE Labs 是由 Spirit Connect 推动的开放电力电子项目。它把领域知识、工程工具、专业智能体、数据集、设计参考和可复现工作流组织起来，让开发者和工程师能够通过自己日常使用的 Coding Agent 调用这些资源。长期目标是打造一个贯通器件、变换器与系统层级的电力电子 AI 智能体。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">aipe.md 是什么？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p><code>aipe.md</code> 是一份面向 AI 智能体的公开 Markdown 索引。它介绍 AIPE Labs 当前发布的资源，并把智能体引导到相关的工具、软件包、专业智能体、数据库、案例和工程参考。它是整个生态的入口，本身不是模型或独立应用。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">如何在 Claude 或 Codex 中使用？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>把 <strong>https://aipel.co.uk/aipe.md</strong> 粘贴给具备联网能力的 Coding Agent，让它先读取索引，再描述你的任务。例如：“阅读这份 AIPE Labs 索引，找到相关资源，帮我规划磁性元件有限元分析。”读取公开索引不需要注册 AIPE Labs 账号或申请 API Key。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Claude/Codex 插件需要安装吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不需要。“插件”是当前智能体入口的便捷名称，并不是浏览器扩展或需要安装的软件包。Coding Agent 会读取 <code>aipe.md</code>，再访问其中已经发布的链接。随着项目发展，后续可能会增加集成程度更高的 Skill 和专业智能体。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">哪些 AI 智能体可以使用 AIPE Labs？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>任何能够读取公开 URL 的 Coding Agent 都可以使用，包括 Claude、Codex、Cursor，以及具备联网能力的智能体框架。实际表现取决于所使用智能体的能力和权限设置。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">AIPE Labs 覆盖哪些工程方向？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>目前范围包括功率半导体器件、电热表征、寿命与可靠性测试、磁性元件、变换器仿真与控制、有限元分析、微电网、光伏储能系统、优化、传感与验证。不同方向的内容成熟度不同，并会随着新资源发布持续扩展。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">哪些内容现在可以使用，哪些仍在建设？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>公开的 <code>aipe.md</code> 索引以及其中当前链接的资源已经可以使用。AIPE Labs 正在持续整理和扩展软件包、专业智能体、工程数据、仿真与有限元工作流和验证案例。完整的电力电子 AI 智能体是正在建设的长期平台，因此网站会区分已发布资源与规划中的能力。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">AIPE Labs 能替代工程审核和实验验证吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不能。AIPE Labs 用于帮助工程师发现资源、组织分析、自动化重复工作和评估设计方案。尤其涉及安全或产品决策时，输出仍应对照原始数据手册、模型、仿真、适用标准和实验测量进行检查。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">AIPE Labs 免费且开源吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>公开索引可以免费访问，许多关联工具和资源也会以开放方式发布。不同仓库、数据集和软件包可能采用不同许可证和使用条款，使用时请查看对应来源。商业工程服务、私有试点和深度集成会单独讨论。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">机密信息和项目数据如何处理？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>读取 AIPE 公开索引不需要把项目数据发送给 AIPE Labs。你输入第三方 Coding Agent 的信息由对应服务商的条款管理，因此未经组织批准，请勿粘贴机密材料。对于直接开展的科研或产业项目，可以针对具体合作约定保密、数据处理、部署和知识产权要求。</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">如何贡献资源或与 AIPE Labs 合作？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>开发者可以查看关联的 GitHub 项目、测试资源、提交问题，或贡献工具与示例。高校和企业可以围绕数据集、器件测试与建模、仿真与验证流程、工程试点或战略发展开展合作。请通过<a href="{{ '/zh/contact/' | relative_url }}">联系页面</a>简单介绍你希望解决的问题或合作方向。</p></div></div>
      </div>
    </div>
  </div>
</section>
