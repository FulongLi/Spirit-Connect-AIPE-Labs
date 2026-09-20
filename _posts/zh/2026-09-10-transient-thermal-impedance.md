---
layout: post
title: "瞬态热阻抗：从温升曲线到验证过的 RC 模型"
description: "推导热阶跃与冷却测量、任意功率温度预测，并在明确物理边界下拟合 Foster 或 Cauer 模型。"
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/transient-thermal-impedance/
translation_key: transient-thermal-impedance
en_url: /resources/blog/transient-thermal-impedance/
---

短功率脉冲不会立刻产生稳态温升。热量在芯片、连接层、封装和冷却系统中以不同时间尺度扩散；瞬态热阻抗描述指定边界下的这一过程。

## 1. 阶跃响应定义

假设热系统近似线性时不变、初始平衡且参考温度固定，施加恒定功率 $$P_0$$：

$$
Z_{th}(t)=\frac{T_j(t)-T_{ref}}{P_0},qquad
R_{th}=\lim_{t\to\infty}Z_{th}(t).
\tag{1}
$$

它是 K/W 的时间域阶跃响应，不是器件电开关阻抗。冷却液温度若变化，就是另一个系统输入。

{% include blog-figure.html file="thermal-impedance" alt="对数时间轴上的热阶跃响应" caption="短脉冲产生的温升小于持续加热；重复脉冲峰值必须使用完整功率历史计算。" %}

## 2. 加热与冷却测量

若先加热到稳态，再于 $$t=0$$ 关断，

$$
T_{j,cool}(t)-T_{ref}=P_0[R_{th}-Z_{th}(t)].
\tag{2}
$$

只有这一初始稳态条件下，冷却曲线才可直接补成加热阶跃。若加热只持续 $$t_h$$，

$$
T_{j,cool}(t)-T_{ref}=P_0[Z_{th}(t+t_h)-Z_{th}(t)].
\tag{3}
$$

要记录加热电压电流、持续时间、切换到感测的延时和首个可信读数；早期电气伪影与盲区会限制最快可辨识热模态。

## 3. 单热 RC 与多时间常数

单个热容 $$C_{th}$$ 经热阻 $$R_{th}$$ 接到参考端：

$$
C_{th}\frac{d\Delta T}{dt}=P_0-\frac{\Delta T}{R_{th}},
\qquad Z_{th}=R_{th}(1-e^{-t/\tau}),\quad \tau=R_{th}C_{th}.
\tag{4}
$$

完整封装通常需要多时间常数。Foster 形式为

$$
Z_{th}(t)=\sum_{k=1}^mR_k(1-e^{-t/\tau_k}),
\qquad R_k>0,\ \tau_k>0.
\tag{5}
$$

Foster 支路只是端口拟合参数，不能自动解释为芯片、焊层或底板；任意内部节点也不能直接连接散热器模型。Cauer 梯形网络更适合表达物理边界，但也必须经过结构和实验验证。拟合要覆盖对数时间范围并检查残差，避免密集长时间样本淹没早期误差。

## 4. 任意功率历史的温度预测

令 $$h=dZ_{th}/dt$$，

$$
\Delta T_j(t)=\int_0^th(t-\tau)P(\tau)d\tau.
\tag{6}
$$

分段恒功率可写为各功率阶跃叠加：

$$
\Delta T_j(t)=\sum_r\Delta P_rZ_{th}(t-t_r).
\tag{7}
$$

矩形脉冲是一正一负两个阶跃；重复脉冲必须累加到周期温度收敛，平均功率乘稳态热阻会漏掉循环峰值。

若 $$R_1=0.2\ \mathrm{K/W},\tau_1=1\ \mathrm{ms}$$、$$R_2=0.8\ \mathrm{K/W},\tau_2=100\ \mathrm{ms}$$，10 ms 时 $$Z_{th}=0.2761\ \mathrm{K/W}$$；50 W、10 ms 脉冲产生约 13.81 K，而持续加热稳态为 50 K。

## 5. 多热源与验证

多芯片模块需同时考虑自热和交叉加热：

$$
\Delta T_i(t)=\sum_j\int_0^th_{ij}(t-\tau)P_j(\tau)d\tau.
\tag{8}
$$

各响应要通过独立激励或合理辨识获得，不能假设所有芯片同温。

用一个阶跃拟合后，应在不重拟合的情况下预测其他脉宽和重复脉冲，比较峰值、恢复与长时间极限；再改变功率与基准温度检验线性。记录安装、冷却、校准、时间分辨率、延时修正和完整功率历史。目标是在明确域内可靠预测，而不是堆出最多 RC 支路。
