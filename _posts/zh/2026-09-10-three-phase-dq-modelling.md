---
layout: post
title: "三相 dq 建模：坐标、功率与同步"
description: "推导幅值不变 Clarke 与 Park 变换、速度耦合项和功率约定，并得到基本同步旋转坐标系 PLL。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/three-phase-dq-modelling/
translation_key: three-phase-dq-modelling
en_url: /resources/blog/three-phase-dq-modelling/
---

平衡三相波形随时间不断变化。如果控制器改在与基波同速旋转的坐标系中观察，它就会变成常量。这就是 dq 建模的作用：改变描述方式，而不改变物理电路。

本文给出 [SST 输入级]({{ '/zh/resources/blog/sst-ac-dc-front-end/' | relative_url }})与[输出逆变器]({{ '/zh/resources/blog/sst-dc-ac-output-stage/' | relative_url }})采用的约定。推导假设三线制且没有零序电流；不平衡与谐波情况在基本模型之后讨论。

## 1. 三相量与幅值

设正序平衡量的峰值为 $$X$$、相角为 $$\theta$$：

$$
x_a=X\cos\theta,\quad x_b=X\cos(\theta-2\pi/3),\quad x_c=X\cos(\theta+2\pi/3).
\tag{1}
$$

相电压 RMS 为 $$X/\sqrt2$$，不是 $$X$$；平衡线电压 RMS 为 $$\sqrt{3/2}X$$。因此，本系列 48 V 线电压 RMS 输入对应 39.19 V 的 dq 峰值，24 V 输出对应 19.60 V。

## 2. 投影到静止双轴

定义幅值不变 Clarke 变换：

$$
\begin{bmatrix}x_\alpha\\x_\beta\end{bmatrix}
=\frac23\begin{bmatrix}1&-1/2&-1/2\\0&\sqrt3/2&-\sqrt3/2\end{bmatrix}
\begin{bmatrix}x_a\\x_b\\x_c\end{bmatrix},\qquad x_0=\frac{x_a+x_b+x_c}{3}.
\tag{2}
$$

代入平衡波形可得 $$x_\alpha=X\cos\theta$$、$$x_\beta=X\sin\theta$$；系数 $$2/3$$ 保持幅值。当 $$x_0=0$$ 时，逆变换为

$$
\begin{bmatrix}x_a\\x_b\\x_c\end{bmatrix}
=\begin{bmatrix}1&0\\-1/2&\sqrt3/2\\-1/2&-\sqrt3/2\end{bmatrix}
\begin{bmatrix}x_\alpha\\x_\beta\end{bmatrix}.
\tag{3}
$$

若存在零序，重构时要给每相加上 $$x_0$$。两个坐标无法表示三个彼此独立的相量。

{% include blog-figure.html file="dq-axes" alt="静止 αβ 轴与旋转 dq 轴" caption="把同一个矢量投影到旋转了 θ 的坐标轴。当 d 轴跟随平衡电压矢量时，d 分量为常量，q 分量为零。" %}

## 3. 旋转坐标轴

对控制器选定的角度 $$\theta_r$$，定义 Park 变换

$$
\begin{bmatrix}x_d\\x_q\end{bmatrix}
=\underbrace{\begin{bmatrix}\cos\theta_r&\sin\theta_r\\-\sin\theta_r&\cos\theta_r\end{bmatrix}}_{T(\theta_r)}
\begin{bmatrix}x_\alpha\\x_\beta\end{bmatrix}.
\tag{4}
$$

于是 $$x_d=X\cos(\theta-\theta_r)$$、$$x_q=X\sin(\theta-\theta_r)$$。参考角跟随波形时，$$x_d=X$$、$$x_q=0$$。重构先用 $$T^{-1}=T^T$$，再用逆 Clarke 变换。明确写出矩阵很重要，因为其他资料可能采用相反 q 轴方向或不同归一化。

{% include blog-figure.html file="abc-dq" alt="正弦 abc 量与对齐后的 dq 常量" caption="上方波形随时间旋转；只有坐标系以相同角度和速度旋转时，下方分量才保持恒定。角度错误会产生 q 分量。" %}

## 4. 速度耦合项

变换矩阵本身随时间变化。令 $$\omega_r=\dot\theta_r$$，由乘积法则

$$
\frac{d}{dt}\begin{bmatrix}x_d\\x_q\end{bmatrix}
=T\frac{d}{dt}\begin{bmatrix}x_\alpha\\x_\beta\end{bmatrix}
+\omega_r\begin{bmatrix}x_q\\-x_d\end{bmatrix}.
\tag{5}
$$

