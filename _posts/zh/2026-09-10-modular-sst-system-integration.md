---
layout: post
title: "构建模块化 SST：能量、均流与系统集成"
description: "通过明确的能量控制、模块均流、启动状态机和分阶段验证计划，把三个 SST 功率级组合成完整系统。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/modular-sst-system-integration/
translation_key: modular-sst-system-integration
en_url: /resources/blog/modular-sst-system-integration/
---

三个分别可工作的变换器不会自动组成可工作的固态变压器。集成必须回答三个问题：能量储存在哪里、哪个控制器负责每个储能元件，以及某条功率路径不可用时系统做什么。

本文用[统一教学规格]({{ '/zh/resources/blog/three-stage-solid-state-transformer/' | relative_url }})连接 [AC–DC 前端]({{ '/zh/resources/blog/sst-ac-dc-front-end/' | relative_url }})、[DAB 模块]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})和[交流输出级]({{ '/zh/resources/blog/sst-dc-ac-output-stage/' | relative_url }})。以下增益和时序仍需开关模型与硬件验证。

## 1. 区分功率级与模块

三级是 AC–DC、隔离 DC–DC 和 DC–AC；重复模块只会增加电压或电流能力，不必然增加功能级数。本文 CHB 每相有两个交流端串联单元，共六个浮置 48 V 链路；六个 100 W DAB 的隔离副边并联到一个 48 V 母线，集中式逆变器输出 24 V 线电压 RMS、50 Hz。

一相平均桥电压为

$$
u_a=\sum_{k=1}^{2}m_{a,k}v_{h,a,k},\qquad |m_{a,k}|\le1.
\tag{1}
$$

两个 48 V 单元提供理想 96 V 峰值合成能力；48 V 线电压输入的相峰值为 39.19 V，计入电感压降前利用率约 0.408。串联负责电压，并联隔离输出负责电流。

{% include blog-figure.html file="sst-modules" alt="独立高压侧单元供给公共低压母线" caption="先区分哪些端口串联、哪些并联、哪些仍保持隔离；模块数量与变换级数量是两件事。" %}

## 2. 从能量守恒开始

定义单元和母线能量：

$$
E_{j,k}=\frac12C_hv_{h,j,k}^2,qquad E_b=\frac12C_bv_b^2.
\tag{2}
$$

计入损耗后，

$$
\dot E_{j,k}=p_{\mathrm{AFE},j,k}-p_{\mathrm{DAB,in},j,k}-p_{\ell,j,k},
\quad
\dot E_b=\sum_{j,k}p_{\mathrm{DAB,out},j,k}-p_{\mathrm{inv}}-p_{\ell,b}.
\tag{3}
$$

六个 2200 µF 高压侧电容在 48 V 共储能 15.21 J，4700 µF 母线电容储能 5.41 J，而且只有允许电压范围之间的部分可用。若 600 W 负载保持不变而母线输入消失，电压从 48 V 降至 44 V 的理想时间仅为

$$
\Delta t=\frac{C_b(48^2-44^2)}{2P}=1.44\ \mathrm{ms}.
\tag{4}
$$

因此软件监管本身无法保证掉电不断供，响应时间、可用能量与硬件限流必须一致。

## 3. 一个控制器只承担一个职责

独立输出基准模式下，AFE 总能量环通过源侧有功电流维持六个高压链路总能量；AFE 快环跟踪电流；相内零和功率修正均衡两个单元；一个母线电压主管命令所有 DAB 输出电流之和；逆变器建立交流电压与频率。

相间均衡需要另一自由度。定义滤波后的相支路能量

$$
E_j=\sum_kE_{j,k},\qquad \bar E=\frac13\sum_jE_j,
\qquad \Delta P_j=k_E(E_j-\bar E).
\tag{5}
$$

滤波器要抑制预期的 100 Hz 能量纹波。DAB 电流按

$$
i_{j,k}^*=\frac{I_\Sigma^*}{6}+\frac{\Delta P_j}{2v_b},
\qquad \sum_{j,k}i_{j,k}^*=I_\Sigma^*
\tag{6}
$$

