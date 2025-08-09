import { useTranslation } from "react-i18next";
import { useReservations } from "@/hooks/services/reservation/useReservation";
import { ReservationPageContainer } from "./components";

export const Reservation = () => {
  const { t } = useTranslation();
  const reservationQuery = useReservations();

  return (
    <ReservationPageContainer
      title={t("services.reservation.title")}
      {...reservationQuery}
    />
  );
};
