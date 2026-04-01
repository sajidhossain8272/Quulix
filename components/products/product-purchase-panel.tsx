"use client";

import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type ProductPurchasePanelProps = {
  product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeout = window.setTimeout(() => setAdded(false), 1600);

    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <div className="rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-5">
        <div>
          <p className="text-sm text-stone-500 line-through">
            {formatCurrency(product.originalPrice)}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-stone-950">
            {formatCurrency(product.price)}
          </p>
        </div>
        <div className="rounded-2xl bg-stone-100 px-4 py-3 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
            Savings
          </p>
          <p className="mt-1 text-lg font-semibold text-emerald-600">
            {formatCurrency(product.originalPrice - product.price)}
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-5">
        <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-600">
          {product.inventory > 10
            ? `In stock now. ${product.inventory} units are ready to ship.`
            : `Only ${product.inventory} left in stock for this drop.`}
        </div>
        <Button className="w-full gap-2 py-3 text-base" onClick={() => {
          addItem(product, { openCart: true });
          setAdded(true);
        }}>
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? "Added to cart" : "Add to cart"}
        </Button>
        <Link
          href="/cart"
          className="flex w-full items-center justify-center rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
        >
          View full cart
        </Link>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
        <div className="rounded-[22px] border border-stone-200 bg-white p-4">
          <p className="font-medium text-stone-950">Free premium shipping</p>
          <p className="mt-1 leading-6">Complimentary delivery on orders above $150.</p>
        </div>
        <div className="rounded-[22px] border border-stone-200 bg-white p-4">
          <p className="font-medium text-stone-950">Flexible returns</p>
          <p className="mt-1 leading-6">Easy 30-day returns for mock storefront testing.</p>
        </div>
      </div>
    </div>
  );
}
