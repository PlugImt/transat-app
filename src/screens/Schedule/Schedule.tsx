import React, { useState } from "react";
import type { BottomTabNavigationProp } from "expo-router/build/react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "expo-router/build/react-navigation/native-stack";
import { type CompositeNavigationProp, useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Empty } from "@/components/page/Empty";
import { Page } from "@/components/page/Page";
import { DayCalendar, getEventsForDate } from "@/screens/Schedule/components/DayCalendar";
import { useSchedule } from "@/hooks/services/schedule/useSchedule";
import type { AppStackParamList, BottomTabParamList } from "@/types";

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AppStackParamList>,
  BottomTabNavigationProp<BottomTabParamList>
>;

const ScheduleLoading = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("schedule.title")}>
      <Text color="muted">{t("schedule.loading")}</Text>
    </Page>
  );
};

export const Schedule = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data, isPending, isFetching, isError, error, refetch, isNotConfigured } =
    useSchedule();

  const navigateToCalendarSettings = () => {
    // @ts-expect-error nested tab navigation
    navigation.navigate("AccountScreen", {
      screen: "CalendarSettings",
    });
  };

  if (isPending) {
    return <ScheduleLoading />;
  }

  if (isNotConfigured) {
    return (
      <Page title={t("schedule.title")}>
        <Empty
          title={t("schedule.notConfigured")}
          description={t("schedule.notConfiguredDescription")}
        >
          <Button
            label={t("settings.calendar.configureButton")}
            onPress={navigateToCalendarSettings}
          />
        </Empty>
      </Page>
    );
  }

  const events = getEventsForDate(data?.calendar_data, selectedDate);

  return (
    <Page
      title={t("schedule.title")}
      refreshing={isFetching}
      onRefresh={refetch}
      className="gap-4"
    >
      {isError && <Text color="destructive">{error?.message}</Text>}
      {/* {data?.last_sync_at && (
        <Text color="muted" className="text-right">
          {t("schedule.lastSync", {
            time: getTimeAgo(data.last_sync_at, t),
          })}
        </Text>
      )} */}
      <DayCalendar
        events={events}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </Page>
  );
};

export default Schedule;
