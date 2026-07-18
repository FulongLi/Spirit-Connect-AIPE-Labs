---
layout: default
title: Partner with AIPE Labs
permalink: /contact/
description: Contact AIPE Labs about open-source contributions, research collaboration, engineering pilots, strategic partnerships, and investment.
image: /images/background/sst.png
---

<header class="hero">
  <div class="container">
    <h1>Build with AIPE Labs</h1>
    <p class="lead">
      Whether you want to contribute an open resource, validate a workflow, pilot the technology on a
      real engineering problem, or explore a strategic partnership — we would like to hear from you.
    </p>
  </div>
</header>

{% assign wf = site.web3forms_access_key | default: '' | strip %}
{% assign tk = site.turnstile_site_key | default: '' | strip %}
{% assign contact_email = 'info@spiritconnect.co.uk' %}

<section class="section section-alt contact-page">
  <div class="container">
    <p id="contact-thanks" class="contact-thanks" hidden role="status">
      Thank you — your message was sent. We will get back to you soon.
    </p>
    <div class="contact-layout">
      <div class="contact-regions">
        <h2>Contact Us</h2>
        <p class="contact-regions-lead">Spirit Connect AIPE Labs</p>
        <div class="contact-region-list">
          <div class="card contact-region-card">
            <p><strong>Spirit Connect AIPE Labs</strong></p>
            <p>Cardiff, United Kingdom</p>
            <p><strong>Contact:</strong> Dr. Fulong Li</p>
            <p>
              <strong>Email:</strong>
              <a href="mailto:{{ contact_email }}">{{ contact_email }}</a>
            </p>
          </div>
        </div>
      </div>

      <div class="card contact-window">
        <div class="contact-window-header">
          <h2 class="contact-form-title">Tell us what you want to build</h2>
          <p class="contact-form-sub">
            Share the problem, contribution, pilot, or partnership you have in mind. A short description
            is enough to start the conversation.
          </p>
        </div>

        <form
          class="contact-form"
          id="sc-contact-form"
          method="POST"
          {% if wf != '' %}
          action="https://api.web3forms.com/submit"
          {% else %}
          action="https://formsubmit.co/{{ contact_email }}"
          {% endif %}
        >
          {% if wf != '' %}
          <input type="hidden" name="access_key" value="{{ wf }}">
          <input type="hidden" name="subject" value="Website contact — Spirit Connect AIPE Labs">
          <input type="hidden" name="redirect" value="{{ site.url }}{{ site.baseurl }}/contact/?sent=1">
          <input type="text" name="botcheck" class="contact-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" hidden>
          {% else %}
          <input type="hidden" name="_subject" value="Website contact — Spirit Connect AIPE Labs">
          <input type="hidden" name="_next" value="{{ site.url }}{{ site.baseurl }}/contact/?sent=1">
          <input type="text" name="_gotcha" class="contact-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" hidden>
          {% endif %}

          <div class="contact-field">
            <label class="visually-hidden" for="cx-name">Name</label>
            <input id="cx-name" name="name" type="text" required placeholder="Name" autocomplete="name">
          </div>
          <div class="contact-field">
            <label class="visually-hidden" for="cx-company">Company</label>
            <input id="cx-company" name="company" type="text" placeholder="Company" autocomplete="organization">
          </div>
          <div class="contact-field">
            <label class="visually-hidden" for="cx-email">Email</label>
            <input id="cx-email" name="email" type="email" required placeholder="Email" autocomplete="email">
          </div>
          <div class="contact-field">
            <label class="contact-label" for="cx-interest">I am interested in</label>
            <select id="cx-interest" name="interest" required>
              <option value="" selected disabled>Select an enquiry type</option>
              <option value="open-source">Using or contributing open-source resources</option>
              <option value="research">Research collaboration</option>
              <option value="industry-pilot">Industry pilot or engineering project</option>
              <option value="strategic-investment">Strategic partnership or investment</option>
              <option value="technical">Technical question</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="contact-field">
            <label class="visually-hidden" for="cx-phone">Phone number</label>
            <div class="phone-field-wrap">
              <select id="cx-phone-cc" name="phone_country" aria-label="Country calling code">
                <option value="+44" selected>GB +44</option>
                <option value="+86">CN +86</option>
                <option value="+1">US +1</option>
                <option value="+49">DE +49</option>
                <option value="+33">FR +33</option>
              </select>
              <input id="cx-phone" name="phone" type="tel" placeholder="Phone number (optional)" autocomplete="tel">
            </div>
          </div>
          <div class="contact-field">
            <label class="contact-label" for="cx-message">Message</label>
            <textarea id="cx-message" name="message" required placeholder="How can we help?"></textarea>
          </div>

          {% if wf != '' and tk != '' %}
          <div class="contact-turnstile">
            <div class="cf-turnstile" data-sitekey="{{ tk }}" data-theme="light"></div>
          </div>
          {% endif %}

          <button type="submit" class="btn btn-primary contact-submit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
            <span class="contact-submit-label">Send message</span>
          </button>
          <p class="contact-response-time">We normally reply within two business days.</p>
        </form>
      </div>
    </div>
  </div>
</section>

{% if wf != '' and tk != '' %}
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
{% endif %}

<script>
(function () {
  if (new URLSearchParams(window.location.search).get('sent') === '1') {
    var el = document.getElementById('contact-thanks');
    if (el) {
      el.hidden = false;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    try { history.replaceState(null, '', window.location.pathname + window.location.hash); } catch (e) {}
  }
})();
</script>
