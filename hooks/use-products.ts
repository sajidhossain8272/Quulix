"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ProductQueryParams, ProductsResponse } from "@/lib/types";
import { productsQueryOptions } from "@/services/api/catalog";

type UseProductsOptions = {
  enabled?: boolean;
  preserveData?: boolean;
  initialData?: ProductsResponse;
};

export function useProducts(
  params: ProductQueryParams,
  options: UseProductsOptions = {},
) {
  return useQuery({
    ...productsQueryOptions(params),
    enabled: options.enabled,
    initialData: options.initialData,
    placeholderData: options.preserveData ? keepPreviousData : undefined,
  });
}
