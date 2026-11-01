// Database policy and workflow tests for the AIPE Community core, run against
// the real migrations in PGlite (see support/db.mjs).
import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { anon, as, createDatabase, createUser, rejects, service } from "./support/db.mjs";

const LONG = "This is a sufficiently long summary of the contribution.";
const ARTICLE = "Dual active bridge control. ".repeat(12);

let db, alice, bob, mod, admin;

async function draft(uid, fields = {}) {
  const row = {
    type: "article", title: "DAB phase-shift control notes", summary: LONG, domains: ["converters", "control"],
    body_md: ARTICLE, ...fields,
  };
  const cols = Object.keys(row);
  const { rows } = await as(db, uid,
    `insert into public.contributions (${cols.join(",")}) values (${cols.map((_, i) => `$${i + 1}`).join(",")}) returning *`,
    Object.values(row));
  return rows[0];
}
const rpc = (uid, fn, ...args) =>
  as(db, uid, `select public.${fn}(${args.map((_, i) => `$${i + 1}`).join(",")}) as r`, args).then((r) => r.rows[0].r);
const status = async (id) => (await service(db, "select status from public.contributions where id = $1", [id])).rows[0].status;

before(async () => {
  db = await createDatabase();
  alice = await createUser(db, { name: "Alice Engineer", username: "alice" });
  bob = await createUser(db, { name: "Bob" });
  mod = await createUser(db, { username: "mod" });
  admin = await createUser(db, { username: "chief" });
  await service(db, "update public.profiles set role = 'moderator' where id = $1", [mod]);
  await service(db, "update public.profiles set role = 'admin' where id = $1", [admin]);
});

describe("authentication and profiles", () => {
  test("sign-up creates a public profile without the email address", async () => {
    const { rows } = await anon(db, "select * from public.profiles where id = $1", [alice]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].username, "alice");
    assert.equal(rows[0].display_name, "Alice Engineer");
    assert.equal(rows[0].role, "member");
    assert.ok(!Object.keys(rows[0]).includes("email"));
    assert.ok(!JSON.stringify(rows[0]).includes("@example.test"));
  });

  test("provisional usernames are unique and reserved names are refused", async () => {
    const other = await createUser(db, { username: "alice" });
    const { rows } = await anon(db, "select username from public.profiles where id = $1", [other]);
    assert.match(rows[0].username, /^alice-[0-9a-f]{4}$/);
    const fallback = await createUser(db, { username: "admin" });
    assert.match((await anon(db, "select username from public.profiles where id = $1", [fallback])).rows[0].username, /^member-/);
    await rejects(as(db, bob, "update public.profiles set username = 'admin' where id = $1", [bob]), /username_reserved/);
  });

  test("members edit their own profile fields only", async () => {
    await as(db, bob, `update public.profiles set display_name = 'Bob Builder', bio = 'Power electronics',
      interests = array['GaN', ' SiC ', 'GaN'], github_url = 'https://github.com/bob' where id = $1`, [bob]);
    const { rows } = await anon(db, "select display_name, interests from public.profiles where id = $1", [bob]);
    assert.equal(rows[0].display_name, "Bob Builder");
    assert.deepEqual(rows[0].interests.sort(), ["GaN", "SiC"]);
    const res = await as(db, bob, "update public.profiles set bio = 'hijack' where id = $1", [alice]);
    assert.equal(res.affectedRows, 0);
  });

  test("members cannot promote themselves or forge the official badge", async () => {
    await rejects(as(db, bob, "update public.profiles set role = 'admin' where id = $1", [bob]), /permission denied/);
    await rejects(as(db, bob, "update public.profiles set is_official = true where id = $1", [bob]), /permission denied/);
    await rejects(rpc(bob, "set_member_role", "bob", "admin", true), /forbidden/);
  });

  test("profile links must be safe http(s) URLs", async () => {
    await rejects(as(db, bob, "update public.profiles set website_url = 'javascript:alert(1)' where id = $1", [bob]), /check constraint/);
    await rejects(as(db, bob, "update public.profiles set github_url = 'https://evil.example/bob' where id = $1", [bob]), /check constraint/);
    await rejects(as(db, bob, "update public.profiles set avatar_url = 'http://insecure/a.png' where id = $1", [bob]), /check constraint/);
  });

  test("anonymous visitors cannot write profiles", async () => {
    await rejects(anon(db, "update public.profiles set bio = 'x' where id = $1", [alice]), /permission denied/);
  });

  test("admins appoint moderators and official contributors, with an audit record", async () => {
    const extra = await createUser(db, { username: "carol" });
    await rpc(admin, "set_member_role", "carol", "moderator", true);
    const { rows } = await anon(db, "select role, is_official from public.profiles where id = $1", [extra]);
    assert.deepEqual(rows[0], { role: "moderator", is_official: true });
    const log = await service(db, "select action from public.moderation_events where target_id = $1", [extra]);
    assert.equal(log.rows[0].action, "set_role");
  });
});

