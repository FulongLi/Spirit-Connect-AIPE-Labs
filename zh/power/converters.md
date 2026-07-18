---
layout: default
title: 变换器
lang: zh
permalink: /zh/power/converters/
description: 面向工业电能变换的结构化拓扑资料库，覆盖经典 DC-DC、谐振、双向、多电平与模块化变换器。
---

<main class="converter-library">
<header class="hero">
  <div class="container">
    <span class="badge">拓扑资料库 · 持续公开建设</span>
    <h1>变换器拓扑</h1>
    <p class="lead">
      面向工业电能变换的结构化参考 —— 从 Buck、Boost 和 Flyback，
      到 LLC、DAB、多电平变换器、MMC 与固态变压器。
    </p>
  </div>
</header>

<section class="section section-alt">
  <div class="container">
    <span class="section-badge">拓扑地图</span>
    <h2>按照电能变换接口查找</h2>
    <p class="lead">
      首先按照输入与输出的电气形式分类，再通过隔离、双向运行、软开关、
      相数和模块化方式进一步缩小设计空间。
    </p>
    <div class="grid">
      <a class="card post-card" href="#dc-dc">
        <span class="small">DC → DC</span>
        <h3>DC–DC 变换</h3>
        <p>非隔离、隔离、谐振、交错并联与双向功率级。</p>
        <span class="post-card-more">查看拓扑 ↓</span>
      </a>
      <a class="card post-card" href="#ac-dc">
        <span class="small">AC → DC</span>
        <h3>整流与 PFC</h3>
        <p>无源整流、Boost 型 PFC、图腾柱、Vienna 与有源前端。</p>
        <span class="post-card-more">查看拓扑 ↓</span>
      </a>
      <a class="card post-card" href="#dc-ac">
        <span class="small">DC → AC</span>
        <h3>逆变器</h3>
        <p>单相与三相桥式、电压源型以及多电平逆变器。</p>
        <span class="post-card-more">查看拓扑 ↓</span>
      </a>
      <a class="card post-card" href="#ac-ac">
        <span class="small">AC → AC</span>
        <h3>AC–AC 变换</h3>
        <p>背靠背变换、交流调压、周波变换与矩阵变换器。</p>
        <span class="post-card-more">查看拓扑 ↓</span>
      </a>
      <a class="card post-card" href="#modular">
        <span class="small">单元 → 系统</span>
        <h3>模块化与多级架构</h3>
        <p>并联功率级、级联单元、MMC 与固态变压器架构。</p>
        <span class="post-card-more">查看架构 ↓</span>
      </a>
    </div>
  </div>
</section>

