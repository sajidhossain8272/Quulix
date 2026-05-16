import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

async function deleteProduct(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      media: {
        where: { type: "IMAGE" },
        take: 1,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your product catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Inventory</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.media[0]?.url ? (
                          <img src={product.media[0].url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.title}</div>
                        <div className="text-xs text-gray-400">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category.name}</td>
                  <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.inventory > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {product.inventory} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
