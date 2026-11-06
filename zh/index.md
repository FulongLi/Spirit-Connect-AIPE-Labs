---
layout: default
title: AIPE — 面向电力与能源的开放工程 Hub
lang: zh
permalink: /zh/
description: 学习已确立的电力工程知识，用开放的数据、模型、设计与工具构建应用，并探索开放的研究问题——服务工程师、研究者以及与他们协作的 AI Agent。
image: /images/background/sst.png
---
{%- assign hub = site.data.hub -%}
{%- assign hub_count = 0 -%}
{%- for item in hub.artifacts -%}
  {%- if item.category != 'platform' -%}{%- assign hub_count = hub_count | plus: 1 -%}{%- endif -%}
{%- endfor -%}
{%- assign lesson_count = 0 -%}
{%- for candidate in site.pages -%}{%- if candidate.academy_page and candidate.lesson_status and candidate.lang == 'zh' -%}{%- assign lesson_count = lesson_count | plus: 1 -%}{%- endif -%}{%- endfor -%}
{%- assign article_count = site.posts | where: "lang", "zh" | size -%}
{%- assign topic_count = site.explorations | where: "lang", "zh" | size -%}

<header class="home-hub-hero">
  <div class="container">
    <span class="section-kicker">AIPE · AI for Power Engineering</span>
    <h1>面向电力与能源的开放工程 Hub。</h1>
    <p class="lead">发现、分享并运行工程数据、模型、设计与 AI 工作流。</p>
    {% include hub-search.html lang='zh' id='home' suggestions=true %}
    <dl class="home-stats">
      <div><dt>产业资源</dt><dd><a href="{{ '/zh/hub/' | relative_url }}">{{ hub_count }}</a></dd></div>
      <div><dt>学院课程</dt><dd><a href="{{ '/zh/academy/' | relative_url }}">{{ lesson_count }}</a></dd></div>
      <div><dt>工程文章</dt><dd><a href="{{ '/zh/resources/blog/' | relative_url }}">{{ article_count }}</a></dd></div>
      <div><dt>工程领域</dt><dd><a href="{{ '/zh/engineering/' | relative_url }}">{{ hub.domains.size }}</a></dd></div>
    </dl>
  </div>
</header>

<section class="section home-pillars-section">
  <div class="container">
    <div class="home-pillars-heading">
      <span class="section-kicker">一个开放平台</span>
      <h2>学习。构建。探索。</h2>
      <p><span>学习我们已知的。</span> <span>构建我们所需的。</span> <span>探索我们尚未知道的。</span></p>
    </div>
    <ol class="home-pillars" aria-label="AIPE 的三个组成部分">
      <li class="home-pillar">
        <span class="home-pillar-verb">LEARN · 学术</span>
        <h3>教育</h3>
        <p>在 AIPE 学院系统学习已确立的工程知识，从基本原理到高级电力工程。</p>
        <p class="home-pillar-fact"><strong>{{ lesson_count }}</strong> 门课程，分阶段学习路径，配有开放实验</p>
        <a class="btn btn-primary" href="{{ '/zh/academy/' | relative_url }}">进入教育 →</a>
      </li>
      <li class="home-pillar">
        <span class="home-pillar-verb">BUILD · 产业</span>
        <h3>产业</h3>
        <p>发现并使用开放的工程数据、模型、工具与工作流，构建真实应用。</p>
        <p class="home-pillar-fact"><strong>{{ hub_count }}</strong> 项产业资源，均标明成熟度</p>
        <a class="btn btn-primary" href="{{ '/zh/hub/' | relative_url }}">进入产业 →</a>
      </li>
      <li class="home-pillar">
        <span class="home-pillar-verb">EXPLORE · 学术</span>
        <h3>研究</h3>
        <p>在 AIPE 前沿研究中探索工程的未来可能：新兴概念、理论可能与非常规方法。</p>
        <p class="home-pillar-fact"><strong>{{ topic_count }}</strong> 个研究课题，均标明证据状态</p>
        <a class="btn btn-primary" href="{{ '/zh/frontiers/' | relative_url }}">进入研究 →</a>
      </li>
    </ol>
  </div>
</section>

<section class="section section-alt home-plugin" id="plugin">
  <div class="container home-plugin-layout">
    <div>
      <span class="section-kicker">AIPE 插件</span>
      <h2>在你的 Coding Agent 中使用 AIPE。</h2>
      <p class="lead">把 AIPE 的数据、工程工具、仿真技能与设计工作流带入 Codex、Claude Code 或其他 Coding Agent，在你自己的项目中直接使用。</p>
    </div>
    <div class="home-plugin-actions">
      <p><strong>现在即可使用</strong>，无需安装任何内容。<strong>下一步：</strong>可安装的 AIPE 插件。</p>
      <a class="btn btn-primary" href="{{ '/zh/plugin/' | relative_url }}">了解 AIPE 插件</a>
    </div>
  </div>
</section>

<section class="section home-loop">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">为 AI 供能的电力系统，由 AI 来设计</span><h2>连接 AI 与电力设计闭环。</h2></div>
      <p>AI 帮助工程师设计更好的电力与能源系统，而这些系统又为下一代 AI 提供能源。每一个以开放方式完成学习、设计与验证的项目，都会为下一个项目留下更好的数据、模型与设计。</p>
    </div>
    {% include design-loop.html lang='zh' %}
  </div>
</section>
