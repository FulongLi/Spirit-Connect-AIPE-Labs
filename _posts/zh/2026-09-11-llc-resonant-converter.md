---
layout: post
title: "LLC 谐振变换器：从增益曲线到软开关"
description: "LLC 谐振腔、FHA 增益曲线、ZVS 条件、必须避开的容性区域，以及从参数设计到仿真的完整路线。"
date: 2025-12-16
author: "Dr. Fulong Li"
lang: zh
math: true
converter_series: true
permalink: /zh/resources/blog/llc-resonant-converter/
translation_key: llc-resonant-converter
en_url: /resources/blog/llc-resonant-converter/
---

硬开关过程中，晶体管电压与电流在过渡时重叠，频率越高损耗越大。LLC 把谐振网络放到变换过程中心，利用方向与电荷都合适的谐振电流在死区内给开关节点电容换流，使 MOSFET 近似零电压开通（ZVS）。它降低开通损耗，但不会消除关断、导通、磁性和驱动损耗。

本文分析一个 **390 V→12 V、240 W** 半桥 LLC，以开关频率调节输出，桥臂保持近似 50% 互补驱动。

## 1. 为什么使用谐振 {#why}

硬开关损耗的粗略估计为

$$
P_{\mathrm{sw}}\approx\tfrac12V_{DS}I_{\mathrm{sw}}(t_r+t_f)f_s.
\tag{1}
$$

LLC 让谐振电流近似正弦并在需要时滞后驱动电压，从而在下一只器件开通前完成输出电容充放电。ZVS 是否成立必须覆盖轻载、启动、电压极值、器件非线性电容和实际死区，不能由拓扑名称自动保证。

## 2. 三个元件、两个谐振点 {#tank}

{% include blog-figure.html file="circuit-llc_fha" alt="折算到原边的 LLC 基波等效电路" caption="这是 FHA 等效电路而非完整开关电路：Vin 表示基波激励，R1 为 Rac，Lm 与折算负载并联，Cr 与 Lr 决定主谐振。" circuit="llc_fha" %}

- $$L_r$$：串联谐振电感，可由设计漏感或外接电感构成；
- $$C_r$$：串联谐振电容，阻断直流但不能替代启动与磁通偏置检查；
- $$L_m$$：变压器励磁电感，是有意参与增益和换相的参数。

两个特征频率为

$$
f_r=\frac{1}{2\pi\sqrt{L_rC_r}},
\qquad
f_m=\frac{1}{2\pi\sqrt{(L_r+L_m)C_r}}.
\tag{2}
$$

取 $$L_r=80\ \mu\mathrm H$$、$$C_r=33\ \mathrm{nF}$$、$$L_m=400\ \mu\mathrm H$$，得到 $$f_r=97.95\ \mathrm{kHz}$$、$$f_m=39.99\ \mathrm{kHz}$$。

两个核心无量纲参数为

$$
L_n=\frac{L_m}{L_r},\qquad
Q=\frac{\sqrt{L_r/C_r}}{R_{ac}},
\quad R_{ac}=\frac8{\pi^2}n^2R_{load}.
\tag{3}
$$

较小 $$L_n$$ 提供更大增益范围但增加环流；$$Q$$ 随负载变化，轻载小、满载大。本文 $$L_n=5$$，满载 $$Q=0.396$$。

## 3. FHA 增益曲线 {#gain}

基波近似（FHA）只保留方波激励的基波，令 $$f_n=f_s/f_r$$，可得

$$
\boxed{M(f_n)=\frac{1}{\sqrt{\left(1+\frac1{L_n}-\frac1{L_nf_n^2}\right)^2
+Q^2\left(f_n-\frac1{f_n}\right)^2}}}.
\tag{4}
$$

半桥输出关系为

$$
V_o=M\frac{V_{in}/2}{n}.
\tag{5}
$$

{% include blog-figure.html file="llc-gain" alt="不同负载下 LLC 增益随归一化频率变化" caption="所有曲线在串联谐振点穿过单位增益；沿一条曲线可看频率调节，比较曲线可看负载依赖。增益峰值或单位增益都不能单独证明 ZVS。" %}

在 $$f_s=f_r$$ 时 FHA 增益为 1；高于谐振是温和的降压区，低于谐振可得到大于 1 的增益，但继续降频后会越过峰值。选择 $$n=16$$ 时，单位增益输出为 $$(390/2)/16=12.19\ \mathrm V$$，因此标称点略高于谐振即可调到 12 V。

