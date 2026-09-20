---
layout: post
title: "从第一性原理建立小信号模型：Boost 变换器推导"
description: "解释小信号模型为什么有效，并逐步推导 Boost 的平均方程、工作点、传递函数和右半平面零点。"
date: 2025-12-09
author: "Dr. Fulong Li"
lang: zh
math: true
converter_series: true
permalink: /zh/resources/blog/small-signal-modelling-boost-converter/
translation_key: small-signal-modelling-boost-converter
en_url: /resources/blog/small-signal-modelling-boost-converter/
---

小信号模型不是把开关电路“变成线性电路”，而是在一个指定稳态附近，用一阶近似描述平均量的缓慢变化。过程包含两个不同步骤：先按开关周期平均以去掉快速纹波，再在工作点附近线性化。

本文沿用 [12 V→24 V Boost 算例]({{ '/zh/resources/blog/boost-converter-from-zero-to-everything/' | relative_url }})，假设理想开关与二极管、固定电阻负载、CCM、较小开关纹波，并暂时忽略电感电阻与电容 ESR。

## 1. 小信号到底是什么 {#purpose}

把变量写为稳态值与小扰动之和，例如 $$d=D+\hat d$$、$$v_o=V+\hat v_o$$。帽号表示相对工作点的偏差，不是导数。线性模型只在扰动足够小、没有跨越工作模式或限幅时有效；启动、大信号负载阶跃和 CCM/DCM 切换仍应使用非线性平均模型或开关模型。

## 2. 两个开关状态 {#switching}

储能关系为

$$
v_L=L\frac{di_L}{dt},\qquad i_C=C\frac{dv_o}{dt}.
\tag{1}
$$

开关导通时二极管截止，

$$
\dot i_L=\frac{v_g}{L},\qquad
\dot v_o=-\frac{v_o}{RC}.
\tag{2}
$$

开关关断时电感经二极管供给输出，

$$
\dot i_L=\frac{v_g-v_o}{L},\qquad
\dot v_o=\frac{i_L}{C}-\frac{v_o}{RC}.
\tag{3}
$$

第二式中必须减去负载电流；输出不是只有电感给电容充电。

{% include blog-figure.html file="model-levels" alt="开关、平均与小信号模型回答不同问题" caption="周期平均去掉快速纹波；线性化再在某个平衡点附近近似平均方程。这是两个独立步骤。" %}

## 3. 周期平均 {#averaging}

按导通比例 $$d$$ 与关断比例 $$1-d$$ 加权，可得非线性平均模型：

$$
\boxed{L\dot i_L=v_g-(1-d)v_o},\qquad
\boxed{C\dot v_o=(1-d)i_L-v_o/R}.
\tag{4}
$$

快速纹波已消失，但 $$dv_o$$、$$di_L$$ 等乘积仍在，所以平均并不等于线性。

## 4. 平衡工作点 {#equilibrium}

令 $$q=1-D$$，稳态导数为零：

$$
0=V_g-qV,qquad 0=qI-\frac VR,
\tag{5}
$$

因此

$$
\boxed{V=\frac{V_g}{q}},\qquad
\boxed{I=\frac{V}{Rq}=\frac{V_g}{Rq^2}}.
\tag{6}
$$

工作点必须满足这些方程，否则线性化后会残留常值强迫项。

{% include blog-figure.html file="boost-linearisation" alt="Boost 精确增益曲线及 D=0.5 处切线" caption="线性模型是工作点附近的切线；偏离越远，局部近似误差越大。" %}

## 5. 展开并保留一阶项 {#linearisation}

令

$$
v_g=V_g+\hat v_g,quad v_o=V+\hat v_o,quad
i_L=I+\hat i_L,quad d=D+\hat d.
\tag{7}
$$

代入公式（4），利用平衡条件消去常数，并舍去 $$\hat d\hat v_o$$、$$\hat d\hat i_L$$ 等二阶小量：

$$
\boxed{L\dot{\hat i}_L=\hat v_g-q\hat v_o+V\hat d},
\tag{8}
$$

$$
\boxed{C\dot{\hat v}_o=q\hat i_L-I\hat d-\frac{\hat v_o}{R}}.
\tag{9}
$$

电容方程中的负 duty 项极其重要：占空比刚增加时，电感电流尚未上升，但每周期向输出送能的关断区间已经缩短。

状态空间形式为

$$
\dot{\hat x}=A\hat x+B_d\hat d+B_g\hat v_g,
\quad
A=\begin{bmatrix}0&-q/L\\q/C&-1/(RC)\end{bmatrix},
\tag{10}
$$

