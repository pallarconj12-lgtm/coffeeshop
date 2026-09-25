import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, image_url, base_price, roast")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

export async function getNewArrivals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, image_url, base_price, roast")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

export async function getAllProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, image_url, base_price, roast")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProductsByCategorySlug(slug: string) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", slug)
    .maybeSingle();

  if (!category) return { category: null, products: [] };

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, image_url, base_price, roast")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return { category, products: products ?? [] };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, image_url, base_price, roast, stock_quantity, category_id, categories(name, slug)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) return null;

  const { data: sizes } = await supabase
    .from("product_sizes")
    .select("id, label, price_delta")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  return { ...product, sizes: sizes ?? [] };
}
