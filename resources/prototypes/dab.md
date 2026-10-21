---
layout: default
title: DAB Converter Engineering Workflow
permalink: /resources/prototypes/dab/
description: Simulation-driven 10 kW dual-active-bridge engineering workflow executed with AIPE-Workflows — analytical design, real ngspice switching simulation, control baseline, waveform-informed magnetics, device screening, cooling design, Gmsh/Elmer FEM checks, FreeCAD geometry and a reproducible review package.
---

<header class="hero">
  <div class="container">
    {% include hub-breadcrumb.html category='workflows' %}
    <h1>DAB Converter Engineering Workflow</h1>
    <p class="lead">A 10 kW, 800 V to 400 V, 100 kHz dual-active-bridge designed through the AIPE workflow engine: requirements → analytical single-phase-shift design → executed ngspice switching simulation → waveform-driven magnetics, device and thermal design → Gmsh/Elmer field checks and FreeCAD geometry → Core Engineering State with evidence → review package. Thirteen tasks across seven specialist repositories in one checkpointed graph. Maturity: <strong>prototype</strong> (software, circuit-simulation, field-simulation and CAD gates executed; PCB, measurement and hardware qualification not claimed).</p>
  </div>
</header>

<section class="section"><div class="container">
  <h2>What runs today</h2>
  <div class="grid">
    <div class="card"><h3>Analytical design and control</h3><p>Exact lossless SPS model in AIPE Design Agent (<code>pea.converters.dab_sps</code>): 22.5° phase shift transfers exactly 10 kW with 35 µH and a 2:1 turns ratio; 13.68 A RMS series current; ZVS current condition met on both bridges. The SPS digital control baseline (PI current loop at 2 kHz, 2P2Z voltage loop at 300 Hz, worst phase margin 55°) is designed on the cycle-averaged plant and its plant law is checked against executed ngspice runs within 0.07 %.</p></div>
    <div class="card"><h3>Executed switching simulation</h3><p>ngspice 47 runs the generated Level 1 (ideal) model: 9 996.8 W output, 13.678 A RMS series current, 22.5000° measured phase shift, periodicity error 2·10<sup>-6</sup>; time-step convergence from T/400 to T/1600 recorded. The Level 2 behavioural model (200 ns dead time, datasheet on-resistance, Coss, body-diode fit, DC-link parasitics, RC load) reaches about 98.6 % with every switch turning on under ZVS, and its HDF5 waveform dataset feeds every downstream stage.</p></div>
    <div class="card"><h3>Magnetics, devices and cooling from the waveforms</h3><p>AIPE-Magnetics-Database designs a TDK E 70/33/32 transformer (20:10, interleaved litz, 35 W, 1.55 µH leakage) from the executed currents; AIPE-Semiconductor-Database screens the SiC records on the per-switch stresses and evaluates Wolfspeed C4MS047120K / C3M0025065K at 9.0 W / 17.4 W per device from manufacturer PLECS data; AIPE Design Agent compares natural, forced-air and liquid cooling (63 °C worst junction) and screens plate-fin heat sinks on a seeded Pareto front.</p></div>
    <div class="card"><h3>Field checks and geometry</h3><p>AIPE-Field-Simulation runs Gmsh + Elmer on the selected core window (FEM leakage 1.48 µH, 4 % below the 1-D design value) and on the knee heat-sink candidate (hotspot 59.6 °C, 9 % above the correlation), each at two mesh levels with energy checks. AIPE-CAD-Agent builds the transformer and heat sink in FreeCAD from the same Engineering State with STEP export, mass accounting and interference and clearance checks.</p></div>
    <div class="card"><h3>Evidence and review package</h3><p>Every task returns an execution envelope with tool versions, SHA-256 artifact hashes, model validity ranges and numerical checks; results enter the AIPE Core Engineering State as evidence (twelve preserved state versions, fourteen evidence records). <code>aipe-workflows report</code> writes JSON, Markdown and an AIPE-Doc styled HTML package with figures and gate statuses; <code>aipe-workflows iterate</code> records cross-module feedback loops with accept/reject decisions.</p></div>
  </div>
</div></section>

<section class="section"><div class="container">
  <h2>Install and run</h2>
  <p>Windows or Linux workstation, Python 3.10+, sibling checkouts of <a href="https://github.com/FulongLi/AIPE-Core">AIPE-Core</a>, <a href="https://github.com/FulongLi/AIPE-Registry">AIPE-Registry</a>, <a href="https://github.com/FulongLi/AIPE-Design-Agent">AIPE-Design-Agent</a>, <a href="https://github.com/FulongLi/AIPE-Simulation-Skills">AIPE-Simulation-Skills</a>, <a href="https://github.com/FulongLi/AIPE-Semiconductor-Database">AIPE-Semiconductor-Database</a>, <a href="https://github.com/FulongLi/AIPE-Magnetics-Database">AIPE-Magnetics-Database</a>, <a href="https://github.com/FulongLi/AIPE-Field-Simulation">AIPE-Field-Simulation</a>, <a href="https://github.com/FulongLi/AIPE-CAD-Agent">AIPE-CAD-Agent</a> and <a href="https://github.com/FulongLi/AIPE-Workflows">AIPE-Workflows</a>; ngspice, Gmsh, Elmer and FreeCAD from their official release channels (the doctor reports official download channels and licences for anything missing and installs nothing by itself; stages whose tool is absent are reported as blocked, never faked).</p>
