import { createClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, full_name, email, phone, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers?.length ?? 0} customers</p>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{c.full_name || "—"}</td>
                <td className="p-4 text-muted-foreground">{c.email}</td>
                <td className="p-4 text-muted-foreground">{c.phone || "—"}</td>
                <td className="p-4 text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(customers ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
