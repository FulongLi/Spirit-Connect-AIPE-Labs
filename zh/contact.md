---
layout: default
title: 与 AIPE Labs 合作
lang: zh
permalink: /zh/contact/
description: 联系 AIPE Labs，讨论开源贡献、科研合作、工程试点、战略合作与投资。
image: /images/background/sst.png
---

<header class="hero">
  <div class="container">
    <h1>与 AIPE Labs 一起建设</h1>
    <p class="lead">
      无论你希望贡献开放资源、共同验证工程流程、在真实项目中试点技术，
      还是讨论战略合作与投资，我们都期待你的来信。
    </p>
  </div>
</header>

{% assign wf = site.web3forms_access_key | default: '' | strip %}
{% assign tk = site.turnstile_site_key | default: '' | strip %}
{% assign contact_email = 'info@spiritconnect.co.uk' %}

<section class="section section-alt contact-page">
  <div class="container">
    <p id="contact-thanks" class="contact-thanks" hidden role="status">
      感谢你 —— 消息已发送，我们会尽快回复。
    </p>
    <div class="contact-layout">
      <div class="contact-regions">
        <h2>联系我们</h2>
        <p class="contact-regions-lead">Spirit Connect AIPE Labs</p>
        <div class="contact-region-list">
          <div class="card contact-region-card">
            <p><strong>Spirit Connect AIPE Labs</strong></p>
            <p>英国卡迪夫</p>
            <p><strong>联系人：</strong>李富龙 博士</p>
            <p>
              <strong>邮箱：</strong>
              <a href="mailto:{{ contact_email }}">{{ contact_email }}</a>
            </p>
          </div>
        </div>
      </div>

      <div class="card contact-window">
        <div class="contact-window-header">
          <h2 class="contact-form-title">告诉我们你想一起建设什么</h2>
          <p class="contact-form-sub">
            简单介绍你正在考虑的问题、开源贡献、工程试点或合作方向，就可以开始交流。
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
          <input type="hidden" name="redirect" value="{{ site.url }}{{ site.baseurl }}/zh/contact/?sent=1">
          <input type="text" name="botcheck" class="contact-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" hidden>
          {% else %}
          <input type="hidden" name="_subject" value="Website contact — Spirit Connect AIPE Labs">
          <input type="hidden" name="_next" value="{{ site.url }}{{ site.baseurl }}/zh/contact/?sent=1">
          <input type="text" name="_gotcha" class="contact-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" hidden>
          {% endif %}

          <div class="contact-field">
            <label class="visually-hidden" for="cx-name">姓名</label>
            <input id="cx-name" name="name" type="text" required placeholder="姓名" autocomplete="name">
          </div>
          <div class="contact-field">
            <label class="visually-hidden" for="cx-company">公司</label>
            <input id="cx-company" name="company" type="text" placeholder="公司" autocomplete="organization">
          </div>
          <div class="contact-field">
            <label class="visually-hidden" for="cx-email">邮箱</label>
            <input id="cx-email" name="email" type="email" required placeholder="邮箱" autocomplete="email">
          </div>
          <div class="contact-field">
            <label class="contact-label" for="cx-interest">你希望讨论</label>
            <select id="cx-interest" name="interest" required>
              <option value="" selected disabled>请选择咨询类型</option>
              <option value="open-source">使用或贡献开源资源</option>
              <option value="research">科研合作</option>
              <option value="industry-pilot">产业试点或工程项目</option>
              <option value="strategic-investment">战略合作或投资</option>
              <option value="technical">技术问题</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="contact-field">
            <label class="visually-hidden" for="cx-phone">电话号码</label>
            <div class="phone-field-wrap">
              <select id="cx-phone-cc" name="phone_country" aria-label="国家/地区区号">
                <option value="+44" selected>GB +44</option>
                <option value="+86">CN +86</option>
                <option value="+1">US +1</option>
                <option value="+49">DE +49</option>
                <option value="+33">FR +33</option>
              </select>
              <input id="cx-phone" name="phone" type="tel" placeholder="电话号码（选填）" autocomplete="tel">
            </div>
          </div>
          <div class="contact-field">
            <label class="contact-label" for="cx-message">留言</label>
            <textarea id="cx-message" name="message" required placeholder="我们能为你做些什么？"></textarea>
          </div>

          {% if wf != '' and tk != '' %}
          <div class="contact-turnstile">
            <div class="cf-turnstile" data-sitekey="{{ tk }}" data-theme="light"></div>
          </div>
          {% endif %}

          <button type="submit" class="btn btn-primary contact-submit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
            <span class="contact-submit-label">发送消息</span>
          </button>
          <p class="contact-response-time">我们通常会在两个工作日内回复。</p>
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
