---
layout: default
title: 磁性元件
lang: zh
permalink: /zh/power/magnetics/
description: 磁性元件领域 —— 磁芯材料与几何、损耗与磁导率特性、绕组设计，以及面向功率变换器的高频变压器与电感设计。
---

<header class="hero">
  <div class="container">
    <h1>磁性元件</h1>
    <p class="lead">
      决定变换器体积的元件。磁芯形状、材料与绕组必须一起选定 ——
      任何一项改变，都会改变损耗、温升以及在绕组窗口中的可行性。
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>磁性元件在设计链中的位置</h2>
    <p class="lead">
      磁性元件从来不能孤立地指定。它的激励来自拓扑与开关频率，热限制来自结构与散热，
      而公差则由必须与之共存的控制环路决定。
    </p>
    <div class="grid">
      <div class="card">
        <h3>由变换器决定</h3>
        <p>伏秒积、电流纹波、直流偏置与波形形状由拓扑和调制方式给出，在选择磁芯之前就已确定磁通摆幅。</p>
      </div>
      <div class="card">
        <h3>受损耗与温度限制</h3>
        <p>真实激励下的磁芯损耗，以及真实频谱下的绕组损耗，共同决定温升，而温升决定设计是否成立。</p>
      </div>
      <div class="card">
        <h3>受绝缘约束</h3>
        <p>爬电距离、电气间隙与绝缘等级决定绕组排布，进而决定漏感 —— 漏感往往是设计参数，而非寄生量。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>形状、材料与绕组</h2>
    <p class="lead section-lead-spaced">
      这三项选择需要一起存储、一起推理。下面的图与磁性元件数据库使用同一套图示，
      因为知识与数据描述的是同一个对象。
    </p>

    <div class="db-figure-wide">
      {% include fig-magnetics-cores.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-magnetics-coreloss.html lang=page.lang %}
      {% include fig-magnetics-permeability.html lang=page.lang %}
    </div>

    <p class="small db-figure-note">
      损耗是关于频率、磁通密度与温度的曲面，磁导率则随直流偏磁变化。
      样本手册上的单点数值会把这两者都掩盖掉，因此数据库存储曲线，并为每个数值记录测试条件。
    </p>

    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/zh/resources/databases/magnetics/' | relative_url }}">磁性元件数据库</a>
      <a class="btn btn-ghost" href="{{ '/zh/power/converters/' | relative_url }}">变换器拓扑</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow-center">
    <h2>已公开的磁性元件资料</h2>
    <p class="lead">
      目前覆盖较完整的是高频隔离变压器、耦合电感与松耦合线圈。
      优化与有限元流程以工程笔记的形式说明，尚未作为自动化能力提供。
    </p>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/zh/resources/design-references/rogowski-coil/' | relative_url }}">罗氏线圈设计参考</a>
      <a class="btn btn-ghost" href="{{ '/zh/resources/blog/' | relative_url }}">工程笔记</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">申请磁性元件数据</a>
    </div>
  </div>
</section>
