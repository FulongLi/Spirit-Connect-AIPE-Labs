---
layout: default
title: FAQ
permalink: /company/faq/
description: Frequently asked questions about AIPE Labs, aipe.md, coding-agent access, open-source resources, engineering use, and collaboration.
---

<header class="hero hero-compact">
  <div class="container">
    <h1>Questions about AIPE Labs</h1>
    <p class="lead">How the open resource index works, what is available today, and how developers, researchers, and companies can take part.</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What is AIPE Labs?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>AIPE Labs is an open power electronics initiative developed by Spirit Connect. It brings together engineering knowledge, machine-readable databases, tools, workflows and design references so developers and engineers can use them through the coding agents they already work with. Specialist AIPE agents are part of the platform model but none is published yet. The longer-term goal is an AI-assisted engineering platform that can reason across the device, magnetics, converter and system domains.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What is aipe.md?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p><code>aipe.md</code> is a public Markdown index written for AI agents. It describes what AIPE Labs currently publishes — knowledge, databases, tools, agents, workflows and design references — and links the agent to the relevant page or repository, with a maturity status on every entry. It is the entry point to the ecosystem, not a model or application by itself.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">How do I use it with Claude or Codex?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Paste <strong>https://aipel.co.uk/aipe.md</strong> into a coding agent that can access the web and ask it to read the index before describing your task. For example: “Read this AIPE Labs index, find the relevant resources, and help me plan a magnetic finite-element analysis.” You do not need an AIPE Labs account or API key to read the public index.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Is there anything to install?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. There is no browser extension, plugin or software package to install: your coding agent reads <code>aipe.md</code> and follows the published links. The page lives at <code>/plugin/</code> for historical reasons; the navigation calls it “For coding agents”. More deeply integrated skills and agents may be added as the project develops.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Which AI agents can use AIPE Labs?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Any coding agent that can retrieve a public URL can use the index. This includes tools such as Claude, Codex, Cursor, and agent frameworks with web access. The exact behaviour depends on the capabilities and permissions of the agent you are using.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What kinds of engineering work does the ecosystem cover?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>The scope includes power semiconductor devices, electrical and thermal characterisation, lifetime and reliability testing, magnetics, converter simulation and control, finite-element analysis, microgrids, photovoltaic and energy-storage systems, optimisation, sensing, and validation. Coverage varies by topic and continues to grow as new resources are published.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What is available now, and what is still being built?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>The public <code>aipe.md</code> index and the resources it currently links to are available now. Engineering knowledge and the databases are the most developed layers; tools are early; no AIPE specialist agent is published; and the workflows are documented rather than executable. Every entry on <a href="{{ '/resources/' | relative_url }}">the capability stack</a> and in <code>aipe.md</code> carries a status, so published work is never presented as more than it is.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Can AIPE Labs replace engineering review or physical validation?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>No. AIPE Labs is intended to help engineers discover resources, organise analysis, automate repeatable work, and evaluate design options. Outputs should still be checked against original datasheets, models, simulations, applicable standards, and laboratory measurements—especially for safety-critical or production decisions.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Is AIPE Labs free and open source?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>The public index is free to access, and many linked tools and resources are openly published. Each repository, dataset, or package may have its own licence and usage terms, so users should check the relevant source. Commercial engineering work, private pilots, and deeper integrations are discussed separately.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">What happens to confidential information?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Reading the public AIPE index does not require you to send project data to AIPE Labs. Information you enter into a third-party coding agent is handled under that provider's terms, so do not paste confidential material unless your organisation has approved the workflow. For direct research or industry projects, confidentiality, data handling, deployment, and intellectual-property requirements can be agreed for the specific collaboration.</p></div></div>
      </div>

      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">How can I contribute or collaborate?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>Developers can explore the linked GitHub work, test resources, report issues, or contribute tools and examples. Universities and companies can work with us on datasets, device testing and modelling, simulation and validation workflows, engineering pilots, or strategic development. Use the <a href="{{ '/contact/' | relative_url }}">contact page</a> to introduce the problem or collaboration you have in mind.</p></div></div>
      </div>
    </div>
  </div>
</section>
