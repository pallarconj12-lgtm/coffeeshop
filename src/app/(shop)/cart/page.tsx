"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something delicious to get started.</p>
        <Button className="mt-6" asChild>
          <Link href="/shop">Browse the Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.sizeLabel}`}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              {item.sizeLabel && (
                <p className="text-xs text-muted-foreground">{item.sizeLabel}</p>
              )}
              <p className="text-sm text-muted-foreground">₱{item.unitPrice.toFixed(2)}</p>
            </div>
            <div className="inline-flex items-center rounded-md border">
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.sizeLabel, item.quantity - 1)}
                className="h-8 w-8 hover:bg-accent"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.sizeLabel, item.quantity + 1)}
                className="h-8 w-8 hover:bg-accent"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId, item.sizeLabel)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <span className="text-lg font-semibold">Subtotal</span>
        <span className="text-lg font-semibold">₱{subtotal.toFixed(2)}</span>
      </div>

      <Button size="lg" className="mt-6 w-full" asChild>
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
    </div>
  );
}
