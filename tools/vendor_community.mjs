// Copies the browser builds used by the Community pages from node_modules into
// assets/vendor/ (served by Jekyll, so the site needs no third-party CDN).
//   npm ci && npm run vendor        # after changing a version in package.json
// tests/community/vendor.test.mjs checks the copies match the installed packages.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
export const VENDORED = {
  "assets/vendor/supabase/supabase.js": "node_modules/@supabase/supabase-js/dist/umd/supabase.js",
  "assets/vendor/dompurify/purify.min.js": "node_modules/dompurify/dist/purify.min.js",
  "assets/vendor/marked/marked.umd.js": "node_modules/marked/lib/marked.umd.js",
};

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [target, source] of Object.entries(VENDORED)) {
    mkdirSync(dirname(join(ROOT, target)), { recursive: true });
    copyFileSync(join(ROOT, source), join(ROOT, target));
    console.log(`${source} -> ${target}`);
  }
}
