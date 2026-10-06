import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type FlatList, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useDate } from "@/hooks/common/useDate";
import { hapticFeedback } from "@/utils/haptics.utils";
import {
  DAY_INDEXES,
  daysUntilNextMonth,
  indexToYmd,
  ymdToIndex,
  ymdToLabelDate,
} from "@/utils/reservation-time";

const DAY_WIDTH = 56;
const DAY_GAP = 8;
const DAY_LENGTH = DAY_WIDTH + DAY_GAP;
const LIST_PADDING = 16;
/** Row above the cards that holds the month names. */
const MONTH_BAND = 28;
/** Gap kept between the pinned month name and the next one pushing it out. */
const MONTH_GAP = 12;
/** Farthest jump (in days) that is animated; longer ones would sweep through thousands of cards. */
const MAX_ANIMATED_JUMP = 14;
const LAST_INDEX = DAY_INDEXES.length - 1;

const clampIndex = (index: number) => Math.min(Math.max(index, 0), LAST_INDEX);

interface MonthHeaderProps {
  anchor: string;
  today: string;
  /** Horizontal scroll offset of the strip. */
  scrollX: SharedValue<number>;
  /** Index of the day under the left edge of the strip. */
  leftIndex: number;
  onToday: () => void;
}

/**
 * Month name pinned on the left. The next month's name travels with its first
 * day and pushes the pinned one out, so names replace each other continuously.
 */
const MonthHeader = ({
  anchor,
  today,
  scrollX,
  leftIndex,
  onToday,
}: MonthHeaderProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatDate } = useDate();
  const pinnedWidth = useSharedValue(0);

  const pinnedYmd = indexToYmd(anchor, leftIndex);
  const nextIndex = leftIndex + daysUntilNextMonth(pinnedYmd);
  const nextYmd = indexToYmd(anchor, nextIndex);

  const monthLabel = (ymd: string) =>
    formatDate(
      ymdToLabelDate(ymd),
      ymd.slice(0, 4) === today.slice(0, 4) ? "LLLL" : "LLLL yyyy",
    );

  const nextStyle = useAnimatedStyle(() => {
    const x = LIST_PADDING + nextIndex * DAY_LENGTH - scrollX.value;
    return { transform: [{ translateX: Math.max(x, LIST_PADDING) }] };
  });

  const pinnedStyle = useAnimatedStyle(() => {
    const x = LIST_PADDING + nextIndex * DAY_LENGTH - scrollX.value;
    const nextX = Math.max(x, LIST_PADDING);
    return {
      transform: [
        {
          translateX: Math.min(
            LIST_PADDING,
            nextX - pinnedWidth.value - MONTH_GAP,
          ),
        },
      ],
    };
  });

  return (
    <View
      pointerEvents="box-none"
      className="absolute top-0 left-0 right-0 overflow-hidden"
      style={{ height: MONTH_BAND }}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute left-0 top-0 justify-center"
        style={[{ height: MONTH_BAND }, pinnedStyle]}
        onLayout={(event) => {
          pinnedWidth.value = event.nativeEvent.layout.width;
        }}
      >
        <Text variant="lg" className="capitalize" numberOfLines={1}>
          {monthLabel(pinnedYmd)}
        </Text>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        className="absolute left-0 top-0 justify-center"
        style={[{ height: MONTH_BAND }, nextStyle]}
      >
        <Text variant="lg" className="capitalize" numberOfLines={1}>
          {monthLabel(nextYmd)}
        </Text>
      </Animated.View>

      <View
        className="absolute right-0 top-0 justify-center pl-2 pr-2"
        style={{ height: MONTH_BAND, backgroundColor: theme.background }}
      >
        <Button
          variant="link"
          size="sm"
          label={t("common.today")}
          onPress={onToday}
        />
      </View>
    </View>
  );
};

interface DayStripProps {
  /** Paris calendar day (YYYY-MM-DD) the strip is indexed from. */
  anchor: string;
  selected: string;
  today: string;
  onSelect: (ymd: string) => void;
}

export const DayStrip = ({
  anchor,
  selected,
  today,
  onSelect,
}: DayStripProps) => {
  const { theme } = useTheme();
  const { formatDate } = useDate();
  const listRef = useRef<FlatList<number>>(null);
  const selectedIndex = ymdToIndex(anchor, selected);

  const scrollX = useSharedValue(LIST_PADDING + DAY_LENGTH * selectedIndex);
  const [leftIndex, setLeftIndex] = useState(selectedIndex);
  const leftIndexRef = useRef(leftIndex);
  leftIndexRef.current = leftIndex;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Clamped here: plain module functions can't be called from the UI-thread reaction.
  const updateLeftIndex = useCallback(
    (index: number) => setLeftIndex(clampIndex(index)),
    [],
  );

  useAnimatedReaction(
    () => Math.floor(scrollX.value / DAY_LENGTH),
    (index, previous) => {
      if (index !== previous) runOnJS(updateLeftIndex)(index);
    },
  );

  const centerOn = useCallback(
    (index: number) =>
      listRef.current?.scrollToIndex({
        index,
        viewPosition: 0.5,
        animated: Math.abs(index - leftIndexRef.current) <= MAX_ANIMATED_JUMP,
      }),
    [],
  );

  useEffect(() => {
    centerOn(selectedIndex);
  }, [selectedIndex, centerOn]);

  return (
    <View className="pt-2">
      <View>
        <Animated.FlatList
          ref={listRef}
          data={DAY_INDEXES}
          extraData={`${selected}|${today}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(index) => String(index)}
          initialScrollIndex={selectedIndex}
          initialNumToRender={12}
          windowSize={7}
          getItemLayout={(_, index) => ({
            length: DAY_LENGTH,
            offset: LIST_PADDING + DAY_LENGTH * index,
            index,
          })}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingHorizontal: LIST_PADDING,
            paddingTop: MONTH_BAND,
            paddingBottom: 8,
          }}
          renderItem={({ item: index }) => {
            const ymd = indexToYmd(anchor, index);
            const date = ymdToLabelDate(ymd);
            const isSelected = ymd === selected;
            const isToday = ymd === today;

            return (
              <TouchableOpacity
                onPress={() => {
                  hapticFeedback.light();
                  onSelect(ymd);
                }}
                accessibilityRole="button"
                accessibilityLabel={formatDate(date, "EEEE d MMMM")}
                accessibilityState={{ selected: isSelected }}
                className="items-center justify-center rounded-2xl border-[1.5px]"
                style={{
                  width: DAY_WIDTH,
                  height: 72,
                  marginRight: DAY_GAP,
                  backgroundColor: isToday
                    ? `${theme.secondary}30`
                    : theme.card,
                  borderColor: isSelected ? theme.secondary : theme.border,
                }}
              >
                <Text
                  variant="sm"
                  className="uppercase"
                  style={{
                    color: isSelected ? theme.secondary : theme.text,
                  }}
                >
                  {formatDate(date, "EEE")}
                </Text>
                <Text
                  variant="h2"
                  style={{
                    color: isSelected ? theme.secondary : theme.text,
                  }}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <MonthHeader
          anchor={anchor}
          today={today}
          scrollX={scrollX}
          leftIndex={leftIndex}
          onToday={() => {
            onSelect(today);
            // Also recenters when today is already selected but scrolled out of view.
            centerOn(ymdToIndex(anchor, today));
          }}
        />
      </View>
    </View>
  );
};
