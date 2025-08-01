import * as Sentry from "@sentry/react-native";
import type { AxiosError } from "axios";
import {
  createContext,
  type FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { Loading, NotLoggedIn, User } from "@/dto";
import { useAuthMutations } from "@/hooks/auth/useAuthMutations";
import { useVerificationCode } from "@/hooks/auth/useVerificationCode";

interface AuthContextType {
  user: User | null | undefined;
  isPending: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success?: boolean;
    needsVerification?: boolean;
    email?: string;
  }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    language: string,
  ) => Promise<{ success: boolean }>;
  saveToken: (token: string) => Promise<{ success: boolean }>;
  saveExpoPushToken: (token: string) => Promise<boolean | undefined>;
  verifyCode: (
    email: string,
    verification_code: string,
  ) => Promise<{ success: boolean }>;
  resendCode: (email: string) => void;
  isVerifying: boolean;
  isResending: boolean;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    email: string,
    verification_code: string,
    new_password: string,
    new_password_confirmation: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    user: userQuery,
    refetchUser,
    isUserLoading,
    isLoggingIn,
    isRegistering,
    login: loginMutation,
    register: registerMutation,
    saveToken: saveTokenMutation,
    logout: logoutMutation,
    saveExpoPushToken: saveExpoPushTokenMutation,
    resetPassword: resetPasswordMutation,
    changePassword: changePasswordMutation,
  } = useAuthMutations();

  const {
    verifyCode: verifyCodeMutation,
    isVerifying,
    resendCode,
    isResending,
  } = useVerificationCode();

  const [user, setUser] = useState<User | NotLoggedIn | Loading>(undefined);

  useEffect(() => {
    if (typeof userQuery !== "undefined") {
      setUser(userQuery);
    }
  }, [userQuery]);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation({ email, password });
      await saveTokenMutation(response.token);
      const user = await refetchUser();
      setUser(user.data);
      Sentry.setUser({
        email: user.data?.email,
        id: user.data?.id_newf,
        username: `${user.data?.first_name} ${user.data?.last_name}`,
      });
      Sentry.addBreadcrumb({
        message: "User logged in",
        level: "info",
        data: {
          email: user.data?.email,
        },
      });
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || "Login failed";
      console.error("Login failed:", error, errorMessage);

      if (
        axiosError.response?.status === 401 &&
        errorMessage === "Validate your account first"
      ) {
        return { needsVerification: true, email };
      }

      throw new Error(errorMessage);
    }
  };

  const register = async (
    email: string,
    password: string,
    language: string,
  ) => {
    try {
      await registerMutation({ email, password, language });
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        throw new Error("You already have an account");
      }

      if (axiosError.response?.status === 400) {
        throw new Error("Only IMT emails are allowed");
      }

      throw new Error("Registration failed");
    }
  };

  const saveToken = async (token: string) => {
    try {
      await saveTokenMutation(token);
      return { success: true };
    } catch (error) {
      console.error("Error saving token:", error);
      return { success: false };
    }
  };

  const saveExpoPushToken = useCallback(
    async (token: string) => {
      try {
        await saveExpoPushTokenMutation(token);
        return true;
      } catch (error) {
        console.error("Error saving expo push token:", error);
        return false;
      }
    },
    [saveExpoPushTokenMutation],
  );

  const logout = async () => {
    try {
      await logoutMutation();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const verifyCode = async (email: string, verification_code: string) => {
    try {
      const { token } = await verifyCodeMutation({ email, verification_code });
      await saveTokenMutation(token);
      const user = await refetchUser();
      setUser(user.data);
      return { success: true };
    } catch (error) {
      console.error("Error verifying code:", error);
      return { success: false };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await resetPasswordMutation(email);
      return { success: true };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { success: false };
    }
  };

  const changePassword = async (
    email: string,
    verification_code: string,
    new_password: string,
    new_password_confirmation: string,
  ) => {
    try {
      await changePasswordMutation({
        email,
        verification_code,
        new_password,
        new_password_confirmation,
      });
      return { success: true };
    } catch (error) {
      console.error("Error changing password:", error);
      return { success: false };
    }
  };

  const value = {
    user,
    isPending: isUserLoading || isLoggingIn || isRegistering,
    login,
    logout,
    register,
    saveToken,
    saveExpoPushToken,
    resendCode,
    verifyCode,
    isVerifying,
    isResending,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
