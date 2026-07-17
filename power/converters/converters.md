---
layout: default
title: Converters
permalink: /power/converters/
description: A structured topology library for industrial power conversion, from classical DC-DC stages to resonant, bidirectional, multilevel, and modular converters.
---

<main class="converter-library">
<header class="hero">
  <div class="container">
    <span class="badge">Topology library · growing in public</span>
    <h1>Converter Topologies</h1>
    <p class="lead">
      A structured reference for industrial power conversion — from buck, boost, and flyback
      stages to LLC, DAB, multilevel converters, MMCs, and solid-state transformers.
    </p>
  </div>
</header>

<section class="section section-alt">
  <div class="container">
    <span class="section-badge">TOPOLOGY MAP</span>
    <h2>Navigate by conversion interface</h2>
    <p class="lead">
      The primary classification follows the electrical interface. Isolation, bidirectional
      operation, soft switching, phase count, and modularity then narrow the design space.
    </p>
    <div class="grid">
      <a class="card post-card" href="#dc-dc">
        <span class="small">DC → DC</span>
        <h3>DC–DC conversion</h3>
        <p>Non-isolated, isolated, resonant, interleaved, and bidirectional power stages.</p>
        <span class="post-card-more">Explore topologies ↓</span>
      </a>
      <a class="card post-card" href="#ac-dc">
        <span class="small">AC → DC</span>
        <h3>Rectifiers &amp; PFC</h3>
        <p>Passive rectifiers, boost-derived PFC, totem-pole, Vienna, and active front ends.</p>
        <span class="post-card-more">Explore topologies ↓</span>
      </a>
      <a class="card post-card" href="#dc-ac">
        <span class="small">DC → AC</span>
        <h3>Inverters</h3>
        <p>Single- and three-phase bridges, voltage-source inverters, and multilevel families.</p>
        <span class="post-card-more">Explore topologies ↓</span>
      </a>
      <a class="card post-card" href="#ac-ac">
        <span class="small">AC → AC</span>
        <h3>AC–AC conversion</h3>
        <p>Back-to-back conversion, AC controllers, cycloconverters, and matrix converters.</p>
        <span class="post-card-more">Explore topologies ↓</span>
      </a>
      <a class="card post-card" href="#modular">
        <span class="small">CELLS → SYSTEM</span>
        <h3>Modular &amp; multistage</h3>
        <p>Parallel phases, cascaded cells, MMCs, and solid-state transformer architectures.</p>
        <span class="post-card-more">Explore architectures ↓</span>
      </a>
    </div>
  </div>
</section>

