// AIPE Community, Phase 3: discussion, reporting, knowledge-topic links,
// curation and member history. Registers extensions with app.js before the
// page's view renders. Permissions are enforced by the database
// (supabase/migrations/20261101000400_community_interaction.sql).
import {
  $, $$, T, authorLink, currentUser, errorText, extensions, flash, formatDate, html, lang, mount, notice, options, path, raw, sb,
} from './app.js';

const MAX_TOPICS = 8;
const topicTitle = (t) => (lang === 'zh' ? t.title_zh : t.title_en);
let topicCache = null;
async function allTopics() {
  if (!topicCache) {
    const { data } = await sb.from('knowledge_topics').select('id, subject, title_en, title_zh, retired').order('id');
    topicCache = data || [];
  }
  return topicCache;
}

function topicChips(links, topics) {
  const byId = new Map(topics.map((t) => [t.id, t]));
  return html`<ul class="community-chips community-topics">${links.map((l) => {
    const t = byId.get(l.topic_id);
    if (!t) return '';
    return html`<li><a href="${path('/community/explore/', { topic: t.id })}">${topicTitle(t)}</a>
      <a class="community-topic-academy" href="${path(`/academy/${t.subject}/`)}" title="${T.subjects[t.subject]}">↗</a></li>`;
  })}</ul>`;
}

// ── Report dialog (contributions and comments) ────────────────────────────
function reportForm(targetType, targetId) {
  return html`<form class="aipe-form community-report" data-report="${targetType}:${targetId}" hidden>
    <strong>${T.report_title}</strong>
    <label class="visually-hidden" for="rr-${targetId}">${T.report_reason}</label>
    <select id="rr-${targetId}" name="reason" required>${options(Object.keys(T.report_reasons), T.report_reasons, '', T.report_reason)}</select>
    <label class="visually-hidden" for="rd-${targetId}">${T.report_details}</label>
    <textarea id="rd-${targetId}" name="details" rows="2" maxlength="1000" placeholder="${T.report_details}"></textarea>
    <div class="community-actions"><button class="btn btn-ghost" type="submit">${T.report_send}</button>
      <button class="link-button" type="button" data-cancel>${T.cancel}</button></div>
    <p class="form-message" hidden></p></form>`;
}
function bindReports(scope, me) {
  $$('[data-open-report]', scope).forEach((button) => button.addEventListener('click', () => {
    if (!me.session) return window.location.assign(path('/community/join/', { next: window.location.pathname + window.location.search }));
    const form = scope.querySelector(`[data-report="${button.dataset.openReport}"]`);
    form.hidden = !form.hidden;
  }));
  $$('[data-report]', scope).forEach((form) => {
    form.querySelector('[data-cancel]').addEventListener('click', () => { form.hidden = true; });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const [targetType, targetId] = form.dataset.report.split(':');
      const message = form.querySelector('.form-message');
      if (!form.reason.value) return flash(message, T.report_reason, false);
      const { error } = await sb.from('reports').insert({ target_type: targetType, target_id: targetId, reason: form.reason.value, details: form.details.value.trim() });
      if (error && error.code !== '23505') return flash(message, errorText(error), false);
      flash(message, T.report_sent, true);
      form.querySelector('button[type="submit"]').disabled = true;
    });
  });
}

// ── Contribution page: topics, report, discussion ─────────────────────────
extensions.contributionExtensions.push(async (c, slot) => {
  const me = await currentUser();
  const [{ data: links }, topics] = await Promise.all([
    sb.from('contribution_topics').select('topic_id, curated').eq('contribution_id', c.id),
    allTopics(),
  ]);
  slot.insertAdjacentHTML('beforeend', html`
    ${links?.length ? html`<h2>${T.topics}</h2>${topicChips(links, topics)}` : ''}
    ${c.status === 'published' ? html`<p class="community-report-link"><button type="button" class="link-button" data-open-report="contribution:${c.id}">${T.report}</button></p>
      ${reportForm('contribution', c.id)}
      <section class="community-discussion" id="discussion"><h2>${T.discussion}</h2>
        <p class="community-muted community-small">${T.discussion_intro}</p><div id="comments"></div><div id="comment-new"></div></section>` : ''}`.value);
  bindReports(slot, me);
  if (c.status === 'published') await renderDiscussion(c, me);
});

