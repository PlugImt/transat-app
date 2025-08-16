import * as Notifications from "expo-notifications";
import i18n from "@/i18n";
import { storage } from "@/services/storage/asyncStorage";

export interface LaundryNotificationState {
  machineNumber: string;
  notificationId: string;
  scheduledAt: number;
  minutesBefore: number;
  machineType: string;
  endTime: number; // When the machine will be done
}

const NOTIFICATION_STORAGE_KEY = "laundry_notifications";

// Configure local notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class LaundryNotificationService {
  private notifications: Map<string, LaundryNotificationState> = new Map();

  async initialize() {
    // Load persisted notifications from storage
    const stored = await storage.get<Record<string, LaundryNotificationState>>(
      NOTIFICATION_STORAGE_KEY,
    );

    if (stored) {
      // Filter out expired notifications
      const now = Date.now();
      const activeNotifications = Object.entries(stored).filter(
        ([_, notification]) => notification.endTime > now,
      );

      this.notifications = new Map(activeNotifications);

      // Clean up expired notifications from storage
      if (activeNotifications.length !== Object.keys(stored).length) {
        await this.saveToStorage();
      }
    }
  }

  private async saveToStorage() {
    const notificationsObj = Object.fromEntries(this.notifications);
    await storage.set(NOTIFICATION_STORAGE_KEY, notificationsObj);
  }

  async scheduleNotification(
    machineNumber: string,
    machineType: string,
    timeRemaining: number,
    minutesBefore = 5,
  ): Promise<boolean> {
    try {
      // Cancel existing notification for this machine
      await this.cancelNotification(machineNumber);

      // Don't schedule if not enough time remaining
      if (timeRemaining <= minutesBefore * 60) {
        return false;
      }

      const now = Date.now();
      const endTime = now + timeRemaining * 1000;
      const notificationTime =
        now + (timeRemaining - minutesBefore * 60) * 1000;

      // Schedule the local notification
      const t = i18n.t.bind(i18n);
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: t("services.laundry.almostDone", { number: machineNumber }),
          body: t("services.laundry.almostDoneBody", {
            type: machineType.toLowerCase(),
            minutes: minutesBefore,
          }),
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(notificationTime),
        },
      });

      // Save notification state
      const notificationState: LaundryNotificationState = {
        machineNumber,
        notificationId,
        scheduledAt: now,
        minutesBefore,
        machineType,
        endTime,
      };

      this.notifications.set(machineNumber, notificationState);
      await this.saveToStorage();

      return true;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return false;
    }
  }

  async cancelNotification(machineNumber: string): Promise<boolean> {
    try {
      const notification = this.notifications.get(machineNumber);

      if (notification) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.notificationId,
        );
        this.notifications.delete(machineNumber);
        await this.saveToStorage();
      }

      return true;
    } catch (error) {
      console.error("Error canceling notification:", error);
      return false;
    }
  }

  isNotificationSet(machineNumber: string): boolean {
    return this.notifications.has(machineNumber);
  }

  getNotificationState(machineNumber: string): LaundryNotificationState | null {
    return this.notifications.get(machineNumber) || null;
  }

  // Check if the notification should be disabled (when we're within the notification window)
  shouldDisableNotificationButton(
    machineNumber: string,
    timeRemaining: number,
  ): boolean {
    const notification = this.notifications.get(machineNumber);
    if (!notification) return false;

    // Disable button if we're within the notification window
    return timeRemaining <= notification.minutesBefore * 60;
  }

  // Clean up old notifications
  async cleanup() {
    const now = Date.now();
    let hasChanges = false;

    for (const [machineNumber, notification] of this.notifications.entries()) {
      if (notification.endTime <= now) {
        try {
          await Notifications.cancelScheduledNotificationAsync(
            notification.notificationId,
          );
        } catch (_error) {
          // Notification might already be gone, ignore error
        }
        this.notifications.delete(machineNumber);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await this.saveToStorage();
    }
  }
}

export const laundryNotificationService = new LaundryNotificationService();
