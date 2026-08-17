/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { ProductCard } from "@/components/products/product-card";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { Container } from "@/components/shared/container";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatCurrency } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

function getSpotlight(productDate: string | Date, rating: number, reviewCount: number) {
  const createdAt = new Date(productDate);
  const daysSinceLaunch =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceLaunch <= 30) {
    return {
      label: "New arrival",
      className: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (rating >= 4.8 || reviewCount >= 300) {
    return {
      label: "Hot pick",
      className: "border border-rose-200 bg-rose-50 text-rose-700",
    };
  }

  return null;
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({ select: { slug: true } });
    return products.map((product) => ({ slug: product.slug }));
  } catch (error) {
    console.error("Failed to fetch products for static generation:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { media: { where: { type: "IMAGE" }, take: 1 } },
  });

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  const imageUrl = product.media[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80";

  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description || undefined,
    keywords: product.metaKeywords || undefined,
    openGraph: {
      title: product.metaTitle || product.title,
      description: product.metaDescription || product.description || undefined,
      images: [{ url: imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const productData = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      media: { orderBy: { position: 'asc' } },
      variants: true,
    }
  });

  if (!productData) {
    notFound();
  }

  const relatedData = await prisma.product.findMany({
    where: {
      categoryId: productData.categoryId,
      id: { not: productData.id }
    },
    take: 4,
    include: {
      category: true,
      media: { where: { type: "IMAGE" }, take: 1 }
    }
  });

  // Map to the frontend type expected by components
  const product: any = {
    id: productData.id,
    slug: productData.slug,
    title: productData.title,
    description: productData.description,
    category: productData.category.slug,
    categoryName: productData.category.name,
    price: productData.price,
    originalPrice: productData.originalPrice || productData.price,
    discountPercentage: productData.originalPrice ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) : 0,
    rating: productData.rating,
    reviewCount: productData.reviewCount,
    image: productData.media[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    tags: productData.tags,
    inventory: productData.inventory,
    featuredCollections: productData.featuredCollections as any,
    createdAt: productData.createdAt.toISOString(),
  };

  const relatedProducts: any[] = relatedData.map(rp => ({
    id: rp.id,
    slug: rp.slug,
    title: rp.title,
    description: rp.description,
    category: rp.category.slug,
    categoryName: rp.category.name,
    price: rp.price,
    originalPrice: rp.originalPrice || rp.price,
    discountPercentage: rp.originalPrice ? Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100) : 0,
    rating: rp.rating,
    reviewCount: rp.reviewCount,
    image: rp.media[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    tags: rp.tags,
    inventory: rp.inventory,
    featuredCollections: rp.featuredCollections as any,
    createdAt: rp.createdAt.toISOString(),
  }));

  const spotlight = getSpotlight(
    product.createdAt,
    product.rating,
    product.reviewCount,
  );

  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="transition hover:text-stone-950">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/category/${product.category}`} className="transition hover:text-stone-950">
            {product.categoryName}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-stone-900">{product.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
          <section className="space-y-4">
            <ProductGallery
              title={product.title}
              media={productData.media.map((item) => ({
                id: item.id,
                type: item.type,
                url: item.url,
                alt: item.alt,
              }))}
              fallbackImage={product.image}
              discountPercentage={product.discountPercentage}
              spotlight={spotlight}
            />

            <div className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Product overview
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-stone-50 p-4">
                  <p className="text-sm font-medium text-stone-950">Everyday value</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    This product saves you {formatCurrency(product.originalPrice - product.price)} against the original price.
                  </p>
                </div>
                <div className="rounded-[24px] bg-stone-50 p-4">
                  <p className="text-sm font-medium text-stone-950">Designed for</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                {product.categoryName}
              </p>
              <h1 className="mt-3 font-display text-4xl tracking-tight text-stone-950 sm:text-5xl">
                {product.title}
              </h1>
              <RatingStars className="mt-4" rating={product.rating} reviewCount={product.reviewCount} />
              <p className="mt-5 text-sm leading-7 text-stone-600 sm:text-base">
                {product.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-600">
                {product.featuredCollections.map((collection: string) => (
                  <span
                    key={collection}
                    className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 font-medium capitalize"
                  >
                    {collection.replace("-", " ")}
                  </span>
                ))}
                <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 font-medium">
                  {product.inventory > 10 ? "Ready to ship" : `Only ${product.inventory} left`}
                </span>
              </div>
            </div>

            <ProductPurchasePanel product={product} />
          </section>
        </div>
      </Container>

      {relatedProducts.length ? (
        <Container className="pt-12 sm:pt-16">
          <section className="space-y-5">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                You may also like
              </p>
              <h2 className="font-display text-3xl tracking-tight text-stone-950">
                More from {product.categoryName}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        </Container>
      ) : null}
    </main>
  );
}
