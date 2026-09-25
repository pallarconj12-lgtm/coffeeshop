import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  base_price: number;
  roast?: string | null;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="overflow-hidden py-0 gap-0 hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <p className="font-medium leading-tight">{product.name}</p>
          {product.roast && (
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              {product.roast} roast
            </p>
          )}
          <p className="mt-2 font-semibold">₱{product.base_price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
