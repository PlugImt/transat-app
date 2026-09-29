import type { AxiosError } from "axios";

/** Response body shape used by existing auth and API error handlers. */
export type ApiErrorBody = {
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

function extractErrorCode(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const body = data as ApiErrorBody;

  if (typeof body.error === "string" && body.error.length > 0) {
    return body.error;
  }

  return undefined;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly serverMessage?: string;
  readonly data?: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      serverMessage?: string;
      data?: unknown;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.serverMessage = options?.serverMessage;
    this.data = options?.data;
  }

  static fromAxiosError(
    error: AxiosError<ApiErrorBody>,
    fallbackMessage: string,
  ): ApiError {
    if (!error.response) {
      return new ApiError(fallbackMessage, {
        code: error.code,
        cause: error,
      });
    }

    const { data, status } = error.response;
    const serverMessage = extractServerMessage(data);
    const code = extractErrorCode(data);

    return new ApiError(serverMessage ?? fallbackMessage, {
      status,
      code,
      serverMessage,
      data,
      cause: error,
    });
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