async function renderDiscussion(c, me) {
  const { data: comments, error } = await sb.from('comments')
    .select('id, parent_id, body, status, created_at, edited_at, author_id, author:profiles!comments_author_id_fkey(username, display_name, avatar_url, role, is_official)')
    .eq('contribution_id', c.id).order('created_at');
  const list = $('#comments');
  if (error) return mount(list, notice(errorText(error), 'is-error'));
  const uid = me.session?.user.id;
  const top = comments.filter((x) => !x.parent_id || !comments.some((p) => p.id === x.parent_id));
  const replies = (id) => comments.filter((x) => x.parent_id === id);
  const item = (x, canReply) => html`<li class="community-comment" data-comment="${x.id}">
    <div class="community-comment-head">${x.status === 'deleted' ? html`<span class="community-muted">—</span>` : authorLink(x.author)}
      <time datetime="${x.created_at}">${formatDate(x.created_at, lang)}</time>${x.edited_at && x.status === 'visible' ? html`<span class="community-muted">· ${T.edited}</span>` : ''}</div>
    ${x.status === 'deleted' ? html`<p class="community-muted">${T.comment_deleted}</p>`
      : html`${x.status === 'hidden' ? html`<p class="form-message">${T.comment_hidden}</p>` : ''}<p class="community-comment-body">${x.body}</p>`}
    ${x.status === 'visible' ? html`<div class="community-comment-actions">
      ${canReply && uid ? html`<button type="button" class="link-button" data-reply>${T.reply}</button>` : ''}
      ${x.author_id === uid ? html`<button type="button" class="link-button" data-edit>${T.edit}</button><button type="button" class="link-button is-danger" data-delete>${T.delete}</button>` : ''}
      ${x.author_id !== uid ? html`<button type="button" class="link-button" data-open-report="comment:${x.id}">${T.report}</button>` : ''}
    </div>${x.author_id !== uid ? reportForm('comment', x.id) : ''}` : ''}
    ${canReply ? html`<ol class="community-replies">${replies(x.id).map((r) => item(r, false))}</ol>` : ''}
  </li>`;
  mount(list, comments.length ? html`<ol class="community-comments">${top.map((x) => item(x, true))}</ol>` : html`<p class="community-muted">${T.comments_none}</p>`);
  mount($('#comment-new'), uid ? commentForm('new', T.comment_label, T.comment_post)
    : html`<p><a href="${path('/community/join/', { next: `${window.location.pathname}${window.location.search}#discussion` })}">${T.sign_in_to_comment}</a></p>`);

  const refresh = () => renderDiscussion(c, me);
  bindCommentForm($('#comment-new form'), async (body) => sb.from('comments').insert({ contribution_id: c.id, body }), refresh);
  bindReports(list, me);
  $$('[data-reply]', list).forEach((b) => b.addEventListener('click', () => {
    const li = b.closest('[data-comment]');
    if (li.querySelector(':scope > form.community-comment-form')) return;
    li.querySelector('.community-comment-actions').insertAdjacentHTML('afterend', commentForm('reply', T.reply_label, T.reply).value);
    const form = li.querySelector(':scope > form.community-comment-form');
    bindCommentForm(form, async (body) => sb.from('comments').insert({ contribution_id: c.id, parent_id: li.dataset.comment, body }), refresh);
    form.body.focus();
  }));
  $$('[data-edit]', list).forEach((b) => b.addEventListener('click', () => {
    const li = b.closest('[data-comment]');
    const current = comments.find((x) => x.id === li.dataset.comment);
    const bodyEl = li.querySelector(':scope > .community-comment-body');
    bodyEl.hidden = true;
    bodyEl.insertAdjacentHTML('afterend', commentForm('edit', T.edit, T.save, current.body).value);
    const form = li.querySelector(':scope > form.community-comment-form');
    bindCommentForm(form, async (body) => sb.from('comments').update({ body }).eq('id', current.id), refresh, () => { form.remove(); bodyEl.hidden = false; });
  }));
  $$('[data-delete]', list).forEach((b) => b.addEventListener('click', async () => {
    if (!window.confirm(T.confirm_delete_comment)) return;
    const { error: err } = await sb.rpc('delete_comment', { p_id: b.closest('[data-comment]').dataset.comment });
    if (err) return window.alert(errorText(err));
    refresh();
  }));
}

function commentForm(kind, label, submit, value = '') {
  return html`<form class="aipe-form community-comment-form" data-kind="${kind}">
    <label class="contact-label" for="cm-${kind}">${label}</label>
    <textarea id="cm-${kind}" name="body" rows="${kind === 'new' ? 4 : 3}" maxlength="4000" required>${value}</textarea>
    <div class="community-actions"><button class="btn btn-primary" type="submit">${submit}</button>
      ${kind !== 'new' ? html`<button class="link-button" type="button" data-cancel>${T.cancel}</button>` : ''}</div>
    <p class="form-message" hidden></p></form>`;
}
function bindCommentForm(form, save, done, cancel) {
  if (!form) return;
  form.querySelector('[data-cancel]')?.addEventListener('click', () => (cancel ? cancel() : form.remove()));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const body = form.body.value.trim();
    const message = form.querySelector('.form-message');
    if (body.length < 2) return flash(message, T.comment_label, false);
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    const { error } = await save(body);
    button.disabled = false;
    if (error) return flash(message, /too_many_links/.test(error.message) ? T.comment_too_many_links : errorText(error), false);
    done();
  });
}

