import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { getProductsByCategorySlug } from "@/lib/data/products";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, products } = await getProductsByCategorySlug(slug);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No products in this category yet.
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
