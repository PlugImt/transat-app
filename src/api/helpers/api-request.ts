import { spanToTraceHeader } from "@sentry/core";
import type { SpanStatus } from "@sentry/core";
import * as Sentry from "@sentry/react-native";
import { t } from "i18next";

import { storage } from "@/services/storage/asyncStorage";
import { getApiInstance } from "./api-instance";
import { Method } from "../enums";
import { ApiMethod } from "../types";

export const apiRequest = async <T>(
    endpoint : string,
    method: ApiMethod = Method.GET,
    data? : any,
    isAnonymous = false
): Promise<T> => {
	const token = await storage.get("token");

	if (!token && !isAnonymous) {
		throw new Error(t("account.noToken"));
	}

	const api = await getApiInstance();

	return Sentry.startSpan({
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
					headers
				});

				span?.setStatus({ code: 1 } satisfies SpanStatus);
				return response.data;
			} catch (error: any) {
				span?.setStatus({ code: 2, message: error.message } satisfies SpanStatus);
				Sentry.captureException(error);

				throw new Error(
					t("common.errors.occurred") || "An unexpected error occurred."
				);
			}
		}
	);
};
