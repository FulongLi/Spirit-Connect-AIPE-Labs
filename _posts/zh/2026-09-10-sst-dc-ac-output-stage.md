---
layout: post
title: "固态变压器的 DC–AC 输出级：从电压合成到闭环控制"
description: "由两电平桥构建 SST 交流输出，推导 LC 滤波器与 dq 模型，并设计级联电流、电压控制。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/sst-dc-ac-output-stage/
translation_key: sst-dc-ac-output-stage
en_url: /resources/blog/sst-dc-ac-output-stage/
---

输出级把公共 LVDC 母线变成受控交流端口。控制目标取决于端口连接对象：独立负载需要建立电压与频率；接入既有交流系统则还要处理同步、功率交换和电网动态。

本文沿用[统一 SST 规格]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})：48 V 母线、24 V 线电压 RMS、50 Hz、600 W，三线制平衡星形负载每相 0.96 Ω。数值仅为初步设计。

## 1. 桥臂与电流路径

三个半桥分别把相极点连接到正、负直流母线。上下管采用互补驱动和死区，反向导电路径保证电感电流连续；串联电感限制纹波，并联电容把开关频率电流从负载旁路。

{% include blog-figure.html file="circuit-three_phase" alt="三相两电平逆变桥" caption="A/B/C 极点各自经过串联电感与并联电容。滤波器和负载星点均浮置，不与直流回路相连。" circuit="three_phase" %}

若 $$s_a,s_b,s_c\in\{0,1\}$$ 为上管状态，去除共模后的相电压为

$$
u_a=V_b\left(s_a-\frac{s_a+s_b+s_c}{3}\right).
\tag{1}
$$

平衡正弦 PWM 平均后，

$$
\bar u_a=\frac{V_bm_a}{2},\qquad
V_{LL,\mathrm{rms}}=\frac{\sqrt3}{2\sqrt2}mV_b.
\tag{2}
$$

忽略滤波器压降时，从 48 V 得到 24 V 需要 $$m=0.8165$$；实际调制还要提供电感与绕组压降。

## 2. LC 滤波器初值

每相先取 $$L_f=300\ \mu\mathrm H$$、$$r_f=30\ \mathrm{m}\Omega$$、$$C_f=22\ \mu\mathrm F$$。空载谐振频率为

$$
f_{LC}=\frac{1}{2\pi\sqrt{L_fC_f}}=1.96\ \mathrm{kHz}.
\tag{3}
$$

它高于 50 Hz 基波、低于 20 kHz 开关频率，但仅有频率分离还不能证明衰减与稳定性；必须加入负载阻尼、电容 ESR、数字延时和控制器。

额定电阻负载下，

$$
V_{\mathrm{ph,rms}}=13.86\ \mathrm V,\quad
I_{o,\mathrm{rms}}=14.43\ \mathrm A,\quad I_{o,\mathrm{pk}}=20.41\ \mathrm A.
\tag{4}
$$

电感和半导体额定值还要覆盖开关纹波、过载和温度；20.4 A 饱和电流显然没有余量。30 mΩ 绕组电阻在额定电流下每相约损耗 6.25 W，低压系统同样需要认真处理热设计。

## 3. 先建立物理模型

令 $$i_f$$ 从桥流向输出，$$i_o$$ 从输出流向负载。对 αβ 任一分量，

$$
L_f\dot i_f=u-r_fi_f-v_o,qquad C_f\dot v_o=i_f-i_o.
\tag{5}
$$

消去电流后，

$$
L_fC_f\ddot v_o+r_fC_f\dot v_o+v_o
=u-L_f\dot i_o-r_fi_o.
\tag{6}
$$

若把负载电流视为独立扰动，电压被控对象分母为 $$L_fC_fs^2+r_fC_fs+1$$；但电阻负载满足 $$i_o=v_o/R$$，会改变分母。比较负载阶跃与频响时必须区分这两种建模方式。

## 4. 变换到 dq 坐标

按[dq 约定]({{ '/zh/resources/blog/three-phase-dq-modelling/' | relative_url }})变换：

