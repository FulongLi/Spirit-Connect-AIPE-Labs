# AIPE — AI for Power Engineering

Generated from validated capability manifests. Open-source first, commercial compatible.

| Capability | Type | Maturity | Integration | Canonical repository |
| --- | --- | --- | --- | --- |
| AIPE Academy (`aipe.academy`) | education | prototype | mapped | [Repository](https://github.com/FulongLi/AIPE-Academy) |
| AIPE Core (`aipe.core`) | standard | prototype | native | [Repository](https://github.com/FulongLi/AIPE-Core) |
| AIPE Design Agent (`aipe.design-agent`) | agent | prototype | mapped | [Repository](https://github.com/FulongLi/AIPE-Design-Agent) |
| AIPE IEEE Paper Agent (`aipe.ieee-paper-agent`) | agent | usable | mapped | [Repository](https://github.com/FulongLi/AIPE-IEEE-Paper-Agent) |
| AIPE Magnetics Database (`aipe.magnetics-database`) | database | scaffold | mapped | [Repository](https://github.com/FulongLi/AIPE-Magnetics-Database) |
| Open Engineering Tool Catalogue (`aipe.open-source-catalogue`) | catalogue | usable | none | [Repository](https://github.com/FulongLi/awesome-open-source-power-electronics) |
| AIPE Labs Presentation (`aipe.presentation`) | presentation | prototype | none | [Repository](https://github.com/FulongLi/Spirit-Connect-AIPE-Labs) |
| AIPE Registry (`aipe.registry`) | registry | prototype | none | [Repository](https://github.com/FulongLi/AIPE-Registry) |
| AIPE Semiconductor Database (`aipe.semiconductor-database`) | database | usable | mapped | [Repository](https://github.com/FulongLi/AIPE-Semiconductor-Database) |
| AIPE Simulation Skills (`aipe.simulation-skills`) | skill_collection | prototype | mapped | [Repository](https://github.com/FulongLi/AIPE-Simulation-Skills) |
| AIPE Sketch (`aipe.sketch`) | tool | usable | mapped | [Repository](https://github.com/FulongLi/AIPE-Sketch) |

## AIPE Academy

Original Power Engineering learning paths, with power electronics as the v0.1 curriculum.

Capabilities: guided-engineering-education, open-source-converter-labs.

Licence: `CC-BY-4.0`. Validation: `tested`.

- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: Most curriculum stages remain outlines, not completed courses.
- Limitation: The buck lab is ideal analytical teaching, not hardware validation.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Academy/blob/HEAD/README.md)
- [Documentation: docs/ecosystem-v0.1.md](https://github.com/FulongLi/AIPE-Academy/blob/HEAD/docs/ecosystem-v0.1.md)

## AIPE Core

Versioned SI Engineering State schemas, evidence conventions and semantic interoperability contracts.

Capabilities: engineering-state-schema, engineering-evidence-contracts, offline-state-validation.

Licence: `MIT`. Validation: `tested`.

- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: Schema and semantic checks do not prove engineering correctness or authenticate artifacts.
- Limitation: v0.1.0 schema URLs are logical identifiers until a release tag exists; resolve locally.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Core/blob/HEAD/README.md)
- [Documentation: docs/metadata.md](https://github.com/FulongLi/AIPE-Core/blob/HEAD/docs/metadata.md)
- [Documentation: docs/architecture-v0.1.md](https://github.com/FulongLi/AIPE-Core/blob/HEAD/docs/architecture-v0.1.md)
- [Documentation: contracts/README.md](https://github.com/FulongLi/AIPE-Core/blob/HEAD/contracts/README.md)

## AIPE Design Agent

Incrementally orchestrate evidence-linked engineering work through Core state and Registry capabilities while retaining existing PEA calculators and interfaces.

Capabilities: engineering-orchestration, operating-point-analysis, converter-concept-calculation.

Licence: `MIT`. Validation: `tested`.

- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: Technical suitability and fidelity require an explicit assessment; metadata alone is not an engineering guarantee.
- Limitation: Only a built-in nominal operating-point adapter executes through the new orchestrator; other tools remain reviewable plans.
- Limitation: Existing PEA calculator/UI APIs remain separate from the additive Core state path.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Design-Agent/blob/HEAD/README.md)
- [Documentation: docs/ecosystem-orchestration.md](https://github.com/FulongLi/AIPE-Design-Agent/blob/HEAD/docs/ecosystem-orchestration.md)
- [Documentation: pea/review/README.md](https://github.com/FulongLi/AIPE-Design-Agent/blob/HEAD/pea/review/README.md)

## AIPE IEEE Paper Agent

Evidence-linked research planning and IEEE venue-specific manuscript production.

Capabilities: research-evidence-planning, ieee-manuscript-production.

Licence: `NOASSERTION`. Validation: `tested`.

- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: Semantic Core mapping only; no automatic state converter.
- Limitation: Static checks do not verify citation truth or compile a PDF.
- Limitation: Repository-wide licence is unresolved; third-party assets retain rights.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-IEEE-Paper-Agent/blob/HEAD/README.md)
- [Documentation: docs/aipe-integration.md](https://github.com/FulongLi/AIPE-IEEE-Paper-Agent/blob/HEAD/docs/aipe-integration.md)

## AIPE Magnetics Database

Evidence-first magnetic material, geometry, winding, component, loss-model and measurement record scaffold with explicit SI units.

Capabilities: magnetics-record-schema, magnetics-data-import, magnetics-data-validation.

Licence: `NOASSERTION`. Validation: `tested`.

- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: No real manufacturer or measurement records bundled.
- Limitation: Core integration is documented mapping only; no executed Core export.
- Limitation: No field solver or measurement validation claimed.
- Limitation: Repository licence remains NOASSERTION pending owner decision.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Magnetics-Database/blob/HEAD/README.md)
- [Documentation: docs/core-integration.md](https://github.com/FulongLi/AIPE-Magnetics-Database/blob/HEAD/docs/core-integration.md)
- [Documentation: references/README.md](https://github.com/FulongLi/AIPE-Magnetics-Database/blob/HEAD/references/README.md)
- [Documentation: LICENSING.md](https://github.com/FulongLi/AIPE-Magnetics-Database/blob/HEAD/LICENSING.md)

## Open Engineering Tool Catalogue

Community-curated external engineering tools with dated maintenance, licence and automation evidence.

Capabilities: external-tool-discovery, external-tool-maintenance-audit.

Licence: `NOASSERTION`. Validation: `tested`.

- [Python](https://www.python.org/): open_source; required; interfaces: cli.
- Limitation: No external solver or MCP execution validated. Catalogue inclusion does not imply AIPE support.
- [Documentation: README.md](https://github.com/FulongLi/awesome-open-source-power-electronics/blob/HEAD/README.md)
- [Documentation: CONTRIBUTING.md](https://github.com/FulongLi/awesome-open-source-power-electronics/blob/HEAD/CONTRIBUTING.md)
- [Documentation: generated/audit.md](https://github.com/FulongLi/awesome-open-source-power-electronics/blob/HEAD/generated/audit.md)

## AIPE Labs Presentation

Jekyll presentation and stable public URLs for Registry capabilities and Academy lessons.

Capabilities: ecosystem-presentation, academy-publication.

Licence: `CC-BY-4.0`. Validation: `tested`.

- [Jekyll](https://jekyllrb.com/): open_source; required; interfaces: cli.
- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: Presentation validation does not validate engineering claims.
- Limitation: Deployment follows reviewed PR merges; no live deployment performed.
- Limitation: Registry initialization has a local-only baseline until upstream empty-repository permissions are resolved.
- [Documentation: README.md](https://github.com/FulongLi/Spirit-Connect-AIPE-Labs/blob/HEAD/README.md)
- [Documentation: docs/ecosystem-v0.1.md](https://github.com/FulongLi/Spirit-Connect-AIPE-Labs/blob/HEAD/docs/ecosystem-v0.1.md)

## AIPE Registry

Discover and validate canonical AIPE capabilities and publish reproducible machine-readable and Markdown indexes.

Capabilities: capability-discovery, capability-manifest-validation, deterministic-registry-publication.

Licence: `MIT`. Validation: `tested`.

- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: Core and Engineering State version identifiers are recognized; Registry does not transform engineering states.
- Limitation: Staging snapshots may precede upstream merge; inspect sources/snapshots.lock.json before deployment.
- Limitation: Snapshot-only checks cannot verify repository-relative documentation existence; use --checkouts for that audit.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Registry/blob/HEAD/README.md)
- [Documentation: CONTRIBUTING.md](https://github.com/FulongLi/AIPE-Registry/blob/HEAD/CONTRIBUTING.md)

## AIPE Semiconductor Database

Canonical V3 power semiconductor records with SI curves, source rights, evidence lineage and a conservative Core candidate adapter.

Capabilities: semiconductor-data, semiconductor-query, semiconductor-core-candidate-export.

Licence: `NOASSERTION`. Validation: `tested`.

- [MATLAB](https://www.mathworks.com/products/matlab.html): commercial; optional; interfaces: file.
- [PLECS](https://www.plexim.com/plecs): commercial; optional; interfaces: file.
- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- Limitation: Identity/source mapping only; detailed ratings and curves stay in V3 records.
- Limitation: Manufacturer model data is not converted into measured evidence.
- Limitation: Existing code and data rights remain NOASSERTION; see LICENSING.md.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Semiconductor-Database/blob/HEAD/README.md)
- [Documentation: docs/core-integration.md](https://github.com/FulongLi/AIPE-Semiconductor-Database/blob/HEAD/docs/core-integration.md)
- [Documentation: docs/architecture.md](https://github.com/FulongLi/AIPE-Semiconductor-Database/blob/HEAD/docs/architecture.md)
- [Documentation: LICENSING.md](https://github.com/FulongLi/AIPE-Semiconductor-Database/blob/HEAD/LICENSING.md)

## AIPE Simulation Skills

Engineering-purpose simulation, control, CAD, PCB and field-analysis skills with an open-source default and preserved optional proprietary workflows.

Capabilities: averaged-control-analysis, switching-circuit-simulation, mechanical-packaging, pcb-power-stage-review, field-analysis-problem-setup, digital-control-debugging.

Licence: `NOASSERTION`. Validation: `tested`.

- [ANSYS](https://www.ansys.com/): commercial; optional; interfaces: scripting.
- [CalculiX](https://www.calculix.de/): open_source; optional; interfaces: cli, inp.
- [COMSOL](https://www.comsol.com/): commercial; optional; interfaces: java-api, batch.
- [Elmer FEM](https://github.com/ElmerCSC/elmerfem): open_source; optional; interfaces: cli, sif.
- [FreeCAD](https://www.freecad.org/): open_source; optional; interfaces: python, cli.
- [GetDP](https://getdp.info/): open_source; optional; interfaces: cli, pro.
- [Gmsh](https://gmsh.info/): open_source; optional; interfaces: cli, python.
- [KiCad](https://www.kicad.org/): open_source; optional; interfaces: cli, ipc, python.
- [LTspice](https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html): free_proprietary; optional; interfaces: batch, netlist.
- [MATLAB / Simulink](https://www.mathworks.com/products/simulink.html): commercial; optional; interfaces: matlab, batch.
- [ngspice](https://ngspice.sourceforge.io/): open_source; optional; interfaces: cli, netlist.
- [openEMS](https://www.openems.de/): open_source; optional; interfaces: python, octave.
- [PLECS](https://www.plexim.com/plecs): commercial; optional; interfaces: scripting, xml-rpc.
- [Python](https://www.python.org/): open_source; required; interfaces: cli, python.
- [python-control](https://python-control.org/): open_source; optional; interfaces: python.
- [SIMetrix / SIMPLIS](https://www.simetrix.co.uk/): commercial; optional; interfaces: scripting, netlist.
- Limitation: Local Python numerical tests passed; ngspice requires separate installed runtime and is run in Ubuntu CI.
- Limitation: FreeCAD, KiCad, FEA solvers and MCP connectors not installed or executed.
- Limitation: No measurements or full Engineering State round-trip adapter claimed.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Simulation-Skills/blob/HEAD/README.md)
- [Documentation: docs/tool-policy.md](https://github.com/FulongLi/AIPE-Simulation-Skills/blob/HEAD/docs/tool-policy.md)
- [Documentation: docs/core-mapping.md](https://github.com/FulongLi/AIPE-Simulation-Skills/blob/HEAD/docs/core-mapping.md)
- [Documentation: skills.json](https://github.com/FulongLi/AIPE-Simulation-Skills/blob/HEAD/skills.json)
- [Documentation: docs/validation.md](https://github.com/FulongLi/AIPE-Simulation-Skills/blob/HEAD/docs/validation.md)

## AIPE Sketch

Render explicit electrical Circuit IR into connectivity-checked SVG schematic artifacts with provenance.

Capabilities: schematic-generation, circuit-connectivity-validation.

Licence: `NOASSERTION`. Validation: `tested`.

- [Inkscape](https://inkscape.org/): open_source; optional; interfaces: cli, gui.
- [Python](https://www.python.org/): open_source; required; interfaces: python, cli.
- Limitation: Explicit Circuit IR and complete Core validation are required separately; no device sizing or physical results are inferred.
- [Documentation: README.md](https://github.com/FulongLi/AIPE-Sketch/blob/HEAD/README.md)
- [Documentation: docs/engineering-state.md](https://github.com/FulongLi/AIPE-Sketch/blob/HEAD/docs/engineering-state.md)
- [Documentation: docs/architecture.md](https://github.com/FulongLi/AIPE-Sketch/blob/HEAD/docs/architecture.md)
