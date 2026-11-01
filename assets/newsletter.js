// AIPE Updates subscription form (/subscribe/). Messages come from the page's
// data attributes so the script is language-neutral. Success is shown only
// when the newsletter-subscribe function confirms it.
(function () {
  const state = document.getElementById('newsletter-state');
  const stateParam = new URLSearchParams(window.location.search).get('state');
  if (state && stateParam && state.dataset[stateParam]) {
    state.textContent = state.dataset[stateParam];
    state.hidden = false;
  }

  const form = document.getElementById('newsletter-form');
  if (!form || !form.dataset.endpoint) return;
  const message = document.getElementById('newsletter-message');
  const button = form.querySelector('button[type="submit"]');
  const idle = button.textContent;

  const show = (text, ok) => {
    message.textContent = text;
    message.hidden = false;
    message.classList.toggle('is-error', !ok);
    message.classList.toggle('is-ok', ok);
  };
  const error = (code) => show(form.getAttribute('data-err-' + code) || form.getAttribute('data-err-generic'), false);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = form.email.value.trim();
    if (!form.email.checkValidity() || !email) return error('invalid_email');
    if (!form.consent.checked) return error('consent_required');
    const captcha = form.querySelector('[name="cf-turnstile-response"]');

    button.disabled = true;
    button.textContent = form.dataset.sending;
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          website: form.website.value,
          lang: form.dataset.lang,
          captcha: captcha ? captcha.value : undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.ok) {
        show(form.getAttribute('data-ok-' + data.status) || form.getAttribute('data-ok-confirmation_sent'), true);
        form.reset();
      } else {
        error(data.error || 'generic');
      }
    } catch (e) {
      error('generic');
    } finally {
      button.disabled = false;
      button.textContent = idle;
      if (window.turnstile) window.turnstile.reset();
    }
  });
})();
