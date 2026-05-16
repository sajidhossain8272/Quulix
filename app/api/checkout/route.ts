/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import type { DeliveryZone } from "@prisma/client";

import {
  getDeliveryChargeForZone,
  getShopSettings,
} from "@/lib/shop-settings";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      address,
      city,
      notes,
      items,
      deliveryZone,
      subtotal,
      deliveryCharge,
      totalAmount,
    } = body;

    if (
      !customerName ||
      !phone ||
      !address ||
      !items ||
      !items.length ||
      !deliveryZone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const settings = await getShopSettings();
    const expectedDeliveryCharge = getDeliveryChargeForZone(
      deliveryZone as DeliveryZone,
      settings,
    );

    const itemsSubtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0,
    );

    const normalizedSubtotal =
      typeof subtotal === "number" ? subtotal : itemsSubtotal;
    const normalizedDeliveryCharge =
      typeof deliveryCharge === "number"
        ? deliveryCharge
        : expectedDeliveryCharge;
    const normalizedTotal =
      typeof totalAmount === "number"
        ? totalAmount
        : normalizedSubtotal + normalizedDeliveryCharge;

    if (Math.abs(normalizedDeliveryCharge - expectedDeliveryCharge) > 0.01) {
      return NextResponse.json(
        { error: "Delivery charge does not match current shop settings." },
        { status: 400 },
      );
    }

    if (
      Math.abs(normalizedTotal - (normalizedSubtotal + normalizedDeliveryCharge)) >
      0.01
    ) {
      return NextResponse.json({ error: "Invalid order total." }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        city,
        notes,
        deliveryZone: deliveryZone as DeliveryZone,
        deliveryCharge: normalizedDeliveryCharge,
        subtotal: normalizedSubtotal,
        totalAmount: normalizedTotal,
        status: "PENDING",
        paymentMethod: "COD",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            productVariantId: item.variantId || null,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
