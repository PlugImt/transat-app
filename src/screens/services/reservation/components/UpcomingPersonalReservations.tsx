import { CalendarX2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Empty } from "@/components/page/Empty";
import { PersonalReservationGroup } from "@/components/reservation";
import {
  useMyReservationData,
  useMyReservations,
} from "@/hooks/services/reservation";

export const UpcomingPersonalReservations = () => {
  const { t } = useTranslation();
  const { data } = useMyReservations("current");

  const currentReservations = useMyReservationData(
    data?.current ?? [],
    "current",
  );

  const isEmpty =
    currentReservations.nonSlotItems.length === 0 &&
    currentReservations.orderedDays.length === 0;

  if (isEmpty) {
    return (
      <Empty
        icon={<CalendarX2 />}
        title={t("services.reservation.personal.emptyUpcoming")}
        description={t(
          "services.reservation.personal.emptyUpcomingDescription",
        )}
      />
    );
  }

  return (
    <View className="gap-4 flex-1">
      {currentReservations.nonSlotItems.length > 0 && (
        <PersonalReservationGroup
          title={t("services.reservation.current")}
          items={currentReservations.nonSlotItems}
        />
      )}

      {currentReservations.orderedDays.map((day) => (
        <PersonalReservationGroup
          key={day}
          title={day}
          items={currentReservations.groupedSlotItems[day]}
        />
      ))}
    </View>
  );
};
