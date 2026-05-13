import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { Container } from "@/components/shared/container";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

const CategoryPageClient = dynamic(
  () =>
    import("@/features/category/category-page-client").then(
      (module) => module.CategoryPageClient,
    ),
  {
    loading: () => (
      <Container className="space-y-8 py-8">
        <div className="min-h-[220px] animate-pulse rounded-[32px] bg-stone-200" />
        <SectionSkeleton cards={4} />
      </Container>
    ),
  },
);

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return ["all", ...categories.map((c) => c.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "all") {
    return {
      title: "All Categories - KinooBD",
      description: "Browse the full KinooBD catalog with filters, sorting, and pagination.",
    };
  }

  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    return {
      title: "Category not found",
    };
  }

  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || category.description || undefined,
    keywords: category.metaKeywords || undefined,
    openGraph: {
      title: category.metaTitle || category.name,
      description: category.metaDescription || category.description || undefined,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (slug !== "all") {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) notFound();
  }

  return <CategoryPageClient slug={slug} initialSearchParams={resolvedSearchParams} />;
}