分配，使高能量支路输出更多功率。只有母线超过规定阈值才启用；若某模块饱和，应把剩余需求重新分配给还有余量的模块，不能各自简单削顶，否则零和条件会被破坏。无法满足的总电流需求必须反馈给主管并触发抗积分饱和。

{% include blog-figure.html file="sst-control-roles" alt="各 SST 功率级与储能缓冲的控制职责" caption="避免两个独立控制器争夺同一母线。图中对应初始独立运行正向功率模式；模式变化必须重新明确职责。" %}

## 4. 公共母线电压环

假设 DAB 电流跟踪足够快，输出逆变器在稳压供给固定电阻时，对母线近似恒功率负载：

$$
C_b\frac{dv_b}{dt}=I_\Sigma-\frac{P}{v_b}.
\tag{7}
$$

在 $$V_b,P$$ 附近线性化：

$$
(C_bs-g)\hat v_b=\hat I_\Sigma-\frac{\hat P}{V_b},
\qquad g=\frac{P}{V_b^2}.
\tag{8}
$$

600 W、48 V 时增量负载电阻为 $$-V_b^2/P=-3.84\ \Omega$$。若源电流固定，简化模型具有 $$g/C_b=55.41\ \mathrm{s^{-1}}$$ 的不稳定极点。令 $$e=V_b^*-v_b$$，PI 电流指令为

$$
I_\Sigma^*=I_{\mathrm{ff}}+K_pe+K_i\int e\,dt,
\tag{9}
$$

按二阶系数匹配：

$$
K_p=g+2\zeta\omega_nC_b,qquad K_i=C_b\omega_n^2.
\tag{10}
$$

取 $$\zeta=0.8$$、自然频率 20 Hz，初值为 1.205 A/V 与 74.22 A/(V·s)。最终稳定裕度还要纳入 DAB 跟踪、传感滤波、计算延时和逆变器输入阻抗。额定总电流为 12.5 A，每个 DAB 为 2.083 A；AFE 能量环可比母线环更慢，暂时差额由电容承担。

## 5. 明确定义模式切换

并网输出可以保留 DAB 母线主管，让逆变器跟随受限 P/Q 指令；也可让并网逆变器调节 LVDC，DAB 按功率命令运行。采用后一种方案时必须禁用 DAB 母线电压积分器，并重新定义高压侧能量和源功率协调。切换时要转移积分状态并斜坡改变参考。

“双向”只描述变换器能力，不代表实验电源能吸收回馈。必须明确电源限制、母线过压阈值，以及反向功率或甩负载时经过验证的能量释放路径。

## 6. 用可观察状态完成启动

| 状态 | 动作与退出依据 |
|---|---|
| 断电检查 | 确认链路放电、传感器极性、联锁与独立浮置电源 |
| 高压侧预充 | 通过限流路径逐个充电，确认每个单元电压后再旁路预充元件 |
| AFE 使能 | 在保守限值下建立输入电流控制和平均单元能量 |
| LVDC 预充 | 用独立验证的限流路径或专用 DAB 启动序列充母线 |
| DAB 调节 | 母线电压和电压比进入验证区域后切换到电流指令 |
| 交流输出爬升 | 先建立频率，再斜坡提升电压，最后加载 |
| 运行/故障 | 执行电流、电压、温度和通信限制，以及定义好的隔离/放电序列 |

被动 CHB 充电不能保证六个电容均为 48 V；正常 SPS 稳态公式也不能保证给空母线安全充电。启动全过程都要建模二极管路径、初始磁通、脉冲时序和限流；封锁栅极并不一定能阻断二极管导通。

## 7. 验证完整系统

先在 Simulink 中连接平均模型，分别扰动一个单元能量、输入电压和输出负载；再用开关 PLECS 检查峰值电流、饱和、预充与模式转换，LTspice 用于局部驱动和换相细节。

硬件从单 DAB 进展到单相支路，再到六模块系统。记录每个单元电压、母线电压、均流误差、输入/输出功率和保护状态变化；在低功率先测试负载骤降、单模块丢失和命令延迟。串联单元失效需要设计旁路或停机策略，并联输出失效则必须先隔离故障，不能默认系统可以继续运行。
