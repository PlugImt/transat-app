import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import Swiper from "react-native-swiper";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import CalendarSlot from "@/components/custom/calendar/CalendarSlot";
import { DaySelector } from "@/components/custom/calendar/DaySelector";
import { Page } from "@/components/page/Page";
import type { ReservationScheme } from "@/dto";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useReservationItem } from "@/hooks/services/reservation/useReservation";
import type { BottomTabParamList } from "@/types";
import {
  fromYMD,
  generateCalendarSlots,
  shiftDate,
  toYMD,
} from "@/utils/calendar.utils";

type ItemRouteProp = RouteProp<BottomTabParamList, "ReservationCalendar">;

export const ReservationCalendar = () => {
  const { t } = useTranslation();
  const route = useRoute<ItemRouteProp>();
  const { id, title } = route.params;
  const { scrollHandler } = useAnimatedHeader();
  const { toast } = useToast();

  const todayStr = useMemo(() => toYMD(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    todayStr,
  );
  const [swiperKey, setSwiperKey] = useState<string>(`swiper-${todayStr}`);

  const { data, isPending, isError, error, refetch } = useReservationItem(
    id,
    selectedDate,
  );

  if (isError) {
    toast(error?.message || t("common.error"), "destructive");
  }

  const { current, before, after } = useMemo(() => {
    const current = data?.item?.reservation ?? data?.reservation ?? [];
    const before =
      data?.item?.reservation_before ?? data?.reservation_before ?? [];
    const after =
      data?.item?.reservation_after ?? data?.reservation_after ?? [];
    return { current, before, after };
  }, [data]);

  const [display, setDisplay] = useState<{
    current: (ReservationScheme | undefined)[];
    before: (ReservationScheme | undefined)[];
    after: (ReservationScheme | undefined)[];
  }>({ current: [], before: [], after: [] });

  useEffect(() => {
    if (data) {
      setDisplay({
        current: current || [],
        before: before || [],
        after: after || [],
      });
    }
  }, [data, current, before, after]);

  const handleDateSelect = (date: Date) => {
    const formattedDate = toYMD(date);
    setSelectedDate(formattedDate);
    setSwiperKey(`swiper-${formattedDate}`);
  };

  const currentDateObj = selectedDate ? fromYMD(selectedDate) : new Date();
  const prevDateObj = shiftDate(selectedDate, -1);
  const nextDateObj = shiftDate(selectedDate, 1);

  const calendarDataDay = generateCalendarSlots(
    display.current || [],
    currentDateObj,
  );
  const calendarDataDayBefore = generateCalendarSlots(
    display.before || [],
    prevDateObj,
  );
  const calendarDataDayAfter = generateCalendarSlots(
    display.after || [],
    nextDateObj,
  );

  const formatDate = (d: Date) => toYMD(d);

  const handleIndexChanged = (index: number) => {
    if (index === 1) return;
    const delta = index === 0 ? -1 : 1;
    const nextDate = shiftDate(selectedDate, delta);
    const nextDateStr = formatDate(nextDate);
    setDisplay((prev) => {
      if (delta === 1) {
        return {
          current: prev.after || [],
          before: prev.current || [],
          after: [],
        };
      }
      return {
        current: prev.before || [],
        after: prev.current || [],
        before: [],
      };
    });
    setSelectedDate(nextDateStr);
    setSwiperKey(`swiper-${nextDateStr}`);
  };

  return (
    <Page
      title={title}
      onRefresh={refetch}
      refreshing={isPending}
      className="gap-2"
      asChildren
    >
      <DaySelector
        onDateSelect={handleDateSelect}
        selectedDate={currentDateObj}
      />

      <Swiper
        key={swiperKey}
        index={1}
        loop={false}
        showsPagination={false}
        onIndexChanged={handleIndexChanged}
      >
        {/* Previous day */}
        <Animated.FlatList
          style={{ flex: 1 }}
          data={calendarDataDayBefore}
          renderItem={({ item }) => (
            <CalendarSlot reservationDetails={item} itemId={id} />
          )}
          keyExtractor={(item, index) => `${String(item?.id)}-before-${index}`}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator
          ListFooterComponent={
            isPending && (!before || before.length === 0) ? (
              <Text>{t("common.loading")}</Text>
            ) : null
          }
        />

        {/* Current day */}
        <Animated.FlatList
          style={{ flex: 1 }}
          data={calendarDataDay}
          renderItem={({ item }) => (
            <CalendarSlot reservationDetails={item} itemId={id} />
          )}
          keyExtractor={(item, index) => `${String(item?.id)}-cur-${index}`}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator
          ListFooterComponent={
            isPending && (!current || current.length === 0) ? (
              <Text>{t("common.loading")}</Text>
            ) : null
          }
        />

        {/* Next day */}
        <Animated.FlatList
          style={{ flex: 1 }}
          data={calendarDataDayAfter}
          renderItem={({ item }) => (
            <CalendarSlot reservationDetails={item} itemId={id} />
          )}
          keyExtractor={(item, index) => `${String(item?.id)}-after-${index}`}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator
          ListFooterComponent={
            isPending && (!after || after.length === 0) ? (
              <Text>{t("common.loading")}</Text>
            ) : null
          }
        />
      </Swiper>
    </Page>
  );
};

export default ReservationCalendar;
