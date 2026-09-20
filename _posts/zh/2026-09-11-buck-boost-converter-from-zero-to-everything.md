---
layout: post
title: "Buck–Boost 变换器：从零开始的完整指南"
description: "单级升压或降压：从反相 Buck–Boost 的开关周期、器件应力与右半平面零点，到四开关非反相拓扑。"
date: 2025-12-11
author: "Dr. Fulong Li"
lang: zh
math: true
converter_series: true
permalink: /zh/resources/blog/buck-boost-converter-from-zero-to-everything/
translation_key: buck-boost-converter-from-zero-to-everything
en_url: /resources/blog/buck-boost-converter-from-zero-to-everything/
---

Buck–Boost 能在单级中升压或降压。经典单开关电路输出极性反相；四开关版本可保持同极性，并在输入接近输出时平滑跨越工作区。本文采用 **12 V→−12 V、30 W、100 kHz** 的反相算例。

## 1. 反相 Buck–Boost 的工作周期 {#principles}

{% include blog-figure.html file="circuit-buck_boost" alt="反相 Buck–Boost 电路" caption="输出相对公共回路为负。D1 阳极接负输出，阴极接开关节点；C1 使用无极性图形表示。" circuit="buck_boost" %}

- **开关导通：**输入给电感充能，二极管截止，输出电容独自供给负载。
- **开关关断：**电感电压反向，电流经二极管向输出电容和负载释放。

输入与输出电流都是脉冲，即使电感电流连续也不代表端口电流连续。

{% include blog-figure.html file="buck-boost-paths" alt="Buck–Boost 电感电流及脉冲输入、整流电流" caption="两个端口分别只在一个开关区间导通；图中的 I* 是任意电流标度，不是实测值。" %}

伏秒平衡给出

$$
V_gD-|V_o|(1-D)=0,
\qquad \boxed{\frac{V_o}{V_g}=-\frac{D}{1-D}}.
\tag{1}
$$

当 $$D<0.5$$ 时幅值降压，$$D>0.5$$ 时升压。进入 DCM 后，增益不再只由占空比决定。

## 2. 元件与纹波 {#design}

输入范围 8–16 V、输出 −12 V/30 W。标称 $$D=0.5$$、输出电流 2.5 A，电感平均电流为 $$I_o/(1-D)=5\ \mathrm A$$。电感纹波为

$$
\Delta i_{L,\mathrm{pp}}=\frac{V_gD}{Lf_s}.
\tag{2}
$$

150 µH 时标称纹波 0.4 A；低输入电压需要更大占空比并带来更高平均/峰值电感电流，通常是热和饱和的最差角点。输出电容在导通期间独自供电：

$$
\Delta v_{o,\mathrm{pp}}\approx\frac{I_oD}{Cf_s}.
\tag{3}
$$

应把 ESR、电容 RMS 纹波电流和脉冲充电一并纳入选型。

## 3. 灵活性的代价：器件应力 {#stress}

开关关断和二极管反偏时要承受输入与输出幅值之和：

$$
V_{Q,\mathrm{stress}}\approx V_g+|V_o|,
\qquad V_{D,\mathrm{reverse}}\approx V_g+|V_o|.
\tag{4}
$$

标称应力 24 V，高线为 28 V，尚未包含寄生过冲。与 Buck 仅承受 $$V_g$$、Boost 主要承受 $$V_o$$ 相比，Buck–Boost 会叠加两者。输入输出脉冲电流还会增加电容 RMS、EMI 和布局压力。

## 4. 模型与最严苛的 RHP 零点 {#models}

CCM 平均模型可写为

$$
L\dot i_L=dV_g-(1-d)|v_o|,qquad
C\dot{|v_o|}=(1-d)i_L-\frac{|v_o|}{R}.
\tag{5}
$$

提高占空比会先减少输出获得电感能量的时间，再通过提高电感电流增加稳态输出，因此 duty-to-output 具有右半平面零点：

$$
\omega_{z,\mathrm{RHP}}=\frac{R(1-D)^2}{L}.
\tag{6}
$$

本例 DC 增益约 48 V/duty，谐振约 358 Hz、$$Q\approx3.56$$，RHP 零点约 2.55 kHz，仅约为对应 Boost 算例的一半。低线会同时降低零点频率和谐振频率并提高电感电流，因此控制器必须在全输入范围最低零点下仍稳定。

## 5. 闭环控制 {#feedback}

电压环带宽要显著低于最低 RHP 零点和开关频率。先用平均模型验证符号与低频增益，再加入补偿器、传感/PWM 比例和延时；必须检查占空比与电流限制、抗积分饱和、启动和从 CCM 向 DCM 的变化。[MATLAB 脚本]({{ '/assets/downloads/buck-boost-converter/buckboost_ccm_analysis.m' | relative_url }})会报告稳定裕度、逆响应并扫描输入范围的 RHP 零点。

## 6. 四开关非反相 Buck–Boost {#non-inverting}

{% include blog-figure.html file="circuit-four_switch" alt="四开关非反相 Buck–Boost" caption="输入与输出正母线彼此独立、下母线共用；L1 连接两个桥臂中点，Q1/Q2 为输入桥臂，Q3/Q4 为输出桥臂。" circuit="four_switch" %}

四开关拓扑可以按输入/输出关系工作在 Buck 区、Boost 区或过渡区，输出不反相，也更适合双向同步运行。代价是器件与驱动数量增加、模式切换复杂、两个桥臂的死区和电流路径都要管理。不要把两个独立控制器在边界处硬切换；应设计连续的调制策略和积分状态处理。

## 7. 仿真与应用 {#simulation}

下载 [LTspice 开环网表]({{ '/assets/downloads/buck-boost-converter/buckboost_open_loop.cir' | relative_url }})并观察 `V(out)`、`V(sw)` 与 `I(L1)`。测试 8/12/16 V、轻载/满载、负载阶跃、启动、限幅和 DCM；用开关模型确认器件叠加电压和电容纹波电流。

反相拓扑适合偏置电源、LED 与少量负电源；四开关版本常见于电池系统、USB‑PD、汽车与输入可能高于或低于输出的场景。最终样机仍需覆盖热、EMI、保护、反向连接和故障能量。
