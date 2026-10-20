---
layout: default
title: AIPE 插件 — 一个入口，多种工程能力
lang: zh
permalink: /zh/plugin/
description: 用一条提示词让 Codex、Claude Code 或其他 Coding Agent 发现 AIPE 的工程智能体、数据库与工具，或直接使用独立的 AIPE 智能体。可安装的 AIPE 插件正在规划中。
image: /images/background/sst.png
---
{%- comment -%}
  面向公众的产品页，分为两部分：统一的 AIPE 插件入口（目前是基于 aipe.md
  的能力发现提示词；安装与编排仍在规划中），以及来自 _data/agents.yml 的
  独立智能体卡片。实现细节见 docs/aipe-plugin-architecture.md，不在此页展示。
{%- endcomment -%}
<main class="plugin-page">
<header class="plugin-hero">
  <div class="container">
    <span class="section-kicker">在 Coding Agent 中使用工具</span>
    <h1>AIPE 插件</h1>
    <p class="plugin-subtitle">一个入口，多种工程能力。</p>
    <p class="lead">我们的目标是提供一个统一入口，让你的 Coding Agent 能够发现并协调 AIPE 各自独立的工程智能体、数据库与工具。</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#aipe-plugin">从一条提示词开始</a>
      <a class="btn btn-ghost" href="#standalone">独立插件</a>
    </div>
  </div>
</header>

<section class="section plugin-unified" id="aipe-plugin">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">AIPE 插件</span><h2>从一条提示词开始。</h2></div>
      <p>把下面的提示词粘贴到 Codex、Claude Code 或其他 Coding Agent 中。它会让智能体读取 <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a>——AIPE 公开的、面向智能体的工程能力索引。</p>
    </div>
    <div class="agent-link plugin-prompt">
      <code id="aipe-plugin-prompt">请阅读 https://aipel.co.uk/aipe.md，找出与我的任务相关的 AIPE 工程能力，并帮助我使用合适的工具和智能体。</code>
      <button class="copy-btn" type="button" data-copy-target="aipe-plugin-prompt" data-copied-label="已复制" aria-live="polite">复制提示词</button>
    </div>
    <div class="plugin-status">
      <div>
        <span class="plugin-status-label">现在可用</span>
        <p><strong>能力发现</strong> {% include status-badge.html status='available' lang='zh' %}</p>
        <p>智能体读取索引，找到适合你任务的 AIPE 能力，并按照每项能力自己的文档使用它。每个工具仍需按其仓库说明单独设置。</p>
      </div>
      <div>
        <span class="plugin-status-label">规划中</span>
        <p><strong>可安装插件与编排</strong> {% include status-badge.html status='planned' lang='zh' %}</p>
        <p>一次安装即可设置 AIPE 智能体，并在任务中协调它们协同工作。目前仍在设计中，尚未发布任何插件安装包。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="standalone">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">独立插件</span><h2>直接使用单个智能体。</h2></div>
      <p>每个智能体都维护在各自的仓库中。<strong>复制提示词</strong>得到的是一条让 Coding Agent 使用该智能体的指令，它不会安装任何内容。如果某个智能体同时是 Codex 与 Claude Code 的原生插件，其卡片会链接到安装步骤：请先安装插件，再粘贴提示词。</p>
    </div>
    <div class="hub-project-grid">
      {%- for agent in site.data.agents %}
      {% include agent-plugin-card.html agent=agent lang='zh' %}
      {%- endfor %}
    </div>
  </div>
</section>

<section class="section" id="aipe-academy">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">AIPE Academy</span><h2>与 AI 导师一起学习。</h2></div>
      <p>AIPE Academy 同时提供 Codex 技能与 Claude Code 插件，二者使用同一套开放课程：四个学科、带先修检查的学习路线、可复现的 Python 实验、MIT OpenCourseWare 学术范围参考，以及只保存在你本机的学习记录。除了你的 Coding Agent，只需要 Python 3.10；不需要 API 订阅、专有软件或云数据库。{% include status-badge.html status='available' lang='zh' %}</p>
    </div>
    <div class="plugin-status">
      <div>
        <span class="plugin-status-label">Claude Code</span>
        <div class="agent-link plugin-prompt">
          <code id="aipe-academy-claude">/plugin install aipe-academy --marketplace FulongLi/AIPE-Academy</code>
          <button class="copy-btn" type="button" data-copy-target="aipe-academy-claude" data-copied-label="已复制" aria-live="polite">复制命令</button>
        </div>
        <p>然后运行 <code>/aipe-academy:learn</code>，或直接说：“请按 AIPE Academy 带我从零学习。”</p>
      </div>
      <div>
        <span class="plugin-status-label">Codex</span>
        <div class="agent-link plugin-prompt">
          <code id="aipe-academy-codex">git clone https://github.com/FulongLi/AIPE-Academy</code>
          <button class="copy-btn" type="button" data-copy-target="aipe-academy-codex" data-copied-label="已复制" aria-live="polite">复制命令</button>
        </div>
        <p>在 Codex 中打开该文件夹，<code>aipe-academy</code> 技能会从 <code>.agents/skills/</code> 自动被发现。输入 <code>$aipe-academy</code>，或说“请按 AIPE Academy 带我从零学习”。</p>
      </div>
    </div>
    <p class="small">分步安装说明、各平台已测试的内容与已知限制见 <a href="https://github.com/FulongLi/AIPE-Academy/blob/main/docs/plugin-installation.md" rel="noopener">docs/plugin-installation.md ↗</a>（英文）。本站每节课程都链接到同一仓库中的规范源文件。</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title-centred">常见问题</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">哪些 Coding Agent 可以使用 AIPE？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>任何能够读取公开网页并在你的项目中工作的智能体都可以，包括 Codex 和 Claude Code。部分智能体可能会请求访问 GitHub 或运行本地命令的权限。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">会把我的项目数据发送给 AIPE Labs 吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不会。读取 AIPE 的公开页面和仓库不会把项目文件发送给 AIPE Labs。你输入第三方智能体的信息，受该服务商条款和你所在组织政策的约束。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">输出结果可以替代工程评审吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不能。每项 AIPE 能力都说明了自身的局限。请用它加速检索与分析，并对照原始数据手册、模型、标准、仿真与测量结果核实重要结论。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">开发者在哪里查看技术细节？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>智能体读取 <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a> 索引，脚本可以通过 <a href="{{ '/aipe.json' | relative_url }}"><code>aipe.json</code></a> 获取相同的信息。每个智能体的仓库都说明了各自的设置与检查方法。</p></div></div>
      </div>
    </div>
  </div>
</section>

{% include aipe-pathways.html current='plugin' lang='zh' %}
</main>
