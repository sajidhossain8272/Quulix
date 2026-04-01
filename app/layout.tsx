import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { Providers } from "@/app/providers";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { CategoryBar } from "@/components/navigation/category-bar";
import { Navbar } from "@/components/navigation/navbar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://auralux-market.example.com"),
  title: {
    default: "Auralux Market | Premium Everyday Tech",
    template: "%s | Auralux Market",
  },
  description:
    "A production-ready mobile-first commerce frontend for premium daily tech, built with Next.js App Router, React Query, Zustand, and mock API routes.",
  openGraph: {
    title: "Auralux Market",
    description:
      "Premium commerce UI with Apple-inspired surfaces and Amazon-style product discovery.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auralux Market",
    description:
      "Mobile-first commerce UI built for scalable API-first product discovery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <CategoryBar />
            <div className="flex-1">{children}</div>
            <Footer />
            <CartDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
