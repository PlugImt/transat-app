import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";
import useAuth from "../account/useAuth";

const handleRegistrationError = (errorMessage: string) => {
  if (Platform.OS === "web") {
    console.error(errorMessage);
  }
  throw new Error(errorMessage);
};

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
};

export function usePushNotifications() {
  const { saveExpoPushToken, user } = useAuth();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (!isAuthenticated) return;
    laundryNotificationService.initialize();
    const cleanupInterval = setInterval(() => {
      laundryNotificationService.cleanup();
    }, 60000);
    registerForPushNotificationsAsync()
      .then((token) => saveExpoPushToken(token ?? ""))
      .catch((error: unknown) => {
        console.warn("[Notifications] Push registration failed", error);
      });
    return () => {
      clearInterval(cleanupInterval);
    };
  }, [saveExpoPushToken, isAuthenticated]);

  // Signed out: a pending tap can't be opened and must not replay after the next login.
  useEffect(() => {
    if (user === null) {
      Notifications.clearLastNotificationResponseAsync().catch(() => {});
    }
  }, [user]);
}
