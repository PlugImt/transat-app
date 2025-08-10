import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Text } from "@/components/common/Text";
import { DaySelector } from "@/components/custom/calendar/DaySelector";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useReservationItem } from "@/hooks/services/reservation/useReservation";
import type { AppStackParamList } from "@/types";

type ItemRouteProp = RouteProp<AppStackParamList, "ReservationCalendar">;

export const ReservationCalendar = () => {
  const { t } = useTranslation();
  const route = useRoute<ItemRouteProp>();
  const { id, title } = route.params;
  const { scrollHandler } = useAnimatedHeader();
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const { data, isPending, isError, error, refetch } = useReservationItem(
    id,
    selectedDate,
  );

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };

  console.log(data);

  return (
    <Page
      title={title}
      onRefresh={refetch}
      refreshing={isPending}
      className="gap-2"
      asChildren
    >
      <Animated.FlatList
        data={data?.reservation}
        renderItem={({ item }) => <Text>TODO: display the slot list</Text>}
        keyExtractor={(item) => String(item.id)}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator
        ListHeaderComponent={<DaySelector onDateSelect={handleDateSelect} />}
        ListFooterComponent={
          isPending ? <Text>{t("common.loading")}</Text> : null
        }
      />
    </Page>
  );
};

export default ReservationCalendar;
