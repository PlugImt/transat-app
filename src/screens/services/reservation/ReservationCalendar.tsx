import { type RouteProp, useRoute } from "expo-router/react-navigation";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from "react-native";
import { Page } from "@/components/page/Page";
import {
  BOOKING_BAR_HEIGHT,
  BookingBar,
  type SelectedSlot,
} from "@/components/reservation/BookingBar";
import { DaySchedule } from "@/components/reservation/DaySchedule";
import { DayStrip } from "@/components/reservation/DayStrip";
import { useNow } from "@/hooks/common";
import { useItemSchedule } from "@/hooks/services/reservation";
import type { BottomTabParamList } from "@/types";
import type { DaySlotView } from "@/utils/reservation.utils";
import {
  DAY_INDEXES,
  getParisYmd,
  indexToYmd,
  ymdToIndex,
} from "@/utils/reservation-time";

type CalendarRouteProp = RouteProp<BottomTabParamList, "ReservationCalendar">;

export const ReservationCalendar = () => {
  const { id, title, date } = useRoute<CalendarRouteProp>().params;
  const today = getParisYmd(useNow(60_000));

  // Day the pager is indexed from and opens on; fixed so indexes stay valid when midnight passes.
  const anchor = useRef(date ?? getParisYmd(new Date())).current;

  const [selectedDay, setSelectedDay] = useState(anchor);
  const selectedIndex = ymdToIndex(anchor, selectedDay);
  const [selection, setSelection] = useState<Map<string, SelectedSlot>>(
    () => new Map(),
  );
  const [pagerWidth, setPagerWidth] = useState(0);
  const pagerRef = useRef<FlatList<number>>(null);

  // Same query as the visible page: used for the item's custom messages.
  const { data: schedule } = useItemSchedule(id, selectedDay);

  const selectedKeys = useMemo(() => new Set(selection.keys()), [selection]);
  const selectedSlots = useMemo(
    () =>
      [...selection.values()].sort(
        (a, b) => a.start.getTime() - b.start.getTime(),
      ),
    [selection],
  );

  const handleSelectDay = (ymd: string) => {
    const index = ymdToIndex(anchor, ymd);
    const distance = Math.abs(index - selectedIndex);
    setSelectedDay(ymd);
    pagerRef.current?.scrollToIndex({ index, animated: distance <= 1 });
  };

  const handlePageChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / pagerWidth);
    setSelectedDay(indexToYmd(anchor, index));
  };

  const handleToggle = (slot: DaySlotView) =>
    setSelection((previous) => {
      const next = new Map(previous);
      if (next.has(slot.key)) {
        next.delete(slot.key);
      } else {
        next.set(slot.key, { key: slot.key, start: slot.start, end: slot.end });
      }
      return next;
    });

  const clearSelection = () => setSelection(new Map());
  const hasSelection = selection.size > 0;

  return (
    <Page
      title={title ?? schedule?.name ?? ""}
      disableScroll
      className="flex-1 gap-0 px-0"
      style={{ paddingBottom: 0 }}
    >
      <DayStrip
        anchor={anchor}
        selected={selectedDay}
        today={today}
        onSelect={handleSelectDay}
      />

      <View
        className="flex-1"
        onLayout={(event) => setPagerWidth(event.nativeEvent.layout.width)}
      >
        {pagerWidth > 0 && (
          <FlatList
            key={pagerWidth}
            ref={pagerRef}
            data={DAY_INDEXES}
            extraData={selectedKeys}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(index) => String(index)}
            initialScrollIndex={selectedIndex}
            getItemLayout={(_, index) => ({
              length: pagerWidth,
              offset: pagerWidth * index,
              index,
            })}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
            onMomentumScrollEnd={handlePageChange}
            renderItem={({ item: index }) => (
              <View style={{ width: pagerWidth }}>
                <DaySchedule
                  itemId={id}
                  ymd={indexToYmd(anchor, index)}
                  selectedKeys={selectedKeys}
                  onToggle={handleToggle}
                  bottomSpace={hasSelection ? BOOKING_BAR_HEIGHT : 0}
                />
              </View>
            )}
          />
        )}
      </View>

      {hasSelection && (
        <BookingBar
          itemId={id}
          slots={selectedSlots}
          warningMessage={schedule?.warningMessage}
          confirmationMessage={schedule?.confirmationMessage}
          onClear={clearSelection}
          onBooked={clearSelection}
        />
      )}
    </Page>
  );
};

export default ReservationCalendar;
