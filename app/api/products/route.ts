/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-route";
import { prisma } from "@/lib/prisma";
import type { SortOption } from "@/lib/types";

function parseNumber(value: string | null) {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function parseBoolean(value: string | null) {
  if (!value) return undefined;
  return value === "true";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const categorySlug = searchParams.get("category");
    const collection = searchParams.get("collection");
    const page = parseNumber(searchParams.get("page")) || 1;
    const limit = parseNumber(searchParams.get("limit")) || 8;
    const sort = (searchParams.get("sort") as SortOption) || "featured";
    const minPrice = parseNumber(searchParams.get("minPrice"));
    const maxPrice = parseNumber(searchParams.get("maxPrice"));
    const search = searchParams.get("search");
    const discountOnly = parseBoolean(searchParams.get("discountOnly"));

    const where: any = {};

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (collection) {
      where.featuredCollections = { has: collection };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (discountOnly) {
      where.originalPrice = { not: null };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = {};
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "rating-desc":
        orderBy = { rating: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { rating: "desc" };
    }

    const [total, products, aggr] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          media: {
            where: { type: "IMAGE" },
            take: 1,
            orderBy: { position: "asc" },
          },
        },
      }),
      prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    const formattedProducts: any[] = products.map((p) => ({
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
      tags: p.tags,
      inventory: p.inventory,
      featuredCollections: p.featuredCollections as any,
      createdAt: p.createdAt.toISOString(),
    }));

    const filteredProducts = discountOnly
      ? formattedProducts.filter((product) => product.discountPercentage > 0)
      : formattedProducts;

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: filteredProducts,
      pagination: {
        page,
        limit,
        total: discountOnly ? filteredProducts.length : total,
        totalPages,
        hasMore: page < totalPages,
      },
      meta: {
        availablePriceRange: {
          min: aggr._min.price || 0,
          max: aggr._max.price || 1000,
        },
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load products.");
  }
}
