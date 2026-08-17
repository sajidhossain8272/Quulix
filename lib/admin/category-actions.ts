"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function revalidateCategoryPages() {
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

async function getUncategorizedCategory() {
  return prisma.category.upsert({
    where: { slug: "uncategorized" },
    update: { isSystem: true },
    create: {
      slug: "uncategorized",
      name: "Uncategorized",
      description: "Products waiting for an admin category assignment.",
      isSystem: true,
    },
  });
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category || category.isSystem) throw new Error("Category not found.");

  const name = (formData.get("name") as string).trim();
  const slug = ((formData.get("slug") as string).trim() || slugify(name));
  if (!name || !slug) throw new Error("A category name and slug are required.");

  if (
    category._count.products > 0 &&
    (name !== category.name || slug !== category.slug)
  ) {
    throw new Error("Move products to a replacement category before changing this category’s name or slug.");
  }

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      tagline: (formData.get("tagline") as string).trim() || null,
      description: (formData.get("description") as string).trim() || null,
      image: (formData.get("image") as string).trim() || null,
      metaTitle: (formData.get("metaTitle") as string).trim() || null,
      metaDescription: (formData.get("metaDescription") as string).trim() || null,
      metaKeywords: (formData.get("metaKeywords") as string).trim() || null,
    },
  });

  revalidateCategoryPages();
  redirect("/admin/categories");
}

export async function moveCategoryProductsAction(id: string, formData: FormData) {
  await requireAdmin();
  const targetCategoryId = formData.get("targetCategoryId") as string;
  if (!targetCategoryId || targetCategoryId === id) throw new Error("Choose a different destination category.");

  const target = await prisma.category.findFirst({
    where: { id: targetCategoryId, isSystem: false },
  });
  if (!target) throw new Error("Destination category not found.");

  await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: target.id } });
  revalidateCategoryPages();
  revalidatePath(`/admin/categories/${id}/edit`);
  redirect(`/admin/categories/${id}/edit`);
}

export async function createCategoryAndMoveProductsAction(id: string, formData: FormData) {
  await requireAdmin();
  const source = await prisma.category.findUnique({ where: { id } });
  if (!source || source.isSystem) throw new Error("Category not found.");

  const name = (formData.get("newCategoryName") as string).trim();
  const slug = ((formData.get("newCategorySlug") as string).trim() || slugify(name));
  if (!name || !slug) throw new Error("A replacement category name is required.");

  const target = await prisma.$transaction(async (tx) => {
    const created = await tx.category.create({
      data: {
        name,
        slug,
        description: source.description,
        tagline: source.tagline,
        image: source.image,
        metaTitle: source.metaTitle,
        metaDescription: source.metaDescription,
        metaKeywords: source.metaKeywords,
      },
    });
    await tx.product.updateMany({ where: { categoryId: source.id }, data: { categoryId: created.id } });
    return created;
  });

  revalidateCategoryPages();
  redirect(`/admin/categories/${target.id}/edit`);
}

export async function deleteCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category || category.isSystem) throw new Error("Category not found.");

  if (category._count.products) {
    const choice = formData.get("deleteTargetCategoryId") as string;
    const target = choice === "__uncategorized"
      ? await getUncategorizedCategory()
      : await prisma.category.findFirst({ where: { id: choice, isSystem: false } });
    if (!target || target.id === category.id) throw new Error("Choose where to move the associated products.");

    await prisma.$transaction([
      prisma.product.updateMany({ where: { categoryId: category.id }, data: { categoryId: target.id } }),
      prisma.category.delete({ where: { id: category.id } }),
    ]);
  } else {
    await prisma.category.delete({ where: { id: category.id } });
  }

  revalidateCategoryPages();
  redirect("/admin/categories");
}
