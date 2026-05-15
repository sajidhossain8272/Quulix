import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      take: 6,
    });

    const heroSlides = categories.slice(0, 3).map((cat, index) => ({
      id: `hero-${cat.id}`,
      eyebrow: index === 0 ? "Featured" : "New Arrival",
      title: cat.tagline || `Explore our ${cat.name} collection`,
      description:
        cat.description || `Discover the best in ${cat.name}.`,
      ctaLabel: `Shop ${cat.name}`,
      ctaHref: `/category/${cat.slug}`,
      image:
        cat.image ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      alt: cat.name,
    }));

    const homeContent = {
      heroSlides,
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

    return NextResponse.json(homeContent);
  } catch (error) {
    return apiErrorResponse(error, "Failed to load home content.");
  }
}
