"use client";

import { ChevronDown, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { AnnouncementBar } from "@/components/navigation/announcement-bar";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : previous || "";

    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [mobileOpen]);

  const categories = data?.data ?? [];
  const midpoint = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, midpoint);
  const rightCategories = categories.slice(midpoint);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(`/category/all${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const handleCartOpen = () => {
    setMobileOpen(false);
    openCart();
  };

  const categoryMenu = (category: (typeof categories)[number]) => (
    <div key={category.id} className="relative" onMouseLeave={() => setOpenCategory(null)}>
      <button
        type="button"
        aria-expanded={openCategory === category.id}
        className={cn(
          "flex h-10 items-center gap-1 whitespace-nowrap rounded-md px-2.5 text-xs font-bold uppercase tracking-[0.06em] text-stone-700 transition hover:bg-stone-100 hover:text-stone-950",
          openCategory === category.id && "bg-stone-100 text-stone-950",
        )}
        onClick={() => setOpenCategory((current) => (current === category.id ? null : category.id))}
        onMouseEnter={() => setOpenCategory(category.id)}
      >
        {category.name}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {openCategory === category.id ? (
        <div className="absolute left-0 top-full z-50 w-64 pt-2">
          <div className="rounded-xl border border-stone-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
            <Link
              href={`/category/${category.slug}`}
              className="block rounded-lg px-3 py-2.5 transition hover:bg-stone-50"
              onClick={() => setOpenCategory(null)}
            >
              <span className="block text-sm font-semibold text-stone-950">Shop {category.name}</span>
              {category.tagline ? (
                <span className="mt-0.5 block text-xs leading-5 text-stone-500">{category.tagline}</span>
              ) : null}
            </Link>
            <Link
              href={`/category/${category.slug}`}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-stone-700 transition hover:bg-stone-50"
              onClick={() => setOpenCategory(null)}
            >
              View collection
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-xl">
      <Container>
        <div className="flex h-[72px] items-center justify-between lg:hidden">
          <Button
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            variant="ghost"
            className="h-11 w-11 rounded-full border border-stone-200 p-0"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href="/" aria-label="Quulix home">
            <Image src="/logo.png" alt="Quulix" width={140} height={40} className="object-contain" priority />
          </Link>

          <div className="flex items-center gap-1">
            <Button
              aria-label="Search products"
              variant="ghost"
              className="h-11 w-11 rounded-full border border-stone-200 p-0"
              onClick={() => setMobileOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              aria-label="Open cart"
              aria-controls="cart-drawer"
              aria-expanded={isCartOpen}
              variant="secondary"
              className="relative h-11 w-11 rounded-full p-0"
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

        <nav aria-label="Main navigation" className="relative hidden h-[76px] grid-cols-[minmax(0,1fr)_156px_minmax(0,1fr)] items-center lg:grid">
          <div className="flex min-w-0 items-center justify-end gap-1">
            <Button
              aria-label="Search products"
              aria-expanded={searchOpen}
              variant="ghost"
              className="h-10 w-10 shrink-0 rounded-full p-0 text-stone-900 hover:bg-stone-100"
              onClick={() => {
                setSearchOpen((value) => !value);
                setOpenCategory(null);
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
            <div className="flex min-w-0 items-center overflow-visible">{leftCategories.map(categoryMenu)}</div>
          </div>

          <Link href="/" aria-label="Quulix home" className="relative z-10 mx-auto flex h-12 items-center justify-center px-3">
            <Image src="/logo.png" alt="Quulix" width={150} height={43} className="object-contain" priority />
          </Link>

          <div className="flex min-w-0 items-center gap-1">
            <div className="flex min-w-0 items-center overflow-visible">{rightCategories.map(categoryMenu)}</div>
            <Link
              href="/category/all"
              className={cn(
                "ml-1 whitespace-nowrap rounded-md px-2.5 py-2 text-xs font-bold uppercase tracking-[0.06em] transition hover:bg-stone-100",
                pathname === "/category/all" ? "bg-stone-950 text-white hover:bg-stone-800" : "text-stone-700",
              )}
            >
              Shop all
            </Link>
            <Link
              href="/category/all"
              aria-label="Account"
              className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-800 transition hover:bg-stone-100"
            >
              <User className="h-5 w-5" />
            </Link>
            <Button
              aria-label="Open cart"
              aria-controls="cart-drawer"
              aria-expanded={isCartOpen}
              variant="ghost"
              className="relative h-10 w-10 shrink-0 rounded-full p-0 text-stone-900 hover:bg-stone-100"
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
        </nav>
      </Container>

      {searchOpen ? (
        <div className="hidden border-t border-stone-100 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)] lg:block">
          <Container className="py-3">
            <form onSubmit={handleSubmit} className="relative mx-auto max-w-3xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                autoFocus
                aria-label="Search products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="h-12 w-full rounded-full border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
              />
            </form>
          </Container>
        </div>
      ) : null}

      <div aria-hidden={!mobileOpen} className={cn(mobileOpen ? "" : "pointer-events-none")}>
        <aside
          role="dialog"
          aria-modal="true"
          className={cn(
            "fixed inset-0 z-[60] flex h-[100dvh] w-screen flex-col bg-white transition-transform duration-300 lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Container className="flex h-[72px] shrink-0 items-center justify-between border-b border-stone-200">
            <Link href="/" aria-label="Quulix home" onClick={() => setMobileOpen(false)}>
              <Image src="/logo.png" alt="Quulix" width={140} height={40} className="object-contain" priority />
            </Link>
            <Button
              aria-label="Close navigation"
              variant="ghost"
              className="h-11 w-11 rounded-full border border-stone-200 p-0"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </Container>

          <div className="mobile-nav-scroll flex-1 overflow-y-auto">
            <Container className="py-6">
              <form onSubmit={handleSubmit} className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  autoFocus
                  aria-label="Search products"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  className="h-12 w-full rounded-full border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
                />
              </form>

              <div className="mt-8 space-y-1">
                <Link
                  href="/category/all"
                  className="flex items-center justify-between rounded-xl bg-stone-950 px-4 py-4 text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Shop all
                  <span aria-hidden="true">→</span>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="flex items-center justify-between border-b border-stone-100 px-4 py-4 text-base font-semibold text-stone-900 transition hover:bg-stone-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {category.name}
                    <ChevronDown className="-rotate-90 text-stone-400" />
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-stone-200 pt-6">
                <Link href="/category/all" className="flex items-center gap-2 text-sm font-semibold text-stone-800" onClick={() => setMobileOpen(false)}>
                  <User className="h-4 w-4" />
                  Account
                </Link>
                <button type="button" className="flex items-center gap-2 text-sm font-semibold text-stone-800" onClick={handleCartOpen}>
                  <ShoppingBag className="h-4 w-4" />
                  Cart ({cartCount})
                </button>
              </div>
            </Container>
          </div>
        </aside>
      </div>
    </header>
    </>
  );
}
