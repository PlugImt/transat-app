import { apiRequest } from "@/lib/apiRequest";
import { storage } from "@/services/storage/asyncStorage";
import type { User } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";

interface LoginResponse {
  token: string;
}

export const useAuth = () => {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await storage.get("token");
      if (!token) return null;

      try {
        const userData = await apiRequest<User>("/api/newf/me");
        await storage.set("newf", userData);
        return userData;
      } catch (error) {
        await storage.remove("token");
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
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
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      return await apiRequest("/api/newf/", "POST", {
        email,
        password,
      });
    },
  });

  const saveTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      await storage.set("token", token);
      const userData = await apiRequest<User>("/api/newf/me");
      await storage.set("newf", userData);
      return userData;
    },
  });

  const saveExpoPushTokenMutation = useMutation({
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
  };

  return {
    user,
    isUserLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    saveToken: saveTokenMutation.mutate,
    saveExpoPushToken: saveExpoPushTokenMutation.mutate,
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
