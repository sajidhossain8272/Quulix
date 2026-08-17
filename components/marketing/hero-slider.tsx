"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";

import type { HeroSlide } from "@/lib/types";

const swipeThreshold = 48;
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
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern workspace setup with clean desk accessories",
  },
];

type HeroSliderProps = {
  slides?: HeroSlide[];
};

export function HeroSlider({ slides = [] }: HeroSliderProps) {
  const activeSlides = slides.length > 0 ? slides : defaultFallbackSlides;
  const shouldReduceMotion = useReducedMotion();
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);

  const advance = useEffectEvent(() => {
    setCurrent(([index]) => [wrapIndex(index + 1, activeSlides.length), 1]);
  });

  useEffect(() => {
    if (shouldReduceMotion || activeSlides.length < 2) return;

    const interval = window.setInterval(() => advance(), AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [shouldReduceMotion, activeSlides.length]);

  const activeIndex = current >= activeSlides.length ? 0 : current;

  const goBackward = () => {
    setCurrent(([index]) => [wrapIndex(index - 1, activeSlides.length), -1]);
  };

  const goForward = () => {
    setCurrent(([index]) => [wrapIndex(index + 1, activeSlides.length), 1]);
  };

  const jumpTo = (index: number) => {
    setCurrent(([currentIndex]) => [index, index > currentIndex ? 1 : -1]);
  };

  const activeSlide = activeSlides[activeIndex];
  const hasCopy = Boolean(
    activeSlide.eyebrow ||
      activeSlide.title ||
      activeSlide.description ||
      (activeSlide.ctaLabel && activeSlide.ctaHref),
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative isolate min-h-[420px] w-full overflow-hidden bg-stone-950 text-white sm:min-h-[540px] lg:min-h-[620px]"
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={activeSlide.id}
          custom={direction}
          initial={{ opacity: 0, x: direction >= 0 ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction >= 0 ? -24 : 24 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x <= -swipeThreshold) goForward();
            if (info.offset.x >= swipeThreshold) goBackward();
          }}
          className="absolute inset-0"
        >
          <Image
            src={activeSlide.image}
            alt={activeSlide.alt || "Featured Quulix collection"}
            fill
            priority
            sizes="100vw"
            quality={88}
            className={hasCopy ? "object-cover" : "object-cover brightness-[0.96]"}
          />
          <div
            className={
              hasCopy
                ? "absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/38 to-transparent"
                : "absolute inset-0 bg-stone-950/10"
            }
          />

          {hasCopy ? (
            <div className="relative mx-auto flex min-h-[420px] w-full max-w-7xl items-end px-4 py-20 sm:min-h-[540px] sm:px-6 sm:py-24 lg:min-h-[620px] lg:px-8 lg:py-28">
              <div className="max-w-xl rounded-2xl border border-white/10 bg-stone-950/28 p-5 shadow-2xl backdrop-blur-md sm:p-7">
                {activeSlide.eyebrow ? (
                  <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-100">
                    {activeSlide.eyebrow}
                  </span>
                ) : null}
                {activeSlide.title ? (
                  <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {activeSlide.title}
                  </h1>
                ) : null}
                {activeSlide.description ? (
                  <p className="mt-4 max-w-lg text-sm leading-7 text-stone-100 sm:text-base">
                    {activeSlide.description}
                  </p>
                ) : null}
                {activeSlide.ctaLabel && activeSlide.ctaHref ? (
                  <Link
                    href={activeSlide.ctaHref}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:-translate-y-0.5 hover:bg-stone-100"
                  >
                    {activeSlide.ctaLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {activeSlides.length > 1 ? (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/15 bg-stone-950/50 px-2 py-1.5 backdrop-blur sm:bottom-6 sm:right-6">
          <button
            type="button"
            aria-label="Previous banner"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
            onClick={goBackward}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-1.5">
            {activeSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show banner ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => jumpTo(index)}
                className={index === activeIndex ? "h-1.5 w-5 rounded-full bg-white" : "h-1.5 w-1.5 rounded-full bg-white/45"}
              >
                <span className="sr-only">Banner {index + 1}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next banner"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
            onClick={goForward}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
