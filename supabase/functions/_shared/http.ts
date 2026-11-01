// Small HTTP helpers shared by the Edge Functions. Runtime-neutral (Deno and
// Node 22+), so the functions' logic can be unit-tested without Deno.

export function allowedOrigin(origin: string | null, allowList: string[]): string | null {
  if (!origin) return null;
  return allowList.includes(origin) ? origin : null;
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

export function json(status: number, body: unknown, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });
}

export function parseOrigins(value: string | undefined): string[] {
  return (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

// Client IP as reported by the Supabase edge proxy.
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0].trim() || request.headers.get("cf-connecting-ip") || "";
}

export async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
