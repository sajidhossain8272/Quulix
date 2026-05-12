import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, User, MapPin, Phone, StickyNote } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

async function updateOrderStatus(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const status = formData.get("status") as OrderStatus;

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="text-gray-400 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <form action={updateOrderStatus} className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <input type="hidden" name="id" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="text-sm font-medium outline-none bg-transparent"
          >
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button type="submit" className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
            Update
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product.title}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-500">
                        {item.variant.color && `Color: ${item.variant.color}`}
                        {item.variant.color && item.variant.size && ' | '}
                        {item.variant.size && `Size: ${item.variant.size}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="font-medium text-gray-900">Total (COD)</span>
              <span className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <User className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.address}
                    {order.city && <><br />{order.city}</>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Order Notes</h3>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
