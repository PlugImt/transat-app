import { QUERY_KEYS } from "@/lib/queryKeys";
import { updateUser } from "@/lib/user";
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
