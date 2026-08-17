/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { DEFAULT_STORE_SETTINGS, getShopSettings, type StoreSettings } from "@/lib/shop-settings";
import type { Category, HomeResponse, Product } from "@/lib/types";

function formatProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category.slug,
    categoryName: p.category.name,
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discountPercentage: p.originalPrice
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image:
      p.media[0]?.url ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    images: p.media.map((m: any) => m.url),
    tags: p.tags,
    inventory: p.inventory,
    featuredCollections: p.featuredCollections as any,
    createdAt: p.createdAt.toISOString(),
  };
}

export async function getHomePageData(): Promise<{
  homeData: HomeResponse;
  categories: Category[];
  settings: StoreSettings;
  bestDealsProducts: Product[];
  seasonalDealsProducts: Product[];
  categoryProductsMap: Record<string, Product[]>;
}> {
  try {
    const [categories, banners, settings, bestDealsRaw, seasonalRaw] = await Promise.all([
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
      prisma.product.findMany({
        where: { featuredCollections: { has: "best-deals" } },
        orderBy: { rating: "desc" },
        take: 4,
        include: {
          category: true,
          media: { where: { type: "IMAGE" }, orderBy: { position: "asc" } },
        },
      }),
      prisma.product.findMany({
        where: { featuredCollections: { has: "seasonal" } },
        orderBy: { rating: "desc" },
        take: 4,
        include: {
          category: true,
          media: { where: { type: "IMAGE" }, orderBy: { position: "asc" } },
        },
      }),
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

    const topCategorySlugs = categories.slice(0, 2).map((c) => c.slug);
    const categoryProductsRaw = await Promise.all(
      topCategorySlugs.map((slug) =>
        prisma.product.findMany({
          where: { category: { slug } },
          orderBy: { rating: "desc" },
          take: 4,
          include: {
            category: true,
            media: { where: { type: "IMAGE" }, orderBy: { position: "asc" } },
          },
        }),
      ),
    );

    const categoryProductsMap: Record<string, Product[]> = {};
    topCategorySlugs.forEach((slug, index) => {
      categoryProductsMap[slug] = categoryProductsRaw[index].map(formatProduct);
    });

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
      bestDealsProducts: bestDealsRaw.map(formatProduct),
      seasonalDealsProducts: seasonalRaw.map(formatProduct),
      categoryProductsMap,
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
      bestDealsProducts: [],
      seasonalDealsProducts: [],
      categoryProductsMap: {},
    };
  }
}
