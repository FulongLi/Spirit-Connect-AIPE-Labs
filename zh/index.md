---
layout: default
title: AIPE — 面向电力与能源的开放工程 Hub
lang: zh
permalink: /zh/
description: 发现、分享并运行面向电力电子与能源系统的工程数据、模型、设计与 AI 工作流——服务工程师，也服务与他们协作的 Coding Agent。
image: /images/background/sst.png
---
{%- assign hub = site.data.hub -%}
{%- assign featured = "" | split: "" -%}
{%- assign hub_count = 0 -%}
{%- for item in hub.artifacts -%}
  {%- if item.featured -%}{%- assign featured = featured | push: item -%}{%- endif -%}
  {%- if item.category != 'platform' -%}{%- assign hub_count = hub_count | plus: 1 -%}{%- endif -%}
{%- endfor -%}
{%- assign featured = featured | sort: "featured" -%}
{%- assign lesson_count = 0 -%}
{%- for candidate in site.pages -%}{%- if candidate.academy_page and candidate.lesson_status and candidate.lang == 'zh' -%}{%- assign lesson_count = lesson_count | plus: 1 -%}{%- endif -%}{%- endfor -%}
{%- assign article_count = site.posts | where: "lang", "zh" | size -%}

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

<section class="section home-explore">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">探索 AIPE</span><h2>可复用的工程产物，而不是孤立的项目。</h2></div>
      <p>每一项产物都标明类型、工程领域与成熟度，让你一眼看出哪些已经可用、哪些仍在建设中。</p>
    </div>
    <div class="hub-category-grid">
      {%- for category in hub.categories %}{% include hub-category-card.html category=category index=forloop.index lang='zh' %}{% endfor %}
    </div>
  </div>
</section>

<section class="section section-alt home-featured">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">精选产物</span><h2>从现在已有的内容开始。</h2></div>
      <p>现在就可以打开、运行并在此基础上继续构建的数据集、模型、设计、工具与实验。每张卡片都标明其成熟度。<a href="{{ '/zh/hub/' | relative_url }}">浏览完整 Hub →</a></p>
    </div>
    <div class="artifact-grid artifact-grid-feed">
      {%- for item in featured %}{% include artifact-card.html item=item compact=true lang='zh' %}{% endfor %}
    </div>
  </div>
</section>

<section class="section home-domains">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">两个发现维度</span><h2>按“它是什么”搜索，或按“用在哪里”搜索。</h2></div>
      <p>Hub 按产物类型组织，<a href="{{ '/zh/engineering/' | relative_url }}">工程领域</a> 按应用领域组织同一批产物——从半导体芯片到能源系统。空白单元格表示 Hub 尚未覆盖的地方。</p>
    </div>
    {% include domain-matrix.html lang='zh' %}
  </div>
</section>

<section class="section section-alt home-academy">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">AIPE 学院</span><h2>从基本原理到 AI 辅助工程，系统学习电力电子。</h2></div>
      <p>分阶段的课程体系与开放实验。每个阶段都标明课程处于大纲、草稿还是可用状态，尚无中文课程的阶段标为规划中。<a href="{{ '/zh/academy/' | relative_url }}">进入学院 →</a></p>
    </div>
    <ol class="home-stages">
      {%- for stage in site.data.academy.stages %}
      <li><a href="{{ '/zh/academy/#stage-' | append: stage.key | relative_url }}"><span>{{ stage.number }}</span><strong>{{ stage.title.zh }}</strong><em>{{ stage.topics.zh | join: ' · ' }}</em></a></li>
      {%- endfor %}
      <li><a href="{{ '/zh/academy/#labs' | relative_url }}"><span>实验</span><strong>开放实验</strong><em>预测 · 运行 · 对比 · 解释</em></a></li>
    </ol>
  </div>
</section>

<section class="section home-plugin" id="plugin">
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

<section class="section section-alt home-loop">
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
