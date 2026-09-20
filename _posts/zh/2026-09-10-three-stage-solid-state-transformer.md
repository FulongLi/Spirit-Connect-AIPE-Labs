---
layout: post
title: "三级固态变压器：从基本原理到完整系统"
description: "由级联前端、隔离 DAB 模块和交流输出级构成的 SST：系统架构、能量流与统一教学规格。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/three-stage-solid-state-transformer/
translation_key: three-stage-solid-state-transformer
en_url: /resources/blog/three-stage-solid-state-transformer/
---

固态变压器（SST）把受控功率变换与磁隔离结合起来。理解它需要同时观察两个层次：每个模块内部的开关电路，以及模块和端口之间交换的能量。本系列用同一个算例贯穿这两个层次。

目标是从电路方程逐步走向缩比实验系统。本文是主指南；若还不熟悉应用动机，可先阅读[固态变压器概论]({{ '/zh/resources/blog/introducing-the-basics-of-solid-state-transformer/' | relative_url }})，再依次学习三个功率级和系统集成。

> **工程草案。** 以下规格定义的是教学设计，不是已经完成测试的 SST。公式和数值均为分析结果；原生 PLECS/Simulink 工程、选型 BOM、量产固件和验证 PCB 仍待开发。文中会明确区分低压实验要求与中压要求。

## 1. “三级”是什么意思

本系列中的三级 AC–AC SST 包含 AC–DC、隔离 DC–DC 与 DC–AC 三个变换级。级数描述功能架构，而不是晶体管桥数量或重复模块数量。

{% include blog-figure.html file="sst-architecture" alt="SST 的 AC–DC、隔离 DC–DC 与 DC–AC 功率链" caption="沿能量方向从左向右观察：浮置高压侧链路分别供给隔离级，其输出再汇入公共低压直流母线。" %}

单级架构在没有两个独立缓冲直流链路的情况下完成交流变换和隔离；两级架构保留一个中间直流链路；三级架构把输入、隔离和输出控制接口分开，代价是更多变换硬件与储能元件。因此架构名称必须与实际方框图同时给出。

如果 SST 只供给直流负载，可以止于 LVDC 端口，无需配置 LVAC 逆变器。数据中心直流供电与本文完整 AC–AC 教学系统是相关配置，但不是相同的功率链。

## 2. 参考架构

前端选用星形连接的三相级联 H 桥（CHB）。每相有 $$N$$ 个交流端串联的 H 桥，每个桥拥有独立浮置电容并供给一个 DAB；隔离后的 DAB 输出并入公共 LVDC 母线，集中式三相逆变器再供给 LVAC 端口。

{% include blog-figure.html file="sst-modules" alt="交流侧串联单元、独立 DAB 与公共直流输出" caption="串联连接分担交流电压，并联的隔离输出分担电流。图中一相包含两个单元，每个高压侧直流链路保持独立。" %}

图中的纵向连线表示功能端口，不是原边共地。当 $$N=2$$ 时存在六个独立高压侧直流链路，绝不能把它们并接。“高压侧”表示隔离屏障原边；在缩比样机中其标称电压只有 48 V。

