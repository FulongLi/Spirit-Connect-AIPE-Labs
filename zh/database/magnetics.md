---
layout: default
title: 磁性元件数据库
lang: zh
permalink: /zh/database/magnetics/
description: 磁性元件数据库 —— 磁芯几何、铁氧体与粉芯材料、实测损耗曲面、直流偏磁下的磁导率，以及绕组导体数据，服务于变压器与电感设计自动化。
---

<header class="hero">
  <div class="container">
    <h1>磁性元件数据库</h1>
    <p class="lead">磁芯材料、Steinmetz 参数、绕组窗口与热数据 —— 用于自动化磁性元件设计。</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>磁性元件库</h2>
    <p class="lead">
      获取关于磁芯材料、绕组配置与热特性的全面数据，实现变压器与电感的自动化设计。
    </p>
    <div class="grid">
      <div class="card">
        <h3>磁芯材料</h3>
        <p>铁氧体、粉芯与纳米晶材料，附 B-H 曲线、Steinmetz 参数与频率相关损耗模型。</p>
      </div>
      <div class="card">
        <h3>绕组优化</h3>
        <p>绕组窗口分析、铜损计算与热降额，实现最优的功率密度与效率。</p>
      </div>
      <div class="card">
        <h3>热数据</h3>
        <p>热阻模型与安全工作区限值，在任务需求下实现可靠的磁性元件设计。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>库中包含什么</h2>
    <p class="lead section-lead-spaced">
      一个磁性元件同时是三样东西 —— 一个形状、一种材料、一组绕组。三者一并存储，
      因为其中任何一项发生变化，损耗、温升与窗口内的可容纳性都会随之改变。
    </p>

    <div class="db-figure-wide">
      {% include fig-magnetics-cores.html lang=page.lang %}
    </div>

    <div class="db-figure-wide">
      {% include fig-magnetics-windings.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-magnetics-coreloss.html lang=page.lang %}
      {% include fig-magnetics-permeability.html lang=page.lang %}
    </div>

    <p class="small db-figure-note">
      图示用于说明数据的存储形式。延伸阅读（英文）：
      <a href="{{ '/resources/blog/' | relative_url }}">技术博客</a>。
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>参数覆盖范围</h2>
    <p class="lead section-lead-spaced">
      按磁芯、按材料、按导体记录的字段 —— 足以完成变压器或电感的尺寸设计、预测损耗分布，
      并在绕制之前确认其确实装得下。
    </p>
    <div class="grid">
      <div class="card">
        <h3>磁芯几何</h3>
        <ul class="db-spec-list">
          <li><b>形状与规格代号</b> <span>E、ER、ETD、PQ、RM、ELP、环形</span></li>
          <li><b>A<sub>e</sub>、ℓ<sub>e</sub>、V<sub>e</sub></b> <span>有效磁参数</span></li>
          <li><b>窗口 A<sub>w</sub>、平均匝长</b> <span>绕组面积与 MLT</span></li>
          <li><b>A<sub>L</sub> 与气隙</b> <span>按气隙长度，含边缘效应</span></li>
          <li><b>质量与表面积</b> <span>用于损耗密度与散热</span></li>
          <li><b>热阻 / 自然对流</b> <span>K/W 随风速变化</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>磁芯材料</h3>
        <ul class="db-spec-list">
          <li><b>铁氧体</b> <span>MnZn 功率牌号、NiZn</span></li>
          <li><b>粉芯</b> <span>铁硅铝、高磁通、MPP、铁粉芯</span></li>
          <li><b>纳米晶与非晶</b> <span>卷绕带材磁芯</span></li>
          <li><b>B–H 环、B<sub>sat</sub>(T)</b> <span>实测，按温度分辨</span></li>
          <li><b>损耗曲面 P<sub>v</sub>(f, B̂, T)</b> <span>附 Steinmetz / iGSE 拟合</span></li>
          <li><b>µ<sub>i</sub>、µ(H<sub>dc</sub>)、居里点</b> <span>偏磁衰减与温度极限</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>绕组材料</h3>
        <ul class="db-spec-list">
          <li><b>实心圆线</b> <span>AWG / 公制、漆包等级、外径</span></li>
          <li><b>利兹线</b> <span>股数 × 股径、编织结构</span></li>
          <li><b>铜箔 / 铜带</b> <span>厚度 × 高度、边缘处理</span></li>
          <li><b>PCB 平面绕组</b> <span>铜厚、层叠、过孔阵列</span></li>
          <li><b>ρ(T)、趋肤深度 δ(f)</b> <span>交流电阻比 F<sub>R</sub></span></li>
          <li><b>绝缘与爬电</b> <span>三层绝缘线、挡墙胶带、绝缘等级</span></li>
        </ul>
      </div>
    </div>
    <ul class="db-tags">
      <li>带气隙电感</li>
      <li>PFC 升压电感</li>
      <li>LLC 谐振腔</li>
      <li>集成 L<sub>r</sub> / L<sub>m</sub></li>
      <li>DAB / SST 变压器</li>
      <li>平面变压器</li>
      <li>共模电感</li>
      <li>电流互感器</li>
      <li>反激耦合电感</li>
    </ul>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>磁性元件测量</h2>
    <p class="lead">
      精确的电流检测支撑磁性元件验证、损耗提取与闭环测试。我们的 PCB 罗氏线圈设计参考介绍了一款用于变换器与电感表征工作流的精密传感器。
    </p>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/zh/resources/prototypes/rogowski-coil/' | relative_url }}">罗氏线圈设计参考</a>
      <a class="btn btn-ghost" href="{{ '/zh/database/transistors/' | relative_url }}">晶体管数据库</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">联系我们</a>
    </div>
  </div>
</section>
