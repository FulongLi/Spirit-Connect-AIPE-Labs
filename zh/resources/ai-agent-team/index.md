---
layout: default
title: AI Agent 团队
lang: zh
permalink: /zh/resources/ai-agent-team/
description: 认识 AIPE Labs 生态中的专业 Agent 与工具，了解各自的用途、工作方式和使用方法。
---

<header class="agent-team-hero library-hero">
  <div class="container">
    {% include hub-breadcrumb.html category='tools' %}
    <span class="section-kicker">专业工程工具</span>
    <h1>围绕工程工作流组建的 Agent 团队。</h1>
    <p class="lead">每一个 AIPE Labs 工具都负责从工程想法到可检查、可验证、可复用结果之间的一段明确流程。</p>
  </div>
</header>

{%- assign sketcher = site.data.agents | where: "key", "sketch" | first %}
<section class="section agent-team-feature-section">
  <div class="container">
    <a class="agent-team-feature" href="{{ '/zh' | append: sketcher.page | relative_url }}">
      <div class="agent-team-feature-copy">
        <div class="agent-team-status"><span></span>现已开放 · {{ sketcher.licence.label.zh }}</div>
        <p class="agent-team-index">Agent 工具 01</p>
        <h2>{{ sketcher.name }}</h2>
        <p class="lead">把电路描述转换为清晰、经过电气检查的 SVG 原理图。{{ sketcher.name }} 可作为 Codex 或 Claude Code 插件安装，自动排列符号与连线，并检查图纸是否与所描述的电路一致。</p>
        <div class="agent-team-tags" aria-label="{{ sketcher.name }} 主要能力">
          <span>Codex 与 Claude Code 插件</span><span>SVG + JSON 报告</span><span>电气验证</span>
        </div>
        <strong class="agent-team-link">认识 {{ sketcher.name }}，开始绘制原理图 →</strong>
      </div>
      <div class="agent-team-feature-visual">
        <div class="agent-tool-window">
          <video class="agent-tool-video" autoplay muted loop playsinline preload="metadata" poster="{{ sketcher.video_poster | relative_url }}" aria-label="{{ sketcher.name }} 快速入门教程预览">
            <source src="{{ sketcher.video | relative_url }}" type="video/mp4">
          </video>
        </div>
      </div>
    </a>
  </div>
</section>

<section class="section agent-team-more">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">更多智能体</span><h2>团队中的其他成员。</h2></div>
    </div>
    <div class="hub-project-grid">
      {%- for agent in site.data.agents %}{% unless agent.key == 'sketch' %}
      {% include agent-plugin-card.html agent=agent lang='zh' %}
      {%- endunless %}{% endfor %}
    </div>
  </div>
</section>

<section class="section section-alt agent-team-method">
  <div class="container">
    <div class="agent-team-method-heading">
      <span class="section-kicker">团队组织方式</span>
      <h2>小而明确的工具，清晰可查的责任边界。</h2>
    </div>
    <div class="agent-team-principles">
      <div><span>01</span><h3>描述</h3><p>把工程意图保留在工程师与 Coding Agent 都能检查的结构中。</p></div>
      <div><span>02</span><h3>生成</h3><p>用确定性的后端生成图纸、模型、数据集或计算结果。</p></div>
      <div><span>03</span><h3>验证</h3><p>让结果同时带回检查项、警告和源数据，不隐藏不确定性。</p></div>
    </div>
  </div>
</section>
