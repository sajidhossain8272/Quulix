import type { MediaType, ProductMedia } from "@prisma/client";

export type ProductMediaInput = {
  id?: string;
  type: MediaType;
  url: string;
  alt?: string;
  position: number;
};

export function parseProductMediaPayload(raw: FormDataEntryValue | null) {
  if (!raw || typeof raw !== "string" || !raw.trim()) {
    return [] as ProductMediaInput[];
  }

  try {
    const parsed = JSON.parse(raw) as ProductMediaInput[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item?.url?.trim())
      .map((item, index): ProductMediaInput => ({
        id: item.id,
        type: item.type === "VIDEO" ? "VIDEO" : "IMAGE",
        url: item.url.trim(),
        alt: item.alt?.trim() || undefined,
        position: Number.isFinite(item.position) ? item.position : index,
      }));
  } catch {
    return [];
  }
}

export async function syncProductMedia(
  productId: string,
  mediaItems: ProductMediaInput[],
  existing: ProductMedia[],
) {
  const { prisma } = await import("@/lib/prisma");
  const nextIds = new Set(
    mediaItems
      .filter((item) => item.id && !item.id.startsWith("new-"))
      .map((item) => item.id!),
  );

  const toDelete = existing
    .filter((item) => !nextIds.has(item.id))
    .map((item) => item.id);

  if (toDelete.length) {
    await prisma.productMedia.deleteMany({
      where: { id: { in: toDelete }, productId },
    });
  }

  for (const item of mediaItems) {
    const isExisting = item.id && !item.id.startsWith("new-");

    if (isExisting) {
      await prisma.productMedia.update({
        where: { id: item.id! },
        data: {
          type: item.type,
          url: item.url,
          alt: item.alt,
          position: item.position,
        },
      });
      continue;
    }

    await prisma.productMedia.create({
      data: {
        productId,
        type: item.type,
        url: item.url,
        alt: item.alt,
        position: item.position,
      },
    });
  }
}