// ── Editor: knowledge-topic picker ────────────────────────────────────────
let editorLinks = [];
extensions.editorExtensions.push(async (c) => {
  const slot = $('#editor-extensions');
  const topics = (await allTopics());
  editorLinks = [];
  if (c.id) {
    const { data } = await sb.from('contribution_topics').select('topic_id, curated').eq('contribution_id', c.id);
    editorLinks = data || [];
  }
  const selected = new Set(editorLinks.map((l) => l.topic_id));
  mount(slot, html`<fieldset class="contact-field community-topic-picker"><legend class="contact-label">${T.topics}</legend>
    <p class="form-hint">${T.topics_hint}</p>
    <input type="search" class="community-topic-filter" placeholder="${T.topics_filter}" aria-label="${T.topics_filter}">
    <div class="community-topic-groups">${Object.keys(T.subjects).map((subject) => html`<div class="community-topic-group"><strong>${T.subjects[subject]}</strong>
      ${topics.filter((t) => t.subject === subject && (!t.retired || selected.has(t.id))).map((t) => html`<label data-topic-label="${topicTitle(t).toLowerCase()} ${t.id}">
        <input type="checkbox" name="topics" value="${t.id}"${raw(selected.has(t.id) ? ' checked' : '')}${raw(editorLinks.some((l) => l.topic_id === t.id && l.curated) ? ' disabled' : '')}> ${topicTitle(t)}</label>`)}</div>`)}
    </div></fieldset>`);
  const boxes = $$('input[name="topics"]', slot);
  const enforce = () => {
    const count = boxes.filter((b) => b.checked).length;
    boxes.forEach((b) => { if (!b.checked) b.disabled = count >= MAX_TOPICS; });
  };
  boxes.forEach((b) => b.addEventListener('change', enforce));
  enforce();
  $('.community-topic-filter', slot).addEventListener('input', (event) => {
    const term = event.target.value.trim().toLowerCase();
    $$('[data-topic-label]', slot).forEach((label) => { label.hidden = term && !label.dataset.topicLabel.includes(term); });
  });
});
extensions.editorSaveHooks.push(async (c, form) => {
  const wanted = new Set($$('input[name="topics"]:checked', form).map((b) => b.value));
  const existing = new Set(editorLinks.map((l) => l.topic_id));
  const add = [...wanted].filter((t) => !existing.has(t));
  const remove = editorLinks.filter((l) => !wanted.has(l.topic_id) && !l.curated).map((l) => l.topic_id);
  if (remove.length) {
    const { error } = await sb.from('contribution_topics').delete().eq('contribution_id', c.id).in('topic_id', remove);
    if (error) return error;
  }
  if (add.length) {
    const { error } = await sb.from('contribution_topics').insert(add.map((topic_id) => ({ contribution_id: c.id, topic_id })));
    if (error) return error;
  }
  editorLinks = editorLinks.filter((l) => !remove.includes(l.topic_id)).concat(add.map((topic_id) => ({ topic_id, curated: false })));
  return null;
});

