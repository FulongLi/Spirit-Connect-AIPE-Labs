---
layout: default
title: DAB 变换器工程工作流
lang: zh
permalink: /zh/resources/prototypes/dab/
description: 由 AIPE-Workflows 执行的 10 kW 双有源桥仿真驱动工程工作流——解析设计、真实 ngspice 开关仿真、控制基线、由波形驱动的磁件设计、器件筛选、散热设计、Gmsh/Elmer 有限元校核、FreeCAD 几何与可复现的评审包。
---

<header class="hero">
  <div class="container">
    {% include hub-breadcrumb.html category='workflows' %}
    <h1>DAB 变换器工程工作流</h1>
    <p class="lead">一台 10 kW、800 V→400 V、100 kHz 的双有源桥，经 AIPE 工作流引擎完成：需求 → 单移相解析设计 → 真实 ngspice 开关仿真 → 由波形驱动的磁件、器件与热设计 → Gmsh/Elmer 场校核与 FreeCAD 几何 → 带证据的 Core 工程状态 → 评审包。七个专项仓库的十三个任务纳入同一个带检查点的任务图。成熟度：<strong>原型</strong>（软件、电路仿真、场仿真与 CAD 关卡已执行；PCB、测量与硬件验证不作声明）。</p>
  </div>
</header>

<section class="section"><div class="container">
  <h2>当前可运行的内容</h2>
  <div class="grid">
    <div class="card"><h3>解析设计与控制</h3><p>AIPE Design Agent 中精确的无损 SPS 模型（<code>pea.converters.dab_sps</code>）：22.5° 移相、35 µH 与 2:1 匝比恰好传输 10 kW；串联电流有效值 13.68 A；两侧桥臂均满足 ZVS 电流条件。SPS 数字控制基线（电流环 PI 2 kHz、电压环 2P2Z 300 Hz，最差相位裕度 55°）在周期平均模型上设计，其对象规律与真实 ngspice 运行对比误差 0.07 %。</p></div>
    <div class="card"><h3>已执行的开关仿真</h3><p>ngspice 47 运行自动生成的一级（理想）模型：输出 9 996.8 W，串联电流有效值 13.678 A，实测移相 22.5000°，周期误差 2·10<sup>-6</sup>；记录了 T/400 至 T/1600 的时间步收敛。二级行为模型（200 ns 死区、数据手册导通电阻、Coss、体二极管拟合、直流母线寄生参数、RC 负载）效率约 98.6 %，所有开关均在 ZVS 下开通，其 HDF5 波形数据集供下游各阶段使用。</p></div>
    <div class="card"><h3>由波形驱动的磁件、器件与散热</h3><p>AIPE-Magnetics-Database 基于已执行的电流波形设计 TDK E 70/33/32 变压器（20:10，交错利兹线，35 W，漏感 1.55 µH）；AIPE-Semiconductor-Database 以逐开关应力筛选 SiC 器件记录，并按厂商 PLECS 数据评估 Wolfspeed C4MS047120K / C3M0025065K 的每器件损耗 9.0 W / 17.4 W；AIPE Design Agent 比较自然对流、强迫风冷与液冷（最热结温 63 °C），并以带随机种子的 Pareto 前沿筛选板翅散热器。</p></div>
    <div class="card"><h3>场校核与几何</h3><p>AIPE-Field-Simulation 以 Gmsh + Elmer 计算所选磁芯窗口（有限元漏感 1.48 µH，比一维设计值低 4 %）与拐点散热器候选（热点 59.6 °C，比关联式高 9 %），均含两级网格与能量校验。AIPE-CAD-Agent 由同一工程状态在 FreeCAD 中生成变压器与散热器，输出 STEP、质量统计以及干涉与电气间隙检查。</p></div>
    <div class="card"><h3>证据与评审包</h3><p>每个任务返回带工具版本、SHA-256 产物哈希、模型有效范围与数值校验的执行信封；结果以证据形式写入 AIPE Core 工程状态（保留十二个状态版本、十四条证据记录）。<code>aipe-workflows report</code> 输出 JSON、Markdown 与 AIPE-Doc 风格的 HTML 评审包；<code>aipe-workflows iterate</code> 记录跨模块反馈迭代及其采纳/拒绝决定。</p></div>
  </div>
</div></section>

