---
layout: agent
title: "AIPE-Sketch：从电路连接关系到清晰的原理图"
lang: zh
permalink: /zh/resources/ai-agent-team/aipe-sketch/
description: "在 Codex 或 Claude Code 中使用 AIPE-Sketch：复制一个链接，用自然语言描述电路，生成并检查 SVG 原理图。"
role: 原理图生成
intro: 描述电路怎样连接，让 AIPE-Sketch 完成器件布局、布线和标注。
repository: https://github.com/FulongLi/AIPE-Sketch
video: /videos/AIPE-Sketch.mp4
video_poster: /images/general/aipe-sketch-video-poster.png
video_alt: AIPE-Sketch 原理图工作流动画介绍
---

## 一个链接开始画电路
{: #overview }

**AIPE-Sketch 可以把电路连接关系转换成清晰的 SVG 原理图。**
开始使用时，你不需要先学习 Python API，也不需要记住命令行参数。
把下面的仓库链接交给 Codex、Claude Code 或其他 Coding Agent，再用自然语言说明想画的电路即可。

<div class="agent-link">
  <code id="aipe-sketch-url-zh">https://github.com/FulongLi/AIPE-Sketch</code>
  <button class="copy-btn" data-copy-target="aipe-sketch-url-zh" data-copied-label="已复制" aria-live="polite">复制链接</button>
</div>

Coding Agent 会读取仓库、准备电路描述、运行 AIPE-Sketch，然后把生成的文件交给你。
你只需要用普通语言继续说明需要怎样修改。

## 在 Codex 或 Claude Code 中快速开始
{: #quick-start }

1. 在你准备工作的文件夹中打开 Codex 或 Claude Code。
2. 复制上面的仓库链接，或直接复制下面的完整提示词。
3. 粘贴给 Agent，然后用自然语言描述电路。
4. 与 Agent 一起检查 SVG 和连通性警告。

<div class="agent-link">
  <code id="aipe-sketch-prompt-zh">请阅读 https://github.com/FulongLi/AIPE-Sketch，并用它绘制我描述的电路。请帮我完成工具设置和运行；如果连接关系不清楚，先向我确认；最后生成 SVG 并运行连通性检查。</code>
  <button class="copy-btn" data-copy-target="aipe-sketch-prompt-zh" data-copied-label="已复制" aria-live="polite">复制提示词</button>
</div>

之后可以继续直接说：“把输出电容放得更靠近负载”、“加上器件参数”，
或者“改成同步 Buck 并重新绘制”。Agent 可能会请求访问 GitHub 或运行本地命令的权限。

## 它能做什么？
{: #capabilities }

- 绘制 Buck、Boost、桥式电路、逆变器、DAB 和 LLC 等常见电力电子电路。
- 自动放置已支持的电气符号、连接导线并排列标注。
- 识别串联通路、并联支路、桥臂和变压器隔离。
- 修改器件、数值、标注或连接后重新生成图纸。
- 将绘制几何与声明的电路对比，报告可能的断路或短路。

## 需要告诉 Agent 什么？
{: #custom-circuit }

直接使用普通句子。尽量提供你已经知道的信息：

- 电路拓扑或用途；
- 器件与重要参数；
- 器件之间的连接关系；
- 希望显示的标注；
- 输出文件名。

例如：

> 绘制一个 48 V 输入的 Buck 变换器，包含 MOSFET、二极管、100 µH 电感、
> 470 µF 输出电容和 10 Ω 负载。标注输入与输出，将结果保存为
> `out/my-buck.svg`，并运行连通性检查。如果我没有说清某个连接，请先向我确认。

如果你只知道部分信息，直接说明即可。Agent 可以在绘制之前追问缺少的内容。

## 会得到哪些文件？
{: #outputs }

- **SVG 原理图（`.svg`）：** 当前的原生输出格式，可以在浏览器中打开，
  也可以用 Inkscape 等矢量编辑工具修改。
- **可重新生成的电路源文件（`.py`）：** Coding Agent 可以保存它使用的 Python 网表，
  方便之后修改和重新绘制。
- **检查结果：** 终端会报告连通性警告和绘图质量信息，由 Agent 帮你解释或处理。

AIPE-Sketch 目前导出 SVG，尚不导出 SPICE、仿真模型或 PCB 文件。

## 使用结果前需要检查什么？
{: #limits }

连通性检查只能确认图纸符合已描述的电路，不能证明变换器一定能正常工作。
将图纸用于工程工作前，请检查器件方向、参数、额定值、标注和所有警告。

复杂或存在歧义的电路可能需要更多指令或手工调整布局。
开发者如果需要 Python API、命令行参数、架构与测试细节，可继续查看仓库
[README](https://github.com/FulongLi/AIPE-Sketch/blob/main/README.md)。
