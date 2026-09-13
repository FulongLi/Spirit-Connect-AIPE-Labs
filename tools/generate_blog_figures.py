#!/usr/bin/env python3
"""Reproducible teaching plots and functional diagrams (standard library only).

Schematics are generated separately by generate_blog_circuits.py / AIPE-Sketch.
All curves here are analytical or explicitly illustrative, never lab records.
"""
from pathlib import Path
from html import escape
import math
import textwrap

OUT = Path(__file__).resolve().parents[1] / 'assets/blog/figures'
OUT.mkdir(parents=True, exist_ok=True)
BLUE, INK, GREY = '#175d85', '#202b35', '#687581'
COLOURS = [BLUE, INK, GREY, '#929da5']


class Figure:
    def __init__(self, title, height=440):
        self.height = height
        self.items = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {height}" role="img" aria-label="{escape(title)}">',
            f'<title>{escape(title)}</title>', '<rect width="900" height="100%" fill="white"/>',
            '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8" fill="#175d85"/></marker></defs>',
            '<g font-family="Arial, sans-serif" fill="#202b35">']
        self.text(30, 35, title, 23, weight='bold')

    def text(self, x, y, value, size=18, anchor='start', color=INK, weight='normal'):
        self.items.append(f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size}" text-anchor="{anchor}" fill="{color}" font-weight="{weight}">{escape(str(value))}</text>')

    def line(self, x1, y1, x2, y2, color=GREY, width=1.6, dash='', arrow=False):
        self.items.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{color}" stroke-width="{width}"'+(f' stroke-dasharray="{dash}"' if dash else '')+(' marker-end="url(#arrow)"' if arrow else '')+'/>')

    def path(self, points, color=BLUE, width=2.8, dash=''):
        self.items.append('<polyline points="'+' '.join(f'{x:.2f},{y:.2f}' for x,y in points)+f'" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')

    def rect(self, x,y,w,h,fill='#f3f6f8',stroke='#c4cdd4'):
        self.items.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}" stroke="{stroke}"/>')

    def block(self,x,y,w,h,title,sub='',accent=False):
        self.rect(x,y,w,h, '#edf4f8' if accent else '#f7f8f9', BLUE if accent else '#bac4cc')
        self.text(x+w/2,y+h/2-(5 if sub else -6),title,20,'middle',weight='bold')
        if sub:
            for i,line in enumerate(sub.split('|')):
                self.text(x+w/2,y+h/2+19+21*i,line,17,'middle',GREY)

    def note(self, text, y=None):
        lines=textwrap.wrap(text,96)
        start=y or self.height-22-20*(len(lines)-1)
        for i,line in enumerate(lines): self.text(30,start+20*i,line,17,color=GREY)

    def save(self,name):
        (OUT/(name+'.svg')).write_text('\n'.join(self.items+['</g></svg>'])+'\n')


def chart(name,title,xlim,ylim,xlabel,ylabel,series,xticks,yticks,note,logx=False,logy=False):
    f=Figure(title,480)
    def tx(v):
        a,b=xlim
        if logx: v,a,b=math.log10(v),math.log10(a),math.log10(b)
        return 100+750*(v-a)/(b-a)
    def ty(v):
        a,b=ylim
        if logy: v,a,b=math.log10(v),math.log10(a),math.log10(b)
        return 365-260*(v-a)/(b-a)
    f.text(30,86,ylabel,18)
    for x,label in xticks:
        f.line(tx(x),105,tx(x),365,'#e4e8eb',1)
        f.text(tx(x),392,label,17,'middle')
    for y,label in yticks:
        f.line(100,ty(y),850,ty(y),'#e4e8eb',1)
        f.text(87,ty(y)+6,label,17,'end')
    f.line(100,105,100,365,INK)
    f.line(100,365,850,365,INK)
    for i,(label,points) in enumerate(series):
        f.path([(tx(x),ty(y)) for x,y in points],COLOURS[i%4],2.8,'' if i==0 else ('8 5' if i%2 else '3 4'))
        lx=340+i*145
        f.line(lx,77,lx+26,77,COLOURS[i%4],2.8,'' if i==0 else ('8 5' if i%2 else '3 4'))
        f.text(lx+33,83,label,17)
    f.text(475,426,xlabel,18,'middle')
    f.note(note)
    f.save(name)


def traces(name,title,rows,xmax,ticks,note,markers=()):
    height=125+125*len(rows)
    f=Figure(title,height)
    for idx,(label,ylim,series) in enumerate(rows):
        top=78+idx*125
        lo,hi=ylim
        tx=lambda t:120+730*t/xmax
        ty=lambda v:top+75-(v-lo)*75/(hi-lo)
        f.text(30,top+23,label,18,weight='bold')
        for val in [lo,(lo+hi)/2,hi]:
            f.line(120,ty(val),850,ty(val),'#e0e5e8',1)
            f.text(108,ty(val)+5,f'{val:g}',16,'end')
        for x,labelx in ticks:
            f.line(tx(x),top,tx(x),top+75,'#e0e5e8',1)
            if idx==len(rows)-1:f.text(tx(x),top+101,labelx,16,'middle')
        for x in markers:f.line(tx(x),top,tx(x),top+75,BLUE,1.3,'4 4')
        for i,pts in enumerate(series):f.path([(tx(t),ty(v)) for t,v in pts],COLOURS[i],2.8,'7 5' if i else '')
    f.note(note)
    f.save(name)


