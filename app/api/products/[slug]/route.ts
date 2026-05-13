/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ProductDetailResponse } from "@/lib/types";

type ProductRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: ProductRouteProps) {
  const { slug } = await params;

  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      media: { orderBy: { position: 'asc' } },
      variants: true,
    }
  });

  if (!p) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: p.categoryId,
      id: { not: p.id }
    },
    take: 4,
    include: {
      category: true,
      media: { where: { type: "IMAGE" }, take: 1 }
    }
  });

  const formattedProduct: any = {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category.slug,
    categoryName: p.category.name,
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discountPercentage: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: p.media[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    tags: p.tags,
    inventory: p.inventory,
    featuredCollections: p.featuredCollections as any,
    createdAt: p.createdAt.toISOString(),
  };

  const formattedRelated: any[] = related.map(rp => ({
    id: rp.id,
    slug: rp.slug,
    title: rp.title,
    description: rp.description,
    category: rp.category.slug,
    categoryName: rp.category.name,
    price: rp.price,
    originalPrice: rp.originalPrice || rp.price,
    discountPercentage: rp.originalPrice ? Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100) : 0,
    rating: rp.rating,
    reviewCount: rp.reviewCount,
    image: rp.media[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    tags: rp.tags,
    inventory: rp.inventory,
    featuredCollections: rp.featuredCollections as any,
    createdAt: rp.createdAt.toISOString(),
  }));

  const payload: ProductDetailResponse = {
    data: formattedProduct,
    relatedProducts: formattedRelated,
  };

  return NextResponse.json(payload);
}
