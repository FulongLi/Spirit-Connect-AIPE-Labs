---
layout: default
title: 固态变压器案例研究
lang: zh
permalink: /zh/case-studies/sst/
description: AI 辅助设计面向下一代电力配电的固态变压器（SST）的案例研究。
---

<header class="hero">
  <img class="hero-video" src="{{ '/images/background/sst.png' | relative_url }}" alt="固态变压器">
  <div class="bg"></div>
  <div class="container">
    <h1>固态变压器</h1>
    <p class="lead">AI 驱动设计模块化 SST —— 从单元级变换器优化到系统级集成与控制。</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>为什么选择固态变压器？</h2>
    <p class="lead">
      固态变压器用紧凑、可控的电力电子取代笨重的工频变压器 ——
      实现双向功率流动、电压调节，以及可再生能源、储能与直流负荷的无缝接入。
    </p>
    <div class="grid">
      <div class="card">
        <h3>多级架构</h3>
        <p>AC-DC 整流、隔离 DC-DC 变换（DAB）与 DC-AC 逆变 —— 每一级都由 AI 智能体针对 SST 整体任务需求协同优化。</p>
      </div>
      <div class="card">
        <h3>模块化单元设计</h3>
        <p>级联 H 桥或模块化多电平单元，配以 AI 驱动的器件选型、磁性元件设计与全模块热平衡。</p>
      </div>
      <div class="card">
        <h3>中压运行</h3>
        <p>面向 1–10 kV 等级应用的 SiC 设计 —— AI 智能体处理绝缘配合、dv/dt 管理与串联器件均压。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>AI 智能体实战</h2>
    <div class="grid">
      <div class="card">
        <h3>拓扑探索</h3>
        <p>自动筛选 DAB、LLC 与谐振 CLLC 单元 —— 评估隔离级的效率、功率密度与故障容错权衡。</p>
      </div>
      <div class="card">
        <h3>控制协同设计</h3>
        <p>分层控制综合：单元级软开关与均流、级级电压调节，以及系统级功率流动管理。</p>
      </div>
      <div class="card">
        <h3>验证与反馈</h3>
        <p>为每个 SST 模块自动生成测试方案 —— 效率映射、热循环与故障注入 —— 将结果反馈以完善 AI 智能体的模型。</p>
      </div>
    </div>
  </div>
</section>