def sequence(name,title,steps,note):
    f=Figure(title,170+len(steps)*95)
    for i,(heading,description) in enumerate(steps):
        y=70+i*95
        f.block(45,y,265,65,heading,accent=i==0)
        f.text(345,y+28,description[0],19)
        if len(description)>1:f.text(345,y+52,description[1],17,color=GREY)
        if i<len(steps)-1:f.line(177,y+67,177,y+91,BLUE,2,arrow=True)
    f.note(note)
    f.save(name)


def sampling(a,b,n=400): return [a+(b-a)*i/n for i in range(n+1)]


# Converter switching waveforms: ideal CCM, same examples as the articles.
for kind in ['buck','boost']:
    pts=[]; pwm=[]; vl=[]; ic=[]
    for cycle in range(2):
        for tau,g,current in [(0,1,2.3),(5,1,2.7),(5,0,2.7),(10,0,2.3)]:
            t=cycle*10+tau
            pwm.append((t,g));pts.append((t,current));vl.append((t,12 if g else -12))
            ic.append((t,current-2.5 if kind=='buck' else (-1.25 if g else current-1.25)))
    traces(kind+'-waveforms',kind.capitalize()+': connect gate state, inductor slope and capacitor current',
        [('Q on',(0,1),[pwm]),('vL / V',(-12,12),[vl]),('iL / A',(2.2,2.8),[pts]),
         ('iC / A',(-1.5,1.5) if kind=='boost' else (-.3,.3),[ic])],
        20,[(0,'0'),(5,'5'),(10,'10'),(15,'15'),(20,'20 µs')],
        'Ideal steady CCM; D = 0.5, L = 150 µH, fs = 100 kHz. Small-ripple approximation.',[5,15])

ds=sampling(.25,.72)
chart('boost-linearisation','A tangent describes one operating point, not the whole converter',(.25,.72),(10,45),'Duty ratio D','Output / V',
    [('Exact CCM',[(d,12/(1-d)) for d in ds]),('Linear model',[(d,24+48*(d-.5)) for d in ds])],
    [(x,f'{x:g}') for x in [.3,.4,.5,.6,.7]],[(x,str(x)) for x in [10,20,24,30,40]],
    'Linearised at D = 0.5 and V = 24 V; input held at 12 V. Analytical curves.')

f=Figure('Feedback: compare, correct, actuate, measure',360)
f.text(26,150,'Reference',18)
f.items.append('<circle cx="170" cy="143" r="22" fill="white" stroke="#202b35" stroke-width="2"/>')
f.text(161,147,'+',20);f.text(183,179,'−',22)
f.line(110,143,146,143,BLUE,2,arrow=True)
for x,title,sub,w in [(235,'Controller','Gc(s)',155),(450,'PWM','duty / timing',145),(660,'Power stage','Gvd(s)',180)]:
    f.block(x,103,w,80,title,sub,True);f.line(x-40,143,x-5,143,BLUE,2,arrow=True)
f.line(840,143,875,143,BLUE,2,arrow=True);f.text(867,115,'vo',18)
f.line(860,143,860,267,BLUE,2)
f.block(475,230,195,70,'Sensor','H(s)')
f.line(860,267,675,267,BLUE,2,arrow=True);f.line(475,267,170,267,BLUE,2)
f.line(170,267,170,170,BLUE,2,arrow=True)
f.text(44,217,'Measured output',17,color=GREY)
f.note('All gains and signs include scaling. Delay, saturation and anti-windup belong in the implementation.')
f.save('feedback-loop')

sequence('model-levels','Choose a model for the question you are asking',[
    ('Switching model',['Resolve each on/off interval.','Use it for ripple, device stress and commutation.']),
    ('Averaged model',['Replace switching intervals by their weighted mean.','Retain large-signal energy storage and duty dependence.']),
    ('Small-signal model',['Perturb one equilibrium and keep first-order terms.','Use it for local loop gain and disturbance response.'])],
    'Averaging removes fast ripple. Linearisation is a separate approximation.')

# Core energy-transfer timing: schematic waveforms, not a magnetic design.
t=[0,.4,.4,1,1,1.4,1.4,2]
traces('buck-boost-paths','Inverting buck–boost: input and output use different intervals',[
    ('Q on',(0,1),[list(zip(t,[1,1,0,0,1,1,0,0]))]),
    ('iL / I*',(0,1.4),[[(0,.6),(.4,1.4),(1,.6),(1.4,1.4),(2,.6)]]),
    ('iin / I*',(0,1.4),[list(zip(t,[.6,1.4,0,0,.6,1.4,0,0]))]),
    ('|iD| / I*',(0,1.4),[list(zip(t,[0,0,1.4,.6,0,0,1.4,.6]))])],2,
    [(0,'0'),(.4,'D'),(1,'1'),(1.4,'1 + D'),(2,'t / Ts = 2')],
    'Illustrative CCM with D = 0.4; I* is a current scale. Output polarity is negative.')
