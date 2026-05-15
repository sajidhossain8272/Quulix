"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/ui/empty-state";
import {
  selectCartCount,
  selectCartSavings,
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart-store";

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-[28px] border border-stone-200 bg-stone-100"
        />
      ))}
    </div>
  );
}

export function CartDrawer() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const savings = useCartStore(selectCartSavings);

  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCart, isOpen]);

  const getCartTitle = () => {
    if (!hasHydrated) return "Loading cart";
    if (itemCount === 1) return "1 item";
    return `${itemCount} items`;
  };

  const renderContent = () => {
    if (!hasHydrated) {
      return <CartSkeleton />;
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title="Your cart is empty"
          description="Add products from any category shelf and they will appear here instantly."
          actionLabel="Shop all categories"
          onAction={closeCart}
        />
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} compact onNavigate={closeCart} />
        ))}
      </div>
    );
  };

  const renderFooter = () => {
    if (!hasHydrated || items.length === 0) {
      return (
        <Link
          href="/category/all"
          onClick={closeCart}
          className="flex w-full items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
        >
          Explore products
        </Link>
      );
    }

    return (
      <CartSummary
        itemCount={itemCount}
        subtotal={subtotal}
        savings={savings}
        showClear
        onClear={clearCart}
        primaryAction={{
          href: "/checkout",
          label: "Proceed to checkout",
          onClick: closeCart,
        }}
        secondaryAction={{
          href: "/cart",
          label: "View full cart",
          onClick: closeCart,
        }}
        note="QULLIX uses a mock checkout flow here, but the cart totals and persisted line items are fully functional."
      />
    );
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={
          isOpen
            ? "fixed inset-0 z-[70] bg-stone-950/40 backdrop-blur-sm"
            : "pointer-events-none fixed inset-0 z-[70] bg-transparent opacity-0"
        }
      />
      <aside
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={
          isOpen
            ? "fixed inset-y-0 right-0 z-[80] flex w-full max-w-xl translate-x-0 flex-col border-l border-stone-200 bg-[#faf8f4] shadow-[-24px_0_80px_rgba(15,23,42,0.18)] transition-transform duration-300"
            : "fixed inset-y-0 right-0 z-[80] flex w-full max-w-xl translate-x-full flex-col border-l border-stone-200 bg-[#faf8f4] shadow-[-24px_0_80px_rgba(15,23,42,0.18)] transition-transform duration-300"
        }
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Shopping cart
            </p>
            <h2 id="cart-drawer-title" className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
              {getCartTitle()}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:bg-stone-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {renderContent()}
        </div>

        <div className="border-t border-stone-200 px-5 py-5 sm:px-6">
          {renderFooter()}
        </div>
      </aside>
    </>
  );
}
