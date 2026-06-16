import type { AxiosError } from "axios";

type ApiErrorBody = {
  error?: string;
  message?: string;
};

function extractServerMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const body = data as ApiErrorBody;

  if (typeof body.error === "string" && body.error.length > 0) {
    return body.error;
  }

  if (typeof body.message === "string" && body.message.length > 0) {
    return body.message;
  }

  return undefined;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly data?: unknown;
  readonly serverMessage?: string;

  constructor(
    message: string,
    options?: {
      status?: number;
      data?: unknown;
      serverMessage?: string;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = "ApiError";
    this.status = options?.status;
    this.data = options?.data;
    this.serverMessage = options?.serverMessage;
  }

  static fromAxiosError(
    error: AxiosError<ApiErrorBody>,
    fallbackMessage: string,
  ): ApiError {
    const data = error.response?.data;
    const serverMessage = extractServerMessage(data);

    return new ApiError(serverMessage ?? fallbackMessage, {
      status: error.response?.status,
      data,
      serverMessage,
      cause: error,
    });
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
