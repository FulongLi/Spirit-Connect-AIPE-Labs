# Go-live checklist: AIPE Updates and AIPE Community

Work through this once for **staging**, test, then repeat for **production**. Every step needs an account
owner: none of it can be done from the repository alone. Tick boxes in a copy of this file or in the release
issue. Reference: [setup.md](setup.md) (commands), [moderation.md](moderation.md) (roles),
[newsletter.md](newsletter.md) (provider).

Values you will collect (keep secrets in a password manager, never in the repo):

| Value | Secret? | Goes to |
| --- | --- | --- |
| Supabase project URL, publishable (anon) key | No | `_config.yml` → `community_backend` |
| Supabase database password / connection string | **Yes** | your shell only (`supabase link`, `psql`) |
| Buttondown API key | **Yes** | `supabase secrets set BUTTONDOWN_API_KEY=…` |
| GitHub OAuth client ID and secret | **Yes** (secret) | Supabase → Authentication → Providers → GitHub |
| SMTP host, user, password | **Yes** | Supabase → Authentication → Emails → SMTP |
| Turnstile site key / secret key (optional) | site key no, secret **yes** | `_config.yml` / Supabase secret + Auth captcha |

## 0. Decisions before starting

- [ ] **Legal review booked.** The Privacy Policy, Terms of Use and Cookies changes (EN and ZH) are drafts written
      without legal advice. Production launch waits for sign-off (step 8).
- [ ] **Supabase plan.** Free projects pause after a week without activity and have no backups. Use **Pro** for
      production (daily backups); Free is fine for staging.
- [ ] **Region.** Choose London (`eu-west-2`) or another UK/EU region for both projects, to match the privacy text.
- [ ] **Email sender.** Choose an SMTP provider for sign-in emails (for example Postmark, Amazon SES or Resend) and
      an address such as `community@aipel.co.uk`. Supabase's built-in sender only delivers to your own team's
      addresses and is rate-limited, so members cannot sign up without custom SMTP.
- [ ] **Buttondown plan.** Check the plan includes a custom sending domain.
- [ ] **People.** Who is the first admin, and who moderates (ideally at least two people, because moderators
      cannot approve their own work).

## 1. Merge the code (no visible change yet)