// ── Moderation: topic curation and reports queue ──────────────────────────
async function curationPanel(c, slot) {
  const [{ data: links }, topics] = await Promise.all([
    sb.from('contribution_topics').select('topic_id, curated').eq('contribution_id', c.id).order('topic_id'), allTopics(),
  ]);
  if (!links?.length) return;
  const byId = new Map(topics.map((t) => [t.id, t]));
  mount(slot, html`<h3>${T.topics}</h3><ul class="community-curation">${links.map((l) => html`<li>
      <span>${topicTitle(byId.get(l.topic_id) || { title_en: l.topic_id, title_zh: l.topic_id })}${l.curated ? html` · <strong>${T.topic_curated}</strong>` : ''}</span>
      ${c.status === 'published' ? html`<button type="button" class="link-button" data-curate="${l.topic_id}" data-value="${String(!l.curated)}">${l.curated ? T.topic_uncurate : T.topic_curate}</button>` : ''}
    </li>`)}</ul><p class="community-muted community-small">${T.topics_curation_note}</p>`);
  $$('[data-curate]', slot).forEach((b) => b.addEventListener('click', async () => {
    const { error } = await sb.rpc('curate_topic', { p_contribution: c.id, p_topic: b.dataset.curate, p_curated: b.dataset.value === 'true' });
    if (error) return window.alert(errorText(error));
    curationPanel(c, slot);
  }));
}
extensions.reviewExtensions.push(curationPanel);

