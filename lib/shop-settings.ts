import type { DeliveryZone } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const DEFAULT_DELIVERY_INSIDE_DHAKA = 80;
export const DEFAULT_DELIVERY_OUTSIDE_DHAKA = 120;

export type StoreSettings = {
  // Store Identity
  storeName: string;
  tagline: string;
  logoUrl: string;
  logoWhiteUrl: string;
  faviconUrl: string;

  // Contact & Studio
  supportEmail: string;
  supportPhone: string;
  studioAddress: string;

  // Top Announcement Bar
  announcementText1: string;
  announcementText2: string;
  announcementText3: string;
  isAnnouncementActive: boolean;

  // Showcase / Footer Banner
  showcaseImage: string;
  showcaseBadge: string;
  showcaseEyebrow: string;
  showcaseTitle: string;
  showcaseDescription: string;
  showcaseBtn1Label: string;
  showcaseBtn1Href: string;
  showcaseBtn2Label: string;
  showcaseBtn2Href: string;

  // Brand Craft Video & Story
  brandStoryEyebrow: string;
  brandStoryTitle: string;
  brandStoryDescription: string;
  brandStoryVideoId: string;

  // Delivery Charges
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;

  // Social Links
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;

  // Legal & Info Policies
  termsAndConditions: string;
  privacyPolicy: string;
  shippingPolicy: string;
  aboutUs: string;
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  // Store Identity
  storeName: "Quulix",
  tagline: "Premium Everyday Tech & Acoustics",
  logoUrl: "/logo.png",
  logoWhiteUrl: "/logo-white.png",
  faviconUrl: "/favicon.ico",

  // Contact & Studio
  supportEmail: "support@quulix.com",
  supportPhone: "+880 1755-377017",
  studioAddress: "Quulix Studio, Level 4, CDA Avenue, GEC, Chattogram, Bangladesh",

  // Top Announcement Bar
  announcementText1: "Free Express Shipping Across Bangladesh on Orders Over ৳2,000",
  announcementText2: "1-Year Official Replacement Warranty on All Audio & Tech Gear",
  announcementText3: "Spring Acoustic Refresh: Up to 35% Off Premium Headphones & Speakers",
  isAnnouncementActive: true,

  // Showcase / Footer Banner (Balanced text & refined scale)
  showcaseImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=85",
  showcaseBadge: "Crafted By Hand & Tech",
  showcaseEyebrow: "The Quulix Workshop",
  showcaseTitle: "Precision tuned. Elegantly crafted.",
  showcaseDescription: "Obsessive attention to every tactile curve, aerospace alloy, and acoustic nuance.",
  showcaseBtn1Label: "Shop Signature Gear",
  showcaseBtn1Href: "/category/all",
  showcaseBtn2Label: "Explore Workspace",
  showcaseBtn2Href: "/category/workspace",

  // Brand Craft Video & Story
  brandStoryEyebrow: "Handcrafted With Integrity",
  brandStoryTitle: "Discover precision audio and everyday tech in our online store.",
  brandStoryDescription:
    "Quulix is a premium lifestyle and audio gear brand founded on uncompromising quality. Our focus on ergonomic design and acoustic mastery shines through every product we engineer.",
  brandStoryVideoId: "dQw4w9WgXcQ",

  // Delivery Charges
  deliveryChargeInsideDhaka: 80,
  deliveryChargeOutsideDhaka: 120,

  // Social Links
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  twitterUrl: "https://twitter.com",

  // Policies & Info Content
  termsAndConditions: `# Terms & Conditions

Welcome to Quulix. By using our website and placing an order, you agree to the following terms and conditions:

1. **Ordering & Pricing**: All prices are listed in Bangladeshi Taka (BDT) and include standard taxes.
2. **Cash on Delivery**: We offer Cash on Delivery (COD) across Bangladesh. Please ensure your delivery address and phone number are accurate upon checkout.
3. **Warranty**: All Quulix products come with a 1-year official manufacturer replacement warranty covering manufacturing defects.
4. **Order Cancellation**: You may cancel an order before it has been dispatched by contacting our support hotline.`,

  privacyPolicy: `# Privacy Policy

At Quulix, we are committed to protecting your personal information:

1. **Information Collected**: We only collect necessary contact information (name, phone, address, email) to process and deliver your orders.
2. **Data Security**: We never sell or share your personal data with third-party advertising brokers.
3. **Cookies & Preferences**: Minimal functional cookies are used solely to preserve your shopping cart across sessions.`,

  shippingPolicy: `# Shipping & Return Policy

- **Inside Dhaka**: Delivery within 24-48 hours (Standard Fee: ৳80).
- **Outside Dhaka**: Delivery within 2-4 business days (Standard Fee: ৳120).
- **Return Policy**: If you receive a damaged or mismatched item, you may request an exchange within 7 days of delivery.`,

  aboutUs: `# About Quulix

Quulix was founded with a singular purpose: creating premium, durable, and acoustically refined daily technology without unnecessary retail markups.

From tactile aluminum frames to calibrated drivers, we design tools that enhance your listening and focus ritual.`,
};

export type ShopDeliverySettings = {
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
};

export async function getShopSettings(): Promise<StoreSettings> {
  try {
    const raw = await prisma.shopSettings.findUnique({
      where: { id: "default" },
    });

    if (!raw) {
      return DEFAULT_STORE_SETTINGS;
    }

    // Merge database values with defaults
    return {
      ...DEFAULT_STORE_SETTINGS,
      ...raw,
      deliveryChargeInsideDhaka:
        raw.deliveryChargeInsideDhaka ?? DEFAULT_STORE_SETTINGS.deliveryChargeInsideDhaka,
      deliveryChargeOutsideDhaka:
        raw.deliveryChargeOutsideDhaka ?? DEFAULT_STORE_SETTINGS.deliveryChargeOutsideDhaka,
    } as unknown as StoreSettings;
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function getDeliveryChargeForZone(
  zone: DeliveryZone,
  settings: ShopDeliverySettings,
) {
  return zone === "INSIDE_DHAKA"
    ? settings.deliveryChargeInsideDhaka
    : settings.deliveryChargeOutsideDhaka;
}
