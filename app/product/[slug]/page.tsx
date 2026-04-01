import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { Container } from "@/components/shared/container";
import { RatingStars } from "@/components/shared/rating-stars";
import { getAllProducts, getCategoryBySlug, getProductBySlug, getRelatedProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function getSpotlight(productDate: string, rating: number, reviewCount: number) {
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
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.category);
  const relatedProducts = getRelatedProducts(product, 4);
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
            {category?.name ?? product.categoryName}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-stone-900">{product.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
          <section className="space-y-4">
            <div className="relative overflow-hidden rounded-[36px] border border-stone-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(216,224,230,0.5),transparent_30%)]" />
              <div className="relative aspect-[4/4.4] sm:aspect-[4/4.1]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-cover"
                />
              </div>
              {product.discountPercentage > 0 ? (
                <span className="absolute left-5 top-5 rounded-full bg-stone-950/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                  Save {product.discountPercentage}%
                </span>
              ) : null}
              {spotlight ? (
                <span className={`absolute right-5 top-5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] ${spotlight.className}`}>
                  {spotlight.label}
                </span>
              ) : null}
            </div>

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
                    {product.tags.map((tag) => (
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
                {product.featuredCollections.map((collection) => (
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
                More from {category?.name ?? product.categoryName}
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