extensions.moderationQueues.push(async () => {
  const { data: reports } = await sb.from('reports').select('id, target_type, target_id, reason, details, created_at').eq('status', 'open').order('created_at');
  const ids = (type) => (reports || []).filter((r) => r.target_type === type).map((r) => r.target_id);
  const [{ data: comments }, { data: contributions }] = await Promise.all([
    ids('comment').length ? sb.from('comments').select('id, body, status, contribution:contributions!comments_contribution_id_fkey(slug, title)').in('id', ids('comment')) : { data: [] },
    ids('contribution').length ? sb.from('contributions').select('id, slug, title').in('id', ids('contribution')) : { data: [] },
  ]);
  const target = (r) => {
    if (r.target_type === 'comment') {
      const cm = (comments || []).find((x) => x.id === r.target_id);
      return cm ? html`<blockquote>${cm.body.slice(0, 280)}</blockquote>${cm.contribution ? html`<a href="${path('/community/contribution/', { slug: cm.contribution.slug })}#discussion">${cm.contribution.title}</a>` : ''}` : '—';
    }
    const ct = (contributions || []).find((x) => x.id === r.target_id);
    return ct ? html`<a href="${path('/community/contribution/', { slug: ct.slug })}">${ct.title}</a>` : '—';
  };
  return {
    html: html`<section class="community-queue"><h3>${T.queue_reports} <span class="community-muted">${reports?.length || 0}</span></h3>
      ${reports?.length ? html`<ul>${reports.map((r) => html`<li class="community-report-item" data-report-id="${r.id}">
        <span class="community-type">${T.report_reasons[r.reason]}</span>
        <span class="community-muted">${T.report_target}: ${r.target_type === 'comment' ? T.discussion : T.community_label} · ${formatDate(r.created_at, lang)}</span>
        ${target(r)}${r.details ? html`<p class="community-small">${r.details}</p>` : ''}
        <div class="community-mine-actions">
          ${r.target_type === 'comment' ? html`<button type="button" class="link-button" data-hide-comment="${r.target_id}">${T.act_hide_comment}</button>` : ''}
          <button type="button" class="link-button" data-resolve="actioned">${T.act_actioned}</button>
          <button type="button" class="link-button" data-resolve="dismissed">${T.act_dismissed}</button>
        </div></li>`)}</ul>` : html`<p class="community-muted">${T.queue_empty}</p>`}</section>`,
    bind(scope) {
      $$('[data-hide-comment]', scope).forEach((b) => b.addEventListener('click', async () => {
        const note = window.prompt(T.note_hint);
        if (!note) return;
        const { error } = await sb.rpc('moderate_comment', { p_id: b.dataset.hideComment, p_action: 'hide', p_note: note });
        if (error) return window.alert(errorText(error));
        b.disabled = true;
      }));
      $$('[data-resolve]', scope).forEach((b) => b.addEventListener('click', async () => {
        const li = b.closest('[data-report-id]');
        const { error } = await sb.rpc('resolve_report', { p_id: li.dataset.reportId, p_outcome: b.dataset.resolve, p_note: null });
        if (error) return window.alert(errorText(error));
        li.remove();
      }));
    },
  };
});

// ── Member profile: discussions and history ───────────────────────────────
extensions.memberExtensions.push(async (p, published, slot) => {
  const { data: comments } = await sb.from('comments')
    .select('id, body, created_at, status, contribution:contributions!comments_contribution_id_fkey(slug, title, status)')
    .eq('author_id', p.id).eq('status', 'visible').order('created_at', { ascending: false }).limit(10);
  const visible = (comments || []).filter((x) => x.contribution?.status === 'published');
  const byYear = {};
  for (const c of published) (byYear[c.published_at.slice(0, 4)] ||= []).push(c);
  mount(slot, html`
    <h2>${T.member_discussions}</h2>
    ${visible.length ? html`<ul class="community-member-comments">${visible.map((x) => html`<li>
      <p>${x.body.length > 240 ? `${x.body.slice(0, 240)}…` : x.body}</p>
      <span class="community-muted community-small">${T.commented_on} <a href="${path('/community/contribution/', { slug: x.contribution.slug })}#discussion">${x.contribution.title}</a> · ${formatDate(x.created_at, lang)}</span>
    </li>`)}</ul>` : html`<p class="community-muted">${T.member_discussions_none}</p>`}
    ${published.length ? html`<h2>${T.member_history}</h2><ol class="community-timeline">${Object.keys(byYear).sort().reverse().map((year) => html`<li><strong>${year}</strong><ul>
      ${byYear[year].map((c) => html`<li><time datetime="${c.published_at}">${formatDate(c.published_at, lang)}</time> · ${T.types[c.type]} ·
        <a href="${path('/community/contribution/', { slug: c.slug })}">${c.title}</a></li>`)}</ul></li>`)}</ol>` : ''}`);
});

// ── Data export: comments and reports ─────────────────────────────────────
extensions.exportHooks.push(async (uid) => {
  const [comments, reports] = await Promise.all([
    sb.from('comments').select('*').eq('author_id', uid),
    sb.from('reports').select('*').eq('reporter_id', uid),
  ]);
  return { comments: comments.data, reports: reports.data };
});
