import { useAuthMutations } from "@/hooks/auth/useAuthMutations";
import { useVerificationCode } from "@/hooks/auth/useVerificationCode";
import type { Loading, NotLoggedIn, User } from "@/types/user";
import type { AxiosError } from "axios";
import {
  type FC,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
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
  resetPassword: (email: string) => Promise<{ success: boolean }>;
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
    login: loginMutation,
    register: registerMutation,
    saveToken: saveTokenMutation,
    logout: logoutMutation,
    saveExpoPushToken: saveExpoPushTokenMutation,
    resetPassword: resetPasswordMutation,
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

  const value = {
    user,
    isLoading: isUserLoading,
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
