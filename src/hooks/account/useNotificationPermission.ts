import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

/** The operating system's push permission, which is separate from the choices made in the app. */
export const useNotificationPermission = () => {
  // null until the system has answered.
  const [granted, setGranted] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    try {
      const { granted: isGranted } = await Notifications.getPermissionsAsync();
      setGranted(isGranted);
    } catch {
      setGranted(null);
    }
  }, []);

  // Re-read when the user comes back from the system settings.
  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const openSystemSettings = useCallback(() => {
    Linking.openSettings().catch(() => {});
  }, []);

  return { granted, openSystemSettings };
};
