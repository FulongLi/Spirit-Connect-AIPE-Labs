% Inverting buck-boost teaching example: ideal CCM, resistive load.
% Dr. Fulong Li -- first draft, September 2026.
% Requires MATLAB and Control System Toolbox.
% Numerical model independently checked; native MATLAB execution pending.
% Magnitude convention: V is the OUTPUT MAGNITUDE (the real output is -V).
clear; clc;
Vg = 12; V = 12; Pout = 30; fs = 100e3;
L = 150e-6; C = 330e-6; R = V^2/Pout;
D = V/(V+Vg); Dp = 1-D;
Io = V/R; I = Io/Dp;   % inductor carries input PLUS output current
s = tf('s');
Gd0 = V/(D*Dp);             % DC duty-to-output gain
w0  = Dp/sqrt(L*C);         % resonance moves with operating point
Q   = Dp*R*sqrt(C/L);
wz  = Dp^2*R/(D*L);         % right-half-plane zero
Gvd = Gd0*(1-s/wz)/(1+s/(Q*w0)+s^2/w0^2);
fprintf('D=%.3f, IL=%.3f A, Iin=%.3f A, Io=%.3f A\n',D,I,D*I,Io);
fprintf('f0=%.2f Hz, Q=%.3f, fz_RHP=%.2f Hz, Gd0=%.2f V/duty\n', ...
    w0/2/pi,Q,wz/2/pi,Gd0);
fprintf('Resonant peak |Gvd(f0)| = %.1f (%.1f dB)\n',Gd0*Q,20*log10(Gd0*Q));
figure; bode(Gvd); grid on;
title('Ideal CCM duty-to-output plant (note the RHP zero)');
% Inverse response: the output first moves the WRONG way after a duty step.
deltaD = 0.005;
figure; step(deltaD*Gvd,linspace(0,0.05,5001)); grid on;
title('Output magnitude perturbation for a +0.005 duty step (V)');
fprintf('Linear final delta V = %.6f V; exact = %.6f V\n', ...
    deltaD*dcgain(Gvd), (D+deltaD)*Vg/(1-D-deltaD)-V);
% Intentionally slow voltage-mode baseline. Output reconstructed in volts
% (magnitude), controller output in duty units: H = 1 and GPWM = 1.
% A pure PI must stay far below f0: the LC peak here is about 45 dB, and
% the RHP zero at ~2.5 kHz caps any realistic bandwidth anyway.
Kp = 3e-3; Ki = 3;
Gc = Kp+Ki/s;
T = Gc*Gvd;
disp('All nominal continuous-time loop margins:'); disp(allmargin(T));
CL = feedback(T,1);
disp('Nominal closed-loop poles:'); disp(pole(CL));
assert(isstable(CL),'Nominal continuous-time loop is unstable');
figure; margin(T); grid on;
title('Nominal PI loop: inspect allmargin for every crossing');
figure; step(0.1*CL,linspace(0,0.5,5001)); grid on;
title('Output perturbation for a 0.1 V reference step');
% Sweep the operating point: the RHP zero moves with duty and load, so a
% controller tuned only at nominal can lose margin elsewhere.
fprintf('\n  Vg     D      fz_RHP(Hz)   f0(Hz)\n');
for Vgk = [8 10 12 14 16]
    Dk = V/(V+Vgk); Dpk = 1-Dk;
    fprintf('%5.1f  %.3f   %9.1f  %8.1f\n', ...
        Vgk,Dk,Dpk^2*R/(Dk*L)/2/pi,Dpk/sqrt(L*C)/2/pi);
end
% This script does not model DCM, startup, device losses or protection.
