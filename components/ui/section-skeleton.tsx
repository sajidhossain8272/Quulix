import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton";

type SectionSkeletonProps = {
  cards?: number;
};

export function SectionSkeleton({ cards = 4 }: SectionSkeletonProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="h-3 w-28 animate-pulse rounded-full bg-stone-200" />
        <div className="h-8 w-56 animate-pulse rounded-full bg-stone-200" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-stone-200" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
