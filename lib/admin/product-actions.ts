"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  parseProductMediaPayload,
  syncProductMedia,
} from "@/lib/admin/product-media";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
}

function readProductFields(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const price = parseFloat(formData.get("price") as string);
  const originalPriceRaw = formData.get("originalPrice") as string;
  const inventory = parseInt(formData.get("inventory") as string, 10);
  const metaTitle = (formData.get("metaTitle") as string)?.trim() || null;
  const metaDescription =
    (formData.get("metaDescription") as string)?.trim() || null;
  const metaKeywords = (formData.get("metaKeywords") as string)?.trim() || null;
  const media = parseProductMediaPayload(formData.get("mediaPayload"));

  if (!title || !description || !categoryId || !Number.isFinite(price)) {
    throw new Error("Missing required product fields.");
  }

  return {
    title,
    slug: slugInput || slugify(title),
    description,
    categoryId,
    price,
    originalPrice: originalPriceRaw ? parseFloat(originalPriceRaw) : null,
    inventory: Number.isFinite(inventory) ? inventory : 0,
    metaTitle,
    metaDescription,
    metaKeywords,
    media,
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const fields = readProductFields(formData);

  const product = await prisma.product.create({
    data: {
      title: fields.title,
      slug: fields.slug,
      description: fields.description,
      categoryId: fields.categoryId,
      price: fields.price,
      originalPrice: fields.originalPrice,
      inventory: fields.inventory,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
      metaKeywords: fields.metaKeywords,
    },
  });

  if (fields.media.length) {
    await syncProductMedia(product.id, fields.media, []);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/product/${product.slug}`);
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireAdmin();
  const fields = readProductFields(formData);

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    include: { media: true },
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      title: fields.title,
      slug: fields.slug,
      description: fields.description,
      categoryId: fields.categoryId,
      price: fields.price,
      originalPrice: fields.originalPrice,
      inventory: fields.inventory,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
      metaKeywords: fields.metaKeywords,
    },
  });

  await syncProductMedia(product.id, fields.media, existing.media);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.id}/edit`);
  revalidatePath(`/product/${product.slug}`);
  if (existing.slug !== product.slug) {
    revalidatePath(`/product/${existing.slug}`);
  }

  redirect("/admin/products");
}

export async function getAdminProduct(idOrSlug: string) {
  await requireAdmin();

  return prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: true,
      media: { orderBy: { position: "asc" } },
    },
  });
}
