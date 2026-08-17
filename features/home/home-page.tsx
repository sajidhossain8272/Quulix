"use client";

import { CategorySection } from "@/components/products/category-section";
import { DealsSection } from "@/components/products/deals-section";
import { HeroSlider } from "@/components/marketing/hero-slider";
import { CategoryMosaic } from "@/components/marketing/category-mosaic";
import { BrandVideoSection } from "@/components/marketing/brand-video-section";
import { CinematicShowcase } from "@/components/marketing/cinematic-showcase";
import { BlogSection } from "@/components/marketing/blog-section";
import { ValueProps } from "@/components/marketing/value-props";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/ui/error-state";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useHomeData } from "@/hooks/use-home-data";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/lib/shop-settings";
import type { Category, HomeResponse, Product } from "@/lib/types";

type HomePageProps = {
  initialHomeData?: HomeResponse;
  initialCategories?: Category[];
  initialSettings?: StoreSettings;
  initialBestDeals?: Product[];
  initialSeasonalDeals?: Product[];
  initialCategoryProductsMap?: Record<string, Product[]>;
};

export function HomePage({
  initialHomeData,
  initialCategories,
  initialSettings,
  initialBestDeals,
  initialSeasonalDeals,
  initialCategoryProductsMap,
}: HomePageProps) {
  const homeQuery = useHomeData(initialHomeData ? { initialData: initialHomeData } : undefined);
  const categoriesQuery = useCategories(initialCategories ? { initialData: { data: initialCategories } } : undefined);
  const settings = initialSettings || DEFAULT_STORE_SETTINGS;

  const currentHomeData = homeQuery.data || initialHomeData;
  const currentCategories = categoriesQuery.data?.data || initialCategories || [];

  if (homeQuery.isLoading && !currentHomeData) {
    return (
      <main className="pb-16 sm:pb-20">
        <HeroSlider />
        <Container className="space-y-12 pt-8 sm:space-y-16 sm:pt-10">
          <SectionSkeleton cards={4} />
          <SectionSkeleton cards={4} />
        </Container>
      </main>
    );
  }

  if ((homeQuery.isError || !currentHomeData) && !initialHomeData) {
    return (
      <main className="pb-16 sm:pb-20">
        <HeroSlider />
        <Container className="py-10">
          <ErrorState
            title="Home catalog unavailable"
            description="The storefront shell loaded, but the merchandising content could not be refreshed."
            onRetry={() => homeQuery.refetch()}
          />
        </Container>
        <BrandVideoSection youtubeVideoId={settings.brandStoryVideoId} />
        <CinematicShowcase
          image={settings.showcaseImage}
          badge={settings.showcaseBadge}
          eyebrow={settings.showcaseEyebrow}
          title={settings.showcaseTitle}
          description={settings.showcaseDescription}
          btn1Label={settings.showcaseBtn1Label}
          btn1Href={settings.showcaseBtn1Href}
          btn2Label={settings.showcaseBtn2Label}
          btn2Href={settings.showcaseBtn2Href}
        />
        <BlogSection />
        <ValueProps />
      </main>
    );
  }

  const activeHomeData = currentHomeData!;
  const orderedCategories = activeHomeData.featuredCategorySlugs
    .map((slug) => currentCategories.find((category) => category.slug === slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <main className="pb-8 sm:pb-12">
      {/* 1. Top Hero Slider Banner (Pre-rendered on Server for instant LCP) */}
      <HeroSlider slides={activeHomeData.heroSlides} />

      {/* 2. Category Mosaic */}
      {currentCategories.length > 0 ? (
        <CategoryMosaic categories={currentCategories} />
      ) : null}

      {/* 3. Featured Deals Sections (SSR pre-rendered) */}
      <Container className="space-y-12 pt-8 sm:space-y-16 sm:pt-10">
        <DealsSection
          id="best-deals"
          title={activeHomeData.sections.bestDeals.title}
          description={activeHomeData.sections.bestDeals.description}
          collection={activeHomeData.sections.bestDeals.collection}
          initialProducts={initialBestDeals}
        />
        <DealsSection
          id="seasonal-deals"
          title={activeHomeData.sections.seasonal.title}
          description={activeHomeData.sections.seasonal.description}
          collection={activeHomeData.sections.seasonal.collection}
          initialProducts={initialSeasonalDeals}
        />
      </Container>

      {/* 4. Curated Category Shelves (SSR pre-rendered) */}
      <Container className="space-y-12 pt-12 sm:space-y-16 sm:pt-16">
        {categoriesQuery.isLoading && currentCategories.length === 0 ? (
          <>
            <SectionSkeleton cards={4} />
            <SectionSkeleton cards={4} />
          </>
        ) : (
          orderedCategories.slice(0, 2).map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              initialProducts={initialCategoryProductsMap?.[category.slug]}
            />
          ))
        )}
      </Container>

      {/* 5. Brand Craft YouTube Video & Story Section */}
      <BrandVideoSection youtubeVideoId={settings.brandStoryVideoId} />

      {/* 6. Cinematic Craftsmanship Showcase Visual / Footer Banner */}
      <CinematicShowcase
        image={settings.showcaseImage}
        badge={settings.showcaseBadge}
        eyebrow={settings.showcaseEyebrow}
        title={settings.showcaseTitle}
        description={settings.showcaseDescription}
        btn1Label={settings.showcaseBtn1Label}
        btn1Href={settings.showcaseBtn1Href}
        btn2Label={settings.showcaseBtn2Label}
        btn2Href={settings.showcaseBtn2Href}
      />

      {/* 7. Latest Articles / Blogs for SEO */}
      <BlogSection />

      {/* 8. 3-Pillar Value Propositions Bar */}
      <ValueProps />
    </main>
  );
}
