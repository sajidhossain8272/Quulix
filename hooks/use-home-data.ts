"use client";

import { useQuery } from "@tanstack/react-query";

import { homeQueryOptions } from "@/services/api/catalog";
import type { HomeResponse } from "@/lib/types";

export function useHomeData(options?: { initialData?: HomeResponse }) {
  return useQuery({
    ...homeQueryOptions(),
    initialData: options?.initialData,
  });
}
