---
layout: post
title: "从任务剖面到寿命：损伤模型、Weibull 统计与不确定度"
description: "把运行历史、损耗和热模型连接到机理特定寿命估算，并正确处理加速、删失数据和统计置信度。"
date: 2026-09-10 09:20:00 +0100
author: "Dr. Fulong Li"
lang: zh
math: true
device_testing_series: true
permalink: /zh/resources/blog/mission-profile-lifetime-estimation/
translation_key: mission-profile-lifetime-estimation
en_url: /resources/blog/mission-profile-lifetime-estimation/
---

寿命估算不是把加速试验小时数换算成年数，而是一条完整证据链：任务剖面 → 电损耗 → 温度/应力历史 → 机理特定损伤 → 样本统计。必须先定义失效事件、对象层级和主导机理。

## 1. 从运行历史得到应力

把时间序列的电压、电流、开关频率和环境送入经过验证的损耗模型，再用瞬态热网络得到 $$T_j(t)$$。对热疲劳可用雨流计数提取 $$\Delta T_j$$、平均温度和周期时间；偏压、湿气和日历老化则需要各自的暴露量。功率循环模型不能自动代表温度循环或湿热退化。

## 2. 累积损伤及其假设

常用 Palmgren–Miner 线性和为

$$
D=\sum_i\frac{n_i}{N_{f,i}}.
\tag{1}
$$

$$n_i$$ 是应力分箱中的实际循环，$$N_{f,i}$$ 是同一寿命统计量下的恒幅拟合寿命。$$D=1$$ 只是模型约定，忽略载荷顺序和相互作用，损伤分数也不是失效概率。若一个任务块包含 1000/100000 与 100/10000 两项，$$D_{block}=0.02$$，形式上 50 个相同块达到 1；这只是算术示例。

## 3. 加速模型只适用于已校准机理

热激活机理可使用 Arrhenius：

$$
t_f(T)=A\exp\left(\frac{E_a}{k_BT}\right),\qquad
AF=\exp\left[\frac{E_a}{k_B}\left(\frac1{T_{use}}-\frac1{T_{test}}\right)\right].
\tag{2}
$$

温度必须用 K，$$E_a$$ 必须对应材料和机理。示例 $$E_a=0.7\ \mathrm{eV}$$、75 °C 使用、125 °C 测试得到 $$AF\approx18.7$$；不能把它整体用于机械疲劳或湿度/电压组合应力。要用多个应力水平验证斜率，并检查失效机理是否改变。

## 4. Weibull 描述样本差异

两参数 Weibull 为

$$
F(N)=1-\exp[-(N/\eta)^\beta],\qquad S=1-F,
\tag{3}
$$

其中 $$\eta$$ 是 63.2% 累积失效时的尺度，不是平均寿命；指定失效分位数

$$
N_p=\eta[-\ln(1-p)]^{1/\beta}.
\tag{4}
$$

B10 拟合值与 B10 的置信下限不是同一数字，方便的分布拟合也不能证明物理机理。

{% include blog-figure.html file="weibull-life" alt="相同尺度、不同形状参数的 Weibull 总体" caption="两条曲线都在 η 达到 63.2% 失效，但低分位寿命不同；特征寿命不是每个样本的保证寿命。" %}

## 5. 保留幸存者和检查区间

试验结束仍工作的样本是右删失；只在检查点发现失效，则失效位于最后通过与首次失败之间。独立样本、非信息性删失下，似然包含

$$
\mathcal L(\theta)=\prod_{i\in E}f(N_i)
\prod_{j\in R}S(c_j)
\prod_{k\in I}[F(b_k)-F(a_k)].
\tag{5}
$$

只拟合失败样本通常会产生偏差。

{% include blog-figure.html file="censored-observations" alt="精确失效、区间失效与右删失幸存者" caption="幸存者说明寿命超过观察时间，检查点失效给出一个区间；两者都是有效证据。" %}

## 6. 零失效能证明什么

若 $$n$$ 个独立代表性样本都通过同一暴露，单侧可靠度下限为

$$
R_L=\alpha^{1/n},\qquad \text{置信度}=1-\alpha.
\tag{6}
$$

30 个样本零失效、95% 置信度时，$$R_L\approx0.905$$。它只说明在该暴露与抽样假设下的通过概率下限，不能证明 100% 可靠、Weibull 形状或现场年限。

## 7. 输出可质疑、可追溯的预测

用未参与拟合的应力、波形或样本验证模型，并传递任务剖面、损耗、温度测量、热模型、加速参数和样本离散性的不确定度。报告总体、机理、失效判据、暴露域、寿命统计量和置信度；最终结果应是带条件的预测，而不是一个没有证据边界的“寿命数字”。