describe("contributions", () => {
  test("members create drafts that only they and moderators can see", async () => {
    const c = await draft(alice);
    assert.equal(c.status, "draft");
    assert.equal(c.author_id, alice);
    assert.match(c.slug, /^dab-phase-shift-control-notes-[0-9a-f]{6}$/);
    assert.equal((await anon(db, "select 1 from public.contributions where id = $1", [c.id])).rows.length, 0);
    assert.equal((await as(db, bob, "select 1 from public.contributions where id = $1", [c.id])).rows.length, 0);
    assert.equal((await as(db, mod, "select 1 from public.contributions where id = $1", [c.id])).rows.length, 1);
  });

  test("anonymous visitors cannot create contributions", async () => {
    await rejects(anon(db, "insert into public.contributions (type, title) values ('tool', 'Spam tool')"), /permission denied/);
  });

  test("members cannot create content as someone else or skip review", async () => {
    await rejects(as(db, bob, "insert into public.contributions (type, title, author_id) values ('tool', 'Forged', $1)", [alice]), /permission denied/);
    await rejects(as(db, bob, "insert into public.contributions (type, title, status) values ('tool', 'Sneaky', 'published')"), /permission denied/);
    const c = await draft(bob);
    await rejects(as(db, bob, "update public.contributions set status = 'published' where id = $1", [c.id]), /permission denied/);
    await rejects(as(db, bob, "update public.contributions set published_at = now() where id = $1", [c.id]), /permission denied/);
  });

  test("authors edit their drafts; others cannot", async () => {
    const c = await draft(alice);
    await as(db, alice, "update public.contributions set title = 'DAB control, revised' where id = $1", [c.id]);
    const after = (await service(db, "select title, slug from public.contributions where id = $1", [c.id])).rows[0];
    assert.equal(after.title, "DAB control, revised");
    assert.equal(after.slug, c.slug, "slug stays stable");
    assert.equal((await as(db, bob, "update public.contributions set title = 'mine now' where id = $1", [c.id])).affectedRows, 0);
  });

  test("unsafe links and unknown domains are rejected", async () => {
    await rejects(draft(alice, { type: "tool", project_url: "javascript:alert(1)" }), /check constraint/);
    await rejects(draft(alice, { type: "tool", project_url: 'https://x.example/"><script>' }), /check constraint/);
    await rejects(draft(alice, { domains: ["astrology"] }), /check constraint/);
  });

  test("agent-assisted content must disclose AI assistance", async () => {
    await rejects(draft(alice, { origin: "agent-assisted", ai_assisted: false }), /agent_assisted_is_disclosed/);
    const c = await draft(alice, { origin: "agent-assisted", ai_assisted: true });
    await rejects(rpc(alice, "submit_contribution", c.id), /incomplete/);
    await as(db, alice, "update public.contributions set ai_disclosure = 'Draft prepared with a coding agent; reviewed by me.' where id = $1", [c.id]);
    assert.equal(await rpc(alice, "submit_contribution", c.id), "submitted");
  });

  test("submission validates required fields per type", async () => {
    const tool = await draft(alice, { type: "tool", title: "Loss calculator", body_md: null });
    const err = await rejects(rpc(alice, "submit_contribution", tool.id), /incomplete/);
    for (const field of ["tool_kind", "project_url", "dev_status", "licence", "limitations"]) {
      assert.ok(err.detail.includes(field), field);
    }
    const idea = await draft(alice, { type: "idea", title: "Idea", body_md: null,
      hypothesis: "Wide-bandgap devices could ... ".repeat(3), evidence_level: "preliminary" });
    assert.match((await rejects(rpc(alice, "submit_contribution", idea.id), /incomplete/)).detail, /references_md/);
  });

  test("other members cannot submit or withdraw someone else's work", async () => {
    const c = await draft(alice);
    await rejects(rpc(bob, "submit_contribution", c.id), /not_found/);
    await rpc(alice, "submit_contribution", c.id);
    await rejects(rpc(bob, "withdraw_contribution", c.id), /not_found/);
  });
});

