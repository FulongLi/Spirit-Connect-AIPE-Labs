import { test } from "node:test";
import assert from "node:assert/strict";
import { handleDeleteAccount } from "../../supabase/functions/_shared/account.ts";

const ORIGIN = "https://aipel.co.uk";
const req = (body, token = "good", origin = ORIGIN) => new Request("https://x/functions/v1/delete-account", {
  method: "POST", headers: { origin, authorization: token ? `Bearer ${token}` : "" }, body: JSON.stringify(body),
});
function deps(overrides = {}) {
  const log = [];
  return {
    log,
    env: { ALLOWED_ORIGINS: ORIGIN },
    getUser: async (t) => (t === "good" ? { id: "u1" } : null),
    listAvatars: async (uid) => { log.push(["list", uid]); return [`${uid}/avatar.webp`]; },
    removeAvatars: async (paths) => { log.push(["remove", ...paths]); },
    deleteUser: async (uid) => { log.push(["delete", uid]); },
    ...overrides,
  };
}

test("deletes only the caller's own account after explicit confirmation", async () => {
  const d = deps();
  const res = await handleDeleteAccount(req({ confirm: "DELETE" }), d);
  assert.equal(res.status, 200);
  assert.deepEqual(d.log, [["list", "u1"], ["remove", "u1/avatar.webp"], ["delete", "u1"]]);
});

test("refuses anonymous, invalid-token, unconfirmed and cross-origin requests", async () => {
  for (const [request, status] of [
    [req({ confirm: "DELETE" }, ""), 401],
    [req({ confirm: "DELETE" }, "forged"), 401],
    [req({ confirm: "yes" }), 400],
    [req({ confirm: "DELETE" }, "good", "https://evil.example"), 403],
  ]) {
    const d = deps();
    assert.equal((await handleDeleteAccount(request, d)).status, status);
    assert.ok(!d.log.some(([op]) => op === "delete"));
  }
});

test("reports failure instead of success when deletion fails", async () => {
  const d = deps({ deleteUser: async () => { throw new Error("boom"); } });
  const res = await handleDeleteAccount(req({ confirm: "DELETE" }), d);
  assert.equal(res.status, 500);
  assert.equal((await res.json()).ok, false);
});
