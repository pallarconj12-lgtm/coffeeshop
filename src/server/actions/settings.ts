"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";

export async function updateSettings(formData: FormData) {
  await requireRole(["owner", "manager"]);
  const supabase = await createClient();

  const keys = ["store_name", "currency", "contact_email"];
  for (const key of keys) {
    const value = String(formData.get(key) ?? "");
    const { error } = await supabase.from("settings").update({ value }).eq("key", key);
    if (error) return { error: error.message };
  }

  // "layout" revalidates every route nested under these layouts (root title,
  // storefront navbar/footer, admin sidebar) — not just the exact path.
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}
