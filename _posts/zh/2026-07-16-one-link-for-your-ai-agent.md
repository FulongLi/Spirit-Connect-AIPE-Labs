---
layout: post
title: "用一条链接把电力电子资源接入你的 AI Agent"
description: "为什么我们发布 aipe.md，以及如何让 Claude Code、Codex 或其他 AI 编程助手利用真实元件数据协助设计变换器。"
date: 2026-07-16
author: "Dr. Fulong Li"
lang: zh
permalink: /zh/resources/blog/one-link-for-your-ai-agent/
translation_key: one-link-for-your-ai-agent
en_url: /resources/blog/one-link-for-your-ai-agent/
---

Claude Code、Codex 等 AI 编程助手，正在逐渐成为工程工作真正发生的地方。但当你向它们询问电力电子问题时，它们通常只能依靠通用知识，而不是实际的器件表征数据、磁性元件数据库或经过验证的设计参考。

我们希望用一个刻意保持简单的方法改变这种情况：**只需要一条链接。**

```
https://aipel.co.uk/aipe.md
```

把这条链接粘贴给你的 Agent，并让它读取其中的内容。`aipe.md` 是 AIPE Labs 已发布资源的 Markdown 索引，涵盖半导体器件数据、磁性元件与晶体管数据库、变换器设计资料和原型设计参考。它的结构专门便于语言模型理解和导航。

## 如何使用

在 Claude Code、Codex 或任何具备联网能力的 Agent 中，可以尝试这样的提示词：

> 阅读 https://aipel.co.uk/aipe.md，并利用其中的资源帮助我设计一台 10 kW DC–DC 变换器。先从筛选合适的 SiC 器件开始。

Agent 会像工程师浏览网站一样，从索引中找到所需资源；不同之处在于，它可以在几秒钟内把器件数据表与磁性元件数据库交叉对照，并把相关资料带回当前工程任务。

## 接下来会有什么

这只是更大计划的第一步。我们正在建设的 AI 辅助工程平台不会停留在静态资料层面，而会覆盖拓扑探索、损耗与热建模、控制综合和多目标优化，并贯通器件、变换器和系统三个尺度。

你可以继续关注博客中的工程笔记和进度更新。如果希望参与建设、验证工作流或讨论合作，也欢迎[联系我们](/zh/contact/)。
