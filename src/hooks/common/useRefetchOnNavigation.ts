import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { usePathname } from "expo-router";
import { useEffect, useRef } from "react";

/**
 * Keeps what is on screen up to date without a manual refresh:
 * - Screens stay mounted under the one on top (stacks, tabs), so going back to one does not mount its queries
 *   again. On every navigation, the queries on screen whose data is older than their staleTime are refetched.
 * - A push notification received while the app is open means something changed on the server (a new event, a
 *   waiting list offer…): everything is refetched.
 * Coming back from the background and reconnecting are handled by React Query (see query-client-setup).
 */
export const useRefetchOnNavigation = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    void queryClient.refetchQueries({
      type: "active",
      stale: true,
      predicate: (query) => query.meta?.live !== false,
    });
  }, [pathname, queryClient]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(() => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.meta?.live !== false,
      });
    });
    return () => subscription.remove();
  }, [queryClient]);
};
