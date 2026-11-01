import { test } from "node:test";
import assert from "node:assert/strict";
import { BUTTONDOWN_SUBSCRIBERS, handleSubscribe, TURNSTILE_VERIFY, validEmail } from "../../supabase/functions/_shared/newsletter.ts";
import { anon, createDatabase, rejects, service } from "./support/db.mjs";

const ORIGIN = "https://aipel.co.uk";

function request(body, { origin = ORIGIN, method = "POST", ip = "203.0.113.7" } = {}) {
  return new Request("https://example.supabase.co/functions/v1/newsletter-subscribe", {
    method,
    headers: { "content-type": "application/json", origin, "x-forwarded-for": ip },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });
}

function deps({ env = {}, providerStatus = 201, providerBody = "{}", limit = () => true, captcha = true } = {}) {
  const calls = [];
  return {
    calls,
    env: { BUTTONDOWN_API_KEY: "test-key", ALLOWED_ORIGINS: `${ORIGIN},http://localhost:4000`, ...env },
    rateLimit: async (...args) => limit(...args),
    fetch: async (url, init) => {
      calls.push({ url, init });
      if (url === TURNSTILE_VERIFY) return new Response(JSON.stringify({ success: captcha }));
      return new Response(providerBody, { status: providerStatus });
    },
  };
}

const valid = { email: "Engineer@Example.org", consent: true, website: "", lang: "en" };

test("email validation", () => {
  assert.ok(validEmail("a.b@example.co.uk"));
  for (const bad of ["", "no-at", "a@b", "a b@example.com", "<x>@example.com", `${"a".repeat(250)}@example.com`, 42]) {
    assert.equal(validEmail(bad), false, String(bad));
  }
});

test("creates a pending double opt-in subscriber and keeps the key server-side", async () => {
  const d = deps();
  const res = await handleSubscribe(request(valid), d);
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { ok: true, status: "confirmation_sent" });
  assert.equal(res.headers.get("access-control-allow-origin"), ORIGIN);
  assert.equal(d.calls.length, 1);
  assert.equal(d.calls[0].url, BUTTONDOWN_SUBSCRIBERS);
  assert.equal(d.calls[0].init.headers.Authorization, "Token test-key");
  const sent = JSON.parse(d.calls[0].init.body);
  assert.equal(sent.email_address, "engineer@example.org");
  assert.equal(sent.type, "unactivated");
  assert.equal(sent.ip_address, "203.0.113.7");
  assert.ok(!JSON.stringify(await (await handleSubscribe(request(valid), deps())).json()).includes("test-key"));
});

test("unconfigured provider reports an error, never success", async () => {
  const d = deps({ env: { BUTTONDOWN_API_KEY: "" } });
  const res = await handleSubscribe(request(valid), d);
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { ok: false, error: "not_configured" });
  assert.equal(d.calls.length, 0);
});

test("requires explicit consent and a valid address", async () => {
  let res = await handleSubscribe(request({ ...valid, consent: false }), deps());
  assert.equal((await res.json()).error, "consent_required");
  res = await handleSubscribe(request({ ...valid, consent: "yes" }), deps());
  assert.equal((await res.json()).error, "consent_required");
  res = await handleSubscribe(request({ ...valid, email: "not-an-email" }), deps());
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "invalid_email");
});

test("honeypot submissions are dropped without contacting the provider", async () => {
  const d = deps();
  const res = await handleSubscribe(request({ ...valid, website: "http://spam.example" }), d);
  assert.equal(res.status, 202);
  assert.equal(d.calls.length, 0);
});

test("existing subscribers get the same neutral answer (no duplicate, no enumeration)", async () => {
  const res = await handleSubscribe(request(valid), deps({ providerStatus: 400, providerBody: '{"code":"email_already_exists"}' }));
  assert.equal(res.status, 202);
  assert.deepEqual(await res.json(), { ok: true, status: "pending_or_existing" });
});

test("provider failures surface as errors", async () => {
  assert.equal((await handleSubscribe(request(valid), deps({ providerStatus: 500 }))).status, 502);
  assert.equal((await handleSubscribe(request(valid), deps({ providerStatus: 429 }))).status, 429);
  assert.equal((await handleSubscribe(request(valid), deps({ providerStatus: 400, providerBody: '{"detail":"invalid"}' }))).status, 400);
  const broken = deps();
  broken.fetch = async () => { throw new Error("network down"); };
  assert.equal((await handleSubscribe(request(valid), broken)).status, 502);
});

test("rate limiting blocks repeated attempts per IP and per address", async () => {
  const buckets = [];
  const d = deps({ limit: (bucket) => { buckets.push(bucket); return !bucket.startsWith("newsletter:ip:"); } });
  const res = await handleSubscribe(request(valid), d);
  assert.equal(res.status, 429);
  assert.equal(d.calls.length, 0);
  assert.ok(buckets.every((b) => !b.includes("203.0.113.7") && !b.includes("example.org")), "keys are hashed");
});

test("origin allow-list, methods and payload size", async () => {
  assert.equal((await handleSubscribe(request(valid, { origin: "https://evil.example" }), deps())).status, 403);
  assert.equal((await handleSubscribe(request(valid, { method: "GET" }), deps())).status, 405);
  const preflight = await handleSubscribe(new Request("https://x/", { method: "OPTIONS", headers: { origin: ORIGIN } }), deps());
  assert.equal(preflight.status, 204);
  const big = await handleSubscribe(request({ ...valid, padding: "x".repeat(5000) }), deps());
  assert.equal(big.status, 413);
});

test("Turnstile is enforced when a secret is configured", async () => {
  const env = { TURNSTILE_SECRET_KEY: "secret" };
  assert.equal((await (await handleSubscribe(request(valid), deps({ env }))).json()).error, "captcha_failed");
  assert.equal((await handleSubscribe(request({ ...valid, captcha: "tok" }), deps({ env, captcha: false }))).status, 400);
  assert.equal((await handleSubscribe(request({ ...valid, captcha: "tok" }), deps({ env, captcha: true }))).status, 201);
});

test("database rate limiter counts per window and is closed to clients", async () => {
  const db = await createDatabase();
  const hit = () => service(db, "select public.hit_rate_limit('t', 2, interval '1 hour') as ok");
  assert.equal((await hit()).rows[0].ok, true);
  assert.equal((await hit()).rows[0].ok, true);
  assert.equal((await hit()).rows[0].ok, false);
  await rejects(anon(db, "select public.hit_rate_limit('t', 100, interval '1 hour')"), /permission denied/);
  await rejects(anon(db, "select * from public.rate_limits"), /permission denied/);
});
