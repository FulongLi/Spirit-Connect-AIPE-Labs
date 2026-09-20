---
layout: post
title: "固态变压器高频变压器设计：从伏秒到可测试方案"
description: "推导变压器匝数，区分传输电感与励磁电感，并把 DAB 波形关联到绕组、磁芯、热与绝缘要求。"
date: 2026-01-19
author: "Dr. Fulong Li"
lang: zh
math: true
sst_series: true
permalink: /zh/resources/blog/sst-high-frequency-transformer-design/
translation_key: sst-high-frequency-transformer-design
en_url: /resources/blog/sst-high-frequency-transformer-design/
---

高频变压器在 [DAB 隔离级]({{ '/zh/resources/blog/dab-converter-from-principles-to-control/' | relative_url }})中提供电气隔离与电压变换。设计必须从绕组电压和电流波形出发；功率额定值本身不能决定匝数、磁芯尺寸或绕组结构。

沿用系列算例：原副边直流端口均为 48 V，每模块 100 W，开关频率 50 kHz，$$n=N_p/N_s=1$$。除特别说明外，电感均折算到原边。下面的数值只建立初步约束，并不直接选定磁芯、绕组组件或绝缘系统。

## 1. 从绕组电压积分得到磁通

令 $$v_p(t)$$ 为理想变压器原边电压，不含单独建模的漏感和外接串联电感压降。由法拉第定律

$$
v_p=N_p\frac{d\Phi}{dt}=N_pA_e\frac{dB}{dt},\qquad
\Delta B=\frac{1}{N_pA_e}\int v_p(t)\,dt.
\tag{1}
$$

若绕组承受频率 $$f_s$$、幅值 $$\pm V_p$$ 的对称方波，一个正半周期把磁通从 $$-B_{\mathrm{pk}}$$ 推到 $$+B_{\mathrm{pk}}$$，所以

$$
N_p\ge\frac{V_p}{4f_sA_eB_{\mathrm{pk,allow}}}.
\tag{2}
$$

分母中的 4 同时来自半周期与峰峰值磁通摆幅。该式假设稳态对称且直流磁通偏置为零；DAB 电压比、调制方式或电感位置变化时，应重新检查实际绕组电压。

取 $$A_e=80\ \mathrm{mm^2}$$、$$B_{\mathrm{pk,allow}}=0.10\ \mathrm T$$：

$$
N_p\ge\frac{48}{4(50\times10^3)(80\times10^{-6})(0.10)}=30,
\qquad N_s=30.
\tag{3}
$$

30 匝只是标称条件下的下限，未计电压容差或开关频率下降；52.8 V 绕组电压在同一磁通限值下需要 33 匝。0.10 T 是设计目标，不是已验证的材料极限，最终值应依据随温度变化的饱和与损耗数据选择。

{% include blog-figure.html file="magnetic-flux" alt="方波绕组电压积分为三角形磁通密度" caption="一个正半周期把 B 从 −0.1 T 推到 +0.1 T；这个峰峰值变化与半周期共同解释了匝数公式中的系数 4。" %}

## 2. 区分两种电感

DAB 传输电感 $$L_\sigma=20\ \mu\mathrm H$$ 承受两桥差模电压；励磁电感 $$L_m$$ 决定建立磁芯磁通所需电流：

$$
L_\sigma\frac{di_\sigma}{dt}=v_1-v_2',\qquad
L_m\frac{di_m}{dt}=v_p.
\tag{4}
$$

两者是等效电路中的不同元件。传输电感可以由实测漏感和外接电感共同组成，但不能把同一漏感重复计算；外接电感也需要独立的饱和、储能和热设计。

对称方波电压产生三角形励磁电流。若试设计得到 $$L_m=1\ \mathrm{mH}$$，

$$
\Delta i_{m,\mathrm{pp}}=\frac{V_p}{2f_sL_m}=0.48\ \mathrm A,
\qquad I_{m,\mathrm{rms}}=\frac{\Delta i_{m,\mathrm{pp}}}{2\sqrt3}=0.139\ \mathrm A.
\tag{5}
$$

匹配电压下 DAB 标称传输电流约为 2.23 A RMS。励磁与传输电流必须按波形相加；二者相关，不能简单做算术和或均方根合成。实际 $$L_m$$ 要由选定磁芯、匝数、气隙和装配验证。

## 3. 磁通偏置

周期稳态要求绕组净伏秒为零：

$$
\int_0^{T_s}v_p(t)\,dt=0,
\qquad
\Delta B_{\mathrm{offset}}=\frac{\Delta\mathcal V}{N_pA_e}.
\tag{6}
$$

脉冲宽度不等、器件压降、启动过程或控制更新都可能引入每周期伏秒误差 $$\Delta\mathcal V$$。即使对称摆幅满足公式（2），持续偏置仍会把磁芯推入饱和。需要检查脉冲对称性、启动时序和电流偏置检测。隔直电容是一种措施，但会改变谐振与瞬态，也必须单独分析。

## 4. 从电流波形得到绕组要求

导体截面积由 RMS 电流、允许温升和窗口面积共同决定。50 kHz 下，趋肤与邻近效应使绕组排布不可忽略。室温铜的趋肤深度估算为

$$
\delta=\sqrt{\frac{\rho}{\pi f\mu_0}}\approx0.30\ \mathrm{mm}.
\tag{7}
$$

这不足以单独决定股线直径或交流电阻，因为电流包含谐波，磁场还取决于层间位置。更完整的绕组损耗为

$$
P_{\mathrm{cu}}=I_{\mathrm{dc}}^2R_{\mathrm{dc}}+
\sum_{h\ge1}I_{h,\mathrm{rms}}^2R_{\mathrm{ac}}(hf_s,T).
\tag{8}
$$

原副边交错可以降低漏感与邻近损耗，却会增大绕组间电容。DAB 本身需要一定传输电感，而 SST 又承受共模开关，因此这不是单向优化。[TI 的 DAB 设计指南](https://www.ti.com/lit/pdf/tidues0)提供了实用参考。

## 5. 闭合磁芯损耗与热计算

磁芯损耗应来自所选材料、实际磁通波形、频率和温度对应的厂家数据或验证模型；不能无依据地把正弦拟合式用于任意开关波形。初步热估算为

$$
P_{\mathrm{mag}}=P_{\mathrm{core}}+P_{\mathrm{cu}}+P_{\mathrm{other}},
\qquad \Delta T\approx R_\theta P_{\mathrm{mag}}.
\tag{9}
$$

热阻取决于安装、气流与绕组结构。应迭代匝数、导体排布与磁芯，直到磁通、窗口占用、损耗和热点温度都满足工作包络。伏秒计算本身不能证明 100 W 额定能力。

## 6. 绝缘边界与验证

在中压 CHB 中，模块原副边共模应力可能远高于其本地直流链路电压。绝缘规格必须由模块位置、接地、瞬态及设备标准推导，包括电气间隙、爬电距离、耐压、必要时的局放评估以及绕组间电容；本文低压算例不提供中压间距处方。

满功率前应验证匝比、极性、励磁电感、明确测试接法下的短路漏感和绕组电阻；在低电压下积分绕组电压检查磁通漂移，再跨电压比范围比较电流、温度与计算值。设计记录至少应包含绕组图、等效电路、磁芯材料数据、损耗估算、绝缘规格与实测结果，之后它才能成为[模块化 SST]({{ '/zh/resources/blog/modular-sst-system-integration/' | relative_url }})中的已验证部件。
