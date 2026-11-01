# Backend setup: Supabase project, secrets and deployment

The public website stays a static Jekyll site on GitHub Pages. Features that need a server (newsletter
sign-up today; Community accounts and moderation later) use one Supabase project whose code lives in
`supabase/`:

```text
supabase/
├── config.toml          Local stack and auth settings (mirror them in the hosted dashboard)
├── migrations/          SQL migrations, applied in filename order
├── seed.sql             Local seed data (no personal data)
└── functions/
    ├── _shared/         Runtime-neutral logic, unit-tested with Node
    ├── newsletter-subscribe/
    └── delete-account/
```

## Environment variables and credentials

| Name | Where | Purpose |
| --- | --- | --- |
| `community_backend.supabase_url` | `_config.yml` (public) | Project URL used by the browser |
| `community_backend.supabase_anon_key` | `_config.yml` (public) | Anon key; safe to publish because row-level security applies |
| `community_backend.turnstile_site_key` | `_config.yml` (public) | Optional Cloudflare Turnstile site key |
| `BUTTONDOWN_API_KEY` | Supabase secret | Newsletter provider API key |
| `ALLOWED_ORIGINS` | Supabase secret | Comma-separated origins allowed to call the functions |
| `TURNSTILE_SECRET_KEY` | Supabase secret | Optional; enables server-side Turnstile checks |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into Edge Functions by the platform. The
service-role key must never appear in `_config.yml`, the browser or the repository;
`tests/test_community.py` fails if a key-shaped value is committed. `.env.example` lists names only.

## Database migrations and the first administrator

Migrations in `supabase/migrations/` are applied in filename order by `supabase db reset` (local) or
`supabase db push` (hosted). Never edit an applied migration; add a new one. `npm test` applies all of them to an
in-process Postgres and checks the security policies. After the first deployment, create the initial
administrator as described in [moderation.md](moderation.md#initial-administrator).

Load the knowledge-topic list after the first migration and after every Academy sync that changes the graph:

```bash
python tools/community_topics.py --write          # regenerate from _data/knowledge_graph.yml (CI checks it)
psql "$SUPABASE_DB_URL" -f supabase/knowledge_topics.sql   # or paste it into the SQL editor
```

## Authentication providers

Configure in the Supabase dashboard → Authentication (and mirror local settings in `config.toml`):

1. **URL configuration**: Site URL `https://aipel.co.uk`; redirect URLs
   `https://aipel.co.uk/community/account/`, `https://aipel.co.uk/zh/community/account/` and any path a member may
   return to after signing in, e.g. `https://aipel.co.uk/**` (plus `http://localhost:4000/**` on staging).
2. **Email**: enable email sign-up with *Confirm email*; minimum password length 10 with letters and digits;
   enable *Secure email change*. Configure custom SMTP (for example the Buttondown/Postmark/SES sender for
   `aipel.co.uk`) — Supabase's default sender is rate-limited and for testing only. Optionally edit the
   confirmation and recovery templates to carry AIPE branding.
3. **GitHub**: create a GitHub OAuth App (Settings → Developer settings) with callback URL
   `https://<project-ref>.supabase.co/auth/v1/callback`; paste its client ID and secret into the GitHub provider.
   Locally, export `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` before
   `supabase start`. Members can always use email instead; GitHub is optional.
4. **Bot protection** (optional): Attack Protection → enable Cloudflare Turnstile with the same secret as the
   newsletter; set `community_backend.turnstile_site_key` so the sign-up and reset forms show the widget.
5. **Rate limits**: keep the defaults or tighten them under Authentication → Rate Limits.

## Local development

Requires Node 22.18+ for the tests; the Supabase CLI and Docker are needed only to run the full stack.

```bash
npm ci
npm test                         # backend unit and database-policy tests (PGlite, no Docker)
supabase start                   # local Postgres, Auth, Storage, Studio and mail catcher
supabase db reset                # apply migrations and seed.sql
cp .env.example supabase/functions/.env   # then fill in test values
supabase functions serve --env-file supabase/functions/.env
```

For local site testing set `community_backend.supabase_url` to `http://127.0.0.1:54321` and the anon key
printed by `supabase start` in a local, uncommitted `_config.local.yml`, then run
`bundle exec jekyll serve --config _config.yml,_config.local.yml`.

## Staging and production

Use two Supabase projects (staging and production) so migrations and moderation can be rehearsed.

```bash
supabase link --project-ref <ref>
supabase db push                                   # apply new migrations
supabase secrets set BUTTONDOWN_API_KEY=… ALLOWED_ORIGINS=https://aipel.co.uk
supabase functions deploy newsletter-subscribe --no-verify-jwt
supabase functions deploy delete-account
```

Then commit the project URL and anon key to `_config.yml` through a normal pull request. GitHub Pages
deploys the site as before; CI uploads each build as the `site` artifact for review.

Release order for a change that touches both: apply migrations and deploy functions first, then merge the site
change. Roll back a site change by reverting its pull request; roll back a migration with a new, reversing
migration.

Step-by-step launch: [go-live.md](go-live.md). See also: [architecture.md](architecture.md) · [moderation.md](moderation.md) · [newsletter.md](newsletter.md).
