// AIPE Community client. Every /community/ page renders one view into
// #community-app (data-view) from the Supabase backend configured in
// _config.yml (community_backend). The browser only ever holds the public
// anon key and the member's own session; all permissions are enforced by
// row-level security and the workflow functions in supabase/migrations/.
import {
  DEV_STATUSES, DOMAINS, EVIDENCE_LEVELS, TOOL_KINDS, TYPES, USERNAME,
  errorKey, escapeHtml, formatDate, html, missingFields, parseList, raw, renderMarkdown, safeUrl,
} from './lib.js';

const root = document.getElementById('community-app');
const config = JSON.parse(document.getElementById('community-config').textContent);
const T = config.t;
const lang = config.lang;
const lp = config.prefix;
const PAGE_SIZE = 12;
const AUTHOR = 'author:profiles!contributions_author_id_fkey(username, display_name, avatar_url, role, is_official)';

const sb = config.supabaseUrl && config.anonKey && window.supabase
  ? window.supabase.createClient(config.supabaseUrl, config.anonKey, {
    auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true },
  })
  : null;

// ── Small helpers ─────────────────────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const path = (p, query) => `${lp}${p}${query ? `?${new URLSearchParams(query)}` : ''}`;
const siteUrl = (p) => `${window.location.origin}${path(p)}`;
const mount = (node, content) => { node.innerHTML = content.value; return node; };
const $ = (selector, scope = root) => scope.querySelector(selector);
const $$ = (selector, scope = root) => Array.from(scope.querySelectorAll(selector));
const errorText = (error) => T[errorKey(error)] || T.error_generic;

function notice(text, kind = '') {
  return html`<p class="form-message ${kind}" role="status">${text}</p>`;
}
function flash(node, text, ok) {
  node.textContent = text;
  node.hidden = false;
  node.className = `form-message ${ok ? 'is-ok' : 'is-error'}`;
}
function options(values, labels, selected, placeholder) {
  return html`${placeholder ? html`<option value="">${placeholder}</option>` : ''}${values.map((v) =>
    html`<option value="${v}"${raw(v === selected ? ' selected' : '')}>${labels[v] || v}</option>`)}`;
}
function md(source) {
  return raw(renderMarkdown(source, { marked: window.marked, DOMPurify: window.DOMPurify }));
}
function statusBadge(status) {
  return html`<span class="community-status community-status-${status}">${T.statuses[status] || status}</span>`;
}
function roleBadge(profile) {
  if (!profile) return '';
  if (profile.is_official) return html`<span class="community-role community-role-official">${T.official}</span>`;
  if (profile.role === 'moderator' || profile.role === 'admin') return html`<span class="community-role">${T.moderator}</span>`;
  return '';
}
function avatar(profile, size = 'sm') {
  const src = safeUrl(profile?.avatar_url);
  const initial = (profile?.display_name || '?').trim().charAt(0).toUpperCase();
  return src
    ? html`<img class="community-avatar community-avatar-${size}" src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer">`
    : html`<span class="community-avatar community-avatar-${size}" aria-hidden="true">${initial}</span>`;
}
function authorLink(profile) {
  if (!profile) return '';
  return html`<a class="community-author" href="${path('/community/members/', { u: profile.username })}">${avatar(profile)}<span>${profile.display_name}</span></a>`;
}
function domainChips(domains) {
  return html`<ul class="community-chips">${(domains || []).map((d) => html`<li>${T.domain_labels[d] || d}</li>`)}</ul>`;
}
function card(c) {
  const href = path('/community/contribution/', { slug: c.slug });
  return html`<article class="hub-project-card community-card">
    <div class="community-card-meta"><span class="community-type">${T.types[c.type]}</span>${c.published_at ? html`<time datetime="${c.published_at}">${formatDate(c.published_at, lang)}</time>` : ''}</div>
    <h3><a href="${href}">${c.title}</a></h3>
    <p>${c.summary}</p>
    ${domainChips(c.domains)}
    <div class="community-card-foot">${authorLink(c.author)}</div>
  </article>`;
}

async function currentUser() {
  if (!sb) return { session: null, profile: null };
  const { data } = await sb.auth.getSession();
  const session = data.session;
  if (!session) return { session: null, profile: null };
  const { data: profile } = await sb.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
  return { session, profile };
}

// Keeps the query string (e.g. ?slug=) when switching language.
function keepQueryOnLanguageSwitch() {
  if (!window.location.search) return;
  document.querySelectorAll('.lang-switch .drop-menu a').forEach((a) => {
    const target = new URL(a.getAttribute('href'), window.location.origin);
    if (target.pathname.includes('/community/')) a.setAttribute('href', target.pathname + window.location.search);
  });
}

function renderSubnav(me) {
  const nav = document.getElementById('community-subnav');
  if (!nav) return;
  const view = root.dataset.view;
  const items = [
    ['explore', '/community/explore/', T.sub_explore],
    ['submit', '/community/submit/', T.sub_submit],
    me.session ? ['account', '/community/account/', T.sub_account] : ['join', '/community/join/', T.sub_join],
  ];
  if (me.profile && ['moderator', 'admin'].includes(me.profile.role)) items.push(['moderation', '/community/moderation/', T.sub_moderation]);
  mount(nav, html`${items.map(([key, href, label]) =>
    html`<a href="${path(href)}"${raw(key === view ? ' aria-current="page"' : '')}>${label}</a>`)}`);
}

function requireSignIn() {
  mount(root, html`<div class="card community-panel">${notice(T.sign_in_required)}
    <p><a class="btn btn-primary" href="${path('/community/join/', { next: window.location.pathname + window.location.search })}">${T.sign_in}</a></p></div>`);
}

