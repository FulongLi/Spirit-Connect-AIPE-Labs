% Boost converter teaching example: ideal CCM, resistive load.
% Dr. Fulong Li -- first draft, September 2026.
% Requires MATLAB and Control System Toolbox.
% Numerical model independently checked; native MATLAB execution pending.
clear; clc;
Vg = 12; V = 24; Pout = 30; fs = 100e3;
L = 150e-6; C = 330e-6; R = V^2/Pout;
D = 1-Vg/V; q = 1-D; I = V/(R*q);
s = tf('s');
Delta = L*C*s^2 + (L/R)*s + q^2;
Gvd = (q*V-L*I*s)/Delta;
Gvg = q/Delta;
Zo = L*s/Delta; % vo_hat = -Zo * extra_load_current_hat
f0 = q/sqrt(L*C)/(2*pi);
fz = R*q^2/L/(2*pi);
Q = R*q*sqrt(C/L);
fprintf('D=%.3f, I=%.3f A, f0=%.3f Hz, Q=%.3f, fRHP=%.3f Hz\n',D,I,f0,Q,fz);
fprintf('DC duty-to-output gain = %.3f V/duty\n',dcgain(Gvd));
figure; bode(Gvd); grid on; title('Ideal CCM duty-to-output plant');
% Small perturbations start from the physical equilibrium I, V.
deltaD = 0.005;
t = linspace(0,0.15,15001);
figure; step(deltaD*Gvd,t); grid on;
title('Output voltage perturbation for a +0.005 duty step (V)');
fprintf('Linear final delta V = %.6f V; exact = %.6f V\n', ...
    deltaD*dcgain(Gvd),Vg/(1-D-deltaD)-V);
% Intentionally slow voltage-mode baseline. Output reconstructed in volts;
% controller output in duty units: H = 1 and GPWM = 1.
Kp = 2e-4; Ki = 0.65;
Gc = Kp+Ki/s;
T = Gc*Gvd;
disp('All nominal continuous-time loop margins:'); disp(allmargin(T));
CL = feedback(T,1);
disp('Nominal closed-loop poles:'); disp(pole(CL));
assert(isstable(CL),'Nominal continuous-time loop is unstable');
figure; margin(T); grid on;
title('Nominal PI loop: inspect allmargin for every crossing');
figure; step(0.1*CL,linspace(0,0.3,30001)); grid on;
title('Output perturbation for a 0.1 V reference step');
% A small added current sink in parallel with R, not a large resistor change.
Gload = minreal(-Zo/(1+T));
figure; step(0.05*Gload,linspace(0,0.3,30001)); grid on;
title('Output perturbation for a +0.05 A load-current step');
% Nominal sampled illustration: ZOH duty hold plus one full update delay.
% Actual ADC/PWM scheduling may differ; no saturation/anti-windup here.
Ta = 1/fs;
Gcd = c2d(Gc,Ta,'tustin');
Gpd = c2d(Gvd,Ta,'zoh');
z = tf('z',Ta);
Td = Gcd*Gpd/z;
disp('Sampled loop margins (assumed one-period update delay):');
disp(allmargin(Td));
disp('Sampled closed-loop stable:'); disp(isstable(feedback(Td,1)));
% Check other operating points and tolerances separately. This script does
% not model DCM, startup, device losses, protection or physical ripple.
