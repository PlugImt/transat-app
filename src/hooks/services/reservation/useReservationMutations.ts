import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReservation } from "@/api/endpoints/reservation/reservation.endpoint";
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
