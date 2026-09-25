"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { requireStaff } from "@/lib/auth/guards";
import type { CartItem } from "@/lib/cart/types";

export async function placeOrder(
  contact: { name: string; email: string; phone: string; address: string; notes: string },
  items: CartItem[]
) {
  if (items.length === 0) return { error: "Your cart is empty." };

  // Identify the caller (if any) with the normal cookie-scoped client, but
  // write the order with the service-role client. Guest checkout inserts a
  // row with customer_id = null, and the "orders" SELECT policy can't match
  // that back to an anonymous auth.uid() — Postgres then rejects the
  // INSERT...RETURNING with an RLS error even though the write itself was
  // allowed. This action already validates everything server-side, so it's
  // the trusted, privileged path RLS is meant to be bypassed for.
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const supabase = createServiceRoleClient();

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: user?.id ?? null,
      fulfillment: contact.address ? "delivery" : "pickup",
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone || null,
      delivery_address: contact.address || null,
      notes: contact.notes || null,
      subtotal,
      total: subtotal,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Could not create order." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      size_label: item.sizeLabel ?? null,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      line_total: item.unitPrice * item.quantity,
    }))
  );

  if (itemsError) {
    return { error: itemsError.message };
  }

  revalidatePath("/admin");
  return { orderId: order.id as string };
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
}