traces('flyback-forward-timing','Flyback stores then transfers; forward transfers during the on interval',[
    ('Q on',(0,1),[[(0,1),(.4,1),(.4,0),(1,0)]]),
    ('Flyback iP',(0,1.5),[[(0,.6),(.4,1.4),(.4,0),(1,0)]]),
    ('Flyback iS',(0,1.5),[[(0,0),(.4,0),(.4,1.4),(1,.6)]]),
    ('Forward iS',(0,1.5),[[(0,.9),(.4,1.1),(.4,0),(1,0)]])],1,
    [(0,'0'),(.4,'D'),(1,'t / Ts = 1')],
    'Normalised, illustrative currents. Forward output-inductor current continues after its rectifier turns off.')

traces('forward-reset','Forward reset: use a negative volt-second interval, then leave margin',[
    ('vp / Vg',(-1,1),[[(0,1),(1/3,1),(1/3,-1),(2/3,-1),(2/3,0),(1,0)]]),
    ('im / Ipk',(0,1),[[(0,0),(1/3,1),(2/3,0),(1,0)]])],1,
    [(0,'0'),(1/3,'D = 1/3'),(2/3,'Reset ends'),(1,'t / Ts = 1')],
    'Ideal 1:1 reset winding or two-switch reset; zero-current dwell is available before the next pulse.')

traces('bridge-excitation','Double-ended excitation: the negative pulse resets the positive pulse',[
    ('Full bridge',(-1,1),[[(0,1),(.25,1),(.25,0),(.5,0),(.5,-1),(.75,-1),(.75,0),(1,0)]]),
    ('Half bridge',(-.5,.5),[[(0,.5),(.25,.5),(.25,0),(.5,0),(.5,-.5),(.75,-.5),(.75,0),(1,0)]])],1,
    [(0,'0'),(.25,'D'),(.5,'1/2'),(.75,'1/2 + D'),(1,'t / Ts = 1')],
    'Winding voltage divided by Vg; ideal intervals, D = 0.25 per pulse. Equal areas prevent flux drift.')

# LLC: plot the gain and the separate input-reactance boundary.
ln=5; xs=sampling(.42,1.5,540)
gain=lambda x,q:1/math.sqrt((1+1/ln-1/(ln*x*x))**2+q*q*(x-1/x)**2)
chart('llc-gain','LLC gain: every FHA curve crosses unity at series resonance',(.42,1.5),(0,5),'Normalised frequency fs / fr','FHA gain M',
    [('Q = 0.1',[(x,gain(x,.1)) for x in xs]),('Q = 0.396',[(x,gain(x,.396)) for x in xs]),('Q = 0.8',[(x,gain(x,.8)) for x in xs])],
    [(x,str(x)) for x in [.5,.75,1,1.25,1.5]],[(x,str(x)) for x in [0,1,2,3,4,5]],
    'Ln = 5. Analytical first-harmonic approximation; gain alone does not establish ZVS.')
react=lambda x,q:x-1/x+x*ln/(1+(x*ln*q)**2)
chart('llc-reactance','LLC: check input reactance separately from the gain peak',(.42,1.5),(-1.5,1.5),'Normalised frequency fs / fr','Im(Zin) / Z0',
    [('Q = 0.396',[(x,react(x,.396)) for x in xs]),('Zero',[(.42,0),(1.5,0)])],
    [(x,str(x)) for x in [.5,.75,1,1.25,1.5]],[(x,str(x)) for x in [-1.5,-1,0,1,1.5]],
    'Positive reactance is inductive. Correct current polarity and enough dead-time charge are also needed.')

# SST architecture and modularity, explicitly functional port diagrams.
f=Figure('Three stages, with two different DC interfaces',400)
for x,heading,sub in [(55,'AC–DC','Input current'),(350,'Isolated DC–DC','DAB modules'),(645,'DC–AC','Output voltage')]:
    f.block(x,125,200,95,heading,sub,True)
f.text(55,91,'MVAC input',19)
f.text(300,109,'Floating HVDC',17,'middle')
f.text(598,109,'Common LVDC',17,'middle')
f.text(845,91,'LVAC output',19,'end')
f.line(255,172,344,172,BLUE,2.5,arrow=True);f.line(550,172,639,172,BLUE,2.5,arrow=True)
f.line(596,173,596,270,BLUE,2.5,arrow=True)
f.block(450,278,294,58,'DC load / storage port')
f.text(449,244,'Magnetic isolation is inside stage 2',18,'middle',BLUE)
f.note('Arrows show the reference power direction. Bidirectional hardware and control can reverse it.')
f.save('sst-architecture')

f=Figure('Series AC cells, isolated DC links, parallel low-voltage outputs',480)
for i,y in enumerate([100,255]):
    f.block(95,y,210,90,f'CHB cell {i+1}','Own DC capacitor',True)
    f.block(405,y,190,90,f'DAB {i+1}','Isolation',True)
    f.line(305,y+45,397,y+45,BLUE,2.5,arrow=True)
    f.line(595,y+45,680,y+45,BLUE,2.5,arrow=True)
