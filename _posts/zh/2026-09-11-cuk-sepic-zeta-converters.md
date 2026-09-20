---
layout: post
title: "Ćuk、SEPIC 与 Zeta：四阶升降压拓扑家族"
description: "三种可升可降的变换器：反相 Ćuk、非反相 SEPIC 与 Zeta，以及电容传能和不同端口电流特性。"
date: 2025-12-12
author: "Dr. Fulong Li"
lang: zh
math: true
converter_series: true
permalink: /zh/resources/blog/cuk-sepic-zeta-converters/
translation_key: cuk-sepic-zeta-converters
en_url: /resources/blog/cuk-sepic-zeta-converters/
---

[经典 Buck–Boost]({{ '/zh/resources/blog/buck-boost-converter-from-zero-to-everything/' | relative_url }})用很少器件解决升降压，却付出输出反相、输入输出电流均脉动、开关承受 $$V_g+V$$ 的代价。Ćuk、SEPIC 和 Zeta 增加一个电感和串联耦合电容，用更多储能元件换取更好的端口电流特性。

## 1. 共同思想：通过电容传输能量 {#idea}

两只电感分别塑造输入与输出电流，串联电容在两个开关节点之间传递能量。三种拓扑在理想 CCM 中具有相同的增益幅值：

$$
\boxed{\frac{V}{V_g}=\frac{D}{1-D}}.
\tag{1}
$$

Ćuk 输出为负，SEPIC 与 Zeta 输出为正。耦合电容的直流电压可由“稳态下任一电感平均电压为零”直接求得。

## 2. 三种拓扑 {#topologies}

### Ćuk：两端电流均连续

{% include blog-figure.html file="circuit-cuk" alt="Ćuk 变换器电路" caption="输出为负；L1 和 L2 使输入、输出在 CCM 中都具有连续电流。耦合电容平均电压约为 Vg+V。" circuit="cuk" %}

Ćuk 的主要优势是输入和输出都经过电感，端口纹波小；代价是反相输出，以及承受较大电压和 RMS 电流的耦合电容。

### SEPIC：输入电流连续、输出同相

{% include blog-figure.html file="circuit-sepic" alt="SEPIC 变换器电路" caption="输出为正；L1 保持输入电流连续，输出经 D1 接收脉冲电流。耦合电容平均电压约等于输入。" circuit="sepic" %}

SEPIC 常用于输入可能高于或低于输出、又不希望反相的场景。输入 EMI 较友好，但输出电容仍承担脉冲电流。

### Zeta：输出电流连续、输出同相

{% include blog-figure.html file="circuit-zeta" alt="Zeta 变换器电路" caption="输出为正；输入电流被 Q1 切断，而 L2 持续向输出供能。耦合电容平均电压幅值约为输出电压。" circuit="zeta" %}

Zeta 可视为 SEPIC 的端口互换形式，输出电流连续，适合更看重输出纹波的负载。

## 3. 12 V、30 W 算例 {#example}

取输入标称 12 V（8–16 V）、输出幅值 12 V/2.5 A、100 kHz、$$L_1=L_2=150\ \mu\mathrm H$$、$$C_s=22\ \mu\mathrm F$$。标称 $$D=0.5$$，输入和输出平均功率各 30 W，两个电感平均电流均约 2.5 A。

每只电感纹波约为

$$
\Delta i_L=\frac{V_gD}{Lf_s}=0.40\ \mathrm A.
\tag{2}
$$

开关导通时通常承载两只电感电流之和，约 5 A，并阻断 $$V_g+V=24\ \mathrm V$$；它们改善的是端口纹波，而不是半导体电压应力。

耦合电容纹波近似为

$$
\Delta v_{C_s}\approx\frac{I_oD}{C_sf_s}=0.57\ \mathrm V,
\tag{3}
$$

RMS 电流约 2.5 A。该电容应选低 ESR 的薄膜或陶瓷器件，并按开关频率下的纹波电流与直流偏置降额；这是 SEPIC 样机常见的薄弱点。

SEPIC 输出电容承担脉冲供电，330 µF 时理想纹波约 37.9 mV；Ćuk 与 Zeta 的输出有 L2 连续滤波，100 µF 下仅按三角纹波估算约 5 mV，电容 RMS 电流也显著降低。

## 4. 如何选择 {#choosing}

| 特性 | Ćuk | SEPIC | Zeta |
|---|---|---|---|
| 输出极性 | 负 | 正 | 正 |
| 输入电流 | 连续 | 连续 | 脉冲 |
| 输出电流 | 连续 | 脉冲 | 连续 |
| 耦合电容直流电压 | $$V_g+V$$ | $$V_g$$ | 约 $$V$$ |
| 开关阻断电压 | $$V_g+V$$ | $$V_g+V$$ | $$V_g+V$$ |

输入端 EMI 最重要时优先考虑 SEPIC；极低输出纹波且允许反相时 Ćuk 很有吸引力；需要正输出且希望输出电流连续时考虑 Zeta。若输入永远不跨越输出，Buck 或 Boost 更简单高效；若效率比器件数重要，四开关 Buck–Boost 往往优于三者。

## 5. 耦合电感 {#coupled}

两个电感可绕在同一磁芯上。适当耦合能减少体积并通过纹波抵消降低某一端口纹波，但漏感、绕组极性、磁芯偏置和饱和必须一起分析。不能简单把两个独立 150 µH 电感替换成“总共 150 µH”的耦合器件。

## 6. 动态与控制 {#control}

这是四阶系统：$$L_1$$–$$C_s$$ 与 $$L_2$$–$$C_o$$ 形成两个相互耦合的谐振对，低寄生阻尼时负载阶跃会产生持续振铃，常需在 $$C_s$$ 两端加串联 RC 或其他阻尼网络。

SEPIC 和 Ćuk 在 CCM 中具有 Boost 派生的右半平面零点：提高 duty 会先减少输出受能时间，因此闭环带宽受最低输入角点的零点限制。Zeta 的输出更像 Buck，通常没有 CCM RHP 零点，但仍应在具体工作点验证，而不能只凭拓扑名称下结论。

## 7. 仿真与应用 {#simulation}

可下载 [SEPIC 开环网表]({{ '/assets/downloads/cuk-sepic-zeta/sepic_open_loop.cir' | relative_url }})和 [Ćuk 开环网表]({{ '/assets/downloads/cuk-sepic-zeta/cuk_open_loop.cir' | relative_url }})。改变 duty 至 0.4/0.6，检查升降压、极性、开关应力、耦合电容 RMS 电流和负载阶跃振铃；再加入 RC 阻尼比较差异。

这些拓扑适用于汽车与电池输入、LED、低噪声正/负电源和对端口纹波有明确要求的系统。最终选择应由输入范围、极性、EMI、效率、磁件与电容应力共同决定。
