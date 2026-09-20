---
layout: post
title: "Buck 降压变换器：从零开始的完整指南"
description: "从开关周期到器件设计、平均模型、反馈控制、仿真、PCB 与 Buck 原型验证。"
date: 2025-12-10
author: "Dr. Fulong Li"
lang: zh
math: true
converter_explorer: true
converter_series: true
permalink: /zh/resources/blog/buck-converter-from-zero-to-everything/
translation_key: buck-converter-from-zero-to-everything
en_url: /resources/blog/buck-converter-from-zero-to-everything/
---

Buck 变换器用开关和 LC 滤波把较高直流电压降到较低电压。本文使用 **24 V→12 V、30 W、100 kHz、150 µH** 算例，与 [Boost 篇]({{ '/zh/resources/blog/boost-converter-from-zero-to-everything/' | relative_url }})镜像比较。

> 数值是分析起点，不是已验证参考板；下载文件用于教学，不代表已完成 PCB 或硬件指标。

## 1. 一个开关周期 {#principles}

{% include blog-figure.html file="circuit-buck" alt="Buck 降压变换器功率电路" caption="Q1 是高边开关；D1 从公共回路向开关节点续流。L1 在两个区间都向 C2 与 R1 供电，C1 是本地输入电容。" circuit="buck" %}

- **Q 导通：**开关节点为 $$V_g$$，电感电压 $$V_g-V_o$$，电流上升。
- **Q 关断：**二极管续流，电感电压约为 $$-V_o$$，电流下降。

{% include blog-figure.html file="buck-waveforms" alt="Buck 的栅极、电感电压电流与电容电流" caption="栅极改变电感电压与电流斜率，电感电流保持连续。图中采用标称算例。" %}

{% include converter-explorer.html kind="buck" %}

稳态伏秒平衡给出

$$
(V_g-V_o)D-V_o(1-D)=0,
\qquad \boxed{V_o=DV_g}.
\tag{1}
$$

轻载进入 DCM 时，增益还取决于负载、L 与频率；同步整流允许负电流时，模式定义也会改变。

## 2. 元件设计 {#design}

教学输入范围 20–28 V，输出 12 V/30 W。标称占空比 0.5，负载电流 2.5 A。电感纹波为

$$
\Delta i_{L,\mathrm{pp}}
=\frac{(V_g-V_o)D}{Lf_s}
=\frac{V_o(1-D)}{Lf_s}.
\tag{2}
$$

150 µH 时标称纹波为 0.4 A，峰值约 2.70 A。固定输出时纹波随输入电压上升，28 V 是最不利点，峰值约 2.73 A。电感选择必须覆盖饱和、铜损、磁芯损耗、温度、启动和限流。

输出电容理想容性纹波近似为

$$
\Delta v_{o,\mathrm{pp}}\approx\frac{\Delta i_{L,\mathrm{pp}}}{8Cf_s}.
\tag{3}
$$

100 µF 时约 5 mV，但真实板上 ESR/ESL 往往占主导。输入电容承担脉冲电流，必须靠近桥臂并校核 RMS 纹波。开关与二极管主要承受输入电压；同步 Buck 用下管替代二极管可降低低压大电流损耗，但引入死区与反向电流控制问题。

## 3. 建模 {#models}

CCM 平均模型为

$$
L\dot i_L=dV_g-v_o,qquad
C\dot v_o=i_L-\frac{v_o}{R}.
\tag{4}
$$

线性化后 duty-to-output 被控对象具有 LC 双极点和由电容 ESR 产生的左半平面零点，却**没有右半平面零点**。占空比提高会立刻增大电感电压和输出能量流，初始响应方向正确。这是 Buck 通常比 Boost 更容易实现高带宽电压控制的根本原因。

本例无阻尼固有频率约 1.30 kHz、$$Q\approx3.92$$。轻阻尼谐振峰仍会造成额外增益交越，因此不能仅凭“没有 RHP 零点”就任意提高 PI 增益。

{% include blog-figure.html file="feedback-loop" alt="Buck 输出负反馈环" caption="环路增益必须同时包含功率级、补偿器、传感比例、PWM 增益与延时。" %}

## 4. 闭环与实现 {#feedback}

先用有意放慢的 PI 基准验证误差极性、饱和与稳态调节，再按瞬态目标设计 Type II/III 或数字补偿器。候选交越应远低于开关频率，并避开未充分阻尼的 LC 峰；检查全部输入/负载角点以及采样、计算、PWM 更新的延时。

[MATLAB 分析脚本]({{ '/assets/downloads/buck-converter/buck_ccm_analysis.m' | relative_url }})建立 CCM 被控对象并列出稳定裕度。若模拟反馈以 1.2 V 对应 12 V 输出，传感增益为 0.1；直接 duty-domain 的 PI 数字不能忽略该比例和 PWM 斜坡后直接换成电阻电容。数字实现需要抗积分饱和、软启动、过流与欠压处理，并验证量化与周期抖动。

## 5. 仿真、布局与上电 {#simulation}

从平均模型验证工作点与控制，再用开关模型检查纹波、死区和器件应力。下载 [buck_open_loop.cir]({{ '/assets/downloads/buck-converter/buck_open_loop.cir' | relative_url }})，至少测试 20/24/28 V、半载/满载、负载阶跃、启动、限幅和 CCM 边界。

布局时把输入电容、上下开关/二极管的高 di/dt 回路做小，缩小开关节点铜皮，并把反馈取样远离功率回流。首次上电先不用闭环或采用严格占空限制，在限流电源下验证栅极互锁、开关节点、电感电流与输出极性，再逐步闭环和加负载。

台架报告应同时给出计算、仿真和实测的稳态电压、纹波、效率、器件温度、负载阶跃与保护行为。一个可工作的原型仍不等于满足热、EMC、可靠性和生产要求的产品。
