import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
import axios from "axios";
import type { AxiosInstance } from "axios";
import { t } from "i18next";
import { apiUrlDev, apiUrlProd } from "./config";

let apiInstance: AxiosInstance | null = null;

export async function getAPIUrl(): Promise<string> {
  if (!apiUrlDev) {
    return apiUrlProd;
  }

  const isDevServerSelected =
    (await storage.get(STORAGE_KEYS.IS_DEV_SERVER_SELECTED)) === "true";
  return isDevServerSelected ? apiUrlDev : apiUrlProd;
}

export async function getApiInstance(): Promise<AxiosInstance> {
  if (!apiInstance) {
    const baseURL = await getAPIUrl();
    apiInstance = axios.create({ baseURL });

    apiInstance.interceptors.request.use(async (config) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Using API base:", baseURL, "fetching:", config.url);
      }
      return config;
    });

    apiInstance.interceptors.request.use(async (config) => {
      const token = await storage.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  return apiInstance;
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" = "GET",
  data?: Record<string, unknown>,
  isAnonymous?: boolean,
): Promise<T> {
  const token = await storage.get("token");
  if (!token && !isAnonymous) {
    throw new Error(t("account.noToken"));
  }

  const api = await getApiInstance();
  const response = await api({
    method,
    url: `${endpoint}`,
    data,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status < 200 || response.status >= 300) {
    console.log("response", response);
    throw new Error(t("common.errors.occurred"));
  }

  return response.data;
}
