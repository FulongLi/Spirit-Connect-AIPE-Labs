---
layout: agent
title: "AIPE IEEE Paper Agent：从研究想法到 IEEE 稿件"
lang: zh
permalink: /zh/resources/ai-agent-team/aipe-ieee-paper-agent/
description: "在 Codex 或 Claude Code 中使用 AIPE IEEE Paper Agent，把研究想法整理成关联证据的论文计划，并基于 IEEE 官方模板生成 LaTeX 稿件工作区。"
role: 科研写作
intro: 把研究想法整理成关联证据的论文计划，再基于目标 IEEE 期刊或会议的官方模板，生成 LaTeX 稿件工作区。
agent: ieee-paper-agent
sections:
  - {id: overview, label: "概览"}
  - {id: capabilities, label: "它能做什么"}
  - {id: quick-start, label: "开始使用"}
  - {id: limits, label: "重要限制"}
---

## 概览
{: #overview }

**AIPE IEEE Paper Agent 是一套与 Coding Agent 配合使用的结构化科研写作流程。**
它从研究想法而不是文字本身出发：先梳理论文的问题、研究空白、核心思路、证据与影响，
把每个重要问题对应到能够回答它的证据，然后才在真实的期刊或会议模板中撰写。

它从不编造结果或参考文献信息。缺失的证据会被标记为阻塞、重要或可选，让你清楚论文还需要完成哪些工作。

## 它能做什么
{: #capabilities }

- 把研究想法整理成研究问题、两到四条可验证的贡献声明，以及证据、图与表的规划。
- 基于六类 IEEE 期刊与会议的官方模板创建 LaTeX 稿件工作区：IEEE 会议、IEEE Transactions、IEEE Access、
  IEEE OJPEL、IEEE TAI 和 IEEE OJCSYS。工作区保留各模板的文档类与前置信息，并可在 Overleaf 中使用。
- 为 BibTeX 参考文献库建立索引，检查引用中缺失的条目与重复的键，并按期刊配置检查 LaTeX 结构。
- 可选加入电力电子领域包，提供整理好的领域知识、术语与文献维护指南。
- 通过持续维护的写作、引用规则与科研推理流程，指导正文撰写与审稿意见回复。

## 开始使用
{: #quick-start }

你需要 Python 3.10 或更高版本，无需安装任何 Python 包。如需生成 PDF，请使用 LaTeX 发行版，
或把生成的工作区上传到 Overleaf。

1. 在你想工作的文件夹中打开 Codex 或 Claude Code。
2. 复制下面的提示词，把占位内容替换成你的研究想法，然后粘贴给 Agent。
3. 在开始撰写之前，先检查论文计划和证据缺口。
4. 选择目标期刊或会议。Agent 会用仓库中的 `scripts/create-manuscript.py` 创建工作区，并运行引用与 LaTeX 检查。

{% include agent-prompt.html agent='ieee-paper-agent' lang='zh' %}

**原生安装。** 该仓库还说明了如何用其自带的发布脚本打包，并安装为 Codex 技能、本地 Codex 插件市场或 Claude 技能。
请按照其[安装说明](https://github.com/FulongLi/AIPE-IEEE-Paper-Agent/blob/main/INSTALL.md)（英文）操作。

## 重要限制
{: #limits }

- **证据需要由你提供。** Agent 围绕你的结果和参考文献进行规划与撰写，它不会产生实验结果。
- **检查是静态的。** 引用与 LaTeX 检查不能验证引用内容是否真实，也不会编译 PDF。请自行核实来源并检查编译后的论文。
- **工作区不等于可投稿稿件。** 新建的工作区包含明确的 TODO。投稿前请核对期刊或会议最新的作者须知。
- **许可尚未确定。** 仓库整体的许可证尚未声明，第三方模板与资源保留其各自的权利。
