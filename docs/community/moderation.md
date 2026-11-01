# Community moderation

## Roles

| Role | Can |
| --- | --- |
| Member | Edit own profile; create, edit, submit, withdraw and delete own unpublished contributions |
| Moderator | Everything a member can, plus review others' submissions, publish and unpublish, read the audit trail |
| Admin | Everything a moderator can, plus appoint moderators and official contributors, review own work |

"Official AIPE contributor" (`is_official`) is a badge for AIPE team members and invited contributors. It grants
no permissions and is not a professional verification.

## Initial administrator

1. Sign up on the site (or with GitHub) using the account that will administer the Community.
2. In the Supabase dashboard → SQL editor (which runs as the database owner), run:

   ```sql
   update public.profiles set role = 'admin', is_official = true where username = '<your-username>';
   ```

3. Further roles are set by an admin on `/community/moderation/` (Member roles form), which calls
   `set_member_role` and records the change in `moderation_events`.

## Reviewing a submission

Open `/community/moderation/`. The queue shows submissions oldest first. For each:

1. Check **scope** (power and energy engineering, AI for engineering), **clarity**, **links** (they work and point
   where they say), **licensing** (stated, plausible), **evidence** (ideas claim no more than they support;
   preliminary or published evidence has references) and **conduct** ([guidelines](../../community/guidelines.md)).
2. Decide:
   - **Approve** — ready; then **Publish** when you want it public (you can approve and publish at once).
   - **Request changes** — note required; the author edits and resubmits.
   - **Reject** — note required; out of scope or not acceptable.
3. **Unpublish** (note required) removes a published contribution from public view, for example after a valid
   report. Republishing unchanged work needs no fresh review; if the author edits it, it must be resubmitted.

Review is a suitability check, not an engineering validation. Never mark community work as validated.

## Audit trail

`moderation_events` records every submission, withdrawal, decision, role change (and, from Phase 3, comment and
report actions) with actor, from/to status, note and time. It is append-only for clients. Authors can read the
decisions on their own contributions; moderators can read everything.

## Promoting a contribution

Community content never enters official sections automatically. When a contribution deserves to become official:

1. Agree it with the author (attribution, licence, any changes).
2. Make the change through the owning workflow, by pull request:
   - **Hub / Registry** — the tool must be registered in AIPE Registry by its maintainer; then follow
     [Adding a capability to the site](../development.md#adding-a-capability-to-the-site).
   - **Frontiers** — write an exploration entry per [exploration-template.md](../exploration-template.md) with
     its own evidence record; the community idea is cited as the origin.
   - **Blog** — add a post under `_posts/` crediting the author and linking the community page; record it in
     `_data/blog-ownership.json`.
   - **Academy** — propose the material to the AIPE Academy repository; the site only publishes what Academy
     releases.
3. Keep the community page published (it remains the author's version) and add a reviewer note if useful.
