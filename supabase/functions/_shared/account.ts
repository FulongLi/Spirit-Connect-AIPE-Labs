// Account deletion: the one community operation that needs the service role,
// because members cannot delete their own auth.users row. Deleting the auth
// user cascades to the profile, contributions and comments; profile images
// are removed from Storage first. Moderation records keep the decision with
// the actor set to null.

import { allowedOrigin, corsHeaders, json, parseOrigins } from "./http.ts";

export interface AccountDeps {
  env: { ALLOWED_ORIGINS?: string };
  // Resolves the caller from their access token; null if invalid or expired.
  getUser: (token: string) => Promise<{ id: string } | null>;
  listAvatars: (uid: string) => Promise<string[]>;
  removeAvatars: (paths: string[]) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
}

export async function handleDeleteAccount(request: Request, deps: AccountDeps): Promise<Response> {
  const origin = allowedOrigin(request.headers.get("origin"), parseOrigins(deps.env.ALLOWED_ORIGINS));
  const cors = corsHeaders(origin);
  if (request.method === "OPTIONS") return new Response(null, { status: origin ? 204 : 403, headers: cors });
  if (request.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" }, cors);
  if (!origin) return json(403, { ok: false, error: "origin_not_allowed" }, cors);

  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const user = token ? await deps.getUser(token) : null;
  if (!user) return json(401, { ok: false, error: "unauthorised" }, cors);

  let body: { confirm?: unknown } = {};
  try {
    body = JSON.parse((await request.text()).slice(0, 1024) || "{}");
  } catch {
    return json(400, { ok: false, error: "invalid_request" }, cors);
  }
  if (body.confirm !== "DELETE") return json(400, { ok: false, error: "confirmation_required" }, cors);

  try {
    const avatars = await deps.listAvatars(user.id);
    if (avatars.length) await deps.removeAvatars(avatars);
    await deps.deleteUser(user.id);
  } catch {
    return json(500, { ok: false, error: "deletion_failed" }, cors);
  }
  return json(200, { ok: true }, cors);
}
