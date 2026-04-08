import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "@/api";
import { useAuth } from "./useAuth";

export const useDeleteAccount = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await logout();
    },
  });
};
