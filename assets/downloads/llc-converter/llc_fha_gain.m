% LLC resonant converter: first-harmonic-approximation (FHA) gain curves.
% Dr. Fulong Li -- first draft, September 2026.
% Runs in MATLAB or GNU Octave. No toolbox required.
% Numerical model independently checked; native execution pending.
%
% FHA assumes only the fundamental of the square-wave excitation carries
% power. It is accurate near resonance and progressively optimistic below
% it -- good enough to SIZE a tank, not to certify one. Verify with a
% switching simulation before committing to hardware.
clear; clc;
Vin = 390; Vout = 12; Pout = 240; n = 16;
Lr = 80e-6; Cr = 33e-9; Lm = 400e-6;

fr = 1/(2*pi*sqrt(Lr*Cr));          % series resonance (load independent)
fm = 1/(2*pi*sqrt((Lr+Lm)*Cr));     % lower resonance, open-circuit output
Zo = sqrt(Lr/Cr);
Ln = Lm/Lr;
Rl = Vout^2/Pout;
Rac = 8/pi^2*n^2*Rl;                % rectifier + load reflected to the tank
Q  = Zo/Rac;
fprintf('fr = %.2f kHz   fm = %.2f kHz   Zo = %.2f ohm\n',fr/1e3,fm/1e3,Zo);
fprintf('Ln = %.2f   Rac = %.1f ohm   Q = %.4f\n',Ln,Rac,Q);
fprintf('Vout at unity gain = %.3f V (need M = %.4f for %.1f V)\n', ...
    (Vin/2)/n, Vout*n/(Vin/2), Vout);

% FHA voltage gain of the LLC tank, normalised frequency fn = fs/fr.
M = @(fn,Q) 1./sqrt((1+1/Ln-1./(Ln*fn.^2)).^2 + (Q*(fn-1./fn)).^2);

fn = linspace(0.3,2,1200);
figure; hold on; grid on;
Qlist = [0.05 0.1 0.2 Q 0.8 1.5];
for q = Qlist, plot(fn,M(fn,q),'LineWidth',1.2); end
yline(1,'k--'); xline(1,'k--');
xlabel('normalised frequency f_s / f_r'); ylabel('tank voltage gain M');
title(sprintf('LLC FHA gain, L_n = %.1f',Ln));
legend(arrayfun(@(q)sprintf('Q = %.3f',q),Qlist,'UniformOutput',false));

% THE defining property: every curve passes through M = 1 at fn = 1.
fprintf('\nGain at fn = 1 for each Q (should all be exactly 1):\n');
for q = Qlist, fprintf('  Q = %.3f -> M = %.6f\n',q,M(1,q)); end

% Peak gain at full load sets the hold-up / low-line capability.
fns = linspace(0.2,1,4000);
[Mpk,idx] = max(M(fns,Q));
fprintf('\nFull-load peak gain M = %.3f at fn = %.3f (%.1f kHz)\n', ...
    Mpk,fns(idx),fns(idx)*fr/1e3);
fprintf('Minimum input voltage still regulating = %.0f V\n',Vout*n*2/Mpk);

% Design rule: stay ABOVE the peak-gain frequency at every operating point.
% To the left of the peak the tank turns capacitive, ZVS is lost, and the
% body diodes hard-commutate -- the classic way to destroy an LLC bridge.
fprintf('\nKeep fs above %.1f kHz at all loads to stay inductive (ZVS).\n', ...
    fns(idx)*fr/1e3);
% Not modelled: dead time, magnetising current needed for ZVS, transformer
% losses, rectifier drops, or burst-mode light-load behaviour.
