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
{%- for candidate in site.pages -%}{%- if candidate.academy_page and candidate.lesson_status -%}{%- assign lesson_count = lesson_count | plus: 1 -%}{%- endif -%}{%- endfor -%}
{%- assign article_count = site.posts | where: "lang", "zh" | size -%}

<header class="home-hub-hero">
  <div class="container">
    <span class="section-kicker">AIPE · AI for Power Engineering</span>
    <h1>面向电力与能源的开放工程 Hub。</h1>
    <p class="lead">发现、分享并运行工程数据、模型、设计与 AI 工作流。</p>
    {% include hub-search.html lang='zh' id='home' suggestions=true %}
    <dl class="home-stats">
      <div><dt>注册表能力</dt><dd><a href="{{ '/aipe.md' | relative_url }}">{{ site.data.registry.capabilities.size }}</a></dd></div>
      <div><dt>Hub 产物</dt><dd><a href="{{ '/zh/hub/' | relative_url }}">{{ hub_count }}</a></dd></div>
      <div><dt>学院课程</dt><dd><a href="{{ '/academy/' | relative_url }}">{{ lesson_count }}</a></dd></div>
      <div><dt>工程文章</dt><dd><a href="{{ '/zh/resources/blog/' | relative_url }}">{{ article_count }}</a></dd></div>
    </dl>
  </div>
</header>

<section class="section home-explore">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">探索 AIPE</span><h2>可复用的工程产物，而不是孤立的项目。</h2></div>
      <p>每一项产物都标明类型、工程领域、成熟度与集成状态，让工程师和智能体都能判断哪些已经可用、哪些仍在建设中。</p>
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
      <p>注册表条目的成熟度、集成状态与代码仓库直接来自已发布的 <a href="{{ '/aipe.json' | relative_url }}">aipe.json</a>，没有任何手工转述。注册表描述目前为英文。<a href="{{ '/zh/hub/' | relative_url }}">浏览完整 Hub →</a></p>
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
      <p>分阶段的课程体系与开放实验。每个阶段都标明课程处于大纲、草稿还是可用状态。目前课程以英文为主，并提供 <a href="{{ '/academy/foundations/prerequisite-path-zh/' | relative_url }}">中文先修路线</a>。<a href="{{ '/academy/' | relative_url }}">进入学院 →</a></p>
    </div>
    <ol class="home-stages">
      {%- for stage in site.data.academy.stages %}
      <li><a href="{{ '/academy/#stage-' | append: stage.key | relative_url }}"><span>{{ stage.number }}</span><strong>{{ stage.title }}</strong><em>{{ stage.topics | join: ' · ' }}</em></a></li>
      {%- endfor %}
      <li><a href="{{ '/academy/#labs' | relative_url }}"><span>Lab</span><strong>Open labs</strong><em>Predict · run · compare · explain</em></a></li>
    </ol>
  </div>
</section>

<section class="section home-access" id="agent-link">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">不只服务于人</span><h2>同一个生态：人、智能体与机器三种接口。</h2></div>
      <p>网站、面向智能体的 <code>aipe.md</code> 与面向机器的 <code>aipe.json</code> 都由同一个注册表生成。现在只需给 Coding Agent 一条链接；可安装的 <a href="{{ '/zh/plugin/' | relative_url }}">AIPE 插件</a> 是下一步。</p>
    </div>
    <div class="agent-link home-agent-link">
      <code id="agent-url">https://aipel.co.uk/aipe.md</code>
      <button class="copy-btn" data-copy-target="agent-url" data-copied-label="已复制！" aria-live="polite">复制链接</button>
    </div>
    {% include access-interfaces.html lang='zh' %}
  </div>
</section>

<section class="section section-alt home-loop">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">为 AI 供能的电力系统，由 AI 来设计</span><h2>连接 AI 与电力设计闭环。</h2></div>
      <p>各专业仓库始终是事实来源。注册表让它们可被发现，Core 为它们提供共同的工程语言，而来自仿真、硬件与验证的结果再以数据形式回到 Hub。</p>
    </div>
    {% include ecosystem-loop.html lang='zh' %}
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
      <div><span>01</span><p><strong>开发者</strong><br>用 <code>aipe.yaml</code> 清单描述产物，让注册表把它呈现给人和智能体。</p></div>
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
