import Link from "next/link";
import { notFound } from "next/navigation";

import {
  createCategoryAndMoveProductsAction,
  deleteCategoryAction,
  moveCategoryProductsAction,
  updateCategoryAction,
} from "@/lib/admin/category-actions";
import { prisma } from "@/lib/prisma";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { id },
      include: { products: { select: { id: true, title: true, slug: true }, take: 12, orderBy: { title: "asc" } }, _count: { select: { products: true } } },
    }),
    prisma.category.findMany({ where: { isSystem: false }, orderBy: { name: "asc" } }),
  ]);
  if (!category || category.isSystem) notFound();

  const hasProducts = category._count.products > 0;
  const alternatives = categories.filter((item) => item.id !== category.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/admin/categories" className="text-sm font-medium text-gray-500 hover:text-black">← Categories</Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Edit category</h1>
      </div>

      {hasProducts ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">This category has {category._count.products} associated product{category._count.products === 1 ? "" : "s"}.</p>
          <p className="mt-1">Changing its name or URL can affect every assigned product. Create a replacement category and move products first, then update this category only after it is empty.</p>
        </div>
      ) : null}

      <form action={updateCategoryAction.bind(null, category.id)} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input name="name" required defaultValue={category.name} readOnly={hasProducts} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none read-only:bg-gray-100" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input name="slug" required defaultValue={category.slug} readOnly={hasProducts} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none read-only:bg-gray-100" />
          </div>
        </div>
        <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Tagline</label><input name="tagline" defaultValue={category.tagline ?? ""} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" /></div>
        <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Description</label><textarea name="description" rows={3} defaultValue={category.description ?? ""} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" /></div>
        <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Category image URL</label><input name="image" type="url" defaultValue={category.image ?? ""} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" /></div>
        <details className="border-t border-gray-100 pt-5"><summary className="cursor-pointer text-sm font-semibold text-gray-700">SEO metadata</summary><div className="mt-4 space-y-4"><input name="metaTitle" defaultValue={category.metaTitle ?? ""} placeholder="Meta title" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none" /><textarea name="metaDescription" rows={2} defaultValue={category.metaDescription ?? ""} placeholder="Meta description" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none" /><input name="metaKeywords" defaultValue={category.metaKeywords ?? ""} placeholder="Meta keywords" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none" /></div></details>
        <button type="submit" className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-900">Save category details</button>
      </form>

      {hasProducts ? (
        <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div><h2 className="text-lg font-semibold text-gray-900">Move associated products</h2><p className="mt-1 text-sm text-gray-500">The first 12 products are shown below. Each action moves all {category._count.products} associated products.</p></div>
          <ul className="grid gap-2 sm:grid-cols-2">{category.products.map((product) => <li key={product.id} className="truncate rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{product.title}</li>)}</ul>
          <form action={moveCategoryProductsAction.bind(null, category.id)} className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
            <select name="targetCategoryId" required className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 outline-none"><option value="">Choose an existing category</option>{alternatives.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">Move all products</button>
          </form>
          <form action={createCategoryAndMoveProductsAction.bind(null, category.id)} className="grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-[1fr_1fr_auto]">
            <input name="newCategoryName" required placeholder="New category name" className="rounded-lg border border-gray-200 px-3 py-2 outline-none" />
            <input name="newCategorySlug" placeholder="New category slug (optional)" className="rounded-lg border border-gray-200 px-3 py-2 outline-none" />
            <button type="submit" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">Create & move all</button>
          </form>
        </section>
      ) : null}

      <section className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="font-semibold text-red-950">Delete category</h2>
        <p className="mt-1 text-sm text-red-800">{hasProducts ? "Products must be moved before the category can be deleted." : "This category has no products and can be removed."}</p>
        <form action={deleteCategoryAction.bind(null, category.id)} className="mt-4 flex flex-col gap-3 sm:flex-row">
          {hasProducts ? <select name="deleteTargetCategoryId" required className="min-w-0 flex-1 rounded-lg border border-red-200 bg-white px-3 py-2 outline-none"><option value="">Move products before deleting</option>{alternatives.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}<option value="__uncategorized">Uncategorized (hidden holding area)</option></select> : null}
          <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Delete category</button>
        </form>
      </section>
    </div>
  );
}
