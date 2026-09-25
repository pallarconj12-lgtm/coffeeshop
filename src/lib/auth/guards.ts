import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "owner" | "manager" | "staff";

export type StaffUser = {
  id: string;
  email: string;
  full_name: string;
  role: StaffRole;
};

/**
 * Requires any authenticated staff account (owner, manager, or staff).
 * Redirects to /admin/login if not authenticated, or /admin/unauthorized
 * if authenticated but not present in public.staff_users.
 */
export async function requireStaff(): Promise<StaffUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: staff } = await supabase
    .from("staff_users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!staff) {
    redirect("/admin/unauthorized");
  }

  return staff as StaffUser;
}

/**
 * Requires the authenticated staff account to hold one of `roles`.
 * Useful for gating specific admin pages (e.g. Settings: owner only).
 */
export async function requireRole(roles: StaffRole[]): Promise<StaffUser> {
  const staff = await requireStaff();
  if (!roles.includes(staff.role)) {
    redirect("/admin/unauthorized");
  }
  return staff;
}
