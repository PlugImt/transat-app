import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "@/api";
import { QUERY_KEYS } from "@/constants";

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
    },
  });
}
