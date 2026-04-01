import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  reviewCount?: number;
  className?: string;
};

export function RatingStars({ rating, reviewCount, className }: RatingStarsProps) {
  const percentage = `${Math.min(100, Math.max(0, (rating / 5) * 100))}%`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center gap-0.5 text-stone-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={`empty-${index}`} className="h-4 w-4 fill-current" />
        ))}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ width: percentage }}>
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={`filled-${index}`} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
      <span className="text-xs text-stone-500">
        {rating.toFixed(1)}{reviewCount ? ` (${reviewCount})` : ""}
      </span>
    </div>
  );
}
