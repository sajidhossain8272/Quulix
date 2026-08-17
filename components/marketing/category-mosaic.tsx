import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import type { Category } from "@/lib/types";

type CategoryMosaicProps = {
  categories: Category[];
};

export function CategoryMosaic({ categories }: CategoryMosaicProps) {
  if (!categories.length) return null;

  return (
    <section className="bg-white py-12 sm:py-16">
      <Container>
        <div className="mb-8 flex items-center gap-5 sm:mb-10">
          <span className="h-px flex-1 bg-stone-200" />
          <h2 className="whitespace-nowrap text-center text-2xl font-light uppercase tracking-[0.08em] text-stone-900 sm:text-3xl">
            Shop by categories
          </h2>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-stone-100 sm:aspect-[5/5.15]"
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-stone-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent transition group-hover:from-black/60" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 text-center text-sm font-bold uppercase tracking-[0.03em] text-white backdrop-blur-sm sm:px-6 sm:py-3 sm:text-base">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
