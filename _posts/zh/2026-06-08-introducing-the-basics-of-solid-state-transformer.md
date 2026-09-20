---
layout: post
title: "固态变压器：原理、应用与架构选择"
description: "固态变压器为何被用于配电、数据中心、充电与微电网研究，以及应用需求如何决定功率变换架构。"
date: 2026-01-19
last_modified_at: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
sst_series: true
math: true
permalink: /zh/resources/blog/introducing-the-basics-of-solid-state-transformer/
translation_key: introducing-the-basics-of-solid-state-transformer
en_url: /resources/blog/introducing-the-basics-of-solid-state-transformer/
---

传统变压器通过磁场传输功率，并改变电压与电流之间的比例关系；在交流配电系统中，它通常工作在电网频率。固态变压器（SST）则把电力电子变换与工作在更高内部频率的变压器结合起来，使各电气端口具备额外的可控能力。

真正有用的问题不是“SST 是否总比传统变压器好”，而是：哪个应用确实需要隔离、变换和控制的组合，这些功能是否值得额外的器件、复杂度与损耗。

本文介绍这些选择。[三阶段 SST 系统指南]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})会沿着电路分析、建模、控制、硬件设计与系统集成给出完整学习路线。

## 1. 从变压器的基本功能出发

对理想双绕组变压器，令匝数比 $$n=N_p/N_s$$，副边电流正方向定义为从绕组流向负载，则

$$
\frac{V_p}{V_s}=n,\qquad \frac{I_s}{I_p}=n,\qquad P_p=P_s.
\tag{1}
$$

真实变压器还包含绕组电阻、漏感、有限励磁电感和铁芯损耗。它无法独立调节输入功率因数、生成直流端口或任意设定输出波形；这些功能需要其他设备。

SST 引入受控开关级。内部变压器仍是物理磁性元件：绕组结构提供电气隔离，磁通必须满足伏秒约束。提高频率能在给定电压和磁通摆幅下降低磁性元件体积，但绝缘、损耗、散热和电磁干扰仍会限制设计。

## 2. 一个名称包含多种架构

本系列采用以下功能分类：

| 架构 | 基本含义 |
|---|---|
| 单级 | 集成交流变换与隔离，但没有两个可独立缓冲的直流母线 |
| 两级 | 两个主要变换级和一个中间直流母线，具体排列可以不同 |
| 三级 | AC–DC 前端、隔离 DC–DC 级和 DC–AC 输出级；隔离级两侧都有直流母线 |

完整的三级 AC–AC 功率路径为：

**MVAC → AC–DC → 高压侧直流链路 → 隔离 DC–DC → LVDC → DC–AC → LVAC。**

如果应用只需要直流，可直接从 LVDC 母线取电，无需为了“凑齐三级”而增加交流输出级。模块化前端也可能具有多个独立浮置的高压侧直流链路，而不是一个可外接的公共 MVDC 母线。

这些差异会在[架构章节]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})中展开。关键是看方框图，而不是名称：MVAC 到 DC 的电源与完整 AC–AC SST 并不需要包含相同级数。

{% include blog-figure.html file="sst-architecture" alt="三级固态变压器与可选直流服务端口" caption="该架构在末级逆变器之前引出直流端口。只需要直流的应用可以止于此；还要供给交流负载时才需要输出级。" %}

## 3. 让应用需求决定端口

| 应用 | 有用的接口与功能 | 决定设计的问题 |
|---|---|---|
| 配电与本地交流供电 | MVAC 输入、稳压 LVAC 输出、可选 DC 端口 | 电能质量、过载、接地、保护与供电连续性 |
| 数据中心直流配电 | MVAC 输入和隔离直流输出 | 变换损耗、负载阶跃、冗余、直流故障开断与维护 |
| 大功率车辆充电 | MVAC 输入、隔离直流配电及下游充电接口 | 宽负载范围、隔离方式、模块扩展与散热 |
| 储能与微电网 | 可控双向功率流的 AC/DC 接口 | 能量可用性、电压/频率职责与模式切换 |
| 牵引与交通 | 面向应用的供电及车载端口 | 质量、绝缘、振动、供电波动与热循环 |

