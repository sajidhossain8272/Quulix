import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const [productsCount, ordersCount, pendingOrdersCount, categoriesCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.category.count(),
  ]);

  const stats = [
    { name: "Total Products", value: productsCount.toString(), icon: Package },
    { name: "Total Orders", value: ordersCount.toString(), icon: ShoppingCart },
    { name: "Pending Orders", value: pendingOrdersCount.toString(), icon: AlertCircle, alert: pendingOrdersCount > 0 },
    { name: "Categories", value: categoriesCount.toString(), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Overview of your store&apos;s performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-900'}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
