"use client";

import { Award, Compass, Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/shared/container";

export function CinematicShowcase() {
  const [isHovered, setIsHovered] = useState(false);

  // High-res craftsmanship & studio visual (hands crafting gear on studio desk / cutting mat)
  const craftImageUrl =
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=85";

  return (
    <section
      aria-label="Studio Craftsmanship Showcase"
      className="py-10 sm:py-14"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container>
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-stone-950 text-white shadow-2xl border border-stone-800">
          {/* Background Visual Container */}
          <div className="relative h-[380px] sm:h-[480px] lg:h-[560px] w-full overflow-hidden">
            <Image
              src={craftImageUrl}
              alt="Hands assembling precision audio and leathercraft tech gear"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className={`object-cover transition-transform duration-1000 ease-out ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              priority
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <div className="absolute inset-0 bg-stone-950/20 backdrop-brightness-95" />

            {/* Top Bar Floating Badges */}
            <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-stone-950/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Crafted By Hand & Tech</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-stone-200 backdrop-blur-md">
                <Award className="h-3.5 w-3.5 text-amber-300" />
                <span>Zero Compromise Standard</span>
              </div>
            </div>

            {/* Bottom Content Card */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-14 z-10">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-400">
                  <Compass className="h-4 w-4" />
                  <span>The Quulix Workshop</span>
                </div>

                <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Every curve polished. Every driver tuned to perfection.
                </h3>

                <p className="max-w-xl text-xs sm:text-sm lg:text-base leading-relaxed text-stone-300">
                  From tactile leather cases to acoustically sealed aluminum earcups, our artisans and sound
                  engineers obsess over every micron to bring you pure listening pleasure.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/category/all"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-stone-950 shadow-lg transition duration-200 hover:bg-stone-200"
                  >
                    Shop Signature Gear
                  </Link>
                  <Link
                    href="/category/workspace"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-stone-900/60 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-md transition duration-200 hover:bg-white/20"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Explore Workspace Tech
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
