import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";
import useAuth from "../account/useAuth";
import { useDeviceRegistration } from "./useDeviceRegistration";

export function usePushNotifications({
  canPrompt = false,
}: {
  /** The app is usable (signed in, onboarding done): the system permission prompt may be shown. */
  canPrompt?: boolean;
} = {}) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  useDeviceRegistration({ canPrompt });

  useEffect(() => {
    if (!isAuthenticated) return;
    laundryNotificationService.initialize();
    const cleanupInterval = setInterval(() => {
      laundryNotificationService.cleanup();
    }, 60000);
    return () => {
      clearInterval(cleanupInterval);
    };
  }, [isAuthenticated]);

  // Signed out: a pending tap can't be opened and must not replay after the next login.
  useEffect(() => {
    if (user === null) {
      Notifications.clearLastNotificationResponseAsync().catch(() => {});
    }
  }, [user]);
}