输入串联、输出并联让模块在一侧分担电压、另一侧分担电流。[Awal 等人的模块化变换器研究](https://arxiv.org/abs/2007.04369)展示了这一原则；本文数值为独立教学算例，并非该原型的复现。

## 3. 全系列统一规格

| 参数 | 教学系统数值 |
|---|---|
| 输入源 | 隔离三相实验电源，48 V 线电压 RMS，50 Hz |
| CHB | 每相 $$N=2$$，总计 $$M=6$$ 个单元 |
| 单元直流电压/电容 | 每个浮置链路 48 V / 2200 µF（初值） |
| DAB | 每模块正向 100 W，匝比 1:1，50 kHz，原边折算传输电感 20 µH |
| 总功率 | 理想传输基准 600 W，实际输入需覆盖损耗 |
| 公共 LVDC 母线 | 48 V，4700 µF（初值） |
| AFE 与输出开关频率 | 每桥 20 kHz |
| LVAC 输出 | 24 V 线电压 RMS，50 Hz，三线制平衡基准 |
| 输出测试负载 | 星形平衡电阻，每相 0.96 Ω，总计 600 W |

六个 100 W 只是无损功率分配。要向实际负载送出 600 W，上游每一级都要承担下游损耗；例如仅初步输出电感电阻在额定负载下就约损耗 18.75 W。物理样机还必须具备经过验证的隔离、限流、放电路径和器件裕量。

平衡、单位功率因数时，

$$
I_{g,\mathrm{rms}}=\frac{P}{\sqrt3V_{g,LL}}=7.22\ \mathrm A,
\qquad I_{o,\mathrm{rms}}=\frac{P}{\sqrt3V_{o,LL}}=14.43\ \mathrm A.
\tag{1}
$$

较低电压的输出侧显然需要更强的电流能力。输入相电压峰值为 39.19 V；两个 48 V 全桥在理想平均模型中最多可合成 96 V 相支路电压，标称正弦利用率约 0.408。对正弦 PWM 两电平输出逆变器，

$$
V_{o,LL,\mathrm{rms}}=\frac{\sqrt3}{2\sqrt2}mV_b,
\qquad m\approx0.816.
\tag{2}
$$

接受工作包络前，还要检查滤波器压降和调节裕量。

## 4. 跟踪功率与储能

定义正功率从输入交流源流向 LVAC 负载。单元与公共母线能量为

$$
E_k=\frac12C_hv_{h,k}^2,\qquad E_b=\frac12C_bv_b^2.
\tag{3}
$$

平均能量平衡为

$$
\dot E_k=p_{\mathrm{AFE},k}-p_{\mathrm{DAB,in},k}-p_{\mathrm{loss},h,k},
\tag{4}
$$

$$
\dot E_b=\sum_{k=1}^{M}p_{\mathrm{DAB,out},k}-p_{\mathrm{inv}}-p_{\mathrm{DCload}}-p_{\mathrm{loss},b}.
\tag{5}
$$

电容只能暂时吸收功率不匹配，不能持续提供缺失功率。这一事实决定控制层级，也决定电源不可用时系统必须采取的动作。

## 5. 明确控制职责

初始正向功率、独立输出模式采用以下分工：

| 控制器 | 主要职责 |
|---|---|
| AFE 快电流环 | 按所需相位关系跟踪输入电流 |
| AFE 总能量环 | 维持高压侧链路平均总能量 |
| 单元均衡环 | 修正各单元能量差 |
| 单个 LVDC 主管 | 把母线电压误差变成总 DAB 输出电流需求 |
| DAB 模块环 | 在电流和相移限值内跟踪分配的电流/功率 |
| 输出逆变器 | 在电流限制内建立 LVAC 电压与频率 |

共享 LVDC 母线只使用一个上层电压调节器，不让多个互不协调的刚性电压环竞争。[系统集成篇]({{ '/zh/resources/blog/modular-sst-system-integration/' | relative_url }})会推导能量与均流环，并讨论并网模式下的另一种职责分配。

## 6. 各功率级学习路线

[AC–DC 前端]({{ '/zh/resources/blog/sst-ac-dc-front-end/' | relative_url }})讨论桥模型、输入电流、单元储能、符号与电压均衡；[DAB 教程]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})讨论开关波形、相移功率、电流应力、低频模型与控制，详细代数见 [DAB 小信号推导]({{ '/zh/resources/blog/dab-power-transfer-and-small-signal-model/' | relative_url }})，磁件见[高频变压器设计]({{ '/zh/resources/blog/sst-high-frequency-transformer-design/' | relative_url }})。

[DC–AC 输出级]({{ '/zh/resources/blog/sst-dc-ac-output-stage/' | relative_url }})从 LC 滤波电压源延伸到并网电流控制；[dq 建模篇]({{ '/zh/resources/blog/three-phase-dq-modelling/' | relative_url }})定义两侧交流级共用的符号和缩放约定。

## 7. 从方程到组装系统

可用 PLECS 建立开关与平均功率级模型，Simulink 研究系统控制、采样实现与状态机，LTspice 验证驱动、开关和模拟测量电路。各环境必须使用同一参数表，任何电感或匝比变化都要同步记录。

调试顺序应从独立供电的单 DAB 开始，再测试一个 AFE 单元与一个输出逆变器；之后组装一相输入支路，最后形成三相系统。每个里程碑都应保存模型版本、器件假设、预期/实测波形和验收准则。稳态仿真正确只是一个里程碑，不能证明硬件隔离、热性能或故障行为。

进一步学习可参考 Erickson 与 Maksimović 的 [*Fundamentals of Power Electronics*（第三版）](https://link.springer.com/book/10.1007/978-3-030-43881-4)。
