---
layout: agent
title: "AIPE-Sketch：从电路连接关系到清晰的原理图"
lang: zh
permalink: /zh/resources/ai-agent-team/aipe-sketch/
description: 认识开源原理图绘制工具 AIPE-Sketch，学习快速运行、Python 自定义电路，以及与 AI 编程助手协作的方法。
role: 原理图生成
intro: 描述电路怎样连接，让 AIPE-Sketch 完成器件布局、布线和标注。
repository: https://github.com/FulongLi/AIPE-Sketch
visual: /assets/blog/figures/circuit-dab.svg
visual_alt: AIPE-Sketch 生成的 DAB 变换器原理图
---

## 认识团队中的原理图绘制工具
{: #overview }

解释变换器、讨论设计方案或整理工程文档时，我们经常需要先画一张电路图。手工绘制意味着每次修改电路，都要重新排列器件、调整走线，再挪动标注。

**AIPE-Sketch 可以把电路的电气连接关系转换成 SVG 原理图。** 你用 Python 描述器件，以及连接器件端口的各条网络；工具根据这些关系分析电路结构并生成图纸。在 AI Agent 团队里，它承担原理图生成的角色。仓库提供的是 Python 库和命令行示例，可以由 AI 编程助手调用，融入工程工作流程；自动规划本身基于电路图结构，不依赖大语言模型服务。

项目代码公开在 [AIPE-Sketch GitHub 仓库](https://github.com/FulongLi/AIPE-Sketch)。

## 它负责哪些工作？
{: #capabilities }

- **分析结构与规划布局：** 识别串联通路、并联支路、桥臂和变压器隔离等结构，将器件之间的关系转换成绘图计划。
- **放置符号与布线：** 使用主 SVG 符号库，排列器件，并生成由水平、垂直线段组成的走线。
- **安排标注与重复结构：** 检查标注是否发生碰撞，为识别出的重复桥臂保持一致的几何布局。
- **验证电气连通性：** 从绘制结果的几何关系重建连接，再与原始电路比较，检查是否产生意外短路或断路。

默认流程评估 12 个确定性的几何候选方案，对每个方案重新布线、标注、评分和验证，再选择结果。电气描述与坐标、显示样式相互分离，因此修改电路时，不需要手工重画每个器件。实现细节可查看[架构说明](https://github.com/FulongLi/AIPE-Sketch/blob/main/docs/architecture.md)。

## 先从熟悉的变换器开始
{: #quick-start }

准备好 Git 和 Python 3，克隆仓库后，在仓库根目录运行示例。当前核心绘图流程使用 Python 标准库和仓库自带的符号资源。

```bash
git clone https://github.com/FulongLi/AIPE-Sketch.git
cd AIPE-Sketch
python3 build.py buck dab
```

运行后会得到 `out/buck.svg` 和 `out/dab.svg`。用浏览器或 Inkscape 等矢量编辑器打开文件，即可查看原理图。终端还会显示质量指标、选中的候选方案，以及绘图警告。

仓库示例包括 Buck、Boost、半桥、全桥、三相逆变器、DAB 和 LLC 谐振电路，也包含用于检查绘图规则的合成电路网络。

可以用下面这些命令进一步探索：

```bash
python3 build.py                 # 生成全部参考示例
python3 build.py --plan buck     # 查看电路分析与关系规划
python3 build.py --checks buck   # 生成图纸并显示详细检查
python3 build.py --manual buck   # 与已保存的手工布局基线比较
```

## 绘制自己的电路
{: #custom-circuit }

将下面的代码保存为仓库根目录下的 `my_circuit.py`。它描述了一个由电压源、1 mH 电感和 10 Ω 电阻构成的闭合串联支路。

```python
from aipe_sketch import Netlist, Schematic

circuit = Netlist('Inductive branch')
circuit.add('V1', 'voltage_source')
circuit.add('L1', 'inductor', inductance=0.001)
circuit.add('R1', 'resistor', resistance=10)

circuit.connect('input', 'V1.p', 'L1.a')
circuit.connect('output', 'L1.b', 'R1.a')
circuit.connect('return', 'V1.n', 'R1.b')

circuit.validate()
schematic = Schematic.from_netlist(circuit)
schematic.render('out/branch.svg')
```

执行 `python3 my_circuit.py`，然后打开 `out/branch.svg`。

`add()` 创建器件并指定其类型；`connect()` 为一条网络命名，列出属于该网络的器件端口。示例中，电压源使用 `p`、`n` 端口，电感和电阻使用 `a`、`b` 端口。网络名称用于描述电气连接，不会自动变成图上的文字。电感量、电阻值等参数属于电气模型；需要额外显示文字时，可使用独立的 `SchematicText` 接口。

绘图前先验证电路。未知端口、悬空端口和只有一个端口的网络会被拒绝。新增器件类型还需要对应的符号和端口映射，才能生成原理图。

## 怎样与 AI 编程助手一起使用？
{: #agent-workflow }

让 AI 编程助手读取仓库，再描述需要绘制的器件和连接关系。第一次使用时，可以给它这样的任务：

> 阅读 AIPE-Sketch 的 README，查看 Buck 示例。使用已有的 Netlist 和 Schematic 接口生成 SVG，运行详细绘图检查，并解释所有警告。然后帮助我修改电路并重新生成原理图。

绘制自定义电路时，可以让助手先编写 `Netlist`，验证端口与连接，再通过 `Schematic.from_netlist()` 绘图，最后与你一起查看结果。这样，助手有了明确的绘图工具，电气描述也保留下来，便于检查。当前工具不包含独立的对话式 Agent，也没有内置的自然语言转电路接口。

## 使用结果前，需要了解什么？
{: #limits }

连通性检查可以确认图纸是否符合声明的电路，但不能证明电路在实际工况下能正确运行。功率通路推断基于结构；复杂或存在歧义的电路可能需要人工检查或专家布局覆盖。当前规则识别的是由两个器件组成的桥臂，主符号表中的很多符号也还没有可用于绘图的工程端口映射。

目前输出是 SVG 原理图，仿真、SPICE 和其他导出器属于未来后端。将结果用于工程工作前，请检查图纸和警告。仓库的 [README](https://github.com/FulongLi/AIPE-Sketch/blob/main/README.md) 说明了接口和已知限制，[回归报告](https://github.com/FulongLi/AIPE-Sketch/blob/main/docs/auto-planning-results.md) 列出了用于检验自动规划的参考电路。
