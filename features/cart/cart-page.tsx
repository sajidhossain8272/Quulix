"use client";

import { useEffect } from "react";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/ui/empty-state";
import {
  selectCartCount,
  selectCartSavings,
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart-store";

function CartPageSkeleton() {
  return (
    <main className="pb-16 sm:pb-20">
      <Container className="space-y-8 pt-6 sm:pt-8">
        <div className="h-44 animate-pulse rounded-[32px] bg-stone-200" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-[28px] bg-stone-200"
              />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-[32px] bg-stone-200" />
        </div>
      </Container>
    </main>
  );
}

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const savings = useCartStore(selectCartSavings);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  if (!hasHydrated) {
    return <CartPageSkeleton />;
  }

  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-6 sm:pt-8">
        <section className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            Cart overview
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-stone-950 sm:text-5xl">
            Your QULLIX cart
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Review line items, adjust quantities, and continue into the mock checkout flow.
            Cart contents persist locally through Zustand.
          </p>
        </section>
      </Container>

      <Container className="pt-6">
        {items.length === 0 ? (
          <EmptyState
            title="Your cart is still empty"
            description="Browse a category, add a few products, and they will appear here with live totals."
            actionLabel="Start shopping"
            onAction={() => {
              window.location.href = "/category/all";
            }}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </div>
            <div className="lg:sticky lg:top-32 lg:self-start">
              <CartSummary
                itemCount={itemCount}
                subtotal={subtotal}
                savings={savings}
                showClear
                onClear={clearCart}
                primaryAction={{ href: "/checkout", label: "Continue to checkout" }}
                secondaryAction={{ href: "/category/all", label: "Continue shopping" }}
              />
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
