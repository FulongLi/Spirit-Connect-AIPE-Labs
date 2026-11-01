-- Generic fixed-window rate limiter for server-side code (Edge Functions and
-- SECURITY DEFINER functions). Keys are opaque strings such as
-- 'newsletter:ip:<sha256>'; callers hash personal data before using it as a key.

create table if not exists public.rate_limits (
  bucket       text        not null,
  window_start timestamptz not null,
  hits         integer     not null default 0,
  primary key (bucket, window_start)
);

alter table public.rate_limits enable row level security;
-- No policies: only the service role and SECURITY DEFINER functions touch it.
revoke all on public.rate_limits from anon, authenticated;

-- Records one hit and returns true while the bucket is within its limit.
create or replace function public.hit_rate_limit(p_bucket text, p_max integer, p_window interval)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_start timestamptz := to_timestamp(floor(extract(epoch from now()) / extract(epoch from p_window)) * extract(epoch from p_window));
  v_hits  integer;
begin
  insert into public.rate_limits as r (bucket, window_start, hits)
  values (p_bucket, v_start, 1)
  on conflict (bucket, window_start) do update set hits = r.hits + 1
  returning r.hits into v_hits;
  -- Opportunistic clean-up of old windows keeps the table small.
  delete from public.rate_limits where window_start < now() - interval '2 days';
  return v_hits <= p_max;
end;
$$;

revoke all on function public.hit_rate_limit(text, integer, interval) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, interval) to service_role;
