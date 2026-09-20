---
layout: default
title: 工程数据库
lang: zh
permalink: /zh/resources/database/
description: 面向电力电子分析、元件选型、建模与设计自动化的功率半导体和磁性元件数据库。
---

<header class="database-hero library-hero">
  <div class="container">
    <span class="section-kicker">结构化的工程证据</span>
    <h1>让数据真正成为设计的一部分。</h1>
    <p class="lead">面向器件选型、损耗建模和 AI 辅助工程流程的可复用半导体与磁性元件数据，并始终保留测试条件和数据来源。</p>
  </div>
</header>

<section class="section database-library-section">
  <div class="container">
    <div class="database-library-heading">
      <div>
        <span class="section-kicker">两个相互连接的数据库</span>
        <h2>从开关瞬态一直连接到磁性元件。</h2>
      </div>
      <p>电气与磁性记录会在同一个变换器计算中相遇，而不是停留在彼此割裂的数据手册摘要里。</p>
    </div>

    <div class="database-collection-grid">
      <a class="database-collection-card database-collection-card-dark" href="{{ '/zh/database/transistors/' | relative_url }}">
        <div class="database-collection-copy">
          <div class="database-collection-meta"><span>数据库 01</span><span>功率半导体</span></div>
          <h2>晶体管<br>数据库</h2>
          <p>SiC、GaN、IGBT 与硅器件的规格、开关特性、热特性和选型参考。</p>
          <ul class="database-chip-list" aria-label="晶体管数据库覆盖内容">
            <li>I–V 与 C–V 曲线</li><li>双脉冲波形</li><li>E<sub>on</sub> / E<sub>off</sub></li><li>Z<sub>th</sub> 热网络</li>
          </ul>
          <strong>浏览晶体管数据 →</strong>
        </div>
        <div class="database-collection-visual">
          <span class="database-visual-label">电气行为 · 温度 · 时间</span>
          {% include fig-db-card-transistor.html lang=page.lang %}
          <div class="database-visual-axis"><span>静态</span><span>开关</span><span>热学</span></div>
        </div>
      </a>

      <a class="database-collection-card database-collection-card-accent" href="{{ '/zh/database/magnetics/' | relative_url }}">
        <div class="database-collection-copy">
          <div class="database-collection-meta"><span>数据库 02</span><span>磁性元件</span></div>
          <h2>磁性元件<br>数据库</h2>
          <p>用于变压器和电感设计的磁芯材料、损耗参数、绕组信息与热数据。</p>
          <ul class="database-chip-list" aria-label="磁性元件数据库覆盖内容">
            <li>磁芯几何</li><li>损耗曲面</li><li>µ 随直流偏磁</li><li>绕组导体</li>
          </ul>
          <strong>浏览磁性元件数据 →</strong>
        </div>
        <div class="database-collection-visual">
          <span class="database-visual-label">几何 · 材料 · 激励</span>
          {% include fig-db-card-magnetics.html lang=page.lang %}
          <div class="database-visual-axis"><span>磁芯</span><span>绕组</span><span>损耗</span></div>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="section section-alt database-method-section">
  <div class="container">
    <div class="database-method-heading">
      <span class="section-kicker">为什么数据结构很重要</span>
      <h2>为计算而建，<br>不只是为了浏览。</h2>
      <p>数据手册面向逐个查看器件的工程师；这些记录则面向需要比较成千上万个工作点的求解器。</p>
    </div>
    <div class="database-principles">
      <div><span>01</span><h3>曲线优先，而非标称值</h3><p>C<sub>oss</sub>(V)、P<sub>v</sub>(f, B̂, T)、µ(H<sub>dc</sub>) 与 Z<sub>th</sub>(t) 保留决定设计能否闭合的真实行为。</p></div>
      <div><span>02</span><h3>条件始终与数值同行</h3><p>偏置、温度、栅极电阻、回路电感和激励波形随每个数值保存，确保比较有意义。</p></div>
      <div><span>03</span><h3>数据来源可追溯</h3><p>数字化与实测记录均保留来源、版本、夹具和不确定度，便于后续评审。</p></div>
      <div><span>04</span><h3>模型闭合整个设计环</h3><p>开关能量、磁芯损耗和热网络围绕工作点或任务剖面联合求解。</p></div>
      <div><span>05</span><h3>默认机器可读</h3><p>结构化曲线和曲面可直接进入脚本、优化器与设计 Agent，无需再次抄录。</p></div>
      <div><span>06</span><h3>通过测量持续扩展</h3><p>尚未收录的器件可以按照相同数据结构完成表征，让私有与公开工程流程保持一致。</p></div>
    </div>
  </div>
</section>

<section class="section database-cta-section">
  <div class="container database-cta">
    <div>
      <span class="section-kicker">扩展数据库</span>
      <h2>需要我们尚未收录的器件或磁芯？</h2>
    </div>
    <div>
      <p>我们按需表征半导体与磁性元件，并以同样可复用、可追溯的格式交付数据。</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="{{ '/zh/contact/' | relative_url }}">申请表征服务</a>
        <a class="btn btn-ghost" href="{{ '/zh/power/devices/characterisation/' | relative_url }}">我们如何测量</a>
      </div>
    </div>
  </div>
</section>
