"use client";

import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { useProducts } from "@/hooks/use-products";
import type { Category } from "@/lib/types";

type CategorySectionProps = {
  category: Category;
};

export function CategorySection({ category }: CategorySectionProps) {
  const query = useProducts({ category: category.slug, limit: 4, sort: "featured" });

  if (query.isLoading) {
    return <SectionSkeleton cards={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  if (!query.data?.data.length) {
    return (
      <EmptyState
        title={`No ${category.name.toLowerCase()} products available`}
        description="This category is connected to the API but currently has no seeded products."
      />
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        title={category.name}
        description={category.description}
        ctaHref={`/category/${category.slug}`}
        ctaLabel="See all"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {query.data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
