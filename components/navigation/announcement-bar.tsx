"use client";

import { ChevronLeft, ChevronRight, Phone, ShieldCheck, Sparkles, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/lib/shop-settings";

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    fetch("/api/shop-settings")
      .then((res) => res.json())
      .then((data: StoreSettings) => {
        if (data && data.storeName) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const dynamicAnnouncements = [
    {
      icon: Truck,
      text: settings.announcementText1,
      linkText: "Shop Deals",
      href: "/category/all?collection=best-deals",
    },
    {
      icon: ShieldCheck,
      text: settings.announcementText2,
      linkText: "Learn More",
      href: "/shipping",
    },
    {
      icon: Sparkles,
      text: settings.announcementText3,
      linkText: "Explore Now",
      href: "/category/headphones",
    },
  ].filter((item) => Boolean(item.text));

  useEffect(() => {
    if (dynamicAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dynamicAnnouncements.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [dynamicAnnouncements.length]);

  if (!isVisible || !settings.isAnnouncementActive || dynamicAnnouncements.length === 0) {
    return null;
  }

  const activeIndex = currentIndex >= dynamicAnnouncements.length ? 0 : currentIndex;
  const current = dynamicAnnouncements[activeIndex];
  const Icon = current.icon;

  return (
    <aside
      aria-label="Promotions and support banner"
      className="relative z-50 border-b border-stone-800 bg-stone-950 text-stone-100"
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-3 text-xs font-medium tracking-wide sm:px-6 lg:px-8">
        {/* Left: Contact Hotline (Hidden on small mobile) */}
        <div className="hidden items-center gap-2 text-stone-300 sm:flex">
          <Phone className="h-3.5 w-3.5 text-amber-400" />
          <span>Hotline:</span>
          <a
            href={`tel:${settings.supportPhone}`}
            className="font-semibold text-white transition hover:text-amber-300"
          >
            {settings.supportPhone}
          </a>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex flex-1 items-center justify-center gap-1 overflow-hidden px-2 text-center">
          {dynamicAnnouncements.length > 1 && (
            <button
              type="button"
              aria-label="Previous announcement"
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + dynamicAnnouncements.length) % dynamicAnnouncements.length,
                )
              }
              className="flex h-9 w-9 items-center justify-center text-stone-300 transition hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 truncate">
            <Icon className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span className="truncate text-stone-100">{current.text}</span>
            <Link
              href={current.href}
              className="ml-1 shrink-0 font-semibold text-amber-300 underline underline-offset-2 transition hover:text-white"
            >
              {current.linkText} &rarr;
            </Link>
          </div>

          {dynamicAnnouncements.length > 1 && (
            <button
              type="button"
              aria-label="Next announcement"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % dynamicAnnouncements.length)}
              className="flex h-9 w-9 items-center justify-center text-stone-300 transition hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right: Currency / Quick Links & Dismiss */}
        <div className="flex items-center gap-2 text-stone-300">
          <span className="hidden lg:inline text-[11px] uppercase tracking-wider text-stone-300 font-medium">
            BDT (৳) | 100% Genuine
          </span>
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={() => setIsVisible(false)}
            className="flex h-9 w-9 items-center justify-center rounded text-stone-300 transition hover:bg-stone-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
