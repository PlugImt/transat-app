import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import Swiper from "react-native-swiper";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import CalendarSlot from "@/components/custom/calendar/CalendarSlot";
import { DaySelector } from "@/components/custom/calendar/DaySelector";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useReservationItem } from "@/hooks/services/reservation/useReservation";
import type { AppStackParamList } from "@/types";
import {
  fromYMD,
  generateCalendarSlots,
  shiftDate,
  toYMD,
} from "@/utils/calendar.utils";

type ItemRouteProp = RouteProp<AppStackParamList, "ReservationCalendar">;

export const ReservationCalendar = () => {
  const { t } = useTranslation();
  const route = useRoute<ItemRouteProp>();
  const { id, title } = route.params;
  const { scrollHandler } = useAnimatedHeader();
  const swipeLockRef = useRef(false);
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

  const extractReservations = (raw: any) => {
    const current = raw?.item?.reservation ?? raw?.reservation ?? [];
    const before =
      raw?.item?.reservation_before ?? raw?.reservation_before ?? [];
    const after = raw?.item?.reservation_after ?? raw?.reservation_after ?? [];
    return { current, before, after };
  };
  const { current, before, after } = extractReservations(data);

  const handleDateSelect = (date: Date) => {
    const formattedDate = toYMD(date);
    setSelectedDate(formattedDate);
    setSwiperKey(`swiper-${formattedDate}`);
  };

  const currentDateObj = selectedDate ? fromYMD(selectedDate) : new Date();
  const prevDateObj = shiftDate(selectedDate, -1);
  const nextDateObj = shiftDate(selectedDate, 1);

  const calendarDataDay = generateCalendarSlots(current || [], currentDateObj);
  const calendarDataDayBefore = generateCalendarSlots(
    before || [],
    prevDateObj,
  );
  const calendarDataDayAfter = generateCalendarSlots(after || [], nextDateObj);

  const formatDate = (d: Date) => toYMD(d);

  const handleSwipeEnd = (_: any, state: { index: number }) => {
    if (swipeLockRef.current) return;
    if (state.index === 0) {
      swipeLockRef.current = true;
      const nextDate = shiftDate(selectedDate, -1);
      const nextDateStr = formatDate(nextDate);
      setSelectedDate(nextDateStr);
      setSwiperKey(`swiper-${nextDateStr}`);
      return;
    }
    if (state.index === 2) {
      swipeLockRef.current = true;
      const nextDate = shiftDate(selectedDate, 1);
      const nextDateStr = formatDate(nextDate);
      setSelectedDate(nextDateStr);
      setSwiperKey(`swiper-${nextDateStr}`);
    }
  };

  useEffect(() => {
    if (swipeLockRef.current) {
      const id = setTimeout(() => {
        swipeLockRef.current = false;
      }, 50);
      return () => clearTimeout(id);
    }
  }, []);

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
        selectedDate={new Date(selectedDate || new Date())}
      />

      <Swiper
        key={swiperKey}
        index={1}
        loop={false}
        showsPagination={false}
        onMomentumScrollEnd={handleSwipeEnd}
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
