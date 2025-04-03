import axios from "axios";
import { apiUrlProd } from "./config";

import { apiUrlDev } from "./config";

import { storage } from "@/services/storage/asyncStorage";
import { t } from "i18next";

export async function getAPIUrl() {
  const isDevServerSelected =
    (await storage.get("isDevServerSelected")) === "true";

  return isDevServerSelected ? apiUrlDev : apiUrlProd;
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

  const apiUrl = await getAPIUrl();
  if (process.env.NODE_ENV === "development") {
    console.log("Using API base:", apiUrl);
  }

  const response = await axios({
    method,
    url: `${apiUrl}${endpoint}`,
    data,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status !== 200) {
    console.log("response", response);
    throw new Error(t("account.updateFailed"));
  }

  return response.data;
}
