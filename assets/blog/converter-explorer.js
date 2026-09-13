/* Ideal, steady CCM teaching model. No automatic animation or external calls. */
(() => {
  'use strict';
  document.querySelectorAll('[data-converter]').forEach(panel => {
    const buck = panel.dataset.converter === 'buck';
    const vin = buck ? 24 : 12;
    const resistance = buck ? 4.8 : 19.2;
    const slider = panel.querySelector('input[type="range"]');
    let state = 'on';
    function update() {
      const duty = Number(slider.value);
      const vout = buck ? vin * duty : vin / (1 - duty);
      const iout = vout / resistance;
      const average = buck ? iout : iout / (1 - duty);
      const onVoltage = buck ? vin - vout : vin;
      const offVoltage = buck ? -vout : vin - vout;
      const ripple = onVoltage * duty / (150e-6 * 100e3);
      const x = 85 + 590 * duty;
      const fmt = value => value.toFixed(2);
      panel.querySelector('[data-values]').textContent = `D = ${fmt(duty)}: ${vin} V → ${fmt(vout)} V; output current ${fmt(iout)} A; inductor mean ${fmt(average)} A; ripple ${fmt(ripple)} A peak-to-peak.`;
      panel.querySelector('[data-on-band]').setAttribute('width', String(590 * duty));
      panel.querySelector('[data-gate]').setAttribute('d', `M85 40H${x}V90H675`);
      panel.querySelector('[data-current]').setAttribute('d', `M85 210L${x} 135L675 210`);
      panel.querySelector('[data-on-label]').textContent = `On: ${fmt(10 * duty)} µs`;
      panel.querySelector('[data-off-label]').textContent = `Off: ${fmt(10 * (1 - duty))} µs`;
      panel.querySelector('[data-current-high]').textContent = `${fmt(average + ripple / 2)} A`;
      panel.querySelector('[data-current-low]').textContent = `${fmt(average - ripple / 2)} A`;
      let explanation;
      if (buck) {
        explanation = state === 'on'
          ? `Input → Q → L → output. The diode blocks. vL = Vin − Vo = ${fmt(onVoltage)} V, so current rises.`
          : `Return → freewheel diode → L → output → return. vL = −Vo = ${fmt(offVoltage)} V, so current falls while L continues to feed the output.`;
      } else {
        explanation = state === 'on'
          ? `Input → L → Q → return. The output diode blocks and the capacitor supplies the load. vL = ${fmt(onVoltage)} V, so current rises.`
          : `Input → L → output diode → output → return. vL = Vin − Vo = ${fmt(offVoltage)} V, so current falls while the source and inductor supply the output.`;
      }
      panel.querySelector('[data-state-description]').textContent = `Q ${state}: ${explanation}`;
      panel.querySelectorAll('[data-state]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.state === state)));
    }
    slider.addEventListener('input', update);
    panel.querySelectorAll('[data-state]').forEach(button => button.addEventListener('click', () => {
      state = button.dataset.state;
      update();
    }));
    update();
  });
})();
