"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1569409760450-5b27bb03fa06?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "Latte art being poured into a cup",
    label: "Espresso",
  },
  {
    src: "https://images.unsplash.com/photo-1605170512248-d03f7f10b168?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "Close-up of freshly roasted coffee beans",
    label: "Roastery",
  },
  {
    src: "https://images.unsplash.com/photo-1552825533-e90b284fcb27?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "Iced cold brew coffee in a glass",
    label: "Cold Brew",
  },
  {
    src: "https://images.unsplash.com/photo-1741265805852-32186a6d0dd3?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "Cozy cafe interior with chairs and tables",
    label: "The Cafe",
  },
] as const;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <>
      <div key={index} className="absolute inset-0 animate-hero-fade">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className="animate-hero-zoom object-cover object-center"
        />
      </div>

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />

      {/* Current style label */}
      <span className="absolute top-6 right-6 z-10 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
        {slide.label}
      </span>

      {/* Dot navigation */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.label}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </>
  );
}
