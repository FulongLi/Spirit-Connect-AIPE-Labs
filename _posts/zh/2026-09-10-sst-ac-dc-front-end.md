---
layout: post
title: "固态变压器的 AC–DC 前端：电路、建模与控制"
description: "从单个有源全桥到级联 H 桥前端：输入电流方程、直流链路能量、调制与电容电压均衡。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/sst-ac-dc-front-end/
translation_key: sst-ac-dc-front-end
en_url: /resources/blog/sst-ac-dc-front-end/
---

输入级控制交流电源与多个浮置直流链路之间的功率交换。它的任务不只是整流，还要塑造输入电流、向后级供能，并把各电容的储能维持在允许范围内。

本文沿用[系列统一规格]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})：每相两个 CHB 单元、每单元 48 V、理想总功率 600 W。先理解一个全桥，再把各桥的交流端串联起来。

## 1. 全桥是可控交流电压源

若两桥臂理想开关状态为 $$s_A,s_B\in\{0,1\}$$，全桥交流端电压为

$$
u_k=(s_A-s_B)v_{h,k},
\tag{1}
$$

可取 $$+v_{h,k}$$、0 或 $$-v_{h,k}$$。同一桥臂上下管不能同时导通；死区会避免直通，也会带来与电流方向有关的电压误差。

按开关周期平均，定义 $$m_k=\langle s_A-s_B\rangle$$：

$$
u_k=m_kv_{h,k},\quad -1\le m_k\le1,
\qquad u_a=\sum_{k=1}^{N}m_{a,k}v_{h,a,k}.
\tag{2}
$$

这里的 $$m_k$$ 是桥输出的平均调制量，不是某一只晶体管的占空比。浮置单元需要独立的驱动电源、测量和通信；交流端串联不意味着直流电容串联，更不意味着各原边共地。

{% include blog-figure.html file="circuit-full_bridge" alt="能够输出正、零、负交流端电压的全桥" caption="R1 表示接入电源或 SST 串联链路的交流端口，C1 是本地浮置直流链路。图中的源和电阻只是测试端口，不是完整前端接线。" circuit="full_bridge" %}

## 2. 输入电流与单元能量

把电流正方向定义为电源流向变换器，输入电感与电阻分别为 $$L_g$$、$$r_g$$：

$$
L_g\frac{di_a}{dt}=v_{g,a}-r_gi_a-u_a.
\tag{3}
$$

因此增大变换器电压 $$u_a$$ 会降低正向电流的上升率，控制器符号必须与此一致。忽略桥损耗，单元电容能量满足

$$
C_hv_{h,k}\frac{dv_{h,k}}{dt}=u_ki_a-p_{\mathrm{DAB},k}.
\tag{4}
$$

即使总输入功率正确，某个单元若向 DAB 输出过多功率，其电容电压仍会下降。

## 3. 稳态工作点与二倍频纹波

采用[本文规定的 dq 变换]({{ '/zh/resources/blog/three-phase-dq-modelling/' | relative_url }})，并令 d 轴与电源电压对齐：

$$
P_g=\frac32V_{g,d}I_d,\qquad Q_g=-\frac32V_{g,d}I_q.
\tag{5}
$$

在理想平衡系统中令 $$I_q=0$$ 可获得单位位移因数；谐波畸变仍需单独评价。48 V 线电压 RMS 对应 $$V_{g,d}=39.19\ \mathrm V$$，理想 600 W 工作点需要 $$I_d=10.21\ \mathrm A$$ 峰值，即每相 7.22 A RMS。

六个均衡单元平均各接收 100 W。三相总功率虽恒定，每个单相支路仍有二倍工频脉动。若 DAB 输出近似恒功率，

$$
p_k(t)\approx P_k[1-\cos(2\omega_gt)],\qquad
\Delta v_{h,\mathrm{pp}}\approx\frac{P_k}{\omega_gC_hV_h}.
\tag{6}
$$

取 100 W、50 Hz、2200 µF 和 48 V，估算峰峰纹波为 3.01 V。这是电容吸收瞬时功率差的自然结果，不等于控制环不稳定。

{% include blog-figure.html file="cell-energy-ripple" alt="单相功率不平衡产生的 100 Hz 电容电压纹波" caption="电容吸收脉动输入功率与近似恒定 DAB 输出功率之差；对该功率差积分即可得到电压纹波。" %}

## 4. dq 电流环

变换后有

