"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

function optionalValue(formData: FormData, field: string) {
  return (formData.get(field) as string | null)?.trim() || null;
}

function readBannerFields(formData: FormData) {
  const image = optionalValue(formData, "image");
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const ctaLabel = optionalValue(formData, "ctaLabel");
  const ctaHref = optionalValue(formData, "ctaHref");

  if (!image) throw new Error("A banner image is required.");
  if ((ctaLabel && !ctaHref) || (!ctaLabel && ctaHref)) {
    throw new Error("Enter both the button label and destination, or leave both blank.");
  }

  return {
    image,
    alt: optionalValue(formData, "alt"),
    eyebrow: optionalValue(formData, "eyebrow"),
    title: optionalValue(formData, "title"),
    description: optionalValue(formData, "description"),
    ctaLabel,
    ctaHref,
    sortOrder: Number.isFinite(sortOrder) ? Math.max(0, Math.trunc(sortOrder)) : 0,
    isActive: formData.get("isActive") === "on",
  };
}

function revalidateBannerPages() {
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function createBannerAction(formData: FormData) {
  await requireAdmin();
  await prisma.heroBanner.create({ data: readBannerFields(formData) });
  revalidateBannerPages();
  redirect("/admin/banners");
}

export async function updateBannerAction(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.heroBanner.update({ where: { id }, data: readBannerFields(formData) });
  revalidateBannerPages();
  redirect("/admin/banners");
}

export async function deleteBannerAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("Banner not found.");
  await prisma.heroBanner.delete({ where: { id } });
  revalidateBannerPages();
}
