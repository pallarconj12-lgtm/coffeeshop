import { createClient } from "@/lib/supabase/server";

const DEFAULT_STORE_NAME = "Third Wave Coffee Co.";

/**
 * Reads a single value from the `settings` table.
 * Falls back to `fallback` if the row doesn't exist or the query fails,
 * so the storefront never renders blank text while settings load.
 */
export async function getSetting(key: string, fallback = "") {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  return data?.value || fallback;
}

export async function getStoreName() {
  return getSetting("store_name", DEFAULT_STORE_NAME);
}
