"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/guards";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createCategory(formData: FormData) {
  await requireStaff();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description: String(formData.get("description") ?? "") || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function createProduct(formData: FormData) {
  await requireStaff();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    name,
    slug: slugify(name),
    description: String(formData.get("description") ?? "") || null,
    category_id: String(formData.get("categoryId") ?? "") || null,
    image_url: String(formData.get("imageUrl") ?? "") || null,
    roast: String(formData.get("roast") ?? "") || null,
    base_price: Number(formData.get("basePrice") ?? 0),
    stock_quantity: Number(formData.get("stockQuantity") ?? 0),
    is_featured: formData.get("isFeatured") === "on",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateProductStock(id: string, stockQuantity: number) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ stock_quantity: stockQuantity })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
}
