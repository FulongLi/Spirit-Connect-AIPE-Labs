// Supabase Edge Function: POST /functions/v1/newsletter-subscribe
// Secrets (set with `supabase secrets set`): BUTTONDOWN_API_KEY, ALLOWED_ORIGINS,
// optional TURNSTILE_SECRET_KEY. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are
// injected by the platform and used only for the rate limiter.

import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { handleSubscribe } from "../_shared/newsletter.ts";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

Deno.serve((request) =>
  handleSubscribe(request, {
    env: {
      BUTTONDOWN_API_KEY: Deno.env.get("BUTTONDOWN_API_KEY"),
      ALLOWED_ORIGINS: Deno.env.get("ALLOWED_ORIGINS"),
      TURNSTILE_SECRET_KEY: Deno.env.get("TURNSTILE_SECRET_KEY"),
    },
    fetch,
    rateLimit: async (bucket, max, windowSeconds) => {
      const { data, error } = await admin.rpc("hit_rate_limit", {
        p_bucket: bucket,
        p_max: max,
        p_window: `${windowSeconds} seconds`,
      });
      // Fail closed: if the limiter is unavailable, refuse rather than risk abuse.
      return !error && data === true;
    },
  })
);
