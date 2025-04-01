import Divider from "@/components/common/Divider";
import Page from "@/components/common/Page";
import { Switch } from "@/components/common/Switch";
import useNotification from "@/hooks/account/useNotification";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const Notifications = () => {
  const { t } = useTranslation();
  const {
    data: notifications,
    isPending,
    toggleNotification,
    isToggling,
    getNotificationEnabled,
  } = useNotification();

  const [notifRestaurant, setNotifRestaurant] = useState(
    getNotificationEnabled("restaurant"),
  );
  const [notifTraq, setNotifTraq] = useState(getNotificationEnabled("traq"));

  useEffect(() => {
    if (notifications) {
      setNotifRestaurant(notifications.restaurant);
      setNotifTraq(notifications.traq);
    }
  }, [notifications]);

  const handleRestaurantToggle = () => {
    toggleNotification("restaurant");
    setNotifRestaurant(!notifRestaurant);
  };

  const handleTraqToggle = () => {
    toggleNotification("traq");
    setNotifTraq(!notifTraq);
  };

  return (
    <Page className="gap-6" refreshing={isPending}>
      <Text className="h1 m-4">
        {t("settings.notifications.notifications")}
      </Text>

      <View className="gap-2">
        <Text className="h2 mx-4">{t("services.title")}</Text>
        <View className="bg-card rounded-lg px-6 py-6 gap-6">
          <View className="flex-row justify-between gap-4 items-center">
            <View className="gap-1 flex-1">
              <Text className="text-foreground">
                {t("services.restaurant.title")}
              </Text>
              <Text className="text-sm text-foreground/60">
                {t("settings.notifications.toggleRestaurant")}
              </Text>
            </View>
            <Switch
              value={notifRestaurant}
              onValueChange={handleRestaurantToggle}
              disabled={isToggling}
            />
          </View>
          <Divider />
          <View className="flex-row justify-between gap-4 items-center">
            <View className="gap-1 flex-1">
              <Text className="text-foreground">
                {t("services.traq.title")}
              </Text>
              <Text className="text-sm text-foreground/60">
                {t("settings.notifications.toggleTraq")}
              </Text>
            </View>
            <Switch
              value={notifTraq}
              onValueChange={handleTraqToggle}
              disabled={isToggling}
            />
          </View>
        </View>
      </View>
    </Page>
  );
};

export default Notifications;
