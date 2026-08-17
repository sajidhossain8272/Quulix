import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type HeroBannerFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    image?: string;
    alt?: string | null;
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  };
};

export function HeroBannerForm({
  title,
  description,
  submitLabel,
  action,
  defaultValues,
}: HeroBannerFormProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/banners" className="text-gray-400 transition-colors hover:text-black">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <form action={action} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Banner image</h2>
            <p className="mt-1 text-sm text-gray-500">Use an image URL. Leave all content fields blank for an image-only banner.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image URL</label>
            <input name="image" type="url" required defaultValue={defaultValues?.image} placeholder="https://…" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image alt text</label>
            <input name="alt" defaultValue={defaultValues?.alt ?? ""} placeholder="Describe the banner image" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
          </div>
        </section>

        <section className="space-y-4 border-t border-gray-100 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Optional overlay content</h2>
            <p className="mt-1 text-sm text-gray-500">Adding any of these fields adds a subtle blurred backdrop only behind the content.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Eyebrow</label>
              <input name="eyebrow" defaultValue={defaultValues?.eyebrow ?? ""} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Heading</label>
              <input name="title" defaultValue={defaultValues?.title ?? ""} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows={3} defaultValue={defaultValues?.description ?? ""} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button label</label>
              <input name="ctaLabel" defaultValue={defaultValues?.ctaLabel ?? ""} placeholder="Shop the collection" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button destination</label>
              <input name="ctaHref" defaultValue={defaultValues?.ctaHref ?? ""} placeholder="/category/headphones" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-40 space-y-2">
            <label className="text-sm font-medium text-gray-700">Display order</label>
            <input name="sortOrder" type="number" min="0" defaultValue={defaultValues?.sortOrder ?? 0} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black" />
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
            <input name="isActive" type="checkbox" defaultChecked={defaultValues?.isActive ?? true} className="h-4 w-4" />
            Show this banner
          </label>
        </section>

        <button type="submit" className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-900">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
