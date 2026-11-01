// Supabase Edge Function: POST /functions/v1/delete-account
// Called by a signed-in member with their access token and {"confirm":"DELETE"}.
// Secrets: ALLOWED_ORIGINS. SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected.

import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { handleDeleteAccount } from "../_shared/account.ts";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

Deno.serve((request) =>
  handleDeleteAccount(request, {
    env: { ALLOWED_ORIGINS: Deno.env.get("ALLOWED_ORIGINS") },
    getUser: async (token) => {
      const { data, error } = await admin.auth.getUser(token);
      return error || !data.user ? null : { id: data.user.id };
    },
    listAvatars: async (uid) => {
      const { data, error } = await admin.storage.from("avatars").list(uid, { limit: 100 });
      if (error) throw error;
      return (data ?? []).map((file) => `${uid}/${file.name}`);
    },
    removeAvatars: async (paths) => {
      const { error } = await admin.storage.from("avatars").remove(paths);
      if (error) throw error;
    },
    deleteUser: async (uid) => {
      const { error } = await admin.auth.admin.deleteUser(uid);
      if (error) throw error;
    },
  })
);
