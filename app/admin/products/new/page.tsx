import { AdminProductForm } from "@/components/admin/admin-product-form";
import { createProductAction } from "@/lib/admin/product-actions";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AdminProductForm
      title="New Product"
      description="Add a new product to your catalog."
      submitLabel="Save Product"
      categories={categories}
      action={createProductAction}
    />
  );
}
