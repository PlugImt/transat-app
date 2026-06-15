import { useRoute } from "expo-router/react-navigation";
import {
  Bell,
  BellOff,
  Clock,
  ExternalLink,
  MapPin,
} from "lucide-react-native";
import { Calendar as CalendarIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Alert, Linking, View } from "react-native";
import * as Calendar from "expo-calendar";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { EventDetails } from "@/dto/event";
import { useDate } from "@/hooks/common";
import {
  useJoinEventMutation,
  useLeaveClubMutation,
} from "@/hooks/services/event/useEvent";
import type { EventDetailsRouteProp } from "./EventDetails";
import { Platform } from 'react-native';
import BottomSheet from "@gorhom/bottom-sheet";

interface NotificationButtonProps {
  isMember: boolean;
  disabled?: boolean;
}

const NotificationButton = ({
  isMember,
  disabled,
}: NotificationButtonProps) => {
  const { t } = useTranslation();
  const route = useRoute<EventDetailsRouteProp>();
  const { id } = route.params;

  const { mutate: joinEvent, isPending: isJoining } = useJoinEventMutation(id);
  const { mutate: leaveEvent, isPending: isLeaving } = useLeaveClubMutation(id);

  if (isMember) {
    return (
      <Button
        label={t("user.notInterested")}
        onPress={() => leaveEvent()}
        icon={<BellOff />}
        className="flex-1"
        disabled={disabled}
        isUpdating={isJoining || isLeaving}
      />
    );
  }
  return (
    <Button
      label={t("user.interested")}
      onPress={() => joinEvent()}
      icon={<Bell />}
      className="flex-1"
      disabled={disabled}
      isUpdating={isJoining || isLeaving}
    />
  );
};

interface ExportButtonProps {
  event: EventDetails;
  disabled?: boolean;
}

const ExportButton = ({ event, disabled }: ExportButtonProps) => {
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
      console.log(calendars[0]);
      //let the user choose a calendar
      
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
  
    choosedCalendar.createEvent( {
      title: event.name,
      startDate: new Date(event.start_date),
      endDate: event.end_date ? new Date(event.end_date) : undefined,
      location: event.location,
      notes: event.description,
      url: event.link,
    }).then(() => {
      Alert.alert(t("success"), t("services.events.export.success"));
    }).catch((error) => {
      console.error("Event creation error:", error);
      Alert.alert(t("error"), t("services.events.export.failed"));
    });

  } catch (error) {
    console.error("Export error:", error);
    Alert.alert(t("error"), t("services.events.export.failed"));
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

interface EventDetailsHeaderProps {
  event: EventDetails;
}

export const EventDetailsHeader = ({ event }: EventDetailsHeaderProps) => {
  const { name: title, description, location, link } = event;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatTime, formatShort } = useDate();

  const label = link?.toLowerCase().includes("whatsapp")
    ? "WhatsApp"
    : String(t("common.link"));

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : undefined;
  const rangeDate = endDate
    ? `${formatTime(startDate)} — ${formatTime(endDate)}`
    : formatTime(startDate);
  const dateLine = (() => {
    if (!endDate) return `${formatShort(startDate)}`;
    const sameDay = startDate.toDateString() === endDate.toDateString();
    const endBefore5 = endDate.getHours() < 5;
    if (sameDay) return `${formatShort(endDate)}`;
    if (!sameDay && endBefore5) return `${formatShort(startDate)}`;
    return `${formatShort(endDate)} — ${formatShort(startDate)}`;
  })();

  return (
    <View className="gap-4 mt-3">
      <View className="flex-row gap-4">
        {event.picture && <Image source={event.picture} size={145} />}
        <View className="flex-1 gap-4">
          <View>
            <Text variant="h2">{title}</Text>
            <Text variant="lg" color="primary">
              {dateLine}
            </Text>
          </View>
          <View className="gap-2">
            <View className="flex-row items-center gap-1 flex-wrap">
              <MapPin color={theme.text} size={20} />
              <Text>{location}</Text>
            </View>
            <View className="flex-row items-center gap-1 flex-wrap">
              <Clock color={theme.text} size={20} />
              <Text>{rangeDate}</Text>
            </View>
          </View>
        </View>
      </View>
      {description && description?.length > 1 && (
        <Text color="muted">{description}</Text>
      )}
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          {link && link.length > 0 && (
            <Button
              label={label}
              icon={<ExternalLink />}
              variant="secondary"
              onPress={() => Linking.openURL(link)}
              className="flex-1"
            />
          )}
          <NotificationButton isMember={event.is_interested} />
        </View>
        <ExportButton event={event} />
      </View>
    </View>
  );
};

export default EventDetailsHeader;

export const EventDetailsHeaderSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View className="gap-4">
      <View className="flex-row items-start gap-4">
        <View
          className="rounded-xl bg-muted"
          style={{ width: 120, height: 120 }}
        />
        <View className="flex-1 gap-1.5">
          <TextSkeleton variant="h2" lastLineWidth={200} />
          <TextSkeleton variant="sm" lastLineWidth={80} />
          <View className="flex-row items-center gap-1">
            <MapPin color={theme.text} size={20} />
            <TextSkeleton lastLineWidth={120} />
          </View>
          <View className="flex-row items-center gap-1">
            <Clock color={theme.text} size={20} />
            <TextSkeleton lastLineWidth={120} />
          </View>
        </View>
      </View>
      <TextSkeleton lines={2} />
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Button className="flex-1" disabled>
            <TextSkeleton lastLineWidth={80} />
          </Button>
          <NotificationButton isMember={false} disabled />
        </View>
        <Button className="w-full" disabled>
          <TextSkeleton lastLineWidth={120} />
        </Button>
      </View>
    </View>
  );
};