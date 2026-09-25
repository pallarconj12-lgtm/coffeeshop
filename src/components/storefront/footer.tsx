import Link from "next/link";

export function StorefrontFooter({ storeName }: { storeName: string }) {
  return (
    <footer className="border-t border-border/60 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-bold tracking-tight uppercase">{storeName}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Small-batch roasted, brewed with care.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-foreground">All Products</Link></li>
            <li><Link href="/category/espresso" className="hover:text-foreground">Espresso</Link></li>
            <li><Link href="/category/whole-bean" className="hover:text-foreground">Whole Bean</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/account/orders" className="hover:text-foreground">Order History</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm">Support</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Shipping &amp; Pickup</Link></li>
            <li><Link href="/" className="hover:text-foreground">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
      </div>
    </footer>
  );
}
