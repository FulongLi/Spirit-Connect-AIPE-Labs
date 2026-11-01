# Backend setup: Supabase project, secrets and deployment

The public website stays a static Jekyll site on GitHub Pages. The one feature that needs a server, newsletter
sign-up, uses a Supabase project whose code lives in
`supabase/`:

```text
supabase/
├── config.toml          Local stack and auth settings (mirror them in the hosted dashboard)
├── migrations/          SQL migrations, applied in filename order
├── seed.sql             Local seed data (no personal data)
└── functions/
    ├── _shared/         Runtime-neutral logic, unit-tested with Node
    └── newsletter-subscribe/
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

## Local development

Requires Node 22.18+ for the tests; the Supabase CLI and Docker are needed only to run the full stack.

```bash
npm ci
npm test                         # backend unit and database-policy tests (PGlite, no Docker)
supabase start                   # local Postgres, Studio and Edge Functions runtime
supabase db reset                # apply migrations and seed.sql
cp .env.example supabase/functions/.env   # then fill in test values
supabase functions serve --env-file supabase/functions/.env
```

For local site testing set `community_backend.supabase_url` to `http://127.0.0.1:54321` and the anon key
printed by `supabase start` in a local, uncommitted `_config.local.yml`, then run
`bundle exec jekyll serve --config _config.yml,_config.local.yml`.

## Staging and production

Use two Supabase projects (staging and production) so migrations can be rehearsed.

```bash
supabase link --project-ref <ref>
supabase db push                                   # apply new migrations
supabase secrets set BUTTONDOWN_API_KEY=… ALLOWED_ORIGINS=https://aipel.co.uk
supabase functions deploy newsletter-subscribe --no-verify-jwt
```

Then commit the project URL and anon key to `_config.yml` through a normal pull request. GitHub Pages
deploys the site as before; CI uploads each build as the `site` artifact for review.

Newsletter details: [newsletter.md](newsletter.md).
