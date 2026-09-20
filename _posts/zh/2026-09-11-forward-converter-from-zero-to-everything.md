---
layout: post
title: "正激变换器：从零开始的完整指南"
description: "隔离型 Buck：真正的变压器传能、磁芯复位、占空比上限，以及双管和有源钳位变体。"
date: 2025-12-14
author: "Dr. Fulong Li"
lang: zh
math: true
converter_series: true
permalink: /zh/resources/blog/forward-converter-from-zero-to-everything/
translation_key: forward-converter-from-zero-to-everything
en_url: /resources/blog/forward-converter-from-zero-to-everything/
---

[反激]({{ '/zh/resources/blog/flyback-converter-from-zero-to-everything/' | relative_url }})先把负载能量储存在磁场中，关断后再释放；正激则在主开关导通期间直接通过变压器向负载传能，副边输出电感把整流电压滤成连续电流。因此它本质上是隔离型 Buck。

## 1. 隔离型 Buck {#principles}

{% include blog-figure.html file="circuit-forward_2sw" alt="双管正激及复位二极管" caption="Q1/Q2 同时开关，D1/D2 把励磁能量回送输入；D3 为正激整流二极管，D4 为续流二极管。副边回路与原边隔离。" circuit="forward_2sw" %}

令 $$n=N_p/N_s$$，开通时副边整流节点约为 $$V_g/n$$，关断时由续流二极管把节点钳在近零。下游与 Buck 完全相同，因此理想 CCM 增益为

$$
\boxed{V_o=D\frac{V_g}{n}}.
\tag{1}
$$

原副边负载电流在导通期间同时流动，变压器不需要像反激耦合电感那样储存全部负载能量；但励磁能量和磁芯磁通仍必须每周期复位。

## 2. 复位问题与占空比上限 {#reset}

导通期间原边承受 $$+V_g$$，磁化电流上升。如果关断后不施加反向伏秒，磁通会逐周期偏移并饱和。经典单管正激使用第三复位绕组 $$N_r$$ 把励磁能量送回输入。伏秒平衡要求

$$
V_gDT_s=V_g\frac{N_p}{N_r}\delta_rT_s,
\qquad \delta_r=D\frac{N_r}{N_p}.
\tag{2}
$$

复位必须在剩余周期内完成，所以

$$
D\le\frac{N_p}{N_p+N_r}.
\tag{3}
$$

当 $$N_r=N_p$$ 时，得到著名的 $$D\le0.5$$。单管关断还要承受输入与反射复位电压之和，1:1 复位时理想值为 $$2V_g$$；72 V 高线即为 144 V，通常需要 200 V 器件。

{% include blog-figure.html file="forward-reset" alt="正激原边电压与励磁电流复位过程" caption="正、负电压幅值相等时，复位时间等于励磁时间；D=1/2 时理想复位余量消失。" %}

## 3. 48 V→12 V、30 W 算例 {#design}

输入 36–72 V、输出 12 V/2.5 A、100 kHz，取输出电感 150 µH、电容 100 µF。为在 36 V 低线仍将 duty 控制在 0.5 以下，选择 $$n=4/3$$，低线 duty 约 0.444，标称为 0.333，高线为 0.222。

输出电感按 Buck 计算：

$$
\Delta i_L=\frac{(V_g/n-V_o)D}{Lf_s}
=\frac{V_o(1-D)}{Lf_s}.
\tag{4}
$$

还需分别校核整流与续流二极管反压/RMS 电流、输出电容 ESR、变压器励磁电流、磁通密度、铜损、漏感尖峰和绝缘。匝比降低能保留低线占空裕量，但会提高副边电压和二极管应力。

## 4. 双管与有源钳位变体 {#variants}

**双管正激**在原边对角放置两只开关和两只复位二极管。关断时励磁能量回到输入，每只开关理想只承受约 $$V_g$$，无需复位绕组；复位电压仍为 $$V_g$$，所以占空上限仍约 0.5。代价是第二只开关与高边驱动，这是中等功率常用方案。

**有源钳位正激**用辅助开关和电容建立复位电压。它可回收漏感/励磁能量、允许适当设计下 duty 超过 0.5，并利用这些能量实现 ZVS；代价是钳位电压、死区、启动和控制更复杂。不能只看到“可超过 0.5”就忽略磁通摆幅与器件应力。

## 5. 控制：本系列最简单的被控对象之一 {#control}

输出级就是 Buck，仅把等效输入电压换成 $$V_g/n$$：

$$
G_{vd}(s)=\frac{V_g/n}{LCs^2+(L/R)s+1}
\tag{5}
$$

（暂忽略 ESR）。它没有 Boost 类 RHP 零点。本例的谐振和阻尼与 12 V Buck 算例相同，只是 DC duty 增益由 24 V/duty 变为 36 V/duty。补偿器仍需处理 LC 峰、采样/PWM 延时、占空上限、峰值电流和磁芯复位约束。

## 6. 仿真与应用 {#simulation}

打开 [双管正激 LTspice 网表]({{ '/assets/downloads/forward-converter/forward_2sw_open_loop.cir' | relative_url }})，观察输出、整流节点、输出电感与原边电流。核对每只开关两端电压，而不是把某个节点电压当成两只器件应力；原边电流应包含叠加在反射负载电流上的小励磁斜坡，并在每周期复位到初值。

若故意超出复位允许时间，理想线性磁件模型只能显示伏秒偏置与励磁电流漂移，不能预测真实饱和和器件失效；需要经过验证的非线性磁芯模型和硬件保护。

正激适合隔离工业电源、通信与中等功率 DC–DC。与反激、推挽、半桥和全桥的边界应按输入范围、开关应力、磁件利用率、复位方案和损耗预算决定，而不是套用固定功率阈值。
