---
layout: post
title: "栅极电荷、非线性电容与动态导通电阻"
description: "区分小信号电容与开关电荷，推导输出电荷和能量，并在受控偏置历史下测量动态导通电阻。"
date: 2026-09-10 09:10:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/gate-charge-capacitance-dynamic-resistance/
translation_key: gate-charge-capacitance-dynamic-resistance
en_url: /resources/blog/gate-charge-capacitance-dynamic-resistance/
---

器件静态导通电阻很低，仍可能产生可观开关损耗；栅极和输出端需要搬运电荷，先前的阻断应力还可能改变随后导通。因而需要三类互补实验：电容随偏置、开关轨迹上的栅极电荷，以及规定应力历史后的导通电阻。

## 1. 电容是局部导数

对非线性电荷关系 $$q(v)$$，

$$
C_{diff}(v)=\frac{dq}{dv},\qquad i=C_{diff}(v)\frac{dv}{dt}.
\tag{1}
$$

小交流信号测的是某个直流偏置附近的增量值；激励过大会跨越变化中的电容。MOSFET 常用等效关系为

$$
C_{iss}=C_{gs}+C_{gd},\quad C_{oss}=C_{ds}+C_{gd},\quad C_{rss}=C_{gd}.
\tag{2}
$$

测量必须注明端子连接、直流偏置、频率、交流幅值、温度和串/并联等效方式，并在夹具参考面做开短路补偿。

## 2. 电荷与能量不是同一个积分

$$
Q_{oss}(V)=\int_0^VC_{oss}(v)dv,
\qquad E_{oss}(V)=\int_0^VvC_{oss}(v)dv.
\tag{3}
$$

只有电容不随电压变化时，才可用同一个 C 同时写成 $$Q=CV$$、$$E=CV^2/2$$。端点等效值

$$
C_Q=Q_{oss}/V,qquad C_E=2E_{oss}/V^2
\tag{4}
$$

分别适用于换相电荷与能量计算。电路可能回收部分储能，DPT 能量也可能已包含它，不能机械重复加算。

## 3. 沿真实轨迹测栅极电荷

$$
Q_g(t)=\int_{t_0}^ti_g(\tau)d\tau.
\tag{5}
$$

在规定漏极电压和负载电流下同时测栅极电流、电压，先扣除偏置，再把 $$v_{GS}$$ 对累计电荷作图。米勒平台宽度是电荷，不是时间；若平台电流近似恒定，

$$
t_{Miller}\approx\frac{Q_{gd}}{I_{g,plateau}}.
\tag{6}
$$

{% include blog-figure.html file="gate-charge" alt="栅极电压平台与累计栅极电荷" caption="平台宽度表示电荷；除以实际栅极电流才得到时间。轨迹会随漏压、电流与外部电路变化。" %}

## 4. 动态导通电阻必须带时间坐标

$$
R_{on,dyn}(t_d)=\frac{v_{DS,on}(t_d)}{i_D(t_d)},qquad
k_{dyn}=\frac{R_{on,dyn}}{R_{on,ref}}.
\tag{7}
$$

参考值要匹配电流、栅压和结温，并记录预处理。测量通道必须在高阻断电压后迅速恢复到毫伏分辨率；钳位电路的偏置、恢复时间和负载本身就是实验的一部分。先用已知小信号验证钳位恢复，再施加规定关断应力并在指定延时采样；等待太久会把快速恢复掩盖掉。

{% include blog-figure.html file="dynamic-ron-sequence" alt="关断应力后按规定延时读取动态电阻" caption="读出延时属于被测量定义；等待普通探头恢复可能错过短暂电阻升高。" %}

## 5. 可复现比较

电容要扫偏置、频率和温度；栅极电荷要扫漏压、电流和端点；动态电阻要扫应力电压/持续时间、读出延时和温度。保留原始波形、恢复间隔与校准。GaN 没有硅 MOSFET 那样的少子体二极管恢复，但仍有输出电荷、反向导通损耗和动态电阻问题；三者是不同机理。
