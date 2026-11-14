import {
  focusManager,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  getAlbumPhotos,
  getPhoto,
  getPhotoAlbum,
  getPhotoAlbums,
  getPhotos,
} from "@/api";
import { STATIC_QUERY_META } from "@/api/query-client";
import { QUERY_KEYS } from "@/constants";

// The library is large and changes at most when the backend syncs (minutes): never refetch it whole on focus or
// mount, because refetching an infinite query replays every page already scrolled. Pull-to-refresh resets it, and
// useFreshFirstPage brings new photos in when the screen comes back into view.
const STATIC_LIBRARY = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  meta: STATIC_QUERY_META,
} as const;

/** How often coming back to the library may ask the server whether its first page changed. */
const FIRST_PAGE_CHECK_EVERY = 30 * 1000;

type Pages<TPage> = { pages: TPage[]; pageParams: unknown[] };

/**
 * New photos and albums show up first. When the screen comes back into view (navigation or app foreground), only
 * the first page is fetched again; if it differs from the cached one, the list restarts from that fresh page.
 * Nothing else is replayed, and nothing moves when the library did not change.
 */
const useFreshFirstPage = <TPage>(
  queryKey: readonly unknown[],
  fetchFirst: () => Promise<TPage>,
  signature: (page: TPage) => string,
) => {
  const queryClient = useQueryClient();
  const latest = useRef({ queryKey, fetchFirst, signature });
  latest.current = { queryKey, fetchFirst, signature };
  const lastCheck = useRef(0);

  const check = useCallback(async () => {
    const { queryKey, fetchFirst, signature } = latest.current;
    const state = queryClient.getQueryState<Pages<TPage>>(queryKey);
    const cached = state?.data?.pages[0];
    const since = Math.max(state?.dataUpdatedAt ?? 0, lastCheck.current);
    if (
      !cached ||
      state?.fetchStatus !== "idle" ||
      Date.now() - since < FIRST_PAGE_CHECK_EVERY
    )
      return;
    lastCheck.current = Date.now();
    try {
      const fresh = await fetchFirst();
      if (signature(fresh) === signature(cached)) return;
      queryClient.setQueryData<Pages<TPage>>(queryKey, {
        pages: [fresh],
        pageParams: [undefined],
      });
    } catch {
      // Offline or server error: keep what is shown, the next check retries.
    }
  }, [queryClient]);

  useFocusEffect(
    useCallback(() => {
      void check();
    }, [check]),
  );
  useEffect(
    () =>
      focusManager.subscribe((focused) => {
        if (focused) void check();
      }),
    [check],
  );
};

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
  useFreshFirstPage(
    queryKey,
    () => fetchPage(),
    (page) => page.photos.map((photo) => photo.id).join(),
  );

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
  useFreshFirstPage(
    QUERY_KEYS.photos.albums,
    () => getPhotoAlbums(),
    (page) => JSON.stringify(page.albums),
  );

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
    // A single small request (name, count, cover): it follows the app-wide refreshes, unlike the photo pages.
    queryFn: () => getPhotoAlbum(id),
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
    meta: STATIC_QUERY_META,
  });
