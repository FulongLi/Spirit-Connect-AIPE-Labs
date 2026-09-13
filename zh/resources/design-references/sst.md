---
layout: default
title: 固态变压器设计参考
lang: zh
permalink: /zh/resources/design-references/sst/
description: 模块化固态变压器（SST）架构设计参考 —— 从单元级变换器设计到系统级集成与控制。
---

<header class="hero">
  <div class="container">
    <h1>固态变压器</h1>
    <p class="lead">模块化 SST 设计参考 —— 从单元级变换器设计到系统级集成与控制。</p>
    <p class="reference-note">{% include status.html key="analytical" %} 基于解析分析并写明假设。本页不报告任何硬件实测结果。</p>
  </div>
</header>

<section class="section"><div class="container"><p><a href="{% post_url 2026-09-10-three-stage-solid-state-transformer %}">阅读三级式 SST 完整系列教程（英文）→</a></p><p>相关文章是解析性的教学草稿。它们写明各自的假设，并区分「计划中的模型与硬件」与「已完成的验证」。</p></div></section>

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
        <p>AC-DC 整流、隔离 DC-DC 变换（DAB）与 DC-AC 逆变 —— 每一级都围绕同一份系统规格设计，而不是各自孤立地设计。</p>
      </div>
      <div class="card">
        <h3>模块化单元设计</h3>
        <p>级联 H 桥或模块化多电平单元，把器件选型、磁性元件设计与全模块热平衡作为同一个问题处理。</p>
      </div>
      <div class="card">
        <h3>中压运行</h3>
        <p>面向中压等级的设计，其绝缘配合、dv/dt 管理与模块间均压都需要专门的工程工作与验证。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>本设计参考涵盖的内容</h2>
    <p class="lead section-lead-spaced">
      本参考遵循<a href="{{ '/zh/resources/' | relative_url }}">能力体系</a>中发布的
      <code>system-integration</code> 工作流。该工作流的状态是<em>文档说明</em>：
      步骤顺序与每一步所需材料均已公开，但它尚不是可直接执行的流水线，
      本页也没有任何内容是自动生成的。
    </p>
    <div class="grid">
      <div class="card">
        <h3>拓扑比较</h3>
        <p>针对隔离级，从效率、功率密度与故障容错角度比较 DAB、LLC 与谐振 CLLC 单元，并写明每次比较所依据的假设。</p>
      </div>
      <div class="card">
        <h3>控制协同设计</h3>
        <p>分层控制：单元级软开关与均流、级间电压调节、系统级功率流动管理，以及三者之间的职责划分。</p>
      </div>
      <div class="card">
        <h3>验证规划</h3>
        <p>一次实际制作所需的测试方案 —— 效率映射、热循环与故障注入 —— 以里程碑的形式写出。本页不发布测量数据。</p>
      </div>
    </div>
    <p class="small reference-note">
      所用数据库：晶体管与磁性元件记录。所用工具：用于绘制原理图的 AIPE-Sketch。
      AIPE 专业智能体尚未发布，因此本页没有任何一步是由智能体完成的。
    </p>
  </div>
</section>
