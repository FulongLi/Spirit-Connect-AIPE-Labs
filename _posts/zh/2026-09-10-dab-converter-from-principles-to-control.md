---
layout: post
title: "DAB 隔离级：从开关波形到闭环控制"
description: "以一致的参考方向推导双有源桥相移功率，分析器件应力、软开关、低频模型与实验验证。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/dab-converter-from-principles-to-control/
translation_key: dab-converter-from-principles-to-control
en_url: /resources/blog/dab-converter-from-principles-to-control/
---

双有源桥（DAB）通过高频变压器连接两个直流端口。两侧都使用有源全桥，因此功率方向和大小均可控制。在本文 SST 中，每个 DAB 把一个浮置 CHB 直流链路连接到公共低压直流母线。

变压器提供电气隔离和电压变换；串联电感限制电流变化率并参与功率传输，它可以由变压器漏感、外接电感或二者共同构成。

{% include blog-figure.html file="circuit-dab" alt="由变压器和串联传输电感隔开的两个有源全桥" caption="全桥把直流链路的正或负极性施加到绕组端口。Ls 是折算到原边的总传输电感，文中记为 Lσ；两侧回路互不相连，由变压器提供隔离。" circuit="dab" %}

## 1. 先定义参考方向

令原边和副边直流电压分别为 $$V_1$$、$$V_2$$：

$$
n=\frac{N_p}{N_s},\qquad V_2'=nV_2,
\qquad L_\sigma=L_{\mathrm{leak},p}+n^2L_{\mathrm{leak},s}+L_{\mathrm{ext},p}.
\tag{1}
$$

所有交流电流和电感量均折算到原边。正传输电流从原边桥流向变压器，正功率从端口 1 流向端口 2。单相移（SPS）控制中，两桥均生成 50% 占空比对称方波，副边波形相对原边滞后 $$\phi$$；令 $$\omega_s=2\pi f_s$$。

## 2. 从电压差推导电流与功率

初步忽略励磁电流、损耗、死区和电容纹波：

$$
L_\sigma\frac{di_\sigma}{dt}=v_1-v_2'.
\tag{2}
$$

令 $$\theta=\omega_st$$，在前半周期

