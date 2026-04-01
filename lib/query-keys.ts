import type { ProductQueryParams } from "@/lib/types";

export const queryKeys = {
  home: ["home"] as const,
  categories: ["categories"] as const,
  products: (params: ProductQueryParams) => ["products", params] as const,
};
