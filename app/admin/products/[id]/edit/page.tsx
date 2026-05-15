import { notFound } from "next/navigation";

import { AdminProductForm } from "@/components/admin/admin-product-form";
import {
  getAdminProduct,
  updateProductAction,
} from "@/lib/admin/product-actions";
import { prisma } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <AdminProductForm
      title="Edit Product"
      description={`Update ${product.title} and manage gallery media.`}
      submitLabel="Update Product"
      categories={categories}
      action={updateAction}
      defaultValues={{
        title: product.title,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        originalPrice: product.originalPrice,
        inventory: product.inventory,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        media: product.media.map((item) => ({
          id: item.id,
          type: item.type,
          url: item.url,
          alt: item.alt ?? undefined,
          position: item.position,
        })),
      }}
    />
  );
}