// ── Join: sign in, sign up, password reset, GitHub ────────────────────────
function viewJoin(me) {
  const next = params.get('next');
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : path('/community/account/');
  if (me.session) { window.location.replace(safeNext); return; }
  let mode = params.get('mode') === 'signup' ? 'signup' : 'signin';

  const draw = () => {
    mount(root, html`<div class="community-auth card community-panel">
      <h2>${mode === 'signup' ? T.sign_up : mode === 'reset' ? T.forgot : T.sign_in}</h2>
      ${mode !== 'reset' ? html`<button type="button" class="btn btn-ghost community-github" data-action="github">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>
        ${T.with_github}</button>
      <p class="community-or"><span>${T.or}</span></p>` : ''}
      <form class="aipe-form" id="auth-form" novalidate>
        <div class="contact-field"><label class="contact-label" for="auth-email">${T.email}</label>
          <input id="auth-email" name="email" type="email" required autocomplete="email" maxlength="254"></div>
        ${mode !== 'reset' ? html`<div class="contact-field"><label class="contact-label" for="auth-password">${T.password}</label>
          <input id="auth-password" name="password" type="password" required minlength="10" autocomplete="${mode === 'signup' ? 'new-password' : 'current-password'}">
          ${mode === 'signup' ? html`<p class="form-hint">${T.password_hint}</p>` : ''}</div>` : ''}
        ${mode === 'signup' ? html`<label class="newsletter-consent"><input type="checkbox" name="terms" required>
          <span>${T.terms_accept} <a href="${path('/legal/terms/')}">${T.terms_link}</a> · <a href="${path('/community/guidelines/')}">${T.guidelines_link}</a> · <a href="${path('/legal/privacy/')}">${T.privacy_link}</a></span></label>
          <p class="form-hint">${T.marketing_note}</p>` : ''}
        ${config.turnstileSiteKey && mode !== 'signin' ? html`<div class="contact-turnstile"><div class="cf-turnstile" data-sitekey="${config.turnstileSiteKey}"></div></div>` : ''}
        <button class="btn btn-primary" type="submit">${mode === 'signup' ? T.sign_up : mode === 'reset' ? T.send_reset : T.sign_in}</button>
        <p class="form-message" id="auth-message" hidden></p>
      </form>
      <p class="community-auth-switch">
        ${mode === 'signin' ? html`<button type="button" class="link-button" data-mode="reset">${T.forgot}</button> · <button type="button" class="link-button" data-mode="signup">${T.sign_up}</button>` : ''}
        ${mode !== 'signin' ? html`<button type="button" class="link-button" data-mode="signin">${T.back_to_sign_in}</button>` : ''}
      </p>
    </div>`);
    if (config.turnstileSiteKey && window.turnstile) window.turnstile.render?.('.cf-turnstile');

    $$('[data-mode]').forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; draw(); }));
    $('[data-action="github"]')?.addEventListener('click', async () => {
      const { error } = await sb.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin + safeNext } });
      if (error) flash($('#auth-message'), T.auth_error, false);
    });
    $('#auth-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const message = $('#auth-message');
      const email = form.email.value.trim();
      const captchaToken = form.querySelector('[name="cf-turnstile-response"]')?.value || undefined;
      if (!form.email.checkValidity() || !email) return flash(message, T.email, false);
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      try {
        if (mode === 'reset') {
          await sb.auth.resetPasswordForEmail(email, { redirectTo: siteUrl('/community/account/') + '?recovery=1', captchaToken });
          flash(message, T.reset_sent, true);
        } else if (mode === 'signup') {
          if (!form.terms.checked) return flash(message, T.terms_accept, false);
          const { error } = await sb.auth.signUp({
            email, password: form.password.value,
            options: { emailRedirectTo: siteUrl('/community/account/'), captchaToken },
          });
          if (error) return flash(message, error.message || T.auth_error, false);
          flash(message, T.check_email, true);
          form.reset();
        } else {
          const { error } = await sb.auth.signInWithPassword({ email, password: form.password.value });
          if (error) return flash(message, T.auth_error, false);
          window.location.assign(safeNext);
        }
      } finally {
        button.disabled = false;
        window.turnstile?.reset?.();
      }
    });
  };
  draw();
}

