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
    const { status } = await Calendar.requestCalendarPermissions(); 
    if (status !== "granted") {
      Alert.alert(
        t("permissionsRequired"),
        t("enableInSettings"),
        [
          { text: t("cancel"), style: "cancel" },
          { text: t("openSettings"), onPress: () => Linking.openSettings() },
        ]
      );
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
      Alert.alert(t("error"), t("noCalendar"));
      return;
    }
    
    const existingEvents = await choosedCalendar.listEvents(
      new Date(event.start_date),
      event.end_date ? new Date(event.end_date) : new Date(event.start_date)
    );

    const duplicateEvent = existingEvents.find(
      (e) => e.title === event.name && e.startDate.toLocaleString() === new Date(event.start_date).toLocaleString()
    );

    if (duplicateEvent) {
      Alert.alert(t("error"), t("Duplicate"));
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
    if(Platform.OS === 'android') {
      await Linking.openURL(`content://com.android.calendar/time/${new Date(event.start_date).getTime()}`);
    }
    if(Platform.OS === 'ios') {
      await Linking.openURL(`calshow:${new Date(event.start_date).getTime() / 1000}`);
    }

    Alert.alert(t("success"), t("success"));

  } catch (error) {
    console.error("Export error:", error);
    Alert.alert(t("error"), t("failed"));
  } finally {
    setIsExporting(false);
  }
};

  return (
    <Button
      label={t("export")}
      onPress={exportToCalendar}
      icon={<CalendarIcon size={16} />}
      disabled={disabled}
      isLoading={isExporting}
      className="w-full"
    />
    
  );
};
