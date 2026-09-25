import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Bypasses Row Level Security entirely. Server-only, never imported by
 * client components. Use for privileged admin operations that legitimately
 * need to cross RLS boundaries (e.g. an owner managing staff accounts).
 */
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
