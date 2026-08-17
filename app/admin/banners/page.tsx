import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";

import { deleteBannerAction } from "@/lib/admin/banner-actions";
import { prisma } from "@/lib/prisma";

export default async function BannersPage() {
  const banners = await prisma.heroBanner.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Hero banners</h1>
          <p className="mt-1 text-sm text-gray-500">Manage storefront banners, copy, CTA, order, and visibility.</p>
        </div>
        <Link href="/admin/banners/new" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-900">
          <Plus className="h-4 w-4" />
          Add banner
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[540px]">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Banner</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.length ? banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50/50">
                  <td className="max-w-md px-6 py-4">
                    <p className="truncate font-medium text-gray-900">{banner.title || banner.alt || "Image-only banner"}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{banner.image}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{banner.sortOrder}</td>
                  <td className="px-6 py-4">
                    <span className={banner.isActive ? "rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700" : "rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"}>
                      {banner.isActive ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/banners/${banner.id}/edit`} className="text-gray-400 transition-colors hover:text-black" aria-label={`Edit ${banner.title || "banner"}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                      <form action={deleteBannerAction}>
                        <input type="hidden" name="id" value={banner.id} />
                        <button type="submit" className="text-gray-400 transition-colors hover:text-red-600" aria-label={`Delete ${banner.title || "banner"}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">No banners yet. Add one to show it on the storefront.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
