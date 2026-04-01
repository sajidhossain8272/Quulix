export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-stone-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="aspect-square animate-pulse bg-stone-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-16 animate-pulse rounded-full bg-stone-200" />
        <div className="h-5 w-full animate-pulse rounded-full bg-stone-200" />
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-stone-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-stone-200" />
        <div className="h-10 w-full animate-pulse rounded-full bg-stone-200" />
      </div>
    </div>
  );
}
