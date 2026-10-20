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
      <div><dt>Hub 产物</dt><dd><a href="{{ '/zh/hub/' | relative_url }}">{{ hub_count }}</a></dd></div>
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
        <span class="home-pillar-verb">LEARN</span>
        <h3>AIPE 学院</h3>
        <p>系统学习已确立的工程知识，从基本原理到高级电力工程。</p>
        <p class="home-pillar-fact"><strong>{{ lesson_count }}</strong> 门课程，分阶段学习路径，配有开放实验</p>
        <a class="btn btn-primary" href="{{ '/zh/academy/' | relative_url }}">进入学院 →</a>
      </li>
      <li class="home-pillar">
        <span class="home-pillar-verb">BUILD</span>
        <h3>AIPE Hub</h3>
        <p>发现并使用开放的工程数据、模型、设计、工具与工作流，构建真实应用。</p>
        <p class="home-pillar-fact"><strong>{{ hub_count }}</strong> 项 Hub 产物，均标明成熟度</p>
        <a class="btn btn-primary" href="{{ '/zh/hub/' | relative_url }}">进入 Hub →</a>
      </li>
      <li class="home-pillar">
        <span class="home-pillar-verb">EXPLORE</span>
        <h3>AIPE 前沿研究</h3>
        <p>探索工程的未来可能：新兴概念、理论可能与非常规方法。</p>
        <p class="home-pillar-fact"><strong>{{ topic_count }}</strong> 个研究课题，均标明证据状态</p>
        <a class="btn btn-primary" href="{{ '/zh/frontiers/' | relative_url }}">进入前沿研究 →</a>
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

<section class="section collaboration-section">
  <div class="container collaboration-layout">
    <div>
      <h2>开放构建，也要足够有野心</h2>
      <p class="lead">
        我们欢迎希望发布或改进产物的开发者、希望把方法与数据集转化为可复用工作流的研究者，
        以及共同打造下一代 AI 辅助电力工程的企业和战略合作伙伴。
      </p>
      <div class="hero-actions align-left">
        <a class="btn btn-primary" href="{{ '/zh/contact/' | relative_url }}">讨论合作</a>
        <a class="btn btn-ghost" href="https://github.com/AIPE-Labs" target="_blank" rel="noopener">查看开源项目 ↗</a>
      </div>
    </div>
    <div class="collaboration-list">
      <div><span>01</span><p><strong>开发者</strong><br>发布或改进数据集、模型、设计或工具，让其他工程师和他们的智能体都能找到并复用。</p></div>
      <div><span>02</span><p><strong>科研伙伴</strong><br>把方法与数据集转化为可重复、可追溯证据的工作流。</p></div>
      <div><span>03</span><p><strong>产业与战略伙伴</strong><br>用真实工程问题验证平台，并共同塑造它。</p></div>
    </div>
  </div>
</section>

<section class="section section-alt partners-section">
  <div class="container">
    <h2>合作伙伴</h2>
    <p>连接人工智能、电力电子与能源系统研究的学术和产业合作关系。</p>
    {% include partners-marquee.html %}
  </div>
</section>
