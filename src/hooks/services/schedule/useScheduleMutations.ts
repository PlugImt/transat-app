import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMySchedule, updateMySchedule } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { UpdateUserSchedule } from "@/dto";

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserSchedule) => updateMySchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedule });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMySchedule,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.schedule, null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedule });
    },
  });
};
