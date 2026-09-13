---
layout: default
title: Resources
permalink: /resources/
description: The AIPE capability stack — engineering knowledge, databases, tools, specialist agents, workflows, and design references for power engineering.
---

<header class="hero hero-compact">
  <div class="container">
    <h1>Resources</h1>
    <p class="lead">
      Everything AIPE publishes, arranged the way the platform is built:
      knowledge and data underneath, tools and agents on top, workflows to join
      them, and design references to show the result.
    </p>
  </div>
</header>

<section class="section">
  <div class="container">
    <h2>How the layers fit together</h2>
    <p class="lead section-lead-spaced">
      Each layer has a different job. Keeping them separate is what lets an
      engineering task be assembled from parts instead of being rebuilt each time.
    </p>
    <ol class="layer-list">
      <li><strong>Knowledge</strong> — engineering explanation, design equations, testing methodology and standards, organised by domain.</li>
      <li><strong>Databases</strong> — the same engineering reality as machine-readable data: curves, surfaces, loss models and thermal networks with their measurement conditions.</li>
      <li><strong>Tools</strong> — one bounded operation each: input, operation, output.</li>
      <li><strong>Agents</strong> — specialist reasoning that reads knowledge, queries databases, calls tools, and judges the result.</li>
      <li><strong>Workflows</strong> — a complete engineering task assembled from the layers above.</li>
      <li><strong>Design references</strong> — worked examples showing what the combination actually produces.</li>
    </ol>
    <p class="small reference-note">
      Every entry below carries its maturity. <em>Available</em> means usable now;
      <em>experimental</em> means early and liable to change; <em>documented</em>
      means it is written up as engineering reference material rather than
      offered as an executable capability.
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Knowledge</h2>
    <p class="lead">Organised across four engineering domains, from the switch to the network.</p>
    {% include domain-cards.html %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Databases</h2>
    <p class="lead">
      Foundational engineering data. Databases are not a miscellaneous
      resource — they are what tools, agents and workflows query to turn a
      requirement into a number.
    </p>
    {% include resource-cards.html items=site.data.resources.databases %}
    <p><a class="text-link" href="{{ '/resources/databases/' | relative_url }}">Browse the database catalogue →</a></p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Tools</h2>
    <p class="lead">A tool performs one well-defined engineering operation and returns a result you can check.</p>
    {% include resource-cards.html items=site.data.resources.tools %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Agents</h2>
    <p class="lead">
      Specialist engineering roles — device selection, magnetics, control,
      thermal, validation, documentation — that coordinate knowledge, data and tools.
    </p>
    {% include resource-cards.html items=site.data.resources.agents %}
    <p class="small reference-note">
      No AIPE specialist agent is published yet. In the meantime, your own coding agent can read
      the capability index at <a href="{{ '/aipe.md' | relative_url }}"><code>aipe.md</code></a> —
      see <a href="{{ '/plugin/' | relative_url }}">how to use it</a> — and work with the
      knowledge, data and design references published here.
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2>Workflows</h2>
    <p class="lead">
      A workflow joins the layers into a complete engineering task: requirement,
      topology, component selection, magnetics, modelling, control, simulation,
      thermal, build and validation.
    </p>
    {% include resource-cards.html items=site.data.resources.workflows %}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Design references</h2>
    <p class="lead">Worked engineering examples produced with AIPE capabilities.</p>
    {% include resource-cards.html items=site.data.resources.design_references %}
    <p><a class="text-link" href="{{ '/resources/design-references/' | relative_url }}">All design references →</a></p>
  </div>
</section>

<section class="section section-alt">
  <div class="container narrow-center">
    <h2>Engineering notes</h2>
    <p class="lead">
      The derivations, measurements and teaching series behind the resources
      above — converter topologies, device characterisation, magnetics and
      system integration.
    </p>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/resources/blog/' | relative_url }}">Read the engineering notes</a>
      <a class="btn btn-ghost" href="{{ '/contact/' | relative_url }}">Contribute a resource</a>
    </div>
  </div>
</section>