$$
\frac{di_\sigma}{d\theta}=\begin{cases}
(V_1+V_2')/(\omega_sL_\sigma),&0<\theta<\phi,\\
(V_1-V_2')/(\omega_sL_\sigma),&\phi<\theta<\pi.
\end{cases}
\tag{3}
$$

对称零直流偏置解满足 $$i_\sigma(\pi)=-i_\sigma(0)$$。对各区间积分并计算端口平均功率，可得理想 SPS 传输定律：

$$
\boxed{P=\frac{nV_1V_2}{\omega_sL_\sigma}\phi
\left(1-\frac{|\phi|}{\pi}\right)},\qquad -\pi\le\phi\le\pi.
\tag{4}
$$

负相移会反转功率方向。基准控制器使用单调区 $$|\phi|<\pi/2$$；理想正向最大值位于 $$\phi=\pi/2$$：

$$
P_{\max}=\frac{nV_1V_2}{8f_sL_\sigma}.
\tag{5}
$$

这是数学极值，不是热额定值或电流额定值。

{% include blog-figure.html file="dab-waveforms" alt="100 W 教学工作点的 DAB 桥电压与传输电流" caption="相移区间内两桥电压相反，电流线性上升；匹配电压时其后两桥电压相同，电流保持不变。电压失配会改变第二段斜率。" %}

## 3. 100 W 单元算例

取两端均 48 V、$$n=1$$、50 kHz、20 µH，可得 $$P_{\max}=288\ \mathrm W$$。100 W 的小角度解为

$$
\Phi=\frac\pi2\left(1-\sqrt{1-P/P_{\max}}\right)
=0.30168\ \mathrm{rad}=17.285^\circ.
\tag{6}
$$

匹配电压时，电流在相移区间从 −2.305 A 上升到 +2.305 A，随后保持恒定；理想平均输出电流为 2.083 A。传输电流 RMS 为

$$
I_{\sigma,\mathrm{rms}}=I_{\mathrm{pk}}\sqrt{1-\frac{2\Phi}{3\pi}}
\approx2.23\ \mathrm A.
\tag{7}
$$

端口平均电流、变压器 RMS 电流和半导体器件电流并不相同。详细模型还要加入励磁电流、死区和寄生参数。传输电感不能只按标称功率选择，还必须检查全电压范围；当 $$V_1\ne nV_2$$ 时可能出现很大的环流。

## 4. 软开关只存在于一定范围

桥臂换相时，方向合适的电感电流可以在下一只器件导通前完成开关节点电容充放电，从而近似实现零电压开通。初步能量判据为

$$
\frac12L_{\mathrm{comm}}I_{\mathrm{comm}}^2\gtrsim E_{\mathrm{cap,transition}}.
\tag{8}
$$

这只是筛选条件；还要考虑电流极性、换相回路、非线性输出电容、励磁电流和死区时间。平均功率低不代表换相电流一定足够。应使用合适的器件模型并测量栅极与开关节点时序，逐个确认所有工作点的换相。[TI TIDA-010054](https://www.ti.com/tool/TIDA-010054)是完整 DAB 参考设计示例。

SPS 适合作为第一种调制；双相移和三相移可进一步整形电流，但必须重新进行区间分析和约束验证。

## 5. 低频被控对象

变压器交流电流的周期平均值可以为零，同时仍传输有功功率。因此不能用普通平均电流替代开关波形；应从周期平均端口功率出发。正相移且原边电压刚性时，

$$
\bar i_2=\frac{P}{v_2}
=\frac{nV_1}{\omega_sL_\sigma}\phi(1-\phi/\pi).
\tag{9}
$$

独立 DAB 供给电阻 $$R$$ 与电容 $$C_2$$ 时，

$$
C_2\dot v_2=\bar i_2-v_2/R.
\tag{10}
$$

在工作点 $$\Phi$$ 线性化：

$$
K_\phi=\frac{nV_1}{\omega_sL_\sigma}(1-2\Phi/\pi),
\qquad \frac{\hat v_2}{\hat\phi}=\frac{K_\phi}{C_2s+1/R}.
\tag{11}
$$

算例中 $$K_\phi=6.172\ \mathrm{A/rad}$$。若测试电容为 470 µF、负载 23.04 Ω，极点约为 14.7 Hz。该模型只适用于相对开关周期缓慢的变化，不能解析快速电流瞬态与换相。

## 6. 独立电压控制器

令 $$\hat\phi=(K_p+K_i/s)(\hat v_2^*-\hat v_2)$$，闭环特征多项式为

$$
C_2s^2+(1/R+K_\phi K_p)s+K_\phi K_i.
\tag{12}
$$

与二阶目标匹配可得

$$
K_p=\frac{2\zeta\omega_nC_2-1/R}{K_\phi},\qquad
K_i=\frac{C_2\omega_n^2}{K_\phi}.
\tag{13}
$$

取 $$\zeta=0.707$$、$$f_n=100\ \mathrm{Hz}$$，连续时间示例增益约为 0.0606 rad/V 与 30.1 rad/(V·s)。仍需检查实际交越频率、稳定裕度与延时。相移要限制在单调区，并加入抗积分饱和和电流限制；当 $$\Phi=\pi/2$$ 时增量控制增益为零。

## 7. 接入 SST 后改变控制职责

独立电压环只用于模块调试。组装 SST 后，一个公共母线主管向六个 DAB 分配输出电流参考；每个模块可用 SPS 逆模型作前馈，再用实测电流和受限均流修正细调。正电流指令对应

$$
\phi^*=\frac\pi2\left[1-\sqrt{1-\frac{4\omega_sL_\sigma I_2^*}{\pi nV_1}}\right].
\tag{14}
$$

根号内必须非负，实际电流和相移限值应更严格。应使用实测原边电压并缓升参考；切换到电流指令模式后，原独立电压环的积分状态不能继续暗中作用。

## 8. 仿真与实验验证

PLECS 模型先使用两个全桥、1:1 理想变压器和一个明确的 20 µH 原边折算传输电感，以刚性 48 V 端口和可吸收功率的副边电源验证 0.30168 rad 相移。待整周期功率一致后，再换成电容与电阻并加入电压环；随后逐项加入绕组电阻、励磁电感、死区和器件电容。

台架上应先在低电压验证栅极时序和变压器极性，在限流条件下逐渐增大相移。比较实测斜率与端点，再记录平均功率、RMS 电流和温升；必须测试电压比失配。每个工作点都要注明哪些换相实现 ZVS，并清楚标记结果来自计算、仿真还是测量。

磁件设计见[高频变压器篇]({{ '/zh/resources/blog/sst-high-frequency-transformer-design/' | relative_url }})；更完整代数见[DAB 功率与小信号推导]({{ '/zh/resources/blog/dab-power-transfer-and-small-signal-model/' | relative_url }})。
