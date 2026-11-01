// In-process PostgreSQL (PGlite) with a minimal stand-in for the parts of the
// Supabase platform the migrations rely on: the anon / authenticated /
// service_role roles, auth.users, auth.uid() and Supabase's default grants.
// The real migration files are then applied unchanged, so row-level security
// and the SECURITY DEFINER workflow functions are tested as written.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

const ROOT = new URL("../../../", import.meta.url).pathname;
const MIGRATIONS = join(ROOT, "supabase", "migrations");

const PLATFORM = `
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(coalesce(current_setting('request.jwt.claim.sub', true),
                         (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')), '')::uuid
$$;
create function auth.role() returns text language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'
$$;
grant execute on function auth.uid(), auth.role() to anon, authenticated, service_role;
grant all on auth.users to service_role;

create schema storage;
grant usage on schema storage to anon, authenticated, service_role;
create table storage.buckets (
  id text primary key, name text not null, public boolean default false,
  file_size_limit bigint, allowed_mime_types text[]
);
create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets(id), name text not null, owner uuid,
  created_at timestamptz default now()
);
alter table storage.objects enable row level security;
grant all on storage.buckets to service_role;
grant select on storage.buckets to anon, authenticated;
grant all on storage.objects to anon, authenticated, service_role;
create function storage.foldername(name text) returns text[] language sql immutable as $$
  select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1]
$$;
grant execute on function storage.foldername(text) to anon, authenticated, service_role;
`;

export async function createDatabase() {
  const db = new PGlite();
  await db.exec(PLATFORM);
  for (const file of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
    try {
      await db.exec(readFileSync(join(MIGRATIONS, file), "utf8"));
    } catch (error) {
      throw new Error(`Migration ${file} failed: ${error.message}`);
    }
  }
  return db;
}

// Creates an auth user (as the platform would on sign-up); triggers run.
export async function createUser(db, { email, name, username } = {}) {
  const id = randomUUID();
  const meta = {};
  if (name) meta.full_name = name;
  if (username) meta.user_name = username;
  await db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)",
    [id, email ?? `${id.slice(0, 8)}@example.test`, meta]);
  return id;
}

// Runs `sql` with the privileges of a request: anonymous (uid null),
// a signed-in user, or the service role.
export async function as(db, uid, sql, params = [], role) {
  const effectiveRole = role ?? (uid ? "authenticated" : "anon");
  const claims = JSON.stringify(uid ? { sub: uid, role: effectiveRole } : { role: effectiveRole });
  await db.query("select set_config('request.jwt.claims', $1, false)", [claims]);
  await db.exec(`set role ${effectiveRole}`);
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claims', '', false)");
  }
}

export const anon = (db, sql, params) => as(db, null, sql, params);
export const service = (db, sql, params) => as(db, null, sql, params, "service_role");

export async function rejects(promise, pattern) {
  try {
    await promise;
  } catch (error) {
    if (pattern && !pattern.test(error.message)) {
      throw new Error(`Expected error matching ${pattern}, got: ${error.message}`);
    }
    return error;
  }
  throw new Error(`Expected the statement to fail${pattern ? ` with ${pattern}` : ""}`);
}
