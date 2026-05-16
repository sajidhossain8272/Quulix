/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
import { formatCurrency } from "@/lib/utils";

type DeliveryZone = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

type ShopSettings = {
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
};

export function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const savings = useCartStore(selectCartSavings);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("INSIDE_DHAKA");

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    fetch("/api/shop-settings")
      .then((res) => res.json())
      .then((data: ShopSettings) => setShopSettings(data))
      .catch(() => {
        setShopSettings({
          deliveryChargeInsideDhaka: 80,
          deliveryChargeOutsideDhaka: 120,
        });
      });
  }, []);

  const deliveryCharge = useMemo(() => {
    if (!shopSettings) return 0;
    return deliveryZone === "INSIDE_DHAKA"
      ? shopSettings.deliveryChargeInsideDhaka
      : shopSettings.deliveryChargeOutsideDhaka;
  }, [deliveryZone, shopSettings]);

  const total = subtotal + deliveryCharge;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        deliveryZone,
        subtotal,
        deliveryCharge,
        totalAmount: total,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      clearCart();
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              Thank you for your order!
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              We have received your Cash on Delivery order and will contact you
              shortly to confirm delivery.
            </p>
            <Link
              href="/category/all"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Continue Shopping
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
              router.push("/category/all");
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
            Cash on Delivery
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-stone-950 sm:text-5xl">
            Complete your order
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Please fill out your delivery details. You will pay in cash when the
            items are delivered to your door.
          </p>
        </section>
      </Container>

      <Container className="pt-6">
        <form
          onSubmit={handleCheckout}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="space-y-4">
            {error ? (
              <div className="flex items-center gap-3 rounded-[24px] border border-red-100 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}

            <section className="rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Contact Information
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="ml-2 text-xs font-medium text-stone-600">
                    Full Name *
                  </label>
                  <input
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="ml-2 text-xs font-medium text-stone-600">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+880 1..."
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Delivery Details
              </p>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="ml-2 text-xs font-medium text-stone-600">
                    Delivery area *
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition has-[:checked]:border-stone-900 has-[:checked]:ring-1 has-[:checked]:ring-stone-900">
                      <input
                        type="radio"
                        name="deliveryZone"
                        value="INSIDE_DHAKA"
                        checked={deliveryZone === "INSIDE_DHAKA"}
                        onChange={() => setDeliveryZone("INSIDE_DHAKA")}
                        className="h-4 w-4 accent-stone-900"
                      />
                      <span>
                        <span className="block text-sm font-medium text-stone-900">
                          Inside Dhaka
                        </span>
                        <span className="text-xs text-stone-500">
                          {shopSettings
                            ? formatCurrency(shopSettings.deliveryChargeInsideDhaka)
                            : "80 TK"}{" "}
                          delivery
                        </span>
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition has-[:checked]:border-stone-900 has-[:checked]:ring-1 has-[:checked]:ring-stone-900">
                      <input
                        type="radio"
                        name="deliveryZone"
                        value="OUTSIDE_DHAKA"
                        checked={deliveryZone === "OUTSIDE_DHAKA"}
                        onChange={() => setDeliveryZone("OUTSIDE_DHAKA")}
                        className="h-4 w-4 accent-stone-900"
                      />
                      <span>
                        <span className="block text-sm font-medium text-stone-900">
                          Outside Dhaka
                        </span>
                        <span className="text-xs text-stone-500">
                          {shopSettings
                            ? formatCurrency(
                                shopSettings.deliveryChargeOutsideDhaka,
                              )
                            : "120 TK"}{" "}
                          delivery
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="ml-2 text-xs font-medium text-stone-600">
                    Full Address *
                  </label>
                  <input
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House, Road, Block, Area..."
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="ml-2 text-xs font-medium text-stone-600">
                    City / District (optional)
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dhaka"
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="ml-2 text-xs font-medium text-stone-600">
                    Order Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery?"
                    className="min-h-[100px] w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Payment Method
              </p>
              <div className="mt-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-950">
                  <CheckCircle2 className="h-4 w-4" />
                  Cash on Delivery (COD)
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-800">
                  You will pay the delivery agent in cash when your order
                  arrives. No digital payment required.
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
            <CartSummary
              itemCount={itemCount}
              subtotal={subtotal}
              savings={savings}
              deliveryCharge={deliveryCharge}
              total={total}
              primaryAction={{ href: "/checkout", label: "Reviewing order" }}
              secondaryAction={{ href: "/cart", label: "Back to cart" }}
              note="Total includes delivery based on your selected area."
            />
            <Button
              type="submit"
              disabled={loading || !shopSettings}
              className="h-12 w-full text-base font-medium"
            >
              {loading ? "Processing..." : `Place Order (${formatCurrency(total)} COD)`}
            </Button>
          </div>
        </form>
      </Container>
    </main>
  );
}