f.line(65,65,65,386,BLUE,2.2)
f.line(65,115,95,115,BLUE,2);f.line(65,170,95,170,BLUE,2)
f.line(65,270,95,270,BLUE,2);f.line(65,325,95,325,BLUE,2)
# Avoid suggesting a wire bypasses the cells: replace the functional left rail by segmented ports.
f.items=[s for s in f.items if 'x1="65.00" y1="65.00" x2="65.00" y2="386.00"' not in s]
f.line(65,65,65,115,BLUE,2);f.line(65,170,65,270,BLUE,2);f.line(65,325,65,386,BLUE,2)
f.line(680,145,680,300,BLUE,3.5)
f.line(680,223,714,223,BLUE,2.5,arrow=True)
f.block(722,180,145,90,'LVDC bus','Inverter / load')
f.text(65,55,'Phase',17,'middle');f.text(65,415,'Star',17,'middle')
f.text(350,230,'Local links stay separate',17,'middle')
f.note('Functional port connections for one phase, N = 2. Repeat for a, b, c; this is not a wiring schematic.')
f.save('sst-modules')

sequence('sst-control-roles','One control responsibility per energy buffer',[
    ('AFE current loops',['Shape the AC input current.','Fast inner loops track the d/q current references.']),
    ('High-side energy',['Adjust the total input active power.','Separate cell balancing controls unequal local energies.']),
    ('LVDC bus controller',['Request total DAB output power.','Allocate the request among available modules.']),
    ('Output inverter',['Stand-alone: establish voltage and frequency.','Grid-following: synchronise and track current commands.'])],
    'The controller roles shown apply to the initial forward-power, stand-alone SST mode.')

ts=sampling(0,.04)
omega=2*math.pi*50
traces('cell-energy-ripple','A single-phase cell buffers a 100 Hz power mismatch',[
    ('Power / W',(0,200),[[(t*1000,100*(1-math.cos(2*omega*t))) for t in ts],[(0,100),(40,100)]]),
    ('Cell V / V',(46,50),[[(t*1000,48-100/(2*omega*.0022*48)*math.sin(2*omega*t)) for t in ts]])],40,
    [(x,str(x)) for x in [0,10,20,30]]+[(40,'40 ms')],
    'Solid: cell input power / voltage. Dashed: constant 100 W DAB load. Small-ripple estimate, C = 2200 µF.')

traces('abc-dq','A balanced rotating sinusoid becomes a constant in aligned dq axes',[
    ('abc / peak',(-1,1),[[(t*1000,math.cos(omega*t-shift)) for t in ts] for shift in [0,2*math.pi/3,-2*math.pi/3]]),
    ('dq / peak',(-.2,1.2),[[(0,1),(40,1)],[(0,0),(40,0)]])],40,
    [(0,'0'),(10,'10'),(20,'20'),(30,'30'),(40,'40 ms')],
    'Amplitude-invariant transform; d aligned with the voltage vector. d = 1 (solid), q = 0 (dashed).')

f=Figure('dq is a rotation of coordinates, not a different circuit',410)
cx,cy=275,220
f.line(100,cy,460,cy,INK,1.8,arrow=True);f.line(cx,345,cx,65,INK,1.8,arrow=True)
f.text(470,226,'α',23);f.text(282,66,'β',23)
for angle,label,length in [(math.pi/6,'d',175),(2*math.pi/3,'q',145)]:
    x=cx+length*math.cos(angle);y=cy-length*math.sin(angle)
    f.line(cx,cy,x,y,BLUE,3,arrow=True);f.text(x+8,y-8,label,22,color=BLUE)
f.path([(cx+55*math.cos(a),cy-55*math.sin(a)) for a in sampling(0,math.pi/6,35)],GREY,1.5)
f.text(cx+65,cy-15,'θ',21)
f.block(510,115,340,80,'Stationary αβ','The vector rotates at electrical speed.')
f.block(510,235,340,80,'Synchronous dq','The axes rotate with the vector.',True)
f.note('Positive q is 90° ahead of d. Projection uses the article’s negative-sine q-row convention.')
f.save('dq-axes')

traces('magnetic-flux','Voltage sets the slope of flux density',[
    ('vp / V',(-48,48),[[(0,48),(10,48),(10,-48),(20,-48),(20,48),(30,48),(30,-48),(40,-48)]]),
    ('B / T',(-.1,.1),[[(0,-.1),(10,.1),(20,-.1),(30,.1),(40,-.1)]])],40,
    [(0,'0'),(10,'10'),(20,'20'),(30,'30'),(40,'40 µs')],
    'Analytical example: Np = 30, Ae = 80 mm², fs = 50 kHz. Equal volt-seconds give zero flux drift.')

