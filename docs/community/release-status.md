# Community and newsletter: release status

Recorded 1 November 2026 for the integration pull request that brings all three Community phases to `main`.
Update this file whenever a column changes; never mark a column PASS without the evidence named below.

## Integration history

The MVP was delivered as stacked pull requests. Only the first reached `main`:

| PR | Base branch | Merge commit | On `main` before integration |
| --- | --- | --- | --- |
| #23 Newsletter | `main` | `333f20a` | Yes (deployed: `/subscribe/` is live with the form disabled) |
| #24 Community core | `claude/community-newsletter` | `2d1bd54` | No |
| #25 Community interaction | `claude/community-core` | `dddf15c` | No |

`claude/community-core` at `dddf15c` contains every commit of all three phases. `main` had nothing that branch
lacked except the #23 merge commit, so `claude/community-release` merges it into `main` with no conflicts; the
merged tree is identical to `dddf15c`. No history was rewritten.

## Backend configuration

| Item | State |
| --- | --- |
| `_config.yml` → `community_backend` | Blank (URL, publishable key, Turnstile site key) |
| Supabase project (staging or production) | **None exists** |
| Database migrations applied to a hosted project | No (they run only in the local PGlite test database) |
| Edge Functions deployed (`newsletter-subscribe`, `delete-account`) | No |
| Supabase Auth: Site URL, redirects, email confirmation | Not configured |
| SMTP sender for sign-up / reset emails, DNS (SPF, DKIM) | Not configured |
| GitHub OAuth app | Not created |
| Buttondown newsletter, API key, sending domain | Not created |
| Cloudflare Turnstile (optional) | Not created |
| Legal review of Privacy, Terms and Cookies changes | **Not done** |

With the backend blank the site behaves safely: `/subscribe/` shows a disabled form that says subscriptions are
not open yet, every Community view and the Community homepage say "not open yet", and nothing claims success.
The steps that remove each gap are in [go-live.md](go-live.md); none of them can be done from the repository.

## What each column means

- **Code** — implemented in this repository.
- **Local tests** — automated tests (`npm test`: the real migrations and row-level security in PGlite, the Edge
  Function handlers, the Markdown sanitiser) **and** a browser run of the built site (CI artifact) against a local
  stand-in for the Supabase APIs that executes the same migrations and handlers. The stand-in does not send email,
  has no GitHub OAuth and stubs the Buttondown call, so anything depending on those is BLOCKED here.
- **Staging** — a real Supabase project, SMTP, OAuth app and Buttondown list used with test accounts.
- **Production** — `https://aipel.co.uk` with the production backend.

## Verification

| Feature | Code | Local tests | Staging | Production |
| --- | --- | --- | --- | --- |
| Registration (email) | PASS | PASS — sign-up form creates the account and shows "check your inbox" | BLOCKED — no project | BLOCKED — no backend |
| Email verification | PASS | BLOCKED — stand-in sends no email | BLOCKED — no project or SMTP | BLOCKED |
| Login / logout | PASS | PASS — sign-in redirects to My account; sign-out clears the session | BLOCKED | BLOCKED |
| GitHub OAuth | PASS | BLOCKED — needs Supabase Auth and a GitHub OAuth app | BLOCKED | BLOCKED |
| Password recovery | PASS | BLOCKED — the reset request reaches the auth API with the right redirect, but completing a reset needs the email | BLOCKED | BLOCKED |
| Member profile | PASS | PASS — edit and save; public profile shows no email; members cannot change their own role | BLOCKED | BLOCKED |
| Tool submission | PASS | PASS — draft saved, then submitted | BLOCKED | BLOCKED |
| Idea submission | PASS | PASS — submitted with AI-assistance disclosure | BLOCKED | BLOCKED |
| Article submission | PASS | PASS — submitted; `<script>` rendered as text, image dropped, links `rel="ugc nofollow …"` | BLOCKED | BLOCKED |
| Moderation | PASS | PASS — approve, publish, request changes (note required, refused without), author resubmits, reject with note; every decision in the audit trail; members cannot review or publish their own work | BLOCKED | BLOCKED |
| Public contribution pages | PASS | PASS — published work readable anonymously with the community disclaimer; drafts and in-review work return "Not found" | BLOCKED | BLOCKED |
| Comments | PASS | PASS — comment, threaded reply, edit (marked "edited"), report; moderator hides (note required) and resolves the report; hidden comment disappears for visitors; anonymous visitors read but cannot post | BLOCKED | BLOCKED |
| Search and filters | PASS | PASS — English full-text and Chinese substring search, type, domain, topic and sort filters, state kept in the URL | BLOCKED | BLOCKED |
| Knowledge-topic links | PASS | PASS — author links a topic; moderator curates it on published work; it appears in `curated_topic_resources` | BLOCKED | BLOCKED |
| Newsletter subscription | PASS | PASS (provider stubbed) — form posts to the real handler; consent and honeypot enforced; disabled with a notice when no backend | BLOCKED — no Buttondown | BLOCKED |
| Newsletter double opt-in, duplicates, unsubscribe | PASS | BLOCKED — needs Buttondown (handler logic covered by unit tests) | BLOCKED | BLOCKED |

Not run in this pass: account data export and account deletion in the browser (covered by `npm test` and the
earlier Phase 2 browser run), avatar upload.

## Site checks

| Check | Result |
| --- | --- |
| `python tools/sync_ecosystem.py --check`, `hub_data.py`, `content_data.py`, `community_topics.py` | PASS |
| `python -m unittest discover -s tests` (82 tests) | PASS |
| `npm test` (56 tests, including database security policies) | PASS |
| CI Jekyll 4 build, `check_public_build.py`, `check_site_links.py` | PASS |
| CI build with the GitHub Pages engine (what production runs), `check_public_build.py` | PASS |
| Pages-engine `check_site_links.py` | PASS — `/aipe/` and `/legacy/aipe-resource-index-v0/` (pages the builder generated from Markdown without front matter, whose language switch pointed at missing `/zh/` pages) now redirect to their raw `.md` files |
| Routes, EN and ZH: `/community/`, `join/`, `account/`, `submit/`, `explore/`, `moderation/`, `contribution/`, `members/`, `guidelines/`, `/subscribe/` | 200, rendered, correct language |
| `/company/team/` → `/company/about/`, `/company/careers/` → `/contact/` (EN and ZH) | Redirect, `noindex`, not in the sitemap |
| Mobile (375 px): the routes above, About, Contact | No horizontal overflow; Community menu works in the mobile navigation |

## Remaining blockers

1. **Backend accounts** — create the Supabase project(s), SMTP sender, GitHub OAuth app(s) and Buttondown list
   ([go-live.md](go-live.md) steps 2–5). Only an account owner can do this.
2. **Staging run** — point a throwaway build at staging and complete the acceptance list in go-live.md step 7.
   Every Staging cell above stays BLOCKED until then.
3. **Legal sign-off** on the Privacy, Terms and Cookies changes (EN and ZH).
4. **Production configuration** — only after 1–3: merge the `_config.yml` change with the production URL and
   publishable key, confirm the Pages build for that commit, then run the production smoke tests
   (go-live.md step 8).

Until then, merging the integration pull request publishes the Community pages in their "not open yet" state,
the new header menu and the Company changes. It does not enable registration, publishing or email.
