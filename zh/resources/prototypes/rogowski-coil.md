---
layout: default
title: PCB 罗氏线圈设计参考
lang: zh
permalink: /zh/resources/prototypes/rogowski-coil/
description: 面向高精度 PCB 罗氏线圈电流传感器的原理、几何结构、绕组图案与设计考量，以及可订购的演示原型。
math: true
en_url: /resources/prototypes/rogowski-coil/
---

<header class="hero hero-compact">
  <div class="container">
    <h1>PCB 罗氏线圈</h1>
    <p class="lead">一种直接印制在 PCB 上的高精度空芯电流传感器：带宽宽、不饱和，几何结构高度可重复，适用于电力电子验证、监测与控制。本页介绍其工作原理、线圈形状为何重要，以及我们的实现方式。</p>
    <div class="hero-actions">
      <a href="#order" class="btn btn-primary">订购演示板</a>
      <a href="#principles" class="btn btn-ghost">了解原理 ↓</a>
    </div>
  </div>
</header>

<section class="section section-feature">
  <div class="container">
    <div class="feature-content">
      <div class="feature-text">
        <h2>不会磁饱和的电流传感器</h2>
        <p class="lead">罗氏线圈是一组环绕被测导体的<strong>空芯</strong>环形绕组。由于没有磁性材料，它不会饱和，从数安培到数千安培都能保持线性，同时几乎不为被测回路增加阻抗。将绕组制作在 PCB 上，可使每一匝的几何尺寸一致，因此灵敏度可重复，对外部杂散磁场的抑制也优于手工绕制线圈。</p>
        <p>我们的参考板把线圈、有源积分器和输出调理集成在同一块 PCB 上，可直接连接示波器，用于双脉冲测试、变换器验证和开关损耗测量。</p>
      </div>
      <div class="feature-visual"><div class="visual-placeholder">
        <img class="reference-visual" src="{{ '/accessories/transducers/images/RogT1_d.png' | relative_url }}" alt="PCB 罗氏线圈电流传感器三维渲染图">
      </div></div>
    </div>
  </div>
</section>

