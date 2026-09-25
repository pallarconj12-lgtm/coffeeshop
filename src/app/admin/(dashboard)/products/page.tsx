import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/server/actions/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductRowActions } from "@/components/admin/product-row-actions";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, base_price, stock_quantity, is_active, roast, categories(name)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">{products?.length ?? 0} products</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              "use server";
              await createProduct(formData);
            }}
            className="grid sm:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">None</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Price (₱)</Label>
              <Input id="basePrice" name="basePrice" type="number" step="0.01" min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input id="stockQuantity" name="stockQuantity" type="number" min="0" defaultValue={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roast">Roast</Label>
              <select
                id="roast"
                name="roast"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">N/A</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input id="isFeatured" name="isFeatured" type="checkbox" className="h-4 w-4" />
              <Label htmlFor="isFeatured" className="font-normal">Feature on homepage</Label>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Add Product</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-muted-foreground">
                    {(p.categories as unknown as { name: string } | null)?.name ?? "—"}
                  </td>
                  <td className="p-4">₱{Number(p.base_price).toFixed(2)}</td>
                  <td className="p-4">{p.stock_quantity}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        p.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-4">
                    <ProductRowActions id={p.id} isActive={p.is_active} />
                  </td>
                </tr>
              ))}
              {(products ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
