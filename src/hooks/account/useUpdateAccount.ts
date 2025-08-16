import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUser, updateUser } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { storage } from "@/services/storage/asyncStorage";

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: async (updatedUser) => {
      await storage.set("newf", updatedUser);

      const freshUser = await fetchUser();
      await storage.set("newf", freshUser);

      queryClient.setQueryData(QUERY_KEYS.user, freshUser);
      queryClient.setQueryData(QUERY_KEYS.auth.user, freshUser);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.user });
    },
  });
};
