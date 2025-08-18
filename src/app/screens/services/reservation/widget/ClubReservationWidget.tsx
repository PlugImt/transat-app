import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import ReservationCard, {
  ReservationCardSkeleton,
} from "@/components/custom/card/ReservationCard";
import {
  useClubReservations,
  useReservationDisplayData,
} from "@/hooks/services/reservation";
import type { AppNavigation } from "@/types";

export const ClubReservationWidget = ({ clubId }: { clubId: number }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { data, isPending, isError } = useClubReservations(clubId);
  const displayData = useReservationDisplayData(data);

  if (isPending) {
    return <ClubReservationWidgetSkeleton />;
  }

  if (isError || !displayData || displayData.length === 0) {
    return null;
  }

  return (
    <CardGroup
      title={t("services.reservation.title")}
      onPress={
        displayData.length > 3
          ? () => navigation.navigate("Reservation")
          : undefined
      }
    >
      <View className="gap-2">
        {displayData?.slice(0, 3).map((reservation) => (
          <ReservationCard
            key={reservation.id}
            title={reservation.name}
            type={reservation.type}
            id={reservation.id}
            slot={reservation.slot}
            user={reservation.user}
          />
        ))}
      </View>
    </CardGroup>
  );
};

export const ClubReservationWidgetSkeleton = () => {
  const { t } = useTranslation();
  return (
    <CardGroup title={t("services.reservation.title")}>
      <View className="gap-2">
        <ReservationCardSkeleton />
        <ReservationCardSkeleton />
      </View>
    </CardGroup>
  );
};
