import { createClient } from "@/lib/supabase/server";
import { createCategory } from "@/server/actions/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">{categories?.length ?? 0} categories</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              "use server";
              await createCategory(formData);
            }}
            className="flex gap-3"
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="flex items-end">
              <Button type="submit">Add</Button>
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
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {(categories ?? []).map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-muted-foreground">{c.slug}</td>
                  <td className="p-4 text-right">
                    <CategoryDeleteButton id={c.id} />
                  </td>
                </tr>
              ))}
              {(categories ?? []).length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">
                    No categories yet.
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