$$
L_g\dot i_d=v_{g,d}-r_gi_d-u_d+\omega_gL_gi_q,
\quad
L_g\dot i_q=v_{g,q}-r_gi_q-u_q-\omega_gL_gi_d.
\tag{7}
$$

令 PI 输出为 $$w_d=G_i(s)(i_d^*-i_d)$$、$$w_q=G_i(s)(i_q^*-i_q)$$，采用电压前馈与解耦：

$$
u_d^*=v_{g,d}+\omega_gL_gi_q-w_d,
\qquad u_q^*=v_{g,q}-\omega_gL_gi_d-w_q.
\tag{8}
$$

理想解耦且未饱和时，每轴被控对象为 $$1/(L_gs+r_g)$$。一种初始整定是把 PI 零点放在被控对象极点：

$$
K_p=L_g\omega_c,qquad K_i=r_g\omega_c.
\tag{9}
$$

例如 $$L_g=1\ \mathrm{mH}$$、$$r_g=0.1\ \Omega$$、$$f_c=500\ \mathrm{Hz}$$ 时，$$K_p=3.142\ \mathrm{V/A}$$、$$K_i=314.2\ \mathrm{V/(A\cdot s)}$$。最终设计还必须计入 ADC 滤波、PWM 延时、参数误差与限幅；75 µs 延时在 500 Hz 已会贡献约 13.5° 相位滞后。

## 5. 总能量调节

定义高压侧总电容能量

$$
E_h=\sum_{k=1}^{M}\frac12C_hv_{h,k}^2.
\tag{10}
$$

慢能量环忽略输入电感能量动态与损耗时，

$$
\dot E_h=\frac32V_{g,d}i_d-P_{\mathrm{DAB,tot}},
\qquad
\frac{\hat E_h(s)}{\hat i_d^*(s)}\approx\frac{3V_{g,d}}{2s}.
\tag{11}
$$

储能不足时，外环应增大输入 d 轴电流。若 PI 输入为焦耳、输出为安培，令 $$a=3V_{g,d}/2$$，可按

$$
K_{p,E}=\frac{2\zeta\omega_n}{a},\qquad K_{i,E}=\frac{\omega_n^2}{a}
\tag{12}
$$

进行初始配置。平均能量调节必须与自然存在的 100 Hz 单元纹波分开；外环若试图快速消除该纹波，反而会恶化输入电流波形。

## 6. 单元均衡

总能量控制器无法决定六个独立电容的能量。相内均衡可以为各单元分配总和为零的功率修正 $$\sum_k\Delta P_k=0$$：

$$
\Delta u_k(t)=\frac{\Delta P_k}{I_{a,\mathrm{rms}}^2}i_a(t).
\tag{13}
$$

这样 $$\langle\Delta u_ki_a\rangle=\Delta P_k$$，而相总电压指令不变。低能量单元应得到正输入功率修正。分母必须受保护、修正量要限幅；支路电流接近零时该方法没有均衡能力。

相间均衡还需要额外自由度。教学系统可通过差分 DAB 功率分配，让高能量相暂时输出更多、低能量相输出更少，同时保持总母线需求不变。也可使用 CHB 共模电压控制，但应选定一种明确的协调策略，避免多个均衡环互相对抗。[Imperix TN165](https://imperix.com/doc/implementation/cascaded-h-bridge-converter-control)给出了区分相内与相间均衡的实验实现。

## 7. 调制、仿真与硬件

把 dq 指令逆变换到三相，按单元分配相电压，叠加受限的均衡修正，并根据实测电容电压计算 $$m_k=u_k^*/v_{h,k}$$。电容电压降低时，可用输出电压也降低，因此归一化和饱和都必须使用实测值。

仿真宜从“一相、两个全桥、两个独立电容、两个受控直流负载”开始，再加入三相电流环、总能量环和均衡策略。观察源电流、串联桥电压、各电容电压、调制限幅和实际输入功率，并测试负载不等、电源电压变化与初始能量偏差。

硬件调试先从限流隔离电源供电的单桥开始，在低功率下确认电流极性与栅极时序，再组建串联支路。不要用接地示波器探头把浮置单元意外短接；只有在电源能够吸收回馈功率时才能调试反向功率流。

## 8. 验收证据

记录输入电流 RMS/峰值与频谱、有功/无功功率、单元电压纹波、瞬态最大值和均衡收敛时间。每项结果都应注明电源阻抗、功率、控制周期和限幅。本文数值是模型预期，不宣称为硬件实测。

下一篇可进入 [DAB 隔离级]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})，也可返回[系统指南]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})。
