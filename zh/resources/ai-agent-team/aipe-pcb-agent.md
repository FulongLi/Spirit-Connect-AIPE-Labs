---
layout: agent
title: "AIPE PCB Agent：从设计需求到通过规则检查的 KiCad 设计"
lang: zh
permalink: /zh/resources/ai-agent-team/aipe-pcb-agent/
description: "在 Codex 或 Claude Code 中使用 AIPE PCB Agent，在 KiCad 中进行 AI 辅助的电力电子 PCB 设计，配合原生 ERC/DRC 检查与有记录的工程评审。这是需要人工评审的工程原型。"
role: PCB 设计与评审
intro: 基于可复现的 KiCad 自动化，AI 辅助完成电力电子 PCB 工程：从明确的设计需求，到完成布线并通过规则检查的电路板，再到书面设计评审。
agent: pcb-agent
sections:
  - {id: overview, label: "概览"}
  - {id: capabilities, label: "它能做什么"}
  - {id: quick-start, label: "开始使用"}
  - {id: limits, label: "重要限制"}
---

## 概览
{: #overview }

**AIPE PCB Agent 帮助 Coding Agent 把一块电力电子电路板从设计需求推进到可评审的 KiCad 设计。**
它把任务整理成明确的输入与假设，通过可复现的自动化驱动 KiCad，运行 KiCad 自带的检查，
并形成一份让所有未解决问题保持可见的设计评审记录。

它是一个**工程原型**。示例设计是评审资料包，而不是经过验证的硬件：
没有任何示例被制板、通电或测量，所有结果都需要人工工程评审。

## 它能做什么
{: #capabilities }

- 把设计任务整理成使用 SI 单位的需求，并单独记录假设清单；给出可复现的计算以及器件应力与损耗估算。
- 通过脚本自动化创建 KiCad 原理图与电路板：器件布局、叠层定义，以及预期连接的布线。
- 运行 KiCad 原生 ERC、DRC、未连接项与原理图一致性检查，并导出原理图与电路板 PDF、Gerber 和钻孔文件。
- 按书面 PCB 规则逐条评审设计，每条规则都记录为通过、不通过、未验证或不适用，并附上依据。
- 利用从厂商参考设计中提炼的工程知识库，涵盖 SiC 栅极驱动及其布局、直流母线电容、隔离栅极偏置电源、采样与热布局。

主要示例是一台 400 V 转 200 V、5 kW 的 SiC 同步 Buck 变换器，包括功率板与控制板，
两块板都已完成布线且原生 ERC/DRC 结果为零，并附有列出发布阻碍项的设计评审。
详见 [V3 示例资料包](https://github.com/FulongLi/AIPE-PCB-Agent/blob/main/examples/sic-buck-400v-200v-5kw-v3/README.md)（英文）。

## 开始使用
{: #quick-start }

你需要 Python 3.10 或更高版本，以及已安装的 KiCad。Agent 会查找并记录你电脑上的 KiCad 可执行文件；
安装任何软件都需要你的确认。

1. 在你想工作的文件夹中打开 Codex 或 Claude Code。
2. 复制下面的提示词粘贴给 Agent，并描述你的电路板：输入与输出额定值、拓扑、机械限制，以及已经确定的内容。
3. 让 Agent 先检查环境。它可以在仓库根目录运行 `python -m automation.setup.detect_environment`
   和测试套件；环境检测工具不会安装任何软件。
4. 在依赖设计的任何部分之前，先和 Agent 一起检查 ERC/DRC 结果、假设清单与设计评审。

{% include agent-prompt.html agent='pcb-agent' lang='zh' %}

[仓库 README](https://github.com/FulongLi/AIPE-PCB-Agent) 及其
[工作流程与验收关口](https://github.com/FulongLi/AIPE-PCB-Agent/blob/main/docs/agent-workflow.md)（英文）
说明了完整流程以及每个示例的复现方法。

## 重要限制
{: #limits }

- **必须经过人工工程评审。** 当前版本在硬件验证与人工评审完成前不予发布，也未批准任何制板或通电。
- **ERC/DRC 零报错只是 CAD 层面的结论。** 它说明图纸满足所设定的规则，不代表电路板在电气、热、EMI 或绝缘方面安全可靠。
- **未经过硬件验证。** 没有任何示例电路板被制作或测试；知识库条目来自参考设计或解析核对，未经过仿真或实测。
- **高压危险。** 未经合格工程师评审、没有测试计划和安全的实验室操作规范时，切勿制作或通电由该工具生成的设计。
