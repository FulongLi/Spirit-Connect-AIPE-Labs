---
layout: post
title: "反激变换器：从零开始的完整指南"
description: "最简单的隔离变换器：耦合电感储能、匝比、漏感与钳位、CCM/DCM 选择和闭环设计。"
date: 2025-12-13
author: "Dr. Fulong Li"
lang: zh
math: true
converter_series: true
permalink: /zh/resources/blog/flyback-converter-from-zero-to-everything/
translation_key: flyback-converter-from-zero-to-everything
en_url: /resources/blog/flyback-converter-from-zero-to-everything/
---

反激是最简单、最常见的隔离 DC–DC 拓扑之一。本文使用 **48 V→12 V、30 W、100 kHz** 算例。它不是“普通变压器后接整流器”，而是把 Buck–Boost 的储能电感分成耦合绕组：开关导通时储能，关断时才把能量送到副边。

## 1. 隔离改变了什么 {#principles}

隔离用于人身安全、大变比转换，以及消除地环路或完成电平转换。输入与输出回路必须真正分开，原副边测量和布局不能偷偷把隔离跨接。

{% include blog-figure.html file="circuit-flyback" alt="原副边回路分离的反激变换器" caption="结合同名端与连线判断极性；T1 是耦合储能元件，不是只传递瞬时功率的理想变压器。图中省略钳位。" circuit="flyback" %}

{% include blog-figure.html file="flyback-forward-timing" alt="反激与正激的能量传输时序比较" caption="反激在关断区间由副边传能；正激在导通区间通过变压器传能，关断后由独立输出电感继续供电。" %}

## 2. 匝比、增益和应力 {#turns}

令 $$n=N_p/N_s$$。原边励磁电感伏秒平衡为

$$
V_gD=nV(1-D),qquad
\boxed{\frac{V}{V_g}=\frac{D}{n(1-D)}},
\tag{1}
$$

所以

$$
D=\frac{nV}{V_g+nV}.
\tag{2}
$$

$$V_{\mathrm{OR}}=nV$$ 称为反射电压。本文取 $$n=2$$，因此 $$V_{\mathrm{OR}}=24\ \mathrm V$$，标称 duty 为 1/3。理想开关关断电压约为

$$
V_{DS,\mathrm{off}}\approx V_g+nV,
\tag{3}
$$

尚未包含漏感尖峰；副边二极管反压约为 $$V+V_g/n$$。增大 $$n$$ 会提高 MOSFET 应力、降低二极管应力，减小 $$n$$ 则相反，匝比是首要权衡而非免费增益。

## 3. 磁件和电容 {#design}

输入范围 36–72 V，输出 12 V/2.5 A，取原边励磁电感 220 µH、输出电容 470 µF。原边电流纹波为

$$
\Delta i_m=\frac{V_gD}{L_mf_s}=0.727\ \mathrm A
\tag{4}
$$

（标称点）。平均与峰值电流还由功率和工作模式决定。磁芯必须在最差输入、负载和温度下不饱和；反激每周期储存 $$\tfrac12L_mI_{\mathrm{pk}}^2$$，气隙正是储能所需。设计还要检查绕组窗口、铜损、邻近效应、绝缘和原副边电容。

副边只在关断期间供电，输出电容需要承担较大 RMS 纹波电流。容量、ESR、温升和寿命都要按脉冲电流，而不是只按允许电压纹波选择。

## 4. 漏感与关断钳位 {#leakage}

真实耦合不完全。漏感能量不会传到副边，开关关断时会把漏极电压推高：

$$
E_{lk}=\frac12L_{lk}I_{\mathrm{pk}}^2,qquad
P_{lk}\approx E_{lk}f_s.
\tag{5}
$$

若漏感约 2 µH、峰值 2.24 A，每周期约 5.5 µJ，即 100 kHz 下约 0.55 W。RCD 钳位简单但耗散能量；TVS 适合限制尖峰但效率有限；有源钳位可回收能量并创造 ZVS 条件，却增加器件与控制复杂度。钳位必须结合实测漏感、峰值电流和允许 MOSFET 电压设计。

## 5. CCM 还是 DCM {#modes}

DCM 每周期电流回到零，副边二极管零电流关断、控制模型较简单，但相同功率下峰值和 RMS 电流更高。CCM 降低峰值、适合较大功率，却具有 Boost 类右半平面零点和更复杂环路。临界模式可在两者间折中，但频率会随工况变化。

选择不是口号：应比较磁件、开关/二极管损耗、输出电容纹波、EMI、负载范围和控制 IC 能力。

## 6. CCM 小信号与闭环 {#control}

把量折算到副边，$$L_e=L_m/n^2=55\ \mu\mathrm H$$。CCM 反激等效为带匝比的 Buck–Boost，duty-to-output 具有双极点与 RHP 零点。其零点随工作点移动，不能由控制器稳定抵消。

本低压输出算例的最差 RHP 零点约 12.5 kHz，但 LC 谐振峰很高，因此实际 Type II 补偿通常把零点放在谐振附近、把高频极点放在交越之上，并把带宽保持在开关频率和最差 RHP 零点的安全比例内。还要包括光耦/隔离反馈动态、采样延时、占空与峰值电流限制、软启动和抗积分饱和。

[MATLAB 脚本]({{ '/assets/downloads/flyback-converter/flyback_ccm_analysis.m' | relative_url }})可扫描工作点和稳定裕度。

## 7. 仿真、验证与适用范围 {#simulation}

打开 [flyback_open_loop.cir]({{ '/assets/downloads/flyback-converter/flyback_open_loop.cir' | relative_url }})，观察输出、漏极电压、原边和副边电流。先用理想耦合核对增益与极性，再加入漏感和钳位，扫描 36–72 V、轻载/满载、启动与短路。测量漏感时要明确另一侧端接方式。

反激特别适合多路小功率辅助电源、适配器、PoE 和高变比低中功率电源。功率上升后，峰值/RMS 电流、输出电容和钳位损耗会快速恶化；何时改用[正激]({{ '/zh/resources/blog/forward-converter-from-zero-to-everything/' | relative_url }})或桥式拓扑，应由实际应力与损耗而不是固定瓦数界线决定。