这张表描述的是工程动机，并不意味着所有行业都已采用 SST，也不意味着它们需要同一种拓扑。每个项目都应把 SST 与完整的传统方案比较，包括工频变压器前后所需的变换器。

## 4. 从交流电网到直流数据中心

AI 数据中心采用较高电压直流配电，是本文最初的应用背景。[NVIDIA 发布的 800 VDC 架构讨论](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/)提出了为未来高功率计算基础设施供电的一种路径；它是值得研究的应用方案，不是通用设施规范。

对于理想化的 1 MW 负载，54 V 下的电流约为 18.5 kA，而 800 V 下只有 1.25 kA：

$$
I=\frac{P}{V},\qquad P_{\mathrm{Cu}}=I^2R.
\tag{2}
$$

在电阻相同的前提下，这说明提高配电电压为何有吸引力。但它不能直接证明全系统效率更高，因为导体、变换级、绝缘与保护也会改变。

隔离型 MVAC–DC SST 可以直接供给直流母线，下游变换器再生成服务器和处理器需要的电压轨。工频变压器加整流器同样是候选方案；比较必须覆盖真实负载曲线下的效率、故障处理、维护与冗余。

这里的 800 V 应用与教学系列使用的 48 V 实验母线不同。后者是为了研究架构和控制，并不是只改一个电源参数就能缩放成 800 V 产品。

## 5. 模块化为什么重要

模块化变换器把电气应力和功率分配给重复单元：串联分压，并联分流。连接方式也决定隔离位置和必须控制的均衡变量。理想均载模块满足

$$
V_{\mathrm{series}}=\sum_{k=1}^{N}V_k,\qquad
I_{\mathrm{parallel}}=\sum_{k=1}^{N}I_k.
\tag{3}
$$

均载不会自动发生。器件容差、电容能量差、时序误差和温度差异都会影响分配。因此[模块化集成章节]({{ '/zh/resources/blog/modular-sst-system-integration/' | relative_url }})把均衡和启动作为设计的一部分，而不是接线细节。

[Awal 等人的研究](https://arxiv.org/abs/2007.04369)展示了一种用于充电的模块化中压 AC–低压 DC 变换器，采用输入串联、输出并联模块，直观说明端口电压和功率如何导向模块化架构。

## 6. 评价完整系统

当拓扑和保护允许时，SST 可以提供输入电流控制、输出稳压、隔离和双向功率流；代价则是半导体、栅极驱动、传感器、控制硬件和冷却系统。

候选方案必须在同一需求边界下比较：

- 全任务剖面的损耗，包括辅助电源和待机；
- 各模块与外部端口的绝缘和共模应力；
- 故障电流路径、开断能力和储能；
- 过载行为、热极限与扰动后的恢复；
- 可靠性、更换流程以及单模块失效的影响；
- 电源与负载相互作用，包括弱电网和恒功率负载。

任何“更小”或“效率更高”的结论都应说明比较边界并提供测量依据。高频变压器更小，并不等于完整装置一定更小。

## 7. 沿三级架构继续学习

本系列采用 CHB 前端、每个浮置单元一个 DAB，以及集中式 LVAC 逆变器。先阅读[统一规格与系统指南]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})，再进入 [AC–DC 前端]({{ '/zh/resources/blog/sst-ac-dc-front-end/' | relative_url }})、[DAB 隔离级]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})和 [DC–AC 输出级]({{ '/zh/resources/blog/sst-dc-ac-output-stage/' | relative_url }})。

最后的[系统集成章节]({{ '/zh/resources/blog/modular-sst-system-integration/' | relative_url }})会用明确的能量平衡、控制职责与测试里程碑把各级组合起来。当前内容是分析型教学稿；原型测量和原生设计工程将在完成并验证后补充。
