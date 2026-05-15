"use client";

import { GripVertical, ImagePlus, Loader2, Trash2, Video } from "lucide-react";
import { useState } from "react";

import type { ProductMediaInput } from "@/lib/admin/product-media";
import { getVideoEmbed } from "@/lib/video";

type ProductMediaManagerProps = {
  initialMedia?: ProductMediaInput[];
};

function createId() {
  return `new-${crypto.randomUUID()}`;
}

export function ProductMediaManager({ initialMedia = [] }: ProductMediaManagerProps) {
  const [items, setItems] = useState<ProductMediaInput[]>(
    initialMedia.map((item, index) => ({
      ...item,
      position: index,
    })),
  );
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const images = items.filter((item) => item.type === "IMAGE");
  const videos = items.filter((item) => item.type === "VIDEO");

  const persistItems = (next: ProductMediaInput[]) => {
    setItems(next.map((item, index) => ({ ...item, position: index })));
  };

  const uploadFile = async (file: File, type: "IMAGE" | "VIDEO") => {
    setUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.message || "Upload failed.");
      }

      persistItems([
        ...items,
        {
          id: createId(),
          type,
          url: payload.url,
          alt: file.name,
          position: items.length,
        },
      ]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Try a direct URL instead.",
      );
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;

    persistItems([
      ...items,
      { id: createId(), type: "IMAGE", url, position: items.length },
    ]);
    setImageUrl("");
  };

  const addVideoUrl = () => {
    const url = videoUrl.trim();
    if (!url) return;

    if (!getVideoEmbed(url) && !url.startsWith("/uploads/")) {
      setError("Use a YouTube, Vimeo, MP4/WebM link, or an uploaded video file.");
      return;
    }

    setError("");
    persistItems([
      ...items,
      { id: createId(), type: "VIDEO", url, position: items.length },
    ]);
    setVideoUrl("");
  };

  const removeItem = (index: number) => {
    persistItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    const [current] = next.splice(index, 1);
    next.splice(target, 0, current);
    persistItems(next);
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="mediaPayload" value={JSON.stringify(items)} />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">Product images</h4>
          <span className="text-xs text-gray-500">{images.length} image(s)</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((item) => {
            const index = items.findIndex((entry) => entry === item);
            return (
              <div
                key={`${item.id ?? item.url}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
              >
                <img
                  src={item.url}
                  alt={item.alt || "Product image"}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 p-2 opacity-0 transition group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      className="rounded bg-white/90 p-1 text-gray-700"
                      aria-label="Move image up"
                    >
                      <GripVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded bg-white/90 p-1 text-red-600"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-gray-400 hover:bg-gray-100">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadFile(file, "IMAGE");
                event.currentTarget.value = "";
              }}
            />
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            ) : (
              <ImagePlus className="h-5 w-5 text-gray-500" />
            )}
            <span className="mt-2 px-2 text-xs font-medium text-gray-600">
              Upload image
            </span>
          </label>
        </div>

        <div className="flex gap-2">
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            type="url"
            placeholder="Or paste image URL (https://...)"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add URL
          </button>
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">Product videos</h4>
          <span className="text-xs text-gray-500">{videos.length} video(s)</span>
        </div>

        {videos.length ? (
          <div className="space-y-3">
            {videos.map((item) => {
              const index = items.findIndex((entry) => entry === item);
              const embed = getVideoEmbed(item.url);

              return (
                <div
                  key={`${item.id ?? item.url}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                >
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Video className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {embed?.kind === "youtube"
                        ? "YouTube video"
                        : embed?.kind === "vimeo"
                          ? "Vimeo video"
                          : "Video file"}
                    </p>
                    <p className="truncate text-xs text-gray-500">{item.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                    aria-label="Remove video"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Add a YouTube, Vimeo, or direct MP4/WebM link. Videos appear on the product page gallery.
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            type="url"
            placeholder="YouTube, Vimeo, or video file URL"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={addVideoUrl}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add video
          </button>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadFile(file, "VIDEO");
              event.currentTarget.value = "";
            }}
          />
          <span className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
            Upload video file
          </span>
        </label>
      </div>
    </div>
  );
}