// ── Account: profile, contributions, data, deletion ───────────────────────
async function viewAccount(me) {
  if (params.get('recovery') === '1' && me.session) return drawPasswordReset();
  if (!me.session) return requireSignIn();
  const p = me.profile;
  const { data: mine, error } = await sb.from('contributions')
    .select('id, slug, type, title, status, review_note, updated_at, published_at')
    .eq('author_id', p.id).order('updated_at', { ascending: false });
  if (error) return mount(root, notice(errorText(error), 'is-error'));

  mount(root, html`<div class="community-account">
    <section class="card community-panel">
      <div class="community-panel-head"><h2>${T.profile_title}</h2>
        <a href="${path('/community/members/', { u: p.username })}">${T.view_profile} →</a></div>
      <p class="community-muted">${T.profile_intro}</p>
      <form class="aipe-form community-profile-form" id="profile-form" novalidate>
        <div class="community-avatar-field">${avatar(p, 'lg')}
          <div><label class="contact-label" for="pf-avatar">${T.avatar}</label>
          <input id="pf-avatar" name="avatar" type="file" accept="image/png,image/jpeg,image/webp">
          <p class="form-hint">${T.avatar_hint}</p></div></div>
        <div class="community-grid-2">
          <div class="contact-field"><label class="contact-label" for="pf-username">${T.username}</label>
            <input id="pf-username" name="username" type="text" required maxlength="30" pattern="[a-z0-9][a-z0-9-]{1,28}[a-z0-9]" value="${p.username}">
            <p class="form-hint">${T.username_hint}</p></div>
          <div class="contact-field"><label class="contact-label" for="pf-name">${T.display_name}</label>
            <input id="pf-name" name="display_name" type="text" required maxlength="80" value="${p.display_name}"></div>
        </div>
        <div class="contact-field"><label class="contact-label" for="pf-bio">${T.bio}</label>
          <textarea id="pf-bio" name="bio" maxlength="600" rows="3">${p.bio}</textarea></div>
        <div class="contact-field"><label class="contact-label" for="pf-interests">${T.interests}</label>
          <input id="pf-interests" name="interests" type="text" value="${(p.interests || []).join(', ')}">
          <p class="form-hint">${T.interests_hint}</p></div>
        <div class="community-grid-2">
          <div class="contact-field"><label class="contact-label" for="pf-aff">${T.affiliation}</label>
            <input id="pf-aff" name="affiliation" type="text" maxlength="120" value="${p.affiliation}"></div>
          <div class="contact-field"><label class="contact-label" for="pf-gh">${T.github}</label>
            <input id="pf-gh" name="github_url" type="url" placeholder="https://github.com/…" value="${p.github_url || ''}"></div>
        </div>
        <div class="contact-field"><label class="contact-label" for="pf-web">${T.website}</label>
          <input id="pf-web" name="website_url" type="url" placeholder="https://…" value="${p.website_url || ''}"></div>
        <button class="btn btn-primary" type="submit">${T.save_profile}</button>
        <p class="form-message" id="profile-message" hidden></p>
      </form>
    </section>

    <section class="card community-panel">
      <div class="community-panel-head"><h2>${T.my_contributions}</h2>
        <a class="btn btn-primary" href="${path('/community/submit/')}">${T.new_contribution}</a></div>
      ${mine.length ? html`<ul class="community-mine">${mine.map((c) => html`<li data-id="${c.id}">
        <div><strong>${c.status === 'published' ? html`<a href="${path('/community/contribution/', { slug: c.slug })}">${c.title}</a>` : c.title}</strong>
          <span class="community-muted">${T.types[c.type]} · ${formatDate(c.updated_at, lang)}</span>
          ${c.review_note && ['changes_requested', 'rejected', 'unpublished'].includes(c.status) ? html`<p class="community-review-note"><strong>${T.review_note}:</strong> ${c.review_note}</p>` : ''}</div>
        <div class="community-mine-actions">${statusBadge(c.status)}
          ${['draft', 'changes_requested', 'unpublished'].includes(c.status) ? html`<a href="${path('/community/submit/', { id: c.id })}">${T.edit}</a>
            <button type="button" class="link-button" data-act="submit">${T.submit_for_review}</button>` : ''}
          ${['submitted', 'approved', 'published'].includes(c.status) ? html`<button type="button" class="link-button" data-act="withdraw">${T.withdraw}</button>` : ''}
          ${c.status !== 'published' ? html`<button type="button" class="link-button is-danger" data-act="delete">${T.delete}</button>` : ''}
        </div></li>`)}</ul>` : html`<p class="community-muted">${T.no_contributions}</p>`}
      <p class="form-message" id="mine-message" hidden></p>
    </section>

    <section class="card community-panel">
      <h2>${T.data_title}</h2>
      <p><button type="button" class="btn btn-ghost" id="export-data">${T.export_data}</button>
         <button type="button" class="btn btn-ghost" id="sign-out">${T.sign_out}</button></p>
      <h3>${T.delete_account}</h3>
      <p class="community-muted">${T.delete_account_text}</p>
      <form class="aipe-form community-inline-form" id="delete-account">
        <label class="visually-hidden" for="del-confirm">${T.delete_account_confirm}</label>
        <input id="del-confirm" name="confirm" type="text" placeholder="${T.delete_account_confirm}" autocomplete="off">
        <button class="btn btn-ghost is-danger" type="submit">${T.delete_account}</button>
      </form>
      <p class="form-message" id="delete-message" hidden></p>
    </section>
  </div>`);

  $('#profile-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = $('#profile-message');
    const username = form.username.value.trim().toLowerCase();
    if (!USERNAME.test(username)) return flash(message, T.username_hint, false);
    const links = { github_url: form.github_url.value.trim() || null, website_url: form.website_url.value.trim() || null };
    for (const value of Object.values(links)) if (value && !safeUrl(value)) return flash(message, T.invalid_link, false);
    const update = {
      username, display_name: form.display_name.value.trim(), bio: form.bio.value.trim(),
      interests: parseList(form.interests.value), affiliation: form.affiliation.value.trim(), ...links,
    };
    const file = form.avatar.files[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1048576) return flash(message, T.avatar_hint, false);
      const name = `${p.id}/avatar-${Date.now()}.${file.type.split('/')[1]}`;
      const { error: upErr } = await sb.storage.from('avatars').upload(name, file, { contentType: file.type, upsert: true });
      if (upErr) return flash(message, errorText(upErr), false);
      update.avatar_url = sb.storage.from('avatars').getPublicUrl(name).data.publicUrl;
    }
    const { error: err } = await sb.from('profiles').update(update).eq('id', p.id);
    if (err) return flash(message, err.code === '23505' ? T.username_taken : errorText(err), false);
    flash(message, T.saved, true);
  });

  $$('.community-mine [data-act]').forEach((button) => button.addEventListener('click', async () => {
    const id = button.closest('li').dataset.id;
    const message = $('#mine-message');
    let result;
    if (button.dataset.act === 'submit') result = await sb.rpc('submit_contribution', { p_id: id });
    if (button.dataset.act === 'withdraw') result = await sb.rpc('withdraw_contribution', { p_id: id });
    if (button.dataset.act === 'delete') {
      if (!window.confirm(T.confirm_delete)) return;
      result = await sb.from('contributions').delete().eq('id', id);
    }
    if (result.error) {
      if (/incomplete/.test(result.error.message)) {
        return flash(message, `${T.missing} ${fieldLabels(result.error.details)}`, false);
      }
      return flash(message, errorText(result.error), false);
    }
    viewAccount(await currentUser());
  }));

  $('#sign-out').addEventListener('click', async () => {
    await sb.auth.signOut();
    window.location.assign(path('/community/'));
  });

  $('#export-data').addEventListener('click', async () => {
    const [profile, contributions, events, extra] = await Promise.all([
      sb.from('profiles').select('*').eq('id', p.id).single(),
      sb.from('contributions').select('*').eq('author_id', p.id),
      sb.from('moderation_events').select('*').in('target_id', mine.map((c) => c.id)),
      exportExtras(p.id),
    ]);
    const data = {
      exported_at: new Date().toISOString(),
      account: { id: me.session.user.id, email: me.session.user.email, created_at: me.session.user.created_at },
      profile: profile.data, contributions: contributions.data, moderation_decisions: events.data, ...extra,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `aipe-community-${p.username}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $('#delete-account').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = $('#delete-message');
    if (event.currentTarget.confirm.value.trim() !== 'DELETE') return flash(message, T.delete_account_confirm, false);
    const { data } = await sb.auth.getSession();
    try {
      const res = await fetch(`${config.supabaseUrl}/functions/v1/delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: config.anonKey, Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ confirm: 'DELETE' }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) return flash(message, T.error_generic, false);
      await sb.auth.signOut({ scope: 'local' });
      mount(root, notice(T.account_deleted, 'is-ok'));
    } catch {
      flash(message, T.error_generic, false);
    }
  });
}

