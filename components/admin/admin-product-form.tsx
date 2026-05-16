import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductMediaManager } from "@/components/admin/product-media-manager";
import type { ProductMediaInput } from "@/lib/admin/product-media";

type CategoryOption = {
  id: string;
  name: string;
};

type AdminProductFormProps = {
  title: string;
  description: string;
  backHref?: string;
  submitLabel: string;
  categories: CategoryOption[];
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    originalPrice?: number | null;
    inventory?: number;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
    media?: ProductMediaInput[];
  };
};

export function AdminProductForm({
  title,
  description,
  backHref = "/admin/products",
  submitLabel,
  categories,
  action,
  defaultValues,
}: AdminProductFormProps) {
  const initialMedia: ProductMediaInput[] =
    defaultValues?.media?.map((item) => ({
      id: item.id,
      type: item.type,
      url: item.url,
      alt: item.alt,
      position: item.position,
    })) ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="text-gray-400 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <form action={action} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">
              General information
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                name="title"
                required
                defaultValue={defaultValues?.title}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Slug (optional)
              </label>
              <input
                name="slug"
                defaultValue={defaultValues?.slug}
                placeholder="auto-generated if empty"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={6}
                defaultValue={defaultValues?.description}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Media</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload multiple images and add product videos. The first image is
                used as the catalog thumbnail.
              </p>
            </div>
            <ProductMediaManager initialMedia={initialMedia} />
          </div>

          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">SEO metadata</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Meta title
              </label>
              <input
                name="metaTitle"
                defaultValue={defaultValues?.metaTitle ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Meta description
              </label>
              <textarea
                name="metaDescription"
                rows={2}
                defaultValue={defaultValues?.metaDescription ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Meta keywords
              </label>
              <input
                name="metaKeywords"
                defaultValue={defaultValues?.metaKeywords ?? ""}
                placeholder="comma, separated, keywords"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">
              Pricing & inventory
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price (TK)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={defaultValues?.price}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Compare at price (TK)
              </label>
              <input
                name="originalPrice"
                type="number"
                step="0.01"
                defaultValue={defaultValues?.originalPrice ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Base inventory
              </label>
              <input
                name="inventory"
                type="number"
                required
                defaultValue={defaultValues?.inventory ?? 0}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Organization</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="categoryId"
                required
                defaultValue={defaultValues?.categoryId}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-900"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
