"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STORE_SETTINGS, getShopSettings } from "@/lib/shop-settings";

async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
}

export async function getAdminShopSettings() {
  await requireAdmin();
  return getShopSettings();
}

export async function updateGeneralSettingsAction(formData: FormData) {
  await requireAdmin();

  const storeName = (formData.get("storeName") as string)?.trim() || DEFAULT_STORE_SETTINGS.storeName;
  const tagline = (formData.get("tagline") as string)?.trim() || DEFAULT_STORE_SETTINGS.tagline;
  const logoUrl = (formData.get("logoUrl") as string)?.trim() || DEFAULT_STORE_SETTINGS.logoUrl;
  const logoWhiteUrl = (formData.get("logoWhiteUrl") as string)?.trim() || DEFAULT_STORE_SETTINGS.logoWhiteUrl;
  const faviconUrl = (formData.get("faviconUrl") as string)?.trim() || DEFAULT_STORE_SETTINGS.faviconUrl;

  const supportEmail = (formData.get("supportEmail") as string)?.trim() || DEFAULT_STORE_SETTINGS.supportEmail;
  const supportPhone = (formData.get("supportPhone") as string)?.trim() || DEFAULT_STORE_SETTINGS.supportPhone;
  const studioAddress = (formData.get("studioAddress") as string)?.trim() || DEFAULT_STORE_SETTINGS.studioAddress;

  const announcementText1 = (formData.get("announcementText1") as string)?.trim() || DEFAULT_STORE_SETTINGS.announcementText1;
  const announcementText2 = (formData.get("announcementText2") as string)?.trim() || DEFAULT_STORE_SETTINGS.announcementText2;
  const announcementText3 = (formData.get("announcementText3") as string)?.trim() || DEFAULT_STORE_SETTINGS.announcementText3;
  const isAnnouncementActive = formData.get("isAnnouncementActive") === "on" || formData.get("isAnnouncementActive") === "true";

  const facebookUrl = (formData.get("facebookUrl") as string)?.trim() || DEFAULT_STORE_SETTINGS.facebookUrl;
  const instagramUrl = (formData.get("instagramUrl") as string)?.trim() || DEFAULT_STORE_SETTINGS.instagramUrl;
  const youtubeUrl = (formData.get("youtubeUrl") as string)?.trim() || DEFAULT_STORE_SETTINGS.youtubeUrl;
  const twitterUrl = (formData.get("twitterUrl") as string)?.trim() || DEFAULT_STORE_SETTINGS.twitterUrl;

  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {
      deliveryChargeInsideDhaka: DEFAULT_STORE_SETTINGS.deliveryChargeInsideDhaka,
      deliveryChargeOutsideDhaka: DEFAULT_STORE_SETTINGS.deliveryChargeOutsideDhaka,
    },
    create: {
      id: "default",
      deliveryChargeInsideDhaka: DEFAULT_STORE_SETTINGS.deliveryChargeInsideDhaka,
      deliveryChargeOutsideDhaka: DEFAULT_STORE_SETTINGS.deliveryChargeOutsideDhaka,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function updateShowcaseBannerAction(formData: FormData) {
  await requireAdmin();

  const showcaseImage = (formData.get("showcaseImage") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseImage;
  const showcaseBadge = (formData.get("showcaseBadge") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseBadge;
  const showcaseEyebrow = (formData.get("showcaseEyebrow") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseEyebrow;
  const showcaseTitle = (formData.get("showcaseTitle") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseTitle;
  const showcaseDescription = (formData.get("showcaseDescription") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseDescription;
  const showcaseBtn1Label = (formData.get("showcaseBtn1Label") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseBtn1Label;
  const showcaseBtn1Href = (formData.get("showcaseBtn1Href") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseBtn1Href;
  const showcaseBtn2Label = (formData.get("showcaseBtn2Label") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseBtn2Label;
  const showcaseBtn2Href = (formData.get("showcaseBtn2Href") as string)?.trim() || DEFAULT_STORE_SETTINGS.showcaseBtn2Href;

  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function updateDeliverySettingsAction(formData: FormData) {
  await requireAdmin();

  const insideDhaka = parseFloat(formData.get("deliveryChargeInsideDhaka") as string);
  const outsideDhaka = parseFloat(formData.get("deliveryChargeOutsideDhaka") as string);

  if (!Number.isFinite(insideDhaka) || !Number.isFinite(outsideDhaka) || insideDhaka < 0 || outsideDhaka < 0) {
    throw new Error("Delivery charges must be valid non-negative numbers.");
  }

  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {
      deliveryChargeInsideDhaka: insideDhaka,
      deliveryChargeOutsideDhaka: outsideDhaka,
    },
    create: {
      id: "default",
      deliveryChargeInsideDhaka: insideDhaka,
      deliveryChargeOutsideDhaka: outsideDhaka,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
}

export async function updatePoliciesAction(formData: FormData) {
  await requireAdmin();

  const termsAndConditions = (formData.get("termsAndConditions") as string) || DEFAULT_STORE_SETTINGS.termsAndConditions;
  const privacyPolicy = (formData.get("privacyPolicy") as string) || DEFAULT_STORE_SETTINGS.privacyPolicy;
  const shippingPolicy = (formData.get("shippingPolicy") as string) || DEFAULT_STORE_SETTINGS.shippingPolicy;
  const aboutUs = (formData.get("aboutUs") as string) || DEFAULT_STORE_SETTINGS.aboutUs;

  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
    },
  });

  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/shipping");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
}
