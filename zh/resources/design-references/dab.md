---
layout: default
title: DAB 变换器设计参考
lang: zh
permalink: /zh/resources/design-references/dab/
description: 双有源桥（DAB）变换器设计参考 —— 器件、磁性元件、控制环路与验证规划。
---

<header class="hero">
  <div class="container">
    <h1>DAB 变换器设计参考</h1>
    <p class="lead">一条完整的 DAB 级设计流程 —— 开关器件、磁性元件、控制环路与验证。系列教程另以一台 100 W 单元为例展开。</p>
    <p class="reference-note">{% include status.html key="analytical" %} 基于解析分析并写明假设。本页不报告任何硬件实测结果。</p>
  </div>
</header>

<section class="section"><div class="container"><p><a href="{% post_url 2026-09-10-dab-converter-from-principles-to-control %}">阅读 DAB 电路、建模与控制教程（英文）→</a></p><p>相关文章是解析性的教学草稿。它们写明各自的假设，并区分「计划中的模型与硬件」与「已完成的验证」。</p></div></section>

<section class="section">
  <div class="container">
    <h2>设计流程</h2>
    <p class="lead">
      本设计参考遵循<a href="{{ '/zh/resources/' | relative_url }}">能力体系</a>中发布的
      <code>converter-design</code> 工作流：需求、拓扑与调制、器件选型、磁性元件、小信号模型、
      控制设计与测试方案。该工作流的状态是<em>文档说明</em> —— 步骤与每一步所需材料均已公开，
      但它尚不是可直接执行的流水线。
    </p>
    <div class="grid">
      <div class="card">
        <h3>拓扑与参数</h3>
        <p>围绕规格选择相数、变压器变比与滤波器参数，并写清约束条件与可行性检查，使这些取舍可以被复核与质疑。</p>
      </div>
      <div class="card">
        <h3>控制综合</h3>
        <p>移相与三重移相调制、由此得到的小信号模型，以及在此基础上推导的电流与电压调节环路。</p>
      </div>
      <div class="card">
        <h3>验证规划</h3>
        <p>一次实际制作需要满足的测试矩阵、效率与热测量点及通过标准。仅为规划，本页不发布测量数据。</p>
      </div>
    </div>
    <p class="small reference-note">
      所用数据库：晶体管与磁性元件记录。所用工具：用于绘制原理图的 AIPE-Sketch。
      AIPE 专业智能体尚未发布，因此本页没有任何一步是由智能体完成的。
    </p>
  </div>
</section>
