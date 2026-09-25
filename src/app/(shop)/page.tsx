import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { HeroCarousel } from "@/components/storefront/hero-carousel";
import { getFeaturedProducts, getNewArrivals, getCategories } from "@/lib/data/products";

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <HeroCarousel />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <p className="animate-hero-rise text-sm font-medium tracking-widest text-neutral-400 uppercase [animation-delay:0.1s]">
            Small Batch, Weekly Roast
          </p>
          <h1 className="animate-hero-rise mt-4 max-w-xl text-4xl sm:text-6xl font-bold tracking-tight [animation-delay:0.25s]">
            Coffee worth slowing down for.
          </h1>
          <p className="animate-hero-rise mt-4 max-w-md text-neutral-300 [animation-delay:0.4s]">
            Ethically sourced beans, roasted in small batches, brewed the way you like it.
          </p>
          <Button
            size="lg"
            className="animate-hero-rise mt-8 bg-white text-black hover:bg-neutral-200 [animation-delay:0.55s]"
            asChild
          >
            <Link href="/shop">Order Now</Link>
          </Button>
        </div>
      </section>

      {/* Shop by category */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-muted"
              >
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 font-medium text-white">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Featured</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold tracking-tight mb-6">New Arrivals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
