import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  getAlbumPhotos,
  getPhoto,
  getPhotoAlbum,
  getPhotoAlbums,
  getPhotos,
} from "@/api";
import { QUERY_KEYS } from "@/constants";

// The library is large and changes at most when the backend syncs (minutes): never refetch on focus or mount,
// because refetching an infinite query replays every page already scrolled. Refresh is explicit (see below).
const STATIC_LIBRARY = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

const usePhotoPages = (
  queryKey: readonly unknown[],
  fetchPage: (cursor?: string) => ReturnType<typeof getPhotos>,
) => {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.next_cursor ?? undefined,
    ...STATIC_LIBRARY,
  });

  const photos = useMemo(
    () => query.data?.pages.flatMap((page) => page.photos) ?? [],
    [query.data],
  );

  // Back to page one only, instead of replaying every loaded page like refetch() would.
  const refresh = useCallback(
    () => queryClient.resetQueries({ queryKey, exact: true }),
    [queryClient, queryKey],
  );

  return { ...query, photos, refresh };
};

export const usePhotos = () =>
  usePhotoPages(QUERY_KEYS.photos.gallery, getPhotos);

export const useAlbumPhotos = (id: number) =>
  usePhotoPages(QUERY_KEYS.photos.albumPhotos(id), (cursor) =>
    getAlbumPhotos(id, cursor),
  );

export const usePhotoAlbums = () => {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.photos.albums,
    queryFn: ({ pageParam }) => getPhotoAlbums(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.next_cursor ?? undefined,
    ...STATIC_LIBRARY,
  });

  const albums = useMemo(
    () => query.data?.pages.flatMap((page) => page.albums) ?? [],
    [query.data],
  );

  const refresh = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: QUERY_KEYS.photos.albums,
        exact: true,
      }),
    [queryClient],
  );

  return { ...query, albums, refresh };
};

export const usePhotoAlbum = (id: number) => {
  const { data, isPending, isFetching, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.photos.album(id),
    queryFn: () => getPhotoAlbum(id),
    ...STATIC_LIBRARY,
  });

  return { data, isPending, isFetching, refetch, error, isError };
};

/** Full metadata of one photo (name, size, links). Only fetched when the viewer needs it. */
export const usePhotoDetail = (id: string | undefined, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.photos.detail(id ?? ""),
    queryFn: () => getPhoto(id as string),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
