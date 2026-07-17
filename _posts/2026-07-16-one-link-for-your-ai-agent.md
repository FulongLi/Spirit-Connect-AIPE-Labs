---
layout: post
title: "One link to bring power electronics into your AI agent"
description: "Why we published aipe.md — and how to use it with Claude Code, Codex, or any AI coding agent to design converters with real component data."
author: "AIPE Labs"
---

AI coding agents like Claude Code and Codex are becoming the place where engineering
work actually happens. But when you ask them about power electronics, they work from
general knowledge — not from real device characterisation data, magnetics databases,
or validated design references.

We want to change that with something deliberately simple: **one link**.

```
https://aipel.co.uk/aipe.md
```

Paste it into your agent and ask it to read the file. It is a Markdown index of
everything we publish — semiconductor device data, magnetics and transistor databases,
converter design references, and our prototype case studies — in a format designed
for language models to navigate.

## How to use it

In Claude Code, Codex, or any agent with web access, try a prompt like:

> Read https://aipel.co.uk/aipe.md and use it to help me design a 10 kW DC-DC
> converter. Start by shortlisting SiC devices.

The agent will follow the index to the resources it needs, the same way you would
browse the site — except it can cross-reference a device datasheet against a magnetics
database in seconds.

## What's coming

This is the first step in a larger plan. The Power Electronics AI Agent we are building
goes far beyond static resources: topology exploration, loss and thermal modelling,
control synthesis, and multi-objective optimisation, operating across device, converter,
and system scales.

Follow this blog for engineering notes and progress updates, or
[get in touch](/contact/) if you want to work with us.
