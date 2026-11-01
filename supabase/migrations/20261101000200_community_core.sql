-- AIPE Community core: member profiles, contributions (tools, ideas, articles)
-- and the review workflow  draft → submitted → approved / changes_requested /
-- rejected → published ⇄ unpublished.
--
-- Security model
--   * Every table has row-level security. Clients only ever hold the anon key
--     or a member's JWT; the service role is used by Edge Functions alone.
--   * Column-level grants decide which fields a member may write. Status,
--     timestamps, roles and review fields have no client grant at all: they
--     change only inside the SECURITY DEFINER workflow functions below, which
--     check the caller and record every decision in moderation_events.
--   * Community content is never official AIPE content. Promotion to Hub,
--     Frontiers, Academy or Blog is a separate, manual, documented process.

-- ── Types ──────────────────────────────────────────────────────────────────
create type public.member_role as enum ('member', 'moderator', 'admin');
create type public.contribution_type as enum ('tool', 'idea', 'article');
create type public.contribution_status as enum
  ('draft', 'submitted', 'changes_requested', 'approved', 'rejected', 'published', 'unpublished');

-- Engineering domains shared with the Hub (_data/hub.yml) plus cross-domain.
create function public.community_domains() returns text[]
language sql immutable as $$
  select array['devices', 'magnetics', 'converters', 'control', 'storage', 'microgrids', 'systems', 'cross-domain']
$$;

create function public.is_http_url(value text) returns boolean
language sql immutable as $$
  select value is null or (value ~ '^https?://[^\s<>"''`]+$' and char_length(value) <= 500)
$$;

