import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";

const footerLinks = [
  { href: "/category/all", label: "Shop All" },
  { href: "/category/headphones", label: "Headphones" },
  { href: "/category/workspace", label: "Workspace" },
  { href: "/category/travel", label: "Travel" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200/80 bg-white/80">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div>
            <Image src="/logo.png" alt="Quulix Logo" width={160} height={48} className="h-12 w-auto object-contain" />
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-600">
            Mobile-first commerce for premium daily tech, shaped with calm surfaces,
            dense discovery, and API-ready components.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-stone-600">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 transition hover:border-stone-300 hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
