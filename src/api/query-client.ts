import { MutationCache, QueryClient } from "@tanstack/react-query";

/**
 * Data stays "fresh" this long: within it, mounting a screen or coming back to it shows the cache without a
 * request. Past it, the screen refetches in the background (see useRefetchOnNavigation and query-client-setup).
 */
export const LIVE_STALE_TIME = 10 * 1000;

/**
 * For data that others change while you look at it (laundry machines, booked slots, members…): refetched this often
 * while a mounted screen uses it and the app is in the foreground (React Query pauses the interval in background).
 */
export const LIVE_POLL_INTERVAL = 30 * 1000;

/** Queries that opt out of the automatic refreshes, like the photo library whose refetch replays every page. */
export const STATIC_QUERY_META = { live: false } as const;

export const queryClient: QueryClient = new QueryClient({
  // Any change made from the app can show anywhere (a club joined appears in its members, an event edited in
  // every list…): after each successful mutation, everything on screen is refetched and the rest is marked stale.
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.options.mutationKey?.[0] === "auth") return; // signing in or out: nothing to refresh
      void queryClient.invalidateQueries({
        predicate: (query) => query.meta?.live !== false,
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: LIVE_STALE_TIME,
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
});
