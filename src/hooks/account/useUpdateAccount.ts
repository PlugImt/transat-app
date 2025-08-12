import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { storage } from "@/services/storage/asyncStorage";

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: async (updatedUser) => {
      await storage.set("newf", updatedUser);
      queryClient.setQueryData(QUERY_KEYS.user, updatedUser);
      queryClient.setQueryData(QUERY_KEYS.auth.user, updatedUser);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.user });
    },
  });
};
