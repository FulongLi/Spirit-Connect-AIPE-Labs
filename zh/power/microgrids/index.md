---
layout: default
title: 微电网
lang: zh
permalink: /zh/power/microgrids/
description: 风能、太阳能光伏、燃料电池与储能在直流、交流及交直流混合微电网中的接入 —— 涵盖功率接口、控制、保护与能量管理。
---

<header class="hero power-library-hero">
  <div class="container">
    <h1>微电网</h1>
    <p class="lead">将可再生能源与储能接入直流和交流微电网，并对系统进行设计、建模与控制，实现韧性且高效的能源分配。</p>
  </div>
</header>

<section class="section power-overview-section">
  <div class="container">
    <div class="power-overview-heading">
      <span class="section-kicker">选择系统架构</span>
      <h2>微电网解决方案</h2>
      <p class="lead">
        微电网是一组边界清晰的电源、储能与负荷，既可并网运行，也可独立运行。
        正是“孤岛”这一项能力，使架构选择变得举足轻重：控制、保护与电能质量的一切，
        都取决于能量究竟落在哪条母线上。
      </p>
    </div>
    <div class="grid power-overview-grid">
      <div class="card power-overview-card">
        <h3>直流微电网</h3>
        <p>高效的直流配电系统，配以先进控制策略，实现最优的能量管理与可靠性。</p>
      </div>
      <div class="card power-overview-card">
        <h3>交流微电网</h3>
        <p>并网与孤岛运行的交流微电网架构，具备无缝切换能力与电能质量管理。</p>
      </div>
      <div class="card power-overview-card">
        <h3>交直流混合架构</h3>
        <p>融合交流与直流配电优势的一体化系统，实现最高的效率与灵活性。</p>
      </div>
    </div>
  </div>
</section>

{% include microgrid-energy-sources.html lang=page.lang %}

<section class="section">
  <div class="container">
    <h2>三种架构，三类不同的问题</h2>
    <p class="lead section-lead-spaced">
      母线就是架构。选择直流、交流还是两者兼有，决定了从一块光伏板到一个负载之间要经过几级变换、
      由哪个物理量来承载功率平衡信息，以及清除一次故障需要付出什么代价。
    </p>

    <div class="db-figure-grid">
      {% include fig-microgrid-dc.html lang=page.lang %}
      {% include fig-microgrid-ac.html lang=page.lang %}
    </div>

    <div class="db-figure-wide">
      {% include fig-microgrid-hybrid.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>直流的长处</h3>
        <p>光伏、电池、燃料电池、LED 照明、变频驱动与电动汽车充电本质上都是直流。挂在直流母线上，双向各省一级变换，损耗与硬件一并省掉。</p>
        <p>没有频率、没有相角、没有无功、无需同步。功率分配只需要一个变量 —— 母线电压。</p>
      </div>
      <div class="card">
        <h3>直流的难处</h3>
        <p>直流故障电流没有自然过零点，开断需要固态或混合式断路器，并要主动限制故障电流；选择性必须专门设计，而非沿用既有经验。</p>
        <p>调节良好的变流器在输入端表现为恒功率负载，其负增量阻抗会破坏母线稳定性 —— 除非电源阻抗与母线电容是针对它设计的。</p>
      </div>
      <div class="card">
        <h3>交流仍然占优的地方</h3>
        <p>保护规程、开关柜、变压器、计量与电机负载都已存在并取得认证，电压变换由一个无源元件完成。</p>
        <p>代价在控制端：频率与电压同时承载功率平衡，至少要有一台构网变流器，且孤岛与重新并网不能产生相位突变。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>控制与运行</h2>
    <p class="lead section-lead-spaced">
      微电网没有无穷大母线可以依靠。孤岛运行时，必须由变流器自己建立电压与频率、彼此不争抢地分担负荷，
      并在主网恢复后干净地交还控制权。
    </p>

    <div class="db-figure-grid">
      {% include fig-microgrid-droop.html lang=page.lang %}
      {% include fig-microgrid-control.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>构网与跟网</h3>
        <p>跟网型变流器需要一个已存在的电压供锁相环锁定 —— 主网在时完美，主网一失去便毫无作用。构网型变流器表现为阻抗背后的电压源，自行建立参考。可孤岛的微电网至少需要一台，通常还需要它们之间能够分担。</p>
      </div>
      <div class="card">
        <h3>孤岛检测与重新并网</h3>
        <p>检出孤岛、不中断负荷地完成切换，再在重合闸前匹配电压、相位与频率。被动式检测存在检测盲区，主动式方法需注入小扰动。大多数调试问题都出在这次切换上。</p>
      </div>
      <div class="card">
        <h3>并不存在的惯量</h3>
        <p>以变流器为主的微电网几乎没有旋转惯量，扰动后的频率变化率很高。虚拟同步机与虚拟惯量方案对其进行模拟，以储能裕度与带宽换取更慢、更宽容的频率响应。</p>
      </div>
      <div class="card">
        <h3>故障电流受限下的保护</h3>
        <p>变流器无法提供过流保护所假定的数倍额定电流。孤岛整定值与并网整定值不同，配合往往需要方向、差动或依赖通信的方案，而非简单的时间级差。</p>
      </div>
      <div class="card">
        <h3>电能质量与谐波</h3>
        <p>谐波由开关变流器产生，而孤岛运行的弱网阻抗又很高，于是畸变与谐振相互耦合。滤波器设计与变流器输出阻抗整形不再是两个独立问题。</p>
      </div>
      <div class="card">
        <h3>能量管理</h3>
        <p>在快速环路之上是调度问题：预测、荷电状态、衰减成本、电价，以及与主网的功率交换计划。这一层决定经济性，下面几层决定系统是否还站得住。</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>固态变压器 —— 功率路由器</h2>
    <p class="lead section-lead-spaced">
      对"混合架构"这个问题，SST 给出了最干净的答案。不再是一台工频变压器外加一圈各自独立的变流器，
      而是由一台多级设备同时提供中压接入、隔离与微电网所需的全部端口 —— 并且端口之间的功率流向是可控的。
    </p>

    <div class="db-figure-wide">
      {% include fig-microgrid-sst.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>它替代了什么</h3>
        <p>工频变压器。隔离转移到隔离型 DC–DC 级内部的高频变压器上 —— 这正是磁性元件体积能缩小一个数量级的原因。</p>
      </div>
      <div class="card">
        <h3>它增加了什么</h3>
        <p>双向功率流动、与匝比无关的电压调节、中间直流环节上天然的直流端口、中压侧的无功支撑与谐波治理，以及无源变压器无法提供的穿越能力。</p>
      </div>
      <div class="card">
        <h3>它的代价</h3>
        <p>串联的中压单元、绝缘配合、单元电压均衡、分布式控制，以及必须胜过一个 99% 效率无源元件才能成立的效率要求。</p>
      </div>
    </div>

    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/zh/resources/prototypes/sst/' | relative_url }}">SST 设计参考</a>
      <a class="btn btn-ghost" href="{{ '/zh/power/converters/' | relative_url }}">变换器拓扑</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">联系我们</a>
    </div>

    <p class="small db-figure-note">
      英文技术文章中有逐级展开的固态变压器系列（应用与动机、架构、AC–DC 前级、DAB 隔离级、DC–AC 输出级、模块化集成与测试），
      见 <a href="{{ '/resources/blog/' | relative_url }}">技术博客</a>。
    </p>
  </div>
</section>