// Extra personal data included in the export; Phase 3 adds comments and reports.
const exportHooks = [];
async function exportExtras(uid) {
  const parts = await Promise.all(exportHooks.map((fn) => fn(uid)));
  return Object.assign({}, ...parts);
}

function drawPasswordReset() {
  mount(root, html`<div class="community-auth card community-panel"><h2>${T.set_password}</h2>
    <form class="aipe-form" id="reset-form"><div class="contact-field"><label class="contact-label" for="np">${T.new_password}</label>
    <input id="np" name="password" type="password" minlength="10" required autocomplete="new-password"><p class="form-hint">${T.password_hint}</p></div>
    <button class="btn btn-primary" type="submit">${T.set_password}</button><p class="form-message" id="reset-message" hidden></p></form></div>`);
  $('#reset-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const { error } = await sb.auth.updateUser({ password: event.currentTarget.password.value });
    if (error) return flash($('#reset-message'), error.message || T.error_generic, false);
    flash($('#reset-message'), T.password_updated, true);
    window.history.replaceState(null, '', window.location.pathname);
  });
}

function fieldLabels(details) {
  const map = {
    summary: T.summary, domains: T.domains, tool_kind: T.tool_kind, project_url: T.project_url, dev_status: T.dev_status,
    licence: T.licence, limitations: T.limitations, hypothesis: T.hypothesis, evidence_level: T.evidence_level,
    references_md: T.references, body_md: T.body, ai_disclosure: T.ai_disclosure,
  };
  const list = Array.isArray(details) ? details : String(details || '').split(',');
  return list.filter(Boolean).map((k) => map[k] || k).join(', ');
}

// ── Editor ────────────────────────────────────────────────────────────────
const CONTENT_FIELDS = ['lang', 'title', 'summary', 'domains', 'tool_kind', 'project_url', 'docs_url', 'demo_url', 'dev_status',
  'licence', 'limitations', 'hypothesis', 'evidence_level', 'references_md', 'validation_approach', 'body_md',
  'ai_assisted', 'ai_disclosure', 'origin'];

async function viewSubmit(me) {
  if (!me.session) return requireSignIn();
  let c = { type: TYPES.includes(params.get('type')) ? params.get('type') : 'article', lang, domains: [], ai_assisted: false, origin: 'member' };
  const id = params.get('id');
  if (id) {
    const { data, error } = await sb.from('contributions').select('*').eq('id', id).eq('author_id', me.profile.id).maybeSingle();
    if (error || !data) return mount(root, notice(T.error_not_found, 'is-error'));
    if (!['draft', 'changes_requested', 'unpublished'].includes(data.status)) {
      return mount(root, html`<div class="card community-panel">${notice(T.locked)}<p><a href="${path('/community/account/')}">${T.sub_account} →</a></p></div>`);
    }
    c = data;
  }
  editorForm(c);
  const extend = editorExtensions.map((fn) => fn(c));
  await Promise.all(extend);
}
// Phase 3 adds knowledge-topic selection here.
const editorExtensions = [];

function field(name, label, control, hint) {
  return html`<div class="contact-field" data-field="${name}"><label class="contact-label" for="f-${name}">${label}</label>${control}${hint ? html`<p class="form-hint">${hint}</p>` : ''}</div>`;
}
function textInput(name, value, attrs = '') {
  return html`<input id="f-${name}" name="${name}" type="text" value="${value || ''}" ${raw(attrs)}>`;
}
function urlInput(name, value) {
  return html`<input id="f-${name}" name="${name}" type="url" placeholder="https://…" value="${value || ''}" maxlength="500">`;
}
function textArea(name, value, rows = 4, max = 5000) {
  return html`<textarea id="f-${name}" name="${name}" rows="${rows}" maxlength="${max}">${value || ''}</textarea>`;
}
function markdownArea(name, value, rows, max) {
  return html`<div class="community-md" data-md="${name}">
    <div class="community-md-tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-tab="write">${T.write}</button><button type="button" role="tab" aria-selected="false" data-tab="preview">${T.preview}</button></div>
    ${textArea(name, value, rows, max)}<div class="community-md-preview community-prose" hidden></div></div>`;
}

