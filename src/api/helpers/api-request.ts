import type { SpanStatus } from "@sentry/core";
import { spanToTraceHeader } from "@sentry/core";
import * as Sentry from "@sentry/react-native";
import { t } from "i18next";
import { Method } from "@/api/enums";
import { ApiError, HttpError, isStudentOnlyForbiddenError } from "@/api/errors";
import { httpRequest, type QueryParams } from "@/api/helpers/http-client";
import type { ApiMethod } from "@/api/types";
import { storage } from "@/services/storage/asyncStorage";

export const apiRequest = async <T>(
  endpoint: string,
  method: ApiMethod = Method.GET,
  data?: unknown,
  config: { params?: QueryParams } = {},
  isAnonymous = false,
): Promise<T> => {
  const token = await storage.get("token");

  if (!token && !isAnonymous) {
    throw new Error(t("account.noToken"));
  }

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
        const result = await httpRequest<T>({
          url: endpoint,
          method,
          body: data,
          params: config.params,
          headers,
        });

        span?.setStatus({ code: 1 } satisfies SpanStatus);
        return result;
      } catch (error) {
        const fallbackMessage =
          t("common.errors.occurred") || "An unexpected error occurred.";

        if (error instanceof HttpError) {
          const apiError = ApiError.fromHttpError(error, fallbackMessage);
          const displayedError = isStudentOnlyForbiddenError(apiError)
            ? new ApiError(t("common.errors.studentOnly"), {
                status: apiError.status,
                code: apiError.code,
                serverMessage: apiError.serverMessage,
                data: apiError.data,
                cause: apiError,
              })
            : apiError;
          span?.setStatus({
            code: 2,
            message: displayedError.message,
          } satisfies SpanStatus);
          Sentry.captureException(displayedError);
          throw displayedError;
        }

        const err = error instanceof Error ? error : new Error(String(error));
        span?.setStatus({ code: 2, message: err.message } satisfies SpanStatus);
        Sentry.captureException(err);
        throw err;
      }
    },
  );
};
