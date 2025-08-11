import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { ReservationDialog } from "@/components/custom/ReservationDialog";
import type { ReservationScheme } from "@/dto";
import { useAuth } from "@/hooks/account";

interface SlotProps {
  reservationDetails?: ReservationScheme;
  itemId?: number;
}

const CalendarSlot = ({ reservationDetails, itemId }: SlotProps) => {
  const auth = useAuth();
  const { t } = useTranslation();

  const formatTimeFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const disabled =
    (!!reservationDetails?.user &&
      reservationDetails?.user?.email !== auth.user?.email) ||
    (typeof reservationDetails?.end_date === "string" &&
      reservationDetails.end_date < new Date().toISOString());

  const startDate = reservationDetails?.start_date;

  return (
    <Card
      className={`flex-row gap-2 justify-between items-center ${disabled ? "opacity-60" : ""} mx-4 my-1`}
    >
      <View>
        <Text variant="h3">
          {reservationDetails
            ? `${formatTimeFromDate(reservationDetails.start_date)} - ${formatTimeFromDate(reservationDetails.end_date)}`
            : null}
        </Text>

        {reservationDetails?.user ? (
          <Text variant="sm" numberOfLines={1}>
            {`${t("services.reservation.reservedBy")} ${reservationDetails.user.first_name} ${reservationDetails.user.last_name}`}
          </Text>
        ) : null}
      </View>

      {reservationDetails?.id === -1 ? (
        <ReservationDialog
          itemId={itemId as number}
          startDate={startDate as string}
        >
          <Button
            variant="secondary"
            disabled={disabled || !itemId}
            label={t("services.reservation.reserve")}
          />
        </ReservationDialog>
      ) : (
        <ReservationDialog
          itemId={itemId as number}
          isActionCancel
          startDate={startDate as string}
        >
          <Button
            variant="default"
            disabled={disabled || !itemId}
            label={t("common.cancel")}
          />
        </ReservationDialog>
      )}
    </Card>
  );
};

export default CalendarSlot;
