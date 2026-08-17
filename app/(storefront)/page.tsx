import { HomePage } from "@/features/home/home-page";
import { getHomePageData } from "@/lib/server/home-data";

export const revalidate = 60; // ISR cache for instant edge response

export default async function Page() {
  const {
    homeData,
    categories,
    settings,
    bestDealsProducts,
    seasonalDealsProducts,
    categoryProductsMap,
  } = await getHomePageData();

  return (
    <HomePage
      initialHomeData={homeData}
      initialCategories={categories}
      initialSettings={settings}
      initialBestDeals={bestDealsProducts}
      initialSeasonalDeals={seasonalDealsProducts}
      initialCategoryProductsMap={categoryProductsMap}
    />
  );
}
