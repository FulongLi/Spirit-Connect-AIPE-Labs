---
layout: default
title: 原型设计参考
lang: zh
permalink: /zh/resources/prototypes/
description: 面向变换器、变压器、磁性元件与电力电子测量的原型设计参考。
---

<header class="hero hero-compact">
  <div class="container">
    <span class="badge">资源</span>
    <h1>原型设计参考</h1>
    <p class="lead">
      为后续电力电子分析与开发提供参考的设计方案、硬件原型和工程记录。
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <div class="grid">
      <a class="card post-card" href="{{ '/zh/resources/prototypes/dab/' | relative_url }}">
        <span class="small">变换器</span>
        <h3>双有源桥变换器</h3>
        <p>AI 辅助优化的双有源桥（DAB）变换器 —— 拓扑、磁性元件与控制在一次流程中协同设计。</p>
        <span class="post-card-more">查看设计参考 →</span>
      </a>
      <a class="card post-card" href="{{ '/zh/resources/prototypes/sst/' | relative_url }}">
        <span class="small">系统</span>
        <h3>固态变压器</h3>
        <p>AI 辅助设计面向下一代电力配电网络的固态变压器（SST）。</p>
        <span class="post-card-more">查看设计参考 →</span>
      </a>
      <a class="card post-card" href="{{ '/zh/resources/prototypes/rogowski-coil/' | relative_url }}">
        <span class="small">测量</span>
        <h3>PCB 罗氏线圈</h3>
        <p>用于电力电子验证与监测的高精度 PCB 罗氏线圈电流传感器。</p>
        <span class="post-card-more">查看设计参考 →</span>
      </a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>设计数据库</h2>
    <p class="lead">原型背后的元件数据 —— 也可通过
      <a href="{{ '/aipe.md' | relative_url }}">aipe.md</a> 供你的 AI 智能体读取。</p>
    <div class="grid grid-two">
      <a class="card post-card" href="{{ '/zh/database/transistors/' | relative_url }}">
        <span class="small">数据库</span>
        <h3>晶体管数据库</h3>
        <p>功率半导体器件 —— SiC、GaN 与 Si —— 附表征数据。</p>
        <span class="post-card-more">浏览 →</span>
      </a>
      <a class="card post-card" href="{{ '/zh/database/magnetics/' | relative_url }}">
        <span class="small">数据库</span>
        <h3>磁性元件数据库</h3>
        <p>用于变换器设计的磁性元件与磁芯材料。</p>
        <span class="post-card-more">浏览 →</span>
      </a>
    </div>
  </div>
</section>
