import Link from "next/link";

import { cn, formatCurrency } from "@/lib/utils";

type CartSummaryProps = {
  itemCount: number;
  subtotal: number;
  savings: number;
  className?: string;
  note?: string;
  showClear?: boolean;
  onClear?: () => void;
  primaryAction: {
    href: string;
    label: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    href: string;
    label: string;
    onClick?: () => void;
  };
};

export function CartSummary({
  itemCount,
  subtotal,
  savings,
  className,
  note = "Shipping and taxes are calculated during the mock checkout step.",
  showClear,
  onClear,
  primaryAction,
  secondaryAction,
}: CartSummaryProps) {
  return (
    <section
      className={cn(
        "rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            Order summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </h2>
        </div>
        {showClear && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full px-3 py-2 text-sm text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
          >
            Clear cart
          </button>
        ) : null}
      </div>

      <div className="mt-6 space-y-3 border-y border-stone-200 py-5 text-sm">
        <div className="flex items-center justify-between text-stone-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-stone-600">
          <span>Savings</span>
          <span className="text-emerald-600">-{formatCurrency(savings)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-stone-950">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-stone-600">{note}</p>

      <div className="mt-6 space-y-3">
        <Link
          href={primaryAction.href}
          onClick={primaryAction.onClick}
          className="flex w-full items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
        >
          {primaryAction.label}
        </Link>
        {secondaryAction ? (
          <Link
            href={secondaryAction.href}
            onClick={secondaryAction.onClick}
            className="flex w-full items-center justify-center rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
          >
            {secondaryAction.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