<section class="section" id="dc-dc">
  <div class="container">
    <span class="section-badge">DC–DC</span>
    <h2>DC–DC Converter Families</h2>
    <p class="lead">
      DC–DC stages regulate a DC bus, adapt voltage, provide galvanic isolation, or move energy
      bidirectionally between sources, storage, loads, and intermediate buses.
    </p>
    <div class="grid grid-four">
      <div class="card">
        <h3>Non-isolated fundamentals</h3>
        <p><strong>Buck</strong> · step-down conversion and point-of-load regulation.</p>
        <p><strong>Boost</strong> · step-up conversion, renewable interfaces, and PFC building blocks.</p>
        <p><strong>Buck–boost</strong> · inverting or non-inverting conversion when the input crosses the output range.</p>
        <p><strong>SEPIC, Ćuk &amp; Zeta</strong> · extended step-up/down families with different ripple and polarity characteristics.</p>
      </div>
      <div class="card">
        <h3>Interleaved &amp; bidirectional</h3>
        <p><strong>Synchronous buck/boost</strong> · reduced conduction loss at low voltage and high current.</p>
        <p><strong>Multiphase buck</strong> · parallel phases for current sharing and lower output ripple.</p>
        <p><strong>Interleaved boost or buck–boost</strong> · higher power with reduced input and output ripple.</p>
        <p><strong>Bidirectional buck–boost</strong> · battery, supercapacitor, and DC-bus energy exchange.</p>
      </div>
      <div class="card">
        <h3>Isolated PWM converters</h3>
        <p><strong>Flyback</strong> · simple isolated conversion for auxiliary and lower-power supplies.</p>
        <p><strong>Forward &amp; active-clamp forward</strong> · transformer-isolated transfer with an output inductor.</p>
        <p><strong>Push–pull &amp; half-bridge</strong> · double-ended transformer excitation for higher utilisation.</p>
        <p><strong>Full-bridge &amp; PSFB</strong> · higher-power isolated conversion with phase-shift control and soft-switching potential.</p>
      </div>
      <div class="card">
        <h3>Resonant &amp; active-bridge</h3>
        <p><strong>Series and parallel resonant</strong> · resonant-tank families for soft commutation.</p>
        <p><strong>LLC</strong> · high-efficiency isolated conversion around a designed resonant operating range.</p>
        <p><strong>CLLC</strong> · bidirectional resonant conversion with active bridges on both sides.</p>
        <p><strong>Dual active bridge (DAB)</strong> · isolated bidirectional power transfer using phase shift between two active bridges.</p>
        <p class="card-link"><a href="{{ '/resources/prototypes/dab/' | relative_url }}" class="text-link">DAB design reference →</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="ac-dc">
  <div class="container">
    <span class="section-badge">AC–DC</span>
    <h2>Rectifier and PFC Families</h2>
    <p class="lead">
      AC–DC selection depends on phase count, power factor, harmonic limits, DC-link voltage,
      bidirectional power flow, semiconductor stress, and the required efficiency.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Passive &amp; controlled rectifiers</h3>
        <p><strong>Single-phase diode bridge</strong> · robust front end for lower-power and cost-sensitive systems.</p>
        <p><strong>Three-phase six-pulse bridge</strong> · classical industrial rectification for drives and DC links.</p>
        <p><strong>Thyristor rectifier</strong> · controlled high-power conversion where line commutation is acceptable.</p>
      </div>
      <div class="card">
        <h3>Single-phase PFC</h3>
        <p><strong>Boost PFC</strong> · established active power-factor-correction stage.</p>
        <p><strong>Interleaved boost PFC</strong> · shares current across phases and reduces ripple at higher power.</p>
        <p><strong>Bridgeless / totem-pole PFC</strong> · removes bridge conduction loss for high-efficiency front ends.</p>
      </div>
      <div class="card">
        <h3>Three-phase active front ends</h3>
        <p><strong>Vienna rectifier</strong> · unidirectional three-level PFC with reduced device voltage stress.</p>
        <p><strong>Two-level active front end</strong> · controlled grid current and bidirectional power flow.</p>
        <p><strong>Three-level NPC, ANPC &amp; T-type AFE</strong> · multilevel front ends for higher voltage and improved waveform quality.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="dc-ac">
  <div class="container">
    <span class="section-badge">DC–AC</span>
    <h2>Inverter Families</h2>
    <p class="lead">
      Inverters connect DC sources and buses to motors, grids, uninterruptible power supplies,
      renewable generation, and controlled AC loads.
    </p>
    <div class="grid">
      <div class="card">
        <h3>Bridge inverters</h3>
        <p><strong>Single-phase half-bridge</strong> · compact conversion with a split DC link.</p>
        <p><strong>Single-phase H-bridge</strong> · bipolar or unipolar modulation for full DC-bus utilisation.</p>
        <p><strong>Three-phase two-level VSI</strong> · the standard voltage-source stage for drives and grid converters.</p>
      </div>
      <div class="card">
        <h3>Three-level &amp; multilevel</h3>
        <p><strong>NPC and ANPC</strong> · clamped multilevel conversion with lower device voltage stress.</p>
        <p><strong>T-type</strong> · three-level conversion with a different conduction-path trade-off.</p>
        <p><strong>Flying-capacitor</strong> · additional voltage levels using controlled capacitor voltages.</p>
        <p><strong>Cascaded H-bridge (CHB)</strong> · series-connected converter cells for modular voltage scaling.</p>
      </div>
      <div class="card">
        <h3>Specialised inverter families</h3>
        <p><strong>Current-source inverter (CSI)</strong> · current-fed conversion for selected drive and grid applications.</p>
        <p><strong>Z-source and quasi-Z-source</strong> · impedance networks that add shoot-through tolerance and buck–boost capability.</p>
        <p><strong>Parallel and interleaved inverters</strong> · scalable current capacity with coordinated modulation and current sharing.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="ac-ac">
  <div class="container">
    <span class="section-badge">AC–AC</span>
    <h2>AC–AC Converter Families</h2>
    <p class="lead">
      AC–AC systems change voltage, frequency, phase, or power flow either directly or through
      an intermediate DC link.
    </p>
    <div class="grid grid-two">
      <div class="card">
        <h3>Indirect conversion</h3>
        <p><strong>Rectifier–DC link–inverter</strong> · the established architecture for variable-speed drives, UPS systems, and grid interfaces.</p>
        <p><strong>Back-to-back active converters</strong> · bidirectional AC–DC–AC conversion with a controlled DC link.</p>
      </div>
      <div class="card">
        <h3>Direct conversion</h3>
        <p><strong>AC voltage controller</strong> · phase-angle or integral-cycle control for heating, lighting, and soft starting.</p>
        <p><strong>Cycloconverter</strong> · direct low-frequency conversion for very-high-power drives.</p>
        <p><strong>Matrix converter</strong> · bidirectional switch matrix without a large DC-link energy store.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="modular">
  <div class="container">
    <span class="section-badge">MODULAR &amp; MULTISTAGE</span>
    <h2>From Converter Cells to Power Systems</h2>
    <p class="lead">
      High-power and medium-voltage systems are often built by coordinating repeated converter
      cells rather than scaling a single switching stage indefinitely.
    </p>
    <div class="grid grid-four">
      <div class="card">
        <h3>Parallel &amp; interleaved stages</h3>
        <p>Parallel converter legs or complete modules increase current capacity. Their design adds current sharing, phase interleaving, circulating-current control, phase shedding, and fault-management constraints.</p>
      </div>
      <div class="card">
        <h3>Cascaded H-bridge (CHB)</h3>
        <p>Series-connected H-bridge cells synthesise a multilevel waveform and distribute the total voltage across modules. Cell-voltage balancing and isolated or independent DC sources become central design questions.</p>
      </div>
      <div class="card">
        <h3>Modular multilevel converter (MMC)</h3>
        <p>Half-bridge or full-bridge submodules are inserted and bypassed within converter arms. Modulation, capacitor-energy balancing, circulating current, and distributed control shape the complete design.</p>
      </div>
      <div class="card">
        <h3>Solid-state transformer (SST)</h3>
        <p>An SST is a multistage architecture rather than a single topology. It can combine an active or cascaded medium-voltage front end, isolated DAB or CLLC cells, DC links, and a low-voltage inverter.</p>
        <p class="card-link"><a href="{{ '/resources/prototypes/sst/' | relative_url }}" class="text-link">SST design reference →</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <span class="section-badge">AGENT-READABLE ENGINEERING DATA</span>
    <h2>What Each Topology Reference Will Contain</h2>
    <p class="lead">
      This page is the map. As the library grows, each topology will gain structured engineering
      material that a developer or coding agent can use to constrain, compare, and verify a design.
    </p>
    <div class="grid grid-four">
      <div class="card">
        <h3>Design envelope</h3>
        <p>Input and output ranges, power level, conversion ratio, isolation, direction of power flow, operating modes, and representative applications.</p>
      </div>
      <div class="card">
        <h3>Models &amp; equations</h3>
        <p>Steady-state gain, current and voltage stress, ripple, soft-switching boundaries, small-signal behaviour, and documented assumptions.</p>
      </div>
      <div class="card">
        <h3>Implementation constraints</h3>
        <p>Semiconductor selection, magnetics and filters, capacitors, thermal limits, EMI, modulation, sensing, protection, and control structure.</p>
      </div>
      <div class="card">
        <h3>Evidence &amp; validation</h3>
        <p>Simulation models, reference designs, test data, efficiency maps, loss breakdowns, BOM context, and links to the original sources.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <span class="section-badge">STARTING REFERENCES</span>
    <h2>Current Design References</h2>
    <p class="lead">
      These early references show how topology, devices, magnetics, modulation, and system
      requirements can be connected in one design workflow.
    </p>
    <div class="grid grid-two">
      <a class="card post-card" href="{{ '/resources/prototypes/dab/' | relative_url }}">
        <span class="small">ISOLATED BIDIRECTIONAL DC–DC</span>
        <h3>Dual Active Bridge Converter</h3>
        <p>A 2&nbsp;kW DAB reference covering switching devices, high-frequency magnetics, phase-shift control, and design optimisation.</p>
        <span class="post-card-more">Open design reference →</span>
      </a>
      <a class="card post-card" href="{{ '/resources/prototypes/sst/' | relative_url }}">
        <span class="small">MODULAR MULTISTAGE SYSTEM</span>
        <h3>Solid-State Transformer</h3>
        <p>A modular SST reference connecting cell-level power conversion with system integration and coordinated control.</p>
        <span class="post-card-more">Open design reference →</span>
      </a>
    </div>
    <div class="hero-actions section-actions">
      <a class="btn btn-primary" href="{{ '/aipe.md' | relative_url }}">Open the AIPE index</a>
      <a class="btn btn-ghost" href="{{ '/database/transistors/' | relative_url }}">Transistor database</a>
      <a class="btn btn-ghost" href="{{ '/database/magnetics/' | relative_url }}">Magnetics database</a>
    </div>
  </div>
</section>
</main>
