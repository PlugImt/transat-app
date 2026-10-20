import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { registerNotificationCategories } from "@/services/notifications/categories";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";
import { notificationLog } from "@/services/notifications/log";
import useAuth from "../account/useAuth";
import { useDeviceRegistration } from "./useDeviceRegistration";

export function usePushNotifications({
  canPrompt = false,
}: {
  /** The app is usable (signed in, onboarding done): the system permission prompt may be shown. */
  canPrompt?: boolean;
} = {}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAuthenticated = Boolean(user);

  useDeviceRegistration({ canPrompt });

  // The buttons of a notification are named by the app, so they follow its language.
  useEffect(() => {
    if (!isAuthenticated) return;
    registerNotificationCategories({
      reserve: t("services.reservation.reserve"),
      decline: t("common.cancel"),
    }).catch((error) =>
      notificationLog.warn("failed to register notification categories", error),
    );
  }, [isAuthenticated, t]);

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
