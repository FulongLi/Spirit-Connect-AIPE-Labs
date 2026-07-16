---
layout: default
title: DAB 变换器案例研究
lang: zh
permalink: /zh/case-studies/dab/
description: AI 辅助优化双有源桥（DAB）变换器设计的案例研究。
---

<header class="hero">
  <video class="hero-video" autoplay muted loop playsinline>
    <source src="{{ '/images/vids/compicon1.mp4' | relative_url }}" type="video/mp4">
  </video>
  <div class="bg"></div>
  <div class="container">
    <h1>DAB 变换器案例研究</h1>
    <p class="lead">我们的 AI 辅助平台如何优化一台 2 kW DAB 级 —— 开关器件、磁性元件与控制环路。</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>设计优化流程</h2>
    <p class="lead">
      本案例展示我们的 AI 辅助设计自动化平台如何系统性地探索设计空间，为双有源桥变换器找到最优方案。
    </p>
    <div class="grid">
      <div class="card">
        <h3>拓扑与参数</h3>
        <p>在相数、变压器变比与滤波器参数之间进行自动搜索，并配以全面的约束检查与可行性分析。</p>
      </div>
      <div class="card">
        <h3>控制综合</h3>
        <p>移相与三重移相调制策略，自动整定电流与电压调节环路以实现最优性能。</p>
      </div>
      <div class="card">
        <h3>验证与测试</h3>
        <p>自动生成 HIL/SIL 测试矩阵、效率/热图谱与数据采集脚本，实现可复现的验证工作流。</p>
      </div>
    </div>
  </div>
</section>
