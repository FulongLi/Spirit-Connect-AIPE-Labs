% Flyback converter teaching example: ideal CCM, resistive load.
% Dr. Fulong Li -- first draft, September 2026.
% Requires MATLAB and Control System Toolbox.
% Numerical model independently checked; native MATLAB execution pending.
% The CCM flyback is a buck-boost seen through a turns ratio: the model is
% written in SECONDARY-REFERRED quantities, with Le = Lm/n^2.
clear; clc;
Vg = 48; V = 12; Pout = 30; fs = 100e3;
n  = 2;             % Np:Ns
Lm = 220e-6;        % primary magnetising inductance
C  = 470e-6; R = V^2/Pout;
Le = Lm/n^2;        % secondary-referred
D  = V*n/(Vg+V*n); Dp = 1-D;
Io = V/R; Im = Pout/Vg/D;    % primary-referred magnetising current
fprintf('D=%.4f, Im(pri)=%.3f A, Io=%.3f A, Le=%.1f uH\n',D,Im,Io,Le*1e6);
fprintf('Switch stress Vin+n*Vo = %.1f V, diode reverse = %.1f V\n', ...
    Vg+n*V, V+Vg/n);
s = tf('s');
Gd0 = V/(D*Dp); w0 = Dp/sqrt(Le*C); Q = Dp*R*sqrt(C/Le); wz = Dp^2*R/(D*Le);
Gvd = Gd0*(1-s/wz)/(1+s/(Q*w0)+s^2/w0^2);
fprintf('f0=%.1f Hz, Q=%.3f, fz_RHP=%.2f kHz, Gd0=%.2f V/duty\n', ...
    w0/2/pi,Q,wz/2/pi/1e3,Gd0);
fprintf('Resonant peak = %.0f (%.1f dB)\n',Gd0*Q,20*log10(Gd0*Q));
figure; bode(Gvd); grid on; title('CCM flyback duty-to-output (RHP zero present)');
% Deliberately slow PI baseline: the LC peak is about 54 dB, so a pure PI
% must cross over far below f0. Type II compensation is the practical answer.
Kp = 1.5e-3; Ki = 1.5;
Gc = Kp+Ki/s; T = Gc*Gvd;
disp('All nominal continuous-time loop margins:'); disp(allmargin(T));
CL = feedback(T,1);
assert(isstable(CL),'Nominal continuous-time loop is unstable');
figure; margin(T); grid on; title('Nominal PI loop -- check every crossing');
figure; step(0.1*CL,linspace(0,0.5,5001)); grid on;
title('Output perturbation for a 0.1 V reference step');
% Operating-point sweep: everything moves with line voltage.
fprintf('\n  Vin      D     f0(Hz)    Q     fz_RHP(kHz)  peak(dB)\n');
for Vk = [36 48 72]
    Dk = V*n/(Vk+V*n); Dpk = 1-Dk;
    G = V/(Dk*Dpk); w = Dpk/sqrt(Le*C); Qk = Dpk*R*sqrt(C/Le);
    fprintf('%5.0f  %.4f  %7.1f  %6.3f  %10.2f  %8.1f\n', ...
        Vk,Dk,w/2/pi,Qk,Dpk^2*R/(Dk*Le)/2/pi/1e3,20*log10(G*Qk));
end
% DCM boundary -- a flyback of this rating enters DCM well inside its load
% range, and the DCM model is different (first order, no RHP zero).
dIm = Vg*D/(Lm*fs);
fprintf('\nCCM/DCM boundary at Pout = %.2f W (Io = %.3f A)\n', ...
    Vg*D*dIm/2, Vg*D*dIm/2/V);
% Not modelled here: leakage inductance, the RCD clamp, DCM, startup,
% optocoupler dynamics or the secondary-side reference.
