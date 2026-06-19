import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Page } from '@/components/page/Page';
import { useTheme } from '@/contexts/ThemeContext';
import { usePlanningSport } from '@/hooks/services/plannings/usePlanningSport';
import { getEventsForDate } from './PlanningToEvent';
import { SportEventCard } from './SportEventCard';

dayjs.locale('fr');

export function PlanningSport() {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: plannings, refetch, isPending } = usePlanningSport();

  const events = useMemo(
    () => getEventsForDate(plannings || [], selectedDate),
    [plannings, selectedDate],
  );

  /* ── Navigation jours ── */
  const goToPrevDay = useCallback(
    () => setSelectedDate((d) => dayjs(d).subtract(1, 'day').toDate()),
    [],
  );
  const goToNextDay = useCallback(
    () => setSelectedDate((d) => dayjs(d).add(1, 'day').toDate()),
    [],
  );
  const goToToday = useCallback(() => setSelectedDate(new Date()), []);

  /* ── Swipe ── */
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const SWIPE_THRESHOLD = 50;
      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(goToNextDay)();
      } else if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(goToPrevDay)();
      }
      translateX.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  /* ── Labels ── */
  const locale = 'fr-FR';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(selectedDate);
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(selectedDate);
  const year = selectedDate.getFullYear();
  const dayNumber = selectedDate.getDate();
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  /* ── Heure courante : marquer les séances passées ── */
  const isEventOver = useCallback(
    (event: { end_time: Date }) => {
      const now = new Date();
      if (now.toDateString() === selectedDate.toDateString()) {
        return now > event.end_time;
      }
      return now > selectedDate;
    },
    [selectedDate],
  );

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      title="Planning sport"
      className="flex-col gap-8 p-5"
    >
      {/* ── Header : même structure que Timetable ── */}
      <View className="gap-2">
        <View className="flex-row items-center gap-2 justify-center">
          <View>
            <Text className="text-right" variant="h2">
              {weekday}
            </Text>
            <Text className="text-right">
              {month} {year}
            </Text>
          </View>

          {/* Bouton jour numéroté – tap = retour à aujourd'hui */}
          <Pressable onPress={goToToday}>
            {({ pressed }) => (
              <View
                className={`rounded-xl items-center justify-center ${pressed ? 'opacity-60' : ''}`}
                style={{ backgroundColor: isToday ? theme.primary : theme.secondary }}
              >
                <Text className="p-3 text-white" variant="h3">
                  {dayNumber}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Flèches de navigation */}
        <View className="flex-row justify-between items-center">
          <Button
            onPress={goToPrevDay}
            label="<"
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          />
          <Button
            onPress={goToNextDay}
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

      {/* ── Liste des événements avec swipe ── */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {events.length === 0 ? (
            <View className="flex-1 items-center justify-center py-16 gap-2">
              <Text variant="h3" color="muted" className="italic text-center">
                Aucune séance ce jour
              </Text>
              <Text color="muted" className="text-center text-sm">
                Swipe ou utilisez les flèches pour changer de jour
              </Text>
            </View>
          ) : (
            <View className="gap-0">
              {events.map((event) => (
                <SportEventCard
                  key={event.id}
                  event={event}
                  isOver={isEventOver(event)}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </Page>
  );
}