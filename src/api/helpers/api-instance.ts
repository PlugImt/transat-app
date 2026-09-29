import axios, { type AxiosInstance } from "axios";
import { queryClient } from "@/api/query-client";
import { performSessionTeardown } from "@/api/session";
import { storage } from "@/services/storage/asyncStorage";

let apiInstance: AxiosInstance | null = null;
let isTearingDownSession = false;

const createApiInstance = async (): Promise<AxiosInstance> => {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const instance = axios.create({ baseURL });

  instance.interceptors.request.use(async (config) => {
    const token = await storage.get("token");

    if (token) {
      (config.headers as Record<string, string>).Authorization =
        `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(
        `[API] ${config.method?.toUpperCase()} ${config.url} BODY: ${JSON.stringify(config.data) || "No Body"}`,
        {
          baseURL,
          hasToken: Boolean(token),
        },
      );
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        !isTearingDownSession
      ) {
        const headers = error.config?.headers;
        const hadAuth = Boolean(
          headers?.Authorization ??
            (typeof headers?.get === "function"
              ? headers.get("Authorization")
              : undefined),
        );

        if (hadAuth) {
          isTearingDownSession = true;
          try {
            await performSessionTeardown(queryClient);
          } finally {
            isTearingDownSession = false;
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const getApiInstance = async (): Promise<AxiosInstance> => {
  if (!apiInstance) {
    apiInstance = await createApiInstance();
  }
  return apiInstance;
};

export const resetApiInstance = () => {
  apiInstance = null;
};
