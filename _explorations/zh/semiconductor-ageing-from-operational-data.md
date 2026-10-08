---
title: "基于运行数据的功率半导体老化估计"
lang: zh
permalink: /zh/explorations/semiconductor-ageing-from-operational-data/
translation_key: semiconductor-ageing-from-operational-data
status: concept
question: "能否仅凭变换器为控制而已经测量的数据，在不增加专用诊断测量的情况下估计功率半导体的退化？"
description: "一个开放问题：仅使用变换器已记录的电流、电压与散热器温度，能否把热阻与通态压降的漂移，与工况、环境和传感器变化区分开？"
domains: [devices]
opened: 2026-10-08
updated: 2026-10-08
featured: false
math: true
ai_disclosure: "本页在 AI 辅助下起草，由 AIPE Labs 发布以供公开评审，尚未经过独立工程师评审。所列参考文献均为被广泛引用的出版物，仅供入门参考；使用前请逐条核实。"
evidence: []
hub:
  uses: [aipe.semiconductor-database, aipe.simulation-skills]
  produces: []
learn:
  - title: "功率半导体器件"
    url: /zh/power/devices/
    kind: "工程领域"
  - title: "功率循环可靠性：受控自热与退化证据"
    url: /zh/resources/blog/power-cycling-reliability/
    kind: "工程文章"
  - title: "结温测量：校准、电敏参数与测量延时"
    url: /zh/resources/blog/junction-temperature-measurement/
    kind: "工程文章"
  - title: "瞬态热阻抗：从温升曲线到验证过的 RC 模型"
    url: /zh/resources/blog/transient-thermal-impedance/
    kind: "工程文章"
  - title: "从任务剖面到寿命：损伤模型、Weibull 统计与不确定度"
    url: /zh/resources/blog/mission-profile-lifetime-estimation/
    kind: "工程文章"
---

## 研究问题

逆变器、驱动器与 DC–DC 变换器中的功率模块会逐渐老化：键合线开裂、脱落，焊料层疲劳、分层。实验室中的状态监测通过专用测量发现这些变化——在校准电流下测量通态压降，或从加热、冷却曲线中提取热阻抗——但现场运行的大多数变换器并不进行这些测试。

问题是：

> 能否**仅凭变换器为控制而已经测量的信号**——相电流、直流母线电压、开关指令以及散热器或基板温度传感器——在不增加传感器、测试模式或停机时间的情况下，估计功率模块的退化？

如果可以，现有变换器只需通过固件与数据分析就能获得状态监测能力。如果不行，明确哪一项最少的额外测量能使之成为可能，同样有价值。

## 假设

老化会改变已测量量之间的关系：

- **焊料退化**会增大结到壳的热阻。在估计损耗相同的情况下，模块内部的温度分布随之改变，板载传感器对负载阶跃的温度响应也会不同。
- **键合线退化**会增大通态压降，使导通损耗略有增加，并改变控制器原本就在补偿的电压误差（例如死区补偿或电压前馈项）。

本假设认为，基于模型的估计器——由实测电流、电压与开关状态计算损耗，驱动参数缓慢变化的降阶热网络——可以在数周至数月内跟踪这些变化，并将其与工况、环境温度、散热性能与传感器漂移引起的变化区分开。

对于简单热网络，稳态结温为

$$
T_j = T_\text{a} + P_\text{loss}\,\bigl(R_{\text{th,jc}} + R_{\text{th,ch}} + R_{\text{th,ha}}\bigr),
$$

但散热器上的传感器主要反映 $$R_{\text{th,ha}}$$ 部分。$$R_{\text{th,jc}}$$ 的变化能否通过这样的传感器被观测到——依靠动态响应而不是稳态——正是问题的关键。

## 已有知识

以下内容已经确立，是本探索的出发点，而不是本探索的主张。

- **失效机理与前兆。** 键合线脱落与焊料疲劳是功率模块的主要耗损失效机理。通态压降上升与热阻上升是被广泛使用的前兆参数，基于它们的状态监测方法已有大量综述 [1]、[2]、[3]。
- **结温估计。** 温度敏感电参数（TSEP）与热模型是在无法直接接触芯片时估计结温的标准方法 [4]。
- **寿命模型。** 功率循环寿命取决于温度摆幅、平均温度、加热时间等因素，可用 Bayerer 等人提出的经验模型描述 [5]；系统级可靠性设计综述见 [6]。
- **加速老化数据。** 已有公开的加速老化数据集，例如 NASA Ames 预测卓越中心（Prognostics Center of Excellence）发布的 IGBT 老化数据。它们是否适用于本问题，尚未评估。

本问题的不同之处：已发表的监测方法大多增加了某项测量（通态压降检测电路、专用测试脉冲或结温传感）。本探索研究的是在**不增加任何硬件**时能做到什么，并把区分老化与混杂因素作为核心问题，而不是事后补充。

