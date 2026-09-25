import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // RLS already restricts this to orders belonging to the signed-in
  // customer (or staff), so no extra ownership check is needed here.
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, status, fulfillment, delivery_address, notes, subtotal, total, created_at, customer_id"
    )
    .eq("id", id)
    .maybeSingle();

  if (!order || order.customer_id !== user.id) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_name, size_label, unit_price, quantity, line_total")
    .eq("order_id", id)
    .order("id");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to My Account
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h1>
          <Badge status={order.status}>{order.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Placed {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium text-right">Unit Price</th>
                  <th className="px-6 py-3 font-medium text-right">Qty</th>
                  <th className="px-6 py-3 font-medium text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {(items ?? []).map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-6 py-3">
                      {item.product_name}
                      {item.size_label && (
                        <span className="text-muted-foreground"> ({item.size_label})</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">₱{Number(item.unit_price).toFixed(2)}</td>
                    <td className="px-6 py-3 text-right">{item.quantity}</td>
                    <td className="px-6 py-3 text-right">₱{Number(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={3} className="px-6 py-3 text-right font-medium">
                    Subtotal
                  </td>
                  <td className="px-6 py-3 text-right font-medium">
                    ₱{Number(order.subtotal).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right font-semibold">
                    Total
                  </td>
                  <td className="px-6 py-3 text-right font-semibold">
                    ₱{Number(order.total).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fulfillment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="capitalize font-medium">{order.fulfillment}</p>
              <p className="text-muted-foreground">
                {order.delivery_address || "Pickup at the counter"}
              </p>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{order.notes}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
