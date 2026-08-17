import { Container } from "@/components/shared/container";
import { getShopSettings } from "@/lib/shop-settings";

export const metadata = {
  title: "Shipping & Returns",
  description: "Shipping and return policy for Quulix orders.",
};

export default async function ShippingPage() {
  const settings = await getShopSettings();

  return (
    <main className="py-12 sm:py-16">
      <Container className="max-w-4xl">
        <div className="rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-sm sm:p-12">
          <div className="prose prose-stone max-w-none text-stone-700 whitespace-pre-line leading-relaxed">
            {settings.shippingPolicy}
          </div>
        </div>
      </Container>
    </main>
  );
}
