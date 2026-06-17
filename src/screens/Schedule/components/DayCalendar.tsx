import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Empty } from "@/components/page/Empty";
import { useTheme } from "@/contexts/ThemeContext";
import type { CalendarEvent } from "@/dto";
import { ScheduleEvent } from "@/screens/Schedule/components/ScheduleEvent";
import { toYYYYMMDD } from "@/utils";

const HOUR_HEIGHT = 56;
const START_HOUR = 8;
const END_HOUR = 18;
const TOTAL_HOURS = END_HOUR - START_HOUR;

interface DayCalendarProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isEventOver = (endTime: string, selectedDate: Date) => {
  const now = new Date();

  if (now.toDateString() !== selectedDate.toDateString()) {
    return now > selectedDate;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes > toMinutes(endTime);
};

export const DayCalendar = ({
  events,
  selectedDate,
  onDateChange,
}: DayCalendarProps) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const translateX = useSharedValue(0);

  const locale = i18n.language || "fr";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" })
    .format(selectedDate);
  const month = new Intl.DateTimeFormat(locale, { month: "long" })
    .format(selectedDate);
  const year = selectedDate.getFullYear();
  const dayNumber = selectedDate.getDate();
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events],
  );

  const changeDay = (direction: "next" | "prev") => {
    onDateChange(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + (direction === "next" ? 1 : -1),
      ),
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      // faudra ptet le changer en testant sur un vrai appareil
      const SWIPE_THRESHOLD = 60;
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

  const getNowTimeForLine = useCallback(() => {
    const now = new Date();
    const minutesSinceStart =
      (now.getHours() - START_HOUR) * 60 + now.getMinutes();
    return (minutesSinceStart / 60) * HOUR_HEIGHT + 10;
  }, []);

  const [nowTimeLine, setNowTimeLine] = useState(getNowTimeForLine());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimeLine(getNowTimeForLine());
    }, 20000);

    return () => clearInterval(interval);
  }, [getNowTimeForLine]);

  return (
    <View className="gap-4">
      <View className="gap-2">
        <View className="flex-row items-center justify-between gap-2">
          <Button
            onPress={() => changeDay("prev")}
            label="<"
            className="rounded-xl text-white"
          />
          <Pressable
            className="flex-1"
            onPress={() => onDateChange(new Date())}
          >
            {({ pressed }) => (
              <View
                className={`items-center rounded-xl px-4 py-2 gap-0.5 ${pressed ? "opacity-60" : ""}`}
              >
                {/* {isToday && (
                  <Text className="text-white" variant="sm">
                    {t("schedule.today")}
                  </Text>
                )} */}
                <Text className="text-white" variant="h2">
                  {weekday}
                </Text>
                <Text className="text-white" variant="h1">
                  {dayNumber}
                </Text>
                <Text className="text-white">
                  {month} {year}
                </Text>
              </View>
            )}
          </Pressable>
          <Button
            onPress={() => changeDay("next")}
            label=">"
            className="rounded-xl text-white"
          />
        </View>
      </View>

      {sortedEvents.length === 0 ? (
        <Empty
          title={t("schedule.noEvents")}
          description={t("schedule.noEventsDescription")}
        />
      ) : (
        <View className="h-[620px]">
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
                      {Array.from({ length: 3 }).map((_, quarterIndex) => (
                        <View
                          key={`${hour}-${quarterIndex}`}
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
                {sortedEvents.map((event) => {
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
                        isOver={isEventOver(event.endTime, selectedDate)}
                      />
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      )}
    </View>
  );
};

export const getEventsForDate = (
  calendarData: Record<string, CalendarEvent[]> | undefined,
  date: Date,
) => calendarData?.[toYYYYMMDD(date)] ?? [];
