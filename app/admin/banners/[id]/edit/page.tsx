import { notFound } from "next/navigation";

import { HeroBannerForm } from "@/components/admin/hero-banner-form";
import { updateBannerAction } from "@/lib/admin/banner-actions";
import { prisma } from "@/lib/prisma";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const banner = await prisma.heroBanner.findUnique({ where: { id } });
  if (!banner) notFound();

  return (
    <HeroBannerForm
      title="Edit hero banner"
      description="Update the image, optional overlay content, CTA, order, or visibility."
      submitLabel="Save changes"
      action={updateBannerAction.bind(null, banner.id)}
      defaultValues={banner}
    />
  );
}