function editorForm(c) {
  const isNew = !c.id;
  mount(root, html`<form class="aipe-form card community-panel community-editor" id="editor" novalidate>
    <div class="community-panel-head"><h2>${isNew ? T.editor_title_new : T.editor_title_edit}</h2>${c.status ? statusBadge(c.status) : ''}</div>
    ${c.review_note && c.status === 'changes_requested' ? html`<p class="community-review-note"><strong>${T.review_note}:</strong> ${c.review_note}</p>` : ''}
    <div class="community-grid-2">
      ${field('type', T.type, html`<select id="f-type" name="type"${raw(isNew ? '' : ' disabled')}>${options(TYPES, T.types, c.type)}</select>`)}
      ${field('lang', T.language, html`<select id="f-lang" name="lang">${options(['en', 'zh'], T.languages, c.lang)}</select>`)}
    </div>
    ${field('title', c.type === 'tool' ? T.tool_name : T.title_field, textInput('title', c.title, 'required maxlength="140" minlength="3"'))}
    ${field('summary', c.type === 'idea' ? T.idea_abstract : T.summary, textArea('summary', c.summary, 3, 500), T.summary_hint)}
    <fieldset class="contact-field community-checks" data-field="domains"><legend class="contact-label">${c.type === 'idea' ? T.discipline : T.domains}</legend>
      ${DOMAINS.map((d) => html`<label><input type="checkbox" name="domains" value="${d}"${raw((c.domains || []).includes(d) ? ' checked' : '')}> ${T.domain_labels[d]}</label>`)}
    </fieldset>
    <div data-type="tool"${raw(c.type === 'tool' ? '' : ' hidden')}>
      <div class="community-grid-2">
        ${field('tool_kind', T.tool_kind, html`<select id="f-tool_kind" name="tool_kind">${options(TOOL_KINDS, T.tool_kinds, c.tool_kind, '—')}</select>`)}
        ${field('dev_status', T.dev_status, html`<select id="f-dev_status" name="dev_status">${options(DEV_STATUSES, T.dev_statuses, c.dev_status, '—')}</select>`)}
      </div>
      ${field('project_url', T.project_url, urlInput('project_url', c.project_url))}
      <div class="community-grid-2">${field('docs_url', T.docs_url, urlInput('docs_url', c.docs_url))}${field('demo_url', T.demo_url, urlInput('demo_url', c.demo_url))}</div>
      ${field('licence', T.licence, textInput('licence', c.licence, 'maxlength="80"'), T.licence_hint)}
      ${field('limitations', T.limitations, textArea('limitations', c.limitations, 4, 3000), T.limitations_hint)}
    </div>
    <div data-type="idea"${raw(c.type === 'idea' ? '' : ' hidden')}>
      ${field('hypothesis', T.hypothesis, markdownArea('hypothesis', c.hypothesis, 8, 8000))}
      ${field('evidence_level', T.evidence_level, html`<select id="f-evidence_level" name="evidence_level">${options(EVIDENCE_LEVELS, T.evidence_levels, c.evidence_level, '—')}</select>`, T.idea_warning)}
      ${field('references_md', T.references, textArea('references_md', c.references_md, 4, 5000), T.references_hint)}
      ${field('validation_approach', T.validation, textArea('validation_approach', c.validation_approach, 4, 5000))}
    </div>
    <div data-type="article"${raw(c.type === 'article' ? '' : ' hidden')}>
      ${field('body_md', T.body, markdownArea('body_md', c.body_md, 18, 80000), T.body_hint)}
    </div>
    <div id="editor-extensions"></div>
    <fieldset class="contact-field community-checks">
      <label><input type="checkbox" name="ai_assisted"${raw(c.ai_assisted ? ' checked' : '')}> ${T.ai_assisted}</label>
      <label><input type="checkbox" name="agent_origin"${raw(c.origin === 'agent-assisted' ? ' checked' : '')}> ${T.agent_origin}</label>
    </fieldset>
    <div data-ai${raw(c.ai_assisted ? '' : ' hidden')}>${field('ai_disclosure', T.ai_disclosure, textArea('ai_disclosure', c.ai_disclosure, 2, 1000), T.ai_disclosure_hint)}</div>
    <p class="community-muted community-small">${T.licence_grant} <a href="${path('/community/guidelines/')}">${T.guidelines_link}</a></p>
    <div class="community-actions">
      <button class="btn btn-ghost" type="submit" data-intent="save">${T.save_draft}</button>
      <button class="btn btn-primary" type="submit" data-intent="submit">${T.submit_for_review}</button>
    </div>
    <p class="form-message" id="editor-message" hidden></p>
  </form>`);

  const form = $('#editor');
  form.type.addEventListener('change', () => {
    c.type = form.type.value;
    $$('[data-type]', form).forEach((el) => { el.hidden = el.dataset.type !== c.type; });
  });
  form.ai_assisted.addEventListener('change', () => { $('[data-ai]', form).hidden = !form.ai_assisted.checked; });
  form.agent_origin.addEventListener('change', () => {
    if (form.agent_origin.checked) { form.ai_assisted.checked = true; $('[data-ai]', form).hidden = false; }
  });
  $$('.community-md', form).forEach((box) => {
    const area = $('textarea', box);
    const preview = $('.community-md-preview', box);
    $$('[data-tab]', box).forEach((tab) => tab.addEventListener('click', () => {
      const show = tab.dataset.tab === 'preview';
      if (show) preview.innerHTML = md(area.value).value;
      preview.hidden = !show;
      area.hidden = show;
      $$('[data-tab]', box).forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    }));
  });

  let intent = 'save';
  $$('[data-intent]', form).forEach((b) => b.addEventListener('click', () => { intent = b.dataset.intent; }));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = $('#editor-message');
    const value = (name) => (form[name] ? form[name].value.trim() : '');
    const row = {
      lang: value('lang'), title: value('title'), summary: value('summary'),
      domains: $$('input[name="domains"]:checked', form).map((i) => i.value),
      ai_assisted: form.ai_assisted.checked, ai_disclosure: value('ai_disclosure') || null,
      origin: form.agent_origin.checked ? 'agent-assisted' : 'member',
    };
    for (const [type, names] of Object.entries({
      tool: ['tool_kind', 'project_url', 'docs_url', 'demo_url', 'dev_status', 'licence', 'limitations'],
      idea: ['hypothesis', 'evidence_level', 'references_md', 'validation_approach'],
      article: ['body_md'],
    })) for (const name of names) row[name] = c.type === type ? (value(name) || null) : null;
    for (const name of ['project_url', 'docs_url', 'demo_url']) {
      if (row[name] && !safeUrl(row[name])) return flash(message, `${T.invalid_link} (${T[name]})`, false);
    }
    if (row.title.length < 3) return flash(message, `${T.missing} ${T.title_field}`, false);
    if (intent === 'submit') {
      const missing = missingFields({ ...row, type: c.type });
      if (missing.length) return flash(message, `${T.missing} ${fieldLabels(missing)}`, false);
    }

    let saved;
    if (c.id) {
      saved = await sb.from('contributions').update(row).eq('id', c.id).select().single();
    } else {
      saved = await sb.from('contributions').insert({ ...row, type: c.type }).select().single();
    }
    if (saved.error) return flash(message, errorText(saved.error), false);
    c = saved.data;
    window.history.replaceState(null, '', path('/community/submit/', { id: c.id }));
    for (const hook of editorSaveHooks) {
      const hookError = await hook(c, form);
      if (hookError) return flash(message, errorText(hookError), false);
    }
    if (intent === 'submit') {
      const { error } = await sb.rpc('submit_contribution', { p_id: c.id });
      if (error) {
        return flash(message, /incomplete/.test(error.message) ? `${T.missing} ${fieldLabels(error.details)}` : errorText(error), false);
      }
      mount(root, html`<div class="card community-panel">${notice(T.submitted, 'is-ok')}<p><a href="${path('/community/account/')}">${T.sub_account} →</a></p></div>`);
      return;
    }
    flash(message, T.draft_saved, true);
  });
}
// Phase 3 saves knowledge-topic links here; a hook returns an error or null.
const editorSaveHooks = [];

