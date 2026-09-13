---
layout: default
title: 工程数据库
lang: zh
permalink: /zh/resources/database/
description: 面向电力电子分析、元件选型、建模与设计自动化的功率半导体和磁性元件数据库。
---

<header class="hero hero-compact">
  <div class="container">
    <h1>工程数据库</h1>
    <p class="lead">
      为电力电子分析、元件选型、建模及 AI 辅助设计流程提供可复用的器件与磁性元件数据。
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <div class="grid grid-two">
      <a class="card post-card" href="{{ '/zh/database/transistors/' | relative_url }}">
        {% include fig-db-card-transistor.html lang=page.lang %}
        <span class="small">功率半导体</span>
        <h3>晶体管数据库</h3>
        <p>SiC、GaN、IGBT 与硅器件的规格、开关特性、热特性及选型参考。</p>
        <ul class="db-tags">
          <li>I–V 与 C–V 曲线</li>
          <li>双脉冲波形</li>
          <li>E<sub>on</sub> / E<sub>off</sub> 表</li>
          <li>Z<sub>th</sub> 热网络</li>
        </ul>
        <span class="post-card-more">浏览晶体管数据 →</span>
      </a>
      <a class="card post-card" href="{{ '/zh/database/magnetics/' | relative_url }}">
        {% include fig-db-card-magnetics.html lang=page.lang %}
        <span class="small">磁性元件</span>
        <h3>磁性元件数据库</h3>
        <p>用于变压器和电感设计的磁芯材料、损耗参数、绕组信息与热数据。</p>
        <ul class="db-tags">
          <li>磁芯几何</li>
          <li>损耗曲面</li>
          <li>µ 随直流偏磁</li>
          <li>绕组导体</li>
        </ul>
        <span class="post-card-more">浏览磁性元件数据 →</span>
      </a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>为计算而建，而非为浏览而建</h2>
    <p class="lead section-lead-spaced">
      数据手册 PDF 是写给逐个查看器件的工程师看的；这些数据库是写给要扫掠成千上万种组合的求解器用的 ——
      因此一切都以曲线、曲面与网络的形式存储，且每个数值都附带其测量条件。
    </p>
    <div class="grid">
      <div class="card">
        <h3>曲线，而非标称值</h3>
        <p>C<sub>oss</sub>(V)、P<sub>v</sub>(f, B̂, T)、µ(H<sub>dc</sub>)、Z<sub>th</sub>(t)。单点数值恰恰掩盖了决定设计能否收敛的那部分行为。</p>
      </div>
      <div class="card">
        <h3>条件与数值同行</h3>
        <p>偏置电压、结温、驱动电阻、回路电感、激励波形。脱离条件的数值无法在不同厂商之间比较。</p>
      </div>
      <div class="card">
        <h3>关键处以实测为准</h3>
        <p>由数据手册数字化得到的数据会明确标注；台架实测数据附带夹具、仪器与不确定度，两者一目了然。</p>
      </div>
      <div class="card">
        <h3>可闭合的损耗模型</h3>
        <p>开关损耗与热网络针对任务剖面联立求解，给出结温与效率，而不是一个偏乐观的估计值。</p>
      </div>
      <div class="card">
        <h3>机器可读</h3>
        <p>结构化记录可直接供脚本、优化器与 AI 设计智能体调用 —— 也正是我们自有变换器与磁件设计工具背后的同一批数据。</p>
      </div>
      <div class="card">
        <h3>可追溯</h3>
        <p>每条记录都保留来源、版本与日期，多年之后的设计评审仍可回溯某个参数的出处。</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow-center">
    <h2>需要我们尚未收录的器件或磁芯？</h2>
    <p class="lead">
      我们按需进行表征 —— 半导体的静态、动态与热特性；磁性元件的损耗、磁导率与绕组数据 ——
      并以相同的格式补充进数据库。
    </p>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/zh/contact/' | relative_url }}">申请表征服务</a>
      <a class="btn btn-ghost" href="{{ '/zh/power/devices/characterisation/' | relative_url }}">我们如何测量</a>
    </div>
  </div>
</section>