<section class="section" id="dc-dc">
  <div class="container">
    <span class="section-badge">DC–DC</span>
    <h2>DC–DC 变换器系列</h2>
    <p class="lead">
      DC–DC 功率级用于调节直流母线、变换电压、提供电气隔离，或在电源、
      储能、负载与中间母线之间实现双向能量传输。
    </p>
    <div class="grid grid-four">
      <div class="card">
        <h3>非隔离经典拓扑</h3>
        <p><strong>Buck</strong> · 降压变换与负载点供电。</p>
        <p><strong>Boost</strong> · 升压变换、可再生能源接口与 PFC 基础功率级。</p>
        <p><strong>Buck–Boost</strong> · 当输入电压跨越输出范围时实现反相或非反相升降压。</p>
        <p><strong>SEPIC、Ćuk 与 Zeta</strong> · 具有不同纹波与极性特征的扩展升降压系列。</p>
      </div>
      <div class="card">
        <h3>交错并联与双向拓扑</h3>
        <p><strong>同步 Buck/Boost</strong> · 降低低压大电流场景中的导通损耗。</p>
        <p><strong>多相 Buck</strong> · 通过并联相实现均流并降低输出纹波。</p>
        <p><strong>交错 Boost 或 Buck–Boost</strong> · 提升功率等级并降低输入、输出纹波。</p>
        <p><strong>双向 Buck–Boost</strong> · 用于电池、超级电容与直流母线之间的能量交换。</p>
      </div>
      <div class="card">
        <h3>隔离型 PWM 变换器</h3>
        <p><strong>Flyback</strong> · 适用于辅助电源和较低功率场景的简单隔离变换。</p>
        <p><strong>Forward 与有源钳位 Forward</strong> · 采用输出电感的变压器隔离能量传输。</p>
        <p><strong>Push–Pull 与 Half-Bridge</strong> · 双端励磁，提高变压器利用率。</p>
        <p><strong>Full-Bridge 与 PSFB</strong> · 面向更高功率的隔离变换，并具有移相控制和软开关潜力。</p>
      </div>
      <div class="card">
        <h3>谐振与有源桥拓扑</h3>
        <p><strong>串联与并联谐振</strong> · 利用谐振腔实现软换流的基础拓扑系列。</p>
        <p><strong>LLC</strong> · 在设定谐振工作范围内实现高效率隔离变换。</p>
        <p><strong>CLLC</strong> · 两侧均采用有源桥的双向谐振变换。</p>
        <p><strong>双有源桥（DAB）</strong> · 通过两个有源桥之间的移相实现隔离型双向功率传输。</p>
        <p class="card-link"><a href="{{ '/zh/resources/prototypes/dab/' | relative_url }}" class="text-link">DAB 设计参考 →</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="ac-dc">
  <div class="container">
    <span class="section-badge">AC–DC</span>
    <h2>整流与 PFC 拓扑系列</h2>
    <p class="lead">
      AC–DC 拓扑选择取决于相数、功率因数、谐波限制、直流母线电压、
      双向功率流、半导体应力以及效率要求。
    </p>
    <div class="grid">
      <div class="card">
        <h3>无源与可控整流</h3>
        <p><strong>单相二极管整流桥</strong> · 面向较低功率及成本敏感系统的稳健前端。</p>
        <p><strong>三相六脉波整流桥</strong> · 用于工业驱动与直流母线的经典整流方案。</p>
        <p><strong>晶闸管整流器</strong> · 适用于允许电网换相的可控大功率变换。</p>
      </div>
      <div class="card">
        <h3>单相 PFC</h3>
        <p><strong>Boost PFC</strong> · 成熟且广泛使用的有源功率因数校正功率级。</p>
        <p><strong>交错 Boost PFC</strong> · 在较高功率下实现分相均流并降低纹波。</p>
        <p><strong>无桥 / 图腾柱 PFC</strong> · 消除整流桥导通损耗，实现高效率前端。</p>
      </div>
      <div class="card">
        <h3>三相有源前端</h3>
        <p><strong>Vienna 整流器</strong> · 单向三电平 PFC，可降低器件电压应力。</p>
        <p><strong>两电平有源前端（AFE）</strong> · 实现受控网侧电流与双向功率流。</p>
        <p><strong>三电平 NPC、ANPC 与 T-type AFE</strong> · 面向更高电压和更优波形质量的多电平前端。</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="dc-ac">
  <div class="container">
    <span class="section-badge">DC–AC</span>
    <h2>逆变器拓扑系列</h2>
    <p class="lead">
      逆变器将直流电源和母线连接到电机、电网、不间断电源、
      可再生能源系统及受控交流负载。
    </p>
    <div class="grid">
      <div class="card">
        <h3>桥式逆变器</h3>
        <p><strong>单相半桥</strong> · 配合分裂直流母线实现紧凑变换。</p>
        <p><strong>单相 H 桥</strong> · 采用双极性或单极性调制，充分利用直流母线。</p>
        <p><strong>三相两电平 VSI</strong> · 驱动与并网变换器中最常见的电压源型功率级。</p>
      </div>
      <div class="card">
        <h3>三电平与多电平拓扑</h3>
        <p><strong>NPC 与 ANPC</strong> · 降低器件电压应力的箝位型多电平变换。</p>
        <p><strong>T-type</strong> · 具有不同导通路径权衡的三电平变换。</p>
        <p><strong>飞跨电容型</strong> · 通过受控电容电压生成额外电平。</p>
        <p><strong>级联 H 桥（CHB）</strong> · 通过串联变换器单元实现模块化电压扩展。</p>
      </div>
      <div class="card">
        <h3>专用逆变器系列</h3>
        <p><strong>电流源型逆变器（CSI）</strong> · 用于特定工业驱动和并网场景的电流馈电变换。</p>
        <p><strong>Z 源与准 Z 源</strong> · 通过阻抗网络获得直通容错与升降压能力。</p>
        <p><strong>并联与交错逆变器</strong> · 通过协调调制和均流实现电流容量扩展。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="ac-ac">
  <div class="container">
    <span class="section-badge">AC–AC</span>
    <h2>AC–AC 变换器系列</h2>
    <p class="lead">
      AC–AC 系统通过直接变换或中间直流环节改变电压、频率、相位或功率流向。
    </p>
    <div class="grid grid-two">
      <div class="card">
        <h3>间接变换</h3>
        <p><strong>整流器–直流环节–逆变器</strong> · 变频驱动、UPS 与并网接口中的成熟架构。</p>
        <p><strong>背靠背有源变换器</strong> · 通过受控直流环节实现双向 AC–DC–AC 变换。</p>
      </div>
      <div class="card">
        <h3>直接变换</h3>
        <p><strong>交流调压器</strong> · 通过相位控制或周波控制应用于加热、照明与软启动。</p>
        <p><strong>周波变换器</strong> · 用于超大功率驱动的直接低频变换。</p>
        <p><strong>矩阵变换器</strong> · 不使用大容量直流储能环节的双向开关矩阵。</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="modular">
  <div class="container">
    <span class="section-badge">模块化与多级架构</span>
    <h2>从变换器单元到电力系统</h2>
    <p class="lead">
      大功率和中压系统通常通过协调重复的变换器单元构建，
      而不是无限放大单个开关功率级。
    </p>
    <div class="grid grid-four">
      <div class="card">
        <h3>并联与交错功率级</h3>
        <p>通过并联桥臂或完整模块提升电流容量，同时引入均流、移相交错、环流控制、投切相与故障管理等设计约束。</p>
      </div>
      <div class="card">
        <h3>级联 H 桥（CHB）</h3>
        <p>串联 H 桥单元合成多电平波形，并将总电压分配至各模块。单元电压平衡以及隔离或独立直流电源成为核心设计问题。</p>
      </div>
      <div class="card">
        <h3>模块化多电平变换器（MMC）</h3>
        <p>在桥臂中投入或旁路半桥、全桥子模块。调制、电容能量平衡、环流及分布式控制共同决定完整设计。</p>
      </div>
      <div class="card">
        <h3>固态变压器（SST）</h3>
        <p>SST 是多级系统架构，而不是单一拓扑。它可以组合有源或级联中压前端、隔离型 DAB 或 CLLC 单元、直流母线与低压逆变器。</p>
        <p class="card-link"><a href="{{ '/zh/resources/prototypes/sst/' | relative_url }}" class="text-link">SST 设计参考 →</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <span class="section-badge">面向智能体的工程数据</span>
    <h2>每个拓扑参考页面将包含什么</h2>
    <p class="lead">
      本页是整个资料库的地图。后续每个拓扑都会逐步补充结构化工程资料，
      让开发者或 Coding Agent 能够用它们约束、比较并验证设计。
    </p>
    <div class="grid grid-four">
      <div class="card">
        <h3>设计边界</h3>
        <p>输入输出范围、功率等级、变比、隔离、功率流向、工作模式及代表性应用。</p>
      </div>
      <div class="card">
        <h3>模型与方程</h3>
        <p>稳态增益、电流与电压应力、纹波、软开关边界、小信号特性及明确的建模假设。</p>
      </div>
      <div class="card">
        <h3>实现约束</h3>
        <p>半导体器件选型、磁性元件与滤波器、电容、热限制、EMI、调制、采样、保护与控制结构。</p>
      </div>
      <div class="card">
        <h3>证据与验证</h3>
        <p>仿真模型、参考设计、测试数据、效率图谱、损耗分解、BOM 背景及原始资料链接。</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <span class="section-badge">现有参考</span>
    <h2>当前设计参考</h2>
    <p class="lead">
      这些初步参考展示了如何在同一设计流程中连接拓扑、器件、磁性元件、调制与系统需求。
    </p>
    <div class="grid grid-two">
      <a class="card post-card" href="{{ '/zh/resources/prototypes/dab/' | relative_url }}">
        <span class="small">隔离型双向 DC–DC</span>
        <h3>双有源桥变换器</h3>
        <p>2&nbsp;kW DAB 参考设计，覆盖开关器件、高频磁性元件、移相控制与设计优化。</p>
        <span class="post-card-more">打开设计参考 →</span>
      </a>
      <a class="card post-card" href="{{ '/zh/resources/prototypes/sst/' | relative_url }}">
        <span class="small">模块化多级系统</span>
        <h3>固态变压器</h3>
        <p>模块化 SST 参考设计，将单元级电能变换与系统集成、协调控制连接起来。</p>
        <span class="post-card-more">打开设计参考 →</span>
      </a>
    </div>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/zh/plugin/' | relative_url }}">在 Coding Agent 中使用</a>
      <a class="btn btn-ghost" href="{{ '/zh/database/transistors/' | relative_url }}">晶体管数据库</a>
      <a class="btn btn-ghost" href="{{ '/zh/database/magnetics/' | relative_url }}">磁性元件数据库</a>
    </div>
  </div>
</section>
</main>
