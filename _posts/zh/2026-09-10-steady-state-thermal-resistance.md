---
layout: post
title: "稳态热阻测量：相除之前先定义热流路径"
description: "在受控功率和边界下测量稳态热性能，区分结到壳与结到环境指标，并量化不确定度。"
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/steady-state-thermal-resistance/
translation_key: steady-state-thermal-resistance
en_url: /resources/blog/steady-state-thermal-resistance/
---

热阻看似只是温升除以功率，难点却在于确认哪一个温度、哪一部分功率和哪条热流路径属于这个除法。没有这些定义，两个合理测量可能描述完全不同的系统。

## 1. 定义热端口

指定边界下近似线性热路径满足

$$
R_{th,j-r}=\frac{T_j-T_r}{P_{path}}.
\tag{1}
$$

参考端可为规定壳体表面、控温冷板或环境空气；$$P_{path}$$ 只有在其他路径可忽略或方法明确规定时才等于器件总耗散。$$R_{th,jc}$$、$$R_{th,ja}$$、$$R_{th,jb}$$ 和 $$\psi_{JT}$$ 都属于各自测试约定，不能互换；$$\psi$$ 一般也不是独立物理支路电阻。

{% include blog-figure.html file="thermal-path" alt="结到壳再到冷却液的热路径" caption="必须同时定义两个温度参考和穿过该路径的热流；封装顶面读数不是结温。" %}

## 2. 控制机械与冷却边界

记录安装面、平整度、TIM 类型与厚度/施加方法、压力或扭矩、冷板温度和流量。PCB 冷却器件还要规定铜面积、层数、过孔与气流。传感器位置不能明显扰动接触；冷却液入口温度也不等于局部冷板表面温度。用温度斜率和功率稳定性定义平衡判据，而不是随意等待一个固定时间。

## 3. 在 DUT 边界测功率

导通加热功率应由器件端同步电压电流得到：

$$
P_H=\langle v_D(t)i_D(t)\rangle.
\tag{2}
$$

不要把电缆和分流器损耗包含在电源功率中；开关或脉冲激励应平均瞬时乘积，而不是用平均电压乘平均电流。多芯片电流分配不均也会改变所推断结温。

## 4. 功率—温升曲线

先记录零加热基线，再在同一边界施加多个安全功率点并用已校准方法求结温：

$$
T_j-T_r\approx R_{th}P_H+b.
\tag{3}
$$

非零截距提示参考偏置或其他热源；弯曲提示材料温变或冷却边界变化，不能强行线性拟合。合成示例中 30 W 产生 45 K 温升，斜率为 1.50 K/W，但不说明参考位置就没有封装意义。

{% include blog-figure.html file="thermal-resistance" alt="线性示例中温升随耗散功率变化" caption="热阻取温升曲线斜率；截距、非线性或边界变化必须先解释。" %}

## 5. 接口、重复性与不确定度

一维串联近似下，

$$
R_{j-sink}\approx R_{j-c}+R_{c-sink}.
\tag{4}
$$

用两次测量相减提取小接口热阻会放大不确定度，并假设其他路径不变；重装会改变压力、接触面积和 TIM 分布，因此既要测不拆装重复性，也要测重装重复性。

若温升和功率不确定度独立，

$$
\left(\frac{u_R}{R}\right)^2\approx
\left(\frac{u_{\Delta T}}{\Delta T}\right)^2+
\left(\frac{u_P}{P}\right)^2.
\tag{5}
$$

45 K、30 W、1 K 与 0.3 W 标准不确定度时，$$u_R\approx0.037\ \mathrm{K/W}$$，实际还要加入接触和校准协方差。

结果只能用于实测边界和温度域。短脉冲不能用稳态热阻代替瞬态阻抗，也不能把某 PCB 的结到环境值直接移植到另一装配。报告应包含夹具、功率边界、温度方法、平衡证据、重装结果、残差与不确定度。
