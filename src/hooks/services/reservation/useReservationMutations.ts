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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.categories,
      });
      queryClient.invalidateQueries({ queryKey: ["reservation", "search"] });
      queryClient.invalidateQueries({ queryKey: ["reservation", "items"] });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: ["reservation", "items", variables.id],
        });
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservation.my() });
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.categories,
      });
      queryClient.invalidateQueries({ queryKey: ["reservation", "search"] });
      queryClient.invalidateQueries({ queryKey: ["reservation", "items"] });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: ["reservation", "items", variables.id],
        });
      }
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
    onSuccess: (_data, variables) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: ["reservation", "items", variables.id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["reservation", "items"] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.categories,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservation.my() });
      queryClient.invalidateQueries({ queryKey: ["reservation", "search"] });
    },
  });
};

export const useReservationMutation = useUpdateReservation;
