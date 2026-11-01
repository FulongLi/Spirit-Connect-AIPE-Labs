// Comments, reports, search and knowledge-topic links (Phase 3), run against
// the real migrations in PGlite.
import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { anon, as, createDatabase, createUser, rejects, service } from "./support/db.mjs";

let db, alice, bob, mod, published, draftId;
const rpc = (uid, fn, ...args) =>
  as(db, uid, `select public.${fn}(${args.map((_, i) => `$${i + 1}`).join(",")}) as r`, args).then((r) => r.rows[0].r);

async function contribution(uid, fields, publish) {
  const row = { type: "article", title: "Dual active bridge control", summary: "A summary that is long enough to submit.",
    domains: ["converters", "control"], body_md: "Single phase shift modelling and control of a DAB converter. ".repeat(5), ...fields };
  const cols = Object.keys(row);
  const { rows } = await as(db, uid, `insert into public.contributions (${cols}) values (${cols.map((_, i) => `$${i + 1}`)}) returning id`, Object.values(row));
  if (publish) {
    await rpc(uid, "submit_contribution", rows[0].id);
    await rpc(mod, "review_contribution", rows[0].id, "approve", null);
    await rpc(mod, "review_contribution", rows[0].id, "publish", null);
  }
  return rows[0].id;
}
const comment = (uid, cid, body, parent = null) =>
  as(db, uid, "insert into public.comments (contribution_id, body, parent_id) values ($1, $2, $3) returning id", [cid, body, parent])
    .then((r) => r.rows[0].id);

before(async () => {
  db = await createDatabase();
  alice = await createUser(db, { username: "alice" });
  bob = await createUser(db, { username: "bob" });
  mod = await createUser(db, { username: "mod" });
  await service(db, "update public.profiles set role = 'moderator' where id = $1", [mod]);
  published = await contribution(alice, {}, true);
  draftId = await contribution(alice, { title: "Private draft about magnetics", domains: ["magnetics"] }, false);
});

