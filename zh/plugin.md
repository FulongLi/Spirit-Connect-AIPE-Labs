---
layout: default
title: AIPE 插件 — 面向 Coding Agent 的工程能力
lang: zh
permalink: /zh/plugin/
description: 把 AIPE 电力工程能力带入 Codex、Claude Code 等 Coding Agent。目前通过面向智能体的 aipe.md 注册表使用；可安装的 AIPE 插件正在规划中。
image: /images/background/sst.png
---
{%- assign registry = site.data.registry.capabilities -%}
{%- assign rec_registry = registry | where: "id", "aipe.registry" | first -%}
{%- assign rec_core = registry | where: "id", "aipe.core" | first -%}
{%- assign rec_skills = registry | where: "id", "aipe.simulation-skills" | first -%}
<main class="agent-guide plugin-page">
<header class="plugin-hero">
  <div class="container">
    <span class="section-kicker">AIPE 插件 · 智能体集成</span>
    <h1>把 AIPE 工程能力带入你的 Coding Agent。</h1>
    <p class="lead">位于 Coding Agent 与 AIPE 注册表之间的一层轻量接口：为当前任务找到合适的数据、工具与技能，然后在你自己的工程项目中工作。</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#codex">在 Codex 中使用</a>
      <a class="btn btn-primary" href="#claude-code">在 Claude Code 中使用</a>
      <a class="btn btn-ghost" href="{{ '/aipe.md' | relative_url }}">查看 AIPE 注册表</a>
      <a class="btn btn-ghost" href="{{ rec_skills.repository }}" rel="noopener">GitHub 上的智能体技能 ↗</a>
    </div>
    <div class="plugin-status">
      <div>
        <span class="plugin-status-label">当前</span>
        <p><strong>通过 <code>aipe.md</code> 提供面向智能体的注册表</strong> {% include status-badge.html status='available' lang='zh' %}</p>
        <p>面向机器的 <code>aipe.json</code> 索引，以及基于 SKILL.md 的<a href="{{ '/zh/hub/tools/' | relative_url }}">仿真技能</a>。</p>
      </div>
      <div>
        <span class="plugin-status-label">下一步</span>
        <p><strong>可安装的 AIPE 插件</strong> {% include status-badge.html status='planned' lang='zh' %}</p>
        <p>设计中。目前尚未发布任何插件安装包，因此暂时没有可安装的内容。</p>
      </div>
    </div>
  </div>
</header>

<section class="section section-alt" id="now">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">现在可用 · 无需安装</span><h2>给智能体一条链接。</h2></div>
      <p><code>aipe.md</code> 是 AIPE 注册表面向智能体的公开接口，由经过校验的能力清单生成。任何能够读取网址的智能体都可以使用——无需账号、API 密钥或扩展。</p>
    </div>
    <div class="agent-link plugin-prompt">
      <code id="agent-prompt">阅读 https://aipel.co.uk/aipe.md，找到相关的 AIPE 能力，并帮助我完成电力电子任务。</code>
      <button class="copy-btn" data-copy-target="agent-prompt" data-copied-label="已复制！">复制</button>
    </div>
    <div class="plugin-agents">
      <article class="plugin-agent" id="codex">
        <span class="access-kicker">在 Codex 中使用</span>
        <h3>Codex</h3>
        <ol>
          <li>把上面的提示粘贴到 Codex，然后描述你的工程任务。</li>
          <li>如需仿真、CAD、PCB 或场分析工作流，从 <a href="{{ rec_skills.repository }}" rel="noopener">AIPE 仿真技能</a> 中复制所需的技能文件夹到你的 Codex 技能目录。</li>
          <li>按名称调用，例如 <code>$pe-ltspice-power-electronics</code>，并提供拓扑、工作范围以及你想要验证的目标。</li>
        </ol>
        <p class="plugin-note">技能安装方式以仿真技能仓库自身的说明为准。</p>
      </article>
      <article class="plugin-agent" id="claude-code">
        <span class="access-kicker">在 Claude Code 中使用</span>
        <h3>Claude Code</h3>
        <ol>
          <li>把上面的提示粘贴到 Claude Code，然后描述你的工程任务。</li>
          <li>让它阅读与你所用工具匹配的仿真技能中的 <code>SKILL.md</code>，以及相关的 <code>references/</code>。</li>
          <li>保持计算可审查：要求它说明假设、引用原始来源，并列出所做的检查。</li>
        </ol>
        <p class="plugin-note">这些技能采用相同的 <code>SKILL.md</code> 文件夹结构，但 AIPE 尚未验证把它们安装为 Claude Code 技能的流程。</p>
      </article>
    </div>
  </div>
