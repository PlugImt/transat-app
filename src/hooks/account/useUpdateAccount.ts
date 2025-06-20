import { updateUser } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { storage } from "@/services/storage/asyncStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: async (updatedUser) => {
      await storage.set("newf", updatedUser);
      queryClient.setQueryData([QUERY_KEYS.user], updatedUser);
    },
  });
}
