import { useNavigation } from "expo-router/react-navigation";
import { CalendarClock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { MyReservation } from "@/dto/reservation";
import { useDate } from "@/hooks/common/useDate";
import {
  useCancelSlot,
  useReservationFeedback,
  useReturnItem,
} from "@/hooks/services/reservation";
import type { AppNavigation } from "@/types";
import { getParisYmd, parseApiDate } from "@/utils/reservation-time";
import { ConfirmAction } from "./ConfirmAction";

interface MyReservationRowProps {
  reservation: MyReservation;
  /** Past reservations have no actions. */
  past?: boolean;
  /** Relative hint such as "in 2 hours", shown for the next upcoming slot. */
  caption?: string;
}

export const MyReservationRow = ({
  reservation,
  past = false,
  caption,
}: MyReservationRowProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { theme } = useTheme();
  const { formatDate, formatTime } = useDate();
  const feedback = useReservationFeedback();
  const cancelSlot = useCancelSlot();
  const returnItem = useReturnItem();

  const start = parseApiDate(reservation.start_date);
  const end = reservation.end_date ? parseApiDate(reservation.end_date) : null;

  const timeLabel = reservation.slot
    ? `${formatTime(start)} – ${end ? formatTime(end) : ""}`
    : end
      ? `${formatDate(start, "d MMM")} ${formatTime(start)} → ${formatDate(end, "d MMM")} ${formatTime(end)}`
      : t("services.reservation.personal.heldSince", {
          time: `${formatDate(start, "d MMM")} ${formatTime(start)}`,
        });

  const handleCancel = () =>
    cancelSlot.mutate(
      { itemId: reservation.id, start },
      {
        onSuccess: () =>
          feedback.success(t("services.reservation.cancelSuccess")),
        onError: (error) =>
          feedback.failure(error, t("services.reservation.errors.cancelError")),
      },
    );

  const handleReturn = () =>
    returnItem.mutate(reservation.id, {
      onSuccess: () =>
        feedback.success(t("services.reservation.returnSuccess")),
      onError: (error) =>
        feedback.failure(error, t("services.reservation.errors.returnError")),
    });

  return (
    <Card
      className="flex-row items-center gap-4"
      accessibilityLabel={reservation.name}
      onPress={
        reservation.slot
          ? () =>
              navigation.navigate("ReservationCalendar", {
                id: reservation.id,
                title: reservation.name,
                date: getParisYmd(start),
              })
          : undefined
      }
    >
      <View className="flex-1 gap-1">
        <Text variant="h3" numberOfLines={1}>
          {reservation.name}
        </Text>
        <View className="flex-row items-center gap-1">
          <CalendarClock size={14} color={theme.muted} />
          <Text variant="sm" color="muted" numberOfLines={1} className="flex-1">
            {timeLabel}
          </Text>
        </View>
        {caption && (
          <Text variant="sm" color="primary" numberOfLines={1}>
            {caption}
          </Text>
        )}
      </View>

      {!past && reservation.slot && (
        <ConfirmAction
          title={t("services.reservation.cancelReservation")}
          description={t("services.reservation.cancelConfirmDesc")}
          confirmLabel={t("services.reservation.confirmCancel")}
          onConfirm={handleCancel}
          isPending={cancelSlot.isPending}
        >
          <Button label={t("common.cancel")} variant="secondary" size="sm" />
        </ConfirmAction>
      )}

      {!past && !reservation.slot && (
        <ConfirmAction
          title={t("services.reservation.returnItem")}
          description={t("services.reservation.returnConfirmDesc")}
          confirmLabel={t("services.reservation.confirmReturn")}
          onConfirm={handleReturn}
          isPending={returnItem.isPending}
        >
          <Button label={t("services.reservation.returnItem")} size="sm" />
        </ConfirmAction>
      )}
    </Card>
  );
};
