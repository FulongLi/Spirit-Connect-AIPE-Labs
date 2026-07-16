---
layout: default
title: 首页
lang: zh
permalink: /zh/
description: 打造电力电子 AI 智能体 —— 从器件到变换器再到电网，构建能源与 AI 的闭环生态。
---

<header class="hero">
  <div class="container">
    <span class="badge">电力电子 AI 智能体</span>
    <h1>为 AI 供能的电力系统，由 AI 来设计</h1>
    <p class="lead">
      我们正在打造电力电子 AI 智能体，让智能系统设计与为其供能的能源基础设施形成闭环
      —— 从半导体器件到变换器，再到电网。
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#agent-link">在你的 AI 智能体中使用</a>
      <a class="btn btn-ghost" href="{{ '/zh/company/services/' | relative_url }}">了解 AI 智能体</a>
    </div>
    <div class="demo-panel">
      <video autoplay muted loop playsinline>
        <source src="{{ '/images/vids/main.mp4' | relative_url }}" type="video/mp4">
      </video>
    </div>
  </div>
</header>

<section class="section section-alt" id="agent-link" style="text-align:center;">
  <div class="container">
    <span class="badge">支持 Claude Code 和 Codex</span>
    <h2>一条链接，通达电力电子全部资源。</h2>
    <p class="lead" style="margin-inline:auto;">
      将一条链接复制到 Claude Code、Codex 或任意 AI 编程智能体中，即可访问我们的
      电力电子与电力系统资源 —— 器件数据库、磁性元件数据、变换器设计参考等。
    </p>
    <div class="agent-link">
      <code id="agent-url">https://aipel.co.uk/llms.txt</code>
      <button class="copy-btn" data-copy-target="agent-url" data-copied-label="已复制!">复制</button>
    </div>
    <p class="agent-steps">
      粘贴到你的智能体中并提问：<em>“阅读 https://aipel.co.uk/llms.txt，帮我设计一台 10&nbsp;kW 的 DC-DC 变换器。”</em>
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>覆盖每一个设计尺度</h2>
    <p class="lead">
      我们的 AI 智能体贯穿电力电子的完整技术栈 —— 三个紧密衔接的层级，共同构成完整的闭环设计系统。
    </p>
    <div class="grid">
      <div class="card" style="text-align:center;">
        <img src="{{ '/images/research/components.png' | relative_url }}" alt="器件" style="width:100%;max-width:240px;margin-bottom:1rem;">
        <h3>器件</h3>
        <p>对半导体器件（SiC、GaN、Si）进行表征、建模与选型，提供 AI 驱动的损耗估算、
           热特性分析，以及数据手册到模型的自动转换。</p>
        <a href="{{ '/zh/power/devices/' | relative_url }}" style="display:inline-block;margin-top:1rem;font-weight:600;">了解更多 →</a>
      </div>
      <div class="card" style="text-align:center;">
        <img src="{{ '/images/research/converter.png' | relative_url }}" alt="变换器" style="width:100%;max-width:240px;margin-bottom:1rem;">
        <h3>变换器</h3>
        <p>探索拓扑结构、设计磁性元件、综合控制环路、优化多目标权衡
           —— 全部由 AI 智能体在一次设计流程中统一完成。</p>
        <a href="{{ '/zh/power/converters/' | relative_url }}" style="display:inline-block;margin-top:1rem;font-weight:600;">了解更多 →</a>
      </div>
      <div class="card" style="text-align:center;">
        <img src="{{ '/images/research/microgrids.png' | relative_url }}" alt="系统" style="width:100%;max-width:240px;margin-bottom:1rem;">
        <h3>系统</h3>
        <p>构建微电网、直流配电网络与交直流混合电力系统，让每一台变换器
           都针对整个电网的任务需求协同优化。</p>
        <a href="{{ '/zh/power/microgrids/' | relative_url }}" style="display:inline-block;margin-top:1rem;font-weight:600;">了解更多 →</a>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>闭环愿景</h2>
    <p class="lead">
      我们相信，能源与 AI 的未来是一个自我强化的循环。
    </p>
    <div class="grid">
      <div class="card">
        <h3>AI 设计电力系统</h3>
        <p>电力电子 AI 智能体协助工程师设计更优的变换器与电网 —— 更快的速度、
           更好的权衡，以及内置的验证工作流。</p>
      </div>
      <div class="card">
        <h3>电力系统驱动 AI</h3>
        <p>由此产生的高效、可靠的电力基础设施 —— 微电网、直流配电、高功率密度变换器
           —— 为运行 AI 的数据中心与算力提供能源。</p>
      </div>
      <div class="card">
        <h3>AI 升级电力系统</h3>
        <p>每一次设计迭代都将数据反馈给 AI 智能体。它不断学习、完善模型，
           产出更优的设计 —— 真正的闭环生态。</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>AI 智能体能做什么</h2>
    <p class="lead">一个模块化的智能层，可嵌入你的设计流程 —— 也可以由我们作为服务为你运行。</p>
    <div class="grid">
      <div class="card"><h3>拓扑探索</h3><p>在约束条件下搜索 LLC、DAB、多电平 DC-AC、交错并联 Buck/Boost 等拓扑。</p></div>
      <div class="card"><h3>器件与磁性元件选型</h3><p>自动完成宽禁带器件选型、磁芯尺寸设计、绕组优化与开关损耗估算。</p></div>
      <div class="card"><h3>损耗与热建模</h3><p>结合数据手册与物理引导的代理模型，生成效率图谱与热限制边界。</p></div>
      <div class="card"><h3>控制综合</h3><p>移相与 TPWM 策略、电流/电压环路、软开关区域 —— 全部自动整定。</p></div>
      <div class="card"><h3>多目标优化</h3><p>效率、功率密度、成本、温度、EMI —— 帕累托权衡，附带清晰的设计依据。</p></div>
      <div class="card"><h3>验证规划</h3><p>自动生成 HIL/SIL 测试矩阵、数据采集脚本与可复现的实验室工作流。</p></div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>合作伙伴</h2>
    <p>我们与顶尖的学术与产业伙伴合作，共同推动 AI 驱动的电力电子技术前沿。</p>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:2rem;align-items:center;text-align:center;">
      <div>
        <img src="{{ '/images/general/CU_logo.png' | relative_url }}" alt="卡迪夫大学" style="max-width:160px;">
      </div>
      <div>
        <img src="{{ '/images/general/SHI_logo.png' | relative_url }}" alt="住友重机械工业" style="max-width:160px;">
      </div>
      <div>
        <img src="{{ '/images/general/SHU_logo.png' | relative_url }}" alt="上海大学" style="max-width:160px;">
      </div>
      <div>
        <img src="{{ '/images/general/PX_logo.png' | relative_url }}" alt="磐芯科技" style="max-width:160px;">
      </div>
      <div>
        <img src="{{ '/images/general/LU_logo.png' | relative_url }}" alt="拉夫堡大学" style="max-width:160px;">
      </div>
      <div>
        <img src="{{ '/images/general/UG_logo.webp' | relative_url }}" alt="格拉斯哥大学" style="max-width:160px;">
      </div>
    </div>
  </div>
</section>