-- ── Profiles ───────────────────────────────────────────────────────────────
create table public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  username        text not null unique
                  check (username ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$' and username !~ '--'),
  display_name    text not null check (char_length(btrim(display_name)) between 1 and 80),
  -- https only; plain http is accepted for a local Supabase stack during development.
  avatar_url      text check (avatar_url is null or (avatar_url ~ '^(https://|http://(localhost|127\.0\.0\.1)(:[0-9]+)?/)[^\s<>"''`]+$'
                              and char_length(avatar_url) <= 500)),
  bio             text not null default '' check (char_length(bio) <= 600),
  interests       text[] not null default '{}' check (cardinality(interests) <= 12),
  affiliation     text not null default '' check (char_length(affiliation) <= 120),
  github_url      text check (github_url is null or github_url ~ '^https://github\.com/[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})/?$'),
  website_url     text check (public.is_http_url(website_url)),
  -- Not editable by members. `role` grants moderation rights; `is_official`
  -- marks AIPE team members and official contributors. Neither is a
  -- professional verification.
  role            public.member_role not null default 'member',
  is_official     boolean not null default false,
  -- Reserved for a future "trusted contributor" tier; every member currently
  -- requires review before publication.
  publishing_tier text not null default 'review_required' check (publishing_tier in ('review_required')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function public.validate_profile() returns trigger
language plpgsql as $$
begin
  new.display_name := btrim(new.display_name);
  new.interests := array(select distinct btrim(i) from unnest(new.interests) i where btrim(i) <> '');
  if exists (select 1 from unnest(new.interests) i where char_length(i) > 40) then
    raise exception 'interest_too_long' using errcode = '22023';
  end if;
  if new.username in ('admin', 'moderator', 'aipe', 'aipe-labs', 'official', 'support', 'staff', 'system') then
    raise exception 'username_reserved' using errcode = '22023';
  end if;
  return new;
end;
$$;

create trigger profiles_validate before insert or update on public.profiles
  for each row execute function public.validate_profile();
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Every new auth user gets a profile with a provisional, unique username that
-- the member can change. Email addresses are never copied into profiles.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  base text := lower(regexp_replace(coalesce(meta ->> 'user_name', meta ->> 'preferred_username', ''), '[^a-zA-Z0-9-]+', '-', 'g'));
  candidate text;
begin
  base := btrim(regexp_replace(base, '-{2,}', '-', 'g'), '-');
  if char_length(base) < 3 or base in ('admin', 'moderator', 'aipe', 'aipe-labs', 'official', 'support', 'staff', 'system') then
    base := 'member-' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;
  candidate := left(base, 30);
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := left(base, 25) || '-' || substr(md5(random()::text), 1, 4);
  end loop;
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    candidate,
    left(coalesce(nullif(btrim(meta ->> 'full_name'), ''), nullif(btrim(meta ->> 'name'), ''), 'AIPE member'), 80),
    case when meta ->> 'avatar_url' ~ '^https://[^\s<>"''`]+$' then meta ->> 'avatar_url' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_moderator(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = uid and role in ('moderator', 'admin'))
$$;

create function public.is_admin(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = uid and role = 'admin')
$$;

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (username, display_name, avatar_url, bio, interests, affiliation, github_url, website_url)
  on public.profiles to authenticated;

create policy "Profiles are public" on public.profiles for select using (true);
create policy "Members edit their own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ── Contributions ──────────────────────────────────────────────────────────
create table public.contributions (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  type                public.contribution_type not null,
  status              public.contribution_status not null default 'draft',
  author_id           uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  lang                text not null default 'en' check (lang in ('en', 'zh')),
  title               text not null check (char_length(btrim(title)) between 3 and 140),
  summary             text not null default '' check (char_length(summary) <= 500),
  domains             text[] not null default '{}' check (domains <@ public.community_domains()),
  -- Engineering tools
  tool_kind           text check (tool_kind in ('ai-agent', 'aigc-tool', 'simulation', 'utility', 'dataset', 'design-resource')),
  project_url         text check (public.is_http_url(project_url)),
  docs_url            text check (public.is_http_url(docs_url)),
  demo_url            text check (public.is_http_url(demo_url)),
  dev_status          text check (dev_status in ('concept', 'prototype', 'beta', 'stable', 'archived')),
  licence             text check (char_length(licence) <= 80),
  limitations         text check (char_length(limitations) <= 3000),
  -- Frontier ideas. evidence_level is declared by the author and displayed as
  -- such; a community idea is never presented as validated research.
  hypothesis          text check (char_length(hypothesis) <= 8000),
  evidence_level      text check (evidence_level in ('hypothesis', 'preliminary', 'published-elsewhere')),
  references_md       text check (char_length(references_md) <= 5000),
  validation_approach text check (char_length(validation_approach) <= 5000),
  -- Technical articles (Markdown, sanitised when rendered)
  body_md             text check (char_length(body_md) <= 80000),
  -- Disclosed AI assistance. Submissions always come from a signed-in member;
  -- `origin` records whether an AI agent helped prepare the content.
  ai_assisted         boolean not null default false,
  ai_disclosure       text check (char_length(ai_disclosure) <= 1000),
  origin              text not null default 'member' check (origin in ('member', 'agent-assisted')),
  -- Workflow (written only by the workflow functions)
  submitted_at        timestamptz,
  reviewed_at         timestamptz,
  reviewed_by         uuid references public.profiles (id) on delete set null,
  review_note         text,
  published_at        timestamptz,
  edited_at           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint agent_assisted_is_disclosed check (origin = 'member' or ai_assisted)
);

create index contributions_published_idx on public.contributions (published_at desc) where status = 'published';
create index contributions_author_idx on public.contributions (author_id, updated_at desc);
create index contributions_status_idx on public.contributions (status, submitted_at);
create index contributions_domains_idx on public.contributions using gin (domains);

create function public.slugify(value text) returns text
language sql immutable as $$
  select coalesce(nullif(left(btrim(regexp_replace(lower(value), '[^a-z0-9]+', '-', 'g'), '-'), 60), ''), 'contribution')
$$;

create function public.prepare_contribution() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    -- Fixed at creation so the public URL stays stable after edits.
    new.slug := btrim(public.slugify(new.title), '-') || '-' || substr(replace(new.id::text, '-', ''), 1, 6);
    if (select count(*) from public.contributions
        where author_id = new.author_id and created_at > now() - interval '1 day') >= 20 then
      raise exception 'rate_limited' using errcode = 'P0001', hint = 'At most 20 new contributions per day.';
    end if;
  end if;
  if tg_op = 'UPDATE' and (new.lang, new.title, new.summary, new.domains, new.tool_kind, new.project_url, new.docs_url,
      new.demo_url, new.dev_status, new.licence, new.limitations, new.hypothesis, new.evidence_level,
      new.references_md, new.validation_approach, new.body_md, new.ai_assisted, new.ai_disclosure, new.origin)
      is distinct from (old.lang, old.title, old.summary, old.domains, old.tool_kind, old.project_url, old.docs_url,
      old.demo_url, old.dev_status, old.licence, old.limitations, old.hypothesis, old.evidence_level,
      old.references_md, old.validation_approach, old.body_md, old.ai_assisted, old.ai_disclosure, old.origin) then
    new.edited_at := now();
  end if;
  new.title := btrim(new.title);
  new.domains := array(select distinct d from unnest(new.domains) d order by d);
  return new;
end;
$$;

create trigger contributions_prepare before insert or update on public.contributions
  for each row execute function public.prepare_contribution();
create trigger contributions_touch before update on public.contributions
  for each row execute function public.touch_updated_at();

alter table public.contributions enable row level security;
revoke all on public.contributions from anon, authenticated;
grant select on public.contributions to anon, authenticated;
grant insert (type, lang, title, summary, domains, tool_kind, project_url, docs_url, demo_url, dev_status,
              licence, limitations, hypothesis, evidence_level, references_md, validation_approach, body_md,
              ai_assisted, ai_disclosure, origin)
  on public.contributions to authenticated;
grant update (lang, title, summary, domains, tool_kind, project_url, docs_url, demo_url, dev_status,
              licence, limitations, hypothesis, evidence_level, references_md, validation_approach, body_md,
              ai_assisted, ai_disclosure, origin)
  on public.contributions to authenticated;
grant delete on public.contributions to authenticated;

create policy "Published contributions are public; authors and moderators see more"
  on public.contributions for select
  using (status = 'published' or author_id = auth.uid() or public.is_moderator());
create policy "Members create their own drafts" on public.contributions for insert to authenticated
  with check (author_id = auth.uid() and status = 'draft');
create policy "Authors edit unpublished work" on public.contributions for update to authenticated
  using (author_id = auth.uid() and status in ('draft', 'changes_requested', 'unpublished'))
  with check (author_id = auth.uid());
create policy "Authors delete work that is not public" on public.contributions for delete to authenticated
  using (author_id = auth.uid() and status <> 'published');

-- ── Moderation audit trail ─────────────────────────────────────────────────
create table public.moderation_events (
  id          bigint generated always as identity primary key,
  target_type text not null check (target_type in ('contribution', 'comment', 'profile', 'report')),
  target_id   uuid not null,
  action      text not null,
  from_status text,
  to_status   text,
  note        text check (char_length(note) <= 2000),
  actor_id    uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);
create index moderation_events_target_idx on public.moderation_events (target_type, target_id, created_at);

alter table public.moderation_events enable row level security;
revoke all on public.moderation_events from anon, authenticated;
grant select on public.moderation_events to authenticated;
create policy "Moderators read the audit trail; authors read decisions on their work"
  on public.moderation_events for select to authenticated
  using (
    public.is_moderator()
    or (target_type = 'contribution' and exists (
      select 1 from public.contributions c where c.id = target_id and c.author_id = auth.uid()))
  );

create function public.log_moderation(p_type text, p_target uuid, p_action text, p_from text, p_to text, p_note text)
returns void language sql security definer set search_path = public as $$
  insert into public.moderation_events (target_type, target_id, action, from_status, to_status, note, actor_id)
  values (p_type, p_target, p_action, p_from, p_to, nullif(btrim(p_note), ''), auth.uid());
$$;
revoke all on function public.log_moderation(text, uuid, text, text, text, text) from public, anon, authenticated;

-- ── Workflow functions ─────────────────────────────────────────────────────
-- Returns the list of fields that still need completing before submission.
create function public.contribution_missing_fields(c public.contributions) returns text[]
language plpgsql stable as $$
declare
  missing text[] := '{}';
begin
  if char_length(btrim(c.summary)) < 20 then missing := array_append(missing, 'summary'); end if;
  if cardinality(c.domains) = 0 then missing := array_append(missing, 'domains'); end if;
  if c.ai_assisted and coalesce(btrim(c.ai_disclosure), '') = '' then missing := array_append(missing, 'ai_disclosure'); end if;
  case c.type
    when 'tool' then
      if c.tool_kind is null then missing := array_append(missing, 'tool_kind'); end if;
      if c.project_url is null then missing := array_append(missing, 'project_url'); end if;
      if c.dev_status is null then missing := array_append(missing, 'dev_status'); end if;
      if coalesce(btrim(c.licence), '') = '' then missing := array_append(missing, 'licence'); end if;
      if coalesce(btrim(c.limitations), '') = '' then missing := array_append(missing, 'limitations'); end if;
    when 'idea' then
      if char_length(coalesce(btrim(c.hypothesis), '')) < 50 then missing := array_append(missing, 'hypothesis'); end if;
      if c.evidence_level is null then missing := array_append(missing, 'evidence_level'); end if;
      if c.evidence_level in ('preliminary', 'published-elsewhere') and coalesce(btrim(c.references_md), '') = '' then
        missing := array_append(missing, 'references_md');
      end if;
    when 'article' then
      if char_length(coalesce(btrim(c.body_md), '')) < 200 then missing := array_append(missing, 'body_md'); end if;
  end case;
  return missing;
end;
$$;

create function public.submit_contribution(p_id uuid) returns public.contribution_status
language plpgsql security definer set search_path = public as $$
declare
  c public.contributions;
  missing text[];
begin
  select * into c from public.contributions where id = p_id for update;
  if not found or c.author_id is distinct from auth.uid() then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if c.status not in ('draft', 'changes_requested', 'unpublished') then
    raise exception 'invalid_transition' using errcode = 'P0001', detail = c.status::text;
  end if;
  missing := public.contribution_missing_fields(c);
  if cardinality(missing) > 0 then
    raise exception 'incomplete' using errcode = 'P0001', detail = array_to_string(missing, ',');
  end if;
  if (select count(*) from public.contributions where author_id = c.author_id and status = 'submitted') >= 10 then
    raise exception 'rate_limited' using errcode = 'P0001', hint = 'At most 10 submissions may await review.';
  end if;
  update public.contributions set status = 'submitted', submitted_at = now() where id = p_id;
  perform public.log_moderation('contribution', p_id, 'submit', c.status::text, 'submitted', null);
  return 'submitted';
end;
$$;

-- Authors may take back a submission (to draft) or take down their own
-- published or approved work (to unpublished) at any time.
create function public.withdraw_contribution(p_id uuid) returns public.contribution_status
language plpgsql security definer set search_path = public as $$
declare
  c public.contributions;
  target public.contribution_status;
begin
  select * into c from public.contributions where id = p_id for update;
  if not found or c.author_id is distinct from auth.uid() then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  target := case c.status when 'submitted' then 'draft'::public.contribution_status
                          when 'approved' then 'draft'::public.contribution_status
                          when 'published' then 'unpublished'::public.contribution_status end;
  if target is null then
    raise exception 'invalid_transition' using errcode = 'P0001', detail = c.status::text;
  end if;
  update public.contributions set status = target where id = p_id;
  perform public.log_moderation('contribution', p_id, 'withdraw', c.status::text, target::text, null);
  return target;
end;
$$;

create function public.review_contribution(p_id uuid, p_action text, p_note text default null)
returns public.contribution_status
language plpgsql security definer set search_path = public as $$
declare
  c public.contributions;
  target public.contribution_status;
begin
  if not public.is_moderator() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select * into c from public.contributions where id = p_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if c.author_id = auth.uid() and not public.is_admin() then
    raise exception 'own_contribution' using errcode = '42501', hint = 'Another moderator must review this.';
  end if;
  target := case
    when p_action = 'approve' and c.status = 'submitted' then 'approved'
    when p_action = 'request_changes' and c.status in ('submitted', 'approved') then 'changes_requested'
    when p_action = 'reject' and c.status in ('submitted', 'approved', 'unpublished') then 'rejected'
    when p_action = 'publish' and c.status in ('approved', 'unpublished') then 'published'
    when p_action = 'unpublish' and c.status = 'published' then 'unpublished'
  end::public.contribution_status;
  if target is null then
    raise exception 'invalid_transition' using errcode = 'P0001', detail = format('%s from %s', p_action, c.status);
  end if;
  if p_action in ('request_changes', 'reject', 'unpublish') and coalesce(btrim(p_note), '') = '' then
    raise exception 'note_required' using errcode = 'P0001';
  end if;
  -- Republishing work the author has edited since the last decision needs a fresh review.
  if p_action = 'publish' and c.edited_at > coalesce(c.reviewed_at, '-infinity') then
    raise exception 'review_required' using errcode = 'P0001';
  end if;
  update public.contributions
     set status = target,
         reviewed_at = now(),
         reviewed_by = auth.uid(),
         review_note = case when p_action in ('request_changes', 'reject', 'unpublish') then btrim(p_note) else review_note end,
         published_at = case when target = 'published' then coalesce(published_at, now()) else published_at end
   where id = p_id;
  perform public.log_moderation('contribution', p_id, p_action, c.status::text, target::text, p_note);
  return target;
end;
$$;

-- Admins appoint moderators and mark official AIPE contributors.
create function public.set_member_role(p_username text, p_role public.member_role, p_official boolean)
returns void language plpgsql security definer set search_path = public as $$
declare
  p public.profiles;
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select * into p from public.profiles where username = p_username for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  update public.profiles set role = p_role, is_official = p_official where id = p.id;
  perform public.log_moderation('profile', p.id, 'set_role', format('%s/%s', p.role, p.is_official),
                                format('%s/%s', p_role, p_official), null);
end;
$$;

revoke all on function public.submit_contribution(uuid), public.withdraw_contribution(uuid),
  public.review_contribution(uuid, text, text), public.set_member_role(text, public.member_role, boolean)
  from public, anon;
grant execute on function public.submit_contribution(uuid), public.withdraw_contribution(uuid),
  public.review_contribution(uuid, text, text), public.set_member_role(text, public.member_role, boolean)
  to authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
