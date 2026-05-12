import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";

async function createCategory(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const tagline = formData.get("tagline") as string;
  const image = formData.get("image") as string;
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const metaKeywords = formData.get("metaKeywords") as string;

  await prisma.category.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      tagline,
      image,
      metaTitle,
      metaDescription,
      metaKeywords,
    },
  });

  redirect("/admin/categories");
}

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="text-gray-400 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Category</h1>
          <p className="mt-1 text-sm text-gray-500">Create a new product category.</p>
        </div>
      </div>

      <form action={createCategory} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input name="name" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug (optional)</label>
            <input name="slug" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="auto-generated if empty" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tagline</label>
          <input name="tagline" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Image URL</label>
          <input name="image" type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-6">
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

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors">
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
}
