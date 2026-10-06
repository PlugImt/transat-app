import { useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useFloatingTabBarInset } from "@/components/navigation/floatingTabBar";
import { WidgetErrorCard } from "@/components/query";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account";
import { useNow } from "@/hooks/common";
import { useItemSchedule } from "@/hooks/services/reservation";
import { buildDayView, type DaySlotView } from "@/utils/reservation.utils";
import { RowSkeleton } from "./CatalogCards";
import { SlotRow } from "./SlotRow";

interface DayScheduleProps {
  itemId: number;
  /** Paris calendar day (YYYY-MM-DD). */
  ymd: string;
  selectedKeys: ReadonlySet<string>;
  onToggle: (slot: DaySlotView) => void;
  /** Room kept at the bottom for the booking bar. */
  bottomSpace: number;
}

export const DaySchedule = ({
  itemId,
  ymd,
  selectedKeys,
  onToggle,
  bottomSpace,
}: DayScheduleProps) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const now = useNow();
  const tabBarInset = useFloatingTabBarInset();
  const { data, isPending, isError, error, refetch } = useItemSchedule(
    itemId,
    ymd,
  );
  const [refreshing, setRefreshing] = useState(false);

  const slots = useMemo(
    () => (data ? buildDayView(ymd, data.reservations, user?.email, now) : []),
    [data, ymd, user?.email, now],
  );

  const refresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <FlatList
      data={slots}
      keyExtractor={(slot) => slot.key}
      renderItem={({ item }) => (
        <SlotRow
          itemId={itemId}
          slot={item}
          selected={selectedKeys.has(item.key)}
          onToggle={onToggle}
        />
      )}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: tabBarInset + bottomSpace + 16,
        gap: 8,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={theme.text}
          colors={[theme.primary]}
        />
      }
      ListEmptyComponent={
        isPending ? (
          <View className="gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <RowSkeleton key={`slot-skeleton-${index.toString()}`} />
            ))}
          </View>
        ) : isError ? (
          <WidgetErrorCard error={error} onRetry={refresh} />
        ) : null
      }
    />
  );
};
