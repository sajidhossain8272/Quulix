import { HeroBannerForm } from "@/components/admin/hero-banner-form";
import { createBannerAction } from "@/lib/admin/banner-actions";

export default function NewBannerPage() {
  return <HeroBannerForm title="New hero banner" description="Create a full-width storefront banner." submitLabel="Create banner" action={createBannerAction} />;
}
