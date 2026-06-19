import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { CalendarEvent } from "@/dto";
import { usePlanningInte } from "@/hooks/services/plannings/usePlanningInte";
import { getEventsForDate } from "@/screens/Schedule/components/DayCalendar";
import { ScheduleEvent } from "@/screens/Schedule/components/ScheduleEvent";

const HOUR_HEIGHT = 60;
const START_HOUR = 8;
const END_HOUR = 18;
const TOTAL_HOURS = END_HOUR - START_HOUR;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function PlanningInte() {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: calendarData,
    refetch,
    isPending,
    isError,
    error,
  } = usePlanningInte();

  const filteredEvents = useMemo(
    () => getEventsForDate(calendarData ?? undefined, selectedDate),
    [calendarData, selectedDate],
  );

  const translateX = useSharedValue(0);

  const changeDay = (direction: "next" | "prev") => {
    setSelectedDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth(),
          prev.getDate() + (direction === "next" ? 1 : -1),
        ),
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const SWIPE_THRESHOLD = 50;
      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(changeDay)("next");
      } else if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(changeDay)("prev");
      }
      translateX.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const locale = "fr-FR";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    selectedDate,
  );
  const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    selectedDate,
  );
  const year = selectedDate.getFullYear();
  const dayNumber = selectedDate.getDate();
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const isEventOver = (endTime: string) => {
    const now = new Date();
    if (now.toDateString() === selectedDate.toDateString()) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      return currentMinutes > toMinutes(endTime);
    }
    return now > selectedDate;
  };

  const getNowTimeForLine = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const minutesSinceStart = (currentHour - START_HOUR) * 60 + currentMinutes;
    return (minutesSinceStart / 60) * HOUR_HEIGHT + 10;
  }, []);

  const [nowTimeLine, setNowTimeForLine] = useState(getNowTimeForLine());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimeForLine(getNowTimeForLine());
    }, 20000);

    return () => clearInterval(interval);
  }, [getNowTimeForLine]);

  if (isPending && calendarData === undefined) {
    return (
      <Page title="Planning inté">
        <Text className="text-center" color="muted">
          Chargement...
        </Text>
      </Page>
    );
  }

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      title="Planning inté"
      className="flex-col gap-8 p-5"
    >
      <View className="gap-2">
        {(calendarData === null || isError) && (
          <View>
            <Text color="muted" className="italic">
              Aucun planning inté disponible pour le moment.
            </Text>
            {error && (
              <Text color="destructive" className="italic">
                {error.message}
              </Text>
            )}
          </View>
        )}
        <View className="flex-row items-center gap-2 justify-end">
          <View>
            <Text className="text-right" variant="h2">
              {weekday}
            </Text>
            <Text className="text-right">
              {month} {year}
            </Text>
          </View>
          <Pressable onPress={() => setSelectedDate(new Date())}>
            {({ pressed }) => (
              <View
                className={`rounded-xl items-center justify-center ${pressed ? "opacity-60" : ""}`}
                style={{ backgroundColor: theme.secondary }}
              >
                <Text className="p-3 text-white" variant="h3">
                  {dayNumber}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
        <View className="flex-row justify-between items-center">
          <Button
            onPress={() => changeDay("prev")}
            label="<"
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          />
          <Button
            onPress={() => changeDay("next")}
            label=">"
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          />
        </View>
      </View>

      <View className="h-full">
        <GestureDetector gesture={panGesture}>
          <Animated.View className="flex-row h-full" style={animatedStyle}>
            <View>
              {Array.from({ length: TOTAL_HOURS }).map((_, index) => {
                const hour = START_HOUR + index;
                return (
                  <View key={hour} className="justify-start items-end pr-2">
                    <View style={{ height: HOUR_HEIGHT / 4 }}>
                      <Text>{hour}h</Text>
                    </View>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <View
                        key={i.toString()}
                        style={{ height: HOUR_HEIGHT / 4 }}
                      >
                        <Text>-</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>

            <View className="flex-1 relative pt-4">
              {isToday && (
                <>
                  <View
                    style={{
                      top: nowTimeLine,
                      backgroundColor: theme.destructive,
                    }}
                    className="absolute -left-2 right-0 h-0.5 z-50"
                  />
                  <View
                    style={{
                      top: nowTimeLine - 3,
                      left: -8,
                      backgroundColor: theme.destructive,
                    }}
                    className="absolute w-2 h-2 rounded-full"
                  />
                </>
              )}
              {Array.from({ length: TOTAL_HOURS }).map((_, index) => {
                const hour = START_HOUR + index;
                return (
                  <View
                    key={hour}
                    style={{ height: HOUR_HEIGHT, borderColor: theme.card }}
                    className="border-t"
                  />
                );
              })}
              {filteredEvents.map((event: CalendarEvent) => {
                const startInMin = toMinutes(event.startTime);
                const endInMin = toMinutes(event.endTime);
                const baseInMin = START_HOUR * 60 - 14;
                const top = ((startInMin - baseInMin) / 60) * HOUR_HEIGHT;
                const height = ((endInMin - startInMin) / 60) * HOUR_HEIGHT;

                return (
                  <View
                    key={event.id}
                    style={{ top, height: Math.max(height, 28) }}
                    className="absolute left-0 right-0 px-2"
                  >
                    <ScheduleEvent
                      event={event}
                      isOver={isEventOver(event.endTime)}
                    />
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Page>
  );
}
