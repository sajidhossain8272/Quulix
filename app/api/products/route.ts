import { NextRequest, NextResponse } from "next/server";

import { queryProducts } from "@/lib/mock-data";
import type { ProductQueryParams, SortOption } from "@/lib/types";

function parseNumber(value: string | null) {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function parseBoolean(value: string | null) {
  if (!value) {
    return undefined;
  }

  return value === "true";
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const params: ProductQueryParams = {
    category: searchParams.get("category") ?? undefined,
    collection:
      (searchParams.get("collection") as ProductQueryParams["collection"]) ??
      undefined,
    page: parseNumber(searchParams.get("page")),
    limit: parseNumber(searchParams.get("limit")),
    sort: (searchParams.get("sort") as SortOption) ?? undefined,
    minPrice: parseNumber(searchParams.get("minPrice")),
    maxPrice: parseNumber(searchParams.get("maxPrice")),
    minRating: parseNumber(searchParams.get("minRating")),
    discountOnly: parseBoolean(searchParams.get("discountOnly")),
    search: searchParams.get("search") ?? undefined,
  };

  return NextResponse.json(queryProducts(params));
}
