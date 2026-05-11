import type {
  Category,
  HeroSlide,
  HomeResponse,
  Product,
  ProductQueryParams,
  ProductsResponse,
  SortOption,
} from "@/lib/types";

type BaseProduct = Omit<Product, "categoryName" | "discountPercentage">;

const categories: Category[] = [
  {
    id: "cat-headphones",
    slug: "headphones",
    name: "Headphones",
    description:
      "Immersive over-ear and in-ear listening with travel-ready comfort.",
    tagline: "Focused listening, everywhere.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-speakers",
    slug: "speakers",
    name: "Speakers",
    description:
      "Room-filling sound systems and compact speakers with refined finishes.",
    tagline: "Sound that shapes the room.",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-wearables",
    slug: "wearables",
    name: "Wearables",
    description:
      "Smart essentials that keep health, movement, and music within reach.",
    tagline: "Data, motion, and comfort in sync.",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-workspace",
    slug: "workspace",
    name: "Workspace",
    description:
      "Clean desk technology for sharp calls, focused work, and studio sessions.",
    tagline: "Sharper desks, calmer flow.",
    image:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-wellness",
    slug: "wellness",
    name: "Wellness",
    description:
      "Sleep, recovery, and ambient devices designed to soften the day.",
    tagline: "Recovery that feels understated.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-travel",
    slug: "travel",
    name: "Travel",
    description:
      "Compact power, portable audio, and soft goods built for movement.",
    tagline: "Pack less, carry better.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
];

const heroSlides: HeroSlide[] = [
  {
    id: "hero-quiet-luxury",
    eyebrow: "Curated Audio",
    title: "Quiet luxury for every commute and long-haul reset.",
    description:
      "Discover refined noise cancellation, soft-touch materials, and deep discounts across premium listening gear.",
    ctaLabel: "Explore Headphones",
    ctaHref: "/category/headphones",
    image: categories[0].image,
    alt: "Premium wireless headphones on a neutral surface",
  },
  {
    id: "hero-studio-refresh",
    eyebrow: "Workspace Refresh",
    title: "Turn your desk into a calm, high-output studio.",
    description:
      "Minimal tools for sharper calls, better focus, and richer sound without visual clutter.",
    ctaLabel: "Shop Workspace",
    ctaHref: "/category/workspace",
    image: categories[3].image,
    alt: "Modern workspace setup with clean desk accessories",
  },
  {
    id: "hero-spring-travel",
    eyebrow: "Seasonal Edit",
    title: "Travel lighter with portable power, sound, and comfort.",
    description:
      "This season's packable essentials balance battery life, elegant materials, and compact silhouettes.",
    ctaLabel: "See Travel Picks",
    ctaHref: "/category/travel",
    image: categories[5].image,
    alt: "Travel-ready essentials arranged on a soft background",
  },
];

const homeContent: HomeResponse = {
  heroSlides,
  sections: {
    bestDeals: {
      title: "Best Deals & Discounts",
      description:
        "High-value picks with the sharpest markdowns across audio, desk gear, and wellness.",
      collection: "best-deals",
    },
    seasonal: {
      title: "Seasonal Deals",
      description:
        "Warm-weather essentials and transitional upgrades selected for spring routines.",
      collection: "seasonal",
    },
  },
  featuredCategorySlugs: categories.map((category) => category.slug),
};

const baseProducts: BaseProduct[] = [
  {
    id: "prd-nebula-anc-headphones",
    slug: "nebula-anc-headphones",
    title: "Nebula ANC Headphones",
    description: "Adaptive noise cancellation with memory foam cushions.",
    category: "headphones",
    price: 249,
    originalPrice: 329,
    rating: 4.8,
    reviewCount: 342,
    image: categories[0].image,
    tags: ["noise cancelling", "travel", "wireless"],
    inventory: 28,
    featuredCollections: ["best-deals"],
    createdAt: "2026-03-10",
  },
  {
    id: "prd-studio-air-max",
    slug: "studio-air-max",
    title: "Studio Air Max",
    description: "Wide-stage wireless headphones tuned for focused listening.",
    category: "headphones",
    price: 319,
    originalPrice: 399,
    rating: 4.9,
    reviewCount: 218,
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
    tags: ["studio", "wireless", "hi-fi"],
    inventory: 16,
    featuredCollections: ["seasonal"],
    createdAt: "2026-03-18",
  },
  {
    id: "prd-echo-lite-wireless",
    slug: "echo-lite-wireless",
    title: "Echo Lite Wireless Earbuds",
    description: "Compact earbuds with all-day battery and crisp call pickup.",
    category: "headphones",
    price: 129,
    originalPrice: 179,
    rating: 4.6,
    reviewCount: 521,
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80",
    tags: ["earbuds", "calls", "portable"],
    inventory: 42,
    featuredCollections: ["best-deals", "seasonal"],
    createdAt: "2026-02-22",
  },
  {
    id: "prd-pulse-open-ear",
    slug: "pulse-open-ear",
    title: "Pulse Open-Ear Audio",
    description: "Featherweight open-ear design for runs and city walks.",
    category: "headphones",
    price: 189,
    originalPrice: 249,
    rating: 4.5,
    reviewCount: 167,
    image:
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&w=1200&q=80",
    tags: ["running", "open-ear", "fitness"],
    inventory: 31,
    featuredCollections: ["seasonal"],
    createdAt: "2026-03-05",
  },
  {
    id: "prd-midnight-monitor-pro",
    slug: "midnight-monitor-pro",
    title: "Midnight Monitor Pro",
    description: "Reference-grade closed-back headphones for deep work.",
    category: "headphones",
    price: 279,
    originalPrice: 329,
    rating: 4.7,
    reviewCount: 94,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
    tags: ["reference", "studio", "desk"],
    inventory: 13,
    featuredCollections: [],
    createdAt: "2026-01-29",
  },
  {
    id: "prd-aura-room-speaker",
    slug: "aura-room-speaker",
    title: "Aura Room Speaker",
    description:
      "Multi-room speaker with balanced mids and clean aluminum trim.",
    category: "speakers",
    price: 229,
    originalPrice: 299,
    rating: 4.8,
    reviewCount: 288,
    image: categories[1].image,
    tags: ["multi-room", "living room", "wireless"],
    inventory: 19,
    featuredCollections: ["best-deals"],
    createdAt: "2026-03-12",
  },
  {
    id: "prd-bloom-mini-speaker",
    slug: "bloom-mini-speaker",
    title: "Bloom Mini Speaker",
    description: "Pocket-sized portable speaker with warm, full-bodied tuning.",
    category: "speakers",
    price: 99,
    originalPrice: 129,
    rating: 4.4,
    reviewCount: 611,
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80",
    tags: ["portable", "bluetooth", "outdoors"],
    inventory: 55,
    featuredCollections: ["seasonal"],
    createdAt: "2026-02-14",
  },
  {
    id: "prd-cove-soundbar",
    slug: "cove-soundbar",
    title: "Cove Cinematic Soundbar",
    description: "Low-profile bar speaker with dialogue lift and room fill.",
    category: "speakers",
    price: 349,
    originalPrice: 449,
    rating: 4.7,
    reviewCount: 174,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    tags: ["tv", "home theater", "minimal"],
    inventory: 12,
    featuredCollections: ["best-deals"],
    createdAt: "2026-01-18",
  },
  {
    id: "prd-ember-portable-speaker",
    slug: "ember-portable-speaker",
    title: "Ember Portable Speaker",
    description:
      "Splash-ready speaker built for patios, parks, and weekend trips.",
    category: "speakers",
    price: 149,
    originalPrice: 189,
    rating: 4.6,
    reviewCount: 267,
    image:
      "https://images.unsplash.com/photo-1558537348-c0f8e733989d?auto=format&fit=crop&w=1200&q=80",
    tags: ["portable", "outdoor", "seasonal"],
    inventory: 39,
    featuredCollections: ["seasonal"],
    createdAt: "2026-03-02",
  },
  {
    id: "prd-horizon-hi-fi-set",
    slug: "horizon-hi-fi-set",
    title: "Horizon Hi-Fi Set",
    description: "Stereo bookshelf pair with rich low-end and crisp detail.",
    category: "speakers",
    price: 499,
    originalPrice: 599,
    rating: 4.9,
    reviewCount: 131,
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    tags: ["hi-fi", "bookshelf", "premium"],
    inventory: 9,
    featuredCollections: [],
    createdAt: "2026-02-25",
  },
  {
    id: "prd-lumen-smartwatch",
    slug: "lumen-smartwatch",
    title: "Lumen Smartwatch",
    description: "Polished health tracking with a crisp always-on display.",
    category: "wearables",
    price: 279,
    originalPrice: 349,
    rating: 4.7,
    reviewCount: 452,
    image: categories[2].image,
    tags: ["health", "watch", "daily"],
    inventory: 33,
    featuredCollections: ["best-deals"],
    createdAt: "2026-03-16",
  },
  {
    id: "prd-atlas-fitness-band",
    slug: "atlas-fitness-band",
    title: "Atlas Fitness Band",
    description: "Lightweight movement tracking with seven-day battery life.",
    category: "wearables",
    price: 89,
    originalPrice: 119,
    rating: 4.4,
    reviewCount: 703,
    image:
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["fitness", "band", "sleep"],
    inventory: 67,
    featuredCollections: ["seasonal"],
    createdAt: "2026-02-10",
  },
  {
    id: "prd-halo-sleep-ring",
    slug: "halo-sleep-ring",
    title: "Halo Sleep Ring",
    description:
      "Minimal wellness ring with recovery and sleep readiness insights.",
    category: "wearables",
    price: 229,
    originalPrice: 279,
    rating: 4.5,
    reviewCount: 193,
    image:
      "https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?auto=format&fit=crop&w=1200&q=80",
    tags: ["sleep", "recovery", "ring"],
    inventory: 24,
    featuredCollections: ["best-deals"],
    createdAt: "2026-03-07",
  },
  {
    id: "prd-core-run-earbuds",
    slug: "core-run-earbuds",
    title: "Core Run Earbuds",
    description: "Secure-fit sport earbuds built for pace changes and sweat.",
    category: "wearables",
    price: 149,
    originalPrice: 199,
    rating: 4.6,
    reviewCount: 318,
    image:
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=1200&q=80",
    tags: ["running", "sport", "earbuds"],
    inventory: 44,
    featuredCollections: ["seasonal"],
    createdAt: "2026-01-31",
  },
  {
    id: "prd-stride-clip-tracker",
    slug: "stride-clip-tracker",
    title: "Stride Clip Tracker",
    description:
      "Compact recovery and mobility tracker for daily movement goals.",
    category: "wearables",
    price: 69,
    originalPrice: 89,
    rating: 4.3,
    reviewCount: 126,
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1200&q=80",
    tags: ["tracker", "clip", "movement"],
    inventory: 58,
    featuredCollections: [],
    createdAt: "2026-02-20",
  },
  {
    id: "prd-focus-desk-lamp",
    slug: "focus-desk-lamp",
    title: "Focus Desk Lamp",
    description:
      "Soft-edge task lighting with touch dimming and wireless charging.",
    category: "workspace",
    price: 139,
    originalPrice: 179,
    rating: 4.7,
    reviewCount: 284,
    image: categories[3].image,
    tags: ["desk", "lighting", "charging"],
    inventory: 26,
    featuredCollections: ["best-deals"],
    createdAt: "2026-03-14",
  },
  {
    id: "prd-studio-webcam-pro",
    slug: "studio-webcam-pro",
    title: "Studio Webcam Pro",
    description:
      "4K webcam with natural tone balance and quiet framing controls.",
    category: "workspace",
    price: 179,
    originalPrice: 229,
    rating: 4.6,
    reviewCount: 341,
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80",
    tags: ["camera", "meetings", "desk"],
    inventory: 21,
    featuredCollections: ["best-deals"],
    createdAt: "2026-02-28",
  },
  {
    id: "prd-quiet-mech-keyboard",
    slug: "quiet-mech-keyboard",
    title: "Quiet Mech Keyboard",
    description:
      "Low-profile tactile board with muted switches and aluminum frame.",
    category: "workspace",
    price: 159,
    originalPrice: 209,
    rating: 4.8,
    reviewCount: 190,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    tags: ["keyboard", "minimal", "typing"],
    inventory: 18,
    featuredCollections: ["seasonal"],
    createdAt: "2026-03-11",
  },
  {
    id: "prd-arc-dock-station",
    slug: "arc-dock-station",
    title: "Arc Dock Station",
    description: "Slim dock with dual display output and clean cable routing.",
    category: "workspace",
    price: 119,
    originalPrice: 149,
    rating: 4.5,
    reviewCount: 227,
    image:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80",
    tags: ["dock", "usb-c", "desk"],
    inventory: 36,
    featuredCollections: [],
    createdAt: "2026-01-26",
  },
  {
    id: "prd-note-flow-tablet",
    slug: "note-flow-tablet",
    title: "Note Flow Tablet",
    description:
      "Paper-feel digital notebook for planning, sketching, and review.",
    category: "workspace",
    price: 299,
    originalPrice: 369,
    rating: 4.7,
    reviewCount: 108,
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    tags: ["tablet", "notes", "creative"],
    inventory: 15,
    featuredCollections: ["seasonal"],
    createdAt: "2026-02-16",
  },
  {
    id: "prd-rest-sound-machine",
    slug: "rest-sound-machine",
    title: "Rest Sound Machine",
    description:
      "Compact bedside audio with layered sleep scenes and sunrise alarms.",
    category: "wellness",
    price: 89,
    originalPrice: 119,
    rating: 4.6,
    reviewCount: 514,
    image: categories[4].image,
    tags: ["sleep", "bedside", "audio"],
    inventory: 49,
    featuredCollections: ["best-deals"],
    createdAt: "2026-02-27",
  },
  {
    id: "prd-breathe-diffuser",
    slug: "breathe-diffuser",
    title: "Breathe Diffuser",
    description:
      "Ceramic diffuser with silent mist output and soft ambient light.",
    category: "wellness",
    price: 69,
    originalPrice: 99,
    rating: 4.4,
    reviewCount: 284,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    tags: ["diffuser", "ambient", "home"],
    inventory: 54,
    featuredCollections: ["seasonal"],
    createdAt: "2026-03-04",
  },
  {
    id: "prd-calm-therapy-mask",
    slug: "calm-therapy-mask",
    title: "Calm Therapy Mask",
    description:
      "Heated eye mask with pressure relief and guided wind-down modes.",
    category: "wellness",
    price: 129,
    originalPrice: 169,
    rating: 4.5,
    reviewCount: 156,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    tags: ["recovery", "sleep", "therapy"],
    inventory: 27,
    featuredCollections: ["best-deals"],
    createdAt: "2026-01-24",
  },
  {
    id: "prd-thermo-recovery-gun",
    slug: "thermo-recovery-gun",
    title: "Thermo Recovery Gun",
    description:
      "Hot-cold recovery tool with quieter percussion and ergonomic grip.",
    category: "wellness",
    price: 199,
    originalPrice: 249,
    rating: 4.7,
    reviewCount: 201,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    tags: ["recovery", "fitness", "massage"],
    inventory: 22,
    featuredCollections: ["seasonal"],
    createdAt: "2026-03-01",
  },
  {
    id: "prd-drift-sleep-speaker",
    slug: "drift-sleep-speaker",
    title: "Drift Sleep Speaker",
    description:
      "Fabric bedside speaker tuned for gentle ambient playlists and stories.",
    category: "wellness",
    price: 149,
    originalPrice: 189,
    rating: 4.3,
    reviewCount: 119,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    tags: ["bedside", "speaker", "sleep"],
    inventory: 17,
    featuredCollections: [],
    createdAt: "2026-02-08",
  },
  {
    id: "prd-voyage-power-kit",
    slug: "voyage-power-kit",
    title: "Voyage Power Kit",
    description:
      "Slim travel battery, cable kit, and wall adapter in one case.",
    category: "travel",
    price: 119,
    originalPrice: 159,
    rating: 4.8,
    reviewCount: 390,
    image: categories[5].image,
    tags: ["power", "travel", "portable"],
    inventory: 47,
    featuredCollections: ["best-deals", "seasonal"],
    createdAt: "2026-03-17",
  },
  {
    id: "prd-roam-pack-speaker",
    slug: "roam-pack-speaker",
    title: "Roam Pack Speaker",
    description:
      "Compact speaker clipped for easy carry and long battery life.",
    category: "travel",
    price: 109,
    originalPrice: 149,
    rating: 4.5,
    reviewCount: 278,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1200&q=80",
    tags: ["speaker", "portable", "bag"],
    inventory: 52,
    featuredCollections: ["seasonal"],
    createdAt: "2026-02-23",
  },
  {
    id: "prd-air-fold-charger",
    slug: "air-fold-charger",
    title: "Air Fold Charger",
    description:
      "Tri-fold charger for phone, watch, and earbuds with a tiny footprint.",
    category: "travel",
    price: 79,
    originalPrice: 99,
    rating: 4.6,
    reviewCount: 436,
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80",
    tags: ["charger", "foldable", "wireless"],
    inventory: 61,
    featuredCollections: ["best-deals"],
    createdAt: "2026-03-09",
  },
  {
    id: "prd-glide-neck-pillow-speaker",
    slug: "glide-neck-pillow-speaker",
    title: "Glide Neck Pillow Speaker",
    description:
      "Travel pillow with built-in low-profile speakers and washable cover.",
    category: "travel",
    price: 99,
    originalPrice: 129,
    rating: 4.2,
    reviewCount: 88,
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    tags: ["travel", "comfort", "audio"],
    inventory: 23,
    featuredCollections: ["seasonal"],
    createdAt: "2026-01-20",
  },
  {
    id: "prd-route-travel-bottle",
    slug: "route-travel-bottle",
    title: "Route Travel Bottle",
    description:
      "Insulated bottle with magnetic lid dock and minimalist carry loop.",
    category: "travel",
    price: 49,
    originalPrice: 69,
    rating: 4.4,
    reviewCount: 305,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
    tags: ["travel", "hydration", "carry"],
    inventory: 74,
    featuredCollections: [],
    createdAt: "2026-02-05",
  },
];

const categoryMap = categories.reduce<Record<string, Category>>(
  (acc, category) => {
    acc[category.slug] = category;
    return acc;
  },
  {},
);

function withComputedFields(product: BaseProduct): Product {
  const category = categoryMap[product.category];

  return {
    ...product,
    categoryName: category?.name ?? product.category,
    discountPercentage: Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    ),
  };
}

