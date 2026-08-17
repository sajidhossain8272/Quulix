"use client";

import { ArrowRightLeft, Check, Eye, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { RatingStars } from "@/components/shared/rating-stars";
import type { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
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

export function ProductCard({ product, priority, onHoverChange }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const spotlight = getProductSpotlight(product);
  const productHref = `/product/${product.slug}`;

  // Inner image auto-scroll cycling on hover
  useEffect(() => {
    if (!isHovered || productImages.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
    }, 1300);

    return () => clearInterval(interval);
  }, [isHovered, productImages.length]);

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeout = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [added]);

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addItem(product, { openCart: true });
    setAdded(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveImageIndex(0);
    onHoverChange?.(false);
  };

  const currentImage = productImages[activeImageIndex] || product.image;

  return (
    <article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-[24px] border border-stone-200/80 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link href={productHref} aria-label={`View ${product.title}`} className="absolute inset-0 block">
          <Image
            src={currentImage}
            alt={`${product.title} view ${activeImageIndex + 1}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* Discount Badge */}
        {product.discountPercentage > 0 ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-950/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            -{product.discountPercentage}%
          </span>
        ) : null}

        {/* Spotlight Tag */}
        {spotlight && product.discountPercentage <= 0 ? (
          <span
            className={cn(
              "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur-sm",
              spotlight.className,
            )}
          >
            {spotlight.label}
          </span>
        ) : null}

        {/* Inner Image Indicators (shown when product has multiple images) */}
        {productImages.length > 1 ? (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-md transition-opacity duration-300">
            {productImages.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === activeImageIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        ) : null}

        {/* Action Icons Overlay on Hover (Matching Reference Design) */}
        <div className="absolute right-3 top-3 z-20 flex flex-col items-center gap-2.5 rounded-xl border border-stone-100/80 bg-white/95 p-1.5 shadow-lg backdrop-blur-md transition-all duration-300 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0">
          {/* Add to Cart Icon Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            title="Add to Cart"
            aria-label="Add to Cart"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 transition duration-200 hover:bg-stone-100 hover:text-stone-950",
              added && "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white",
            )}
          >
            {added ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>

          {/* Quick View Icon Button */}
          <Link
            href={productHref}
            title="Quick View"
            aria-label="Quick View"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 transition duration-200 hover:bg-stone-100 hover:text-stone-950"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {/* Compare Icon Button */}
          <button
            type="button"
            title="Compare Product"
            aria-label="Compare Product"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 transition duration-200 hover:bg-stone-100 hover:text-stone-950"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          {/* Wishlist Icon Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label="Wishlist"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 transition duration-200 hover:bg-stone-100 hover:text-stone-950",
              isWishlisted && "text-rose-600 hover:text-rose-700",
            )}
          >
            <Heart
              className={cn("h-4 w-4", isWishlisted && "fill-rose-600 text-rose-600")}
            />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="space-y-2 p-4">
        <h3 className="text-sm font-medium leading-tight text-stone-900 line-clamp-1">
          <Link href={productHref} className="transition hover:text-stone-600">
            {product.title}
          </Link>
        </h3>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-stone-950">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price ? (
            <span className="text-xs text-stone-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}


