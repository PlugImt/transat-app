import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { useReservationMutation } from "@/hooks/services/reservation/useReservationMutations";
import { hapticFeedback } from "@/utils/haptics.utils";

interface ReservationDialogProps {
  children: ReactElement<{ onPress?: () => void }>;
  itemId: number;
  itemTitle: string;
  isReturning?: boolean;
}

export const ReservationDialog = ({
  children,
  itemId,
  isReturning = false,
}: ReservationDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const reservationMutation = useReservationMutation();

  const handleConfirm = async () => {
    try {
      await reservationMutation.mutateAsync({
        id: itemId,
        isReturning: isReturning,
      });

      const successMessage = isReturning
        ? t("services.reservation.returnSuccess")
        : t("services.reservation.reserveSuccess");

      toast(successMessage);
      await hapticFeedback.success();
    } catch (_error) {
      const errorMessage = isReturning
        ? t("services.reservation.returnError")
        : t("services.reservation.reserveError");

      toast(errorMessage, "destructive");
      await hapticFeedback.error();
    }
  };

  const dialogTitle = isReturning
    ? t("services.reservation.returnItem")
    : t("services.reservation.reserve");

  const dialogDescription = isReturning
    ? t("services.reservation.returnConfirmDesc")
    : t("services.reservation.reserveConfirmDesc");

  const confirmLabel = isReturning
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
        isPending={reservationMutation.isPending}
      >
        <Text>{dialogDescription}</Text>
      </DialogContent>
    </Dialog>
  );
};
