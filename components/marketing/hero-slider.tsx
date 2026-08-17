"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";

import type { HeroSlide } from "@/lib/types";

const AUTOPLAY_INTERVAL_MS = 5000;

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

const defaultFallbackSlides: HeroSlide[] = [
  {
    id: "hero-fallback-1",
    eyebrow: "Curated Audio & Tech",
    title: "Quiet luxury for every commute and long-haul reset.",
    description:
      "Discover refined noise cancellation, aerospace-grade materials, and deep discounts across premium audio.",
    ctaLabel: "Explore Headphones",
    ctaHref: "/category/headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1920&q=85",
    alt: "Premium wireless headphones on a neutral surface",
  },
  {
    id: "hero-fallback-2",
    eyebrow: "Workspace Refresh",
    title: "Turn your desk into a calm, high-output studio.",
    description:
      "Minimal tools for sharper calls, better focus, and richer acoustics without visual clutter.",
    ctaLabel: "Shop Workspace",
    ctaHref: "/category/workspace",
    image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1920&q=85",
    alt: "Modern workspace setup with clean desk accessories",
  },
];

type HeroSliderProps = {
  slides?: HeroSlide[];
};

export function HeroSlider({ slides = [] }: HeroSliderProps) {
  const activeSlides = slides.length > 0 ? slides : defaultFallbackSlides;
  const [current, setCurrent] = useState(0);

  const advance = useEffectEvent(() => {
    setCurrent((index) => wrapIndex(index + 1, activeSlides.length));
  });

  useEffect(() => {
    if (activeSlides.length < 2) return;

    const interval = window.setInterval(() => advance(), AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [activeSlides.length]);

  const activeIndex = current >= activeSlides.length ? 0 : current;

  const goBackward = () => {
    setCurrent((index) => wrapIndex(index - 1, activeSlides.length));
  };

  const goForward = () => {
    setCurrent((index) => wrapIndex(index + 1, activeSlides.length));
  };

  const jumpTo = (index: number) => {
    setCurrent(index);
  };

  const activeSlide = activeSlides[activeIndex];
  const hasCopy = Boolean(
    activeSlide.eyebrow ||
      activeSlide.title ||
      activeSlide.description ||
      (activeSlide.ctaLabel && activeSlide.ctaHref),
  );

  const isClickableOnly = !hasCopy && Boolean(activeSlide.ctaHref);

  const SlideImage = (
    <div className="relative h-full w-full">
      <Image
        src={activeSlide.image}
        alt={activeSlide.alt || activeSlide.title || "Featured Quulix collection"}
        fill
        priority
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
        quality={88}
        className={
          hasCopy
            ? "object-cover object-center"
            : "object-cover object-center sm:object-cover"
        }
      />
      {hasCopy ? (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/40 to-transparent" />
      ) : (
        <div className="absolute inset-0 bg-stone-950/5 pointer-events-none" />
      )}
    </div>
  );

  return (
    <section
      aria-label="Featured collections carousel"
      className="relative isolate w-full overflow-hidden bg-stone-950 text-white aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.35/1] max-h-[720px] min-h-[300px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[520px]"
    >
      <div
        key={activeSlide.id}
        className="absolute inset-0 transition-opacity duration-500 ease-out"
      >
        {isClickableOnly && activeSlide.ctaHref ? (
          <Link
            href={activeSlide.ctaHref}
            aria-label={activeSlide.alt || activeSlide.title || "Banner link"}
            className="block h-full w-full"
          >
            {SlideImage}
          </Link>
        ) : (
          SlideImage
        )}

        {hasCopy ? (
          <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-end px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="max-w-xl rounded-2xl border border-white/10 bg-stone-950/35 p-5 shadow-2xl backdrop-blur-md sm:p-7">
              {activeSlide.eyebrow ? (
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-100">
                  {activeSlide.eyebrow}
                </span>
              ) : null}
              {activeSlide.title ? (
                <h1 className="mt-3 font-display text-2xl tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                  {activeSlide.title}
                </h1>
              ) : null}
              {activeSlide.description ? (
                <p className="mt-3 max-w-lg text-xs leading-relaxed text-stone-100 sm:text-sm lg:text-base">
                  {activeSlide.description}
                </p>
              ) : null}
              {activeSlide.ctaLabel && activeSlide.ctaHref ? (
                <Link
                  href={activeSlide.ctaHref}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 transition hover:-translate-y-0.5 hover:bg-stone-100 min-h-[44px]"
                >
                  {activeSlide.ctaLabel}
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Slide Navigation Controls */}
      {activeSlides.length > 1 ? (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-stone-950/70 p-1.5 backdrop-blur sm:bottom-6 sm:right-6">
          <button
            type="button"
            aria-label="Previous banner slide"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95"
            onClick={goBackward}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1 px-1">
            {activeSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => jumpTo(index)}
                className="flex h-11 min-w-[28px] items-center justify-center p-1"
              >
                <span
                  className={
                    index === activeIndex
                      ? "h-2 w-6 rounded-full bg-white transition-opacity"
                      : "h-2 w-2 rounded-full bg-white/40 hover:bg-white/70 transition-opacity"
                  }
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next banner slide"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95"
            onClick={goForward}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