</section>

<section class="section" id="architecture">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">架构</span><h2>保持轻量。</h2></div>
      <p>插件将负责路由、发现、加载与编排，但不会复制 AIPE 的各个仓库：每个专业仓库始终是其数据、工具与技能的事实来源。在插件发布之前，<code>aipe.md</code> 作为无需安装的后备方案承担这一层的角色。</p>
    </div>
    <ol class="plugin-stack">
      <li>
        <span class="plugin-layer">你的智能体</span>
        <div><strong>Coding Agent</strong><p>在你的项目中工作的 Codex、Claude Code 或其他智能体。</p></div>
      </li>
      <li class="plugin-stack-planned">
        <span class="plugin-layer">集成层</span>
        <div><strong>AIPE 插件</strong><p>路由 · 发现 · 能力加载 · 编排。目前由 <code>aipe.md</code> 承担。</p></div>
        {% include status-badge.html status='planned' lang='zh' %}
      </li>
      <li>
        <span class="plugin-layer">发现</span>
        <div><strong>{{ rec_registry.name }}</strong><p lang="en">{{ rec_registry.description }}</p></div>
        {% include status-badge.html status=rec_registry.maturity lang='zh' %}
      </li>
      <li>
        <span class="plugin-layer">共同工程语言</span>
        <div><strong>{{ rec_core.name }}</strong><p lang="en">{{ rec_core.description }}</p></div>
        {% include status-badge.html status=rec_core.maturity lang='zh' %}
      </li>
      <li class="plugin-stack-base">
        <span class="plugin-layer">能力</span>
        <div>
          <strong>专业仓库</strong>
          <p>
            {%- for category in site.data.hub.categories %}<a href="{{ '/zh' | append: category.url | relative_url }}">{{ category.title.zh }}</a>{% unless forloop.last %} · {% endunless %}{% endfor -%}
          </p>
        </div>
      </li>
    </ol>
  </div>
</section>

<section class="section section-alt" id="next">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">下一步 · 规划中</span><h2>可安装的 AIPE 插件。</h2></div>
      <p>拟议中的 <code>AIPE-Plugin</code> 仓库尚未创建。以下是插件设计所围绕的职责；目前都还不能以安装包形式使用。</p>
    </div>
    <div class="plugin-roles">
      <div><span>01</span><h3>路由</h3><p>识别用户项目中的工程任务，判断哪些 AIPE 能力可能有帮助。</p></div>
      <div><span>02</span><h3>发现层</h3><p>按类型、领域、成熟度与工具要求，在注册表中查询匹配的能力。</p></div>
      <div><span>03</span><h3>能力加载</h3><p>从规范仓库按固定版本加载具体的技能、工具或数据接口。</p></div>
      <div><span>04</span><h3>编排</h3><p>通过 Core 工程状态串联各项能力，使假设与证据始终可审查。</p></div>
    </div>
    <ul class="plugin-principles">
      <li>不包含任何专业仓库的副本。</li>
      <li>与网站、<code>aipe.md</code> 和 <code>aipe.json</code> 读取同一个注册表。</li>
      <li>在用户现有的项目与工具中工作。</li>
      <li>在智能体依赖某项能力之前，先说明其成熟度与局限。</li>
    </ul>
  </div>
</section>

