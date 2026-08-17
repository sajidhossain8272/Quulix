import {
  getAdminShopSettings,
  updateDeliverySettingsAction,
  updateGeneralSettingsAction,
  updatePoliciesAction,
  updateShowcaseBannerAction,
} from "@/lib/admin/settings-actions";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  FileText,
  Globe,
  ImageIcon,
  Megaphone,
  PhoneCall,
  Save,
  Share2,
  Truck,
} from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await getAdminShopSettings();

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Store & Website Settings
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Manage brand identity, logos, showcase footer banner, contact hotlines, policies, and delivery fees.
        </p>
      </div>

      {/* 1. Store Identity & Logos Form */}
      <form
        action={updateGeneralSettingsAction}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Brand Identity & Logos</h2>
            <p className="text-xs text-gray-500">
              Customize website name, branding logos, and favicon.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Store Name
            </label>
            <input
              name="storeName"
              required
              defaultValue={settings.storeName}
              placeholder="e.g. Quulix"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Tagline / Sub-heading
            </label>
            <input
              name="tagline"
              defaultValue={settings.tagline}
              placeholder="e.g. Premium Everyday Tech & Acoustics"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Main Logo URL (Dark text on light nav)
            </label>
            <input
              name="logoUrl"
              defaultValue={settings.logoUrl}
              placeholder="/logo.png or https://..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              White Logo URL (Light text on dark footer)
            </label>
            <input
              name="logoWhiteUrl"
              defaultValue={settings.logoWhiteUrl}
              placeholder="/logo-white.png or https://..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Favicon / App Icon URL
            </label>
            <input
              name="faviconUrl"
              defaultValue={settings.faviconUrl}
              placeholder="/favicon.ico or https://..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 active:scale-95"
          >
            <Save className="h-4 w-4" />
            Save Identity
          </button>
        </div>
      </form>

      {/* 2. Showcase / Footer Banner Form (The craft banner above footer) */}
      <form
        action={updateShowcaseBannerAction}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Showcase / Footer Banner</h2>
            <p className="text-xs text-gray-500">
              Customize the prominent craft banner image, heading, description, and action buttons before the footer.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Banner Background Image URL (1080p, 720p, or 2K recommended)
            </label>
            <input
              name="showcaseImage"
              required
              defaultValue={settings.showcaseImage}
              placeholder="https://images.unsplash.com/... or /uploads/..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Top Floating Badge
              </label>
              <input
                name="showcaseBadge"
                defaultValue={settings.showcaseBadge}
                placeholder="e.g. Crafted By Hand & Tech"
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Eyebrow Subtitle
              </label>
              <input
                name="showcaseEyebrow"
                defaultValue={settings.showcaseEyebrow}
                placeholder="e.g. The Quulix Workshop"
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Banner Title / Main Heading (Balanced & compact)
            </label>
            <input
              name="showcaseTitle"
              defaultValue={settings.showcaseTitle}
              placeholder="e.g. Precision tuned. Elegantly crafted."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Short Description / Narrative
            </label>
            <textarea
              name="showcaseDescription"
              rows={2}
              defaultValue={settings.showcaseDescription}
              placeholder="e.g. Obsessive attention to every tactile curve, aerospace alloy, and acoustic nuance."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Primary Button Label & Link
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="showcaseBtn1Label"
                  defaultValue={settings.showcaseBtn1Label}
                  placeholder="Button Label"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  name="showcaseBtn1Href"
                  defaultValue={settings.showcaseBtn1Href}
                  placeholder="/category/all"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Secondary Button Label & Link
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="showcaseBtn2Label"
                  defaultValue={settings.showcaseBtn2Label}
                  placeholder="Button Label"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  name="showcaseBtn2Href"
                  defaultValue={settings.showcaseBtn2Href}
                  placeholder="/category/workspace"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 active:scale-95"
          >
            <Save className="h-4 w-4" />
            Save Showcase Banner
          </button>
        </div>
      </form>

      {/* 3. Contact & Social Support Info */}
      <form
        action={updateGeneralSettingsAction}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Contact & Social Links</h2>
            <p className="text-xs text-gray-500">
              Hotline phone, email, studio location, and official social media handles.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Hotline Phone Number
            </label>
            <input
              name="supportPhone"
              defaultValue={settings.supportPhone}
              placeholder="+880 1755-377017"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Support Email Address
            </label>
            <input
              name="supportEmail"
              defaultValue={settings.supportEmail}
              placeholder="support@quulix.com"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Physical Studio Address
            </label>
            <input
              name="studioAddress"
              defaultValue={settings.studioAddress}
              placeholder="Level 4, CDA Avenue, GEC, Chattogram, Bangladesh"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Facebook URL
            </label>
            <input
              name="facebookUrl"
              defaultValue={settings.facebookUrl}
              placeholder="https://facebook.com/..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Instagram URL
            </label>
            <input
              name="instagramUrl"
              defaultValue={settings.instagramUrl}
              placeholder="https://instagram.com/..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              YouTube URL
            </label>
            <input
              name="youtubeUrl"
              defaultValue={settings.youtubeUrl}
              placeholder="https://youtube.com/..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Twitter / X URL
            </label>
            <input
              name="twitterUrl"
              defaultValue={settings.twitterUrl}
              placeholder="https://twitter.com/..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 active:scale-95"
          >
            <Save className="h-4 w-4" />
            Save Contact Info
          </button>
        </div>
      </form>

      {/* 4. Delivery Charges Form */}
      <form
        action={updateDeliverySettingsAction}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Delivery & Checkout Charges</h2>
            <p className="text-xs text-gray-500">
              Configure shipping fees for Cash on Delivery orders.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Inside Dhaka Delivery Fee (৳)
            </label>
            <input
              name="deliveryChargeInsideDhaka"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={settings.deliveryChargeInsideDhaka}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Outside Dhaka Delivery Fee (৳)
            </label>
            <input
              name="deliveryChargeOutsideDhaka"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={settings.deliveryChargeOutsideDhaka}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs sm:text-sm text-gray-600">
          <p className="font-semibold text-gray-900">Live Checkout Preview</p>
          <div className="mt-2 flex items-center gap-6">
            <span>Inside Dhaka: <strong>{formatCurrency(settings.deliveryChargeInsideDhaka)}</strong></span>
            <span>Outside Dhaka: <strong>{formatCurrency(settings.deliveryChargeOutsideDhaka)}</strong></span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 active:scale-95"
          >
            <Save className="h-4 w-4" />
            Save Delivery Fees
          </button>
        </div>
      </form>

      {/* 5. Policies & CMS Pages Form */}
      <form
        action={updatePoliciesAction}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Policies & Information Content</h2>
            <p className="text-xs text-gray-500">
              Edit Terms & Conditions, Privacy Policy, Shipping Policy, and About Us pages directly.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Terms & Conditions
            </label>
            <textarea
              name="termsAndConditions"
              rows={5}
              defaultValue={settings.termsAndConditions}
              className="w-full rounded-lg border border-gray-200 p-3 text-xs sm:text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Privacy Policy
            </label>
            <textarea
              name="privacyPolicy"
              rows={5}
              defaultValue={settings.privacyPolicy}
              className="w-full rounded-lg border border-gray-200 p-3 text-xs sm:text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Shipping & Return Policy
            </label>
            <textarea
              name="shippingPolicy"
              rows={5}
              defaultValue={settings.shippingPolicy}
              className="w-full rounded-lg border border-gray-200 p-3 text-xs sm:text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              About Us / Brand Story
            </label>
            <textarea
              name="aboutUs"
              rows={5}
              defaultValue={settings.aboutUs}
              className="w-full rounded-lg border border-gray-200 p-3 text-xs sm:text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 active:scale-95"
          >
            <Save className="h-4 w-4" />
            Save Policies
          </button>
        </div>
      </form>
    </div>
  );
}
