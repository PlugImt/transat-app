import * as Sentry from "@sentry/react-native";
import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { signOutCurrentDevice } from "@/services/devices/deviceSignOut";
import { clearNotificationsForSession } from "@/services/notifications/sessionCleanup";
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
  // Before the token goes: the server must stop pushing this account's notifications to this phone, and what
  // it already pushed must leave the tray. Neither step throws.
  await Promise.all([signOutCurrentDevice(), clearNotificationsForSession()]);
  await storage.remove("token");
  await storage.remove("newf");
  await storage.remove("expoPushToken");
  queryClient.setQueryData(QUERY_KEYS.user, null);
  clearUserScopedQueries(queryClient);
  Sentry.setUser(null);
};
