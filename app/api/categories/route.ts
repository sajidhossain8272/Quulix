import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json({
    data: categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description || "",
      tagline: cat.tagline || "",
      image: cat.image || "",
    }))
  });
}