V=48;L=20e-6;fs=50e3;K=V*V/(2*math.pi*fs*L)
phi=(math.pi-math.sqrt(math.pi**2-4*math.pi*100/K))/2
dt=phi/(2*math.pi*fs)*1e6;ip=V*phi/(2*math.pi*fs*L)
traces('dab-waveforms','DAB phase shift applies sum and difference voltages to the inductance',[
    ('v1 / V',(-48,48),[[(0,48),(10,48),(10,-48),(20,-48)]]),
    ("v2′ / V",(-48,48),[[(0,-48),(dt,-48),(dt,48),(10+dt,48),(10+dt,-48),(20,-48)]]),
    ('iσ / A',(-3,3),[[(0,-ip),(dt,ip),(10,ip),(10+dt,-ip),(20,-ip)]])],20,
    [(0,'0'),(5,'5'),(10,'10'),(15,'15'),(20,'20 µs')],
    f'Ideal matched 48 V ports, n = 1, 50 kHz, Lσ = 20 µH; φ = {phi*180/math.pi:.2f}°, P = 100 W.',[dt,10+dt])
ps=sampling(-math.pi/2,math.pi/2)
chart('dab-power','Phase shift controls signed DAB power on the monotonic branch',(-90,90),(-300,300),'Secondary lag φ / degrees','Power / W',
    [('Ideal SPS',[(p*180/math.pi,K*p*(1-abs(p)/math.pi)) for p in ps])],
    [(x,str(x)) for x in [-90,-45,0,45,90]],[(x,str(x)) for x in [-300,-150,0,150,300]],
    '48 V ports, n = 1, 50 kHz, 20 µH. Negative phase reverses power; losses and ZVS limits are omitted.')

# Device testing: each figure explains a distinct measurement or inference.
sequence('device-test-map','From a device measurement to a converter design decision',[
    ('Electrical tests',['How does the device conduct and switch?','Static curves → switching energies → parameter maps.']),
    ('Thermal tests',['Where does dissipated power become temperature rise?','Calibrated Tj → Rth and Zth → a validated thermal model.']),
    ('Reliability tests',['How does repeated or sustained stress change the device?','Matched baselines → stress histories → failure evidence.']),
    ('Lifetime estimate',['How does the measured mechanism relate to actual use?','Mission profile + life model + specimen statistics.'])],
    'Characterisation, qualification and lifetime estimation answer different questions.')
current=sampling(0,20)
chart('static-on-state','Read on-resistance from a matched-condition voltage/current measurement',(0,20),(0,1.4),'Drain current / A','On-state VDS / V',
    [('40 mΩ',[(i,.04*i) for i in current]),('64 mΩ',[(i,.064*i) for i in current])],
    [(x,str(x)) for x in [0,5,10,15,20]],[(x,str(x)) for x in [0,.4,.8,1.2]],
    'Illustrative linear curves at two specified conditions; not data for a selected device. Use Kelvin sensing.')

traces('dpt-sequence','Double-pulse timing: build current, freewheel, then measure',[
    ('Gate',(0,1),[[(0,0),(2,0),(2,1),(22,1),(22,0),(26,0),(26,1),(30,1),(30,0),(38,0)]]),
    ('iL / I*',(0,1.3),[[(0,0),(2,0),(22,1),(26,.98),(30,1.18),(38,1.1)]]),
    ('iD / I*',(0,1.3),[[(0,0),(2,0),(22,1),(22,0),(26,0),(26,.98),(30,1.18),(30,0),(38,0)]]),
    ('vDS / V*',(0,1),[[(0,1),(2,1),(2,0),(22,0),(22,1),(26,1),(26,0),(30,0),(30,1),(38,1)]])],38,
    [(2,'Start'),(22,'Off'),(26,'2nd on'),(30,'2nd off'),(38,'Time →')],
    'Idealised timing, not measured traces. iL continues during freewheel while DUT current iD is zero.',[26,30])

chart('gate-charge','Gate charge: the plateau consumes charge while drain voltage changes',(0,30),(0,12),'Accumulated gate charge / nC','Gate voltage / V',
    [('Illustrative',[(0,0),(6,4),(18,4),(30,10)])],
    [(x,str(x)) for x in [0,6,18,30]],[(x,str(x)) for x in [0,4,8,12]],
    'Here the plateau spans 12 nC. Its voltage and duration depend on current, bus voltage and the driver.')

sequence('dynamic-ron-sequence','Dynamic on-resistance needs a defined stress and a defined readout',[
    ('Off-state stress',['Set blocking voltage, temperature and duration.','Record gate bias and earlier pulse history.']),
    ('Turn on',['Commutate to the measurement current.','Allow the voltage-sensing chain to recover from high voltage.']),
    ('Timed readout',['Measure VDS and ID at the stated delay.','Compute their ratio with offsets and self-heating assessed.'])],
    'Changing the sensing delay changes the observation; a late reading can miss recoverable trapping effects.')

temps=sampling(25,125)
chart('tsep-calibration','Calibrate the thermometer before converting a voltage into temperature',(25,125),(.5,.8),'Equilibrium junction temperature / °C','TSEP voltage / V',
    [('Synthetic fit',[(t,.75-.002*(t-25)) for t in temps])],
    [(x,str(x)) for x in [25,50,75,100,125]],[(x,str(x)) for x in [.5,.6,.65,.7,.75,.8]],
    'Illustrative fixed-current calibration: 0.65 V maps to 75 °C. Device, sensing current and history must match.')

f=Figure('Thermal resistance belongs to a specified heat path',365)
for x,title,sub in [(35,'Junction','Tj'),(320,'Case','Tc'),(615,'Coolant','Tf')]:
    f.block(x,140,200,80,title,sub,True)