满载 FHA 无约束峰值约为 1.398，位于 $$f_n\approx0.491$$。不能直接用它声明最低母线电压，因为峰值可能落入容性区；保持时间还取决于母线电容可用能量、负载与损耗。

## 4. 感性区与换相电荷 {#zvs}

增益回答电压比，输入电抗符号回答基波电流超前还是滞后。令 $$x=f_s/f_r$$，归一化输入电抗为

$$
\frac{\operatorname{Im}Z_{in}}{Z_0}
=x-\frac1x+\frac{xL_n}{1+(xL_nQ)^2}.
\tag{6}
$$

正值为感性。本文满载边界约为 $$x=0.5525$$（54.1 kHz），高于无约束增益峰的 0.491；实用最低频率还要留出感性和换相裕量。

感性输入并不等于 ZVS 已成立。死区期间必须有足够、方向正确的电流转移节点电荷：

$$
\left|\int_{t_{dead}}i_{comm}(t)dt\right|
\gtrsim Q_{oss,upper}+Q_{oss,lower}+Q_{stray}.
\tag{7}
$$

真实 $$C_{oss}$$ 非线性，最终证据是实际栅极开通瞬间的 $$V_{DS}$$ 波形。

{% include blog-figure.html file="llc-reactance" alt="LLC 输入电抗零点与增益峰位置不同" caption="正值为感性、负值为容性；本文边界约为 0.5525fr，而无约束增益峰约为 0.491fr。" %}

## 5. 设计顺序 {#design}

本文参数为 390 V、12 V/20 A、$$n=16$$、$$L_r=80\ \mu\mathrm H$$、$$C_r=33\ \mathrm{nF}$$、$$L_m=400\ \mu\mathrm H$$。实用流程是：

1. 令标称输入附近所需增益约为 1，选择匝比；
2. 选择 $$L_n$$（常见 3–8），权衡增益范围与环流；
3. 选择满载 $$Q$$（常见 0.3–0.5），决定曲线形状；
4. 只在留有裕量的感性区内检查可实现增益；
5. 选择 $$f_r$$，再由 $$Z_0=QR_{ac}$$ 解出 $$L_r,C_r$$；
6. 扫描输入、负载、容差、启动与故障下的电抗和死区换相；
7. 用开关模型和硬件验证 FHA。

[FHA 增益脚本]({{ '/assets/downloads/llc-converter/llc_fha_gain.m' | relative_url }})可在 MATLAB/Octave 中绘制曲线。$$C_r$$ 承担全部谐振电流，峰值电压可能数百伏，应选足够耐压、低损耗的薄膜器件。

## 6. 轻载与控制 {#lightload}

轻载时，环流、驱动和磁损相对输出功率变大；仅靠无限升频也不能让理想增益降到任意小。常见办法是突发模式，但必须评估低频纹波、声学噪声、待机损耗和模式切换。

LLC 由压控振荡器调频，功率级强非线性：增益斜率随输入、频率和负载大幅变化，简单 DC 工作点平均方法也不再直接适用。实际环路往往较慢，输出电容承担快速负载瞬态；控制器必须有明确最低频率（保持感性区）、最高频率（限制轻载）和谐振电流过流保护。20 A 输出通常值得使用同步整流，但必须按副边电流区间定时，不能照搬原边门极。

## 7. 仿真与应用 {#simulation}

打开 [LLC 开环网表]({{ '/assets/downloads/llc-converter/llc_open_loop.cir' | relative_url }})，扫频观察差分输出、$$I(L_r)$$、开关节点和 $$C_r$$ 电压。理想电压控制开关模型只适合研究增益和谐振电流，不能验证真实 ZVS；需要加入非线性输出电容、体二极管、驱动时序和寄生，再检查实际开通瞬间的 $$V_{DS}$$。

LLC 广泛用于服务器、通信、消费电子和高效适配器；双向车载系统常用对称 CLLC。宽电压范围或苛刻瞬态下，应与[移相全桥]({{ '/zh/resources/blog/push-pull-half-bridge-full-bridge/' | relative_url }}#psfb)、DAB 或两级方案按完整任务剖面比较。

## 8. 变换器系列回顾

贯穿整个系列的工具始终是电感伏秒平衡、电容电荷平衡，以及在适用时围绕工作点的扰动线性化。拓扑选择不是背诵“最佳功率范围”，而是把输入输出范围、隔离、器件应力、动态、软开关、热与故障要求放在同一张表上比较。
