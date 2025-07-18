import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";
import Animated from "react-native-reanimated";
import { HomeworkWidget } from "@/app/screens/services/homework/widget/HomeworkWidget";
import { HomeworkWidgetLoading } from "@/app/screens/services/homework/widget/HomeworkWidgetLoading";
import {
  RestaurantWidget,
  RestaurantWidgetLoading,
} from "@/app/screens/services/restaurant/widget/RestaurantWidget";
import { TimetableLoadingWidget } from "@/app/screens/services/schedule/widget/TimetableLoadingWidget";
import TimetableWidget from "@/app/screens/services/schedule/widget/TimetableWidget";
import {
  WeatherSkeleton,
  WeatherWidget,
} from "@/app/screens/services/weather/widget/WeatherWidget";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { PreferenceCustomizationButton } from "@/components/custom/PreferenceCustomizationModal";
import { Empty } from "@/components/page/Empty";
import { Page } from "@/components/page/Page";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { useUser } from "@/hooks/account/useUser";
import { useAnimatedHeader } from "@/hooks/useAnimatedHeader";
import { useHomeWidgetPreferences } from "@/hooks/usePreferences";
import { laundryNotificationService } from "@/services/notifications/laundryNotifications";
import type { AppStackParamList } from "@/types";
import { isDinner, isLunch, isWeekend } from "@/utils";
import LaundryWidget, {
  LaundryWidgetLoading,
} from "../services/laundry/widget/LaundryWidget";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

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
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
};

export const Home = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { scrollHandler } = useAnimatedHeader();

  const { saveExpoPushToken } = useAuth();
  const {
    preferences: widgets,
    enabledPreferences: enabledWidgets,
    loading,
    updateOrder,
  } = useHomeWidgetPreferences();

  const [_expoPushToken, setExpoPushToken] = useState("");
  const [_notificationOpened, setNotificationOpened] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
  const [_notificationData, setNotificationData] = useState<any>(null);
  const navigation = useNavigation<AppScreenNavigationProp>();

  useEffect(() => {
    // Initialize notification service
    laundryNotificationService.initialize();

    // Clean up old notifications periodically
    const cleanupInterval = setInterval(() => {
      laundryNotificationService.cleanup();
    }, 60000); // Check every minute

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

    return () => {
      clearInterval(cleanupInterval);
    };
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
        if (screen && typeof screen === "string") {
          // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
          navigation.navigate(screen as any);
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
  const isTimetableFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.timetable,
    }) > 0;
  const isHomeworkFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.homework,
    }) > 0;
  const isLaundrysFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.laundry,
    }) > 0;
  const isWeatherFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.weather,
    }) > 0;
  const isFetching =
    isMenuFetching ||
    isTimetableFetching ||
    isHomeworkFetching ||
    isLaundrysFetching ||
    isWeatherFetching;

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.restaurantMenu }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.homework }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timetable }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.laundry }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.weather }),
    ]);
  };

  const widgetComponents: { [key: string]: React.ReactElement } = {
    weather: <WeatherWidget />,
    restaurant: <RestaurantWidget />,
    timetable: <TimetableWidget />,
    homework: <HomeworkWidget />,
    laundry: <LaundryWidget />,
  };

  const getWidgetComponent = useCallback(
    (widgetId: string): React.ReactElement | null => {
      return widgetComponents[widgetId] || null;
    },
    [],
  );

  if (loading) {
    return <HomeLoading />;
  }

  return (
    <Page
      asChildren
      refreshing={isFetching}
      className="gap-8"
      onRefresh={refetch}
      title={
        <View className="flex-row gap-2 items-center">
          <Text variant="h1" color="text">
            {t("common.welcome")}
          </Text>
          {user?.first_name && (
            <Text variant="h1" color="primary">
              {user.first_name}
            </Text>
          )}
        </View>
      }
    >
      <Animated.FlatList
        data={enabledWidgets}
        renderItem={({ item }) => getWidgetComponent(item.id)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        onScroll={scrollHandler}
        ListEmptyComponent={
          <Empty
            title={t("common.noWidgetsEnabled")}
            description={t("common.noWidgetsEnabledDescription")}
          />
        }
        ListFooterComponent={
          <PreferenceCustomizationButton
            items={widgets}
            title={t("common.customizeWidgets")}
            onUpdate={updateOrder}
          >
            <Button
              label={t("common.customizeWidgets")}
              variant="ghost"
              size="sm"
            />
          </PreferenceCustomizationButton>
        }
      />
    </Page>
  );
};

export default Home;

export const HomeLoading = () => {
  const { t } = useTranslation();

  return (
    <Page className="gap-6" title={t("common.welcome")}>
      <WeatherSkeleton />
      {!isWeekend() && !isLunch() && !isDinner() ? (
        <RestaurantWidgetLoading />
      ) : null}
      <TimetableLoadingWidget />
      <HomeworkWidgetLoading />
      <LaundryWidgetLoading />
    </Page>
  );
};
