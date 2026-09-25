"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/lib/cart/cart-context";
import { placeOrder } from "@/server/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    const form = new FormData(e.currentTarget);
    setLoading(true);
    const result = await placeOrder(
      {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        notes: String(form.get("notes") ?? ""),
      },
      items
    );
    setLoading(false);

    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }

    clear();
    toast.success("Order placed! We'll have it ready soon.");
    router.push("/");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 grid md:grid-cols-[1.2fr_1fr] gap-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Checkout</h1>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address (leave blank for pickup)</Label>
          <Input id="address" name="address" placeholder="Pickup at the counter" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Order Notes (optional)</Label>
          <Input id="notes" name="notes" placeholder="Oat milk, extra hot, etc." />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Placing order..." : `Place Order — ₱${subtotal.toFixed(2)}`}
        </Button>
      </form>

      <div>
        <h2 className="font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.sizeLabel}`} className="flex justify-between text-sm">
              <span>
                {item.name}
                {item.sizeLabel && ` (${item.sizeLabel})`} × {item.quantity}
              </span>
              <span>₱{(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
          <span>Total</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
