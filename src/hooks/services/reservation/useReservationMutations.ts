import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteReservation,
  updateReservation,
} from "@/api/endpoints/reservation/reservation.endpoint";
import { QUERY_KEYS } from "@/constants";
import { formatDateSQL } from "@/utils/calendar.utils";

// Mutation parameter types
interface ReservationMutationParams {
  id: number;
  isReturning?: boolean;
  isCancelling?: boolean;
  startDate?: string;
}

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isReturning,
    }: Pick<ReservationMutationParams, "id" | "isReturning">) => {
      const currentTime = formatDateSQL(new Date());
      return updateReservation(id, isReturning ? null : currentTime);
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: QUERY_KEYS.reservation.categories,
        })
        .then((r) => r);
      queryClient
        .invalidateQueries({ queryKey: QUERY_KEYS.reservation.my() })
        .then((r) => r);
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      startDate,
    }: Pick<ReservationMutationParams, "id" | "startDate">) => {
      if (!startDate) {
        throw new Error("Start date is required for cancellation");
      }
      return deleteReservation(id, formatDateSQL(new Date(startDate)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.categories,
      });
      queryClient.invalidateQueries({ queryKey: ["reservation", "root"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservation.my() });
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
    }: ReservationMutationParams) => {
      if (isCancelling) {
        if (!startDate) {
          throw new Error("Start date is required for cancellation");
        }
        return deleteReservation(id, formatDateSQL(new Date(startDate)));
      }

      const effectiveStart = startDate
        ? formatDateSQL(new Date(startDate))
        : formatDateSQL(new Date());
      return updateReservation(id, effectiveStart);
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: QUERY_KEYS.reservation.item(),
        })
        .then((r) => r);
      queryClient
        .invalidateQueries({
          queryKey: QUERY_KEYS.reservation.categories,
        })
        .then((r) => r);
      queryClient
        .invalidateQueries({ queryKey: QUERY_KEYS.reservation.my() })
        .then((r) => r);
    },
  });
};

export const useReservationMutation = useUpdateReservation;
