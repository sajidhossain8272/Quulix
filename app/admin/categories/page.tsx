import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

async function deleteCategory(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your product categories.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Products</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4">{category.slug}</td>
                  <td className="px-6 py-4">{category._count.products}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={category.id} />
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