<section class="section" id="principles">
  <div class="container">
    <h2>1. 基本原理</h2>
    <p class="lead">线圈响应电流的变化率，再由积分器还原为电流波形。</p>
    <p>安培环路定律把导体周围的磁场与其中的电流联系起来。罗氏线圈由 \(N\) 匝均匀绕组构成，围绕导体形成闭合环。变化的磁场与绕组交链，根据法拉第定律，线圈产生的感应电动势与电流变化率成正比：</p>
    <div class="rc-eq">\[ e(t) = -\,M\,\frac{di(t)}{dt}, \qquad M = \frac{\mu_0\,N\,A}{\ell} = \frac{\mu_0\,N\,A}{2\pi r}. \]</div>
    <p>其中，\(M\) 是线圈与导体之间的互感，\(A\) 是单匝截面积，\(\ell = 2\pi r\) 是平均磁路长度，\(\mu_0\) 是真空磁导率。由于磁芯为空气，\(M\) 只由几何结构决定，这正是线圈具有良好线性且不会饱和的原因。</p>
    <p>原始输出与 \(di/dt\) 成正比，因此需要积分才能恢复电流。对于输入电阻为 \(R_i\)、反馈电容为 \(C_i\) 的有源运放积分器，调理后的输出和传感器灵敏度为：</p>
    <div class="rc-eq">\[ v_{\text{out}}(t) = \frac{1}{R_i C_i}\int e(t)\,dt = \frac{M}{R_i C_i}\,i(t), \qquad S = \frac{M}{R_i C_i}\ \left[\frac{\text{V}}{\text{A}}\right]. \]</div>
    <p>在很高频率下也可以采用<strong>自积分</strong>方式：若端接电阻 \(R\) 远小于线圈自身感抗（\(R \ll \omega L_c\)），线圈电感便会完成积分，电阻两端的电压已经与电流成正比。实际宽带探头通常结合这两个工作区间。</p>
    <div class="grid">
      <div class="card"><h3>主要优势</h3><p>无饱和、线性动态范围宽、带宽高、插入阻抗几乎为零、天然电气隔离，而且轻薄。</p></div>
      <div class="card"><h3>需要注意</h3><p>不能测量直流（必须有 \(di/dt\)），输出需要积分；线圈形状不佳时，读数容易受导体位置和邻近电流影响。</p></div>
      <div class="card"><h3>典型应用</h3><p>变换器开关电流和 \(di/dt\) 捕获、双脉冲与短路测试、保护与计量，以及母排电流监测。</p></div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>2. 在 PCB 上构建线圈</h2>
    <p class="lead">两圈过孔以及连接它们的铜箔走线共同形成环形绕组；传感精度首先取决于版图。</p>
    <p>每一匝由顶层径向走线、通到底层的过孔、底层返回走线和回到顶层的过孔组成，并沿开口重复排列。内外两圈过孔限定绕组，过孔对数量决定匝数 \(N\)。光绘 PCB 能以微米级精度放置每个过孔和走线，使各匝所包围的面积几乎完全相同，因此不同批次电路板的传感灵敏度也能保持一致。</p>
    <p>环绕环形结构一周的 \(N\) 匝绕组同时还形成了一个围绕环轴的大回路。该寄生回路会拾取穿过整个线圈的变化磁场，包括邻近导体产生的磁场。为抵消它，需要用<strong>返回匝</strong>闭合绕组：把信号沿环形结构中央带回，使外侧回路的净包围面积为零。良好的返回路径对称性，是抑制外部磁场并降低导体位置敏感度的关键。</p>
    <div class="grid">
      <div class="card"><h3>匝数与面积</h3><p>灵敏度随 \(N\) 和单匝面积 \(A\) 增加；但匝数越多，线圈电感越大、自谐振频率越低，因此要在灵敏度与带宽之间取舍。</p></div>
      <div class="card"><h3>绕组均匀性</h3><p>等角度间距能减小导体位置对读数的影响，并抑制环外电流。绕组不均匀会带来位置误差。</p></div>
      <div class="card"><h3>返回路径对称性</h3><p>同心返回走线或反向绕制的第二层可抵消净包围回路，抑制均匀外场和 \(dv/dt\) 耦合。</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>3. 线圈几何结构与绕组图案</h2>
    <p class="lead">开口形状与匝线绘制方式，决定了灵敏度、带宽、外场抑制和机械适配之间的平衡。</p>
    <h3>开口形状</h3>
    <p><strong>圆形</strong>开口让绕组周围的磁场最均匀，对圆导体在开口内的位置最不敏感，适合电缆和圆形母排。<strong>圆角矩形（跑道形）</strong>开口更适合扁平母排、模块端子和宽 PCB 走线；其转角附近磁场略不均匀，需要仔细安排匝距，但更贴合真实功率模块的机械结构。</p>
    <h3>绕组图案</h3>
    <p>内外过孔环之间的走线图案，是设计自由度最大的部分：</p>
    <div class="rc-table-wrap"><table class="rc-table">
      <caption>常见 PCB 罗氏线圈绕组图案及其特点。</caption>
      <thead><tr><th>图案</th><th>绘制方式</th><th>优势</th><th>取舍</th></tr></thead>
      <tbody>
        <tr><th>径向辐条</th><td>在内外两圈过孔之间布置直线径向走线。</td><td>简单、均匀、重复性好，灵敏度易预测。</td><td>匝密度受内圈过孔间距限制。</td></tr>
        <tr><th>鱼骨 / 人字形</th><td>绕组像鱼骨一样倾斜，并沿环交替改变角度。</td><td>相同半径内可容纳更多匝；交替倾角有助于平衡返回回路，提高外场抑制。</td><td>几何结构较复杂；倾角必须保持对称，否则会增加位置误差。</td></tr>
        <tr><th>螺旋 / 四叶形</th><td>每匝略微螺旋，或把开口做成分瓣形。</td><td>适配不规则机械开口，并可在给定面积内提高耦合。</td><td>较难保证磁场均匀，需要仔细建模。</td></tr>
        <tr><th>差分 / 反向绕制</th><td>两组方向相反的绕组（或两层反向绕制）检测同一电流。</td><td>强力抑制外场和 \(dv/dt\) 耦合的共模噪声，适合高噪声变换器。</td><td>相同开口下，版图面积和复杂度大约增加一倍。</td></tr>
      </tbody>
    </table></div>
    <h3>代表性结构</h3>
    <p>下面各板采用同一参考平台：左侧线圈几何形状不同，右侧积分器和调理链保持一致，展示了如何针对应用在开口形状和匝密度之间取舍。</p>
    <div class="grid">
      <figure class="rc-figure"><img src="{{ '/accessories/transducers/images/RogT1_t.png' | relative_url }}" alt="中等匝密度圆形开口 PCB 罗氏线圈"><figcaption><strong>1 型——圆形、中等密度。</strong>面向圆导体的通用结构，在灵敏度和带宽之间取得平衡。</figcaption></figure>
      <figure class="rc-figure"><img src="{{ '/accessories/transducers/images/RogT2_t.png' | relative_url }}" alt="高匝密度圆形开口 PCB 罗氏线圈"><figcaption><strong>2 型——圆形、高密度。</strong>通过更多匝数提高灵敏度，但会牺牲部分高频带宽。</figcaption></figure>
      <figure class="rc-figure"><img src="{{ '/accessories/transducers/images/RogT3_t.png' | relative_url }}" alt="圆角矩形开口 PCB 罗氏线圈"><figcaption><strong>3 型——跑道形开口。</strong>适合套在扁平母排和模块端子上。</figcaption></figure>
      <figure class="rc-figure"><img src="{{ '/accessories/transducers/images/RogT4_t.png' | relative_url }}" alt="大尺寸圆角矩形开口 PCB 罗氏线圈"><figcaption><strong>4 型——宽跑道形。</strong>更大开口和更密绕组，适合大电流母排。</figcaption></figure>
      <figure class="rc-figure"><img src="{{ '/accessories/transducers/images/RogT5_t.png' | relative_url }}" alt="带同心返回走线的圆角矩形 PCB 罗氏线圈"><figcaption><strong>5 型——优化返回路径。</strong>同心返回路径着重提升外场和共模抑制能力。</figcaption></figure>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>4. 形状如何影响性能</h2>
    <p class="lead">每一项几何选择都会影响同一组关键指标。</p>
    <div class="grid">
      <div class="card"><h3>灵敏度</h3><p>灵敏度随匝数 \(N\)、单匝面积 \(A\) 增大，并随平均半径 \(r\) 减小，因为 \(M \propto NA/r\)。更密的绕组和更紧凑的开口能获得更高的伏安比。</p></div>
      <div class="card"><h3>带宽</h3><p>低频端由积分器决定，高频端受线圈自谐振 \(f_r = 1/(2\pi\sqrt{L_c C_c})\) 限制。匝数更少、回路更短，可提高谐振频率和可用带宽。</p></div>
      <div class="card"><h3>外部磁场抑制</h3><p>均匀绕组配合对称返回回路，可抑制邻近电流和均匀磁场。鱼骨形和反向绕组适合电磁噪声较强的环境。</p></div>
      <div class="card"><h3>位置不敏感性</h3><p>均匀、对称的绕组能使导体位于开口内不同位置时读数近似一致；不均匀绕组或跑道形转角处的匝线拥挤会增加位置误差。</p></div>
      <div class="card"><h3>\(dv/dt\) 抗扰度</h3><p>快速开关会通过电容耦合进入线圈。保护环、差分或反向绕组可抵消这种共模注入，使电流信号保持干净。</p></div>
      <div class="card"><h3>机械适配</h3><p>开口形状和尺寸取决于导体：电缆用圆形，母排用跑道形。通常应选择在保证足够磁通耦合前提下尽可能大的开口。</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>5. 设计考量</h2>
    <p class="lead">要把线圈几何结构变成可用仪器，还需要围绕它设计电子电路与校准流程。</p>
    <div class="grid">
      <div class="card"><h3>积分器与下垂</h3><p>有源积分器决定低频下限，直流稳定反馈用于防止输出漂移。其 RC 时间常数需要在低频下垂与噪声增益之间平衡。</p></div>
      <div class="card"><h3>端接与谐振</h3><p>合理阻尼可控制线圈的自谐振峰值，使频带内相位响应平坦，避免快速边沿引起振铃。</p></div>
      <div class="card"><h3>噪声与屏蔽</h3><p>低灵敏度线圈需要低噪声前端；接地保护环与谨慎的参考地布线可避免电容耦合进入信号。</p></div>
      <div class="card"><h3>校准与温度</h3><p>灵敏度主要由几何结构决定，因此每种结构只需对照参考进行校准，并表征积分器元件较小的温度系数。</p></div>
    </div>
    <div class="rc-table-wrap"><table class="rc-table">
      <caption>参考设计范围——以下是各结构可配置的典型目标，并非保证规格。</caption>
      <thead><tr><th>参数</th><th>典型参考值</th></tr></thead>
      <tbody>
        <tr><th>开口</th><td>圆形约 20–40 mm，或适配母排的跑道形（可定制）</td></tr>
        <tr><th>匝数</th><td>约 40–120 匝，由过孔间距和绕组图案决定</td></tr>
        <tr><th>灵敏度</th><td>通过积分器配置（例如调理后数 mV/A）</td></tr>
        <tr><th>带宽</th><td>低频端低于 1 kHz，高频端可达数十 MHz，取决于积分器和阻尼</td></tr>
        <tr><th>峰值电流</th><td>无磁饱和限制，可覆盖数安培至数千安培</td></tr>
        <tr><th>输出</th><td>SMA/同轴缓冲电压输出，积分器集成在板上</td></tr>
        <tr><th>隔离</th><td>天然隔离，与一次侧无电气连接</td></tr>
      </tbody>
    </table></div>
    <p class="rc-note">以上数值用于说明设计范围。最终规格取决于所选开口、绕组图案和积分器，并在每次制造后的校准中确认。</p>
  </div>
</section>

<section class="section collaboration-section" id="order">
  <div class="container narrow-center">
    <h2>原型已经完成，可直接演示</h2>
    <p class="lead">我们已经设计、制造并在实验台上验证了上图所示的 PCB 罗氏线圈，将线圈、有源积分器与输出调理集成在一块 PCB 上。现有演示单元可供发货，便于您直接在自己的开关波形上进行评估。</p>
    <div class="hero-actions">
      <a href="{{ '/zh/contact/' | relative_url }}" class="btn btn-primary">在线订购 / 获取报价</a>
      <a href="{{ '/zh/contact/' | relative_url }}" class="btn btn-ghost">沟通定制开口</a>
    </div>
    <p class="reference-note"><strong>演示单元现货 · 定制版本交付周期约一个月。</strong></p>
  </div>
</section>