describe("comments", () => {
  test("members discuss published work with one level of replies", async () => {
    const top = await comment(bob, published, "How did you measure the ZVS boundary?");
    const reply = await comment(alice, published, "With a double-pulse test at three load points.", top);
    await rejects(comment(bob, published, "Nested too deep", reply), /invalid_parent/);
    const other = await contribution(alice, { title: "Another article" }, true);
    await rejects(comment(bob, other, "Wrong thread", top), /invalid_parent/);
    const { rows } = await anon(db, "select body, parent_id from public.comments where contribution_id = $1 order by created_at", [published]);
    assert.equal(rows.length, 2);
    assert.equal(rows[1].parent_id, top);
  });

  test("no comments on unpublished work, and none from anonymous visitors", async () => {
    await rejects(comment(bob, draftId, "Can I see this?"), /not_published|row-level security/);
    await rejects(anon(db, "insert into public.comments (contribution_id, body) values ($1, 'anon')", [published]), /permission denied/);
    await rejects(as(db, bob, "insert into public.comments (contribution_id, body, author_id) values ($1, 'forged', $2)", [published, alice]), /permission denied/);
    await rejects(as(db, bob, "insert into public.comments (contribution_id, body, status) values ($1, 'x', 'hidden')", [published]), /permission denied/);
  });

  test("authors edit and delete only their own comments", async () => {
    const id = await comment(bob, published, "Typo in equation 3?");
    await as(db, bob, "update public.comments set body = 'Typo in equation (3)?' where id = $1", [id]);
    const { rows } = await anon(db, "select body, edited_at from public.comments where id = $1", [id]);
    assert.equal(rows[0].body, "Typo in equation (3)?");
    assert.ok(rows[0].edited_at);
    assert.equal((await as(db, alice, "update public.comments set body = 'hijacked' where id = $1", [id])).affectedRows, 0);
    await rejects(rpc(alice, "delete_comment", id), /not_found/);
    await rpc(bob, "delete_comment", id);
    const after = (await anon(db, "select body, status from public.comments where id = $1", [id])).rows[0];
    assert.deepEqual(after, { body: "", status: "deleted" }, "placeholder keeps the thread shape");
    await rejects(as(db, bob, "delete from public.comments where id = $1", [id]), /permission denied/);
  });

  test("moderators hide and restore comments with an audit record", async () => {
    const id = await comment(bob, published, "Buy cheap transformers at spam.example");
    await rejects(rpc(bob, "moderate_comment", id, "hide", "spam"), /forbidden/);
    await rejects(rpc(mod, "moderate_comment", id, "hide", ""), /note_required/);
    assert.equal(await rpc(mod, "moderate_comment", id, "hide", "Spam."), "hidden");
    assert.equal((await anon(db, "select 1 from public.comments where id = $1", [id])).rows.length, 0);
    assert.equal((await as(db, bob, "select 1 from public.comments where id = $1", [id])).rows.length, 1, "author still sees it");
    assert.equal(await rpc(mod, "moderate_comment", id, "restore", null), "visible");
    const log = await as(db, mod, "select action from public.moderation_events where target_id = $1 order by id", [id]);
    assert.deepEqual(log.rows.map((r) => r.action), ["hide", "restore"]);
  });

  test("spam protection: link-heavy comments and bursts are refused", async () => {
    await rejects(comment(bob, published, Array.from({ length: 6 }, (_, i) => `https://x${i}.example`).join(" ")), /too_many_links/);
    await rejects(comment(bob, published, " "), /comment_empty/);
    const burst = await createUser(db, {});
    for (let i = 0; i < 10; i++) await comment(burst, published, `Comment number ${i}`);
    await rejects(comment(burst, published, "One too many"), /rate_limited/);
  });

  test("unpublishing a contribution hides its discussion", async () => {
    const cid = await contribution(alice, { title: "Short-lived article" }, true);
    await comment(bob, cid, "Nice work.");
    await rpc(mod, "review_contribution", cid, "unpublish", "Reported.");
    assert.equal((await anon(db, "select 1 from public.comments where contribution_id = $1", [cid])).rows.length, 0);
  });
});

describe("reports", () => {
  test("members report published content once; only moderators see reports", async () => {
    const cid = await comment(alice, published, "A visible comment");
    await as(db, bob, "insert into public.reports (target_type, target_id, reason, details) values ('comment', $1, 'abuse', 'Rude')", [cid]);
    await rejects(as(db, bob, "insert into public.reports (target_type, target_id, reason) values ('comment', $1, 'abuse')", [cid]), /duplicate key/);
    await rejects(as(db, bob, "insert into public.reports (target_type, target_id, reason) values ('contribution', $1, 'spam')", [draftId]), /not_found/);
    await rejects(anon(db, "insert into public.reports (target_type, target_id, reason) values ('contribution', $1, 'spam')", [published]), /permission denied/);
    assert.equal((await as(db, alice, "select * from public.reports")).rows.length, 0, "the reported author cannot see who reported");
    assert.equal((await as(db, bob, "select * from public.reports")).rows.length, 1, "reporters see their own");
    const { rows } = await as(db, mod, "select id from public.reports where status = 'open'");
    assert.equal(rows.length, 1);
    await rejects(rpc(bob, "resolve_report", rows[0].id, "dismissed", null), /forbidden/);
    await rpc(mod, "resolve_report", rows[0].id, "actioned", "Comment hidden.");
    assert.equal((await as(db, mod, "select status from public.reports where id = $1", [rows[0].id])).rows[0].status, "actioned");
  });
});

describe("search", () => {
  test("full-text search finds published work only", async () => {
    const q = "select title from public.contributions where search @@ websearch_to_tsquery('simple', $1)";
    assert.deepEqual((await anon(db, q, ["phase shift"])).rows.map((r) => r.title).sort()[0], "Another article");
    assert.equal((await anon(db, q, ["magnetics"])).rows.length, 0, "drafts are not searchable by others");
    assert.equal((await as(db, alice, q, ["magnetics"])).rows.length, 1, "authors find their own drafts");
    await rejects(as(db, alice, "update public.contributions set search = null where id = $1", [draftId]), /permission denied|generated|DEFAULT/);
  });
});