## AI 辅助研究

目前尚未开展任何研究。拟采用的方法是：

1. **灵敏度与可观测性。** 使用包含传感器位置的 Cauer 或 Foster 热网络，计算传感器对负载阶跃的响应在多大程度上依赖结到壳热阻，并与壳到散热器、散热器到环境的热阻比较。在实际的传感器噪声与分辨率下，估计可检测到的最小变化。
2. **合成老化。** 将损耗模型（器件参数可取自 AIPE 半导体数据库等来源）与热网络结合，施加渐进退化，并加入环境温度变化、风扇磨损、导热界面退化与电流传感器漂移。检验估计器能否把变化归因于正确的原因。
3. **公开数据。** 评估现有加速老化数据集是否包含变换器本身会有的信号；如果包含，就在其上评估估计器。

拟用工具：用 Python 建立模型并进行估计。在状态变更之前，所有脚本与参数都会公开。

## 初步发现

暂无。本探索处于“概念”阶段：尚未完成任何模型、分析或仿真，因此没有可报告的观察或解释。上文的热网络公式是标准关系式，而不是本研究的发现。

## 局限与未知

- **可观测性弱。** 散热器传感器可能离芯片太远、响应太慢，使结到壳的变化无法与噪声区分。
- **混杂因素。** 散热退化（风扇磨损、积灰、导热界面泵出）会以类似于焊料老化的方式使温度升高；环境条件与工况变化又带来更多波动。
- **损耗模型不确定性。** 由数据手册参数计算的损耗，其误差与所要检测的效应处于同一量级。
- **器件技术。** 碳化硅 MOSFET 存在阈值电压漂移，会在不意味着封装老化的情况下改变通态特性；为 IGBT 开发的方法未必适用。
- **基线。** 任何漂移估计都需要调试投运时的可靠基线，而许多已安装的变换器并没有。
- **其他解释。** 检测到的“漂移”可能来自传感器老化或固件更改；研究必须证明能够排除这些可能。

## 人工评审与验证

需要工程师与科学家评审的内容：

- 热网络以及所假设的传感器位置与动态特性；
- 损耗模型及其不确定度说明；
- 混杂因素的表示是否符合实际。

可以证实或证伪该假设的实验：

- **盲评功率循环试验。** 在功率循环试验中使模块老化，同时只记录变换器本身会有的信号。另行测量通态压降与热阻抗作为真值，并在不接触真值的情况下评估估计器。功率循环中常用的试验终止判据（例如热阻或通态压降上升一定百分比）可以作为自然的检测目标；请采用适用标准中的判据。
- **混杂因素试验。** 在健康模块上人为降低散热能力（降低风扇转速、劣化导热界面），检查估计器是否会误报器件老化。
- **证伪判据。** 如果在实际噪声下，估计器在达到试验终止判据之前仍无法区分器件老化与散热退化，则该假设对这种传感器布置不成立。

## 开放贡献

现阶段有价值的贡献包括：

- 指出已经实现或已经排除“不增加传感器的监测”的研究；
- 以明确许可共享、并附已知模块历史的变换器运行数据（电流、电压、温度）；
- 器件可靠性或热建模专家的评审。

请使用本页末尾的链接讨论问题或提出修改。研究产生的器件数据与模型将连同其成熟度与局限一起提交到 [AIPE Hub]({{ '/zh/hub/' | relative_url }})。

### 参考文献

1. S. Yang, D. Xiang, A. Bryant, P. Mawby, L. Ran and P. Tavner, "Condition monitoring for device reliability in power electronic converters: a review," *IEEE Transactions on Power Electronics*, vol. 25, no. 11, 2010.
2. H. Oh, B. Han, P. McCluskey, C. Han and B. D. Youn, "Physics-of-failure, condition monitoring, and prognostics of insulated gate bipolar transistor modules: a review," *IEEE Transactions on Power Electronics*, vol. 30, no. 5, 2015.
3. U.-M. Choi, F. Blaabjerg and K.-B. Lee, "Study and handling methods of power IGBT module failures in power electronic converter systems," *IEEE Transactions on Power Electronics*, vol. 30, no. 5, 2015.
4. Y. Avenas, L. Dupont and Z. Khatir, "Temperature measurement of power semiconductor devices by thermo-sensitive electrical parameters — a review," *IEEE Transactions on Power Electronics*, vol. 27, no. 6, 2012.
5. R. Bayerer, T. Herrmann, T. Licht, J. Lutz and M. Feller, "Model for power cycling lifetime of IGBT modules — various factors influencing lifetime," *International Conference on Integrated Power Electronics Systems (CIPS)*, 2008.
6. H. Wang, M. Liserre and F. Blaabjerg, "Toward reliable power electronics: challenges, design tools, and opportunities," *IEEE Industrial Electronics Magazine*, vol. 7, no. 2, 2013.
