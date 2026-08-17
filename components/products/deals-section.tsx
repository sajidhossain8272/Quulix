"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { ErrorState } from "@/components/ui/error-state";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { ProductCard } from "@/components/products/product-card";
import { useProducts } from "@/hooks/use-products";
import type { Product, ProductCollection } from "@/lib/types";

type DealsSectionProps = {
  id: string;
  title: string;
  description: string;
  collection: ProductCollection;
  initialProducts?: Product[];
};

export function DealsSection({
  id,
  title,
  description,
  collection,
  initialProducts,
}: DealsSectionProps) {
  const query = useProducts(
    { collection, limit: 4, sort: "discount-desc" },
    initialProducts
      ? {
          initialData: {
            data: initialProducts,
            pagination: {
              page: 1,
              limit: 4,
              total: initialProducts.length,
              totalPages: 1,
              hasMore: false,
            },
            meta: {
              availablePriceRange: { min: 0, max: 0 },
            },
          },
        }
      : undefined,
  );

  const products = query.data?.data || initialProducts;

  if (query.isLoading && !products) {
    return <SectionSkeleton cards={4} />;
  }

  if (query.isError && !products) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  return (
    <section id={id} className="space-y-5 scroll-mt-28">
      <SectionHeading title={title} description={description} ctaHref="/category/all" ctaLabel="Browse all" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {products?.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
