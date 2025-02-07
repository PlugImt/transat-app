import { Button } from "@/components/common/ButtonV2";
import Page from "@/components/common/Page";
import { Weather } from "@/components/custom/Weather";
import RestaurantWidget from "@/components/custom/Widget/RestaurantWidget";
import { WashingMachineWidget } from "@/components/custom/Widget/WashingMachineWidget";
import { useAuth } from "@/hooks/useAuth";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
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
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(true);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("Retrieved Expo Push Token:", token);
        setExpoPushToken(token ?? "");
      })
      // biome-ignore lint/suspicious/noExplicitAny: à être remplacé par React Query
      .catch((error: any) => {
        console.error("Error retrieving token:", error);
        setExpoPushToken(`${error}`);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Page refreshing={refreshing} onRefresh={() => setRefreshing(!refreshing)}>
      <Text className="h1 m-4">
        {t("common.welcome")}{" "}
        <Text className="text-primary">{user?.name || "Yohann"}</Text>
      </Text>
      <Weather refreshing={refreshing} setRefreshing={setRefreshing} />
      <RestaurantWidget refreshing={refreshing} setRefreshing={setRefreshing} />
      <WashingMachineWidget
        refreshing={refreshing}
        setRefreshing={setRefreshing}
      />

      <View className="flex items-center flex-col gap-5">
        <Text className="text-center text-foreground">
          Your Expo push token: {expoPushToken}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text className="text-foreground font-black">
            Title: {notification?.request.content.title}{" "}
          </Text>
          <Text className="text-foreground font-black">
            Body: {notification?.request.content.body}
          </Text>
          <Text className="text-foreground font-black">
            Data:{" "}
            {notification && JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
      </View>
    </Page>
  );
};

export default Home;
