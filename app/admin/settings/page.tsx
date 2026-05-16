import { getAdminShopSettings, updateShopSettingsAction } from "@/lib/admin/settings-actions";
import { formatCurrency } from "@/lib/utils";

export default async function AdminSettingsPage() {
  const settings = await getAdminShopSettings();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Shop settings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Configure per-order delivery charges shown at checkout.
        </p>
      </div>

      <form
        action={updateShopSettingsAction}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-medium text-gray-900">Delivery charges</h2>
          <p className="mt-1 text-sm text-gray-500">
            Customers choose inside or outside Dhaka at checkout. Totals include
            the selected delivery fee.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Inside Dhaka (TK)
            </label>
            <input
              name="deliveryChargeInsideDhaka"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={settings.deliveryChargeInsideDhaka}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-500">
              Default: {formatCurrency(80)}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Outside Dhaka (TK)
            </label>
            <input
              name="deliveryChargeOutsideDhaka"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={settings.deliveryChargeOutsideDhaka}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-500">
              Default: {formatCurrency(120)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-900">Preview at checkout</p>
          <ul className="mt-2 space-y-1">
            <li>Inside Dhaka: {formatCurrency(settings.deliveryChargeInsideDhaka)}</li>
            <li>Outside Dhaka: {formatCurrency(settings.deliveryChargeOutsideDhaka)}</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-900"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
