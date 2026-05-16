"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useState, useTransition } from "react";

import { ProductCard } from "@/components/products/product-card";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import type { SortOption } from "@/lib/types";
import { buildSearchParams, cn } from "@/lib/utils";

type SearchParamRecord = Record<string, string | string[] | undefined>;

type CategoryPageClientProps = {
  slug: string;
  initialSearchParams: SearchParamRecord;
};

type FilterPanelProps = {
  search: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  discountOnly: boolean;
  isPending: boolean;
  availableRange?: { min: number; max: number };
  onSearchChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onMinRatingChange: (value: string) => void;
  onDiscountChange: (value: boolean) => void;
  onClear: () => void;
  onClose?: () => void;
};

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to high", value: "price-asc" },
  { label: "Price: High to low", value: "price-desc" },
  { label: "Highest rated", value: "rating-desc" },
  { label: "Biggest discount", value: "discount-desc" },
];

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readNumber(value: string | string[] | undefined) {
  const resolved = readValue(value);

  if (!resolved) {
    return undefined;
  }

  const number = Number(resolved);
  return Number.isFinite(number) ? number : undefined;
}

function FilterHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
          Refine catalog
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">Filters</h2>
      </div>
      {onClose ? (
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

function SearchFilter({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-stone-800">
        Search within this page
      </span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products"
          className="h-12 w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-stone-300"
        />
      </div>
    </label>
  );
}

function PriceRangeFilter({
  minPrice,
  maxPrice,
  availableRange,
  onMinPriceChange,
  onMaxPriceChange,
}: {
  minPrice: string;
  maxPrice: string;
  availableRange?: { min: number; max: number };
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-stone-800">Price range</p>
      <div className="grid grid-cols-2 gap-3">
        <input
          inputMode="numeric"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          placeholder={`Min${availableRange ? ` ${availableRange.min}` : ""}`}
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-stone-300"
        />
        <input
          inputMode="numeric"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          placeholder={`Max${availableRange ? ` ${availableRange.max}` : ""}`}
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-stone-300"
        />
      </div>
    </div>
  );
}

function RatingFilter({
  minRating,
  onMinRatingChange,
}: {
  minRating: string;
  onMinRatingChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-stone-800">Minimum rating</span>
      <select
        value={minRating}
        onChange={(event) => onMinRatingChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-stone-300"
      >
        <option value="">All ratings</option>
        <option value="4">4 stars & up</option>
        <option value="4.5">4.5 stars & up</option>
      </select>
    </label>
  );
}

function DiscountFilter({
  discountOnly,
  onDiscountChange,
}: {
  discountOnly: boolean;
  onDiscountChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-medium text-stone-900">Deals only</p>
        <p className="text-xs text-stone-500">Show discounted products</p>
      </div>
      <input
        type="checkbox"
        checked={discountOnly}
        onChange={(event) => onDiscountChange(event.target.checked)}
        className="h-4 w-4 rounded border-stone-300 text-stone-950 focus:ring-stone-900"
      />
    </label>
  );
}

function FilterActions({
  isPending,
  onClear,
  onClose,
}: {
  isPending: boolean;
  onClear: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" disabled={isPending} onClick={onClear}>
        Clear filters
      </Button>
      {onClose ? (
        <Button disabled={isPending} onClick={onClose}>
          View products
        </Button>
      ) : null}
    </div>
  );
}

function FiltersPanel({
  search,
  minPrice,
  maxPrice,
  minRating,
  discountOnly,
  isPending,
  availableRange,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinRatingChange,
  onDiscountChange,
  onClear,
  onClose,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <FilterHeader onClose={onClose} />
      <SearchFilter search={search} onSearchChange={onSearchChange} />
      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        availableRange={availableRange}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
      />
      <RatingFilter
        minRating={minRating}
        onMinRatingChange={onMinRatingChange}
      />
      <DiscountFilter
        discountOnly={discountOnly}
        onDiscountChange={onDiscountChange}
      />
      <FilterActions
        isPending={isPending}
        onClear={onClear}
        onClose={onClose}
      />
    </div>
  );
}

export function CategoryPageClient({
  slug,
  initialSearchParams,
}: CategoryPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const categoriesQuery = useCategories();

  const [search, setSearch] = useState(
    readValue(initialSearchParams.search) ?? "",
  );
  const [sort, setSort] = useState<SortOption>(
    (readValue(initialSearchParams.sort) as SortOption) ?? "featured",
  );
  const [page, setPage] = useState(readNumber(initialSearchParams.page) ?? 1);
  const [minPrice, setMinPrice] = useState(
    readValue(initialSearchParams.minPrice) ?? "",
  );
  const [maxPrice, setMaxPrice] = useState(
    readValue(initialSearchParams.maxPrice) ?? "",
  );
  const [minRating, setMinRating] = useState(
    readValue(initialSearchParams.minRating) ?? "",
  );
  const [discountOnly, setDiscountOnly] = useState(
    readValue(initialSearchParams.discountOnly) === "true",
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const deferredSearch = useDeferredValue(search.trim());

  const productsQuery = useProducts(
    {
      category: slug,
      search: deferredSearch || undefined,
      sort,
      page,
      limit: 4,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      discountOnly,
    },
    { preserveData: true },
  );

  useEffect(() => {
    const queryString = buildSearchParams({
      search: deferredSearch || undefined,
      sort: sort !== "featured" ? sort : undefined,
      page: page !== 1 ? page : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      discountOnly: discountOnly || undefined,
    });

    startTransition(() => {
      router.replace(
        `/category/${slug}${queryString ? `?${queryString}` : ""}`,
        {
          scroll: false,
        },
      );
    });
  }, [
    deferredSearch,
    discountOnly,
    maxPrice,
    minPrice,
    minRating,
    page,
    router,
    slug,
    sort,
  ]);

  const category = categoriesQuery.data?.data.find(
    (item) => item.slug === slug,
  );
  const title =
    slug === "all" ? "All Categories" : (category?.name ?? "Catalog");
  const description =
    slug === "all"
      ? "Browse the full Quulix catalog with mobile-first filters and dense product discovery."
      : (category?.description ??
        "Refined products curated for premium everyday routines.");

  const clearFilters = () => {
    setSearch("");
    setSort("featured");
    setPage(1);
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setDiscountOnly(false);
  };

  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-6 sm:pt-8">
        <section className="overflow-hidden rounded-[32px] border border-stone-200 bg-white/85 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
              Dynamic category page
            </p>
            <div className="space-y-3">
              <h1 className="font-display text-4xl tracking-tight text-stone-950 sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
              <span className="rounded-full bg-stone-100 px-4 py-2">
                {productsQuery.data?.pagination.total ?? 0} products
              </span>
              <span className="rounded-full bg-stone-100 px-4 py-2">
                {productsQuery.isFetching
                  ? "Refreshing catalog"
                  : "Cached via React Query"}
              </span>
            </div>
          </div>
        </section>
      </Container>

      <Container className="pt-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="rounded-[28px] border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <FiltersPanel
                search={search}
                minPrice={minPrice}
                maxPrice={maxPrice}
                minRating={minRating}
                discountOnly={discountOnly}
                isPending={isPending}
                availableRange={productsQuery.data?.meta.availablePriceRange}
                onSearchChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                onMinPriceChange={(value) => {
                  setMinPrice(value.replace(/[^\d]/g, ""));
                  setPage(1);
                }}
                onMaxPriceChange={(value) => {
                  setMaxPrice(value.replace(/[^\d]/g, ""));
                  setPage(1);
                }}
                onMinRatingChange={(value) => {
                  setMinRating(value);
                  setPage(1);
                }}
                onDiscountChange={(value) => {
                  setDiscountOnly(value);
                  setPage(1);
                }}
                onClear={clearFilters}
              />
            </div>
          </aside>

          <section className="space-y-5">
            <div className="flex flex-col gap-3 rounded-[28px] border border-stone-200 bg-white/90 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search this catalog"
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-stone-300"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="gap-2 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as SortOption);
                    setPage(1);
                  }}
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-stone-300"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {productsQuery.isLoading ? (
              <SectionSkeleton cards={4} />
            ) : productsQuery.isError ? (
              <ErrorState
                title="Category feed unavailable"
                description="The product API did not respond for this category request."
                onRetry={() => productsQuery.refetch()}
              />
            ) : productsQuery.data?.data.length ? (
              <>
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 xl:gap-5">
                  {productsQuery.data.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={productsQuery.data.pagination.page}
                  totalPages={productsQuery.data.pagination.totalPages}
                  isPending={isPending}
                  onPageChange={(nextPage) => setPage(nextPage)}
                />
              </>
            ) : (
              <EmptyState
                title="No products matched these filters"
                description="Adjust search, rating, or price controls to broaden the current query."
                actionLabel="Reset filters"
                onAction={clearFilters}
              />
            )}
          </section>
        </div>
      </Container>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-stone-950/35 transition lg:hidden",
          mobileFiltersOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileFiltersOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-[32px] border border-stone-200 bg-white p-5 shadow-[0_-20px_60px_rgba(15,23,42,0.15)] transition-transform duration-300 lg:hidden",
          mobileFiltersOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <FiltersPanel
          search={search}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minRating={minRating}
          discountOnly={discountOnly}
          isPending={isPending}
          availableRange={productsQuery.data?.meta.availablePriceRange}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onMinPriceChange={(value) => {
            setMinPrice(value.replace(/[^\d]/g, ""));
            setPage(1);
          }}
          onMaxPriceChange={(value) => {
            setMaxPrice(value.replace(/[^\d]/g, ""));
            setPage(1);
          }}
          onMinRatingChange={(value) => {
            setMinRating(value);
            setPage(1);
          }}
          onDiscountChange={(value) => {
            setDiscountOnly(value);
            setPage(1);
          }}
          onClear={clearFilters}
          onClose={() => setMobileFiltersOpen(false)}
        />
      </div>
    </main>
  );
}
