---
layout: post
title: "温度循环可靠性：封装应变、停留与失效分析"
description: "区分外部温度循环与器件自热，定义样本真实温度历史，并把封装退化连接到可测应力程序。"
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/temperature-cycling-reliability/
translation_key: temperature-cycling-reliability
en_url: /resources/blog/temperature-cycling-reliability/
---

温度循环由外部环境反复改变器件或组件温度；功率循环则由器件损耗自热。即使报告的温差相同，两者的梯度、停留和失效机理也可能不同。

## 1. 从热膨胀差开始

两种粘接材料的自由失配应变初估为

$$
\Delta\varepsilon_{mis}\approx(\alpha_1-\alpha_2)\Delta T.
\tag{1}
$$

若膨胀系数差 10 ppm/K、温差 100 K，则自由失配约 0.1%。真实应力还取决于几何、弹性、蠕变、温度与时间，不能由该数字直接预测循环寿命。

## 2. 定义样本而非只定义箱体

箱体传感器测环境，器件、底板和 PCB 各有不同时间常数。要规定并测量样本温度端点、实际升降温速率、达到样本条件后的停留、安装约束、电气状态、气流和凝露控制。

{% include blog-figure.html file="passive-cycling" alt="升降温和停留期间样本温度滞后箱体" caption="箱体先到设定点，样本随后才到；解释停留和累计循环前必须确认样本条件。" %}

## 3. 可辩护的测试序列

先做电气、热与机械基线并检查初始装配；在代表性样本上布置传感器，先运行小批循环验证真实温度轨迹。固定检查点做同条件电测和成像，分别报告功能失效、泄漏漂移、裂纹与分层。夹具或程序变化要留在记录中，不能把前后当成同一曝光。

## 4. 用证据解释退化

热阻升高既可能来自内部连接层，也可能来自外部 TIM；焊点裂纹能改变电阻却不代表半导体内部损伤。必须先定义测量边界，再用成像或破坏分析定位。

疲劳模型可写为

$$
N_f=A(\Delta\varepsilon_{inel})^{-m},
\tag{2}
$$

但非弹性应变通常来自结构/材料模型；直接以箱体 $$\Delta T$$ 替代需要额外假设，参数也不能跨封装移植。

## 5. 报告分布与观察上限

对每个样本保留循环数、检查时间、最后通过、首次失败与失效分类；幸存者和区间失效都要进入统计。通过一个资格样本组只支持该程序与总体，不能直接宣称现场寿命。任务剖面外推见[寿命估算篇]({{ '/zh/resources/blog/mission-profile-lifetime-estimation/' | relative_url }})。
