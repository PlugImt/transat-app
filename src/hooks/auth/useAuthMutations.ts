import { apiRequest, getAPIUrl } from "@/lib/apiRequest";
import { apiUrlDev } from "@/lib/config";
import { apiUrlProd } from "@/lib/config";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { storage } from "@/services/storage/asyncStorage";
import type { NotLoggedIn, User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface LoginResponse {
  token: string;
}

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: QUERY_KEYS.auth.user,
    queryFn: async () => {
      const token = await storage.get("token");
      if (!token) return null as NotLoggedIn;

      try {
        const userData = await apiRequest<User>("/api/newf/me");
        await storage.set("newf", userData);
        return userData;
      } catch (error) {
        await storage.remove("token");
        return null as NotLoggedIn;
      }
    },
  });

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationKey: QUERY_KEYS.auth.login,
    mutationFn: async ({ email, password }) => {
      return await apiRequest<LoginResponse>(
        "/api/auth/login",
        "POST",
        {
          email,
          password,
        },
        true,
      );
    },
  });

  const registerMutation = useMutation({
    mutationKey: QUERY_KEYS.auth.register,
    mutationFn: async ({
      email,
      password,
      language,
    }: { email: string; password: string; language: string }) => {
      const apiUrl = await getAPIUrl();

      return await axios.post(`${apiUrl}/api/newf/`, {
        email,
        password,
        language,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const saveTokenMutation = useMutation({
    mutationKey: QUERY_KEYS.auth.saveToken,
    mutationFn: async (token: string) => {
      await storage.set("token", token);
      const userData = await apiRequest<User>("/api/newf/me");
      await storage.set("newf", userData);
      return userData;
    },
  });

  const saveExpoPushTokenMutation = useMutation({
    mutationKey: QUERY_KEYS.auth.saveExpoPushToken,
    mutationFn: async (token: string) => {
      const expoPushToken = await storage.get("expoPushToken");
      if (expoPushToken === token) return true;

      await apiRequest("/api/newf/me", "PATCH", {
        notification_token: token,
      });
      await storage.set("expoPushToken", token);
      return true;
    },
  });

  const logout = async () => {
    await storage.remove("token");
    await storage.remove("newf");

    queryClient.setQueryData(QUERY_KEYS.auth.user, null);
  };

  return {
    user,
    refetchUser,
    isUserLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    saveToken: saveTokenMutation.mutateAsync,
    saveExpoPushToken: saveExpoPushTokenMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isSavingToken: saveTokenMutation.isPending,
    isSavingExpoPushToken: saveExpoPushTokenMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    saveTokenError: saveTokenMutation.error,
    saveExpoPushTokenError: saveExpoPushTokenMutation.error,
  };
};
