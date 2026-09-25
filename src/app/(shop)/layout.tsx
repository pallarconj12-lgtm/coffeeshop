import { StorefrontNavbar } from "@/components/storefront/navbar";
import { StorefrontFooter } from "@/components/storefront/footer";
import { CartProvider } from "@/lib/cart/cart-context";
import { getStoreName } from "@/lib/data/settings";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const storeName = await getStoreName();

  return (
    <CartProvider>
      <div className="dark bg-background text-foreground flex-1 flex flex-col min-h-screen">
        <StorefrontNavbar storeName={storeName} />
        <main className="flex-1">{children}</main>
        <StorefrontFooter storeName={storeName} />
      </div>
    </CartProvider>
  );
}