// ── Public contribution page ──────────────────────────────────────────────
function contributionBody(c) {
  const links = [
    ['project_url', T.project], ['docs_url', T.documentation], ['demo_url', T.demo],
  ].map(([k, label]) => [safeUrl(c[k]), label]).filter(([u]) => u);
  return html`
    ${c.type === 'tool' ? html`<dl class="community-facts">
        <div><dt>${T.tool_kind}</dt><dd>${T.tool_kinds[c.tool_kind] || '—'}</dd></div>
        <div><dt>${T.dev_status}</dt><dd>${c.dev_status ? html`<span class="status-badge status-${c.dev_status}">${T.dev_statuses[c.dev_status]}</span>` : '—'}</dd></div>
        <div><dt>${T.licence}</dt><dd>${c.licence || '—'}</dd></div>
      </dl>` : ''}
    ${c.type === 'idea' ? html`<div class="community-evidence"><span class="exploration-status exploration-status-concept">${T.evidence_levels[c.evidence_level] || T.evidence_levels.hypothesis}</span><p>${T.idea_warning}</p></div>` : ''}
    ${links.length ? html`<div class="community-links"><h2>${T.links}</h2><ul>${links.map(([u, label]) => html`<li><a href="${u}" rel="ugc nofollow noopener noreferrer" target="_blank">${label} ↗</a></li>`)}</ul></div>` : ''}
    ${c.type === 'tool' && c.limitations ? html`<h2>${T.limitations}</h2><p class="community-pre">${c.limitations}</p>` : ''}
    ${c.type === 'idea' ? html`<h2>${T.hypothesis}</h2><div class="community-prose">${md(c.hypothesis)}</div>
      ${c.validation_approach ? html`<h2>${T.validation}</h2><p class="community-pre">${c.validation_approach}</p>` : ''}
      ${c.references_md ? html`<h2>${T.references}</h2><div class="community-prose">${md(c.references_md)}</div>` : ''}` : ''}
    ${c.type === 'article' ? html`<div class="community-prose">${md(c.body_md)}</div>` : ''}
    ${c.ai_assisted ? html`<aside class="community-ai"><strong>${T.ai_disclosed}${c.origin === 'agent-assisted' ? html` · ${T.agent_origin}` : ''}</strong><p>${c.ai_disclosure}</p></aside>` : ''}`;
}

async function viewContribution() {
  const slug = params.get('slug');
  if (!slug) return mount(root, notice(T.error_not_found, 'is-error'));
  const { data: c, error } = await sb.from('contributions').select(`*, ${AUTHOR}`).eq('slug', slug).maybeSingle();
  if (error || !c) return mount(root, notice(T.error_not_found, 'is-error'));
  document.title = `${c.title} | ${T.title}`;
  const hero = document.getElementById('community-hero');
  if (hero) {
    mount(hero, html`<span class="section-kicker">${T.community_label} · ${T.types[c.type]}</span>
      <h1>${c.title}</h1><p class="lead">${c.summary}</p>
      <p class="community-byline">${T.by} ${authorLink(c.author)} ${roleBadge(c.author)}
        ${c.published_at ? html`<span>· ${T.published} <time datetime="${c.published_at}">${formatDate(c.published_at, lang)}</time></span>` : ''}
        ${c.edited_at && c.published_at && c.edited_at > c.published_at ? html`<span>· ${T.updated} ${formatDate(c.edited_at, lang)}</span>` : ''}</p>`);
  }
  mount(root, html`<div class="community-detail">
    <article class="community-article">
      ${c.status !== 'published' ? html`<p class="form-message">${statusBadge(c.status)}</p>` : ''}
      <p class="community-disclaimer">${T.community_disclaimer}</p>
      ${domainChips(c.domains)}
      ${contributionBody(c)}
      <div id="contribution-extensions"></div>
    </article>
    <aside class="community-aside" id="related"></aside>
  </div>`);
  for (const fn of contributionExtensions) await fn(c, $('#contribution-extensions'));

  if (c.status === 'published' && c.domains.length) {
    const { data: related } = await sb.from('contributions').select(`id, slug, type, title, summary, domains, published_at, ${AUTHOR}`)
      .eq('status', 'published').neq('id', c.id).overlaps('domains', c.domains)
      .order('published_at', { ascending: false }).limit(3);
    if (related?.length) {
      mount($('#related'), html`<h2>${T.related}</h2>${related.map((r) => html`<a class="community-related" href="${path('/community/contribution/', { slug: r.slug })}">
        <span class="community-type">${T.types[r.type]}</span><strong>${r.title}</strong></a>`)}`);
    }
  }
}
// Phase 3 adds knowledge topics, reporting and discussion here.
const contributionExtensions = [];

