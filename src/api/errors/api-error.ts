/** Response body shape used by existing auth and API error handlers. */
export type ApiErrorBody = {
  error?: string;
  message?: string;
};

export const STUDENT_ONLY_ERROR = "This feature is only available to students";

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

/** Raw failure of an HTTP call: no answer at all (`status` undefined) or a non-2xx answer. */
export class HttpError extends Error {
  readonly status?: number;
  readonly data?: unknown;
  readonly code?: string;

  constructor(
    message: string,
    options?: {
      status?: number;
      data?: unknown;
      code?: string;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = "HttpError";
    this.status = options?.status;
    this.data = options?.data;
    this.code = options?.code;
  }
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

  static fromHttpError(error: HttpError, fallbackMessage: string): ApiError {
    if (error.status === undefined) {
      return new ApiError(fallbackMessage, {
        code: error.code,
        cause: error,
      });
    }

    const { data, status } = error;
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

export const isStudentOnlyForbiddenError = (
  error: unknown,
): error is ApiError =>
  ApiError.isApiError(error) &&
  error.status === 403 &&
  (error.code === STUDENT_ONLY_ERROR ||
    error.serverMessage === STUDENT_ONLY_ERROR);
