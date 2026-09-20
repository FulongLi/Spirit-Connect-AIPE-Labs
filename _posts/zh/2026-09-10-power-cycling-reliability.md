---
layout: post
title: "功率循环可靠性：受控自热与退化证据"
description: "设计主动热循环实验，跟踪真实结温应力，并区分封装退化、温度漂移与控制漂移。"
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/power-cycling-reliability/
translation_key: power-cycling-reliability
en_url: /resources/blog/power-cycling-reliability/
---

功率循环利用器件自身损耗反复加热与冷却。脉冲数不足以定义实验，真正的应力是结温历史、持续时间、冷却边界与电气载荷。

## 1. 用实测应力定义周期

$$
\Delta T_j=T_{j,max}-T_{j,min},\qquad
T_{j,mid}=\frac{T_{j,max}+T_{j,min}}2.
\tag{1}
$$

还应记录升/降温时间、电流、电压、壳温与高温停留。短脉冲主要加热芯片附近，长周期会卷入更多封装与冷却结构；相同 $$\Delta T_j$$、不同周期时长不保证相同应变和机理。

{% include blog-figure.html file="active-cycling" alt="自热循环与实测结温极值" caption="仅记录脉冲数会丢失真实热应力；每个样本都要保留温度范围、水平和升降温时间。" %}

## 2. 加热与控制策略

导通加热便于控制，应用型开关循环则同时复现电应力。固定电流/时序时，器件老化会改变功率与温升；闭环固定结温端点时，控制器会改变电流或时间，并可能掩盖退化。两类策略回答不同问题，控制命令和实际温度都必须记录。

## 3. 基线、监测与机理

应先记录样本/批次、安装、导通参数、泄漏和热响应，并校准 TSEP。循环中保存温度极值、功率、时序与保护中断；检查点在规定恢复时间后重复同条件测量：

$$
\delta_x(N)=\frac{x(N)-x(0)}{x(0)}.
\tag{2}
$$

导通电压和热阻变化可能来自互连或连接层，也可能来自温度、夹具接触或传感器漂移。用成像、截面和互连检查验证机理，预先定义终止与失效准则。

## 4. 统计与应力矩阵

检查点之间才发现的失效是区间删失，测试结束仍工作的样本是右删失，都必须保留。应有意识地改变温度摆幅、平均温度和周期时间，并用多个样本揭示离散性；过度加速可能激活现场不会出现的新机理。

示意疲劳关系

$$
N_f=A(\Delta T_j)^{-m}
\tag{3}
$$

中的参数依赖封装与机理，不是通用常数。与[被动温度循环]({{ '/zh/resources/blog/temperature-cycling-reliability/' | relative_url }})对照时，要认识到两者温度梯度和损伤位置可能不同。
