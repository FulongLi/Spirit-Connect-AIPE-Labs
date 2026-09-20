---
layout: default
title: AI Agent 团队
lang: zh
permalink: /zh/resources/ai-agent-team/
description: 认识 AIPE Labs 生态中的专业 Agent 与工具，了解各自的用途、工作方式和使用方法。
---

<header class="agent-team-hero">
  <div class="container agent-team-hero-grid">
    <div>
      <span class="section-kicker">专业工程工具</span>
      <h1>围绕工程工作流组建的 Agent 团队。</h1>
    </div>
    <p class="lead">每一个 AIPE Labs 工具都负责从工程想法到可检查、可验证、可复用结果之间的一段明确流程。</p>
  </div>
</header>

<section class="section agent-team-feature-section">
  <div class="container">
    <a class="agent-team-feature" href="{{ '/zh/resources/ai-agent-team/aipe-sketch/' | relative_url }}">
      <div class="agent-team-feature-copy">
        <div class="agent-team-status"><span></span>现已开放 · 开源工具</div>
        <p class="agent-team-index">Agent 工具 01</p>
        <h2>AIPE-Sketch</h2>
        <p class="lead">把电气连接关系转换成清晰的 SVG 原理图。AIPE‑Sketch 负责规划器件位置、完成布线，并检查图纸是否仍然准确表达所描述的电路。</p>
        <div class="agent-team-tags" aria-label="AIPE-Sketch 主要能力">
          <span>图结构规划</span><span>SVG 输出</span><span>连通性检查</span>
        </div>
        <strong class="agent-team-link">认识 AIPE-Sketch，开始绘制原理图 →</strong>
      </div>
      <div class="agent-team-feature-visual">
        <div class="agent-tool-window">
          <video class="agent-tool-video" autoplay muted loop playsinline preload="metadata" poster="{{ '/images/general/aipe-sketch-video-poster.png' | relative_url }}" aria-label="AIPE-Sketch 原理图工作流动画介绍">
            <source src="{{ '/videos/AIPE-Sketch.mp4' | relative_url }}" type="video/mp4">
          </video>
        </div>
      </div>
    </a>
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
