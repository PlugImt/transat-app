import Page from "@/components/common/Page";
import { Weather } from "@/components/custom/Weather";
import RestaurantWidget from "@/components/custom/widget/RestaurantWidget";
import WashingMachineWidget from "@/components/custom/widget/WashingMachineWidget";
import { useAuth } from "@/hooks/useAuth";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  if (Platform.OS === "web") {
    console.error(errorMessage);
  }
  if (Device.isDevice) alert(errorMessage);
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
      // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
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

  const queryClient = useQueryClient();
  const isMenuFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.restaurantMenu,
    }) > 0;
  const isWashingMachinesFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.washingMachines,
    }) > 0;
  const isWeatherFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.weather,
    }) > 0;
  const isFetching =
    isMenuFetching || isWashingMachinesFetching || isWeatherFetching;

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.restaurantMenu }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.washingMachines }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.weather }),
    ]);
  };

  return (
    <Page refreshing={isFetching} onRefresh={refetch}>
      <Text className="h1 m-4">
        {t("common.welcome")}{" "}
        <Text className="text-primary">{user?.name || "Newf"}</Text>
      </Text>
      <Weather />
      <RestaurantWidget />
      <WashingMachineWidget />

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
