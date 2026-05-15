export type VideoEmbed = {
  kind: "youtube" | "vimeo" | "file";
  embedUrl: string;
  thumbnailUrl?: string;
};

export function getVideoEmbed(url: string): VideoEmbed | null {
  const value = url.trim();
  if (!value) return null;

  const youtubeMatch =
    value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i) ||
    value.match(/youtube\.com\/embed\/([\w-]+)/i);

  if (youtubeMatch?.[1]) {
    const id = youtubeMatch[1];
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeoMatch = value.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch?.[1]) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(value) || value.startsWith("/uploads/")) {
    return {
      kind: "file",
      embedUrl: value,
    };
  }

  return null;
}