<pre><code>python -m pip install -e ../AIPE-Simulation-Skills -e ../AIPE-Design-Agent -e ../AIPE-Semiconductor-Database
python -m pip install -e ../AIPE-Magnetics-Database[hdf5] -e ../AIPE-Field-Simulation -e ../AIPE-CAD-Agent -e ../AIPE-Workflows
aipe-workflows doctor --qualify          # detect and numerically qualify ngspice, KiCad, FreeCAD, Gmsh, Elmer
aipe-workflows plan examples/dab-10kw/specification.yaml --checkouts ..
aipe-workflows run  examples/dab-10kw/specification.yaml --checkouts ..
aipe-workflows verify &lt;run-id&gt;
aipe-workflows report &lt;run-id&gt;</code></pre>
  <p>In Claude Code or Codex, open AIPE-Workflows and ask: “Design and optimise a 10 kW DAB converter using AIPE, run the available simulations, and generate the engineering review package.” The agent discovers the workflow, qualifies the local tools and invokes the commands above.</p>
</div></section>

<section class="section"><div class="container">
  <h2>Example results</h2>
  <p>Reference run of 21 October 2026 (ngspice 47, Gmsh 4.15.2, Elmer 9.0, FreeCAD 1.1.4, Windows 11); the full package with envelopes, netlists, summaries, FEM case files, CAD metadata and figures is in <a href="https://github.com/FulongLi/AIPE-Workflows/tree/feat/dab-10kw-workflow/examples/dab-10kw/results">examples/dab-10kw/results</a>.</p>
  <table>
    <thead><tr><th>Stage</th><th>Executed result</th><th>Cross-check</th></tr></thead>
    <tbody>
      <tr><td>Analytic SPS vs ngspice Level 1</td><td>10 000 W vs 9 996.8 W; 13.6775 A vs 13.6779 A RMS; 22.5000° measured</td><td>5 W is the modelled resistive loss</td></tr>
      <tr><td>Level 2 behavioural ngspice</td><td>≈130 W loss, 810 V / 412 V peak device voltage, ZVS on all eight switches</td><td>capacitor energy drift corrected</td></tr>
      <tr><td>Control baseline</td><td>PM 93.6° / 60.0° (current / voltage loop), worst 55.4°</td><td>plant law vs ngspice at 10°, 22.5°, 35°: max 0.07 %</td></tr>
      <tr><td>Transformer design</td><td>E 70/33/32 N87, 20:10 litz P-S-P, 0.146 T, 35.0 W, 1.55 µH leakage</td><td>window FEM 1.48 µH (−4.4 %), two mesh levels</td></tr>
      <tr><td>Device screening</td><td>C4MS047120K 9.0 W, C3M0025065K 17.4 W per device at 125 °C</td><td>manufacturer PLECS tensors (tier A); module CBB021M12FM3 ranks first overall</td></tr>
      <tr><td>Cooling</td><td>liquid 63.0 °C, forced air 64.3 °C, natural 79.2 °C (secondary bridge, 4 devices per sink)</td><td>Stage A knee: Al 81 × 65 mm, 11 fins, 0.44 K/W, 0.28 kg</td></tr>
      <tr><td>Heat-sink FEM / CAD</td><td>hotspot 59.6 °C, 0.562 K/W; CAD sink mass 0.275 kg</td><td>correlation 0.518 K/W (+8.6 %); mass −1.3 %</td></tr>
    </tbody>
  </table>
  <p>Device parameters are manufacturer-specified datasheet or model values or labelled assumptions, not measurements; thermal and FEM film coefficients are correlation inputs, not CFD results; clearance requirements in the CAD checks are illustrative caller inputs.</p>
</div></section>

<section class="section"><div class="container">
  <h2>Not yet executed</h2>
  <p>The three KiCad boards and their ERC/DRC are produced by <a href="https://github.com/FulongLi/AIPE-PCB-Agent">AIPE-PCB-Agent</a> in its own repository and are not yet a task of the graph; CFD, manufacturer SPICE models (Level 3), laboratory measurement and hardware qualification remain separate statuses that the software never asserts. The earlier analytical teaching series remains available: <a href="{% post_url 2026-09-10-dab-converter-from-principles-to-control %}">DAB circuit, modelling and control tutorial →</a></p>
</div></section>
