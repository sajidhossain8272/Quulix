export const dynamic = "force-dynamic";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | KinooBD Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
