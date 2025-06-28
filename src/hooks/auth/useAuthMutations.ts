import { API_ROUTES, apiRequest, getAPIUrl, Method } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { NotLoggedIn, User } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
        const userData = await apiRequest<User>(API_ROUTES.user);
        await storage.set("newf", userData);
        return userData;
      } catch (_error) {
        await storage.remove("token");
        return null as NotLoggedIn;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationKey: QUERY_KEYS.auth.login,
    mutationFn: async ({ email, password }) => {
      return await apiRequest<LoginResponse>(
        API_ROUTES.login,
        Method.POST,
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
    }: {
      email: string;
      password: string;
      language: string;
    }) => {
      return await apiRequest(
        API_ROUTES.register,
        Method.POST,
        {
          email,
          password,
          language,
        },
        true,
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const saveTokenMutation = useMutation({
    mutationKey: QUERY_KEYS.auth.saveToken,
    mutationFn: async (token: string) => {
      await storage.set("token", token);
      const userData = await apiRequest<User>(API_ROUTES.user);
      await storage.set("newf", userData);
      return userData;
    },
  });

  const saveExpoPushTokenMutation = useMutation({
    mutationKey: QUERY_KEYS.auth.saveExpoPushToken,
    mutationFn: async (token: string) => {
      const expoPushToken = await storage.get("expoPushToken");
      if (expoPushToken === token) return true;

      await apiRequest(API_ROUTES.user, "PATCH", {
        notification_token: token,
      });
      await storage.set("expoPushToken", token);
      return true;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: QUERY_KEYS.auth.resetPassword,
    mutationFn: async (email: string) => {
      return await apiRequest(
        API_ROUTES.verifyCode,
        Method.POST,
        { email },
        true,
      );
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: QUERY_KEYS.auth.changePassword,
    mutationFn: async (data: {
      email: string;
      verification_code: string;
      new_password: string;
      new_password_confirmation: string;
    }) => {
      return await apiRequest(API_ROUTES.changePassword, Method.PATCH, data, true);
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
    resetPassword: resetPasswordMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
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
