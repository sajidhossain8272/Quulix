"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { getVideoEmbed } from "@/lib/video";
import { cn } from "@/lib/utils";

export type GalleryMediaItem = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  alt?: string | null;
};

type ProductGalleryProps = {
  title: string;
  media: GalleryMediaItem[];
  fallbackImage: string;
  discountPercentage?: number;
  spotlight?: {
    label: string;
    className: string;
  } | null;
};

export function ProductGallery({
  title,
  media,
  fallbackImage,
  discountPercentage = 0,
  spotlight,
}: ProductGalleryProps) {
  const galleryItems = useMemo(() => {
    if (!media.length) {
      return [
        {
          id: "fallback",
          type: "IMAGE" as const,
          url: fallbackImage,
          alt: title,
        },
      ];
    }

    return media;
  }, [fallbackImage, media, title]);

  const [activeId, setActiveId] = useState(galleryItems[0]?.id);

  const activeItem =
    galleryItems.find((item) => item.id === activeId) ?? galleryItems[0];
  const activeEmbed =
    activeItem?.type === "VIDEO" ? getVideoEmbed(activeItem.url) : null;

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-[36px] border border-stone-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(216,224,230,0.5),transparent_30%)]" />
        <div className="relative aspect-[4/4.4] sm:aspect-[4/4.1]">
          {activeItem?.type === "VIDEO" && activeEmbed ? (
            activeEmbed.kind === "file" ? (
              <video
                src={activeEmbed.embedUrl}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <iframe
                src={activeEmbed.embedUrl}
                title={`${title} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <Image
              src={activeItem?.url || fallbackImage}
              alt={activeItem?.alt || title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
              unoptimized={activeItem?.url.startsWith("/uploads/")}
            />
          )}
        </div>

        {discountPercentage > 0 ? (
          <span className="absolute left-5 top-5 rounded-full bg-stone-950/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
            Save {discountPercentage}%
          </span>
        ) : null}
        {spotlight ? (
          <span
            className={cn(
              "absolute right-5 top-5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em]",
              spotlight.className,
            )}
          >
            {spotlight.label}
          </span>
        ) : null}
      </div>

      {galleryItems.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {galleryItems.map((item) => {
            const isActive = item.id === activeItem?.id;
            const isVideo = item.type === "VIDEO";
            const thumb =
              item.type === "IMAGE"
                ? item.url
                : getVideoEmbed(item.url)?.thumbnailUrl;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition",
                  isActive
                    ? "border-stone-950 ring-2 ring-stone-950/10"
                    : "border-stone-200 hover:border-stone-400",
                )}
                aria-label={isVideo ? `Show ${title} video` : `Show ${title} image`}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    width={80}
                    height={80}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-100">
                    <Play className="h-5 w-5 text-stone-600" />
                  </div>
                )}
                {isVideo ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <Play className="h-4 w-4 text-white" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
