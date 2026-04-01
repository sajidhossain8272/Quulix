import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/shared/container";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { getCategories, getCategoryBySlug } from "@/lib/mock-data";

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
  return ["all", ...getCategories().map((category) => category.slug)].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "all") {
    return {
      title: "All Categories",
      description: "Browse the full Auralux Market catalog with filters, sorting, and pagination.",
    };
  }

  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category not found",
    };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (slug !== "all" && !getCategoryBySlug(slug)) {
    notFound();
  }

  return <CategoryPageClient slug={slug} initialSearchParams={resolvedSearchParams} />;
}
