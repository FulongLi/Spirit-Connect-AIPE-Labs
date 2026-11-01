// Newsletter subscription logic: validates the request, applies spam
// protection and creates a pending (double opt-in) subscriber at Buttondown.
// The provider API key never leaves the server. Newsletter consent is
// independent of AIPE Community membership.

import { allowedOrigin, clientIp, corsHeaders, json, parseOrigins, sha256 } from "./http.ts";

export interface NewsletterEnv {
  BUTTONDOWN_API_KEY?: string;
  ALLOWED_ORIGINS?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export interface NewsletterDeps {
  env: NewsletterEnv;
  fetch: typeof fetch;
  // Returns false once `bucket` has exceeded `max` hits in the window.
  rateLimit: (bucket: string, max: number, windowSeconds: number) => Promise<boolean>;
}

export const BUTTONDOWN_SUBSCRIBERS = "https://api.buttondown.com/v1/subscribers";
export const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const CONSENT_VERSION = "2026-11-01";
const MAX_BODY_BYTES = 4096;
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export function validEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL.test(value);
}

export async function handleSubscribe(request: Request, deps: NewsletterDeps): Promise<Response> {
  const origin = allowedOrigin(request.headers.get("origin"), parseOrigins(deps.env.ALLOWED_ORIGINS));
  const cors = corsHeaders(origin);
  if (request.method === "OPTIONS") return new Response(null, { status: origin ? 204 : 403, headers: cors });
  if (request.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" }, cors);
  if (!origin) return json(403, { ok: false, error: "origin_not_allowed" }, cors);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: "payload_too_large" }, cors);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "invalid_request" }, cors);
  }
  if (!body || typeof body !== "object") return json(400, { ok: false, error: "invalid_request" }, cors);

  // Honeypot: real visitors never fill the hidden field. Bots get the same
  // neutral answer as a duplicate address, and nothing is sent anywhere.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json(202, { ok: true, status: "pending_or_existing" }, cors);
  }
  if (body.consent !== true) return json(400, { ok: false, error: "consent_required" }, cors);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!validEmail(email)) return json(400, { ok: false, error: "invalid_email" }, cors);

  // Never pretend to succeed when the provider has not been configured.
  if (!deps.env.BUTTONDOWN_API_KEY) return json(503, { ok: false, error: "not_configured" }, cors);

  const ip = clientIp(request);
  if (deps.env.TURNSTILE_SECRET_KEY) {
    const token = typeof body.captcha === "string" ? body.captcha : "";
    if (!token || !(await verifyTurnstile(deps, token, ip))) {
      return json(400, { ok: false, error: "captcha_failed" }, cors);
    }
  }

  const ipKey = await sha256(`ip:${ip}`);
  const emailKey = await sha256(`email:${email}`);
  if (!(await deps.rateLimit(`newsletter:ip:${ipKey}`, 5, 3600)) ||
      !(await deps.rateLimit(`newsletter:email:${emailKey}`, 3, 86400))) {
    return json(429, { ok: false, error: "rate_limited" }, cors);
  }

  const lang = body.lang === "zh" ? "zh" : "en";
  let response: Response;
  try {
    response = await deps.fetch(BUTTONDOWN_SUBSCRIBERS, {
      method: "POST",
      headers: { "Authorization": `Token ${deps.env.BUTTONDOWN_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email_address: email,
        type: "unactivated", // double opt-in: Buttondown sends the confirmation email
        ...(ip ? { ip_address: ip } : {}),
        metadata: { source: "aipel.co.uk/subscribe", lang, consent_version: CONSENT_VERSION },
      }),
    });
  } catch {
    return json(502, { ok: false, error: "provider_unavailable" }, cors);
  }

  if (response.status === 201 || response.status === 200) {
    return json(201, { ok: true, status: "confirmation_sent" }, cors);
  }
  const detail = await response.text().catch(() => "");
  if (response.status === 400 && /already|exist|collision|suppressed/i.test(detail)) {
    // Existing (or previously unsubscribed) address: answer exactly as for a
    // new one so the form cannot be used to discover who is subscribed.
    return json(202, { ok: true, status: "pending_or_existing" }, cors);
  }
  if (response.status === 400) return json(400, { ok: false, error: "invalid_email" }, cors);
  if (response.status === 429) return json(429, { ok: false, error: "rate_limited" }, cors);
  return json(502, { ok: false, error: "provider_error" }, cors);
}

async function verifyTurnstile(deps: NewsletterDeps, token: string, ip: string): Promise<boolean> {
  const form = new URLSearchParams({ secret: deps.env.TURNSTILE_SECRET_KEY ?? "", response: token });
  if (ip) form.set("remoteip", ip);
  try {
    const res = await deps.fetch(TURNSTILE_VERIFY, { method: "POST", body: form });
    const data = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}
