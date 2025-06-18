import type { SpanStatus } from "@sentry/core";
import { spanToTraceHeader } from "@sentry/core";
import * as Sentry from "@sentry/react-native";
import type { AxiosInstance, AxiosRequestHeaders } from "axios";
import axios from "axios";
import { t } from "i18next";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
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

  return Sentry.startSpan(
    {
      name: `API Request: ${method} ${endpoint}`,
      op: "http.client",
      forceTransaction: true,
    },
    async (span) => {
      let sentryTraceHeaderValue: string | undefined;

      if (span) {
        try {
          sentryTraceHeaderValue = spanToTraceHeader(span);
        } catch (e) {
          console.error(
            "Sentry: Failed to generate sentry-trace header using spanToTraceHeader.",
            e,
          );
        }
      } else {
        console.warn("Sentry: Span object was not available for tracing.");
      }

      const headers: AxiosRequestHeaders = {
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;

      if (sentryTraceHeaderValue) {
        headers["x-sentry-trace"] = sentryTraceHeaderValue;
      }

      try {
        const response = await api({
          method,
          url: `${endpoint}`,
          data,
          headers,
        });

        if (response.status < 200 || response.status >= 300) {
          Sentry.captureMessage(
            `API Error: ${response.status} on ${method} ${endpoint}`,
            "error",
          );
          if (span) span.setStatus({ code: 2 } satisfies SpanStatus);
          throw new Error(t("common.errors.occurred"));
        }

        if (span) span.setStatus({ code: 1 } satisfies SpanStatus);
        return response.data;
      } catch (error) {
        Sentry.captureException(error);
        if (span)
          span.setStatus({
            code: 2,
            message: "Internal error",
          } satisfies SpanStatus);
        throw error;
      }
    },
  );
}
