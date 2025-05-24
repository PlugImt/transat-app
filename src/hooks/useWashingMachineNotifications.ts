import { useState, useEffect } from "react";
import { washingMachineNotificationService } from "@/services/notifications/washingMachineNotifications";

export function useWashingMachineNotifications(machineNumber: string) {
  const [isNotificationSet, setIsNotificationSet] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Check initial state
    const checkNotificationState = () => {
      const isSet = washingMachineNotificationService.isNotificationSet(machineNumber);
      setIsNotificationSet(isSet);
    };

    checkNotificationState();

    // Poll for changes every few seconds to keep UI in sync
    const interval = setInterval(checkNotificationState, 2000);

    return () => clearInterval(interval);
  }, [machineNumber, forceUpdate]);

  const scheduleNotification = async (
    machineType: string,
    timeRemaining: number,
    minutesBefore: number = 5
  ): Promise<boolean> => {
    const success = await washingMachineNotificationService.scheduleNotification(
      machineNumber,
      machineType,
      timeRemaining,
      minutesBefore
    );
    
    if (success) {
      setForceUpdate(prev => prev + 1);
    }
    
    return success;
  };

  const cancelNotification = async (): Promise<boolean> => {
    const success = await washingMachineNotificationService.cancelNotification(machineNumber);
    
    if (success) {
      setForceUpdate(prev => prev + 1);
    }
    
    return success;
  };

  const shouldDisableButton = (timeRemaining: number): boolean => {
    return washingMachineNotificationService.shouldDisableNotificationButton(machineNumber, timeRemaining);
  };

  return {
    isNotificationSet,
    scheduleNotification,
    cancelNotification,
    shouldDisableButton,
  };
} 