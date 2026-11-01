import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { VENDORED } from "../../tools/vendor_community.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;

test("vendored browser libraries match the pinned packages", () => {
  for (const [target, source] of Object.entries(VENDORED)) {
    assert.ok(readFileSync(ROOT + target).equals(readFileSync(ROOT + source)), `${target} is stale; run npm run vendor`);
  }
});
