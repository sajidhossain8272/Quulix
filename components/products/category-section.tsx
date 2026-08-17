"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { useProducts } from "@/hooks/use-products";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategorySectionProps = {
  category: Category;
  initialProducts?: Product[];
};

export function CategorySection({ category, initialProducts }: CategorySectionProps) {
  const query = useProducts(
    {
      category: category.slug,
      limit: 8,
      sort: "featured",
    },
    initialProducts
      ? {
          initialData: {
            data: initialProducts,
            pagination: {
              page: 1,
              limit: 8,
              total: initialProducts.length,
              totalPages: 1,
              hasMore: false,
            },
            meta: {
              availablePriceRange: { min: 0, max: 0 },
            },
          },
        }
      : undefined,
  );

  const products = query.data?.data || initialProducts || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [isControlsHovered, setIsControlsHovered] = useState(false);

  const itemsPerPage = 4;
  const maxSlides = Math.max(1, Math.ceil(products.length / itemsPerPage));

  const isPaused = Boolean(hoveredProductId || isControlsHovered);

  useEffect(() => {
    if (isPaused || maxSlides <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % maxSlides);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, maxSlides]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? maxSlides - 1 : prev - 1));
  }, [maxSlides]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % maxSlides);
  }, [maxSlides]);

  if (query.isLoading && !products.length) {
    return <SectionSkeleton cards={4} />;
  }

  if (query.isError && !products.length) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title={`No ${category.name.toLowerCase()} products available`}
        description="This category is connected to the API but currently has no seeded products."
      />
    );
  }

  return (
    <section className="space-y-6">
      <SectionHeading
        title={category.name}
        description={category.description}
        ctaHref={`/category/${category.slug}`}
        ctaLabel="See all"
      />

      <div
        className="relative group/carousel px-1"
        onMouseEnter={() => setIsControlsHovered(true)}
        onMouseLeave={() => setIsControlsHovered(false)}
      >
        {maxSlides > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Products"
            className="absolute -left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-800 shadow-md backdrop-blur-sm transition duration-200 hover:bg-stone-950 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <div className="overflow-hidden rounded-[24px]">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {Array.from({ length: maxSlides }).map((_, pageIdx) => {
              const pageProducts = products.slice(
                pageIdx * itemsPerPage,
                pageIdx * itemsPerPage + itemsPerPage,
              );

              return (
                <div
                  key={pageIdx}
                  className="grid w-full shrink-0 grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
                >
                  {pageProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onHoverChange={(isHovered) => {
                        if (isHovered) {
                          setHoveredProductId(product.id);
                        } else if (hoveredProductId === product.id) {
                          setHoveredProductId(null);
                        }
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {maxSlides > 1 ? (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Products"
            className="absolute -right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-800 shadow-md backdrop-blur-sm transition duration-200 hover:bg-stone-950 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}

        {maxSlides > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: maxSlides }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-opacity duration-200",
                  dotIdx === activeIndex
                    ? "w-7 bg-stone-900 opacity-100"
                    : "w-2.5 bg-stone-300 opacity-70 hover:opacity-100",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
