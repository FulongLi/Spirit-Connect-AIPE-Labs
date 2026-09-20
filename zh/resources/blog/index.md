---
layout: default
title: 博客
lang: zh
permalink: /zh/resources/blog/
description: 来自建设 AI 辅助电力电子工具团队的工程笔记、研究进展与想法。
translation_key: blog-index
---

{% assign english_posts = site.posts | where: "lang", "en" %}
{% assign chinese_posts = site.posts | where: "lang", "zh" %}
{% assign converter_posts = english_posts | where: "converter_series", true %}
{% assign device_posts = english_posts | where: "device_testing_series", true %}
{% assign sst_posts = english_posts | where: "sst_series", true %}
{% assign wpt_posts = english_posts | where: "wpt_series", true %}
{% assign update_posts = english_posts | where_exp: "post", "post.converter_series != true and post.device_testing_series != true and post.sst_series != true and post.wpt_series != true" %}

<header class="blog-hero">
  <div class="container blog-hero-grid">
    <div>
      <span class="section-kicker">工程知识库</span>
      <h1>从第一性原理出发的工程文章。</h1>
    </div>
    <p class="lead">围绕变换器、功率半导体器件、固态变压器和无线电能传输整理的深入技术指南。</p>
  </div>
</header>

<section class="section blog-translation-intro">
  <div class="container">
    <div class="translation-status-panel">
      <div>
        <span class="translation-status-count">{{ chinese_posts.size }} / {{ english_posts.size }}</span>
        <span class="translation-status-label">篇文章已有中文版本</span>
      </div>
      <div>
        <h2>中文内容正在按系列整理</h2>
        <p>下面已经列出完整的文章体系。中文版本发布后，卡片会自动切换到中文页面；尚未完成的内容仍可直接阅读英文原文。</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt blog-library">
  <div class="container">
    <div class="blog-library-intro">
      <div>
        <span class="section-kicker">按系列浏览</span>
        <h2>完整技术文章目录</h2>
      </div>
      <p>不再用空白页隐藏现有内容；翻译进度会直接显示在每一张文章卡片上。</p>
    </div>
    <nav class="blog-series-nav" aria-label="博客系列">
      <a href="#converter-series"><strong>{{ converter_posts.size }}</strong><span>变换器设计</span></a>
      <a href="#device-series"><strong>{{ device_posts.size }}</strong><span>器件测试</span></a>
      <a href="#sst-series"><strong>{{ sst_posts.size }}</strong><span>固态变压器</span></a>
      <a href="#wpt-series"><strong>{{ wpt_posts.size }}</strong><span>无线电能传输</span></a>
      <a href="#updates"><strong>{{ update_posts.size }}</strong><span>AIPE 动态</span></a>
    </nav>

    {% include blog-series-section.html id="converter-series" kicker="01 · 从开关周期到闭环控制" title="变换器设计" description="覆盖拓扑、建模、磁性元件、控制与仿真的实用变换器指南。" posts=converter_posts lang=page.lang %}
    {% include blog-series-section.html id="device-series" kicker="02 · 看清器件真实行为" title="器件测试与可靠性" description="面向功率半导体的电气、热学与可靠性测试方法。" posts=device_posts lang=page.lang %}
    {% include blog-series-section.html id="sst-series" kicker="03 · 连接每一级能量变换" title="固态变压器" description="模块化 SST 的架构、隔离、控制与系统集成。" posts=sst_posts lang=page.lang %}
    {% include blog-series-section.html id="wpt-series" kicker="04 · 跨越气隙传输能量" title="无线电能传输" description="从手机、汽车到水下系统的耦合、补偿与系统设计。" posts=wpt_posts lang=page.lang %}
    {% include blog-series-section.html id="updates" kicker="05 · 公开建设过程" title="AIPE Labs 动态" description="记录 AIPE Labs 工具、开放资源与工程工作流的建设进展。" posts=update_posts lang=page.lang %}
  </div>
</section>
