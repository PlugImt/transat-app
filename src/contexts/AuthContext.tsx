import { storage } from "@/services/storage/asyncStorage";
import type { User } from "@/types/user";
import axios from "axios";
import { type FC, createContext, useEffect, useState } from "react";

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
  register: (email: string, password: string) => Promise<{ success: boolean }>;
  saveToken: (token: string) => Promise<{ success: boolean }>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // undefined when the user is not checked yet, null when the user is not logged in, User when the user is logged in
  const [user, setUser] = useState<undefined | null | User>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUser().then((r) => r);
  }, []);

  const checkUser = async () => {
    try {
      const userData = await storage.get("token");
      if (userData && typeof userData === "string") {
        saveToken(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://transat.destimt.fr/api/auth/login",
        { email, password },
      );

      if (response.status === 200) {
        const { token } = response.data;
        await saveToken(token);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      // @ts-ignore
      const errorMessage = error.response?.data?.error || "Login failed";
      console.error("Login failed:", errorMessage);

      if (
        // @ts-ignore
        error.response?.status === 401 &&
        errorMessage === "Validate your account first"
      ) {
        return { needsVerification: true, email };
      }

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToken = async (token: string) => {
    await storage.set("token", token);

    // Fetch newf data
    const newfResponse = await axios.get(
      "https://transat.destimt.fr/api/newf/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (newfResponse.status === 200) {
      const newf = newfResponse.data as User;
      await storage.set("newf", newf);

      setUser(newf);
    }

    return { success: true };
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await storage.remove("token");
      await storage.remove("newf");
      setUser(null);
    } catch (error) {
      // @ts-ignore
      console.error("Logout failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch("https://transat.destimt.fr/api/newf/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status === 409) {
        throw new Error("You already have an account");
      }

      if (response.status === 400) {
        throw new Error("Only IMT emails are allowed");
      }

      if (response.status === 201) {
        return { success: true };
      }

      throw new Error("Registration failed");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    saveToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