- [ ] Merge the integration pull request into `main` (see [release-status.md](release-status.md); the stacked
      PRs #24 and #25 were merged into their intermediate branches and never reached `main` on their own).
- [ ] Confirm the GitHub Pages build for that merge commit succeeded
      (`gh api repos/FulongLi/Spirit-Connect-AIPE-Labs/pages/builds/latest`) and that `/subscribe/` and
      `/community/` show the "not open yet" notices.

## 2. Supabase project

- [ ] Create the project (organisation → New project) in the chosen region; save the database password.
- [ ] Install the Supabase CLI locally, then:
      `supabase login` → `supabase link --project-ref <ref>` → `supabase db push`.
- [ ] Load the knowledge topics: copy the connection string (Connect → Session pooler) and run
      `psql "<connection string>" -f supabase/knowledge_topics.sql`, or paste the file into the SQL editor.
- [ ] In Table Editor, confirm the tables `profiles`, `contributions`, `comments`, `reports`, `knowledge_topics`
      (57 rows), `moderation_events` exist and each shows **RLS enabled**.
- [ ] In Storage, confirm the `avatars` bucket is public, limited to 1 MB and PNG/JPEG/WebP, with four policies. If
      the storage part of the migration was refused, create the bucket and policies in the dashboard to match
      `supabase/migrations/20261101000300_avatars_storage.sql`.
- [ ] Settings → API: note the project URL and the publishable (anon) key. Never copy the secret or service-role key
      anywhere.

## 3. Authentication

- [ ] Authentication → URL configuration: Site URL `https://aipel.co.uk` (staging: `http://localhost:4000`);
      redirect URLs `https://aipel.co.uk/**` (staging also `http://localhost:4000/**`).
- [ ] Authentication → Providers → Email: enable sign-up, **Confirm email** on, **Secure email change** on;
      password minimum 10 with lower, upper and digits.
- [ ] Authentication → Emails → SMTP: enter the SMTP settings; send yourself a test. Optionally brand the
      confirmation and reset templates ("AIPE Community").
- [ ] DNS for the email sender: add the provider's SPF, DKIM and (recommended) DMARC records for `aipel.co.uk`.
- [ ] GitHub → Settings → Developer settings → **OAuth Apps → New**: homepage `https://aipel.co.uk`, callback
      `https://<ref>.supabase.co/auth/v1/callback`. Create one app **per project** (staging and production have
      different callbacks). Paste the client ID and secret into Supabase → Providers → GitHub.
- [ ] Optional bot protection: in Cloudflare create a Turnstile widget for `aipel.co.uk` (and `localhost` for
      staging). Put the **secret** in Supabase → Authentication → Attack Protection (Turnstile) and
      `supabase secrets set TURNSTILE_SECRET_KEY=…`; put the **site key** in `community_backend.turnstile_site_key`.
      Once enabled, sign-in, sign-up and password reset all require the widget.
- [ ] Authentication → Rate limits: keep the defaults or tighten.

## 4. Newsletter (Buttondown)

- [ ] Create the newsletter: name "AIPE Updates", sender "AIPE Labs", reply-to `info@spiritconnect.co.uk`.
- [ ] Verify the sending domain (DNS records from Buttondown).
- [ ] Subscribing settings: double opt-in on; confirmation redirect `https://aipel.co.uk/subscribe/?state=confirmed`;
      unsubscribe redirect `https://aipel.co.uk/subscribe/?state=unsubscribed` (if offered).
- [ ] Add a postal address for the email footer (Spirit Connect, Cardiff), as anti-spam rules expect.
- [ ] Create an API key.

## 5. Server functions

- [ ] Set secrets (staging adds `http://localhost:4000` to the origins):
      `supabase secrets set BUTTONDOWN_API_KEY=… ALLOWED_ORIGINS=https://aipel.co.uk`
- [ ] Deploy: `supabase functions deploy newsletter-subscribe --no-verify-jwt` and
      `supabase functions deploy delete-account`. (If the project uses the new JWT signing keys and the gateway
      rejects member tokens, redeploy `delete-account` with `--no-verify-jwt`; the function checks the token itself.)
- [ ] Edge Functions → Logs show both functions booted without errors.

## 6. Point a build at the backend

- **Staging:** on a throwaway branch (never merged), set `community_backend.supabase_url` and `supabase_anon_key`
  to the staging values and push. Download the CI `site` artifact
  (`gh run download <run-id> -n site -D staging-site`), then serve it with
  `cd staging-site && python3 -m http.server 4000` and open `http://localhost:4000`.
- **Production:** open a PR that sets the production URL and publishable key (and Turnstile site key, if used)
  in `_config.yml`; merge after step 8.

## 7. Acceptance tests (staging, then production)

Use two test accounts (A = member, M = moderator) plus a private window for anonymous checks.

Newsletter
- [ ] Subscribe on `/subscribe/` → "check your inbox"; Buttondown shows the address as *unactivated*.
- [ ] Confirm from the email → lands on `/subscribe/?state=confirmed`; Buttondown shows *regular*.
- [ ] Subscribe the same address again → neutral message; still one subscriber.
- [ ] Send a test issue; its unsubscribe link works and shows `?state=unsubscribed`.
- [ ] Same on `/zh/subscribe/`. Submitting six times quickly from one network is refused (rate limit).

Accounts and profiles
- [ ] Sign up with email → confirmation email arrives → sign in. Sign out. Password reset email works.
- [ ] Sign in with GitHub (staging OAuth app) → returns to My account.
- [ ] Edit the profile, upload a PNG avatar; a 2 MB image or an SVG is refused.
- [ ] The public profile (`/community/members/?u=…`) shows no email address.
- [ ] Make the first admin (SQL in [moderation.md](moderation.md#initial-administrator)), then appoint M as
      moderator from the moderation page.

Contributions and moderation
- [ ] A creates a tool, an idea and an article; saves drafts; previews Markdown; submits them.
- [ ] Anonymous window: drafts are not reachable by URL or search.
- [ ] M requests changes on one (note required) → A sees the note, edits, resubmits → M approves → publishes.
- [ ] M rejects one with a note; M unpublishes a published one with a note; republishing after A edits it asks for
      a fresh review.
- [ ] M cannot approve M's own submission.
- [ ] Published page shows author, date, type, domains, status/evidence, links and the community disclaimer, in
      both languages.

Interaction
- [ ] Anonymous visitors can read comments but not post. A comments and replies; edits and deletes own comment.
- [ ] Another member reports a comment → M sees it in Open reports → hides it → marks actioned.
- [ ] Explore: search an English word, a Chinese word, filter by type, domain and topic, change the sort.
- [ ] A links knowledge topics in the editor; after publication M curates one;
      `SUPABASE_URL=… SUPABASE_ANON_KEY=… python tools/community_curation.py` lists it.

Data rights
- [ ] A downloads their data (JSON includes profile, contributions, comments, reports).
- [ ] A deletes the account → profile, contributions, comments and avatar are gone; moderation history remains
      without A's identity.

## 8. Production launch

- [ ] Legal sign-off received; apply any wording changes to the Privacy, Terms and Cookies pages (EN and ZH) and
      update their "Last updated" dates.
- [ ] Production project completed through steps 2–5 with production values (own OAuth app, origins
      `https://aipel.co.uk` only).
- [ ] Merge the `_config.yml` PR from step 6; after the Pages deploy, repeat the quick checks: subscribe, sign up,
      sign in with GitHub, submit, moderate, publish, comment.
- [ ] Create the production admin and moderators; delete test accounts and test contributions.
- [ ] Delete the staging throwaway branch.

## 9. After launch

- [ ] Weekly: clear the review and report queues; check Supabase → Logs (auth, functions) for errors or abuse.
- [ ] After every Academy sync that changes the knowledge graph: `python tools/community_topics.py --write`,
      commit, and re-run `supabase/knowledge_topics.sql` on production.
- [ ] Periodically: `python tools/community_curation.py` and promote curated links
      ([moderation.md](moderation.md#promoting-a-contribution)).
- [ ] Rotate the Buttondown API key, SMTP password and GitHub OAuth secret if anyone with access leaves.
- [ ] Monthly newsletter: follow [newsletter.md](newsletter.md#sending-an-issue).

## Rollback

- **Hide the features:** blank `community_backend` in `_config.yml` and redeploy; the pages return to "not open
  yet" and no data is lost.
- **Stop sign-ups only:** Supabase → Authentication → disable "Allow new users to sign up".
- **Code:** revert the integration merge commit on `main` (and, if needed, the Phase 1 merge of #23).
- **Database:** never edit applied migrations; add a new migration that reverses the change. Production backups
  (Pro plan) can restore the whole database to a daily snapshot.
