import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { Providers } from "@/app/providers";
import { FacebookPixel } from "@/components/shared/FacebookPixel";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quulix.vercel.app"),
  title: {
    default: "Quulix | Premium Everyday Tech",
    template: "%s | Quulix",
  },
  description:
    "A production-ready mobile-first commerce experience for premium audio and everyday tech.",
  openGraph: {
    title: "Quulix",
    description:
      "Premium commerce UI with Apple-inspired surfaces and precision acoustic gear.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quulix",
    description:
      "Premium everyday tech, acoustic gear, and modern workspace essentials.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`} data-scroll-behavior="smooth">
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
