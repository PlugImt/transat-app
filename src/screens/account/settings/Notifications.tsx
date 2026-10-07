import { useQueryClient } from "@tanstack/react-query";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Divider } from "@/components/common/Divider";
import { Switch } from "@/components/common/Switch";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
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
      refreshing={isPending}
      onRefresh={onRefresh}
      title={t("settings.notifications.notifications")}
    >
      {notifications?.map((group) => (
        <View key={group.id} className="gap-2">
          <Text className="mx-4" variant="h2">
            {group.title}
          </Text>
          <View
            style={{ backgroundColor: theme.card }}
            className="rounded-lg px-6 py-6 gap-6"
          >
            {group.items.map((item, index) => (
              <Fragment key={item.service}>
                {index > 0 && <Divider />}
                <View className="flex-row justify-between gap-4 items-center">
                  <View className="gap-1 flex-1">
                    <Text>{item.title}</Text>
                    {item.description ? (
                      <Text variant="sm" color="muted">
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <Switch
                    value={item.enabled}
                    onValueChange={(enabled) =>
                      toggleNotification({ service: item.service, enabled })
                    }
                    disabled={isToggling}
                  />
                </View>
              </Fragment>
            ))}
          </View>
        </View>
      ))}
    </Page>
  );
};

export default Notifications;
