---
layout: default
title: 功率半导体器件
lang: zh
math: true
permalink: /zh/power/devices/
description: 开关如何实现 —— 功率二极管、MOSFET、IGBT、SiC 与 GaN。面向电力电子设计自动化的导通物理、器件电容、漏电流、封装寄生参数与开关损耗。
---

<header class="hero">
  <div class="container">
    <h1>功率半导体器件</h1>
    <p class="lead">开关如何实现：导通物理、电容、漏电流与封装寄生参数 —— 以及 SiC 与 GaN 如何改写了答案。</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>开关的实现</h2>
    <p class="lead eq-lead">
      变换器原理图里画的是理想开关，硅片不是。连接两者的问题，正是 Erickson 与 Maksimović 在
      <em>switch realization</em> 一章中放在核心位置的那一个：这个开关必须工作在 \(( v,\, i )\) 平面的哪些象限？
      拓扑给出答案，而答案在翻开任何一份数据手册之前就已经收窄了器件选择。
    </p>

    <div class="db-figure-wide">
      {% include fig-device-quadrants.html lang=page.lang %}
    </div>

    <div class="grid">
      <div class="card">
        <h3>单象限（SPST）</h3>
        <p>只导通一个方向的电流，只阻断一个极性的电压。一只晶体管即可。Buck、Boost 与正激变换器不需要更多 —— 无源开关由二极管担任。</p>
      </div>
      <div class="card">
        <h3>电流双向</h3>
        <p>两个方向都能导通，只阻断一个极性。MOSFET 天然具备：体二极管就是反并联通路。所有电压型逆变桥臂与同步整流都属于这一类。</p>
      </div>
      <div class="card">
        <h3>电压双向</h3>
        <p>只导通一个方向，但两个极性的电压都要阻断。需要串联二极管 —— 这正是电流型逆变器与晶闸管整流器所用器件本身反向阻断能力不足的原因。</p>
      </div>
    </div>
    <p class="small db-figure-note">
      同步整流值得单独一提：它是把电流双向开关<em>当作</em>无源开关来用，以 \(I \cdot R_{DS(on)}\) 取代二极管压降。
      只有当导通电阻仍低于二极管正向压降除以电流时，这笔替换才划算 —— 而这恰恰是本页其余内容所讨论的取舍。
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>导通：多子与少子</h2>
    <p class="lead eq-lead">
      功率器件靠一层低掺杂漂移区来承受电压。让这层区域导电只有两种方式，而器件家族的其余一切特性，都由它采用哪一种决定。
    </p>

    <h3>单极型 —— 漂移区按欧姆导电</h3>
    <p>
      在 MOSFET、HEMT 或肖特基二极管中只有多子参与输运，漂移区表现为一个电阻，导通特性是一条过原点的直线：
    </p>
    <div class="eq-block">\[ v_{DS} = I \cdot R_{DS(on)}(T_j), \qquad R_{DS(on)} \propto T_j^{\,\alpha},\ \ \alpha \approx 2.3\ \text{(Si)},\ \ 1.6\text{–}2.0\ \text{(SiC)} \]</div>
    <p>
      这个正温度系数是优点而非缺陷：温度升高的管子会自动少分流，因此并联芯片无需外部均流电阻即可自然均衡。
      代价是 \(R_{DS(on)}\) 随所需阻断电压急剧上升 —— 也就是下文的单极型极限。
    </p>

    <h3>双极型 —— 注入载流子调制电导</h3>
    <p>
      PiN 二极管、BJT 与 IGBT 向漂移区注入大量少子，区域电阻率因而塌缩，导通特性变成一个结压降加一段小电阻：
    </p>
    <div class="eq-block">\[ v_{CE} = V_{CE0} + I \cdot r_{CE} \]</div>
    <p>
      这几乎与阻断电压无关，正是 IGBT 至今仍占据 3.3 kV 以上市场的原因。但换来低导通压降的那部分电荷，
      必须在器件重新阻断之前被抽走：
    </p>
    <div class="eq-block">\[ Q_{stored} = I_F \,\tau, \qquad E_{tail} \approx V_{DC}\, Q_{stored} \]</div>
    <p class="eq-where">
      \(\tau\) 是少子寿命。缩短它（寿命控制、辐照）可以加快开关，但导通压降随之上升。
      这一个旋钮就是双极型器件"速度—导通"取舍的全部。
    </p>

    <div class="db-figure-grid">
      {% include fig-device-onstate.html lang=page.lang %}
      {% include fig-device-recovery.html lang=page.lang %}
    </div>

    <h3>恢复电荷由对管买单</h3>
    <p>
      当二极管以 \(di/dt\) 的速率被换流关断时，存储电荷以反向电流的形式出现。峰值与恢复电荷由换流斜率联系在一起：
    </p>
    <div class="eq-block">\[ I_{RRM} = \sqrt{2\,Q_{rr}\left|\frac{di}{dt}\right|}, \qquad Q_{rr} \approx \tfrac{1}{2} I_{RRM}\, t_{rr}, \qquad E_{rr} \approx Q_{rr}\, V_{DC} \]</div>
    <p class="eq-where">
      \(E_{rr}\) 消耗在<em>对侧</em>晶体管上，成为它自身重叠损耗之外的额外开通损耗；而 \(Q_{rr}\) 本身还随温度和 \(di/dt\) 增大。
      SiC 肖特基二极管没有存储电荷，其反向电流只是流入 \(C_j\) 的位移电流，基本与温度无关。
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>阻断：漏电流、禁带宽度与热失控</h2>
    <p class="lead eq-lead">
      关断态同样不是免费的。反向漏电流由本征载流子浓度决定，而后者对禁带宽度呈指数依赖 ——
      这才是宽禁带材料与硅之间真正的分水岭。
    </p>
    <div class="eq-block">\[ n_i \propto T^{3/2} e^{-E_g / 2kT}, \qquad I_{leak} \propto n_i^{2}\ \text{(扩散)} \quad\text{或}\quad n_i\ \text{(产生)} \]</div>
    <p>
      硅的 \(E_g\) 为 1.12 eV，4H-SiC 为 3.26 eV，GaN 为 3.4 eV。室温下这意味着 \(n_i\) 相差十个数量级以上。
      阻断损耗 \(P_{off} = V_{DC} I_{leak}\) 通常可以忽略 —— 直到它不能忽略为止，因为漏电流随温度上升的速度可能超过封装散热的能力：
    </p>
    <div class="eq-block">\[ \frac{\partial P_{off}}{\partial T_j}\, R_{th(j-a)} \;>\; 1 \quad\Longrightarrow\quad \text{热失控} \]</div>

    <div class="db-figure-grid">
      {% include fig-device-leakage.html lang=page.lang %}
      {% include fig-device-unipolar-limit.html lang=page.lang %}
    </div>

    <h3>为什么漂移区决定了代价</h3>
    <p>
      对于一维非穿通漂移区，在击穿点处的比导通电阻有闭式解 —— 即 Baliga 单极型极限：
    </p>
    <div class="eq-block">\[ R_{on,sp} = \frac{4\,V_{BR}^{2}}{\varepsilon_s\, \mu_n\, E_c^{3}} \qquad\Longrightarrow\qquad \mathrm{BFOM} = \varepsilon_s\, \mu_n\, E_c^{3} \]</div>
    <p class="eq-where">
      \(\varepsilon_s\) 为介电常数，\(\mu_n\) 为电子迁移率，\(E_c\) 为雪崩临界击穿场强。\(E_c\) 以三次方进入公式，
      因此临界场强高八倍的材料可带来约五百倍的品质因数 —— 同样的阻断电压，可由薄一个数量级、掺杂高得多的漂移区承担。
      经验上该极限遵循 \(R_{on,sp} \propto V_{BR}^{2.4\text{–}2.5}\)。
    </p>

    <div class="data-table-wrap">
      <table class="data-table">
        <caption>室温下的典型材料参数。具体数值随晶向、掺杂与文献来源而异，此处仅作数量级比较。</caption>
        <thead>
          <tr><th>参数</th><th>Si</th><th>4H-SiC</th><th>GaN</th></tr>
        </thead>
        <tbody>
          <tr><td>禁带宽度 E<sub>g</sub> (eV)</td><td>1.12</td><td>3.26</td><td>3.40</td></tr>
          <tr><td>临界场强 E<sub>c</sub> (MV/cm)</td><td>≈0.3</td><td>≈2.5</td><td>≈3.3</td></tr>
          <tr><td>电子迁移率 µ<sub>n</sub> (cm²/V·s)</td><td>1400</td><td>≈950</td><td>≈1500（2DEG 更高）</td></tr>
          <tr><td>饱和漂移速度 v<sub>sat</sub> (10<sup>7</sup> cm/s)</td><td>1.0</td><td>2.0</td><td>2.5</td></tr>
          <tr><td>热导率 (W/cm·K)</td><td>1.5</td><td>3.7–4.9</td><td>1.3（GaN-on-Si 更低）</td></tr>
          <tr><td>商用结构</td><td>垂直、超结</td><td>垂直（平面栅 / 沟槽栅）</td><td>横向 HEMT</td></tr>
          <tr><td>反向导通</td><td>体二极管（慢、Q<sub>rr</sub> 大）</td><td>体二极管（快、Q<sub>rr</sub> 小）</td><td>2DEG，无结 —— V<sub>SD</sub> 高</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>现代器件的内部</h2>
    <p class="lead eq-lead">
      结构不是装饰。各电极相对于耗尽区的位置，决定了每个寄生电容有多大、非线性有多强，以及这个器件到底有没有体二极管。
    </p>

    <div class="db-figure-wide">
      {% include fig-device-crosssection.html lang=page.lang %}
    </div>

    <h3>电容就是耗尽层电容</h3>
    <p>
      功率器件中所有电极间电容本质上都是结电容，因此随其两端电压强烈变化：
    </p>
    <div class="eq-block">\[ C_j(v) = \frac{C_{j0}}{\left(1 + v/V_{bi}\right)^{m}}, \qquad m = \tfrac{1}{2}\ \text{(突变结)},\ \ \tfrac{1}{3}\ \text{(缓变结)} \]</div>
    <p>数据手册给出的是端口组合，而非物理元件：</p>
    <div class="eq-block">\[ C_{iss} = C_{gs} + C_{gd}, \qquad C_{oss} = C_{ds} + C_{gd}, \qquad C_{rss} = C_{gd} \]</div>
    <p>
      由于 \(C_{oss}\) 随电压变化，其中存储的电荷与能量是两个不同的积分，
      并且都不等于按单一标称电容算出的 \(\tfrac{1}{2}C_{oss}V^2\)：
    </p>
    <div class="eq-block">\[ Q_{oss} = \int_0^{V_{DC}} C_{oss}(v)\,dv, \qquad E_{oss} = \int_0^{V_{DC}} v\, C_{oss}(v)\,dv \]</div>
    <p class="eq-where">
      这正是厂商同时给出两个"等效"电容 —— 电荷等效 \(C_{o(er)}\) 与能量等效 \(C_{o(tr)}\) —— 的原因，
      也是把两者混用会悄悄毁掉一次 ZVS 死区时间计算的原因。保存曲线，需要什么就积什么。
    </p>

    <h3>栅极电荷与米勒平台</h3>
    <p>
      驱动栅极要消耗实实在在的功率；而在电压跳变期间，全部栅极电流都灌入 \(C_{gd}\) —— 它决定了 \(dv/dt\)：
    </p>
    <div class="eq-block">\[ P_{drive} = Q_g V_{GS}\, f_{sw}, \qquad \frac{dv_{DS}}{dt} = \frac{I_G}{C_{gd}(v)} = \frac{V_{drive} - V_{pl}}{R_g\, C_{gd}(v)} \]</div>

    <div class="grid">
      <div class="card">
        <h3>阈值电压及其漂移</h3>
        <p>SiC MOSFET 因 SiC/SiO₂ 界面态而存在 \(V_{th}\) 回滞与偏置温度不稳定性。正向扫描之后测得的阈值，并不是器件在电路中实际表现出的阈值 —— 所以测量条件必须与数值一同记录。</p>
      </div>
      <div class="card">
        <h3>反向导通</h3>
        <p>SiC 体二极管在 3–4 V 导通，存储电荷很少。GaN HEMT 根本没有体二极管：当 \(V_{SD}\) 超过约 \(V_{th} + I R\) 时反向电流走 2DEG，因而死区损耗占主导，死区时间必须压到最短而不是留足余量。</p>
      </div>
      <div class="card">
        <h3>动态导通电阻</h3>
        <p>GaN 器件的 \(R_{DS(on)}\) 取决于近期的阻断电压历史 —— 缓冲层中的电荷俘获释放缓慢。静态曲线追踪仪数据看不出这一点，只有在真实开关条件下测量才能暴露。</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>封装、寄生参数与开关损耗</h2>
    <p class="lead eq-lead">
      当芯片装进封装、封装焊到板上之后，开关波形归属于版图的成分不亚于归属于半导体本身。
      更快的器件并没有消除这个问题，而是让它变成了主要矛盾。
    </p>

    <div class="db-figure-wide">
      {% include fig-device-loop.html lang=page.lang %}
    </div>

    <p>
      对于钳位感性负载 —— 标准的硬开关工况，也正是双脉冲测试所复现的场景 ——
      开关能量就是跳变过程的重叠积分，而损耗就是散热器必须带走的那部分：
    </p>
    <div class="eq-block">\[ E_{on} = \int_{t_{on}} v_{DS}\, i_D\, dt, \qquad E_{off} = \int_{t_{off}} v_{DS}\, i_D\, dt, \qquad P_{sw} = \left(E_{on} + E_{off} + E_{rr}\right) f_{sw} \]</div>
    <p>而寄生参数决定了这些积分实际长什么样：</p>
    <div class="eq-block">\[ \Delta V = L_{\sigma}\frac{di}{dt}, \qquad f_{ring} = \frac{1}{2\pi\sqrt{L_{\sigma} C_{oss}}}, \qquad v_{gs,\text{eff}} = v_{drive} - L_{s}\frac{di_D}{dt} \]</div>
    <p class="eq-where">
      第一项解释了为什么 600 V 母线要选 1200 V 器件；第二项是 EMI 滤波器必须面对的振铃频率；
      第三项是共源负反馈：\(L_s\) 同时位于功率回路与栅极回路中，漏极电流因而拖慢自己的开通 —— 这就是开尔文源引脚存在的理由。
    </p>

    <div class="grid">
      <div class="card">
        <h3>经 C<sub>gd</sub> 的串扰</h3>
        <p>关断管上的快速 \(dv/dt\) 会在 \(C_{gd}\) 与 \(C_{gs}\) 上电容分压。当下式成立时便发生误开通：</p>
        <div class="eq-block">\[ \frac{C_{gd}}{C_{gd}+C_{gs}}\,V_{DC} > V_{th} \]</div>
        <p>负压关断、低阻抗关断回路，或有源米勒钳位，是通常的三种对策。</p>
      </div>
      <div class="card">
        <h3>热通路</h3>
        <p>结到壳热阻只是第一段。焊料、基板、底板与导热界面材料各自增加一级，且各有自己的时间常数 —— 这就是单一 \(R_{th}\) 无法预测真实任务剖面下结温、而 Foster 或 Cauer 阶梯网络可以的原因。</p>
      </div>
      <div class="card">
        <h3>绝缘与爬电</h3>
        <p>封装几何同时决定了电气间隙、爬电距离与局放起始电压。对 1200 V 及以上的 SiC，这些往往比电气寄生参数更早地约束版图。</p>
      </div>
    </div>

    <p class="small db-figure-note">
      延伸阅读 —— R. W. Erickson 与 D. Maksimović，<em>Fundamentals of Power Electronics</em>，第 4 章（switch realization）；
      B. J. Baliga，<em>Fundamentals of Power Semiconductor Devices</em>。本站英文技术文章见
      <a href="{{ '/resources/blog/' | relative_url }}">技术博客</a>。
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>测试合作伙伴 —— 泮芯科技</h2>
    <p class="lead eq-lead">
      以上所有数值都不能凭信任取用。本页的一切，只有在实际器件上、在明确条件下、用为此而生的设备测出来之后，才真正可用。
    </p>
    <div class="partner-band">
      <div class="partner-band-mark">
        <img src="{{ '/images/general/PX_logo.png' | relative_url }}" alt="泮芯科技" loading="lazy" decoding="async">
      </div>
      <div class="partner-band-body">
        <p>
          <strong>泮芯科技（Panxin Technology）</strong>是我们在功率半导体表征方面的合作伙伴。
          其电气与热测试平台提供静态曲线、双脉冲波形、电容与栅极电荷数据，以及瞬态热阻抗测量 ——
          这些正是我们器件模型与晶体管数据库背后的支撑。
        </p>
        <p>
          这样的分工让边界保持清晰：他们负责测量，我们负责建模，而我们公布的每一个参数都可以回溯到一次带完整条件的测试。
        </p>
        <div class="hero-actions section-actions">
          <a class="btn btn-primary" href="{{ '/zh/power/devices/characterisation/' | relative_url }}">表征与建模</a>
          <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">申请测试</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-feature devices-page-strip devices-page-strip--a">
  <div class="container">
    <div class="feature-content">
      <div class="feature-text">
        <h2>晶体管数据库</h2>
        <p class="lead">
          本页涉及的一切，都以曲线而非标称值的形式按器件存储 —— SiC、GaN 与 IGBT 的规格参数、
          开关波形、电容曲线与热网络，专为自动器件选型与任务需求感知的设计而构建。
        </p>
        <div class="feature-actions">
          <a href="{{ '/zh/database/transistors/' | relative_url }}" class="btn btn-primary">查看数据库</a>
          <a href="{{ '/zh/contact/' | relative_url }}" class="btn btn-ghost">联系我们</a>
        </div>
      </div>
      <div class="feature-visual">
        <img class="devices-page-case-img" src="{{ '/power/converters/testing/Database/database.jpg' | relative_url }}" alt="晶体管数据库">
      </div>
    </div>
  </div>
</section>
