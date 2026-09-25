"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string } | void;

export async function customerLogin(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function customerRegister(formData: FormData): Promise<ActionResult> {
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account." };

  const { error: profileError } = await supabase.from("customers").insert({
    id: data.user.id,
    email,
    full_name: fullName,
    phone: phone || null,
  });

  if (profileError) return { error: profileError.message };

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) return { error: "Full name is required." };

  // Upsert: some accounts (created before the customers table existed, or
  // created outside this app) may not have a row here yet.
  const { error } = await supabase.from("customers").upsert({
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    phone: phone || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/account");
}

export async function staffLogin(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  const { data: staff } = await supabase
    .from("staff_users")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!staff) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access." };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
