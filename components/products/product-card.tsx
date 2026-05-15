"use client";

import { Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { RatingStars } from "@/components/shared/rating-stars";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

function getProductSpotlight(product: Product) {
  const createdAt = new Date(product.createdAt);
  const daysSinceLaunch =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceLaunch <= 30) {
    return {
      label: "New",
      className:
        "border border-emerald-200/90 bg-emerald-50/95 text-emerald-700",
    };
  }

  if (
    product.rating >= 4.8 ||
    product.reviewCount >= 300 ||
    product.featuredCollections.includes("best-deals")
  ) {
    return {
      label: "Hot",
      className: "border border-rose-200/90 bg-rose-50/95 text-rose-700",
    };
  }

  return null;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const spotlight = getProductSpotlight(product);
  const productHref = `/product/${product.slug}`;

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeout = window.setTimeout(() => setAdded(false), 1400);

    return () => window.clearTimeout(timeout);
  }, [added]);

  const handleAddToCart = () => {
    addItem(product, { openCart: true });
    setAdded(true);
  };

  return (
    <article className="group overflow-hidden rounded-[28px] border border-stone-200/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link href={productHref} aria-label={`View ${product.title}`} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        {product.discountPercentage > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-stone-950/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
            -{product.discountPercentage}%
          </span>
        ) : null}
        {spotlight ? (
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] shadow-sm backdrop-blur-sm",
              spotlight.className,
            )}
          >
            {spotlight.label}
          </span>
        ) : null}
      </div>
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
            {product.categoryName}
          </p>
          <h3 className="min-h-[2.75rem] text-sm font-semibold leading-5 text-stone-950 sm:min-h-[3.25rem] sm:text-base sm:leading-6">
            <Link
              href={productHref}
              className="line-clamp-2 rounded-md transition hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300"
            >
              {product.title}
            </Link>
          </h3>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="flex items-end justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold tracking-tight text-stone-950 sm:text-lg md:text-xl">
              {formatCurrency(product.price)}
            </p>
            <p className="text-[11px] text-stone-500 line-through sm:text-xs">
              {formatCurrency(product.originalPrice)}
            </p>
          </div>
          <Button
            aria-label={
              added
                ? `${product.title} added to cart`
                : `Add ${product.title} to cart`
            }
            className={cn(
              "h-9 shrink-0 gap-1.5 px-2.5 py-0 text-xs sm:h-10 sm:gap-2 sm:px-4 sm:text-sm md:min-w-[124px]",
              added && "bg-emerald-600 hover:bg-emerald-600",
            )}
            onClick={handleAddToCart}
          >
            {added ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            <span className="hidden min-[400px]:inline md:hidden">
              {added ? "Added" : "Add"}
            </span>
            <span className="hidden md:inline">
              {added ? "Added" : "Add to cart"}
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
}