因此静止坐标中的电感方程 $$L\dot{\boldsymbol i}=\boldsymbol u-r\boldsymbol i-\boldsymbol v$$ 变为

$$
L\dot i_d=u_d-ri_d-v_d+\omega_rLi_q,\qquad
L\dot i_q=u_q-ri_q-v_q-\omega_rLi_d.
\tag{6}
$$

电容电流为 $$i_f-i_o$$ 时，

$$
C\dot v_d=i_{f,d}-i_{o,d}+\omega_rCv_q,\qquad
C\dot v_q=i_{f,q}-i_{o,q}-\omega_rCv_d.
\tag{7}
$$

符号来自矩阵求导，不应脱离矩阵死记。在 AFE 中，输入电流正方向为电源流向变换器，因此物理方程从“电源电压减变换器电压”开始；这会改变控制符号，但不会改变坐标变换求导规则。

## 5. 功率与无功符号

旋转保持点积，幅值不变 Clarke 变换则引入 $$3/2$$ 系数。无零序时

$$
p=\frac32(v_di_d+v_qi_q),\qquad Q=\frac32(v_qi_d-v_di_q).
\tag{8}
$$

在平衡正弦稳态、d 轴与电压对齐时，滞后电流满足 $$i_d=I\cos\phi$$、$$i_q=-I\sin\phi$$，因此 $$P=3VI\cos\phi/2$$、$$Q=3VI\sin\phi/2$$。按本文电流方向，AFE 的正 $$Q$$ 表示感性吸收；逆变器若把电流定义为流向接收端，正 $$Q$$ 表示向外提供无功。

非平衡或非正弦情况下，瞬时叉积量不能与所有电能计量定义中的无功功率等同。功率不变变换也采用不同缩放，不能未经换算就与上述幅值混用。

## 6. 角度从哪里来

独立电压源可以直接规定 $$\dot\theta_r=2\pi f^*$$。并网跟随变换器则要估计现有电压角。令电网角为 $$\theta_g$$，估计为 $$\hat\theta$$：

$$
v_q=V\sin(\theta_g-\hat\theta)\approx V(\theta_g-\hat\theta).
\tag{9}
$$

用适当滤波且非零的电压幅值估计归一化，可得 $$e\approx\theta_g-\hat\theta$$。基本同步旋转坐标系 PLL 为

$$
\dot z=e,\qquad \hat\omega=\omega_0+k_pe+k_iz,\qquad \dot{\hat\theta}=\hat\omega.
\tag{10}
$$

正 q 轴电压意味着估计角落后，控制器应提高估计频率。锁定点线性化后

$$
\frac{\widetilde{\hat\theta}}{\widetilde\theta_g}
=\frac{k_ps+k_i}{s^2+k_ps+k_i},\qquad
k_p=2\zeta\omega_n,\quad k_i=\omega_n^2.
\tag{11}
$$

对归一化检测器，暂取自然频率 20 Hz、$$\zeta=0.707$$，可得 $$k_p=177.7\ \mathrm{s^{-1}}$$、$$k_i=1.579\times10^4\ \mathrm{s^{-2}}$$。实际增益还必须考虑滤波、低电压处理及其与电流环的相互作用。

## 7. 简单模型遗漏了什么

负序相对正序坐标系反向旋转，因此在正序旋转坐标中表现为两倍工频；谐波也仍然随时间变化。处理不平衡需要适当的序分量提取、谐振补偿或附加模型，单独一个 dq 变换不会消除扰动。

并网跟随变换器线性化时，PLL 角度也是状态。d 轴对齐工作点附近有

$$
\widetilde v_q=-\sin\Theta_r\,\widetilde v_\alpha
+\cos\Theta_r\,\widetilde v_\beta-V_d\widetilde\theta_r.
\tag{12}
$$

漏掉最后一项会隐藏角度耦合；把电网频率视为恒定也只是模型假设。

在接入变换器模型前，应先用合成平衡正弦波验证实现：对齐时 d 应等于相峰值、q 应为零，逆变换应还原输入，abc 与 dq 功率应一致。再施加一个小的正相位阶跃，确认 q 和 PLL 频率修正最初均向上。这些检查能尽早暴露缩放和符号错误。

实际 dq 电压电流控制示例可参考 [Imperix 的构网型逆变器说明](https://imperix.com/doc/implementation/grid-forming-inverter)。返回[系列指南]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})可了解这一坐标模型在完整 SST 中的位置。
