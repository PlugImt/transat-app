import { Calendar as CalendarIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Alert, Linking, View } from "react-native";
import * as Calendar from 'expo-calendar';
import { useState } from "react";
import { Button } from "@/components/common/Button";
import type { EventDetails } from "@/dto/event";
import { Platform } from 'react-native';

interface ExportButtonProps {
  event: EventDetails;
  disabled?: boolean;
}

export const ExportButton = ({ event, disabled }: ExportButtonProps) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

const exportToCalendar = async () => {
  setIsExporting(true);

  try {
    const currentPermission =
      await Calendar.getCalendarPermissions();

    if (currentPermission.status !== "granted") {
      const permissionResult =
        await Calendar.requestCalendarPermissions();

      if (permissionResult.status !== "granted") {
        Alert.alert(
          t("services.events.export.permission.title"),
          t("services.events.export.permission.description")
        );
      }

      return;
    }
    let choosedCalendar;
    if(Platform.OS === 'ios') {
      choosedCalendar = await Calendar.presentPicker();
    }else if(Platform.OS === 'android') {
     let calendars = await Calendar.getCalendars();
       choosedCalendar = calendars.find(cal => cal.allowsModifications);

    }
    if(!choosedCalendar) {
      Alert.alert(t("common.error"), t("services.events.export.error.noCalendar"));
      return;
    }
    
    await choosedCalendar.createEvent( {
      title: event.name,
      startDate: new Date(event.start_date),
      endDate: event.end_date ? new Date(event.end_date) : undefined,
      location: event.location,
      notes: event.description,
      url: event.link,
    });
    Alert.alert(t("common.success"), t("services.events.export.success"));
    if(Platform.OS === 'android') {
      const url = `content://com.android.calendar/time/${new Date(event.start_date).getTime()}`;
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
    if(Platform.OS === 'ios') {
      const appleDate =
      Math.floor(new Date(event.start_date).getTime() / 1000) - 978307200;
      await Linking.openURL(`calshow:${appleDate}`);
    }

  } catch (error) {
    console.error("Export error:", error);
    Alert.alert(t("common.error"), t("services.events.export.error.noCalendar"));
  } finally {
    setIsExporting(false);
  }
};

  return (
    <Button
      label={t("services.events.export.title")}
      onPress={exportToCalendar}
      icon={<CalendarIcon size={16} />}
      disabled={disabled}
      isLoading={isExporting}
      className="w-full"
    />
    
  );
};
