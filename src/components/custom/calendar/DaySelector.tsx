import { useEffect, useMemo, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { DayCard } from "@/components/custom/calendar/Day";
import { useTheme } from "@/contexts/ThemeContext";

interface DaySelectorProps {
  onDateSelect?: (date: Date) => void;
}

export const DaySelector = ({ onDateSelect }: DaySelectorProps) => {
  const { theme, actualTheme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [currentOffsetX, setCurrentOffsetX] = useState(0);
  const [todayLayout, setTodayLayout] = useState<{ x: number; width: number }>(
    { x: 0, width: 0 },
  );

  const days = useMemo(() => {
    return Array.from({ length: 43 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i - 10);
      date.setHours(8, 0, 0, 0);
      return date;
    });
  }, [today]);

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
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
    if (containerWidth === 0 || todayLayout.width === 0) return;

    const centerOffset = clamp(
      todayLayout.x - (containerWidth - todayLayout.width) / 2,
      0,
      Math.max(0, contentWidth - containerWidth),
    );
    scrollViewRef.current.scrollTo({ x: centerOffset, animated: false });
    setCurrentOffsetX(centerOffset);
  }, [containerWidth, todayLayout, contentWidth, clamp]);

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <View
      className="relative"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
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

            const trackLayout = isToday(day);

            return (
              <View
                key={index.toString()}
                onLayout={
                  trackLayout
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

      {/* Left gradient overlay */}
      <LinearGradient
        pointerEvents="none"
        colors={[theme.card, `${theme.card}00`]}
        locations={[0, 1]}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          zIndex: 5,
            transform: [{ rotate: '270deg' }]

        }}
      />

      {/* Right gradient overlay */}
      <LinearGradient
        pointerEvents="none"
        colors={[`${theme.card}00`, theme.card]}
        locations={[0, 1]}
        style={{
          position: "absolute",
          right: -10,
          top: 0,
          bottom: 0,
          width: 80,
          zIndex: 5,
            transform: [{ rotate: '270deg' }]
        }}
      />

      {/* Left control button with blur */}
      <View
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={scrollLeft}
          accessibilityRole="button"
          activeOpacity={0.8}
          style={{
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
            <ChevronLeft size={25} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Right control button with blur */}
      <View
        style={{
          position: "absolute",
          right: 8,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={scrollRight}
          accessibilityRole="button"
          activeOpacity={0.8}
          style={{
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
            <ChevronRight size={25} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
