"use client";

import { useQuery } from "@tanstack/react-query";

import { categoriesQueryOptions } from "@/services/api/catalog";

export function useCategories() {
  return useQuery(categoriesQueryOptions());
}
