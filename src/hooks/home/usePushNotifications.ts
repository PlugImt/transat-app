import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";
import type { AppNavigation } from "@/types";
import useAuth from "../account/useAuth";

interface NotificationContent {
  title?: string | null;
  body?: string | null;
  data: {
    screen?: string;
    [key: string]: unknown;
  };
}

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
  const { saveExpoPushToken } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notificationOpened, setNotificationOpened] = useState(false);
  const [notificationData, setNotificationData] =
    useState<NotificationContent | null>(null);
  const navigation = useNavigation<AppNavigation>();

  useEffect(() => {
    laundryNotificationService.initialize();
    const cleanupInterval = setInterval(() => {
      laundryNotificationService.cleanup();
    }, 60000);
    registerForPushNotificationsAsync()
      .then(async (token) => {
        setExpoPushToken(token ?? "");
        await saveExpoPushToken(token ?? "");
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setExpoPushToken(errorMessage);
      });
    return () => {
      clearInterval(cleanupInterval);
    };
  }, [saveExpoPushToken]);

  useEffect(() => {
    const checkInitialNotification = async () => {
      const lastNotificationResponse =
        await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        setNotificationOpened(true);
        setNotificationData(
          lastNotificationResponse.notification.request.content,
        );
        const screen =
          lastNotificationResponse.notification.request.content.data.screen;
        if (screen && typeof screen === "string") {
          // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
          navigation.navigate(screen as any);
        }
      }
    };
    checkInitialNotification();
  }, [navigation]);

  return { expoPushToken, notificationOpened, notificationData };
}
