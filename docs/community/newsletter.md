# AIPE Updates newsletter

Subscriptions are collected at `/subscribe/` and `/zh/subscribe/` and stored by
[Buttondown](https://buttondown.com). The website never stores subscriber addresses itself.

## How it works

1. The form posts `{email, consent, lang}` to the `newsletter-subscribe` Edge Function
   (`supabase/functions/newsletter-subscribe/`).
2. The function checks the origin allow-list, explicit consent, the address format, a honeypot field,
   optional Cloudflare Turnstile and two rate limits (5 attempts per IP per hour, 3 per address per day;
   keys are SHA-256 hashes).
3. It creates the subscriber at Buttondown with `type: "unactivated"`, so Buttondown sends a
   confirmation email (double opt-in). Nothing else is sent until the subscriber confirms.
4. Existing or previously unsubscribed addresses get the same neutral answer as new ones, so the form
   neither duplicates subscribers nor reveals who is subscribed.
5. If `BUTTONDOWN_API_KEY` is missing the function answers `503 not_configured`; if the site has no
   `community_backend.supabase_url` the form is disabled. Neither case reports success.

## Provider configuration (one-off)

1. Create the Buttondown newsletter (sender name "AIPE Labs", reply-to `info@spiritconnect.co.uk`) and
   verify the sending domain in Buttondown so mail is sent from `aipel.co.uk`.
2. Settings → Subscribing: keep double opt-in on. Set the confirmation redirect to
   `https://aipel.co.uk/subscribe/?state=confirmed` and, if offered, the unsubscribe redirect to
   `https://aipel.co.uk/subscribe/?state=unsubscribed`.
3. Settings → API: create a key and store it only as a Supabase secret:
   `supabase secrets set BUTTONDOWN_API_KEY=… ALLOWED_ORIGINS=https://aipel.co.uk`.
4. Deploy the function: `supabase functions deploy newsletter-subscribe --no-verify-jwt`.
5. Set `community_backend.supabase_url` in `_config.yml` (see [setup.md](setup.md)).

## Verifying subscription and unsubscription

1. Subscribe with a test address on `/subscribe/`: the page says to check the inbox, and the subscriber
   appears in Buttondown as *unactivated*.
2. Open the confirmation email and click the link: Buttondown marks the subscriber *regular* and
   redirects to `/subscribe/?state=confirmed`.
3. Submit the same address again: the neutral "if it already is, nothing changes" message appears and
   Buttondown still holds one subscriber.
4. Send a test issue to that address and use its unsubscribe link: the subscriber becomes
   *unsubscribed* and the redirect shows `/subscribe/?state=unsubscribed`.

## Editorial template — AIPE Updates

Keep each issue short; link out rather than reproduce content. Leave a section out when there is
nothing worth saying. Default cadence: monthly, never promised publicly as a fixed schedule.

```markdown
Subject: AIPE Updates — <Month YYYY>

<One or two sentences: the most important change this month.>

## New Engineering Tools
- **<Tool name>** — <what it does, one line>. <link to the Hub page>

## Research & Frontiers
- **<Topic>** (<evidence status>) — <what changed>. <link to the Frontiers page>

## AIPE Development Updates
- <Academy lesson / Plugin release / site change>. <link>

—
AIPE Labs · Cardiff, United Kingdom
You receive this because you subscribed at aipel.co.uk. {{ unsubscribe_url }}
```

## Sending an issue

1. Draft in Buttondown (Emails → New) using the template above; Buttondown adds the unsubscribe
   link and postal footer automatically.
2. Check every link, then send a test to yourself.
3. Schedule or send. Optionally publish the archive copy on `/news/` as a normal post.