$$
L_f\dot i_d=u_d-r_fi_d-v_d+\omega L_fi_q,
\quad L_f\dot i_q=u_q-r_fi_q-v_q-\omega L_fi_d,
\tag{7}
$$

$$
C_f\dot v_d=i_d-i_{o,d}+\omega C_fv_q,
\quad C_f\dot v_q=i_q-i_{o,q}-\omega C_fv_d.
\tag{8}
$$

独立运行时内部规定 $$\dot\theta=2\pi50$$，参考为 $$v_d^*=19.60\ \mathrm V$$、$$v_q^*=0$$。即使负载无功为零，稳态逆变器也需提供约 0.135 A q 轴电流给滤波电容。计入标称滤波器压降后，桥调制约为 0.845，母线跌落和瞬态将消耗剩余裕量。

{% include blog-figure.html file="abc-dq" alt="平衡相电压在 dq 坐标中变为常量" caption="坐标变换让控制器调节恒定 d 轴参考，但不会消除真实 LC 滤波器、延时或电压限幅。" %}

## 5. 电感电流环

采用 PI 输出 $$w_d,w_q$$，电压前馈和解耦指令为

$$
u_d^*=v_d-\omega L_fi_q+w_d,
\qquad u_q^*=v_q+\omega L_fi_d+w_q.
\tag{9}
$$

理想情况下每轴剩余被控对象为 $$1/(L_fs+r_f)$$，可初选

$$
K_{p,i}=L_f\omega_{c,i},\qquad K_{i,i}=r_f\omega_{c,i}.
\tag{10}
$$

暂取 1 kHz 交越频率，得到 1.885 V/A 和 188.5 V/(A·s)。75 µs 总延时在 1 kHz 已贡献 27° 相位滞后，最终必须用包含采样、传感器、参数误差和 PWM 饱和的模型验证。

## 6. 输出电压环

令电压 PI 输出为 $$z_d,z_q$$，加入负载电流前馈与电容解耦：

$$
i_d^*=i_{o,d}-\omega C_fv_q+z_d,
\qquad i_q^*=i_{o,q}+\omega C_fv_d+z_q.
\tag{11}
$$

快电流环理想时，每轴满足 $$C_f\dot v=z$$，因此

$$
K_{p,v}=2\zeta\omega_nC_f,qquad K_{i,v}=C_f\omega_n^2.
\tag{12}
$$

取 $$\zeta=0.707$$、$$f_n=100\ \mathrm{Hz}$$，得到 0.0195 A/V 与 8.69 A/(V·s)。电流参考矢量和桥电压都必须限幅，内外环均需抗积分饱和；启动时应斜坡提升电压参考。触发限流后允许输出电压偏离，这是保护的必然后果。

## 7. 并网跟随时改变目标

并网跟随控制器用 PLL 估计已有交流电压角度，再调节注入电流。d 轴与电网电压对齐、正电流从逆变器流向电网时，

$$
P=\frac32V_di_d,quad Q=-\frac32V_di_q,quad
i_d^*=\frac{2P^*}{3V_d},\quad i_q^*=-\frac{2Q^*}{3V_d}.
\tag{13}
$$

简单 L 滤波器可沿用电流方程；LC 加电网电感则成为 LCL 网络，必须显式建模谐振和阻尼。网侧电流环不能被视为前文电感电流环的直接替代。构网控制还需协调功率共享、同步与限流；[Imperix 实现说明](https://imperix.com/doc/implementation/grid-forming-inverter)给出了实际示例。

## 8. 从仿真到台架

先用平均桥、刚性 48 V 电源、指定 LC 和平衡电阻验证稳态 dq 数值；先闭合电流环，再闭合电压环。之后换成 20 kHz 开关模型、死区和采样控制，测试 300→600 W 阶跃、母线变化和突然卸载，观察峰值电流、恢复、调制限幅及积分器状态。

硬件先在限流电源下验证栅极时序，再从低电压平衡运行逐步加载。记录 RMS 电压、失真、电感纹波、绕组温度与阶跃恢复。最后用六个 DAB 和公共电容替代刚性母线；此时逆变器功率会扰动 SST 母线，需由[系统集成控制]({{ '/zh/resources/blog/modular-sst-system-integration/' | relative_url }})补充能量。
