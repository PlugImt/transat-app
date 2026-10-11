import { useQueryClient } from "@tanstack/react-query";
import { File, Paths } from "expo-file-system";
import { Asset, requestPermissionsAsync } from "expo-media-library";
import { useCallback, useState } from "react";
import { getPhoto } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { extensionForMime } from "@/utils/photo.utils";

export type SaveStatus = "idle" | "saving" | "saved" | SaveError;

export type SaveError =
  | "permission"
  | "permissionBlocked"
  | "unsupported"
  | "tooLarge"
  | "incomplete"
  | "network"
  | "unknown";

/** Originals above this are left to Google Drive instead of filling the phone's storage from the app. */
const MAX_BYTES = 150 * 1024 * 1024;

class SaveFailure extends Error {
  constructor(readonly code: SaveError) {
    super(code);
  }
}

/** Saves the original of a photo to the device's photo library, from the public Drive download link. */
export const useSavePhoto = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<SaveStatus>("idle");

  const save = useCallback(
    async (id: string) => {
      setStatus("saving");
      let cached: File | null = null;
      try {
        const detail = await queryClient.fetchQuery({
          queryKey: QUERY_KEYS.photos.detail(id),
          queryFn: () => getPhoto(id),
          staleTime: 30 * 60 * 1000,
        });

        // Photobooth files have no extension: derive it from the MIME type the backend indexed.
        const extension = extensionForMime(detail.mime_type);
        if (!extension) throw new SaveFailure("unsupported");
        if (detail.size_bytes > MAX_BYTES) throw new SaveFailure("tooLarge");

        const permission = await requestPermissionsAsync(true, ["photo"]);
        if (!permission.granted) {
          throw new SaveFailure(
            permission.canAskAgain ? "permission" : "permissionBlocked",
          );
        }

        cached = new File(Paths.cache, `transat-${id}.${extension}`);
        const downloaded = await File.downloadFileAsync(
          detail.download_url,
          cached,
          { idempotent: true },
        );
        // Google answers with an HTML warning page instead of the file when it cannot serve it directly.
        if (detail.size_bytes > 0 && downloaded.size !== detail.size_bytes) {
          throw new SaveFailure("incomplete");
        }

        await Asset.create(downloaded.uri);
        setStatus("saved");
      } catch (error) {
        setStatus(error instanceof SaveFailure ? error.code : classify(error));
      } finally {
        try {
          if (cached?.exists) cached.delete();
        } catch {
          // The cache folder is cleaned by the system anyway.
        }
      }
    },
    [queryClient],
  );

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, save, reset };
};

const classify = (error: unknown): SaveError => {
  const message = String((error as Error)?.message ?? error).toLowerCase();
  if (
    /network|offline|internet|timed out|unable to download|connection/.test(
      message,
    )
  ) {
    return "network";
  }
  return "unknown";
};