describe("review and publishing", () => {
  test("full workflow: submit → request changes → resubmit → approve → publish", async () => {
    const c = await draft(alice);
    assert.equal(await rpc(alice, "submit_contribution", c.id), "submitted");
    await rejects(as(db, alice, "update public.contributions set title = 'edit while in review' where id = $1", [c.id])
      .then((r) => { if (r.affectedRows === 0) throw new Error("locked"); }), /locked/);
    await rejects(rpc(mod, "review_contribution", c.id, "request_changes", ""), /note_required/);
    assert.equal(await rpc(mod, "review_contribution", c.id, "request_changes", "Please add references."), "changes_requested");
    const notes = await as(db, alice, "select action, note from public.moderation_events where target_id = $1 order by id", [c.id]);
    assert.deepEqual(notes.rows.map((r) => r.action), ["submit", "request_changes"]);
    await as(db, alice, "update public.contributions set summary = $2 where id = $1", [c.id, LONG + " With references."]);
    await rpc(alice, "submit_contribution", c.id);
    assert.equal(await rpc(mod, "review_contribution", c.id, "approve", null), "approved");
    assert.equal((await anon(db, "select 1 from public.contributions where id = $1", [c.id])).rows.length, 0, "approved is not yet public");
    assert.equal(await rpc(mod, "review_contribution", c.id, "publish", null), "published");
    const pub = await anon(db, "select status, published_at, reviewed_by from public.contributions where id = $1", [c.id]);
    assert.equal(pub.rows[0].status, "published");
    assert.ok(pub.rows[0].published_at);
    assert.equal(pub.rows[0].reviewed_by, mod);
  });

  test("members cannot moderate and moderators cannot approve their own work", async () => {
    const c = await draft(alice);
    await rpc(alice, "submit_contribution", c.id);
    await rejects(rpc(alice, "review_contribution", c.id, "approve", null), /forbidden/);
    await rejects(rpc(bob, "review_contribution", c.id, "publish", null), /forbidden/);
    await rejects(anon(db, "select public.review_contribution($1, 'approve', null)", [c.id]), /permission denied/);
    const own = await draft(mod);
    await rpc(mod, "submit_contribution", own.id);
    await rejects(rpc(mod, "review_contribution", own.id, "approve", null), /own_contribution/);
  });

  test("invalid transitions are refused", async () => {
    const c = await draft(alice);
    await rejects(rpc(mod, "review_contribution", c.id, "publish", null), /invalid_transition/);
    await rpc(alice, "submit_contribution", c.id);
    await rejects(rpc(mod, "review_contribution", c.id, "publish", null), /invalid_transition/);
    await rejects(rpc(mod, "review_contribution", c.id, "teleport", null), /invalid_transition/);
    assert.equal(await rpc(mod, "review_contribution", c.id, "reject", "Out of scope."), "rejected");
    await rejects(rpc(alice, "submit_contribution", c.id), /invalid_transition/);
  });

  test("unpublish, author edits and republication require a fresh review", async () => {
    const c = await draft(alice);
    await rpc(alice, "submit_contribution", c.id);
    await rpc(mod, "review_contribution", c.id, "approve", null);
    await rpc(mod, "review_contribution", c.id, "publish", null);
    await rejects(rpc(mod, "review_contribution", c.id, "unpublish", null), /note_required/);
    assert.equal(await rpc(mod, "review_contribution", c.id, "unpublish", "Broken link reported."), "unpublished");
    assert.equal((await anon(db, "select 1 from public.contributions where id = $1", [c.id])).rows.length, 0);
    assert.equal(await rpc(mod, "review_contribution", c.id, "publish", null), "published", "unchanged work may be republished");
    await rpc(mod, "review_contribution", c.id, "unpublish", "Again.");
    await as(db, alice, "update public.contributions set summary = $2 where id = $1", [c.id, LONG + " Fixed link."]);
    await rejects(rpc(mod, "review_contribution", c.id, "publish", null), /review_required/);
    await rpc(alice, "submit_contribution", c.id);
    await rpc(mod, "review_contribution", c.id, "approve", null);
    assert.equal(await rpc(mod, "review_contribution", c.id, "publish", null), "published");
  });

  test("authors can withdraw and take down their own work", async () => {
    const c = await draft(alice);
    await rpc(alice, "submit_contribution", c.id);
    assert.equal(await rpc(alice, "withdraw_contribution", c.id), "draft");
    await rpc(alice, "submit_contribution", c.id);
    await rpc(mod, "review_contribution", c.id, "approve", null);
    await rpc(mod, "review_contribution", c.id, "publish", null);
    await rejects(as(db, alice, "delete from public.contributions where id = $1", [c.id]).then((r) => {
      if (r.affectedRows === 0) throw new Error("not deleted");
    }), /not deleted/);
    assert.equal(await rpc(alice, "withdraw_contribution", c.id), "unpublished");
    assert.equal((await as(db, alice, "delete from public.contributions where id = $1", [c.id])).affectedRows, 1);
  });

  test("anonymous visitors see published work only, and no audit trail", async () => {
    const { rows } = await anon(db, "select distinct status from public.contributions");
    assert.deepEqual(rows.map((r) => r.status), ["published"]);
    await rejects(anon(db, "select * from public.moderation_events"), /permission denied/);
    assert.equal((await as(db, bob, "select * from public.moderation_events")).rows.length, 0);
    assert.ok((await as(db, mod, "select * from public.moderation_events")).rows.length > 0);
  });

  test("submission queue and daily creation limits", async () => {
    const spammer = await createUser(db, {});
    for (let i = 0; i < 10; i++) await rpc(spammer, "submit_contribution", (await draft(spammer, { title: `Item ${i}` })).id);
    await rejects(rpc(spammer, "submit_contribution", (await draft(spammer, { title: "Eleventh" })).id), /rate_limited/);
    for (let i = 0; i < 9; i++) await draft(spammer, { title: `More ${i}` });
    await rejects(draft(spammer, { title: "Twenty-first" }), /rate_limited/);
  });
});

