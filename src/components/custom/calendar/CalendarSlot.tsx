import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
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
    !!reservationDetails?.user &&
    reservationDetails?.user?.email !== auth.user?.email;
  const canBeFreed =
    !!reservationDetails?.user &&
    reservationDetails?.user?.email === auth.user?.email;

  return (
    <Card
      className={`flex flex-row gap-2 justify-between items-center ${disabled ? "opacity-60" : null} mx-4 my-1`}
    >
      <View>
        <Text variant="h2">
          {reservationDetails
            ? `${formatTimeFromDate(reservationDetails.start_date)} - ${formatTimeFromDate(reservationDetails.end_date)}`
            : null}
        </Text>
        {reservationDetails?.user ? (
          <Text className="text-sm text-gray-500">
            {`${t("services.reservation.reservedBy")} ${reservationDetails?.user?.first_name} ${reservationDetails?.user?.last_name}`}
          </Text>
        ) : null}
      </View>

      <Button
        variant="secondary"
        disabled={disabled}
        onPress={() => {
          if (canBeFreed) {
            // Logic to free the slot
          } else {
            // Logic to reserve the slot
          }
        }}
        label={
          canBeFreed
            ? t("services.reservation.returnItem")
            : t("services.reservation.reserve")
        }
      />
    </Card>
  );
};

export default CalendarSlot;
