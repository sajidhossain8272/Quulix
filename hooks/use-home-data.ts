"use client";

import { useQuery } from "@tanstack/react-query";

import { homeQueryOptions } from "@/services/api/catalog";

export function useHomeData() {
  return useQuery(homeQueryOptions());
}
