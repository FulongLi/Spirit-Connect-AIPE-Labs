---
layout: post
title: "功率半导体表征：电气、热与可靠性测试指南"
description: "从静态特性、双脉冲与热阻抗，到加速老化和寿命估算的完整功率器件测试学习地图。"
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/power-semiconductor-characterisation-guide/
translation_key: power-semiconductor-characterisation-guide
en_url: /resources/blog/power-semiconductor-characterisation-guide/
---

功率半导体不能只用额定电压和电流描述。变换器设计者还需要知道它如何导通与开关、热量如何到达冷却系统，以及这些行为如何随重复应力发生变化。

本系列连接三个问题：**器件现在做什么、它会有多热、长期会怎样变化？** 每项测量都应把激励、响应和解释分开，才能形成可用且可辩护的模型。

## 1. 区分表征、资格认证与寿命预测

**表征**是在明确工作域内测量行为，例如

$$
R_{DS(on)}=f(T_j,I_D,V_{GS},\text{偏置历史},\text{测量时刻}).
\tag{1}
$$

**资格认证**用规定样本群、应力程序和判据判断是否通过，其结论只覆盖该程序。**寿命估算**则把真实应力历史、失效机理模型和统计证据结合起来，不能把“通过多少小时资格试验”直接换算成现场年限。

测试矩阵必须先明确器件技术与封装。Si MOSFET、IGBT、SiC MOSFET、GaN 以及功率模块在导通、反向电流、栅极和老化机理上并不相同。

{% include blog-figure.html file="device-test-map" alt="从电气、热和可靠性测试到寿命估算的关系" caption="学习顺序是先定义电气行为，再测量热后果，最后在已知应力下解释老化。" %}

## 2. 电气表征清单

| 测试 | 主要输出 | 详细文章 |
|---|---|---|
| 静态导通与阻断 | 输出/转移曲线、导通电阻、阈值、泄漏 | [静态电气测试]({{ '/zh/resources/blog/static-electrical-characterisation/' | relative_url }}) |
| 动态开关 | 开通/关断能量、过冲、恢复、误导通 | [双脉冲测试]({{ '/zh/resources/blog/double-pulse-testing/' | relative_url }}) |
| 电荷与电容 | 栅极电荷、非线性电容、输出电荷/能量 | [电荷与动态导通电阻]({{ '/zh/resources/blog/gate-charge-capacitance-dynamic-resistance/' | relative_url }}) |
| 历史相关导通 | 指定高压应力和延时后的动态 $$R_{on}$$ | [动态导通电阻]({{ '/zh/resources/blog/gate-charge-capacitance-dynamic-resistance/' | relative_url }}) |
| 异常事件 | SOA、雪崩/UIS、短路与保护时间 | [鲁棒性测试]({{ '/zh/resources/blog/semiconductor-robustness-testing/' | relative_url }}) |

DPT 测到的是“DUT 加换相电路”的行为；对管、栅极电阻、布局或初始温度改变后，能量也会改变，所有条件都要随结果保存。

## 3. 热表征

先校准[结温测量]({{ '/zh/resources/blog/junction-temperature-measurement/' | relative_url }})，再测[稳态热阻]({{ '/zh/resources/blog/steady-state-thermal-resistance/' | relative_url }})与[瞬态热阻抗]({{ '/zh/resources/blog/transient-thermal-impedance/' | relative_url }})。稳态热阻描述指定边界下最终温升，瞬态阻抗描述温升随时间的发展；二者都依赖散热路径。封装表面温度不等于结温，多芯片器件还要考虑交叉加热。

## 4. 可靠性与寿命

| 应力家族 | 主要问题 | 详细文章 |
|---|---|---|
| 主动功率循环 | 自热循环对键合、互连、焊层的影响 | [功率循环]({{ '/zh/resources/blog/power-cycling-reliability/' | relative_url }}) |
| 被动温度循环 | 外界温度变化造成的材料与接头应变 | [温度循环]({{ '/zh/resources/blog/temperature-cycling-reliability/' | relative_url }}) |
| 高温偏压/湿热 | 阻断、栅介质、腐蚀、漏电和绝缘退化 | [偏压与湿热]({{ '/zh/resources/blog/bias-humidity-reliability-testing/' | relative_url }}) |
| 统计寿命 | 分布、删失样本、加速与任务剖面损伤 | [寿命估算]({{ '/zh/resources/blog/mission-profile-lifetime-estimation/' | relative_url }}) |

应力必须对应目标失效机理。振动、机械冲击、ESD 和应用特定环境试验可能同样必要，但需要各自的方法。

## 5. 先写测量计划，再施加应力

先明确数据要支持的决定，例如比较栅极电阻、选择散热路径、提取模型参数或验证失效假设；再定义测量量和允许不确定度。最低记录包括：器件/批次/样本编号，端口电压电流与脉冲历史，结温与安装边界，仪器/探头/带宽/校准/去时延，原始文件、积分窗口、滤波和代码版本，以及重复点、多样本与异常分类。

高能量和故障试验需要封闭防护、联锁、放电确认与验证过的保护流程。先在低能量下调通仪器与时序。

## 6. 从测量到模型

变换器初步损耗模型为

$$
P_{cond}=\frac1T\int_0^Tv_{on}(t)i(t)dt,
\qquad P_{sw}=f_s\sum E_r.
\tag{2}
$$

必须注明开关能量积分已经包含哪些恢复与电容过程，避免重复叠加 $$E_{oss}$$ 或恢复损耗。固定热边界下，线性热模型可写为

$$
T_j(t)-T_{ref}=\int_0^th_{th}(t-\tau)P_{loss}(\tau)d\tau,
\quad h_{th}=\frac{dZ_{th}}{dt}.
\tag{3}
$$

温度又会改变导通和开关损耗，因此电热迭代要保持一致。静态曲线用于电路模型，能量表用于系统损耗，热网络用于温度响应；任何一种模型都不能自动回答另一个层次的问题。保留未参与拟合的工况用于验证。

## 7. 推荐学习顺序

从 Kelvin 静态电阻和低能量测试开始，接着校准结温，再做 DPT、电荷/电容和热瞬态。建立基线后再进行老化，才能区分真实退化、温度误差、接触漂移与探头变化。最后才把应力历史和失效证据送入任务剖面寿命模型，形成从实验、模型到设计决策的可追溯链条。
