#!/usr/bin/env python3
"""Generate blog schematics with AIPE-Sketch, preserving the electrical IR.

Run: python3 -B tools/generate_blog_circuits.py --sketch-root ../AIPE-Sketch
AIPE-Sketch is a development dependency; the website serves the resulting SVGs.
"""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--sketch-root', type=Path, default=ROOT.parent / 'AIPE-Sketch')
parser.add_argument('names', nargs='*')
args = parser.parse_args()
sys.dont_write_bytecode = True
sys.path.insert(0, str(args.sketch_root.resolve()))
from aipe_sketch import Netlist, Schematic  # noqa: E402
from aipe_sketch import topologies  # noqa: E402
from aipe_sketch.plan import Group, Item, Slot, LayoutPlan, ROWS_TALL  # noqa: E402


def circuit(name, parts, nets):
    n = Netlist(name)
    for ref, kind in parts.items():
        n.add(ref, kind, **({'interface': 'control'} if kind == 'terminal' else {}))
    for net, ports in nets.items():
        n.connect(net, *ports.split())
    return n


def buck_boost():
    return circuit('Inverting buck-boost: output below the common return',
        dict(V1='vsource', Q1='nmos', G1='terminal', L1='ind', D1='diode', C1='cap', R1='res', GND1='gnd'),
        dict(VIN='V1.p Q1.d', SW='Q1.s L1.a D1.k', VOUT_NEG='D1.a C1.a R1.a',
             DC_NEG='V1.n L1.b C1.b R1.b GND1.t', GATE='G1.t Q1.g'))


def capacitor_transfer(kind):
    parts = dict(V1='vsource', Q1='nmos', G1='terminal', L1='ind', L2='ind', Cs='cap', D1='diode', Co='cap', R1='res', GND1='gnd')
    nets = dict(GATE='Q1.g G1.t')
    if kind == 'cuk':
        nets.update(VIN='V1.p L1.a', A='L1.b Q1.d Cs.a', B='Cs.b D1.a L2.a',
                    VOUT_NEG='L2.b Co.a R1.a', DC_NEG='V1.n Q1.s D1.k Co.b R1.b GND1.t')
    elif kind == 'sepic':
        nets.update(VIN='V1.p L1.a', A='L1.b Q1.d Cs.a', B='Cs.b L2.a D1.a',
                    VOUT='D1.k Co.a R1.a', DC_NEG='V1.n Q1.s L2.b Co.b R1.b GND1.t')
    else:
        nets.update(VIN='V1.p Q1.d', A='Q1.s L1.a Cs.a', B='Cs.b D1.k L2.a',
                    VOUT='L2.b Co.a R1.a', DC_NEG='V1.n L1.b D1.a Co.b R1.b GND1.t')
    return circuit(kind.upper() + ' converter', parts, nets)


def flyback():
    return circuit('Flyback: separate primary and secondary returns',
        dict(V1='vsource', T1='transformer', Q1='nmos', G1='terminal', D1='diode', C1='cap', R1='res', GND1='gnd', GND2='gnd'),
        dict(VIN='V1.p T1.p1', SW='T1.p2 Q1.d', DC_NEG='V1.n Q1.s GND1.t',
             SEC='T1.s2 D1.a', VOUT='D1.k C1.a R1.a', SEC_RETURN='T1.s1 C1.b R1.b GND2.t', GATE='Q1.g G1.t'))


def dpt():
    return circuit('Double-pulse test: low-side DUT and upper freewheel diode',
        dict(V1='vsource', C1='cap', L1='ind', Q1='nmos', G1='terminal', D1='diode', GND1='gnd'),
        dict(DC_POS='V1.p C1.a L1.a D1.k', SW='L1.b D1.a Q1.d',
             DC_NEG='V1.n C1.b Q1.s GND1.t', GATE='G1.t Q1.g'))


def dab():
    data = topologies.dab().to_dict()
    n = Netlist('DAB with explicit primary-referred transfer inductance')
    for c in data['components']:
        n.add(c['ref'], c['kind'], interface=c['interface'])
    n.add('Ls', 'ind')
    for net, ports in data['nets'].items():
        n.connect(net, *[('Ls.a' if p == 'T1.p1' else p) for p in ports])
    n.connect('TRANSFER', 'Ls.b', 'T1.p1')
    return n


def forward():
    return circuit('Two-switch forward with reset diodes and separate returns',
        dict(V1='vsource', Q1='nmos', Q2='nmos', G1='terminal', G2='terminal',
             D1='diode', D2='diode', T1='transformer', D3='diode', D4='diode',
             Lo='ind', Co='cap', R1='res', GND1='gnd', GND2='gnd'),
        dict(DC_POS='V1.p Q1.d D2.k', A='Q1.s T1.p1 D1.k', B='T1.p2 Q2.d D2.a',
             DC_NEG='V1.n Q2.s D1.a GND1.t', GATE1='Q1.g G1.t', GATE2='Q2.g G2.t',
             SEC='T1.s1 D3.a', RECT='D3.k D4.k Lo.a', VOUT='Lo.b Co.a R1.a',
             SEC_RETURN='T1.s2 D4.a Co.b R1.b GND2.t'))


