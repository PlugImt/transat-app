import type { ComponentType, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { ReservationListOnly } from "@/components/reservation";
import type { GetReservation } from "@/dto/reservation";
import { useReservationDisplayData } from "@/hooks/services/reservation/useReservationData";

interface ClubReservationsProps {
  data: GetReservation | GetReservation[] | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  headerComponent?: ReactElement | ComponentType<object> | null;
}

export const ClubReservations = ({
  data,
  isPending,
  isError,
  error,
  headerComponent,
}: ClubReservationsProps) => {
  const displayData = useReservationDisplayData(data);
  const { t } = useTranslation();

  if (!isPending && !isError && displayData.length === 0) {
    return null;
  }

  return (
    <CardGroup title={t("services.reservation.title")}>
      <ReservationListOnly
        title={t("services.reservation.title")}
        data={data}
        isPending={isPending}
        isError={isError}
        error={error}
        headerComponent={headerComponent}
        showScrollIndicators={false}
      />
    </CardGroup>
  );
};

export default ClubReservations;
