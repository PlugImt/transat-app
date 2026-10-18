import * as Notifications from "expo-notifications";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";
import { notificationLog } from "@/services/notifications/log";

const attempt = async (step: string, work: () => Promise<unknown>) => {
  try {
    await work();
  } catch (error) {
    notificationLog.warn(`cleanup ${step} failed`, error);
  }
};

/**
 * Removes what the account that is leaving left on this phone: notifications still in the tray, reminders it
 * scheduled, the badge, and a tap that was waiting to be handled. The next account on the phone must not see
 * any of it. Every step is independent and none throws, so a logout never fails because of one of them.
 */
export const clearNotificationsForSession = async () => {
  await Promise.all([
    attempt("tray", () => Notifications.dismissAllNotificationsAsync()),
    attempt("scheduled", () =>
      Notifications.cancelAllScheduledNotificationsAsync(),
    ),
    attempt("badge", () => Notifications.setBadgeCountAsync(0)),
    attempt("pending tap", () =>
      Notifications.clearLastNotificationResponseAsync(),
    ),
    attempt("laundry", () => laundryNotificationService.reset()),
  ]);
};
