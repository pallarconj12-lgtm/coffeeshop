import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/data/products";
import { AddToCartForm } from "@/components/storefront/add-to-cart-form";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div>
        {product.roast && (
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {product.roast} roast
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
        {product.description && (
          <p className="mt-4 text-muted-foreground">{product.description}</p>
        )}

        <div className="mt-8">
          <AddToCartForm
            productId={product.id}
            name={product.name}
            imageUrl={product.image_url}
            basePrice={product.base_price}
            sizes={product.sizes}
          />
        </div>
      </div>
    </div>
  );
}
