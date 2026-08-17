import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [categories, banners] = await Promise.all([
      prisma.category.findMany({
      where: { isSystem: false },
      orderBy: { createdAt: "asc" },
      take: 6,
      }),
      prisma.heroBanner.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
    ]);

    const homeContent = {
      heroSlides: banners,
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

    return NextResponse.json(homeContent, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load home content.");
  }
}
