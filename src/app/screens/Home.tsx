import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import { Weather } from "@/components/custom/Weather";
import RestaurantWidget from "@/components/custom/widget/RestaurantWidget";
import WashingMachineWidget from "@/components/custom/widget/WashingMachineWidget";
import useAuth from "@/hooks/account/useAuth";
import { useUser } from "@/hooks/account/useUser";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { AppStackParamList } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

function handleRegistrationError(errorMessage: string) {
  if (Platform.OS === "web") {
    console.error(errorMessage);
  }
  // if (Device.isDevice) alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
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
  const { data: user, isPending, isError, error } = useUser();
  const { t } = useTranslation();
  const { toast } = useToast();

  const { saveExpoPushToken } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notificationOpened, setNotificationOpened] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
  const [notificationData, setNotificationData] = useState<any>(null);
  const navigation = useNavigation<AppScreenNavigationProp>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        console.log("Retrieved Expo Push Token:", token);
        setExpoPushToken(token ?? "");
        await saveExpoPushToken(token ?? "");
      })
      // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
      .catch((error: any) => {
        console.error("Error retrieving token:", error);
        setExpoPushToken(`${error}`);
      });
  }, [saveExpoPushToken]);

  // Check if app was opened from a notification when component mounts
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
        if (screen) {
          navigation.navigate(screen);
        }
      }
    };
    checkInitialNotification().then((r) => r);
  }, [navigation.navigate]);

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
    <Page refreshing={isFetching} onRefresh={refetch} className="gap-6">
      <Text className="h1 m-4">
        {t("common.welcome")}{" "}
        <Text className="text-primary">{user?.first_name || "Newf"}</Text>
      </Text>
      <Weather />
      <RestaurantWidget />
      <WashingMachineWidget />
    </Page>
  );
};

export default Home;
