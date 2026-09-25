"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";

type Size = { id: string; label: string; price_delta: number };

export function AddToCartForm({
  productId,
  name,
  imageUrl,
  basePrice,
  sizes,
}: {
  productId: string;
  name: string;
  imageUrl: string | null;
  basePrice: number;
  sizes: Size[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [sizeId, setSizeId] = React.useState<string | null>(sizes[0]?.id ?? null);
  const [quantity, setQuantity] = React.useState(1);

  const selectedSize = sizes.find((s) => s.id === sizeId) ?? null;
  const unitPrice = basePrice + (selectedSize?.price_delta ?? 0);

  function handleAdd() {
    addItem({
      productId,
      name,
      imageUrl,
      sizeLabel: selectedSize?.label ?? null,
      unitPrice,
      quantity,
    });
    toast.success(`Added ${name} to cart`);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/cart");
  }

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Size</p>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSizeId(size.id)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  sizeId === size.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium mb-2">Quantity</p>
        <div className="inline-flex items-center rounded-md border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 hover:bg-accent"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 hover:bg-accent"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-2xl font-semibold">₱{unitPrice.toFixed(2)}</p>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={handleAdd}>
          Add to Cart
        </Button>
        <Button className="flex-1" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}
