import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import {
  useCalendarReservationMutation,
  useReservationMutation,
} from "@/hooks/services/reservation/useReservationMutations";
import { hapticFeedback } from "@/utils/haptics.utils";

interface ReservationDialogProps {
  children: ReactElement<{ onPress?: () => void }>;
  itemId: number;
  itemTitle?: string;
  isReturning?: boolean;
  isActionCancel?: boolean;
  startDate?: string;
}

export const ReservationDialog = ({
  children,
  itemId,
  isReturning = false,
  isActionCancel = false,
  startDate,
}: ReservationDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const reservationMutation = useReservationMutation();
  const calendarMutation = useCalendarReservationMutation();

  const handleConfirm = async () => {
    try {
      if (isActionCancel) {
        await calendarMutation.mutateAsync({
          id: itemId,
          isCancelling: true,
          startDate,
        });
      } else if (isReturning) {
        await reservationMutation.mutateAsync({ id: itemId, isReturning });
      } else if (startDate) {
        await calendarMutation.mutateAsync({
          id: itemId,
          isCancelling: false,
          startDate,
        });
      } else {
        await reservationMutation.mutateAsync({ id: itemId, isReturning });
      }

      const successMessage = isActionCancel
        ? t("services.reservation.cancelSuccess")
        : isReturning
          ? t("services.reservation.returnSuccess")
          : t("services.reservation.reserveSuccess");

      toast(successMessage);
      hapticFeedback.success();
    } catch (_error) {
      const errorMessage = isActionCancel
        ? t("services.reservation.errors.cancelError")
        : isReturning
          ? t("services.reservation.errors.returnError")
          : t("services.reservation.errors.reserveError");

      toast(errorMessage, "destructive");
      hapticFeedback.error();
    }
  };

  const dialogTitle = isActionCancel
    ? t("services.reservation.cancelReservation")
    : isReturning
      ? t("services.reservation.returnItem")
      : t("services.reservation.reserve");

  const dialogDescription = isActionCancel
    ? t("services.reservation.cancelConfirmDesc")
    : isReturning
      ? t("services.reservation.returnConfirmDesc")
      : t("services.reservation.reserveConfirmDesc");

  const confirmLabel = isActionCancel
    ? t("services.reservation.confirmCancel")
    : isReturning
      ? t("services.reservation.confirmReturn")
      : t("services.reservation.confirmReserve");

  const isAnyPending =
    calendarMutation.isPending || reservationMutation.isPending;

  return (
    <Dialog
      title={dialogTitle}
      className="gap-2"
      cancelLabel={t("common.cancel")}
      confirmLabel={confirmLabel}
      onConfirm={handleConfirm}
      isPending={isAnyPending}
      trigger={children}
    >
      <Text>{dialogDescription}</Text>
    </Dialog>
  );
};
