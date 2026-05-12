/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, address, city, notes, items, totalAmount } = body;

    if (!customerName || !phone || !address || !items || !items.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process the COD order
    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        city,
        notes,
        totalAmount,
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
      { status: 500 }
    );
  }
}
