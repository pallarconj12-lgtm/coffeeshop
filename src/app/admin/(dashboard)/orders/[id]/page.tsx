import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, contact_name, contact_email, contact_phone, delivery_address, notes, status, fulfillment, subtotal, total, created_at, customer_id"
    )
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_name, size_label, unit_price, quantity, line_total")
    .eq("order_id", id)
    .order("id");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
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
                {(items ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No items recorded for this order.
                    </td>
                  </tr>
                )}
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
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.contact_name}</p>
              <p className="text-muted-foreground">{order.contact_email}</p>
              <p className="text-muted-foreground">{order.contact_phone || "No phone provided"}</p>
              <p className="text-xs text-muted-foreground pt-1">
                {order.customer_id ? "Registered account" : "Guest checkout"}
              </p>
            </CardContent>
          </Card>

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
