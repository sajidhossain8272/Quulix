"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/shared/container";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

export function CategoryBar() {
  const pathname = usePathname();
  const { data, isLoading } = useCategories();

  return (
    <div className="border-b border-stone-200/80 bg-white/75 backdrop-blur-xl">
      <Container>
        <div className="scrollbar-none flex snap-x gap-3 overflow-x-auto py-3">
          <Link
            href="/category/all"
            className={cn(
              "snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
              pathname === "/category/all"
                ? "bg-stone-950 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200",
            )}
          >
            All categories
          </Link>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 min-w-[120px] animate-pulse rounded-full bg-stone-200"
                />
              ))
            : data?.data.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={cn(
                    "snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                    pathname === `/category/${category.slug}`
                      ? "bg-stone-950 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200",
                  )}
                >
                  {category.name}
                </Link>
              ))}
        </div>
      </Container>
    </div>
  );
}
