import axios, { type AxiosInstance } from "axios";
import { storage } from "@/services/storage/asyncStorage";

let apiInstance: AxiosInstance | null = null;

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
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL,
        hasToken: Boolean(token),
      });
    }

    return config;
  });

  return instance;
};

export const getApiInstance = async (): Promise<AxiosInstance> => {
  if (!apiInstance) {
    apiInstance = await createApiInstance();
  }
  return apiInstance;
};
