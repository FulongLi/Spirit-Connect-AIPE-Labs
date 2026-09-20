---
layout: post
title: "功率半导体鲁棒性：SOA、雪崩与短路测试"
description: "理解异常事件的测试物理、能量核算与保护边界，避免把普通开关表征与破坏性鲁棒性评价混为一谈。"
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/semiconductor-robustness-testing/
translation_key: semiconductor-robustness-testing
en_url: /resources/blog/semiconductor-robustness-testing/
---

鲁棒性试验研究异常事件边界，需要器件专用程序、额定防护与保护；本文解释量和证据，不为未知器件规定故障脉冲。

## 1. SOA 是带条件的边界

安全工作区把允许电压、电流和时间与初温、安装和脉冲条件联系起来，不能把各项独立额定值随意组合。恒功率脉冲的平均热估算为

$$
\Delta T_j(t_p)=PZ_{th}(t_p),
\tag{1}
$$

但它不能描述所有局部电流集中、电热不稳定和栅极限制。报告应保存完整 V–I 轨迹、持续时间、重复率、初温和终止机理。

## 2. 非钳位感性开关（UIS）

初始电感能量为

$$
E_L=\frac12LI_0^2.
\tag{2}
$$

若电源 $$V_{DD}$$ 在雪崩期间仍连接、雪崩平台近似 $$V_{AV}$$，

$$
t_{AV}=\frac{LI_0}{V_{AV}-V_{DD}},
\qquad
E_{AV}=\frac12LI_0^2\frac{V_{AV}}{V_{AV}-V_{DD}}.
\tag{3}
$$

因此 DUT 吸收能量可能大于初始电感储能，差额由电源提供。100 µH、10 A 储能 5 mJ；若 50 V 电源保持连接、平台为 100 V，简化 DUT 能量为 10 mJ。应直接积分真实波形，且不能假设 GaN 或未标注器件具有硅 MOSFET 的雪崩能力。

{% include blog-figure.html file="uis-energy" alt="UIS 的电感电流、雪崩电压与吸收功率" caption="示例中初始电感能量为 5 mJ，但连接电源继续供能，使理想雪崩积分为 10 mJ。" %}

## 3. 精确定义短路事件

开通前已短路与运行中突发故障的轨迹不同。记录母线、栅压、源电感、初温、回路阻抗和关断方式。故障能量为

$$
E_{SC}=\int_{t_0}^{t_1}v_D(t)i_D(t)dt.
\tag{4}
$$

同能量并不代表同应力，峰值功率密度和电流分布可能不同。完整清除时间为

$$
t_{clear}=t_{detect}+t_{prop}+t_{gate}+t_{fall}.
\tag{5}
$$

驱动器传播延时只是一部分；过快关断又会通过杂散电感产生过冲，保护要同时管理电流持续时间和换相瞬态。

## 4. 生存不等于无退化

在匹配条件下建立应力前泄漏、阈值与导通基线，规定恢复与温度稳定时间后复测：

$$
\delta_x=\frac{x_{after}-x_{before}}{x_{before}}.
\tag{6}
$$

该比值不是通用失效判据。波形异常、保护动作、夹具失效和确认的 DUT 失效应分别记录；外部波形干净也不能证明内部无损伤。重复雪崩、短路和栅介质老化可能是不同机理。

## 5. 让报告解释边界

保存夹具原理图、能量源、电感测量、栅极回路、探头参考、保护动作、每次事件初值、波形、积分能量和终止原因。通过重复复测与失效分析把测得边界连接到物理机理；DPT 与热阻抗提供测量基础，但不能替代器件专用鲁棒性规范。
