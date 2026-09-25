import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, contact_name, contact_email, status, fulfillment, total, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders?.length ?? 0} orders</p>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Fulfillment</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Placed</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-accent/40 transition-colors">
                <td className="p-4">
                  <Link href={`/admin/orders/${o.id}`} className="block">
                    <p className="font-medium hover:underline">{o.contact_name}</p>
                    <p className="text-xs text-muted-foreground">{o.contact_email}</p>
                  </Link>
                </td>
                <td className="p-4 capitalize text-muted-foreground">{o.fulfillment}</td>
                <td className="p-4">₱{Number(o.total).toFixed(2)}</td>
                <td className="p-4 text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
