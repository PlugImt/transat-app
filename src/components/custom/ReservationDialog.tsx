import type { ReactElement } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@/components/common/Dialog";
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
  itemTitle: string;
  isReturning?: boolean;
  isCancel?: boolean;
  startDate?: string;
}

export const ReservationDialog = ({
  children,
  itemId,
  isReturning = false,
  isCancel = false,
  startDate,
}: ReservationDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const reservationMutation = useReservationMutation();
  const calendarMutation = useCalendarReservationMutation();

  const handleConfirm = async () => {
    try {
      if (isCancel) {
        await calendarMutation.mutateAsync({
          id: itemId,
          isCancelling: true,
          startDate,
        });
      } else {
        await reservationMutation.mutateAsync({
          id: itemId,
          isReturning: isReturning,
        });
      }

      const successMessage = isCancel
        ? t("services.reservation.cancelSuccess", {
            defaultValue: "Reservation canceled",
          })
        : isReturning
          ? t("services.reservation.returnSuccess")
          : t("services.reservation.reserveSuccess");

      toast(successMessage);
      await hapticFeedback.success();
    } catch (_error) {
      const errorMessage = isCancel
        ? t("services.reservation.errors.cancelError", {
            defaultValue: "Unable to cancel reservation",
          })
        : isReturning
          ? t("services.reservation.errors.returnError")
          : t("services.reservation.errors.reserveError");

      toast(errorMessage, "destructive");
      await hapticFeedback.error();
    }
  };

  const dialogTitle = isCancel
    ? t("services.reservation.cancelReservation", {
        defaultValue: "Cancel reservation",
      })
    : isReturning
      ? t("services.reservation.returnItem")
      : t("services.reservation.reserve");

  const dialogDescription = isCancel
    ? t("services.reservation.cancelConfirmDesc", {
        defaultValue: "Are you sure you want to cancel this reservation?",
      })
    : isReturning
      ? t("services.reservation.returnConfirmDesc")
      : t("services.reservation.reserveConfirmDesc");

  const confirmLabel = isCancel
    ? t("services.reservation.confirmCancel", { defaultValue: "Confirm" })
    : isReturning
      ? t("services.reservation.confirmReturn")
      : t("services.reservation.confirmReserve");

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent
        title={dialogTitle}
        className="gap-2"
        cancelLabel={t("common.cancel")}
        confirmLabel={confirmLabel}
        onConfirm={handleConfirm}
        isPending={
          isCancel ? calendarMutation.isPending : reservationMutation.isPending
        }
      >
        <Text>{dialogDescription}</Text>
      </DialogContent>

      <DialogOpenLogger
        itemId={itemId}
        isCancel={isCancel}
        isReturning={isReturning}
        startDate={startDate}
      />
    </Dialog>
  );
};

const DialogOpenLogger = ({
  itemId,
  isCancel,
  isReturning,
  startDate,
}: {
  itemId: number;
  isCancel: boolean;
  isReturning: boolean;
  startDate?: string;
}) => {
  const { open } = useDialog();

  useEffect(() => {
    if (open) {
      console.log("[ReservationDialog] open", {
        itemId,
        isCancel,
        isReturning,
        startDate,
      });
    }
  }, [open, itemId, isCancel, isReturning, startDate]);

  return null;
};
