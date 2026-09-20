---
layout: post
title: "Boost 升压变换器：从零开始的完整指南"
description: "从第一个开关周期出发，完成 Boost 变换器的参数设计、平均与小信号建模、反馈控制、仿真和原型验证。"
date: 2025-12-09
author: "Dr. Fulong Li"
lang: zh
math: true
converter_explorer: true
converter_series: true
permalink: /zh/resources/blog/boost-converter-from-zero-to-everything/
translation_key: boost-converter-from-zero-to-everything
en_url: /resources/blog/boost-converter-from-zero-to-everything/
---

Boost 变换器通过电感储能把较低直流电压提升到较高电压。本文沿用一个 **12 V→24 V、30 W、100 kHz** 教学算例，从能量路径一直走到控制与样机验证。

> **设计草案，不是已验证参考板。** 数值是分析起点，附带脚本和 LTspice 网表属于教学资源；本文不声称已经取得硬件效率或瞬态指标。

## 1. 工作原理 {#principles}

{% include blog-figure.html file="circuit-boost" alt="Boost 升压变换器功率电路" caption="L1 从输入连接到开关节点；Q1 导通时把该节点拉到回路，关断时 D1 向 C1 与 R1 供能。输入与输出共地。" circuit="boost" %}

设开关周期 $$T_s=1/f_s$$，占空比为 $$D$$。

- **Q 导通：**二极管反偏，电感承受 $$v_L=V_g$$，电流以 $$V_g/L$$ 上升；负载暂由输出电容供电。
- **Q 关断：**电感电流经二极管流入输出，$$v_L=V_g-V_o<0$$，电流下降。

{% include blog-figure.html file="boost-waveforms" alt="Boost 的栅极、电感电压电流与电容电流" caption="栅极改变电感电压，电压改变电流斜率，而电感电流本身保持连续。图中采用标称算例。" %}

{% include converter-explorer.html kind="boost" %}

连续导通模式（CCM）稳态由电感伏秒平衡得到

$$
V_gD+(V_g-V_o)(1-D)=0,
\qquad \boxed{\frac{V_o}{V_g}=\frac1{1-D}}.
\tag{1}
$$

这是假设器件理想且工作在 CCM 的结果。轻载进入断续导通模式（DCM）后，增益还取决于负载、电感和频率，不能继续只用公式（1）。

## 2. 从规格得到元件值 {#design}

教学范围为输入 10–14 V、输出 24 V/30 W。标称占空比 0.5，输出电流 1.25 A，理想平均输入/电感电流 2.5 A。

电感纹波为

$$
\Delta i_{L,\mathrm{pp}}=\frac{V_gD}{Lf_s}.
\tag{2}
$$

取 150 µH，标称纹波约 0.4 A，峰值约 2.70 A。磁件饱和与热额定值还要覆盖输入范围、容差、启动和限流；不能只选刚好超过标称峰值的器件。CCM 边界满足平均电感电流等于纹波一半，标称情况下约对应 2.4 W 输出。

导通期间由电容单独供电，因此

$$
\Delta v_{o,\mathrm{pp}}\approx\frac{I_oD}{Cf_s}.
\tag{3}
$$

330 µF 时理想容性纹波约 18.9 mV；实板还会叠加 ESR、ESL、二极管换相和走线寄生。开关管至少承受输出电压，二极管承受反向输出电压；额定值要覆盖过冲。损耗预算应分别计算 MOSFET 导通与开关损耗、二极管压降、磁件铜损/磁芯损耗和电容 ESR。

## 3. 先做开环仿真 {#open-loop}

开环模型最适合核对符号和器件应力：先使用理想开关确认 12→24 V、纹波和功率平衡，再逐项加入导通电阻、二极管压降、绕组电阻与寄生。初始条件、启动时间和仿真步长都应记录；不要在控制器掩盖问题后才检查功率级。

## 4. 平均模型与右半平面零点 {#models}

CCM 平均状态方程为

$$
L\dot i_L=V_g-(1-d)v_o,qquad
C\dot v_o=(1-d)i_L-\frac{v_o}{R}.
\tag{4}
$$

在工作点线性化后，升高占空比会先缩短二极管向输出供能的时间，因此输出电压最初向错误方向变化，随后才因电感电流增加而上升。这形成右半平面零点

$$
\omega_{z,\mathrm{RHP}}=\frac{R(1-D)^2}{L}.
\tag{5}
$$

本例谐振频率约 358 Hz，品质因数约 14.24，RHP 零点约 5.09 kHz。该零点给相位带来额外滞后，不能用稳定补偿器抵消；电压环带宽必须远低于整个工作范围内最低的 RHP 零点。完整推导见[Boost 小信号建模篇]({{ '/zh/resources/blog/small-signal-modelling-boost-converter/' | relative_url }})。

{% include blog-figure.html file="feedback-loop" alt="从输出测量经控制器与 PWM 构成的负反馈环" caption="先确认误差符号：测得输出偏低时，控制器必须给出使该功率级恢复的动作。计算环路增益时还要包含传感和 PWM 增益。" %}

## 5. 闭环设计 {#feedback}

完整环路增益为功率级、补偿器、PWM、传感比例与延时的乘积。本文提供的慢速 PI 基准交越约 5 Hz，目的是可靠展示调节，而不是宣称产品级动态。要提高带宽，应先扫描输入、负载和 CCM 边界下的极点/零点，再选远低于开关频率和最低 RHP 零点的交越频率，并检查全部增益交越点、相位/增益裕度、占空比饱和与抗积分饱和。

[MATLAB 分析脚本]({{ '/assets/downloads/boost-converter/boost_ccm_analysis.m' | relative_url }})可生成被控对象、控制器与稳定裕度。模拟控制要把 0.1 电压采样比例与 PWM 斜坡幅值计入元件换算；数字控制还要显式计入 ADC、计算和 PWM 更新延时，并在实际离散模型上验证。

## 6. 仿真、PCB 与样机 {#simulation}

可下载 [LTspice 开环网表]({{ '/assets/downloads/boost-converter/boost_open_loop.cir' | relative_url }})，对比标称点、10/14 V 输入、半载/满载、负载阶跃、启动、占空限制和 CCM 边界。PLECS、Simulink 与 LTspice 应共享同一参数表和测试表。

PCB 的高 di/dt 回路是输入电容—电感—开关及二极管—输出电容回路；本地旁路、栅极回路、开关节点面积、功率地与测量地必须有意安排。首次上电应使用限流电源和保守占空比，先检查栅极、开关节点、电感电流和输出，再逐步提高功率。所有示波器结果都要注明探头方法、带宽、工作点和板卡版本。

完成原型只是迈向产品的里程碑；热、EMI/EMC、保护协调、可靠性、器件供应与生产测试仍需独立完成。
