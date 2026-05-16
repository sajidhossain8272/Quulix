import type { Metadata } from "next";

import { CheckoutPage } from "@/features/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Mock checkout flow for the Quulix cart experience.",
};

export default function Page() {
  return <CheckoutPage />;
}
