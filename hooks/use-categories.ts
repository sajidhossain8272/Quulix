"use client";

import { useQuery } from "@tanstack/react-query";

import { categoriesQueryOptions } from "@/services/api/catalog";
import type { CategoriesResponse } from "@/lib/types";

export function useCategories(options?: { initialData?: CategoriesResponse }) {
  return useQuery({
    ...categoriesQueryOptions(),
    initialData: options?.initialData,
  });
}
