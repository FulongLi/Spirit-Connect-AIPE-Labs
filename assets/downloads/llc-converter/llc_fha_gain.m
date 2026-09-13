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

% The unconstrained voltage-gain peak is NOT the inductive-region boundary.
fns = linspace(0.2,1,4000);
[Mpk,idx] = max(M(fns,Q));
fprintf('Unconstrained peak M = %.3f at fn = %.4f\n',Mpk,fns(idx));
% Input reactance: series Lr/Cr plus the parallel Lm/Rac branch.
Xnorm = @(x,q) x-1./x + x*Ln./(1+(x*Ln*q).^2);
fb = fzero(@(x) Xnorm(x,Q),[1/sqrt(1+Ln),1]);
fprintf('Nominal FHA inductive boundary: fn = %.4f, fs = %.2f kHz\n',fb,fb*fr/1e3);
fprintf('Boundary gain = %.4f; add inductive and commutation margin.\n',M(fb,Q));
figure; plot(fn,Xnorm(fn,Q),'LineWidth',1.2); hold on; grid on;
yline(0,'k--'); xline(fb,'k--');
xlabel('normalised frequency f_s / f_r'); ylabel('Im(Zin) / Z0');
title('FHA input reactance: positive is inductive');
% Being inductive does not guarantee sufficient dead-time charge for ZVS.
% Not modelled: nonlinear Coss, gate timing, losses, parasitics or burst mode.
% This nominal-load calculation does not establish an all-load frequency limit.
