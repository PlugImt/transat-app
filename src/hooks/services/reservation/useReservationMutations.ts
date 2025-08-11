import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  deleteReservation,
  updateReservation,
} from "@/api/endpoints/reservation/reservation.endpoint";
import { useToast } from "@/components/common/Toast";
import { QUERY_KEYS } from "@/constants";
import { formatDateSQL } from "@/utils/calendar.utils";
import { hapticFeedback } from "@/utils/haptics.utils";

export const useReservationMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, isReturning }: { id: number; isReturning: boolean }) => {
      const currentTime = formatDateSQL(new Date());
      return updateReservation(id, isReturning ? null : currentTime);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.categories,
      });
      queryClient.invalidateQueries({ queryKey: ["reservation", "root"] });
      const successMessage = variables.isReturning
        ? t("services.reservation.returnSuccess")
        : t("services.reservation.reserveSuccess");
      toast(successMessage, "success");
      hapticFeedback.success();
    },
    onError: (_error, variables) => {
      const errorMessage = variables.isReturning
        ? t("services.reservation.errors.returnError")
        : t("services.reservation.errors.reserveError");
      toast(errorMessage, "destructive");
      hapticFeedback.error();
    },
  });
};

export const useCalendarReservationMutation = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      isCancelling,
      startDate,
    }: {
      id: number;
      isCancelling: boolean;
      startDate?: string;
    }) => {
      if (isCancelling) {
        if (!startDate)
          throw new Error(t("services.reservation.errors.startDateRequired"));
        return deleteReservation(id, formatDateSQL(new Date(startDate)));
      }
      const effectiveStart = startDate
        ? formatDateSQL(new Date(startDate))
        : formatDateSQL(new Date());
      return updateReservation(id, effectiveStart);
    },
    onSuccess: (_data, variables) => {
      const successMessage = variables.isCancelling
        ? t("services.reservation.cancelSuccess", {
            defaultValue: "Reservation canceled",
          })
        : t("services.reservation.reserveSuccess");
      toast(successMessage, "success");
      hapticFeedback.success();
    },
    onError: (_error, variables) => {
      const errorMessage = variables.isCancelling
        ? t("services.reservation.errors.cancelError", {
            defaultValue: "Unable to cancel reservation",
          })
        : t("services.reservation.errors.reserveError");
      toast(errorMessage, "destructive");
      hapticFeedback.error();
    },
  });
};
