import { NextResponse } from "next/server";

import { getShopSettings } from "@/lib/shop-settings";

export async function GET() {
  const settings = await getShopSettings();

  return NextResponse.json({
    deliveryChargeInsideDhaka: settings.deliveryChargeInsideDhaka,
    deliveryChargeOutsideDhaka: settings.deliveryChargeOutsideDhaka,
  });
}
