---
layout: default
title: 晶体管数据库
lang: zh
permalink: /zh/resources/databases/transistors/
description: SiC、GaN、IGBT 与硅 MOSFET 数据库 —— 实测开关波形、电容曲线、开关损耗表与热网络，服务于电力电子设计自动化。
---

<header class="hero">
  <div class="container">
    <h1>晶体管数据库</h1>
    <p class="lead">在你的任务需求下进行 SiC/GaN/IGBT 选型。</p>
    <p class="reference-note">{% include status.html key="experimental" %} 处于早期并持续扩充。本页描述的是每条记录所遵循的存储格式；收录范围尚不完整，数据也尚未作为公开下载发布。</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>综合器件库</h2>
    <p class="lead">
      晶体管数据库按下列类别，收录功率半导体器件的详细规格、开关特性与热特性。
    </p>
    <div class="grid">
      <div class="card">
        <h3>宽禁带器件</h3>
        <p>碳化硅（SiC）与氮化镓（GaN）晶体管，附全面的开关损耗数据与热模型。</p>
      </div>
      <div class="card">
        <h3>传统半导体</h3>
        <p>IGBT 与 MOSFET 器件库，含数据手册参数与经验证的性能模型。</p>
      </div>
      <div class="card">
        <h3>任务需求分析</h3>
        <p>针对你特定的工况、效率目标与热约束进行优化的器件选型。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>一条器件记录包含什么</h2>
    <p class="lead section-lead-spaced">
      仅凭型号和几个标称值无法完成变换器设计。每条记录都以<em>曲线与波形</em>的形式存储 ——
      这才是损耗模型、热求解器或 AI 设计智能体真正可以直接使用的形式。
    </p>

    <div class="db-figure-wide">
      {% include fig-transistor-dpt.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-transistor-iv.html lang=page.lang %}
      {% include fig-transistor-cv.html lang=page.lang %}
    </div>

    <div class="db-figure-grid">
      {% include fig-transistor-esw.html lang=page.lang %}
      {% include fig-transistor-zth.html lang=page.lang %}
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
      每个器件所记录的字段，均附带测试条件。脱离条件的数值不成其为数据 ——
      因此偏置、温度、驱动电压与回路电感始终与数值一同保存。
    </p>
    <div class="grid">
      <div class="card">
        <h3>静态与封装</h3>
        <ul class="db-spec-list">
          <li><b>V<sub>DS</sub> / V<sub>CES</sub></b> <span>阻断电压</span></li>
          <li><b>R<sub>DS(on)</sub>(T<sub>j</sub>)</b> <span>mΩ，归一化曲线</span></li>
          <li><b>I<sub>D</sub>–V<sub>DS</sub> 曲线族</b> <span>按 V<sub>GS</sub>、按 T<sub>j</sub></span></li>
          <li><b>V<sub>th</sub>、g<sub>fs</sub></b> <span>含阈值回滞</span></li>
          <li><b>体二极管 / 续流管</b> <span>V<sub>F</sub>、Q<sub>rr</sub>、t<sub>rr</sub></span></li>
          <li><b>封装与封装尺寸</b> <span>爬电距离、杂散电感、开尔文源</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>动态</h3>
        <ul class="db-spec-list">
          <li><b>C<sub>iss</sub>、C<sub>oss</sub>、C<sub>rss</sub>(V)</b> <span>完整曲线而非单点</span></li>
          <li><b>Q<sub>g</sub>、Q<sub>gd</sub>、Q<sub>oss</sub>、E<sub>oss</sub></b> <span>由曲线积分得到</span></li>
          <li><b>E<sub>on</sub>、E<sub>off</sub></b> <span>随 I、V<sub>DC</sub>、T<sub>j</sub>、R<sub>g</sub></span></li>
          <li><b>dv/dt、di/dt</b> <span>实测，按驱动电阻</span></li>
          <li><b>过冲与振铃</b> <span>附回路电感条件</span></li>
          <li><b>原始双脉冲波形</b> <span>CSV，可重新分析</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>热与可靠性</h3>
        <ul class="db-spec-list">
          <li><b>R<sub>th(j-c)</sub>、R<sub>th(j-a)</sub></b> <span>K/W，附边界条件</span></li>
          <li><b>Z<sub>th</sub> 网络</b> <span>Foster / Cauer R–C 阶梯</span></li>
          <li><b>SOA 与短路能力</b> <span>耐受时间、能量</span></li>
          <li><b>功率循环数据</b> <span>ΔT<sub>j</sub> 与失效循环数</span></li>
          <li><b>降额规则</b> <span>电压、电流、温度</span></li>
          <li><b>模型链接</b> <span>SPICE、PLECS、ANN 代理模型</span></li>
        </ul>
      </div>
    </div>
    <ul class="db-tags">
      <li>SiC MOSFET</li>
      <li>SiC JFET / 级联</li>
      <li>GaN HEMT（增强型）</li>
      <li>GaN 级联</li>
      <li>Si MOSFET</li>
      <li>Si 超结</li>
      <li>IGBT（分立）</li>
      <li>IGBT 模块</li>
      <li>逆导与逆阻器件</li>
      <li>SiC 肖特基二极管</li>
    </ul>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>如何服务于设计</h2>
    <div class="grid">
      <div class="card">
        <h3>在约束下筛选</h3>
        <p>按阻断电压、电流、封装与成本过滤，再按<em>你的</em>工作点下计算出的损耗排序，而不是按数据手册的标称值排序。</p>
      </div>
      <div class="card">
        <h3>闭合电-热回路</h3>
        <p>开关损耗表与 Z<sub>th</sub> 网络联立求解，结温、损耗与降额随之收敛，而不是靠假设。</p>
      </div>
      <div class="card">
        <h3>可被智能体读取</h3>
        <p>记录格式的设计目标，是让 Coding Agent 给出器件选择时能同时给出支撑它的测试条件与实测数据，而不是只给一个型号。</p>
      </div>
    </div>
    <div class="hero-actions section-actions align-left">
      <a class="btn btn-primary" href="{{ '/zh/power/devices/characterisation/' | relative_url }}">器件表征</a>
      <a class="btn btn-ghost" href="{{ '/zh/resources/databases/magnetics/' | relative_url }}">磁性元件数据库</a>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">申请访问</a>
    </div>
  </div>
</section>
