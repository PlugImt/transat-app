const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heic",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** The photo library only accepts common formats; RAW files (CR3, RW2…) must be opened in Drive instead. */
export const extensionForMime = (mime: string) =>
  MIME_EXTENSIONS[mime.toLowerCase()] ?? null;

export const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
