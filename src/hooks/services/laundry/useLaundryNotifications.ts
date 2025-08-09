import { t } from "i18next";
import { useEffect, useState } from "react";
import { useToast } from "@/components/common/Toast";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";

export const useLaundryNotifications = (machineNumber: string) => {
  const { toast } = useToast();
  const [isNotificationSet, setIsNotificationSet] = useState(false);
  const [_forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Check initial state
    const checkNotificationState = () => {
      const isSet = laundryNotificationService.isNotificationSet(machineNumber);
      setIsNotificationSet(isSet);
    };

    checkNotificationState();

    // Poll for changes every few seconds to keep UI in sync
    const interval = setInterval(checkNotificationState, 2000);

    return () => clearInterval(interval);
  }, [machineNumber]);

  const scheduleNotification = async (
    machineType: string,
    timeRemaining: number,
    minutesBefore = 5,
  ): Promise<boolean> => {
    const success = await laundryNotificationService.scheduleNotification(
      machineNumber,
      machineType,
      timeRemaining,
      minutesBefore,
    );

    if (success) {
      setForceUpdate((prev) => prev + 1);
    } else {
      toast(t("services.laundry.getNotificationError"), "destructive");
    }

    return success;
  };

  const cancelNotification = async (): Promise<boolean> => {
    const success =
      await laundryNotificationService.cancelNotification(machineNumber);

    if (success) {
      setForceUpdate((prev) => prev + 1);
    }

    return success;
  };

  const shouldDisableButton = (timeRemaining: number): boolean => {
    return laundryNotificationService.shouldDisableNotificationButton(
      machineNumber,
      timeRemaining,
    );
  };

  return {
    isNotificationSet,
    scheduleNotification,
    cancelNotification,
    shouldDisableButton,
  };
};
