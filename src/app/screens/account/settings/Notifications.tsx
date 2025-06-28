import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Divider from "@/components/common/Divider";
import Page from "@/components/common/Page";
import { Switch } from "@/components/common/Switch";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import useNotification from "@/hooks/account/useNotification";

export const Notifications = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const {
    data: notifications,
    isPending,
    toggleNotification,
    isToggling,
  } = useNotification();

  const onRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notification }),
    ]);
  };

  return (
    <Page
      goBack
      className="gap-6"
      refreshing={isPending}
      onRefresh={onRefresh}
      title={t("settings.notifications.notifications")}
    >
      <View className="gap-2">
        <Text className="h2 mx-4" style={{ color: theme.text }}>
          {t("services.title")}
        </Text>
        <View
          style={{ backgroundColor: theme.card }}
          className="rounded-lg px-6 py-6 gap-6"
        >
          <View className="flex-row justify-between gap-4 items-center">
            <View className="gap-1 flex-1">
              <Text style={{ color: theme.text }}>
                {t("services.restaurant.title")}
              </Text>
              <Text style={{ color: theme.textSecondary }} className="text-sm">
                {t("settings.notifications.toggleRestaurant")}
              </Text>
            </View>
            <Switch
              value={notifications?.RESTAURANT === true}
              onValueChange={() => toggleNotification("RESTAURANT")}
              disabled={isToggling}
            />
          </View>
          <Divider />
          <View className="flex-row justify-between gap-4 items-center">
            <View className="gap-1 flex-1">
              <Text style={{ color: theme.text }}>
                {t("services.traq.title")}
              </Text>
              <Text style={{ color: theme.textSecondary }} className="text-sm">
                {t("settings.notifications.toggleTraq")}
              </Text>
            </View>
            <Switch
              value={notifications?.TRAQ === true}
              onValueChange={() => toggleNotification("TRAQ")}
              disabled={isToggling}
            />
          </View>
        </View>
      </View>
    </Page>
  );
};

export default Notifications;
