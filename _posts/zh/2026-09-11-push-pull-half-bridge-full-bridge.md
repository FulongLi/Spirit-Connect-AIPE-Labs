---
layout: post
title: "推挽、半桥与全桥隔离变换器"
description: "双端激励拓扑如何双向驱动磁芯，以及它们在开关应力、变压器利用率、磁通偏移和软开关方面的差异。"
date: 2025-12-15
author: "Dr. Fulong Li"
lang: zh
math: true
converter_series: true
permalink: /zh/resources/blog/push-pull-half-bridge-full-bridge/
translation_key: push-pull-half-bridge-full-bridge
en_url: /resources/blog/push-pull-half-bridge-full-bridge/
---

[正激变换器]({{ '/zh/resources/blog/forward-converter-from-zero-to-everything/' | relative_url }})只把磁芯从零磁化到一个方向，再复位到零；推挽、半桥和全桥则给原边施加正负交替电压，利用双极磁通摆幅。它们都把副边整流后接成 Buck 型 LC 输出，但在开关数量、阻断电压和驱动复杂度上不同。

本文统一使用 **48 V→12 V、30 W** 规格。约定 $$D$$ 是**单只开关**的占空比，范围 0–0.5；两个半周期总导通比例为 $$2D$$。

## 1. 共同原理：双向激励磁芯 {#idea}

三种拓扑都完成三件事：在原边产生正负方波、在副边全波整流，再用 LC 滤波。每个开关周期有正、负两个传能脉冲，因此输出滤波器看到的纹波频率为 $$2f_s$$，同样纹波目标下 L/C 可比单端拓扑更小。

负半周期同时完成磁芯复位，无需独立复位绕组；前提是正、负伏秒真正相等。

## 2. 推挽 {#pushpull}

{% include blog-figure.html file="bridge-excitation" alt="原边正负电压脉冲" caption="图示绕组电压而非中心抽头接线。推挽匝比按每半个原边绕组定义。" %}

两只开关均以地为参考，中心抽头原边的两半交替导通。若 $$n=N_p/N_s$$ 按半原边定义，

$$
\boxed{V_o=\frac{2DV_g}{n}}.
\tag{1}
$$

本文取 $$n=2$$、每管 $$D=0.25$$ 得到 12 V。缺点是关断器件看到输入与另一半绕组感应电压之和：

$$
\boxed{V_{DS,\mathrm{off}}\approx2V_g},
\tag{2}
$$

48 V 输入即为 96 V，尚未计漏感过冲。推挽还最容易发生磁通偏移，因为两半绕组和两只开关天然存在不对称。

## 3. 半桥 {#halfbridge}

{% include blog-figure.html file="circuit-half_bridge" alt="半桥开关桥臂" caption="变压器原边应接在桥臂中点与独立分压电容中点之间；图中只画出桥臂。" circuit="half_bridge" %}

两个电容把母线分成两半，原边承受 $$\pm V_g/2$$：

$$
\boxed{V_o=\frac{DV_g}{n}},\qquad
\boxed{V_{DS,\mathrm{off}}\approx V_g}.
\tag{3}
$$

本文取 $$n=1$$、$$D=0.25$$ 得到 12 V。每只开关只承受输入电压，是高压母线下的关键优势；代价是同功率下原边电流约为全桥两倍，还需要高边驱动与分压电容均衡。分压结构有助于限制直流偏置，但启动与非对称工况仍要验证。

## 4. 全桥 {#fullbridge}

{% include blog-figure.html file="circuit-full_bridge" alt="全桥的两个开关中点" caption="两组对角开关向原边施加相反极性电压。隔离变换器在该交流端口接入变压器，并增加副边整流和滤波。" circuit="full_bridge" %}

四只开关按对角成对导通，原边获得完整的 $$\pm V_g$$：

$$
\boxed{V_o=\frac{2DV_g}{n}},\qquad
\boxed{V_{DS,\mathrm{off}}\approx V_g}.
\tag{4}
$$

它兼有完整原边电压和单倍器件阻断电压，因此同功率原边电流低于半桥；代价是四只开关和两个高边驱动。高功率下，降低器件应力通常足以抵消额外器件成本。

## 5. 对比与选择 {#comparison}

| 特性 | 推挽 | 半桥 | 全桥 |
|---|---|---|---|
| 开关数 | 2 | 2 | 4 |
| 原边电压 | $$\pm V_g$$ | $$\pm V_g/2$$ | $$\pm V_g$$ |
| 单管应力 | $$2V_g$$ | $$V_g$$ | $$V_g$$ |
| 原边电流 | 较低 | 最高 | 较低 |
| 驱动 | 两个低边 | 一个高边 | 两个高边 |
| 典型选择 | 低压输入、驱动简单 | 高压母线、中等功率 | 高功率 |

三者副边都是 Buck 型，因此输出滤波、小信号被控对象和补偿方法沿用[正激控制]({{ '/zh/resources/blog/forward-converter-from-zero-to-everything/' | relative_url }}#control)，只需调整 duty 增益并把纹波频率改为 $$2f_s$$。

{% include blog-figure.html file="magnetic-flux" alt="相等正负伏秒形成平衡磁通" caption="磁通是矩形绕组电压的积分；设计时必须使用实际电压、匝数和频率。" %}

## 6. 磁通偏移：必须主动防止的故障 {#flux}

正负脉冲只要存在微小伏秒差——来自占空误差、驱动延时、$$R_{DS(on)}$$ 或绕组不对称——磁通偏置就会逐周期累积，直到磁芯饱和、励磁电感骤降，开关近似面对短路。

常用防线有：

1. 原边串联隔直电容，让直流电压落在电容而不是绕组上；半桥分压电容天然提供类似约束，全桥常专门加入。
2. 峰值电流模式逐脉冲结束导通；磁通偏移会表现为电流升高，从而帮助两半周期自平衡。
3. 适当小气隙以增加偏置容限，但会提高励磁电流。

推挽不易在中心抽头原边串入统一隔直电容，因此尤其不能在台架上长期用固定 duty 开环运行。

## 7. 移相全桥（PSFB） {#psfb}

PSFB 两个桥臂都保持 50% 占空比，通过改变两桥臂相位差来调节对角重叠时间与功率。变压器漏感和反射输出电感电流在死区期间给 MOSFET 输出电容换流，使下一只器件近似零电压开通。

ZVS 依赖负载，轻载时可用换流能量不足，滞后桥臂通常先失去软开关。漏感换流还占用有效传能时间，产生随负载增大的占空损失；匝比必须为低线满载保留该裕量。需要双向功率时，把二极管整流替换为第二个有源桥，就得到[DAB]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})。

## 8. 仿真与应用 {#simulation}

打开 [半桥开环网表]({{ '/assets/downloads/bridge-converters/halfbridge_open_loop.cir' | relative_url }})，确认整流节点每周期有两个脉冲、分压中点约为 24 V、桥臂中点在 0–48 V 之间变化，输出电感电流以 200 kHz 纹波叠加在 2.5 A 上。增加两管门极重叠可直观看到直通风险；略微改变两脉冲宽度可观察励磁电流漂移。

推挽常用于 12–48 V 电池/工业输入，半桥用于中等功率高压母线，全桥与 PSFB 用于通信、车载充电和千瓦级隔离 DC–DC。最终边界取决于器件和磁件应力、软开关范围与效率，而不是固定瓦数表。
