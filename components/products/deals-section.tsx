"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { ErrorState } from "@/components/ui/error-state";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { ProductCard } from "@/components/products/product-card";
import { useProducts } from "@/hooks/use-products";
import type { ProductCollection } from "@/lib/types";

type DealsSectionProps = {
  id: string;
  title: string;
  description: string;
  collection: ProductCollection;
};

export function DealsSection({
  id,
  title,
  description,
  collection,
}: DealsSectionProps) {
  const query = useProducts({ collection, limit: 4, sort: "discount-desc" });

  if (query.isLoading) {
    return <SectionSkeleton cards={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  return (
    <section id={id} className="space-y-5 scroll-mt-28">
      <SectionHeading title={title} description={description} ctaHref="/category/all" ctaLabel="Browse all" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {query.data?.data.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
