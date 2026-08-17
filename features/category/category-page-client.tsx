"use client";

import { Loader2, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { ProductCard } from "@/components/products/product-card";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Pagination } from "@/components/ui/pagination";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import type { Product, SortOption } from "@/lib/types";
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

const DESKTOP_PAGE_SIZE = 16;
const MOBILE_BATCH_SIZE = 16;
const MOBILE_MAX_AUTO_SCROLL_PRODUCTS = 48; // Checkpoint after ~50 items to keep mobile memory ultra-fast

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readNumber(value: string | string[] | undefined) {
  const resolved = readValue(value);
  if (!resolved) return undefined;
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

  // Mobile Infinite Scroll Accumulated State
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const deferredSearch = useDeferredValue(search.trim());

  // Products Query with desktop size 16
  const productsQuery = useProducts(
    {
      category: slug,
      search: deferredSearch || undefined,
      sort,
      page,
      limit: DESKTOP_PAGE_SIZE,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      discountOnly,
    },
    { preserveData: true },
  );

  // Reset accumulated products when search, filters, or category changes
  useEffect(() => {
    if (page === 1 && productsQuery.data?.data) {
      setAccumulatedProducts(productsQuery.data.data);
    }
  }, [page, productsQuery.data?.data]);

  // Sync URL search params
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

  // Mobile Infinite Scroll Fetch Next Page Handler
  const handleLoadMoreMobile = useCallback(async () => {
    if (
      isLoadingMore ||
      !productsQuery.data?.pagination.hasMore ||
      accumulatedProducts.length >= MOBILE_MAX_AUTO_SCROLL_PRODUCTS
    ) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const query = buildSearchParams({
        category: slug,
        search: deferredSearch || undefined,
        sort,
        page: nextPage,
        limit: MOBILE_BATCH_SIZE,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        discountOnly: discountOnly ? "true" : undefined,
      });

      const res = await fetch(`/api/products?${query}`);
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setAccumulatedProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = json.data.filter(
            (p: Product) => !existingIds.has(p.id),
          );
          return [...prev, ...newItems];
        });
        setPage(nextPage);
      }
    } catch {
      // Ignore network errors gracefully
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    accumulatedProducts.length,
    deferredSearch,
    discountOnly,
    isLoadingMore,
    maxPrice,
    minPrice,
    minRating,
    page,
    productsQuery.data?.pagination.hasMore,
    slug,
    sort,
  ]);

  // IntersectionObserver for seamless Mobile Infinite Scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          productsQuery.data?.pagination.hasMore &&
          accumulatedProducts.length < MOBILE_MAX_AUTO_SCROLL_PRODUCTS
        ) {
          handleLoadMoreMobile();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    accumulatedProducts.length,
    handleLoadMoreMobile,
    productsQuery.data?.pagination.hasMore,
  ]);

  const category = categoriesQuery.data?.data.find(
    (item) => item.slug === slug,
  );
  const title =
    slug === "all" ? "All Categories" : (category?.name ?? "Catalog");
  const description =
    slug === "all"
      ? "Browse the full Quulix catalog with fast filters, 16 products per page, and mobile infinite scroll."
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
    setAccumulatedProducts([]);
  };

  const currentProducts =
    accumulatedProducts.length > 0
      ? accumulatedProducts
      : productsQuery.data?.data || [];

  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-6 sm:pt-8">
        <section className="overflow-hidden rounded-[28px] sm:rounded-[32px] border border-stone-200 bg-white/85 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
              Quulix Collection
            </p>
            <div className="space-y-2.5">
              <h1 className="font-display text-3xl tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-stone-600 sm:text-base">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-stone-500 pt-1">
              <span className="rounded-full bg-stone-100 px-3.5 py-1.5 font-medium text-stone-700">
                {productsQuery.data?.pagination.total ?? 0} products
              </span>
              <span className="rounded-full bg-stone-100 px-3.5 py-1.5 text-stone-600">
                {productsQuery.isFetching
                  ? "Refreshing catalog..."
                  : "Showing up to 16 per page"}
              </span>
            </div>
          </div>
        </section>
      </Container>

      <Container className="pt-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[28px] border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
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
                  setAccumulatedProducts([]);
                }}
                onMinPriceChange={(value) => {
                  setMinPrice(value.replace(/[^\d]/g, ""));
                  setPage(1);
                  setAccumulatedProducts([]);
                }}
                onMaxPriceChange={(value) => {
                  setMaxPrice(value.replace(/[^\d]/g, ""));
                  setPage(1);
                  setAccumulatedProducts([]);
                }}
                onMinRatingChange={(value) => {
                  setMinRating(value);
                  setPage(1);
                  setAccumulatedProducts([]);
                }}
                onDiscountChange={(value) => {
                  setDiscountOnly(value);
                  setPage(1);
                  setAccumulatedProducts([]);
                }}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Main Product Grid & Controls */}
          <section className="space-y-5">
            {/* Search & Sort Bar */}
            <div className="flex flex-col gap-3 rounded-[24px] sm:rounded-[28px] border border-stone-200 bg-white/90 p-3.5 sm:p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                    setAccumulatedProducts([]);
                  }}
                  placeholder="Search in this catalog..."
                  className="h-11 sm:h-12 w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-xs sm:text-sm outline-none transition focus:border-stone-400"
                />
              </div>
              <div className="flex gap-2.5">
                <Button
                  variant="secondary"
                  className="gap-2 lg:hidden h-11 sm:h-12 rounded-2xl text-xs sm:text-sm"
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
                    setAccumulatedProducts([]);
                  }}
                  className="h-11 sm:h-12 rounded-2xl border border-stone-200 bg-white px-3 sm:px-4 text-xs sm:text-sm outline-none transition focus:border-stone-400"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Feed */}
            {productsQuery.isLoading && currentProducts.length === 0 ? (
              <SectionSkeleton cards={8} />
            ) : productsQuery.isError ? (
              <ErrorState
                title="Category feed unavailable"
                description="The product API did not respond for this category request."
                onRetry={() => productsQuery.refetch()}
              />
            ) : currentProducts.length > 0 ? (
              <>
                {/* 16-Product Desktop Grid (4 cols on xl, 3 on sm/lg, 2 on mobile) */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                  {currentProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={index < 4}
                    />
                  ))}
                </div>

                {/* Mobile Infinite Scroll Sentinel & Loader */}
                <div className="lg:hidden">
                  <div ref={sentinelRef} className="h-6" />

                  {isLoadingMore && (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-stone-500">
                      <Loader2 className="h-5 w-5 animate-spin text-stone-800" />
                      <span>Loading more gear...</span>
                    </div>
                  )}

                  {/* Checkpoint pagination on mobile after 48-50 products to keep mobile speed instant */}
                  {accumulatedProducts.length >= MOBILE_MAX_AUTO_SCROLL_PRODUCTS &&
                  productsQuery.data?.pagination.hasMore ? (
                    <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
                      <p className="text-xs text-stone-500 mb-3">
                        Loaded 50 products for speed. Continue to next page?
                      </p>
                      <Button
                        onClick={() => {
                          const nextPage = page + 1;
                          setPage(nextPage);
                          setAccumulatedProducts([]);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full rounded-xl"
                      >
                        Next Page ({page + 1}) &rarr;
                      </Button>
                    </div>
                  ) : null}
                </div>

                {/* Desktop Pagination (Hidden on mobile for infinite scroll experience) */}
                <div className="hidden lg:block pt-4">
                  <Pagination
                    page={productsQuery.data?.pagination.page || page}
                    totalPages={productsQuery.data?.pagination.totalPages || 1}
                    isPending={isPending}
                    onPageChange={(nextPage) => {
                      setPage(nextPage);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </div>
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

      {/* Mobile Filters Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm transition lg:hidden",
          mobileFiltersOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileFiltersOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[32px] border border-stone-200 bg-white p-6 shadow-[0_-20px_60px_rgba(15,23,42,0.2)] transition-transform duration-300 lg:hidden",
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
            setAccumulatedProducts([]);
          }}
          onMinPriceChange={(value) => {
            setMinPrice(value.replace(/[^\d]/g, ""));
            setPage(1);
            setAccumulatedProducts([]);
          }}
          onMaxPriceChange={(value) => {
            setMaxPrice(value.replace(/[^\d]/g, ""));
            setPage(1);
            setAccumulatedProducts([]);
          }}
          onMinRatingChange={(value) => {
            setMinRating(value);
            setPage(1);
            setAccumulatedProducts([]);
          }}
          onDiscountChange={(value) => {
            setDiscountOnly(value);
            setPage(1);
            setAccumulatedProducts([]);
          }}
          onClear={clearFilters}
          onClose={() => setMobileFiltersOpen(false)}
        />
      </div>
    </main>
  );
}
