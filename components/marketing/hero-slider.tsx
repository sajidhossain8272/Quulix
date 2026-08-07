"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";

import { useFirstVisitAutoplay } from "@/hooks/use-first-visit-autoplay";
import type { HeroSlide } from "@/lib/types";

const swipeThreshold = 48;
const AUTOPLAY_INTERVAL_MS = 5200;

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

type HeroSliderProps = {
  slides: HeroSlide[];
};

export function HeroSlider({ slides }: HeroSliderProps) {
  const shouldReduceMotion = useReducedMotion();
  const { autoplay, stopAutoplay } = useFirstVisitAutoplay();
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);

  const advanceAutoplay = useEffectEvent(() => {
    setCurrent(([index]) => [wrapIndex(index + 1, slides.length), 1]);
  });

  useEffect(() => {
    if (!autoplay || shouldReduceMotion || slides.length < 2) {
      return;
    }

    const interval = window.setInterval(() => advanceAutoplay(), AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [autoplay, shouldReduceMotion, slides.length]);

  const goBackward = () => {
    setCurrent(([index]) => [wrapIndex(index - 1, slides.length), -1]);
  };

  const goForward = () => {
    setCurrent(([index]) => [wrapIndex(index + 1, slides.length), 1]);
  };

  const jumpTo = (index: number) => {
    setCurrent(([currentIndex]) => [index, index > currentIndex ? 1 : -1]);
  };

  const activeSlide = slides[current];

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-stone-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
      <div className="relative min-h-[480px] sm:min-h-[560px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeSlide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 32 : -32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -32 : 32 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => stopAutoplay()}
            onDragEnd={(_, info) => {
              if (info.offset.x <= -swipeThreshold) {
                goForward();
                return;
              }

              if (info.offset.x >= swipeThreshold) {
                goBackward();
              }
            }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <Image
                src={activeSlide.image}
                alt={activeSlide.alt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                quality={85}
                className="object-cover opacity-65"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-950/82 to-stone-900/55" />
            </div>
            <div className="relative flex min-h-[480px] flex-col justify-end p-6 sm:min-h-[560px] sm:p-10 lg:p-14">
              <div className="max-w-2xl space-y-5">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-100 backdrop-blur">
                  {activeSlide.eyebrow}
                </span>
                <div className="space-y-4">
                  <h1 className="font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {activeSlide.title}
                  </h1>
                  <p className="max-w-xl text-sm leading-7 text-stone-200 sm:text-base">
                    {activeSlide.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={activeSlide.ctaHref}
                    className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-950 transition hover:-translate-y-0.5 hover:bg-stone-100"
                  >
                    {activeSlide.ctaLabel}
                  </Link>
                  <button
                    type="button"
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                    onClick={() => {
                      stopAutoplay();
                      goForward();
                    }}
                  >
                    Skip ahead
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-stone-900/60 px-3 py-2 backdrop-blur sm:left-auto sm:right-6 sm:translate-x-0">
        <button
          type="button"
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          onClick={() => {
            stopAutoplay();
            goBackward();
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current}
              onClick={() => {
                stopAutoplay();
                jumpTo(index);
              }}
              className={
                index === current
                  ? "h-2.5 w-8 rounded-full bg-white"
                  : "h-2.5 w-2.5 rounded-full bg-white/35"
              }
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          onClick={() => {
            stopAutoplay();
            goForward();
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