def llc_fha():
    return circuit('LLC first-harmonic equivalent: load referred to primary',
        dict(V1='vsource', Cr='cap', Lr='ind', Lm='ind', R1='res', GND1='gnd'),
        dict(INPUT='V1.p Cr.a', SERIES='Cr.b Lr.a', PRIMARY='Lr.b Lm.a R1.a',
             RETURN='V1.n Lm.b R1.b GND1.t'))


def wpt_ss():
    return circuit('Series-series compensated wireless link: T1 is the loosely coupled coil pair',
        dict(V1='vsource', C1='cap', T1='transformer', C2='cap', R1='res', GND1='gnd', GND2='gnd'),
        dict(INV='V1.p C1.a', PRI='C1.b T1.p1', PRI_RET='V1.n T1.p2 GND1.t',
             SEC='T1.s1 C2.a', OUT='C2.b R1.a', SEC_RET='T1.s2 R1.b GND2.t'))


def wpt_lcc():
    return circuit('Double-sided LCC compensation around the same coupled coil pair',
        dict(V1='vsource', Lf1='ind', Cf1='cap', C1='cap', T1='transformer',
             C2='cap', Cf2='cap', Lf2='ind', R1='res', GND1='gnd', GND2='gnd'),
        dict(INV='V1.p Lf1.a', A='Lf1.b Cf1.a C1.a', PRI='C1.b T1.p1',
             PRI_RET='V1.n Cf1.b T1.p2 GND1.t',
             SEC='T1.s1 C2.a', B='C2.b Cf2.a Lf2.a', OUT='Lf2.b R1.a',
             SEC_RET='T1.s2 Cf2.b R1.b GND2.t'))


def four_switch():
    return circuit('Four-switch non-inverting buck-boost: common return, distinct positive rails',
        dict(V1='vsource', C1='cap', Q1='nmos', Q2='nmos', Q3='nmos', Q4='nmos',
             G1='terminal', G2='terminal', G3='terminal', G4='terminal', L1='ind', C2='cap', R1='res', GND1='gnd'),
        dict(DC_POS='V1.p C1.a Q1.d', SW1='Q1.s Q2.d L1.a', SW2='L1.b Q3.s Q4.d',
             VOUT='Q3.d C2.a R1.a', DC_NEG='V1.n C1.b Q2.s Q4.s C2.b R1.b GND1.t',
             GATE1='Q1.g G1.t',GATE2='Q2.g G2.t',GATE3='Q3.g G3.t',GATE4='Q4.g G4.t'))