function sortProducts(products: Product[], sort: SortOption) {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      sorted.sort((left, right) => left.price - right.price);
      break;
    case "price-desc":
      sorted.sort((left, right) => right.price - left.price);
      break;
    case "rating-desc":
      sorted.sort((left, right) => right.rating - left.rating);
      break;
    case "discount-desc":
      sorted.sort(
        (left, right) => right.discountPercentage - left.discountPercentage,
      );
      break;
    case "newest":
      sorted.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      );
      break;
    case "featured":
    default:
      sorted.sort((left, right) => {
        const score =
          right.featuredCollections.length - left.featuredCollections.length;

        if (score !== 0) {
          return score;
        }

        return right.rating - left.rating;
      });
  }

  return sorted;
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categoryMap[slug];
}

export function getHomeContent() {
  return homeContent;
}

let cachedAllProducts: Product[] | null = null;

export function getAllProducts() {
  if (!cachedAllProducts) {
    cachedAllProducts = baseProducts.map(withComputedFields);
  }
  return cachedAllProducts;
}

export function queryProducts({
  category,
  collection,
  page = 1,
  limit = 8,
  sort = "featured",
  minPrice,
  maxPrice,
  minRating,
  discountOnly,
  search,
}: ProductQueryParams): ProductsResponse {
  const products = getAllProducts();

  const availablePrices = products.map((product) => product.price);

  let filtered = products.filter((product) => {
    if (category && category !== "all" && product.category !== category) {
      return false;
    }

    if (collection && !product.featuredCollections.includes(collection)) {
      return false;
    }

    if (typeof minPrice === "number" && product.price < minPrice) {
      return false;
    }

    if (typeof maxPrice === "number" && product.price > maxPrice) {
      return false;
    }

    if (typeof minRating === "number" && product.rating < minRating) {
      return false;
    }

    if (discountOnly && product.discountPercentage <= 0) {
      return false;
    }

    if (search) {
      const keyword = search.toLowerCase();
      const haystack = [
        product.title,
        product.description,
        product.categoryName,
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    return true;
  });

  filtered = sortProducts(filtered, sort);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    data: paged,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
      hasMore: safePage < totalPages,
    },
    meta: {
      availablePriceRange: {
        min: Math.min(...availablePrices),
        max: Math.max(...availablePrices),
      },
    },
  };
}

export function getProductBySlug(slug: string) {
  return getAllProducts().find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return sortProducts(
    getAllProducts().filter(
      (item) =>
        item.category === product.category && item.slug !== product.slug,
    ),
    "featured",
  ).slice(0, limit);
}
