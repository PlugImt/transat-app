import { Platform, Share } from "react-native";

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

const DRIVE_FOLDER_URL =
  /^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+$/;

/** Only a real Drive folder link is opened: anything else means the backend has no usable event folder. */
export const isDriveFolderUrl = (
  url: string | null | undefined,
): url is string => !!url && DRIVE_FOLDER_URL.test(url);

/** Opens the system share sheet with a link: iOS takes the url apart, Android shares text only. */
export const shareLink = (title: string, url: string) =>
  Share.share(
    Platform.OS === "ios"
      ? { message: title, url }
      : { message: `${title}\n${url}` },
  );
