"use client";

import { CategorySection } from "@/components/products/category-section";
import { DealsSection } from "@/components/products/deals-section";
import { HeroSlider } from "@/components/marketing/hero-slider";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/ui/error-state";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useHomeData } from "@/hooks/use-home-data";

export function HomePage() {
  const homeQuery = useHomeData();
  const categoriesQuery = useCategories();

  if (homeQuery.isLoading) {
    return (
      <main className="pb-16 sm:pb-20">
        <Container className="pt-4 sm:pt-6">
          <div className="min-h-[480px] animate-pulse rounded-[32px] bg-stone-200 sm:min-h-[560px]" />
        </Container>
        <Container className="space-y-12 pt-8 sm:space-y-16 sm:pt-10">
          <SectionSkeleton cards={4} />
          <SectionSkeleton cards={4} />
          <SectionSkeleton cards={4} />
        </Container>
      </main>
    );
  }

  if (homeQuery.isError || !homeQuery.data) {
    return (
      <Container className="py-10">
        <ErrorState
          title="Home catalog unavailable"
          description="The storefront shell loaded, but the home endpoint did not return merchandising content."
          onRetry={() => homeQuery.refetch()}
        />
      </Container>
    );
  }

  const orderedCategories = homeQuery.data.featuredCategorySlugs
    .map((slug) => categoriesQuery.data?.data.find((category) => category.slug === slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-4 sm:pt-6">
        <HeroSlider slides={homeQuery.data.heroSlides} />
      </Container>

      <Container className="space-y-12 pt-8 sm:space-y-16 sm:pt-10">
        <DealsSection
          id="best-deals"
          title={homeQuery.data.sections.bestDeals.title}
          description={homeQuery.data.sections.bestDeals.description}
          collection={homeQuery.data.sections.bestDeals.collection}
        />
        <DealsSection
          id="seasonal-deals"
          title={homeQuery.data.sections.seasonal.title}
          description={homeQuery.data.sections.seasonal.description}
          collection={homeQuery.data.sections.seasonal.collection}
        />
      </Container>

      <Container className="space-y-12 pt-12 sm:space-y-16 sm:pt-16">
        {categoriesQuery.isLoading ? (
          <>
            <SectionSkeleton cards={4} />
            <SectionSkeleton cards={4} />
          </>
        ) : categoriesQuery.isError ? (
          <ErrorState
            title="Category shelves unavailable"
            description="The category API is connected, but the homepage could not render the live category shelves."
            onRetry={() => categoriesQuery.refetch()}
          />
        ) : (
          orderedCategories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))
        )}
      </Container>
    </main>
  );
}
