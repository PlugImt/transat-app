import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import { Divider } from "@/components/common/Divider";
import { Switch } from "@/components/common/Switch";
import { Text } from "@/components/common/Text";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { NotificationType } from "@/dto";
import { useIsAcademics } from "@/hooks/account";
import useNotification from "@/hooks/account/useNotification";
import { useNotificationPermission } from "@/hooks/account/useNotificationPermission";

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
  {
    type: "PHOTOS",
    title: "photos.title",
    description: "settings.notifications.togglePhotos",
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
  const isAcademics = useIsAcademics();
  const { granted, openSystemSettings } = useNotificationPermission();

  const pageTitle = t("settings.notifications.notifications");
  // Photos is shown once the server reports it (an older backend does not know it) and only where the tab exists.
  const visibleSettings = NOTIFICATION_SETTINGS.filter(
    ({ type }) =>
      type !== "PHOTOS" || (!isAcademics && preferences?.PHOTOS !== undefined),
  );

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
        {visibleSettings.map(({ type, title, description }, index) => (
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
        {/* The phone's permission is separate from the choices above: it is only reported, never changed here. */}
        {granted === false && (
          <View className="gap-6">
            <Divider />
            <View className="gap-3">
              <Text variant="sm" color="muted">
                {t("settings.notifications.permissionOff")}
              </Text>
              <Button
                variant="secondary"
                size="sm"
                label={t("settings.notifications.openSystemSettings")}
                onPress={openSystemSettings}
              />
            </View>
          </View>
        )}
      </View>
    </Page>
  );
};

export default Notifications;
