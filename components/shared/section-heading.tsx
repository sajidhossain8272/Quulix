import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

export function SectionHeading({
  title,
  description,
  ctaHref,
  ctaLabel,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
          Curated selection
        </p>
        <div className="space-y-2">
          <h2 className="font-display text-2xl tracking-tight text-stone-950 sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-stone-300 sm:inline-flex"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
