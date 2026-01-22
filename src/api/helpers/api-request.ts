import type { SpanStatus } from "@sentry/core";
import { spanToTraceHeader } from "@sentry/core";
import * as Sentry from "@sentry/react-native";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { t } from "i18next";
import { Method } from "@/api/enums";
import { getApiInstance } from "@/api/helpers/api-instance";
import type { ApiMethod } from "@/api/types";
import { storage } from "@/services/storage/asyncStorage";

export const apiRequest = async <T>(
  endpoint: string,
  method: ApiMethod = Method.GET,
  data?: unknown,
  config: AxiosRequestConfig = {},
  isAnonymous = false,
): Promise<T> => {
  const token = await storage.get("token");

  if (!token && !isAnonymous) {
    throw new Error(t("account.noToken"));
  }

  const api = await getApiInstance();

  return Sentry.startSpan(
    {
      name: `API: ${method} ${endpoint}`,
      op: "http.client",
      forceTransaction: true,
    },
    async (span) => {
      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (span) {
        try {
          headers["x-sentry-trace"] = spanToTraceHeader(span);
        } catch (e) {
          console.warn("[Sentry] Trace header error", e);
        }
      }

      try {
        const response = await api.request<T>({
          url: endpoint,
          method,
          data,
          ...config,
          headers,
        });

        span?.setStatus({ code: 1 } satisfies SpanStatus);
        return response.data;
      } catch (error) {
        let err: Error & { status?: number; isNetworkError?: boolean };

        // Preserve axios error information for proper error handling
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          err = new Error(
            axiosError.response?.data
              ? String(axiosError.response.data)
              : axiosError.message ||
                  t("common.errors.occurred") ||
                  "An unexpected error occurred.",
          ) as Error & { status?: number; isNetworkError?: boolean };

          // Attach status code for proper error handling upstream
          err.status = axiosError.response?.status;
          // Network errors don't have a response (timeout, no connection, etc.)
          err.isNetworkError = !axiosError.response && !!axiosError.code;
        } else {
          err = (
            error instanceof Error ? error : new Error(String(error))
          ) as Error & {
            status?: number;
            isNetworkError?: boolean;
          };
        }

        span?.setStatus({ code: 2, message: err.message } satisfies SpanStatus);
        Sentry.captureException(err);

        throw err;
      }
    },
  );
};
