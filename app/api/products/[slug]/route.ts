import { NextResponse } from "next/server";

import { getProductBySlug, getRelatedProducts } from "@/lib/mock-data";
import type { ProductDetailResponse } from "@/lib/types";

type ProductRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: ProductRouteProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const payload: ProductDetailResponse = {
    data: product,
    relatedProducts: getRelatedProducts(product, 4),
  };

  return NextResponse.json(payload);
}
