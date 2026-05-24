import { CalendarX2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Empty } from "@/components/page/Empty";
import {
  PersonalReservationGroup,
  ReservationSkeleton,
} from "@/components/reservation";
import {
  useGroupedReservations,
  useMyReservations,
} from "@/hooks/services/reservation";

export const PastPersonalReservations = () => {
  const { t } = useTranslation();
  const { data, isPending } = useMyReservations("past");

  const { grouped: groupedPastAll, orderedDays: orderedPastAllDays } =
    useGroupedReservations(data?.past ?? [], "desc");

  if (isPending) {
    return (
      <ReservationSkeleton title={t("services.reservation.personal.title")} />
    );
  }

  if (orderedPastAllDays.length === 0) {
    return (
      <Empty
        icon={<CalendarX2 />}
        title={t("services.reservation.personal.emptyPast")}
        description={t("services.reservation.personal.emptyPastDescription")}
      />
    );
  }

  return (
    <View className="gap-4 flex-1">
      {orderedPastAllDays.map((day) => (
        <PersonalReservationGroup
          key={day}
          title={day}
          items={groupedPastAll[day]}
        />
      ))}
    </View>
  );
};
