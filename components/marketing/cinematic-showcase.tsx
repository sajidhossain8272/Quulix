"use client";

import { Award, Compass, Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/shared/container";

export type CinematicShowcaseProps = {
  image?: string;
  badge?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  btn1Label?: string;
  btn1Href?: string;
  btn2Label?: string;
  btn2Href?: string;
};

export function CinematicShowcase({
  image = "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=85",
  badge = "Crafted By Hand & Tech",
  eyebrow = "The Quulix Workshop",
  title = "Precision tuned. Elegantly crafted.",
  description = "Obsessive attention to every tactile curve, aerospace alloy, and acoustic nuance.",
  btn1Label = "Shop Signature Gear",
  btn1Href = "/category/all",
  btn2Label = "Explore Workspace",
  btn2Href = "/category/workspace",
}: CinematicShowcaseProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      aria-label="Studio Craftsmanship Showcase"
      className="py-8 sm:py-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container>
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-stone-950 text-white shadow-xl border border-stone-800/80">
          {/* Background Visual Container */}
          <div className="relative h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] w-full overflow-hidden">
            <Image
              src={image}
              alt={title || "Studio Craftsmanship"}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className={`object-cover object-center transition-transform duration-700 ease-out ${
                isHovered ? "scale-[1.03]" : "scale-100"
              }`}
              priority
            />

            {/* Subtle Gradient Overlays (Ensures image remains bright & visible) */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/15" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-transparent hidden sm:block" />

            {/* Top Bar Floating Badges */}
            <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-6 sm:right-6 flex items-center justify-between z-10">
              {badge ? (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-stone-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>{badge}</span>
                </div>
              ) : <div />}

              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-stone-950/40 px-3 py-1 text-[11px] font-medium text-stone-200 backdrop-blur-md">
                <Award className="h-3 w-3 text-amber-300" />
                <span>Zero Compromise</span>
              </div>
            </div>

            {/* Bottom Balanced Content Card */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-9 z-10">
              <div className="max-w-xl space-y-2.5 sm:space-y-3 rounded-2xl sm:bg-stone-950/40 sm:backdrop-blur-md sm:p-5 sm:border sm:border-white/10">
                {eyebrow ? (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                    <Compass className="h-3.5 w-3.5" />
                    <span>{eyebrow}</span>
                  </div>
                ) : null}

                {title ? (
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug">
                    {title}
                  </h3>
                ) : null}

                {description ? (
                  <p className="text-xs sm:text-sm leading-relaxed text-stone-200/90 line-clamp-2 max-w-lg">
                    {description}
                  </p>
                ) : null}

                {/* Compact Refined Action Pills */}
                <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                  {btn1Label && btn1Href ? (
                    <Link
                      href={btn1Href}
                      className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-stone-950 shadow-md transition duration-200 hover:bg-stone-100 active:scale-95"
                    >
                      {btn1Label}
                    </Link>
                  ) : null}

                  {btn2Label && btn2Href ? (
                    <Link
                      href={btn2Href}
                      className="inline-flex items-center justify-center rounded-full border border-white/30 bg-stone-900/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md transition duration-200 hover:bg-white/20 active:scale-95"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      {btn2Label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
