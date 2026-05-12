import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";

async function createProduct(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const price = parseFloat(formData.get("price") as string);
  const originalPrice = formData.get("originalPrice") ? parseFloat(formData.get("originalPrice") as string) : null;
  const inventory = parseInt(formData.get("inventory") as string, 10);

  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const metaKeywords = formData.get("metaKeywords") as string;

  const mainImage = formData.get("mainImage") as string;

  const product = await prisma.product.create({
    data: {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      description,
      categoryId,
      price,
      originalPrice,
      inventory,
      metaTitle,
      metaDescription,
      metaKeywords,
    },
  });

  if (mainImage) {
    await prisma.productMedia.create({
      data: {
        productId: product.id,
        url: mainImage,
        type: "IMAGE",
        position: 0,
      }
    });
  }

  redirect("/admin/products");
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-gray-400 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Product</h1>
          <p className="mt-1 text-sm text-gray-500">Add a new product to your catalog.</p>
        </div>
      </div>

      <form action={createProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">General Information</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input name="title" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Slug (optional)</label>
              <input name="slug" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="auto-generated if empty" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" required rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Media</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Main Image URL</label>
              <input name="mainImage" type="url" placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
              <p className="text-xs text-gray-500">You can add more images and variants after creating the product.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">SEO Metadata</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Meta Title</label>
              <input name="metaTitle" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Meta Description</label>
              <textarea name="metaDescription" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Meta Keywords</label>
              <input name="metaKeywords" placeholder="comma, separated, keywords" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Pricing & Inventory</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price ($)</label>
              <input name="price" type="number" step="0.01" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Compare at Price ($)</label>
              <input name="originalPrice" type="number" step="0.01" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Base Inventory</label>
              <input name="inventory" type="number" required defaultValue="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Organization</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select name="categoryId" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <button type="submit" className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors">
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
