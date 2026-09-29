import { useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import ReservationCard, {
  ReservationCardSkeleton,
} from "@/components/custom/card/ReservationCard";
import { WidgetBoundary } from "@/components/query";
import {
  useClubReservations,
  useReservationDisplayData,
} from "@/hooks/services/reservation";
import type { AppNavigation } from "@/types";

export const ClubReservationWidget = ({ clubId }: { clubId: number }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { data, isPending, isFetching, isError, error, refetch } =
    useClubReservations(clubId);
  const displayData = useReservationDisplayData(data);

  return (
    <WidgetBoundary
      title={t("services.reservation.title")}
      query={{
        isPending,
        isFetching,
        isError,
        error,
        refetch,
      }}
      loading={<ClubReservationWidgetSkeleton />}
      isEmpty={!displayData?.length}
    >
      <CardGroup
        title={t("services.reservation.title")}
        onPress={
          displayData && displayData.length > 3
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
    </WidgetBoundary>
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
