"use client";

import { ChevronLeft, ChevronRight, Phone, ShieldCheck, Sparkles, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const announcements = [
  {
    icon: Truck,
    text: "Free Express Shipping Across Bangladesh on Orders Over ৳2,000",
    linkText: "Shop Deals",
    href: "/category/all?collection=best-deals",
  },
  {
    icon: ShieldCheck,
    text: "1-Year Official Replacement Warranty on All Audio & Tech Gear",
    linkText: "Learn More",
    href: "/category/all",
  },
  {
    icon: Sparkles,
    text: "Spring Acoustic Refresh: Up to 35% Off Premium Headphones & Speakers",
    linkText: "Explore Now",
    href: "/category/headphones",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <aside
      aria-label="Promotions and support banner"
      className="relative z-50 border-b border-stone-800 bg-stone-950 text-stone-200"
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-3 text-[11px] font-medium tracking-wide sm:px-6 lg:px-8">
        {/* Left: Contact Hotline (Hidden on small mobile) */}
        <div className="hidden items-center gap-2 text-stone-400 sm:flex">
          <Phone className="h-3 w-3 text-stone-300" />
          <span>Hotline:</span>
          <a
            href="tel:+8801755377017"
            className="font-semibold text-stone-200 transition hover:text-white"
          >
            +880 1755-377017
          </a>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden px-2 text-center">
          <button
            type="button"
            aria-label="Previous announcement"
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
            }
            className="text-stone-400 transition hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center justify-center gap-1.5 truncate">
            <Icon className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{current.text}</span>
            <Link
              href={current.href}
              className="ml-1 shrink-0 font-semibold underline underline-offset-2 transition hover:text-white"
            >
              {current.linkText} &rarr;
            </Link>
          </div>

          <button
            type="button"
            aria-label="Next announcement"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
            className="text-stone-400 transition hover:text-white"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right: Currency / Quick Links & Dismiss */}
        <div className="flex items-center gap-3 text-stone-400">
          <span className="hidden lg:inline text-[10px] uppercase tracking-wider text-stone-400">
            BDT (৳) | 100% Genuine
          </span>
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={() => setIsVisible(false)}
            className="rounded p-0.5 text-stone-400 transition hover:bg-stone-800 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
