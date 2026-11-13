import { albumIdFromLink } from "@/navigation/albumLinks";

/**
 * Rewrites the links the system hands to the app before Expo Router matches them. An album's transat.dev page
 * opens its album screen; every other link is left as it is.
 */
export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}): string {
  const albumId = albumIdFromLink(path);
  return albumId !== null ? `/photos/${albumId}` : path;
}
