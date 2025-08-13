import type { ComponentType, ReactElement } from "react";
import { ReservationListOnly } from "@/app/screens/services/reservation/components/ReservationPageContainer";
import CardGroup from "@/components/common/CardGroup";
import type { GetReservation } from "@/dto/reservation";
import { useReservationData } from "@/hooks/services/reservation/useReservationData";

interface ClubReservationsProps {
  title: string;
  data: GetReservation[] | GetReservation | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  headerComponent?: ReactElement | ComponentType<object> | null;
}

export const ClubReservations = ({
  title,
  data,
  isPending,
  isError,
  error,
  headerComponent,
}: ClubReservationsProps) => {
  const combinedData = useReservationData(data);

  if (!isPending && !isError && combinedData.length === 0) {
    return null;
  }

  return (
    <CardGroup title={title}>
      <ReservationListOnly
        title={title}
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