describe("knowledge topics", () => {
  test("topics mirror the Academy graph and are read-only", async () => {
    const { rows } = await anon(db, "select id, title_en from public.knowledge_topics where id = 'pe.control'");
    assert.equal(rows.length, 1);
    await rejects(as(db, alice, "insert into public.knowledge_topics (id, subject, title_en, title_zh) values ('pe.fake', 'x', 'x', 'x')"), /permission denied/);
    await rejects(as(db, mod, "update public.knowledge_topics set title_en = 'x' where id = 'pe.control'"), /permission denied/);
  });

  test("authors link topics while editing; links follow contribution visibility", async () => {
    await as(db, alice, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, 'pe.magnetics')", [draftId]);
    await rejects(as(db, alice, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, 'pe.unknown')", [draftId]), /foreign key/);
    await rejects(as(db, bob, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, 'pe.control')", [draftId]), /row-level security/);
    await rejects(as(db, alice, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, 'pe.control')", [published]), /row-level security/,
      "published work is locked");
    assert.equal((await anon(db, "select 1 from public.contribution_topics where contribution_id = $1", [draftId])).rows.length, 0);
    for (const t of ["pe.devices", "pe.passives", "pe.topologies", "pe.buck", "pe.boost", "pe.rectifiers", "pe.inverters"]) {
      await as(db, alice, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, $2)", [draftId, t]);
    }
    await rejects(as(db, alice, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, 'pe.isolated')", [draftId]), /too_many_topics/);
    await rejects(as(db, alice, "update public.contribution_topics set curated = true where contribution_id = $1", [draftId]), /permission denied/);
  });

  test("only moderators curate links, only on published work, and edits require re-review", async () => {
    const cid = await contribution(alice, { title: "DAB modelling for Academy" }, false);
    await as(db, alice, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, 'pe.control'), ($1, 'pe.isolated')", [cid]);
    await rejects(rpc(mod, "curate_topic", cid, "pe.control", true), /not_published/);
    await rpc(alice, "submit_contribution", cid);
    await rpc(mod, "review_contribution", cid, "approve", null);
    await rpc(mod, "review_contribution", cid, "publish", null);
    await rejects(rpc(alice, "curate_topic", cid, "pe.control", true), /forbidden/);
    await rpc(mod, "curate_topic", cid, "pe.control", true);
    const curated = await anon(db, "select topic_id, slug, title from public.curated_topic_resources");
    assert.deepEqual(curated.rows.map((r) => r.topic_id), ["pe.control"]);
    // Author takes it down, changes topics, and must go through review again.
    await rpc(alice, "withdraw_contribution", cid);
    await rejects(as(db, alice, "delete from public.contribution_topics where contribution_id = $1 and topic_id = 'pe.control'", [cid])
      .then((r) => { if (r.affectedRows === 0) throw new Error("curated link kept"); }), /curated link kept/);
    await as(db, alice, "delete from public.contribution_topics where contribution_id = $1 and topic_id = 'pe.isolated'", [cid]);
    await rejects(rpc(mod, "review_contribution", cid, "publish", null), /review_required/);
    assert.equal((await anon(db, "select * from public.curated_topic_resources")).rows.length, 0, "unpublished work leaves the curated list");
  });

  test("retired topics keep existing links but accept no new ones", async () => {
    await service(db, "update public.knowledge_topics set retired = true where id = 'pe.emi-pcb'");
    await rejects(as(db, alice, "insert into public.contribution_topics (contribution_id, topic_id) values ($1, 'pe.emi-pcb')",
      [await contribution(alice, { title: "EMI notes" }, false)]), /topic_retired/);
  });
});