<section class="section" id="capabilities">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">智能体现在可以使用的能力</span><h2>注册表能力。</h2></div>
      <p>由已发布的 <a href="{{ '/aipe.json' | relative_url }}">aipe.json</a> 生成，描述为英文。“集成”表示能力与 AIPE Core 的对接程度：<code>native</code>、<code>mapped</code> 或 <code>none</code>。</p>
    </div>
    <div class="plugin-table-wrap">
      <table class="plugin-table">
        <thead><tr><th scope="col">能力</th><th scope="col">类型</th><th scope="col">成熟度</th><th scope="col">集成</th><th scope="col">功能</th></tr></thead>
        <tbody>
          {%- for rec in registry %}
          <tr>
            <th scope="row"><a href="{{ rec.repository }}" rel="noopener">{{ rec.name }}</a><code>{{ rec.id }}</code></th>
            <td>{{ site.data.hub.type_labels[rec.type].zh | default: rec.type }}</td>
            <td>{% include status-badge.html status=rec.maturity lang='zh' %}</td>
            <td>{{ rec.compatibility.integration }}</td>
            <td lang="en">{{ rec.capabilities | join: ", " }}</td>
          </tr>
          {%- endfor %}
        </tbody>
      </table>
    </div>
    <div class="plugin-tools">
      <h3>{{ rec_skills.name }} 覆盖的工具</h3>
      <p>默认路径使用开源工具；商业工作流为可选项，需要各自的许可。</p>
      <ul>
        {%- for tool in rec_skills.tools %}
        <li class="plugin-tool-{{ tool.licence_class }}"><a href="{{ tool.url }}" rel="noopener">{{ tool.name }}</a><span>{{ tool.licence_class | replace: '_', ' ' }}</span></li>
        {%- endfor %}
      </ul>
    </div>
  </div>
</section>

<section class="section section-alt" id="access">
  <div class="container">
    <div class="hub-section-heading">
      <div><span class="section-kicker">同一生态，三种入口</span><h2>人、智能体与机器。</h2></div>
      <p>人浏览网站，智能体读取 <code>aipe.md</code>，脚本读取 <code>aipe.json</code>。三者都来自同一个注册表，因此对“有什么”从不会给出不一致的答案。</p>
    </div>
    {% include access-interfaces.html lang='zh' %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title-centred">常见问题</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false"><span class="faq-q-label"><code>aipe.md</code> 是什么？</span><span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>它是 AIPE 注册表面向智能体的公开接口，由经过校验的能力清单生成，列出每项能力的类型、成熟度、集成状态、许可、局限以及规范仓库。<code>aipe.json</code> 以机器可读的形式提供相同的信息。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">现在可以安装 AIPE 插件吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>还不可以。可安装的插件正在规划中，尚未发布任何安装包。目前你的智能体直接读取 <code>aipe.md</code>；单个仿真技能可按其仓库说明复制到 Codex 技能目录中使用。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">插件会打包所有 AIPE 仓库吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不会。插件的设计原则是保持轻量：它通过注册表发现能力，并从各自的规范仓库加载。数据库、工具与技能继续在各自的仓库中演进。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">哪些智能体可以使用？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>任何能够读取公开网址的智能体都可以使用 <code>aipe.md</code>，包括 Codex、Claude Code、Cursor 以及具备联网能力的自定义智能体框架。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">读取索引会把我的项目数据发送给 AIPE Labs 吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不会。读取公开索引不会把项目文件发送给 AIPE Labs。你输入第三方智能体的信息，受该服务商条款和你所在组织政策的约束。</p></div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">输出结果可以替代工程评审吗？<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>不能。每个注册表条目都说明了自身的局限。请用这些能力加速检索与分析，并对照原始数据手册、模型、标准、仿真与测量结果核实重要输出。</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section collaboration-section agent-guide-cta">
  <div class="container narrow-center">
    <h2>把 AIPE 链接交给你的智能体</h2>
    <p class="lead">
      把准备好的提示复制到 Coding Agent 中，或联系我们，探讨科研合作、工程试点以及 AIPE 插件的早期工作。
    </p>
    <div class="hero-actions">
      <button type="button" class="btn btn-primary" data-copy-target="agent-prompt" data-copied-label="已复制！">复制 AIPE 提示</button>
      <a class="btn btn-ghost" href="{{ '/zh/contact/' | relative_url }}">联系我们</a>
    </div>
  </div>
</section>
</main>
