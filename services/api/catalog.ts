import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type {
  CategoriesResponse,
  HomeResponse,
  ProductQueryParams,
  ProductsResponse,
} from "@/lib/types";
import { buildSearchParams } from "@/lib/utils";
import { apiClient } from "@/services/api/client";

export function fetchHome() {
  return apiClient<HomeResponse>("/api/home");
}

export function fetchCategories() {
  return apiClient<CategoriesResponse>("/api/categories");
}

export function fetchProducts(params: ProductQueryParams) {
  const query = buildSearchParams({
    category: params.category,
    collection: params.collection,
    page: params.page,
    limit: params.limit,
    sort: params.sort,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minRating: params.minRating,
    discountOnly: params.discountOnly,
    search: params.search,
  });

  return apiClient<ProductsResponse>(`/api/products${query ? `?${query}` : ""}`);
}

export const homeQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.home,
    queryFn: fetchHome,
    staleTime: 1000 * 60 * 10,
  });

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

export const productsQueryOptions = (params: ProductQueryParams) =>
  queryOptions({
    queryKey: queryKeys.products(params),
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 60 * 5,
  });
