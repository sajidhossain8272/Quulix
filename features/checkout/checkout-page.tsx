"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { CartSummary } from "@/components/cart/cart-summary";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  selectCartCount,
  selectCartSavings,
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart-store";

export function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const savings = useCartStore(selectCartSavings);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  if (!hasHydrated) {
    return (
      <main className="pb-16 sm:pb-20">
        <Container className="space-y-8 pt-6 sm:pt-8">
          <div className="h-48 animate-pulse rounded-[32px] bg-stone-200" />
          <div className="h-96 animate-pulse rounded-[32px] bg-stone-200" />
        </Container>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="pb-16 sm:pb-20">
        <Container className="pt-10">
          <section className="rounded-[32px] border border-emerald-200 bg-white/90 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Order confirmed
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight text-stone-950">
              Your mock checkout is complete.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              The cart has been cleared and the checkout route is now behaving as a full test flow.
            </p>
            <Link
              href="/category/all"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Return to catalog
            </Link>
          </section>
        </Container>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="pb-16 sm:pb-20">
        <Container className="pt-10">
          <EmptyState
            title="There is nothing to check out"
            description="Add products to your cart before opening the checkout flow."
            actionLabel="Browse products"
            onAction={() => {
              window.location.href = "/category/all";
            }}
          />
        </Container>
      </main>
    );
  }

  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-6 sm:pt-8">
        <section className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            Mock checkout
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-stone-950 sm:text-5xl">
            Review and place your order
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            This route completes the cart flow in the frontend. It uses persisted cart state,
            shows the live order summary, and finalizes the order locally.
          </p>
        </section>
      </Container>

      <Container className="pt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <section className="rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Contact
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  aria-label="Email"
                  defaultValue="hello@auralux.market"
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none"
                />
                <input
                  aria-label="Phone"
                  defaultValue="+1 (555) 013-4400"
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none"
                />
              </div>
            </section>
            <section className="rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Shipping
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  aria-label="Address"
                  defaultValue="1 Infinite Loop"
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none sm:col-span-2"
                />
                <input
                  aria-label="City"
                  defaultValue="Cupertino"
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none"
                />
                <input
                  aria-label="ZIP Code"
                  defaultValue="95014"
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none"
                />
              </div>
            </section>
            <section className="rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Payment
              </p>
              <div className="mt-4 rounded-[24px] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-medium text-stone-950">Card ending in 2408</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  This is a frontend-only checkout preview. No payment gateway is called.
                </p>
              </div>
            </section>
          </div>
          <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
            <CartSummary
              itemCount={itemCount}
              subtotal={subtotal}
              savings={savings}
              primaryAction={{ href: "/checkout", label: "Reviewing order" }}
              secondaryAction={{ href: "/cart", label: "Back to cart" }}
              note="Placing the order below clears the persisted cart and confirms the mock purchase locally."
            />
            <Button
              className="w-full"
              onClick={() => {
                clearCart();
                setSubmitted(true);
              }}
            >
              Place test order
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
