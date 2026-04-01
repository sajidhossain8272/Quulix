import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isPending,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-white px-4 py-3 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <Button
        variant="secondary"
        className="gap-2"
        disabled={page === 1 || isPending}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => {
          const value = index + 1;

          return (
            <button
              key={value}
              type="button"
              aria-current={value === page ? "page" : undefined}
              onClick={() => onPageChange(value)}
              disabled={isPending}
              className={
                value === page
                  ? "flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white"
                  : "flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              }
            >
              {value}
            </button>
          );
        })}
      </div>
      <Button
        variant="secondary"
        className="gap-2"
        disabled={page === totalPages || isPending}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
