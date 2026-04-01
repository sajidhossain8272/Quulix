import { NextResponse } from "next/server";

import { getCategories } from "@/lib/mock-data";
import type { CategoriesResponse } from "@/lib/types";

export function GET() {
  const response: CategoriesResponse = {
    data: getCategories(),
  };

  return NextResponse.json(response);
}
