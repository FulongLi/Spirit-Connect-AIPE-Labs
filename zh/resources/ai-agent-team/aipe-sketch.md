---
layout: agent
title: "AIPE Sketcher — AI 驱动的电气原理图生成"
lang: zh
permalink: /zh/resources/ai-agent-team/aipe-sketch/
description: "将 AIPE Sketcher 安装为 Codex 或 Claude Code 插件，用自然语言描述电路，得到经过电气检查的 SVG 原理图和 JSON 验证报告。"
role: 原理图生成
intro: 用 AIPE Sketcher 把电路描述转换为清晰、经过电气检查的 SVG 原理图。
agent: sketch
start: install-codex
video_alt: "AIPE Sketcher 快速入门教程（99 秒，带字幕，无声音）：安装插件、描述电路、获得原理图"
sections:
  - {id: overview, label: "概览"}
  - {id: install-codex, label: "在 Codex 中安装"}
  - {id: install-claude-code, label: "在 Claude Code 中安装"}
  - {id: quick-start, label: "生成第一张原理图"}
  - {id: capabilities, label: "它能做什么"}
  - {id: outputs, label: "输出文件"}
  - {id: limits, label: "使用前检查"}
  - {id: licence, label: "许可"}
---

## 描述电路，生成图纸，完成验证
{: #overview }

**AIPE Sketcher 把电路描述转换为整洁的 SVG 原理图，并检查图纸在电气上是否与描述一致。**
在 Codex 或 Claude Code 中用自然语言描述电路，或者直接说出参考变换器的名称，
AIPE Sketcher 就会使用标准符号库绘制原理图，并报告它检查了哪些内容。

它可以作为原生插件安装到 Codex 和 Claude Code 中。绘图与验证都在你的电脑本地运行：
只需要 Python 3.9 或更新版本，不需要 API 密钥、云服务或额外安装软件包。

上方 99 秒的快速入门视频演示了安装过程和第一张原理图。视频带字幕，没有声音。
其中的 Codex 与 Claude Code 窗口是对应用界面的简化重建，并非录屏；
Agent 的回复和原理图则来自一次真实运行。

## 在 Codex 中安装
{: #install-codex }

在 Codex 应用中（也可以使用 ChatGPT 桌面应用中的 Codex）：

1. 打开 Codex。
2. 进入 **Plugins**（插件）。
3. 选择 **Add a marketplace**，在来源中输入 `FulongLi/AIPE-Sketcher`，
   然后点击 **Add marketplace** 确认。
4. 在列表中选择 **AIPE Sketcher**，点击 **Install**。
5. 新建一个对话，描述你想绘制的电路。

更习惯命令行？运行下面两条命令，然后重启 Codex：

{% include agent-plugin-install.html agent='sketch' host='codex' lang='zh' %}

## 在 Claude Code 中安装
{: #install-claude-code }

在 Claude Code 会话中依次输入下面两条命令：

{% include agent-plugin-install.html agent='sketch' host='claude' lang='zh' %}

在终端中，对应的命令是 `claude plugin marketplace add FulongLi/AIPE-Sketcher`
和 `claude plugin install aipe-sketcher@aipe-sketcher`。当你请求绘制原理图时，
Claude 会自动使用 AIPE Sketcher；也可以通过 `/aipe-sketcher:schematic` 直接调用。

**两种应用都需要 Python 3.9 或更新版本**（macOS 和 Linux 上为 `python3`，Windows 上为 `py -3`），
用于运行本地绘图引擎。更新、卸载和检查安装的方法，请参阅仓库中的
[插件安装说明](https://github.com/FulongLi/AIPE-Sketcher/blob/main/docs/plugins.md)。

## 生成第一张原理图
{: #quick-start }

安装插件后，新建一个对话并粘贴下面的请求：

{% include agent-prompt.html agent='sketch' lang='zh' id='aipe-sketcher-prompt-zh' %}

Agent 会整理电路描述、绘制原理图并完成检查，然后回复 SVG 原理图和验证报告的链接，
同时说明它所做的假设。之后可以继续用普通语言提出修改：“标出变压器匝比”、
“增加一个输出电感”，或者“改画一个同步 Buck 变换器”。

绘制自己的电路时，尽量提供你已经知道的信息：拓扑或用途、器件与重要参数、
连接关系、希望显示的标注以及输出文件名。例如：

> 使用 AIPE Sketcher 绘制一个 48 V 输入的 Buck 变换器，包含 MOSFET、二极管、100 µH 电感、
> 470 µF 输出电容和 10 Ω 负载。标注输入与输出；如果我没有说清某个连接，请先向我确认。

## 它能做什么？
{: #capabilities }

- **根据电路描述生成电气原理图**：通过 AI Agent 用自然语言描述即可。
- **按名称绘制常见的电力电子参考拓扑**，包括 Buck、Boost、半桥与全桥、双有源桥（DAB）、
  LLC 谐振和三相逆变器等电路。
- **自动排列符号与连线**：完成器件布局、导线布线和标注。
- **对照电气电路验证图纸**：从绘制的导线中读回连接关系，与电路不一致的图纸不会被保存。
- **导出 SVG 原理图和 JSON 验证报告。**
- **在本地运行**：可通过 Codex、Claude Code 或独立的 Python 命令行使用。

## 会得到哪些文件？
{: #outputs }

- **SVG 原理图（`.svg`）：** 可以在浏览器中打开，也可以用 Inkscape 等矢量编辑工具修改。
- **验证报告（`.report.json`）：** 包括电气验证、图纸连通性、布局质量，以及这张图纸的假设与局限。
- **电路描述（`.json`）：** 记录所绘制的器件、端口和连接关系，便于之后修改并重新生成。

开发者也可以不通过 Agent，直接使用 `aipe-sketcher` 命令行或 Python API 调用同一引擎，
详见[命令行说明](https://github.com/FulongLi/AIPE-Sketcher/blob/main/docs/cli.md)。
AIPE Sketcher 不导出 SPICE、仿真模型或 PCB 文件。

## 使用结果前需要检查什么？
{: #limits }

验证只能确认图纸与给定的电路一致，不能证明器件额定值、硬件安全或电路性能。
将图纸用于工程工作前，请检查器件方向、参数、标注、报告中的假设以及所有警告。

复杂或存在歧义的电路可能需要在请求中提供更多细节；部分符号和布局尚未支持，
遇到这类情况时工具会报告问题，而不会强行绘制。架构、已知局限和测试细节请参阅仓库
[README](https://github.com/FulongLi/AIPE-Sketcher/blob/main/README.md)。

## 许可
{: #licence }

AIPE Sketcher 是源代码公开的项目，但并非开源软件。
**个人非商业用途免费**；商业用途需事先获得书面许可。详见
[LICENSE](https://github.com/FulongLi/AIPE-Sketcher/blob/main/LICENSE)。
随附的电气符号库是单独的第三方素材，采用 CC0 1.0 许可。