// ── Public member profile ─────────────────────────────────────────────────
async function viewMember() {
  const username = (params.get('u') || '').toLowerCase();
  const { data: p } = USERNAME.test(username)
    ? await sb.from('profiles').select('*').eq('username', username).maybeSingle()
    : { data: null };
  if (!p) return mount(root, notice(T.error_not_found, 'is-error'));
  document.title = `${p.display_name} | ${T.title}`;
  const { data: published } = await sb.from('contributions').select(`id, slug, type, title, summary, domains, published_at, ${AUTHOR}`)
    .eq('author_id', p.id).eq('status', 'published').order('published_at', { ascending: false });
  const hero = document.getElementById('community-hero');
  const links = [[safeUrl(p.github_url), 'GitHub'], [safeUrl(p.website_url), T.website_label]].filter(([u]) => u);
  if (hero) {
    mount(hero, html`<div class="community-member-head">${avatar(p, 'xl')}<div>
      <span class="section-kicker">${p.is_official ? T.official : (p.role === 'member' ? T.member : T.moderator)}</span>
      <h1>${p.display_name}</h1><p class="community-muted">@${p.username}${p.affiliation ? html` · ${p.affiliation}` : ''}</p></div></div>`);
  }
  mount(root, html`<div class="community-detail">
    <div class="community-article">
      ${p.bio ? html`<p class="lead">${p.bio}</p>` : ''}
      ${p.interests?.length ? html`<ul class="community-chips">${p.interests.map((i) => html`<li>${i}</li>`)}</ul>` : ''}
      <h2>${T.portfolio}</h2>
      ${published?.length ? html`${TYPES.map((type) => {
        const items = published.filter((c) => c.type === type);
        return items.length ? html`<h3 class="community-group">${T.types_plural[type]}</h3><div class="hub-project-grid community-grid">${items.map(card)}</div>` : '';
      })}` : html`<p class="community-muted">${T.no_published}</p>`}
      <div id="member-extensions"></div>
    </div>
    <aside class="community-aside">
      ${links.length ? html`<ul class="community-plain">${links.map(([u, label]) => html`<li><a href="${u}" rel="ugc nofollow noopener noreferrer" target="_blank">${label} ↗</a></li>`)}</ul>` : ''}
      <p class="community-muted community-small">${T.member_since} ${formatDate(p.created_at, lang)}</p>
      <p class="community-muted community-small">${T.role_note}</p>
    </aside>
  </div>`);
  for (const fn of memberExtensions) await fn(p, published || [], $('#member-extensions'));
}
// Phase 3 adds discussion and contribution history here.
const memberExtensions = [];

// ── Explore ───────────────────────────────────────────────────────────────
async function viewExplore() {
  const state = { type: TYPES.includes(params.get('type')) ? params.get('type') : '', page: 0 };
  mount(root, html`<nav class="community-filters" aria-label="${T.type}">
      <button type="button" data-type=""${raw(state.type ? '' : ' aria-pressed="true"')}>${T.all_types}</button>
      ${TYPES.map((t) => html`<button type="button" data-type="${t}"${raw(state.type === t ? ' aria-pressed="true"' : '')}>${T.types_plural[t]}</button>`)}
    </nav>
    <div class="hub-project-grid community-grid" id="results"></div>
    <p class="community-more"><button type="button" class="btn btn-ghost" id="more" hidden>${T.load_more}</button></p>`);
  const results = $('#results');
  const more = $('#more');

  async function load(reset) {
    if (reset) { state.page = 0; results.innerHTML = ''; }
    let query = sb.from('contributions').select(`id, slug, type, title, summary, domains, published_at, ${AUTHOR}`)
      .eq('status', 'published').order('published_at', { ascending: false })
      .range(state.page * PAGE_SIZE, state.page * PAGE_SIZE + PAGE_SIZE);
    if (state.type) query = query.eq('type', state.type);
    const { data, error } = await query;
    if (error) return mount(results, notice(errorText(error), 'is-error'));
    const page = data.slice(0, PAGE_SIZE);
    if (reset && !page.length) mount(results, html`<p class="explorations-empty">${T.empty}</p>`);
    results.insertAdjacentHTML('beforeend', page.map((c) => card(c).value).join(''));
    more.hidden = data.length <= PAGE_SIZE;
  }
  $$('[data-type]').forEach((b) => b.addEventListener('click', () => {
    state.type = b.dataset.type;
    $$('[data-type]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const q = new URLSearchParams(window.location.search);
    if (state.type) q.set('type', state.type); else q.delete('type');
    window.history.replaceState(null, '', `${window.location.pathname}${q.toString() ? `?${q}` : ''}`);
    load(true);
  }));
  more.addEventListener('click', () => { state.page += 1; load(false); });
  await load(true);
}

// ── Moderation ────────────────────────────────────────────────────────────
const ACTIONS = {
  submitted: ['approve', 'request_changes', 'reject'],
  approved: ['publish', 'request_changes', 'reject'],
  published: ['unpublish'],
  unpublished: ['publish', 'reject'],
};

async function viewModeration(me) {
  if (!me.session) return requireSignIn();
  if (!['moderator', 'admin'].includes(me.profile?.role)) return mount(root, notice(T.not_moderator, 'is-error'));
  const cols = `id, slug, type, title, status, submitted_at, updated_at, published_at, ${AUTHOR}`;
  const [submitted, approved, unpublished, published, extra] = await Promise.all([
    sb.from('contributions').select(cols).eq('status', 'submitted').order('submitted_at'),
    sb.from('contributions').select(cols).eq('status', 'approved').order('updated_at'),
    sb.from('contributions').select(cols).eq('status', 'unpublished').order('updated_at', { ascending: false }).limit(20),
    sb.from('contributions').select(cols).eq('status', 'published').order('published_at', { ascending: false }).limit(10),
    Promise.all(moderationQueues.map((fn) => fn())),
  ]);
  const queue = (title, res) => html`<section class="community-queue"><h3>${title} <span class="community-muted">${res.data?.length || 0}</span></h3>
    ${res.data?.length ? html`<ul>${res.data.map((c) => html`<li><button type="button" class="community-queue-item" data-id="${c.id}">
      <span class="community-type">${T.types[c.type]}</span><strong>${c.title}</strong>
      <span class="community-muted">${c.author?.display_name} · ${formatDate(c.submitted_at || c.updated_at, lang)}</span></button></li>`)}</ul>`
      : html`<p class="community-muted">${T.queue_empty}</p>`}</section>`;

  mount(root, html`<div class="community-moderation">
    <div class="community-queues">
      ${queue(T.queue_submitted, submitted)}${queue(T.queue_approved, approved)}
      ${extra.map((x) => x.html)}
      ${queue(T.queue_unpublished, unpublished)}${queue(T.queue_published, published)}
      ${me.profile.role === 'admin' ? html`<section class="community-queue"><h3>${T.roles_title}</h3>
        <form class="aipe-form community-inline-form" id="roles-form">
          <input name="username" type="text" placeholder="${T.username}" required>
          <select name="role">${options(['member', 'moderator', 'admin'], { member: T.member, moderator: T.moderator, admin: 'Admin' }, 'member')}</select>
          <label class="community-small"><input type="checkbox" name="official"> ${T.official}</label>
          <button class="btn btn-ghost" type="submit">${T.roles_apply}</button></form>
        <p class="form-message" id="roles-message" hidden></p></section>` : ''}
    </div>
    <div class="card community-panel community-review" id="review"><p class="community-muted">${T.moderation_intro}</p></div>
  </div>`);

  $$('.community-queue-item').forEach((b) => b.addEventListener('click', () => openReview(b.dataset.id)));
  extra.forEach((x) => x.bind?.(root));
  $('#roles-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const f = event.currentTarget;
    const { error } = await sb.rpc('set_member_role', { p_username: f.username.value.trim(), p_role: f.role.value, p_official: f.official.checked });
    flash($('#roles-message'), error ? errorText(error) : T.saved, !error);
  });
  if (params.get('id')) openReview(params.get('id'));
}
// Phase 3 adds the reports queue here; each returns {html, bind}.
const moderationQueues = [];