<section class="section"><div class="container">
  <h2>安装与运行</h2>
  <p>Windows 或 Linux 工作站，Python 3.10+，并在同级目录检出 <a href="https://github.com/FulongLi/AIPE-Core">AIPE-Core</a>、<a href="https://github.com/FulongLi/AIPE-Registry">AIPE-Registry</a>、<a href="https://github.com/FulongLi/AIPE-Design-Agent">AIPE-Design-Agent</a>、<a href="https://github.com/FulongLi/AIPE-Simulation-Skills">AIPE-Simulation-Skills</a>、<a href="https://github.com/FulongLi/AIPE-Semiconductor-Database">AIPE-Semiconductor-Database</a>、<a href="https://github.com/FulongLi/AIPE-Magnetics-Database">AIPE-Magnetics-Database</a>、<a href="https://github.com/FulongLi/AIPE-Field-Simulation">AIPE-Field-Simulation</a>、<a href="https://github.com/FulongLi/AIPE-CAD-Agent">AIPE-CAD-Agent</a> 与 <a href="https://github.com/FulongLi/AIPE-Workflows">AIPE-Workflows</a>；ngspice、Gmsh、Elmer 与 FreeCAD 请从官方发布渠道获取（doctor 会报告缺失工具的官方下载渠道与许可，不会自动安装；缺少工具的阶段会被报告为阻塞，绝不伪造结果）。</p>
<pre><code>python -m pip install -e ../AIPE-Simulation-Skills -e ../AIPE-Design-Agent -e ../AIPE-Semiconductor-Database
python -m pip install -e ../AIPE-Magnetics-Database[hdf5] -e ../AIPE-Field-Simulation -e ../AIPE-CAD-Agent -e ../AIPE-Workflows
aipe-workflows doctor --qualify
aipe-workflows plan examples/dab-10kw/specification.yaml --checkouts ..
aipe-workflows run  examples/dab-10kw/specification.yaml --checkouts ..
aipe-workflows verify &lt;run-id&gt;
aipe-workflows report &lt;run-id&gt;</code></pre>
  <p>在 Claude Code 或 Codex 中打开 AIPE-Workflows 并提出：“使用 AIPE 设计并优化一台 10 kW DAB 变换器，运行可用的仿真，并生成工程评审包。” 智能体会发现该工作流、检验本地工具并调用上述命令。</p>
</div></section>

<section class="section"><div class="container">
  <h2>示例结果</h2>
  <p>2026 年 10 月 21 日的参考运行（ngspice 47、Gmsh 4.15.2、Elmer 9.0、FreeCAD 1.1.4，Windows 11）；完整的信封、网表、摘要、有限元工况文件、CAD 元数据与图表见 <a href="https://github.com/FulongLi/AIPE-Workflows/tree/feat/dab-10kw-workflow/examples/dab-10kw/results">examples/dab-10kw/results</a>。</p>
  <table>
    <thead><tr><th>阶段</th><th>执行结果</th><th>交叉校核</th></tr></thead>
    <tbody>
      <tr><td>解析 SPS 对比 ngspice 一级模型</td><td>10 000 W 对 9 996.8 W；有效值 13.6775 A 对 13.6779 A；实测移相 22.5000°</td><td>5 W 为建模的电阻损耗</td></tr>
      <tr><td>二级行为 ngspice</td><td>损耗约 130 W，器件峰值电压 810 V / 412 V，八个开关均 ZVS</td><td>已修正电容储能漂移</td></tr>
      <tr><td>控制基线</td><td>相位裕度 93.6° / 60.0°（电流环 / 电压环），最差 55.4°</td><td>对象规律与 ngspice 在 10°、22.5°、35° 对比：最大 0.07 %</td></tr>
      <tr><td>变压器设计</td><td>E 70/33/32 N87，20:10 利兹线 P-S-P，0.146 T，35.0 W，漏感 1.55 µH</td><td>窗口有限元 1.48 µH（−4.4 %），两级网格</td></tr>
      <tr><td>器件筛选</td><td>C4MS047120K 9.0 W、C3M0025065K 17.4 W（每器件，125 °C）</td><td>厂商 PLECS 张量（A 级证据）；模块 CBB021M12FM3 综合排名第一</td></tr>
      <tr><td>散热</td><td>液冷 63.0 °C、强迫风冷 64.3 °C、自然对流 79.2 °C（副边桥，每散热器 4 器件）</td><td>Stage A 拐点：铝 81 × 65 mm，11 翅片，0.44 K/W，0.28 kg</td></tr>
      <tr><td>散热器有限元 / CAD</td><td>热点 59.6 °C，0.562 K/W；CAD 散热器质量 0.275 kg</td><td>关联式 0.518 K/W（+8.6 %）；质量 −1.3 %</td></tr>
    </tbody>
  </table>
  <p>器件参数均为厂商数据手册或模型值或标注的假设，不是测量值；热与有限元的对流换热系数是关联式输入，不是 CFD 结果；CAD 检查中的电气间隙要求为示意性的调用方输入。</p>
</div></section>

<section class="section"><div class="container">
  <h2>尚未执行的阶段</h2>
  <p>三块 KiCad 电路板及其 ERC/DRC 由 <a href="https://github.com/FulongLi/AIPE-PCB-Agent">AIPE-PCB-Agent</a> 在其自身仓库中生成，尚未纳入任务图；CFD、厂商 SPICE 模型（三级）、实验室测量与硬件验证是软件永不自行声明的独立状态。早期的解析教学系列仍可阅读：<a href="{{ '/zh/resources/blog/' | relative_url }}">教程列表 →</a></p>
</div></section>