for x,label in [(245,'Rth,JC'),(530,'Rth,CF')]:
    f.line(x,180,x+62,180,BLUE,2.5,arrow=True);f.text(x+30,125,label,18,'middle')
f.text(445,280,'Temperature drops add only when the same heat flow passes through the path.',18,'middle')
f.note('Functional thermal path, not a universal package model. Parallel paths and boundary temperatures matter.')
f.save('thermal-path')
chart('thermal-resistance','Steady-state thermal resistance is a temperature-rise slope',(0,40),(0,60),'Dissipated power along the defined path / W','Tj − Tref / K',
    [('Rth = 1.5 K/W',[(0,0),(40,60)])],[(x,str(x)) for x in [0,10,20,30,40]],
    [(x,str(x)) for x in [0,15,30,45,60]],
    'Synthetic linear example: 30 W produces 45 K rise. Real measurements need mounting and uncertainty records.')
times=[10**x for x in sampling(-5,0)]
z=lambda t:.2*(1-math.exp(-t/.001))+.8*(1-math.exp(-t/.1))
chart('thermal-impedance','Short pulses do not reach the steady-state thermal resistance',(1e-5,1),(0,1.05),'Time after a power step / s','Zth / K/W',
    [('Two-term model',[(t,z(t)) for t in times]),('Rth = 1',[(1e-5,1),(1,1)])],
    [(1e-5,'10 µs'),(1e-4,'100 µs'),(.001,'1 ms'),(.01,'10 ms'),(.1,'100 ms'),(1,'1 s')],
    [(x,str(x)) for x in [0,.25,.5,.75,1]],
    'R = [0.2, 0.8] K/W; τ = [1, 100] ms. At 10 ms, Zth = 0.2761 K/W. Analytical, fixed boundary.',logx=True)

traces('uis-energy','UIS: the connected supply adds energy during avalanche',[
    ('iL / A',(0,10),[[(0,0),(20,10),(40,0)]]),
    ('vDS / V',(0,100),[[(0,0),(20,0),(20,100),(40,100)]]),
    ('pD / W',(0,1000),[[(0,0),(20,0),(20,1000),(40,0)]])],40,
    [(0,'0'),(20,'Turn off'),(40,'40 µs')],
    'Ideal example: L = 100 µH, VDD = 50 V, Vav = 100 V, I0 = 10 A. Avalanche integral = 10 mJ.')

tt=sampling(0,30,600)
def cycling(t):
    r=t%10;a=math.exp(-5/1.5)
    return 65+60*((1-math.exp(-r/1.5))/(1-a) if r<5 else (math.exp(-(r-5)/1.5)-a)/(1-a))
traces('active-cycling','Power cycling: record actual junction extrema, not just pulse count',[
    ('Heating',(0,1),[[(t,1 if t%10<5 else 0) for t in tt]]),
    ('Tj / °C',(60,130),[[(t,cycling(t)) for t in tt]])],30,
    [(0,'0'),(5,'5'),(10,'10'),(20,'20'),(30,'30 s')],
    'Illustrative profile: ΔTj = 60 K, midpoint = 95 °C, heating interval = 5 s. Not a qualification recipe.')

ts=sampling(0,60,1200)
def chamber(t):
    if t<5:return 20
    if t<15:return 20+8*(t-5)
    if t<35:return 100
    if t<45:return 100-8*(t-35)
    return 20
spec=20;specimen=[]
for t in ts:
    spec+=(chamber(t)-spec)*.05/3
    specimen.append((t,spec))
chart('passive-cycling','A specimen lags behind the chamber temperature programme',(0,60),(0,120),'Time / minutes','Temperature / °C',
    [('Specimen',specimen),('Chamber',[(t,chamber(t)) for t in ts])],
    [(x,str(x)) for x in [0,15,30,45,60]],[(x,str(x)) for x in [0,20,60,100,120]],
    'Illustrative first-order specimen lag, τ = 3 min. Define dwell using the required specimen condition.')

sequence('bias-test-sequence','Stress and readout are two different operating conditions',[
    ('Baseline',['Measure the initial electrical parameters.','Fix temperature, extraction method and detection limits.']),
    ('Apply stress',['Control temperature, bias, moisture and exposure time.','Log actual DUT voltage, leakage and interruptions.']),
    ('Timed readout',['Specify the delay after stress removal.','Compare like-for-like measurements and recovery behaviour.']),
    ('Explain the change',['Separate fixture effects, trapping and persistent damage.','Use physical evidence before assigning a mechanism.'])],
    'A qualification pass is limited to the stated test programme; it is not a field-life number.')

xx=sampling(0,2)
chart('weibull-life','A lifetime distribution describes variation between specimens',(0,2),(0,1),'Cycles N / characteristic life η','Failed fraction F(N)',
    [('β = 2',[(x,1-math.exp(-x*x)) for x in xx]),('β = 4',[(x,1-math.exp(-x**4)) for x in xx])],
    [(x,str(x)) for x in [0,.5,1,1.5,2]],[(0,'0'),(.1,'0.10'),(.5,'0.50'),(.6321,'0.632'),(1,'1')],
    'Synthetic Weibull curves. Both have F(η) = 63.2%; lower-tail life depends on shape as well as scale.')