def expert_plan(name):
    """Geometric overrides for graphs beyond the current automatic catalogue.

    These use AIPE-Sketch's documented LayoutPlan API; connectivity validation
    remains enabled. No wire or symbol is hand-edited after rendering.
    """
    if name == 'four_switch':
        plan = LayoutPlan([
            Group('source','source',[Slot(Item('V1',12)),Slot(Item('C1',12))]),
            Group('inputleg','bridge',[Slot(Item('Q1',8),Item('Q2',16),Item('G1',9,dx=-4),Item('G2',17,dx=-4),Item('GND1',18))]),
            Group('inductor','filter',[Slot(Item('L1',12,rot=-90))],gap_before=10),
            Group('outputleg','bridge',[Slot(Item('Q3',8),Item('Q4',16),Item('G3',9,dx=-4),Item('G4',17,dx=-4))],gap_before=10),
            Group('load','filter',[Slot(Item('C2',12)),Slot(Item('R1',12))])])
        plan.trunks=dict(DC_POS=('h',6),VOUT=('h',6),DC_NEG=('h',18),SW1=('h',12),SW2=('h',12))
        return plan
    if name == 'cuk':
        plan = LayoutPlan([
            Group('source', 'source', [Slot(Item('V1', 12))]),
            Group('conversion', 'conversion', [Slot(Item('L1', 6, rot=-90)),
                Slot(Item('Q1', 12), Item('G1', 13, dx=-4), Item('GND1', 18)),
                Slot(Item('Cs', 6, rot=-90)), Slot(Item('D1', 12, rot=180)),
                Slot(Item('L2', 6, rot=-90))]),
            Group('load', 'filter', [Slot(Item('Co', 12)), Slot(Item('R1', 12))])])
        plan.trunks = dict(DC_NEG=('h',18), VIN=('h',6), A=('h',6), B=('h',6), VOUT_NEG=('h',6))
        return plan
    if name == 'dpt':
        plan = LayoutPlan([
            Group('source', 'source', [Slot(Item('V1',12)),Slot(Item('C1',12))]),
            Group('inductor','filter',[Slot(Item('L1',8))]),
            Group('leg','bridge',[Slot(Item('D1',8),Item('Q1',16),Item('G1',17,dx=-4),Item('GND1',18))])])
        plan.trunks = dict(DC_POS=('h',6), DC_NEG=('h',18), SW=('h',12))
        return plan
    if name == 'flyback':
        plan = LayoutPlan([
            Group('source','source',[Slot(Item('V1',12))]),
            Group('primary','conversion',[Slot(Item('Q1',16),Item('G1',17,dx=-4),Item('GND1',20))]),
            Group('isolation','isolation',[Slot(Item('T1',8))],gap_before=12),
            Group('rectifier','filter',[Slot(Item('D1',10,rot=90))],gap_before=12),
            Group('load','filter',[Slot(Item('C1',6,rot=180)),Slot(Item('R1',6,rot=180),Item('GND2',2,rot=180))])])
        plan.trunks = dict(VIN=('h',2),SW=('h',12),DC_NEG=('h',20),VOUT=('h',10),SEC_RETURN=('h',2))
        return plan
    if name == 'dab':
        from aipe_sketch.manual_topologies import dab as reference_dab
        _, plan, options = reference_dab()
        plan.groups.insert(2, Group('transfer','filter',[Slot(Item('Ls',11,rot=-90))],gap_before=12))
        plan.trunks = options['trunks']
        return plan
    if name == 'forward_2sw':
        plan = LayoutPlan([
            Group('source','source',[Slot(Item('V1',14))]),
            Group('switches','conversion',[Slot(Item('Q1',8),Item('D1',22),Item('G1',9,dx=-4)),
                Slot(Item('D2',8),Item('Q2',22),Item('G2',23,dx=-4),Item('GND1',28))],pitch=12),
            Group('isolation','isolation',[Slot(Item('T1',14))],gap_before=12),
            Group('rectifier','filter',[Slot(Item('D3',12,rot=90)),Slot(Item('D4',22),Item('GND2',28))]),
            Group('filter','filter',[Slot(Item('Lo',12,rot=-90)),Slot(Item('Co',20)),Slot(Item('R1',20))])],
            rows=dict(dc_pos=4,high=8,gate_high=9,mid=14,low=22,gate_low=23,dc_neg=28))
        plan.trunks = dict(DC_POS=('h',4),DC_NEG=('h',28),A=('h',12),B=('h',18),RECT=('h',12),VOUT=('h',12),SEC_RETURN=('h',28))
        return plan
    return None


BUILDERS = dict(buck=topologies.buck, boost=topologies.boost,
    buck_boost=buck_boost, cuk=lambda: capacitor_transfer('cuk'),
    sepic=lambda: capacitor_transfer('sepic'), zeta=lambda: capacitor_transfer('zeta'),
    flyback=flyback, forward_2sw=forward, dpt=dpt, dab=dab,
    half_bridge=topologies.half_bridge, full_bridge=topologies.full_bridge,
    three_phase=topologies.three_phase_inverter, llc_fha=llc_fha, four_switch=four_switch,
    wpt_ss=wpt_ss, wpt_lcc=wpt_lcc)
out = ROOT / 'assets/blog/figures'
ir = ROOT / 'assets/blog/circuits'
out.mkdir(parents=True, exist_ok=True)
ir.mkdir(parents=True, exist_ok=True)
manifest_path = ir / 'manifest.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
revision = subprocess.check_output(['git', '-C', str(args.sketch_root), 'rev-parse', 'HEAD'], text=True).strip()
failures = []
for name in args.names or BUILDERS:
    try:
        n = BUILDERS[name]()
        assert not n.validate(), n.validate()
        assert Netlist.from_dict(n.to_dict()).signature() == n.signature()
        sch = Schematic.from_netlist(n, plan=expert_plan(name))
        path = out / ('circuit-' + name + '.svg')
        score, repairs = sch.render(str(path))
        (ir / (name + '.json')).write_text(json.dumps(n.to_dict(), indent=2) + '\n')
        # Presentation only: responsive dimensions, accessible description, white background.
        svg = ET.parse(path)
        root = svg.getroot()
        root.set('width', '100%')
        root.attrib.pop('height', None)
        root.set('role', 'img')
        root.set('aria-label', n.name)
        root.set('style', 'background:white')
        ET.SubElement(root, '{http://www.w3.org/2000/svg}desc').text = 'Generated from electrical Circuit IR using AIPE-Sketch. See the associated article for definitions, polarities and omitted parasitics.'
        svg.write(path, encoding='unicode', xml_declaration=True)
        manifest[name] = dict(generator='AIPE-Sketch', source='https://github.com/FulongLi/AIPE-Sketch',
            revision=revision, title=n.name, connectivity_validated=True, report=str(score))
        print(name + ': generated and connectivity checked')
    except Exception as exc:
        failures.append(name)
        print(name + ': FAILED: ' + str(exc))
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
if failures:
    raise SystemExit('Failed schematics: ' + ', '.join(failures))
