import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isSystem: false },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      {
        data: categories.map((cat) => ({
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description || "",
          tagline: cat.tagline || "",
          image: cat.image || "",
        })),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load categories.");
  }
}
