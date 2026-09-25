"use client";

import * as React from "react";
import type { CartItem } from "@/lib/cart/types";

const STORAGE_KEY = "coffee-shop-cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, sizeLabel: string | null) => void;
  setQuantity: (productId: string, sizeLabel: string | null, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, productId: string, sizeLabel: string | null) {
  return a.productId === productId && a.sizeLabel === sizeLabel;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating
      // persisted cart from localStorage after mount is intentional: reading
      // localStorage during the initial render would crash on the server,
      // and this keeps the first client render matching SSR output.
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt/missing storage
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable — cart just won't persist across reloads
    }
  }, [items, hydrated]);

  const addItem = React.useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item.productId, item.sizeLabel));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item.productId, item.sizeLabel)
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = React.useCallback((productId: string, sizeLabel: string | null) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, sizeLabel)));
  }, []);

  const setQuantity = React.useCallback(
    (productId: string, sizeLabel: string | null, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((p) => !sameLine(p, productId, sizeLabel))
          : prev.map((p) => (sameLine(p, productId, sizeLabel) ? { ...p, quantity } : p))
      );
    },
    []
  );

  const clear = React.useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clear, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
