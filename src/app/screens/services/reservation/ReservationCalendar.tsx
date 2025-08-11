import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Text } from "@/components/common/Text";
import CalendarSlot from "@/components/custom/calendar/CalendarSlot";
import { DaySelector } from "@/components/custom/calendar/DaySelector";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useReservationItem } from "@/hooks/services/reservation/useReservation";
import type { AppStackParamList } from "@/types";
import { generateCalendarSlots } from "@/utils/calendar.utils";

type ItemRouteProp = RouteProp<AppStackParamList, "ReservationCalendar">;

export const ReservationCalendar = () => {
  const { t } = useTranslation();
  const route = useRoute<ItemRouteProp>();
  const { id, title } = route.params;
  const { scrollHandler } = useAnimatedHeader();
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const { data, isPending, isError, error, refetch } = useReservationItem(
    id,
    selectedDate,
  );

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };

  const calendarDataDay = generateCalendarSlots(
    data?.reservation || [],
    new Date(selectedDate || new Date()),
  );
  const calendarDataDayBefore = generateCalendarSlots(
    data?.reservation_before || [],
    new Date(selectedDate || new Date()),
  );
  const calendarDataDayAfter = generateCalendarSlots(
    data?.reservation_after || [],
    new Date(selectedDate || new Date()),
  );

  return (
    <Page
      title={title}
      onRefresh={refetch}
      refreshing={isPending}
      className="gap-2"
      asChildren
    >
      <Animated.FlatList
        data={calendarDataDay}
        renderItem={({ item }) => (
          <CalendarSlot reservationDetails={item} itemId={id} />
        )}
        keyExtractor={(item, index) => `${String(item?.id)}-${index}`}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator
        ListHeaderComponent={<DaySelector onDateSelect={handleDateSelect} />}
        ListFooterComponent={
          isPending ? <Text>{t("common.loading")}</Text> : null
        }
      />
    </Page>
  );
};

export default ReservationCalendar;
