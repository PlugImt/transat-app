import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES, apiRequest, Method } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { NotLoggedIn, User } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";

interface LoginResponse {
  token: string;
}

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isPending: isUserLoading,
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
      } catch (error) {
        // Only remove token and log out if it's a 401 Unauthorized error
        // Network errors (slow/no internet) should not log the user out
        const errorWithStatus = error as Error & {
          status?: number;
          isNetworkError?: boolean;
        };

        if (errorWithStatus.status === 401) {
          // Token is invalid or expired - log out
          await storage.remove("token");
          await storage.remove("newf");
          queryClient.setQueryData(QUERY_KEYS.auth.user, null);
          return null as NotLoggedIn;
        }

        // For network errors or other errors, keep the user logged in
        // Return null but don't remove the token
        // This allows the app to work offline and retry when connection is restored
        console.warn(
          "[Auth] Failed to fetch user, but keeping session:",
          errorWithStatus.isNetworkError
            ? "Network error"
            : `Status ${errorWithStatus.status}`,
        );
        return null as NotLoggedIn;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) - token is invalid
      const errorWithStatus = error as Error & { status?: number };
      if (errorWithStatus.status === 401) {
        return false;
      }
      // Retry network errors up to 3 times
      return failureCount < 3;
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
        API_ROUTES.login,
        Method.POST,
        {
          email,
          password,
        },
        {},
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
        {},
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
        {},
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
      return await apiRequest(
        API_ROUTES.changePassword,
        Method.PATCH,
        data,
        {},
        true,
      );
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
