"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_DELIVERY_INSIDE_DHAKA,
  DEFAULT_DELIVERY_OUTSIDE_DHAKA,
} from "@/lib/shop-settings";

export async function updateShopSettingsAction(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const insideDhaka = parseFloat(
    formData.get("deliveryChargeInsideDhaka") as string,
  );
  const outsideDhaka = parseFloat(
    formData.get("deliveryChargeOutsideDhaka") as string,
  );

  if (
    !Number.isFinite(insideDhaka) ||
    !Number.isFinite(outsideDhaka) ||
    insideDhaka < 0 ||
    outsideDhaka < 0
  ) {
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

export async function getAdminShopSettings() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const settings = await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      deliveryChargeInsideDhaka: DEFAULT_DELIVERY_INSIDE_DHAKA,
      deliveryChargeOutsideDhaka: DEFAULT_DELIVERY_OUTSIDE_DHAKA,
    },
  });

  return settings;
}
