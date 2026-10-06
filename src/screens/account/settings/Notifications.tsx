import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Divider } from "@/components/common/Divider";
import { Switch } from "@/components/common/Switch";
import { Text } from "@/components/common/Text";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { NotificationType } from "@/dto";
import useNotification from "@/hooks/account/useNotification";

/** One switch per category; add an entry here when the backend adds a category. */
const NOTIFICATION_SETTINGS: {
  type: NotificationType;
  title: string;
  description: string;
}[] = [
  {
    type: "RESTAURANT",
    title: "services.restaurant.title",
    description: "settings.notifications.toggleRestaurant",
  },
  {
    type: "EVENTS",
    title: "services.events.title",
    description: "settings.notifications.toggleEvents",
  },
  {
    type: "EVENT_REMINDERS",
    title: "settings.notifications.eventReminders",
    description: "settings.notifications.toggleEventReminders",
  },
  {
    type: "RESERVATIONS",
    title: "services.reservation.title",
    description: "settings.notifications.toggleReservations",
  },
  {
    type: "TRAQ",
    title: "services.traq.title",
    description: "settings.notifications.toggleTraq",
  },
];

export const Notifications = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    data: preferences,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    setPreference,
    savingService,
  } = useNotification();

  const pageTitle = t("settings.notifications.notifications");

  if (isError) {
    return (
      <ErrorPage
        title={pageTitle}
        error={error}
        refetch={refetch}
        isRefetching={isFetching}
      />
    );
  }

  return (
    <Page refreshing={isFetching} onRefresh={refetch} title={pageTitle}>
      <View
        style={{ backgroundColor: theme.card }}
        className="rounded-lg px-6 py-6 gap-6"
      >
        {NOTIFICATION_SETTINGS.map(({ type, title, description }, index) => (
          <View key={type} className="gap-6">
            {index > 0 && <Divider />}
            <View className="flex-row justify-between gap-4 items-center">
              <View className="gap-1 flex-1">
                <Text>{t(title)}</Text>
                <Text variant="sm" color="muted">
                  {t(description)}
                </Text>
              </View>
              <Switch
                value={preferences?.[type] === true}
                onValueChange={(enabled) => setPreference(type, enabled)}
                disabled={isPending || savingService === type}
              />
            </View>
          </View>
        ))}
      </View>
    </Page>
  );
};

export default Notifications;
