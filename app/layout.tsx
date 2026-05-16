import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { Providers } from "@/app/providers";
import { FacebookPixel } from "@/components/shared/FacebookPixel";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  metadataBase: new URL("https://quulix.example.com"),
  title: {
    default: "Quulix | Premium Everyday Tech",
    template: "%s | Quulix",
  },
  description:
    "A production-ready mobile-first commerce frontend for premium daily tech, built with Next.js App Router, React Query, Zustand, and mock API routes.",
  openGraph: {
    title: "Quulix",
    description:
      "Premium commerce UI with Apple-inspired surfaces and Amazon-style product discovery.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quulix",
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
        <Providers>{children}</Providers>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <FacebookPixel />
      </body>
    </html>
  );
}
