import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import WidgetCustomizationModal from "@/components/common/WidgetCustomizationModal";
import {
  WeatherSkeleton,
  WeatherWidget,
} from "@/components/custom/WeatherWidget";
import EmploiDuTempsWidget from "@/components/custom/widget/EmploiDuTempsWidget";
import { EmploiDuTempsWidgetLoading } from "@/components/custom/widget/EmploiDuTempsWidgetLoading";
import RestaurantWidget, {
  RestaurantWidgetLoading,
} from "@/components/custom/widget/RestaurantWidget";
import WashingMachineWidget, {
  WashingMachineWidgetLoading,
} from "@/components/custom/widget/WashingMachineWidget";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { useUser } from "@/hooks/account/useUser";
import { useHomeWidgetPreferences } from "@/hooks/useWidgetPreferences";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { isDinner, isLunch, isWeekend } from "@/lib/utils";
import { washingMachineNotificationService } from "@/services/notifications/washingMachineNotifications";
import type { AppStackParamList } from "@/services/storage/types";
import type { WidgetPreference } from "@/services/storage/widgetPreferences";

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

interface DraggableWidgetItem {
  id: string;
  key: string;
  component: React.ReactNode;
}

export const Home = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { saveExpoPushToken } = useAuth();
  const {
    enabledWidgets,
    widgets,
    updateOrder,
    loading: widgetsLoading,
  } = useHomeWidgetPreferences();

  const [_expoPushToken, setExpoPushToken] = useState("");
  const [_notificationOpened, setNotificationOpened] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
  const [_notificationData, setNotificationData] = useState<any>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const navigation = useNavigation<AppScreenNavigationProp>();

  // Memoize the widgets prop for the modal
  const memoizedWidgetsForModal = useMemo(() => widgets, [widgets]);

  useEffect(() => {
    // Initialize notification service
    washingMachineNotificationService.initialize();

    // Clean up old notifications periodically
    const cleanupInterval = setInterval(() => {
      washingMachineNotificationService.cleanup();
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
  const isEmploiDuTempsFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.emploiDuTemps,
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
    isMenuFetching ||
    isEmploiDuTempsFetching ||
    isWashingMachinesFetching ||
    isWeatherFetching;

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.restaurantMenu }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emploiDuTemps }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.washingMachines }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.weather }),
    ]);
  };

  const getWidgetComponent = useCallback((widgetId: string) => {
    switch (widgetId) {
      case "weather":
        return <WeatherWidget />;
      case "restaurant":
        return <RestaurantWidget />;
      case "emploiDuTemps":
        return <EmploiDuTempsWidget />;
      case "washingMachine":
        return <WashingMachineWidget />;
      default:
        return null;
    }
  }, []);

  const draggableWidgets: DraggableWidgetItem[] = useMemo(() => {
    return enabledWidgets
      .map((widget) => ({
        id: widget.id,
        key: widget.id,
        component: getWidgetComponent(widget.id),
      }))
      .filter((item) => item.component !== null);
  }, [enabledWidgets, getWidgetComponent]);

  const renderWidget = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<DraggableWidgetItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={200}
          style={{
            opacity: isActive ? 0.8 : 1,
            transform: [{ scale: isActive ? 1.02 : 1 }],
          }}
          activeOpacity={1}
        >
          {item.component}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const handleDragEnd = async ({ data }: { data: DraggableWidgetItem[] }) => {
    const reorderedWidgets = data
      .map((item, index) => {
        const originalWidget = enabledWidgets.find((w) => w.id === item.id);
        return originalWidget ? { ...originalWidget, order: index } : null;
      })
      .filter(Boolean) as WidgetPreference[];

    await updateOrder(reorderedWidgets);
  };

  const handleCustomizationSave = async (
    updatedWidgets: WidgetPreference[],
  ) => {
    await updateOrder(updatedWidgets);
    setShowCustomizationModal(false);
  };

  if (widgetsLoading) {
    return <HomeLoading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Page
        disableScroll={true}
        refreshing={isFetching}
        onRefresh={refetch}
        title={t("common.welcome")}
        newfName={user?.first_name || "Newf"}
      >
        <DraggableFlatList
          data={draggableWidgets}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.key}
          renderItem={renderWidget}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            gap: 24,
            paddingTop: 10,
            paddingBottom: 12,
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 50,
              }}
            >
              <Text style={{ fontSize: 16, color: theme.text }}>
                {t("common.noWidgetsEnabled")}
              </Text>
              <Button
                label={t("common.customizeWidgets")}
                onPress={() => setShowCustomizationModal(true)}
                variant="link"
                className="mt-4"
              />
            </View>
          }
          ListFooterComponent={
            <View
              style={{
                alignItems: "center",
                width: "100%",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Button
                label={t("common.customizeWidgets")}
                variant="ghost"
                onPress={() => setShowCustomizationModal(true)}
                size="sm"
              />
            </View>
          }
        />
      </Page>

      <WidgetCustomizationModal
        visible={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        widgets={memoizedWidgetsForModal}
        onUpdateWidgets={handleCustomizationSave}
        services={[]}
        title={t("common.customizeWidgets")}
        type="widgets"
      />
    </GestureHandlerRootView>
  );
};

export default Home;

export const HomeLoading = () => {
  const { t } = useTranslation();

  return (
    <Page className="gap-6">
      <Text className="h1 m-4">{t("common.welcome")}</Text>
      <WeatherSkeleton />
      {!isWeekend() && !isLunch() && !isDinner() ? (
        <RestaurantWidgetLoading />
      ) : null}
      <EmploiDuTempsWidgetLoading />
      <WashingMachineWidgetLoading />
    </Page>
  );
};