describe("account deletion and storage", () => {
  test("deleting the auth user removes the profile and their contributions", async () => {
    const temp = await createUser(db, { username: "leaving" });
    const c = await draft(temp);
    await service(db, "delete from auth.users where id = $1", [temp]);
    assert.equal((await service(db, "select 1 from public.profiles where id = $1", [temp])).rows.length, 0);
    assert.equal((await service(db, "select 1 from public.contributions where id = $1", [c.id])).rows.length, 0);
  });

  test("members write avatars only in their own folder", async () => {
    await as(db, alice, "insert into storage.objects (bucket_id, name, owner) values ('avatars', $1, $2)", [`${alice}/avatar.webp`, alice]);
    await rejects(as(db, alice, "insert into storage.objects (bucket_id, name, owner) values ('avatars', $1, $2)", [`${bob}/avatar.webp`, alice]), /row-level security/);
    await rejects(anon(db, "insert into storage.objects (bucket_id, name) values ('avatars', 'x/avatar.png')"), /row-level security/);
    const bucket = (await service(db, "select file_size_limit, allowed_mime_types from storage.buckets where id = 'avatars'")).rows[0];
    assert.equal(Number(bucket.file_size_limit), 1048576);
    assert.ok(!bucket.allowed_mime_types.includes("image/svg+xml"));
  });
});
