import type { DeliveryZone } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const DEFAULT_DELIVERY_INSIDE_DHAKA = 80;
export const DEFAULT_DELIVERY_OUTSIDE_DHAKA = 120;

export type ShopDeliverySettings = {
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
};

export async function getShopSettings(): Promise<ShopDeliverySettings> {
  const settings = await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      deliveryChargeInsideDhaka: DEFAULT_DELIVERY_INSIDE_DHAKA,
      deliveryChargeOutsideDhaka: DEFAULT_DELIVERY_OUTSIDE_DHAKA,
    },
  });

  return {
    deliveryChargeInsideDhaka: settings.deliveryChargeInsideDhaka,
    deliveryChargeOutsideDhaka: settings.deliveryChargeOutsideDhaka,
  };
}

export function getDeliveryChargeForZone(
  zone: DeliveryZone,
  settings: ShopDeliverySettings,
) {
  return zone === "INSIDE_DHAKA"
    ? settings.deliveryChargeInsideDhaka
    : settings.deliveryChargeOutsideDhaka;
}
