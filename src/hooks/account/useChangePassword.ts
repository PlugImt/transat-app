import { QUERY_KEYS } from "@/lib/queryKeys";
import { updatePassword } from "@/lib/user";
import { storage } from "@/services/storage/asyncStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
    },
  });
}