f=Figure('Keep failed specimens and survivors in the reliability record',395)
f.text(130,83,'Observation time / cycles →',18)
for y,label,end,kind in [(140,'A',400,'Exact failure'),(225,'B',590,'Interval failure'),(310,'C',710,'Still operating')]:
    f.text(65,y+6,label,20,weight='bold');f.line(130,y,end,y,BLUE,3)
    if kind=='Exact failure':
        f.line(end-7,y-7,end+7,y+7,INK,2);f.line(end-7,y+7,end+7,y-7,INK,2)
    elif kind=='Interval failure':
        f.rect(520,y-15,70,30,'#edf4f8',BLUE);f.text(555,y+44,'(a, b]',17,'middle')
    else:f.line(end-20,y,end+10,y,BLUE,3,arrow=True)
    f.text(end+25,y+6,kind,18)
f.note('Right-censored survivors and interval-censored failures contribute likelihood terms; do not discard them.')
f.save('censored-observations')

# Wireless power transfer: coupling geometry, the kQ limit and the conducting-medium penalty.
MU0 = 4e-7 * math.pi


def filament_M(a, b, z, d=0.0, n=240):
    """Neumann mutual inductance of two parallel circular filaments, offset d, separation z."""
    if d == 0.0:
        total = 0.0
        for i in range(n):
            phi = 2 * math.pi * (i + .5) / n
            total += math.cos(phi) / math.sqrt(a * a + b * b + z * z - 2 * a * b * math.cos(phi))
        return MU0 * a * b / 2 * total * (2 * math.pi / n)
    total = 0.0
    for i in range(n):
        p1 = 2 * math.pi * (i + .5) / n
        ca, sa = a * math.cos(p1), a * math.sin(p1)
        for j in range(n):
            p2 = 2 * math.pi * (j + .5) / n
            dx = ca - b * math.cos(p2) - d
            dy = sa - b * math.sin(p2)
            total += math.cos(p1 - p2) / math.sqrt(dx * dx + dy * dy + z * z)
    return MU0 / (4 * math.pi) * a * b * total * (2 * math.pi / n) ** 2


def filament_L(a, r):
    """Single-turn loop self-inductance; the turns count cancels in k for identical coils."""
    return MU0 * a * (math.log(8 * a / r) - 2)


f = Figure('Wireless charging is a converter chain with an air gap inside it', 400)
for x, heading, sub in [(40, 'HF inverter', 'Square-wave drive'), (300, 'Coupled coils', 'k well below 1'),
                        (560, 'Rectifier', 'AC back to DC')]:
    f.block(x, 130, 205, 95, heading, sub, True)
f.block(790, 130, 75, 95, 'Load', '')
f.text(40, 96, 'DC input', 19)
f.line(245, 177, 294, 177, BLUE, 2.5, arrow=True)
f.line(505, 177, 554, 177, BLUE, 2.5, arrow=True)
f.line(765, 177, 784, 177, BLUE, 2.5, arrow=True)
f.text(402, 118, 'Compensation each side', 17, 'middle', BLUE)
f.block(300, 280, 205, 50, 'Feedback link', 'In-band or radio')
f.line(402, 276, 402, 232, BLUE, 2, arrow=True)
f.text(555, 300, 'The gap is the only new element; the rest', 18)
f.text(555, 324, 'is ordinary power conversion.', 18)
f.note('Functional blocks and reference power direction. Filtering, protection and control are omitted.')
f.save('wpt-chain')

a_ph, r_ph = .020, .0005
L_ph = filament_L(a_ph, r_ph)
gaps = [1 + i * .25 for i in range(77)]
chart('wpt-coupling-gap', 'Coupling falls steeply with gap at phone-coil dimensions', (1, 20), (0, .8),
      'Coil-to-coil separation / mm', 'Coupling coefficient k',
      [('20 mm radius pair', [(g, filament_M(a_ph, a_ph, g / 1000) / L_ph) for g in gaps])],
      [(x, str(x)) for x in [1, 5, 10, 15, 20]], [(x, str(x)) for x in [0, .2, .4, .6, .8]],
      'Air-cored filament pair, 20 mm mean radius, 0.5 mm conductor. Ferrite backing raises k.')

kqs = [10 ** (x / 60) for x in range(-30, 141)]
eta = lambda fom: fom * fom / (1 + math.sqrt(1 + fom * fom)) ** 2
chart('wpt-kq-efficiency', 'One number bounds a two-coil link: the kQ product', (.5, 300), (0, 1),
      'Figure of merit  kQ = k times the geometric mean of Q1 and Q2', 'Maximum coil-to-coil efficiency',
      [('Optimal load', [(x, eta(x)) for x in kqs]), ('90% line', [(.5, .9), (300, .9)])],
      [(.5, '0.5'), (1, '1'), (3, '3'), (10, '10'), (30, '30'), (100, '100'), (300, '300')],
      [(x, str(x)) for x in [0, .25, .5, .75, 1]],
      'Optimally loaded coils only; kQ near 22 reaches 90%. Converter losses are additional.', logx=True)

