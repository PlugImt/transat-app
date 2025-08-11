import { useEffect, useMemo, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import CalendarHeader from "@/components/custom/calendar/CalendarHeader";
import { DayCard } from "@/components/custom/calendar/Day";
import { ScrollIndicator } from "@/components/custom/calendar/ScrollIndicator";

interface DaySelectorProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export const DaySelector = ({
  onDateSelect,
  selectedDate: controlledSelectedDate,
}: DaySelectorProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState(
    controlledSelectedDate ?? today,
  );

  useEffect(() => {
    if (controlledSelectedDate) {
      setSelectedDate(controlledSelectedDate);
      setShouldCenter(true);
    }
  }, [controlledSelectedDate]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [currentOffsetX, setCurrentOffsetX] = useState(0);
  const [shouldCenter, setShouldCenter] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<{
    x: number;
    width: number;
  }>({ x: 0, width: 0 });
  const [todayLayout, setTodayLayout] = useState<{
    x: number;
    width: number;
  }>({ x: 0, width: 0 });

  const days = useMemo(() => {
    const base = new Date(selectedDate);
    return Array.from({ length: 43 }, (_, i) => {
      const date = new Date(base);
      date.setDate(base.getDate() + i - 10);
      date.setHours(8, 0, 0, 0);
      return date;
    });
  }, [selectedDate]);

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setShouldCenter(true);
    onDateSelect?.(date);
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const scrollBy = (deltaX: number) => {
    const maxOffset = Math.max(0, contentWidth - containerWidth);
    const nextOffset = clamp(currentOffsetX + deltaX, 0, maxOffset);
    scrollViewRef.current?.scrollTo({ x: nextOffset, animated: true });
    setCurrentOffsetX(nextOffset);
  };

  const scrollLeft = () => {
    const step = (todayLayout.width || 100) + 8; // approximate one-card step
    scrollBy(-step);
  };

  const scrollRight = () => {
    const step = (todayLayout.width || 100) + 8;
    scrollBy(step);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentOffsetX(e.nativeEvent.contentOffset.x);
  };

  useEffect(() => {
    if (!scrollViewRef.current) return;
    if (containerWidth === 0 || selectedLayout.width === 0) return;

    if (shouldCenter) {
      const centerOffset = clamp(
        selectedLayout.x - (containerWidth - selectedLayout.width) / 2,
        0,
        Math.max(0, contentWidth - containerWidth),
      );
      scrollViewRef.current.scrollTo({ x: centerOffset, animated: true });
      setCurrentOffsetX(centerOffset);
      setShouldCenter(false);
    }
  }, [
    containerWidth,
    contentWidth,
    selectedLayout.x,
    selectedLayout.width,
    shouldCenter,
    clamp,
  ]);

  const onTodayPress = () => {
    const todayDate = new Date();
    todayDate.setHours(8, 0, 0, 0);
    setSelectedDate(todayDate);
    setShouldCenter(true);
    onDateSelect?.(todayDate);
  };

  useEffect(() => {
    if (controlledSelectedDate) {
      setShouldCenter(true);
    }
  }, [controlledSelectedDate]);

  return (
    <View
      className="relative mt-16"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <CalendarHeader selectedDate={selectedDate} onToday={onTodayPress} />
      <View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(w) => setContentWidth(w)}
        >
          <View className="flex flex-row items-center gap-2 px-4 py-2">
            {days.map((day, index) => {
              const isSelected =
                day.getDate() === selectedDate.getDate() &&
                day.getMonth() === selectedDate.getMonth() &&
                day.getFullYear() === selectedDate.getFullYear();

              const isToday =
                day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();

              return (
                <View
                  key={index.toString()}
                  onLayout={
                    isSelected
                      ? (e) =>
                          setSelectedLayout({
                            x: e.nativeEvent.layout.x,
                            width: e.nativeEvent.layout.width,
                          })
                      : isToday
                        ? (e) =>
                            setTodayLayout({
                              x: e.nativeEvent.layout.x,
                              width: e.nativeEvent.layout.width,
                            })
                        : undefined
                  }
                >
                  <DayCard
                    date={day}
                    selected={isSelected}
                    onPress={() => handleDayPress(day)}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>

        <ScrollIndicator side="left" onPress={scrollLeft} />
        <ScrollIndicator side="right" onPress={scrollRight} />
      </View>
    </View>
  );
};
