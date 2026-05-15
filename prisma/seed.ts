import { PrismaClient } from "@prisma/client";
import { getAllProducts, getCategories } from "../lib/mock-data.ts";

const prisma = new PrismaClient();

async function main() {
  const categories = getCategories();

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        tagline: category.tagline,
        image: category.image,
      },
      create: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        tagline: category.tagline,
        image: category.image,
      },
    });
  }

  const categoryRows = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(
    categoryRows.map((row) => [row.slug, row.id]),
  );

  for (const product of getAllProducts()) {
    const categoryId = categoryIdBySlug.get(product.category);
    if (!categoryId) {
      throw new Error(`Missing category for product ${product.slug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        inventory: product.inventory,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags,
        featuredCollections: product.featuredCollections,
        categoryId,
        createdAt: new Date(product.createdAt),
      },
      create: {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        inventory: product.inventory,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags,
        featuredCollections: product.featuredCollections,
        categoryId,
        createdAt: new Date(product.createdAt),
        media: {
          create: {
            type: "IMAGE",
            url: product.image,
            alt: product.title,
            position: 0,
          },
        },
      },
    });

    const existingMedia = await prisma.productMedia.findFirst({
      where: { productId: product.id, position: 0 },
    });

    if (!existingMedia) {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          type: "IMAGE",
          url: product.image,
          alt: product.title,
          position: 0,
        },
      });
    }
  }

  console.log(
    `Seeded ${categories.length} categories and ${getAllProducts().length} products.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
