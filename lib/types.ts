export type ProductCollection = "best-deals" | "seasonal";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "discount-desc"
  | "newest";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tagline: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  inventory: number;
  featuredCollections: ProductCollection[];
  createdAt: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  alt: string;
};

export type HomeSectionSummary = {
  title: string;
  description: string;
  collection: ProductCollection;
};

export type ProductQueryParams = {
  category?: string;
  collection?: ProductCollection;
  page?: number;
  limit?: number;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  discountOnly?: boolean;
  search?: string;
};

export type ProductsResponse = {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  meta: {
    availablePriceRange: {
      min: number;
      max: number;
    };
  };
};

export type ProductDetailResponse = {
  data: Product;
  relatedProducts: Product[];
};

export type CategoriesResponse = {
  data: Category[];
};

export type HomeResponse = {
  heroSlides: HeroSlide[];
  sections: {
    bestDeals: HomeSectionSummary;
    seasonal: HomeSectionSummary;
  };
  featuredCategorySlugs: string[];
};
