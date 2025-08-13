import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Page } from "@/components/page/Page";
import { ReservationGroup } from "@/components/reservation";
import { useMyReservations } from "@/hooks/services/reservation/useReservation";
import {
  useGroupedReservations,
  useMyReservationData,
} from "@/hooks/services/reservation/useReservationData";

export const MyReservations = () => {
  const { t } = useTranslation();

  const {
    data: currentData,
    isPending: currentPending,
    refetch: currentRefetch,
  } = useMyReservations("current");

  const {
    data: pastData,
    isPending: pastPending,
    refetch: pastRefetch,
  } = useMyReservations("past");

  const currentReservations = useMyReservationData(
    currentData?.current ?? [],
    "current",
  );
  const { grouped: groupedPastAll, orderedDays: orderedPastAllDays } =
    useGroupedReservations(pastData?.past ?? [], "desc");

  const isPending = currentPending || pastPending;

  const refetch = () => {
    currentRefetch();
    pastRefetch();
  };

  return (
    <Page
      title={t("services.reservation.myReservations")}
      onRefresh={refetch}
      refreshing={isPending}
    >
      <Tabs defaultValue="current">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger
            value="current"
            title={t("services.reservation.current")}
          />
          <TabsTrigger value="past" title={t("services.reservation.past")} />
        </TabsList>

        <TabsContent value="current">
          <View className="gap-4 flex-1">
            {currentReservations.nonSlotItems.length > 0 && (
              <ReservationGroup
                title={t("services.reservation.current")}
                items={currentReservations.nonSlotItems}
                showActions
              />
            )}

            {currentReservations.orderedDays.map((day) => (
              <ReservationGroup
                key={day}
                title={day}
                items={currentReservations.groupedSlotItems[day]}
                showActions
              />
            ))}
          </View>
        </TabsContent>

        <TabsContent value="past">
          <View className="gap-4 flex-1">
            {orderedPastAllDays.map((day) => (
              <ReservationGroup
                key={day}
                title={day}
                items={groupedPastAll[day]}
                showActions={false}
                showFullDate
              />
            ))}
          </View>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default MyReservations;
