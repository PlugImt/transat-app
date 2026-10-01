import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { storage } from "@/services/storage/asyncStorage";

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: async (response) => {
      // The old token is invalidated by the password change; the backend returns a fresh one.
      const token = (response as { token?: unknown } | null)?.token;
      if (typeof token === "string" && token) {
        await storage.set("token", token);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    },
  });
};
