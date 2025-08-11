import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteReservation,
  updateReservation,
} from "@/api/endpoints/reservation/reservation.endpoint";
import { QUERY_KEYS } from "@/constants";
import { formatDateForBackend } from "@/utils/calendar.utils";

export const useReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isReturning }: { id: number; isReturning: boolean }) => {
      const currentTime = formatDateForBackend(new Date());
      return updateReservation(id, isReturning ? null : currentTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.categories,
      });
      queryClient.invalidateQueries({ queryKey: ["reservation", "root"] });
    },
  });
};

export const useCalendarReservationMutation = () => {
  const queryClient = useQueryClient();

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
        if (!startDate) throw new Error("Missing startDate for cancellation");
        return deleteReservation(id, startDate);
      }
      const effectiveStart = startDate ?? formatDateForBackend(new Date());
      return updateReservation(id, effectiveStart);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservationItem"] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.categories,
      });
      queryClient.invalidateQueries({ queryKey: ["reservation", "root"] });
    },
  });
};