sequence('wpt-qi-phases', 'A Qi pad spends most of its time not transferring power', [
    ('Analogue and digital ping', ['Excite the coil briefly and look for a response.',
                                   'An unanswered ping returns the pad to standby.']),
    ('Identification and configuration', ['The receiver reports its version and requested power.',
                                          'The transmitter accepts the contract or refuses it.']),
    ('Power transfer', ['Control-error packets ask for more or less power.',
                        'The transmitter adjusts frequency, duty or rail voltage.']),
    ('Monitoring and end', ['Power-loss accounting runs continuously against the contract.',
                            'A fault, a full battery or a removed phone ends the session.'])],
    'Phase names follow the Qi specification; packet contents and timing are defined there, not here.')

a_ev, r_ev = .175, .005
L_ev = filament_L(a_ev, r_ev)
M0 = filament_M(a_ev, a_ev, .15, 0., 480)
offs = [i * 12.5 for i in range(37)]
chart('wpt-misalignment', 'Lateral offset weakens coupling, then reverses its sign', (0, 450), (-.2, 1),
      'Lateral offset between pad centres / mm', 'Mutual inductance M / M(aligned)',
      [('150 mm gap', [(d, filament_M(a_ev, a_ev, .15, d / 1000, 180) / M0) for d in offs]),
       ('Zero', [(0, 0), (450, 0)])],
      [(x, str(x)) for x in [0, 100, 200, 300, 400]], [(x, str(x)) for x in [-.2, 0, .5, 1]],
      'Air-cored 175 mm-radius filament pair at 150 mm separation; the null is a real pad feature.')

f = Figure('Ground assembly, vehicle assembly, and the checks between them', 470)
for x, heading, sub in [(40, 'Grid input', 'PFC front end'), (300, 'HF inverter', '85 kHz band'),
                        (560, 'GA network', 'Compensation + pad')]:
    f.block(x, 90, 205, 88, heading, sub, x > 100)
f.line(245, 134, 294, 134, BLUE, 2.5, arrow=True)
f.line(505, 134, 554, 134, BLUE, 2.5, arrow=True)
for x, heading, sub in [(560, 'VA network', 'Pad + compensation'), (300, 'Rectifier', 'Optional DC–DC'),
                        (40, 'Battery', 'BMS limits')]:
    f.block(x, 292, 205, 88, heading, sub, x > 100)
f.line(554, 336, 505, 336, BLUE, 2.5, arrow=True)
f.line(294, 336, 245, 336, BLUE, 2.5, arrow=True)
f.line(662, 182, 662, 288, BLUE, 3, arrow=True)
f.text(690, 240, 'Air gap 100–250 mm', 18)
f.text(690, 264, 'k roughly 0.1–0.3', 17, color=GREY)
f.rect(60, 196, 420, 78)
f.text(270, 224, 'Object and living-object detection', 19, 'middle', weight='bold')
f.text(270, 250, 'Runs before and during transfer, on the ground side', 17, 'middle', GREY)
f.note('Functional layout for unidirectional charging. Bidirectional hardware reverses the arrows; '
       'alignment, communication and safety interlocks are not optional additions.')
f.save('wpt-ev-architecture')

freqs = [10 ** (3 + x / 40) for x in range(0, 181)]
skin = lambda f_hz, sigma: 1 / math.sqrt(math.pi * f_hz * MU0 * sigma)
chart('wpt-seawater-skin', 'Seawater is conductive: the usable frequency window closes from above',
      (1e3, 1e7), (.02, 200), 'Frequency / Hz', 'Skin depth in the medium / m',
      [('Seawater 4 S/m', [(x, skin(x, 4)) for x in freqs]),
       ('Fresh 0.01 S/m', [(x, skin(x, .01)) for x in freqs])],
      [(1e3, '1 k'), (1e4, '10 k'), (1e5, '100 k'), (1e6, '1 M'), (1e7, '10 M')],
      [(.02, '0.02'), (.1, '0.1'), (1, '1'), (10, '10'), (200, '200')],
      'Non-magnetic medium. Seawater gives 0.80 m at 100 kHz; induced loss still grows with f².',
      logx=True, logy=True)

sequence('wpt-underwater-dock', 'Docked charging replaces a wet-mate connector with a controlled approach', [
    ('Homing and approach', ['Acoustic or optical guidance brings the vehicle to the cradle.',
                             'The cradle geometry, not the control loop, sets final alignment.']),
    ('Seating and gap check', ['Mechanical capture fixes separation and angle.',
                               'Measure the achieved coupling before raising power.']),
    ('Power negotiation', ['Agree voltage and current with the vehicle battery system.',
                           'Communication shares the link or uses a separate channel.']),
    ('Charge and monitor', ['Track coupler and electronics temperature through the housing.',
                            'Log coupling drift: biofouling and sediment widen the gap over months.'])],
    'A functional sequence, not a docking-system specification. Pressure, corrosion and fouling are '
    'design constraints on every stage above.')

print(f'Generated {len(list(OUT.glob("*.svg")))} total SVG assets, including circuit schematics.')
