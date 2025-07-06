import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import { Page } from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import { useTheme } from "@/contexts/ThemeContext";
import type { Course } from "@/dto";
import useAuth from "@/hooks/account/useAuth";
import { useTimetableForWeek } from "@/hooks/useTimetable";
import { isoToHourString } from "@/utils";
import { Cours, LoadingState } from "./components";

/* Gérer la date pour la ligne rouge = heure actuelle */
const HOUR_HEIGHT = 60; // 60 pixels = 1 heure
const START_HOUR = 8;
const END_HOUR = 18;
const TOTAL_HOURS = END_HOUR - START_HOUR;

export const Timetable = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: edt,
    refetch,
    isPending: isPendingEdt,
    isError,
    error,
  } = useTimetableForWeek(user?.email || "", selectedDate);

  /* <SWIPE> */
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
      translateX.value = withTiming(0); // Reset position
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  /* </SWIPE> */

  /* <Cours et date> */
  const locale = "fr-FR";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    selectedDate,
  );
  const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    selectedDate,
  );
  const year = selectedDate.getFullYear();
  const dayNumber = selectedDate.getDate();

  // This logic processes the data for the entire week
  const parsedEdt = edt?.map((course) => ({
    ...course,
    date: new Date(course.date),
    start_time: isoToHourString(course.start_time),
    end_time: isoToHourString(course.end_time),
  }));

  // This crucial filter selects courses for the currently displayed 'selectedDate' from the weekly data
  const filteredCourses = parsedEdt?.filter(
    (course) =>
      new Date(course.date).toDateString() === selectedDate.toDateString(),
  );

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const toMinutes = (heure: string) => {
    const [h, m] = heure.split(/[h:]/).map(Number);
    return h * 60 + m;
  };

  const isCourseOver = (heureFin: string) => {
    const now = new Date();
    // Use toDateString for robust comparison across year/month/day
    if (now.toDateString() === selectedDate.toDateString()) {
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const [h, m] = heureFin.split(/[h:]/).map(Number);
      if (currentHour > h) return true;
      return currentHour === h && currentMinutes > m;
    }
    return now > selectedDate; // Mark courses on past days as over
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
  /* </Cours et date> */

  // Show loading state only on initial fetch for a week, not on background refetches
  if (isPendingEdt && !edt) {
    return <LoadingState />;
  }

  return (
    <Page
      goBack
      refreshing={isPendingEdt}
      onRefresh={refetch}
      title={t("services.timetable.title")}
      about={
        <AboutModal
          title={t("services.timetable.title")}
          description={t("services.timetable.about")}
          additionalInfo={t("services.timetable.additionalInfo")}
        />
      }
      className="flex-col gap-8 p-5"
    >
      {/*{header : jour}*/}
      <View className="gap-2">
        {(edt === null || isError) && (
          <View>
            <Text style={{ color: theme.textTertiary }} className="italic">
              {t("services.timetable.noEdt.title")}
              {t("services.timetable.noEdt.description")}
            </Text>
            {error && (
              <Text style={{ color: theme.destructive }} className="italic">
                {error.message}
              </Text>
            )}
          </View>
        )}
        <View className="flex-row items-center gap-2 justify-end">
          <View>
            <Text
              style={{ color: theme.text }}
              className="h2 text-right font-medium"
            >
              {weekday}
            </Text>
            <Text style={{ color: theme.text }} className="text-right text-sm">
              {month} {year}
            </Text>
          </View>
          <Pressable onPress={() => setSelectedDate(new Date())}>
            {({ pressed }) => (
              <View
                className={`rounded-xl items-center justify-center ${pressed ? "opacity-60" : ""}`}
                style={{ backgroundColor: theme.secondary }}
              >
                <Text className="text-2xl font-semibold p-3 text-white">
                  {dayNumber}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
        {/*{jour navi}*/}
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

      {/*{content edt}*/}
      <View className="h-full">
        <GestureDetector gesture={panGesture}>
          <Animated.View className="flex-row h-full" style={animatedStyle}>
            {/* PARTIE horaire */}
            <View>
              {Array.from({ length: TOTAL_HOURS }).map((_, index) => {
                const hour = START_HOUR + index;
                return (
                  <View key={hour} className="justify-start items-end pr-2">
                    <View style={{ height: HOUR_HEIGHT / 4 }}>
                      <Text style={{ color: theme.text }}>{hour}h</Text>
                    </View>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <View
                        key={i.toString()}
                        style={{ height: HOUR_HEIGHT / 4 }}
                      >
                        <Text style={{ color: theme.text }}>-</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>

            {/* PARTIE cours */}
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
              {filteredCourses?.map((cours: Course) => {
                const startInMin = toMinutes(cours.start_time);
                const endInMin = toMinutes(cours.end_time);
                const baseInMin = START_HOUR * 60 - 14;
                const top = ((startInMin - baseInMin) / 60) * HOUR_HEIGHT;
                const height = ((endInMin - startInMin) / 60) * HOUR_HEIGHT;

                return (
                  <View
                    key={cours.id}
                    style={{ top, height }}
                    className="absolute left-0 right-0 px-2"
                  >
                    <Cours
                      course={cours}
                      isOver={isCourseOver(cours.end_time)}
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
};