$$
B_d=\begin{bmatrix}V/L\\-I/C\end{bmatrix},\qquad
B_g=\begin{bmatrix}1/L\\0\end{bmatrix}.
\tag{11}
$$

## 6. 传递函数 {#transfer-functions}

在初始**扰动**为零时作拉普拉斯变换并消去 $$\hat i_L$$：

$$
\Delta(s)\hat v_o=q\hat v_g+(qV-LIs)\hat d,
\quad
\Delta(s)=LCs^2+\frac LR s+q^2.
\tag{12}
$$

于是 duty-to-output 与 input-to-output 分别为

$$
\boxed{G_{vd}(s)=\frac{qV-LIs}{LCs^2+(L/R)s+q^2}},
\tag{13}
$$

$$
\boxed{G_{vg}(s)=\frac{q}{LCs^2+(L/R)s+q^2}}.
\tag{14}
$$

这只是功率级，不包含控制器、分压器、PWM 增益或延时。

增加并联小信号负载电流 $$\hat i_\ell$$ 后，按“额外负载导致电压下降”定义输出阻抗：

$$
\boxed{Z_o(s)=-\frac{\hat v_o}{\hat i_\ell}
=\frac{Ls}{\Delta(s)}}.
\tag{15}
$$

理想模型给出 $$Z_o(0)=0$$，并不意味着真实变换器没有输出阻抗或瞬态压降。

{% include blog-figure.html file="feedback-loop" alt="闭环中的 Boost 功率级模型" caption="Gvd 只是功率级方块；必须另加传感、补偿器、PWM 增益和延时。" %}

## 7. 极点和右半平面零点的物理意义 {#physical-meaning}

归一化表达为

$$
G_{vd}(s)=\frac{V}{q}
\frac{1-s/\omega_z}{1+s/(Q\omega_0)+(s/\omega_0)^2},
\tag{16}
$$

其中

$$
\omega_0=\frac{q}{\sqrt{LC}},\qquad
Q=Rq\sqrt{\frac CL},\qquad
\omega_z=\frac{Rq^2}{L}.
\tag{17}
$$

双极点表示电感与电容之间的耦合储能；分子零点位于正半平面。对一个正 duty 阶跃，初始斜率为

$$
\dot{\hat i}_L(0^+)=\frac VL\hat d>0,
\qquad
\dot{\hat v}_o(0^+)=-\frac IC\hat d<0.
\tag{18}
$$

输出先下降、最终才上升，这就是逆响应。RHP 零点增加幅值却带来相位滞后，不能用控制器的正半平面极点去“抵消”，否则会引入内部不稳定模式。

独立检查 DC 增益也很重要：对 $$V=V_g/(1-D)$$ 求导，$$\partial V/\partial D=V/q=G_{vd}(0)$$，与模型一致。

## 8. 代入 12 V→24 V 算例 {#example}

取 $$V_g=12\ \mathrm V$$、$$D=0.5$$、$$R=19.2\ \Omega$$、$$L=150\ \mu\mathrm H$$、$$C=330\ \mu\mathrm F$$，工作点为 $$V=24\ \mathrm V$$、$$I=2.5\ \mathrm A$$。得到

$$
G_{vd}(0)=48\ \mathrm{V/duty},\quad
f_0\approx357.7\ \mathrm{Hz},\quad Q\approx14.24,
\quad f_z\approx5.093\ \mathrm{kHz}.
\tag{19}
$$

若 $$\hat d=0.005$$，线性模型预测最终上升 0.240 V；精确 CCM 新平衡为 24.2424 V，误差很小。若 duty 从 0.5 大幅跳到 0.6，线性模型预测 +4.8 V，而精确值为 +6 V，清楚显示局部模型的边界。

[MATLAB 脚本]({{ '/assets/downloads/boost-converter/boost_ccm_analysis.m' | relative_url }})可重现传递函数、阶跃逆响应与保守 PI 分析。

## 9. 验证而不是盲信代数 {#validation}

至少做三种检查：用稳态增益导数核对 DC 增益；用有限差分比较非线性平均模型与线性模型的小扰动；用开关模型在多周期平均后比较响应。随后加入电感电阻、电容 ESR、二极管压降、采样与 PWM 延时，并扫描输入、负载和 CCM/DCM 边界。小信号模型的价值不在于替代所有仿真，而在于解释哪些动态来自哪里、控制带宽为什么受限。
