---
layout: default
title: AIPE 插件 — 面向 Coding Agent 的工程能力
lang: zh
permalink: /zh/plugin/
description: 在 Codex、Claude Code 或其他 Coding Agent 中直接使用 AIPE 的数据、工程工具、仿真技能与设计工作流。现在无需安装即可使用；可安装的 AIPE 插件即将推出。
image: /images/background/sst.png
---
{%- comment -%}
  面向公众的产品页。实现细节（Registry、Core、路由、加载、编排）见
  docs/aipe-plugin-architecture.md，不在此页展示。
{%- endcomment -%}
{%- assign registry = site.data.registry.capabilities -%}
{%- assign rec_skills = registry | where: "id", "aipe.simulation-skills" | first -%}
{%- assign rec_site = registry | where: "id", "aipe.presentation" | first -%}
<main class="agent-guide plugin-page">
<header class="plugin-hero">
  <div class="container">
    <span class="section-kicker">AIPE 插件</span>
    <h1>把 AIPE 工程能力带入你的 Coding Agent。</h1>
    <p class="lead">在 Codex、Claude Code 或其他 Coding Agent 中，直接使用 AIPE 的数据、工程工具、仿真技能与设计工作流。</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#codex">在 Codex 中使用</a>
      <a class="btn btn-primary" href="#claude-code">在 Claude Code 中使用</a>
      <a class="btn btn-ghost" href="{{ rec_skills.repository }}" rel="noopener">在 GitHub 上查看 ↗</a>
    </div>
    <p class="plugin-status-note" id="status"><span id="next"></span>现在可通过公开索引使用。可安装的插件仍在设计中。 <a href="#future">查看计划 →</a></p>
  </div>
</header>

<nav class="hub-tabs section-tabs" aria-label="插件栏目">
  <div class="container">
    <a href="#codex">Codex</a>
    <a href="#claude-code">Claude Code</a>
  </div>
</nav>

<section class="section" id="now">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">现在如何使用</span><h2>从一条提示开始。</h2></div>
      <p>把下面的提示粘贴到 Coding Agent 中。它会让智能体读取 AIPE 面向智能体的索引 <code>aipe.md</code>，从而为你的任务找到合适的能力。</p>
    </div>
    <div class="agent-link plugin-prompt">
      <code id="agent-prompt">阅读 https://aipel.co.uk/aipe.md，找到相关的 AIPE 能力，并帮助我完成电力电子任务。</code>
      <button class="copy-btn" data-copy-target="agent-prompt" data-copied-label="已复制！">复制</button>
    </div>
    <div class="plugin-agents">
      <article class="plugin-agent" id="codex">
        <span class="access-kicker">在 Codex 中使用</span>
        <h3>Codex</h3>
        <ol>
          <li>把上面的提示粘贴到 Codex，然后描述你的工程任务。</li>
          <li>如需仿真、CAD、PCB 或场分析工作，从 <a href="{{ rec_skills.repository }}" rel="noopener">AIPE 仿真技能</a> 中复制所需的技能文件夹到你的 Codex 技能目录。</li>
          <li>按名称调用，例如 <code>$pe-ltspice-power-electronics</code>，并提供拓扑、工作范围以及你想要验证的目标。</li>
        </ol>
        <p class="plugin-note">技能安装方式以仿真技能仓库自身的说明为准。</p>
      </article>
      <article class="plugin-agent" id="claude-code">
        <span class="access-kicker">在 Claude Code 中使用</span>
        <h3>Claude Code</h3>
        <ol>
          <li>把上面的提示粘贴到 Claude Code，然后描述你的工程任务。</li>
          <li>让它阅读与你所用工具匹配的仿真技能中的 <code>SKILL.md</code>，以及相关的 <code>references/</code>。</li>
          <li>保持计算可审查：要求它说明假设、引用原始来源，并列出所做的检查。</li>
        </ol>
        <p class="plugin-note">这些技能采用相同的 <code>SKILL.md</code> 文件夹结构，但 AIPE 尚未验证把它们安装为 Claude Code 技能的流程。</p>
      </article>
    </div>
  </div>
</section>

<section class="section" id="capabilities">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">可以使用的能力</span><h2>为你的智能体准备好的工程能力。</h2></div>
      <p>每个方向都列出背后的 AIPE 项目及其成熟度，让你清楚哪些可以依赖、哪些需要再核实。</p>
    </div>
    {% include plugin-capabilities.html lang='zh' %}
  </div>
</section>

<section class="section plugin-future-section" id="future">
  <div class="container"><details class="editorial-details"><summary>即将推出：可安装的 AIPE 插件</summary>
    <div class="hub-section-heading">
      <div><span class="section-kicker">即将推出</span><h2>可安装的 AIPE 插件。</h2></div>
      <p>只需安装一次，智能体就能识别你项目中的工程任务，按固定版本引入匹配的 AIPE 能力，并让假设与证据始终可供审查。插件保持轻量：数据、工具与技能继续在各自的项目中演进。</p>
    </div>
    <ul class="plugin-promises">
      <li>在你现有的项目与工具中工作。</li>
      <li>在智能体依赖某项能力之前，先说明它的成熟度。</li>
      <li>让计算、来源与检查过程始终可审查。</li>
      <li>从各项能力的维护处直接加载，而不是打包副本。</li>
    </ul>
  </details></div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title-centred">常见问题</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">现在可以安装 AIPE 插件吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>还不可以。可安装的插件仍在设计中，尚未发布任何安装包。目前你可以把上面的提示交给智能体，并按仓库说明把单个仿真技能复制到 Codex 技能目录中使用。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">哪些智能体可以使用 AIPE？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>任何能够读取公开网页的智能体都可以，包括 Codex、Claude Code、Cursor 以及具备联网能力的自定义智能体框架。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">会把我的项目数据发送给 AIPE Labs 吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不会。读取 AIPE 的公开页面不会把项目文件发送给 AIPE Labs。你输入第三方智能体的信息，受该服务商条款和你所在组织政策的约束。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">输出结果可以替代工程评审吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不能。每项 AIPE 能力都说明了自身的局限。请用它加速检索与分析，并对照原始数据手册、模型、标准、仿真与测量结果核实重要结论。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">开发者在哪里查看技术细节？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>智能体读取 <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a> 索引，脚本可以通过 <a href="{{ '/aipe.json' | relative_url }}"><code>aipe.json</code></a> 获取相同的信息。拟议的插件设计见 GitHub 上的<a href="{{ rec_site.repository }}/blob/main/docs/aipe-plugin-architecture.md" rel="noopener">架构说明（英文）</a>。</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section collaboration-section agent-guide-cta">
  <div class="container narrow-center">
    <h2>在你的 Coding Agent 中试用 AIPE</h2>
    <p class="lead">
      把准备好的提示复制到 Coding Agent 中，或联系我们，探讨科研合作、工程试点以及 AIPE 插件的早期工作。
    </p>
    <div class="hero-actions">
      <button type="button" class="btn btn-primary" data-copy-target="agent-prompt" data-copied-label="已复制！">复制 AIPE 提示</button>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">联系我们</a>
    </div>
  </div>
</section>
</main>
