import { prisma } from "@/lib/prisma";
import { DEFAULT_STORE_SETTINGS, getShopSettings, type StoreSettings } from "@/lib/shop-settings";
import type { Category, HomeResponse } from "@/lib/types";

export async function getHomePageData(): Promise<{
  homeData: HomeResponse;
  categories: Category[];
  settings: StoreSettings;
}> {
  try {
    const [categories, banners, settings] = await Promise.all([
      prisma.category.findMany({
        where: { isSystem: false },
        orderBy: { createdAt: "asc" },
        take: 8,
      }),
      prisma.heroBanner.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      getShopSettings(),
    ]);

    const formattedCategories: Category[] = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description || "",
      tagline: c.tagline || "",
      image: c.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      isSystem: c.isSystem,
      productCount: 0,
      createdAt: c.createdAt.toISOString(),
    }));

    const homeData: HomeResponse = {
      heroSlides: banners.map((b) => ({
        id: b.id,
        image: b.image,
        alt: b.alt || undefined,
        eyebrow: b.eyebrow || undefined,
        title: b.title || undefined,
        description: b.description || undefined,
        ctaLabel: b.ctaLabel || undefined,
        ctaHref: b.ctaHref || undefined,
      })),
      sections: {
        bestDeals: {
          title: "Best Deals & Discounts",
          description: "High-value picks with the sharpest markdowns.",
          collection: "best-deals",
        },
        seasonal: {
          title: "Seasonal Deals",
          description: "Essentials selected for your routine.",
          collection: "seasonal",
        },
      },
      featuredCategorySlugs: categories.map((cat) => cat.slug),
    };

    return {
      homeData,
      categories: formattedCategories,
      settings: settings || DEFAULT_STORE_SETTINGS,
    };
  } catch (error) {
    console.error("Error fetching homepage SSR data:", error);
    return {
      homeData: {
        heroSlides: [],
        sections: {
          bestDeals: {
            title: "Best Deals & Discounts",
            description: "High-value picks with the sharpest markdowns.",
            collection: "best-deals",
          },
          seasonal: {
            title: "Seasonal Deals",
            description: "Essentials selected for your routine.",
            collection: "seasonal",
          },
        },
        featuredCategorySlugs: ["headphones", "speakers", "wearables", "workspace"],
      },
      categories: [],
      settings: DEFAULT_STORE_SETTINGS,
    };
  }
}
