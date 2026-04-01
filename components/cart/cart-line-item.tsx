"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/store/cart-store";
import { useCartStore } from "@/store/cart-store";

type CartLineItemProps = {
  item: CartItem;
  compact?: boolean;
  onNavigate?: () => void;
};

export function CartLineItem({
  item,
  compact = false,
  onNavigate,
}: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const productHref = `/product/${item.slug}`;

  return (
    <article className="rounded-[28px] border border-stone-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex gap-4">
        <Link
          href={productHref}
          onClick={onNavigate}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] bg-stone-100"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <Link
              href={`/category/${item.category}`}
              onClick={onNavigate}
              className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500 transition hover:text-stone-900"
            >
              {item.categoryName}
            </Link>
            <Link
              href={productHref}
              onClick={onNavigate}
              className="line-clamp-2 text-sm font-semibold leading-6 text-stone-950 transition hover:text-stone-700 sm:text-base"
            >
              {item.title}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-1">
              <button
                type="button"
                aria-label={`Decrease quantity for ${item.title}`}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-700 transition hover:bg-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-stone-950">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity for ${item.title}`}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-700 transition hover:bg-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-base font-semibold text-stone-950">
            {formatCurrency(item.price * item.quantity)}
          </p>
          <p className="text-xs text-stone-500">
            {formatCurrency(item.price)} each
          </p>
          {item.originalPrice > item.price ? (
            <p className="mt-1 text-xs text-emerald-600">
              Save {formatCurrency((item.originalPrice - item.price) * item.quantity)}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between sm:hidden">
        <div>
          <p className="text-base font-semibold text-stone-950">
            {formatCurrency(item.price * item.quantity)}
          </p>
          <p className="text-xs text-stone-500">
            {formatCurrency(item.price)} each
          </p>
        </div>
        {compact ? (
          <p className="text-xs text-emerald-600">
            {item.originalPrice > item.price
              ? `Save ${formatCurrency((item.originalPrice - item.price) * item.quantity)}`
              : "Ready to ship"}
          </p>
        ) : null}
      </div>
    </article>
  );
}
