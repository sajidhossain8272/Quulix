"use client";

import { useEffect, useState } from "react";

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

export function HomePage() {
  const homeQuery = useHomeData();
  const categoriesQuery = useCategories();
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    fetch("/api/shop-settings")
      .then((res) => res.json())
      .then((data: StoreSettings) => {
        if (data && data.storeName) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  if (homeQuery.isLoading) {
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

  if (homeQuery.isError || !homeQuery.data) {
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
        <BrandVideoSection
          youtubeVideoId={settings.brandStoryVideoId}
        />
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

  const orderedCategories = homeQuery.data.featuredCategorySlugs
    .map((slug) => categoriesQuery.data?.data.find((category) => category.slug === slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <main className="pb-8 sm:pb-12">
      {/* 1. Top Hero Slider Banner (Always visible & interactive) */}
      <HeroSlider slides={homeQuery.data.heroSlides} />

      {/* 2. Category Mosaic */}
      {categoriesQuery.data?.data ? (
        <CategoryMosaic categories={categoriesQuery.data.data} />
      ) : null}

      {/* 3. Featured Deals Sections */}
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

      {/* 4. Category Shelves */}
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

      {/* 5. Brand Craft YouTube Video & Story Section (Screenshot 1) */}
      <BrandVideoSection
        youtubeVideoId={settings.brandStoryVideoId}
      />

      {/* 6. Cinematic Craftsmanship Showcase Visual / Footer Banner (Screenshot 4 - Balanced & Editable) */}
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

      {/* 7. Latest Articles / Blogs for SEO (Screenshot 3) */}
      <BlogSection />

      {/* 8. 3-Pillar Value Propositions Bar (Screenshot 2) */}
      <ValueProps />
    </main>
  );
}
