"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";

const CATEGORY_LINKS = [
  { label: "Espresso", href: "/category/espresso" },
  { label: "Cold Brew", href: "/category/cold-brew" },
  { label: "Pour Over", href: "/category/pour-over" },
  { label: "Whole Bean", href: "/category/whole-bean" },
];

export function StorefrontNavbar({ storeName }: { storeName: string }) {
  const { count } = useCart();

  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" className="flex items-center" aria-label={storeName}>
          <Image
            src="/logo.png"
            alt={storeName}
            width={634}
            height={218}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          {CATEGORY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search coffee..." className="w-56 pl-8" />
          </div>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/login" aria-label="Admin">
              <ShieldCheck />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account" aria-label="Account">
              <User />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart" aria-label="Cart">
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
