"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ProductQueryParams } from "@/lib/types";
import { productsQueryOptions } from "@/services/api/catalog";

type UseProductsOptions = {
  enabled?: boolean;
  preserveData?: boolean;
};

export function useProducts(
  params: ProductQueryParams,
  options: UseProductsOptions = {},
) {
  return useQuery({
    ...productsQueryOptions(params),
    enabled: options.enabled,
    placeholderData: options.preserveData ? keepPreviousData : undefined,
  });
}
