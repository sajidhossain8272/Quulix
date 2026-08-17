"use client";

import { ArrowRight, CheckCircle2, Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/shared/container";

type BrandVideoSectionProps = {
  youtubeVideoId?: string;
};

export function BrandVideoSection({
  youtubeVideoId = "dQw4w9WgXcQ", // Replaceable with studio craft / product video
}: BrandVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // High quality fallback craft / studio video & poster
  const posterUrl =
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80";

  return (
    <section aria-labelledby="brand-story-title" className="content-auto py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: YouTube / Craftsmanship Video */}
          <div className="relative mx-auto w-full max-w-lg lg:col-span-6 lg:max-w-none">
            <div className="relative aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-[5/4] w-full overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-950 shadow-2xl transition duration-300 hover:shadow-stone-900/10">
              {isPlaying ? (
                <iframe
                  className="h-full w-full object-cover"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=${
                    isMuted ? 1 : 0
                  }&loop=1&playlist=${youtubeVideoId}&controls=1&rel=0&modestbranding=1`}
                  title="Quulix Studio Craftsmanship"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="relative h-full w-full group">
                  <Image
                    src={posterUrl}
                    alt="Quulix Precision Craftsmanship & Audio Engineering"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-stone-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      Studio Craft Video
                    </span>
                  </div>

                  {/* Center Play Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      aria-label="Play Brand Video"
                      className="group/btn flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/90 text-stone-950 shadow-2xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white active:scale-95"
                    >
                      <Play className="h-6 w-6 sm:h-8 sm:w-8 translate-x-0.5 fill-stone-950 transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <p className="text-sm font-medium text-white/90 line-clamp-2">
                      “We believe true quality is proven in every detail, stitch, and acoustic nuance.”
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                      Quulix Acoustic Design Studio
                    </p>
                  </div>
                </div>
              )}

              {isPlaying && (
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-stone-900/80 text-white backdrop-blur-md transition hover:bg-stone-900"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Brand Story & Values */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="rounded-full border border-stone-300 bg-stone-100 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-700">
                  Handcrafted With Integrity
                </span>
              </div>

              <h2
                id="brand-story-title"
                className="font-display text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl leading-[1.15]"
              >
                Discover precision audio and everyday tech in our online store.
              </h2>

              <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
                <strong className="font-semibold text-stone-900">Quulix</strong> is a premium lifestyle
                and audio gear brand founded on uncompromising quality. Our focus on ergonomic design and acoustic
                mastery shines through every product we engineer.
              </p>

              <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
                Using only high-grade drivers, aerospace alloys, and refined tactile finishes, our collection is built
                for daily commutes, focused studio workflows, and effortless travel. Explore our signature collection
                and experience timeless performance.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-2">
                {[
                  "Aerospace-Grade Materials",
                  "Acoustic Laboratory Calibrated",
                  "1-Year Official Warranty",
                  "Nationwide Express Delivery",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs font-semibold text-stone-800 sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-4">
                <Link
                  href="/category/all"
                  className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/category/headphones"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-stone-800 transition duration-200 hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50 active:translate-y-0"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
