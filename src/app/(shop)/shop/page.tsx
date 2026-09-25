import { ProductCard } from "@/components/storefront/product-card";
import { getAllProducts } from "@/lib/data/products";

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
      <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No products yet — check back soon.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
