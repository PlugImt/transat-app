import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";
import type { AppStackParamList } from "@/types";
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
  const { saveExpoPushToken } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notificationOpened, setNotificationOpened] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
  const [notificationData, setNotificationData] = useState<any>(null);
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

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
      // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
      .catch((error: any) => {
        setExpoPushToken(`${error}`);
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
  }, [navigation.navigate]);

  return { expoPushToken, notificationOpened, notificationData };
}