async function openReview(id) {
  const panel = $('#review');
  const [{ data: c }, { data: events }] = await Promise.all([
    sb.from('contributions').select(`*, ${AUTHOR}`).eq('id', id).single(),
    sb.from('moderation_events').select('action, from_status, to_status, note, created_at, actor_id').eq('target_type', 'contribution').eq('target_id', id).order('created_at'),
  ]);
  if (!c) return mount(panel, notice(T.error_not_found, 'is-error'));
  mount(panel, html`<div class="community-panel-head"><h2>${c.title}</h2>${statusBadge(c.status)}</div>
    <p class="community-muted">${T.types[c.type]} · ${T.by} ${c.author?.display_name} (@${c.author?.username}) · ${T.languages[c.lang]}</p>
    <p class="lead">${c.summary}</p>${domainChips(c.domains)}
    <div class="community-review-body">${contributionBody(c)}</div>
    <div id="review-extensions"></div>
    ${ACTIONS[c.status] ? html`<form class="aipe-form" id="review-form">
      ${field('note', T.note, textArea('note', '', 3, 2000), T.note_hint)}
      <div class="community-actions">${ACTIONS[c.status].map((a) => html`<button class="btn ${a === 'approve' || a === 'publish' ? 'btn-primary' : 'btn-ghost'}" type="submit" data-act="${a}">${T[`act_${a}`]}</button>`)}</div>
      <p class="form-message" id="review-message" hidden></p></form>` : ''}
    <h3>${T.history}</h3>
    <ol class="community-history">${(events || []).map((e) => html`<li><time>${formatDate(e.created_at, lang)}</time> ${e.action}: ${T.statuses[e.from_status] || e.from_status || ''} → ${T.statuses[e.to_status] || e.to_status || ''}${e.note ? html` — ${e.note}` : ''}</li>`)}</ol>`);
  for (const fn of reviewExtensions) await fn(c, $('#review-extensions'));
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  let act = null;
  $$('[data-act]', panel).forEach((b) => b.addEventListener('click', () => { act = b.dataset.act; }));
  $('#review-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const note = event.currentTarget.note.value.trim();
    const { error } = await sb.rpc('review_contribution', { p_id: c.id, p_action: act, p_note: note || null });
    if (error) return flash($('#review-message'), /note_required/.test(error.message) ? T.note_hint : errorText(error), false);
    viewModeration(await currentUser()).then(() => openReview(c.id));
  });
}
// Phase 3 adds curation of knowledge-topic links here.
const reviewExtensions = [];

// ── Start ─────────────────────────────────────────────────────────────────
const VIEWS = {
  join: viewJoin, account: viewAccount, submit: viewSubmit, contribution: viewContribution,
  member: viewMember, explore: viewExplore, moderation: viewModeration,
};

async function start() {
  keepQueryOnLanguageSwitch();
  if (!sb) {
    mount(root, notice(T.not_configured));
    return;
  }
  const me = await currentUser();
  renderSubnav(me);
  sb.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') drawPasswordReset();
  });
  try {
    await VIEWS[root.dataset.view]?.(me);
  } catch (error) {
    console.error(error);
    mount(root, notice(T.error_generic, 'is-error'));
  }
}

export const extensions = { exportHooks, editorExtensions, editorSaveHooks, contributionExtensions, memberExtensions, moderationQueues, reviewExtensions };
export { sb, T, lang, path, html, raw, mount, notice, flash, errorText, card, authorLink, statusBadge, md, escapeHtml, formatDate, currentUser };

// Let extension modules (Phase 3) register before the view renders.
window.addEventListener('DOMContentLoaded', () => { start(); }, { once: true });
