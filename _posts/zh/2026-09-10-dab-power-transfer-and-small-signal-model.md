---
layout: post
title: "DAB 功率传输与小信号建模：逐步推导"
description: "在明确参考方向和模型假设后，推导双有源桥电流波形、相移功率、RMS 电流与低频控制模型。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/dab-power-transfer-and-small-signal-model/
translation_key: dab-power-transfer-and-small-signal-model
en_url: /resources/blog/dab-power-transfer-and-small-signal-model/
---

DAB 功率公式只有在变量与假设都明确时才有意义。本文是 [DAB 主教程]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})的推导补充：先按开关区间得到波形，再构造控制模型。

## 1. 电路与近似

两桥均产生 50% 占空比对称方波。先假设一个开关周期内直流电压不变，忽略损耗、死区、励磁电流与开关过渡。定义

$$
n=\frac{N_p}{N_s},\quad V_2'=nV_2,\quad
\omega_s=2\pi f_s,\quad \theta=\omega_st.
\tag{1}
$$

总传输电感 $$L_\sigma$$ 折算到原边，电流正方向从原边桥流向变压器，正功率进入副边直流端口，副边方波滞后 $$\phi$$。前半周期内

$$
\frac{di_\sigma}{d\theta}=\begin{cases}
\dfrac{V_1+V_2'}{\omega_sL_\sigma},&0<\theta<\phi,\\[5pt]
\dfrac{V_1-V_2'}{\omega_sL_\sigma},&\phi<\theta<\pi.
\end{cases}
\tag{2}
$$

第一段在电感上施加两端电压之和，第二段施加其差；电压匹配时第二段斜率为零。

{% include blog-figure.html file="dab-waveforms" alt="匹配电压 DAB 周期内的电流端点" caption="使用端点方程前，先在波形上定位 I0、Iφ 与 Iπ；图示零偏置解还包含明确的对称条件。" %}

## 2. 求电流端点

令 $$I_0=i_\sigma(0)$$、$$I_\phi=i_\sigma(\phi)$$、$$I_\pi=i_\sigma(\pi)$$。积分两段斜率：

$$
I_\phi=I_0+\frac{(V_1+V_2')\phi}{\omega_sL_\sigma},\qquad
I_\pi=I_\phi+\frac{(V_1-V_2')(\pi-\phi)}{\omega_sL_\sigma}.
\tag{3}
$$

选择对称零直流偏置解 $$I_\pi=-I_0$$，得到

$$
I_0=-\frac{(V_1-V_2')\pi+2V_2'\phi}{2\omega_sL_\sigma},
\qquad
I_\phi=\frac{-(V_1-V_2')\pi+2V_1\phi}{2\omega_sL_\sigma}.
\tag{4}
$$

理想无损电感可以保留任意直流电流偏置，因此“零偏置”是额外工作条件，并非仅凭周期性自动成立。

## 3. 积分瞬时功率

电压和电流每半周期同时反号，乘积因此重复。副边平均功率为

$$
P=\frac1\pi\left[-V_2'\int_0^\phi i_\sigma d\theta
+V_2'\int_\phi^\pi i_\sigma d\theta\right].
\tag{5}
$$

把线性电流区间视为梯形面积并代入端点，可得

$$
\boxed{P=\frac{nV_1V_2}{\omega_sL_\sigma}\phi
\left(1-\frac{|\phi|}{\pi}\right)},\qquad -\pi\le\phi\le\pi.
\tag{6}
$$

相移反号会反转功率。正功率最大值位于 $$\phi=\pi/2$$，超过该点后相移继续增大反而使功率下降，因此控制器通常只使用单调支路。电压失配时，即使相移为零、平均功率为零，公式（4）仍预示环流，真实变换器仍有导通损耗。

{% include blog-figure.html file="dab-power" alt="常用单调控制区内的带符号相移功率曲线" caption="正相移产生正副边功率；超过 ±90° 后功率定律不再单调，因此图中强调常用控制支路。" %}

## 4. 电流应力

端点为 $$a,b$$ 的线性电流段，其均方值为 $$(a^2+ab+b^2)/3$$。应用到两段可得

$$
I_{\sigma,\mathrm{rms}}^2=\frac{1}{3\pi}\left[
\phi(I_0^2+I_0I_\phi+I_\phi^2)
+(\pi-\phi)(I_\phi^2-I_\phi I_0+I_0^2)\right].
\tag{7}
$$

当 $$V_1=V_2'$$ 时，

$$
I_{\mathrm{pk}}=\frac{V_1\phi}{\omega_sL_\sigma},\qquad
I_{\sigma,\mathrm{rms}}=I_{\mathrm{pk}}\sqrt{1-\frac{2\phi}{3\pi}}.
\tag{8}
$$

48 V、1:1、50 kHz、20 µH 的 100 W 小角度工作点为 $$\Phi=0.3016767\ \mathrm{rad}$$、$$I_{\mathrm{pk}}=2.30464\ \mathrm A$$、$$I_{\mathrm{rms}}=2.22965\ \mathrm A$$。这些仍未包含励磁、死区与寄生效应。

## 5. 慢动态模型

虽然 $$i_\sigma$$ 的普通周期平均为零，$$v_2'i_\sigma$$ 的平均并不为零；分别平均开关电压和电流会丢失功率传输机理。若端口电压和相移相对开关周期缓慢变化，可使用准稳态功率：

$$
\bar i_2=\frac{nv_1}{\omega_sL_\sigma}\phi\left(1-\frac\phi\pi\right),
\qquad C_2\frac{dv_2}{dt}=\bar i_2-\frac{v_2}{R}.
\tag{9}
$$

该模型保留输出电容这个储能状态，却消去了快速传输电流动态，因此不适合预测单次换相或很快的相移阶跃。

## 6. 扰动与线性化

令 $$v_1=V_1+\hat v_1$$、$$v_2=V_2+\hat v_2$$、$$\phi=\Phi+\hat\phi$$。一阶展开得到

$$
\hat i_2=K_\phi\hat\phi+K_{v1}\hat v_1,
\tag{10}
$$

$$
K_\phi=\frac{nV_1}{\omega_sL_\sigma}\left(1-\frac{2\Phi}{\pi}\right),
\quad
K_{v1}=\frac{n}{\omega_sL_\sigma}\Phi\left(1-\frac\Phi\pi\right).
\tag{11}
$$

因此

$$
G_{v\phi}(s)=\frac{K_\phi}{C_2s+1/R},\qquad
G_{vv1}(s)=\frac{K_{v1}}{C_2s+1/R}.
\tag{12}
$$

100 W 算例中，$$R=23.04\ \Omega$$、$$C_2=470\ \mu\mathrm F$$，$$K_\phi=6.17226\ \mathrm{A/rad}$$，极点为 14.6974 Hz。$$\Phi=\pi/2$$ 时增量相移增益为零，一阶模型中不再具备相移控制能力。

## 7. 负载改变，被控对象也改变

受控下游变换器在一定带宽内近似恒功率负载。以 $$P_\ell$$ 取代电阻后，

$$
\left(C_2s-\frac{P_\ell}{V_2^2}\right)\hat v_2
=K_\phi\hat\phi+K_{v1}\hat v_1-\frac{\hat p_\ell}{V_2}.
\tag{13}
$$

电压下降时恒功率负载会吸取更多电流；在固定相移和刚性原边条件下，该理想模型出现右半平面极点。但这并不能单独证明受控 SST 不稳定，仍需纳入负载带宽、母线控制器、并联模块与电源动态。

波形积分已用匹配与失配电压数值核对，线性系数也以有限差分检查；这些是分析验证，不是硬件结果。补偿和实现请返回 [DAB 主教程]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})。
