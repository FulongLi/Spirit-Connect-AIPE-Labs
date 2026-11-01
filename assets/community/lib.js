// Pure helpers for the AIPE Community pages: escaping, safe links, sanitised
// Markdown and client-side validation. No DOM or network access here, so the
// module is unit-tested under Node (tests/community/client.test.mjs).
// The database enforces the same rules; these checks only give early feedback.

export const TYPES = ['tool', 'idea', 'article'];
export const DOMAINS = ['devices', 'magnetics', 'converters', 'control', 'storage', 'microgrids', 'systems', 'cross-domain'];
export const TOOL_KINDS = ['ai-agent', 'aigc-tool', 'simulation', 'utility', 'dataset', 'design-resource'];
export const DEV_STATUSES = ['concept', 'prototype', 'beta', 'stable', 'archived'];
export const EVIDENCE_LEVELS = ['hypothesis', 'preliminary', 'published-elsewhere'];
export const USERNAME = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"'`]/g, (c) => ESCAPES[c]);
}

// Marks a string as already-safe HTML for the `html` template tag.
export class Raw {
  constructor(value) { this.value = String(value); }
}
export const raw = (value) => new Raw(value);

// Tagged template that escapes every interpolated value unless wrapped in
// raw(); arrays are joined, null/undefined/false render as nothing.
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, i) => {
    out += render(value) + strings[i + 1];
  });
  return raw(out);
}
function render(value) {
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  if (value === null || value === undefined || value === false) return '';
  return escapeHtml(value);
}

// Only absolute http(s) URLs without whitespace or markup characters.
export function safeUrl(value) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!/^https?:\/\/[^\s<>"'`]+$/i.test(url) || url.length > 500) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

export const SANITIZE = {
  ALLOWED_TAGS: ['a', 'p', 'br', 'hr', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'del', 'code', 'pre',
    'blockquote', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'sup', 'sub'],
  ALLOWED_ATTR: ['href', 'title', 'align', 'start'],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|#)/i,
  ALLOW_DATA_ATTR: false,
};

// Markdown → sanitised HTML. Raw HTML in the source is escaped rather than
// passed through; images are not rendered; every link opens safely and
// carries rel="ugc nofollow noopener noreferrer". h1 is demoted to h2 so a
// contribution cannot replace the page heading.
export function renderMarkdown(source, { marked, DOMPurify }) {
  const renderer = {
    html: ({ text }) => escapeHtml(text),
    image: ({ href, text }) => escapeHtml(text || href || ''),
    heading(token) {
      const level = Math.max(2, token.depth);
      return `<h${level}>${this.parser.parseInline(token.tokens)}</h${level}>`;
    },
  };
  const instance = new marked.Marked({ gfm: true, breaks: false, renderer });
  const dirty = instance.parse(String(source ?? ''), { async: false });
  const purifier = DOMPurify;
  purifier.addHook('afterSanitizeAttributes', linkHook);
  try {
    return purifier.sanitize(dirty, SANITIZE);
  } finally {
    purifier.removeHook('afterSanitizeAttributes');
  }
}
function linkHook(node) {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('mailto:')) return;
    node.setAttribute('rel', 'ugc nofollow noopener noreferrer');
    node.setAttribute('target', '_blank');
  }
}

export function parseList(text, max = 12) {
  return String(text ?? '').split(/[,，\n]/).map((s) => s.trim()).filter(Boolean).slice(0, max);
}

// Mirrors public.contribution_missing_fields() in the database.
export function missingFields(c) {
  const missing = [];
  const blank = (v) => !String(v ?? '').trim();
  if (String(c.summary ?? '').trim().length < 20) missing.push('summary');
  if (!c.domains || c.domains.length === 0) missing.push('domains');
  if (c.ai_assisted && blank(c.ai_disclosure)) missing.push('ai_disclosure');
  if (c.type === 'tool') {
    if (!c.tool_kind) missing.push('tool_kind');
    if (!c.project_url) missing.push('project_url');
    if (!c.dev_status) missing.push('dev_status');
    if (blank(c.licence)) missing.push('licence');
    if (blank(c.limitations)) missing.push('limitations');
  } else if (c.type === 'idea') {
    if (String(c.hypothesis ?? '').trim().length < 50) missing.push('hypothesis');
    if (!c.evidence_level) missing.push('evidence_level');
    if (['preliminary', 'published-elsewhere'].includes(c.evidence_level) && blank(c.references_md)) missing.push('references_md');
  } else if (c.type === 'article') {
    if (String(c.body_md ?? '').trim().length < 200) missing.push('body_md');
  }
  return missing;
}

// Maps a Supabase / PostgREST error to a message key in _data/community.yml.
export function errorKey(error) {
  const text = `${error?.message ?? ''} ${error?.code ?? ''}`;
  if (/rate_limited|over_email_send_rate_limit|429/.test(text)) return 'error_rate_limited';
  if (/forbidden|permission denied|42501|own_contribution/.test(text)) return 'error_forbidden';
  if (/not_found|P0002|PGRST116/.test(text)) return 'error_not_found';
  return 'error_generic';
}

export function formatDate(iso, lang) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
      .format(new Date(iso));
  } catch {
    return String(iso).slice(0, 10);
  }
}
