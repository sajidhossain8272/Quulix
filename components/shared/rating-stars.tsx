import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  reviewCount?: number;
  className?: string;
};

export function RatingStars({ rating, reviewCount, className }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center text-amber-500">
        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
      </div>
      <span className="text-xs font-semibold text-stone-800">
        {rating.toFixed(1)}
      </span>
      {reviewCount ? (
        <span className="text-[11px] text-stone-500">
          ({reviewCount})
        </span>
      ) : null}
    </div>
  );
}
