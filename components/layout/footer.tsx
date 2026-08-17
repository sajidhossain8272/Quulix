"use client";

import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/lib/shop-settings";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
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

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-200">
      {/* Main Footer Content */}
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Col 1: Brand Info & Contact (4 cols on lg) */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-4">
            <Link href="/" aria-label={`${settings.storeName} Home`} className="inline-block">
              <Image
                src={settings.logoWhiteUrl || "/logo-white.png"}
                alt={settings.storeName}
                width={150}
                height={42}
                className="h-9 w-auto object-contain brightness-110"
              />
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-stone-300 max-w-sm">
              {settings.storeName} is dedicated to acoustic mastery, refined tactile finishes, and uncompromised build quality. Elevating your daily tech and focus ritual.
            </p>

            {/* Address & Hotline */}
            <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{settings.studioAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                <a href={`tel:${settings.supportPhone}`} className="transition hover:text-white underline underline-offset-2">
                  {settings.supportPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                <a href={`mailto:${settings.supportEmail}`} className="transition hover:text-white underline underline-offset-2">
                  {settings.supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols on lg) */}
          <div className="space-y-4 lg:col-span-2 sm:pl-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Navigation
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-stone-300">
              <li>
                <Link href="/category/all" className="inline-block py-1 transition hover:text-white">
                  &raquo; All Products
                </Link>
              </li>
              <li>
                <Link href="/category/headphones" className="inline-block py-1 transition hover:text-white">
                  &raquo; Headphones
                </Link>
              </li>
              <li>
                <Link href="/category/workspace" className="inline-block py-1 transition hover:text-white">
                  &raquo; Workspace Gear
                </Link>
              </li>
              <li>
                <Link href="/category/travel" className="inline-block py-1 transition hover:text-white">
                  &raquo; Travel Audio
                </Link>
              </li>
              <li>
                <Link href="/category/all?collection=best-deals" className="inline-block py-1 transition hover:text-white">
                  &raquo; Best Deals
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="inline-block py-1 transition hover:text-white">
                  &raquo; Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies (2 cols on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Customer Care
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-stone-300">
              <li>
                <Link href="/about" className="inline-block py-1 transition hover:text-white">
                  &raquo; About {settings.storeName}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="inline-block py-1 transition hover:text-white">
                  &raquo; Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/terms" className="inline-block py-1 transition hover:text-white">
                  &raquo; Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/category/all" className="inline-block py-1 transition hover:text-white">
                  &raquo; Warranty Care
                </Link>
              </li>
              <li>
                <Link href="/category/headphones" className="inline-block py-1 transition hover:text-white">
                  &raquo; Acoustic Quality
                </Link>
              </li>
              <li>
                <Link href={`tel:${settings.supportPhone}`} className="inline-block py-1 transition hover:text-white">
                  &raquo; Direct Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Socials (4 cols on lg) */}
          <div className="space-y-4 lg:col-span-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                Join the {settings.storeName} Journal
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-300">
                Subscribe for private releases, acoustic breakdowns, and exclusive discounts.
              </p>
            </div>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  aria-label="Email address for newsletter"
                  className="h-11 w-full rounded-lg border border-stone-700 bg-stone-900 px-3.5 text-xs sm:text-sm text-white placeholder-stone-400 outline-none transition focus:border-stone-300 focus:ring-1 focus:ring-stone-300"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-stone-100 px-4 text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-white active:scale-[0.99]"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <Check className="h-4 w-4" /> Subscribed!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Subscribe <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            </form>

            {/* Social Media Links (>= 44px Touch Targets) */}
            <div className="pt-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Follow Our Studio
              </span>
              <div className="flex items-center gap-2 text-stone-300">
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Quulix on Facebook"
                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-stone-800 bg-stone-900 transition hover:border-stone-500 hover:bg-stone-800 hover:text-white"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Quulix on Instagram"
                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-stone-800 bg-stone-900 transition hover:border-stone-500 hover:bg-stone-800 hover:text-white"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe to Quulix on YouTube"
                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-stone-800 bg-stone-900 transition hover:border-stone-500 hover:bg-stone-800 hover:text-white"
                  >
                    <YoutubeIcon className="h-4 w-4" />
                  </a>
                )}
                {settings.twitterUrl && (
                  <a
                    href={settings.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Quulix on Twitter X"
                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-stone-800 bg-stone-900 transition hover:border-stone-500 hover:bg-stone-800 hover:text-white"
                  >
                    <XIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="border-t border-stone-900 bg-black/60 py-5">
        <Container className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-stone-300">
            {settings.storeName} &copy; {new Date().getFullYear()} All rights reserved. {settings.tagline}.
          </p>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {["VISA", "Mastercard", "AMEX", "bKash", "Nagad", "SSLCommerz"].map((method) => (
              <span
                key={method}
                className="rounded border border-stone-800 bg-stone-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-300"
              >
                {method}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
