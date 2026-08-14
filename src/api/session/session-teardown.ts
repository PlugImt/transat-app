import * as Sentry from "@sentry/react-native";
import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { storage } from "@/services/storage/asyncStorage";

const DEVICE_SCOPED_QUERY_ROOTS = new Set([
  "homeWidgetPreferences",
  "servicePreferences",
]);

export const clearUserScopedQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    predicate: (query) => {
      const root = String(query.queryKey[0] ?? "");
      return !DEVICE_SCOPED_QUERY_ROOTS.has(root);
    },
  });
};

export const performSessionTeardown = async (queryClient: QueryClient) => {
  await storage.remove("token");
  await storage.remove("newf");
  queryClient.setQueryData(QUERY_KEYS.auth.user, null);
  clearUserScopedQueries(queryClient);
  Sentry.setUser(null);
};
