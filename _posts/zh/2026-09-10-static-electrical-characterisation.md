---
layout: post
title: "静态电气表征：从端口测量到器件模型"
description: "在受控温度和不确定度下测量导通电阻、输出/转移曲线、阈值、泄漏与阻断特性。"
date: 2026-09-10 09:10:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/static-electrical-characterisation/
translation_key: static-electrical-characterisation
en_url: /resources/blog/static-electrical-characterisation/
---

静态特性描述电气瞬态稳定后的端口电压电流关系，并不要求长时间直流扫测。短而充分稳定的脉冲往往比把芯片显著加热的慢扫描更接近等温特性，也是后续老化与动态变化的基线。

## 1. 定义器件与条件

以增强型 N 沟道 MOSFET 为例，

$$
i_D=F(v_{DS},v_{GS},T_j,\mathcal H),
\tag{1}
$$

其中 $$\mathcal H$$ 表示偏置和热历史。必须记录封装、样本、栅压、脉宽、采样延时、重复间隔与温度方法。数据表典型曲线不是生产保证值，比较时要匹配条件。

## 2. 四线法测导通电阻

两线法包含引线和接触：

$$
R_{2w}=R_{device}+R_{leads}+R_{contacts}.
\tag{2}
$$

用一对导线强制漏极电流、另一对高阻导线在定义好的器件端口取样电压：

$$
R_{DS(on)}=\frac{V_{DS,sense}}{I_D}.
\tag{3}
$$

例如 10 A 脉冲下测得 0.120 V，结果为 12 mΩ；若夹具额外有 3 mΩ，两线读数会变成 15 mΩ，误差 25%。Kelvin 源脚可避免公共外部源阻抗影响栅极参考，但不会自动去掉封装内部所有电阻。

{% include blog-figure.html file="static-on-state" alt="两种示意电阻的导通压降—电流曲线" caption="只有栅压、温度和脉冲条件匹配时斜率才可比较；Kelvin 感测从目标测量中去掉强制引线压降。" %}

## 3. 分开电气稳定与自热

采样窗口要晚于振铃和仪器稳定，又早于明显自热。近似恒定脉冲功率时，

$$
\Delta T_j(t_p)\approx PZ_{th}(t_p).
\tag{4}
$$

例如 1.2 W 与 0.2 K/W 对应 0.24 K 温升。所用瞬态热阻必须匹配封装、安装和时间范围。改变脉宽与恢复时间，检查提取电阻是否系统漂移；若没有同时满足稳定和低自热的窗口，应改进夹具或测量链，而不是假设温度不变。

## 4. 输出、转移与阈值曲线

输出特性在若干固定 $$V_{GS}$$ 下扫描 $$V_{DS}$$；转移特性在规定 $$V_{DS}$$ 下扫描 $$V_{GS}$$。任何点都必须落在脉冲 SOA 内。局部参数为

$$
g_m=\left.\frac{\partial I_D}{\partial V_{GS}}\right|_{V_{DS},T_j},
\qquad
g_{ds}=\left.\frac{\partial I_D}{\partial V_{DS}}\right|_{V_{GS},T_j}.
\tag{5}
$$

用明确窗口的局部拟合求导并保留原始曲线；相邻噪声点直接差分会产生虚假峰值。反向扫描若不重合，可能暴露自热、稳定时间或历史效应。

阈值电压是在规定小电流和漏极连接条件下的测量点，不是实现低导通电阻所需的驱动电压。IGBT 和二极管应在适用范围内报告 $$V_{CE(sat)}$$ 或 $$V_F$$，而不是强行套用恒定电阻。

## 5. 泄漏与阻断

漏电测试要明确关断栅压、漏极电压、温度和等待时间；清洁绝缘表面、屏蔽敏感节点，并尽可能测量无 DUT 的夹具基线。击穿是单独的限流协议：按规定斜升至小电流判据并在限值处停止。电源限流不能消除电缆和本地电容中的储能，不要把日常漏电扫描意外变成雪崩试验。

## 6. 不确定度与模型

若电压、电流不确定度独立，

$$
\frac{u_R}{R}\approx\sqrt{\left(\frac{u_V}{V}\right)^2+
\left(\frac{u_I}{I}\right)^2}.
\tag{6}
$$

在 120 mV、1 mV 电压不确定度和 0.5% 电流不确定度下，合成相对不确定度约 0.97%，尚未包括温度、接触和重复性。相关误差需加入协方差。

最终应输出覆盖电流、栅压和温度的导通查表模型，同时保留部分测量点作独立验证。继续阅读[双脉冲测试]({{ '/zh/resources/blog/double-pulse-testing/' | relative_url }})，研究开关过程中发生的变化。
