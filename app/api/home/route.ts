import { NextResponse } from "next/server";

import { getHomeContent } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json(getHomeContent());
}
