import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import {
  useCalendarReservationMutation,
  useReservationMutation,
} from "@/hooks/services/reservation/useReservationMutations";

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
  const reservationMutation = useReservationMutation();
  const calendarMutation = useCalendarReservationMutation();

  const handleConfirm = async () => {
    if (isActionCancel) {
      await calendarMutation.mutateAsync({
        id: itemId,
        isCancelling: true,
        startDate,
      });
      return;
    }

    if (isReturning) {
      await reservationMutation.mutateAsync({ id: itemId, isReturning });
      return;
    }

    if (startDate) {
      await calendarMutation.mutateAsync({
        id: itemId,
        isCancelling: false,
        startDate,
      });
      return;
    }

    await reservationMutation.mutateAsync({ id: itemId, isReturning });
  };

  const dialogTitle = isActionCancel
    ? t("services.reservation.cancelReservation", {
        defaultValue: "Cancel reservation",
      })
    : isReturning
      ? t("services.reservation.returnItem")
      : t("services.reservation.reserve");

  const dialogDescription = isActionCancel
    ? t("services.reservation.cancelConfirmDesc", {
        defaultValue: "Are you sure you want to cancel this reservation?",
      })
    : isReturning
      ? t("services.reservation.returnConfirmDesc")
      : t("services.reservation.reserveConfirmDesc");

  const confirmLabel = isActionCancel
    ? t("services.reservation.confirmCancel", { defaultValue: "Confirm" })
    : isReturning
      ? t("services.reservation.confirmReturn")
      : t("services.reservation.confirmReserve");

  const isAnyPending =
    calendarMutation.isPending || reservationMutation.isPending;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent
        title={dialogTitle}
        className="gap-2"
        cancelLabel={t("common.cancel")}
        confirmLabel={confirmLabel}
        onConfirm={handleConfirm}
        isPending={isAnyPending}
      >
        <Text>{dialogDescription}</Text>
      </DialogContent>
    </Dialog>
  );
};
