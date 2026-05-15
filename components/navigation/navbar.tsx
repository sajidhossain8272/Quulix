"use client";

import { Menu, Search, ShoppingBag, User, X, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { selectCartCount, useCartStore } from "@/store/cart-store";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useCategories();
  const cartCount = useCartStore(selectCartCount);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const categories = data?.data ?? [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(`/category/all${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    setMobileOpen(false);
  };

  const handleCartOpen = () => {
    setMobileOpen(false);
    openCart();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/75 backdrop-blur-xl">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <Button
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            variant="ghost"
            className="h-11 w-11 rounded-full p-0"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="QULLIX Logo" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/category/all"
              aria-label="Account"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            >
              <User className="h-5 w-5" />
            </Link>
            <Button
              aria-label="Open cart"
              aria-controls="cart-drawer"
              aria-expanded={isCartOpen}
              variant="secondary"
              className="relative h-11 w-11 rounded-full p-0 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              onClick={handleCartOpen}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-950 px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-3 lg:hidden">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search premium audio, travel, wellness..."
              className="h-12 w-full rounded-full border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-stone-400 focus:border-stone-300"
            />
          </form>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
          >
            <MapPin className="h-4 w-4 text-stone-500" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Delivery
              </p>
              <p className="text-sm font-medium text-stone-900">Set your location</p>
            </div>
          </button>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Button
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            variant="ghost"
            className="h-12 w-12 rounded-full border border-stone-200 bg-white p-0 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="min-w-[172px]">
            <img src="/logo.png" alt="QULLIX Logo" className="h-10 w-auto object-contain" />
          </Link>
          <form onSubmit={handleSubmit} className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search curated tech, audio, and seasonal essentials"
              className="h-12 w-full rounded-full border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-stone-400 focus:border-stone-300"
            />
          </form>
          <button
            type="button"
            className="flex min-w-[188px] items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
          >
            <MapPin className="h-4 w-4 text-stone-500" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">Delivery</p>
              <p className="text-sm font-medium text-stone-900">Set your location</p>
            </div>
          </button>
          <Link
            href="/category/all"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Button
            aria-label="Open cart"
            aria-controls="cart-drawer"
            aria-expanded={isCartOpen}
            variant="secondary"
            className="relative h-12 w-12 rounded-full p-0 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            onClick={handleCartOpen}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-950 px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Button>
        </div>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-stone-200/80 bg-white transition-[max-height,opacity] duration-300",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="py-5">
          <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-2">
              <Link
                href="/category/all"
                className={cn(
                  "block rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-stone-100",
                  pathname === "/category/all"
                    ? "bg-stone-950 text-white hover:bg-stone-900"
                    : "bg-stone-50 text-stone-900",
                )}
                onClick={() => setMobileOpen(false)}
              >
                Shop all
              </Link>
              <a
                href="#best-deals"
                className="block rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
                onClick={() => setMobileOpen(false)}
              >
                Best deals
              </a>
              <a
                href="#seasonal-deals"
                className="block rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
                onClick={() => setMobileOpen(false)}
              >
                Seasonal deals
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="rounded-[24px] border border-stone-200 bg-stone-50 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                  onClick={() => setMobileOpen(false)}
                >
                  <p className="text-sm font-semibold text-stone-950">{category.name}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{category.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
