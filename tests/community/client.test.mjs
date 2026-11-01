// Client-side helpers: escaping, safe URLs and Markdown sanitisation, using the
// same vendored marked and DOMPurify builds that the pages load.
import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { Marked } from "marked";
import createDOMPurify from "dompurify";
import { errorKey, escapeHtml, html, missingFields, parseList, raw, renderMarkdown, safeUrl } from "../../assets/community/lib.js";

const window = new JSDOM("").window;
const libs = { marked: { Marked }, DOMPurify: createDOMPurify(window) };
const md = (source) => renderMarkdown(source, libs);

test("escaping and the html template tag", () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert('1')">`), "&lt;img src=x onerror=&quot;alert(&#39;1&#39;)&quot;&gt;");
  const name = "<b>Mallory</b>";
  assert.equal(html`<p>${name}</p>`.value, "<p>&lt;b&gt;Mallory&lt;/b&gt;</p>");
  assert.equal(html`<p>${raw("<em>ok</em>")}${null}${false}${["a", "<"]}</p>`.value, "<p><em>ok</em>a&lt;</p>");
});

test("only http(s) URLs are accepted as links", () => {
  assert.equal(safeUrl("https://github.com/aipe/tool"), "https://github.com/aipe/tool");
  for (const bad of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,<script>", "//evil.example",
    "https://x.example/\"><script>", "ftp://x.example", " https://a b", null, 7]) {
    assert.equal(safeUrl(bad), null, String(bad));
  }
});

test("Markdown rendering removes scripts, handlers and dangerous links", () => {
  const out = md([
    "# Title", "<script>alert(1)</script>", "<img src=x onerror=alert(1)>",
    "[click](javascript:alert(1))", "[ok](https://example.org)", "![pic](https://example.org/a.png)",
    "<a href=\"https://x\" onclick=\"alert(1)\">x</a>", "<iframe src=\"https://evil\"></iframe>",
    "```\ncode <b>\n```", "| a | b |\n|---|---|\n| 1 | 2 |",
  ].join("\n\n"));
  const doc = new JSDOM(`<body>${out}</body>`).window.document;
  assert.equal(doc.querySelectorAll("script, img, iframe, style, form, input").length, 0, out);
  for (const el of doc.querySelectorAll("*")) {
    for (const attr of el.attributes) assert.ok(!/^on/i.test(attr.name), `${attr.name} on ${el.tagName}`);
  }
  for (const a of doc.querySelectorAll("a[href]")) assert.match(a.getAttribute("href"), /^(https?:|mailto:|#)/);
  assert.match(out, /<h2>Title<\/h2>/, "h1 is demoted");
  assert.match(out, /<a href="https:\/\/example.org" rel="ugc nofollow noopener noreferrer" target="_blank">ok<\/a>/);
  assert.match(out, /&lt;script&gt;/, "raw HTML is shown as text");
  assert.match(out, /<table>/);
  assert.match(out, /code &lt;b&gt;/);
});

test("client validation mirrors the database", () => {
  assert.deepEqual(missingFields({ type: "tool", summary: "short", domains: [] }),
    ["summary", "domains", "tool_kind", "project_url", "dev_status", "licence", "limitations"]);
  assert.deepEqual(missingFields({ type: "idea", summary: "x".repeat(25), domains: ["control"],
    hypothesis: "h".repeat(60), evidence_level: "preliminary" }), ["references_md"]);
  assert.deepEqual(missingFields({ type: "article", summary: "x".repeat(25), domains: ["control"],
    body_md: "b".repeat(250), ai_assisted: true }), ["ai_disclosure"]);
  assert.deepEqual(parseList("GaN, SiC，DAB\n "), ["GaN", "SiC", "DAB"]);
});

test("error mapping", () => {
  assert.equal(errorKey({ message: "rate_limited" }), "error_rate_limited");
  assert.equal(errorKey({ message: "forbidden", code: "42501" }), "error_forbidden");
  assert.equal(errorKey({ code: "PGRST116" }), "error_not_found");
  assert.equal(errorKey(null), "error_generic");
});
