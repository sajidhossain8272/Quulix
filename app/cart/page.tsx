import type { Metadata } from "next";

import { CartPage } from "@/features/cart/cart-page";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review cart items, adjust quantities, and continue to checkout.",
};

export default function Page() {
  return <CartPage />;
}
