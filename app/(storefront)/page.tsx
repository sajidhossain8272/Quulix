import { HomePage } from "@/features/home/home-page";
import { getHomePageData } from "@/lib/server/home-data";

export const revalidate = 60; // ISR cache for fast page load

export default async function Page() {
  const { homeData, categories, settings } = await getHomePageData();

  return (
    <HomePage
      initialHomeData={homeData}
      initialCategories={categories}
      initialSettings={settings}
    />
  );
}
