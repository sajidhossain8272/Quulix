import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-stone-950 text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0",
        variant === "secondary" &&
          "border border-stone-200 bg-white text-stone-900 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 active:translate-y-0",
        variant === "ghost" && "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
