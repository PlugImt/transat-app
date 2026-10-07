import { HttpError } from "@/api/errors";
import { queryClient } from "@/api/query-client";
import { isSessionInvalidError, performSessionTeardown } from "@/api/session";
import { storage } from "@/services/storage/asyncStorage";

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface HttpRequest {
  /** Path relative to the API base URL (or an absolute URL). */
  url: string;
  method: string;
  /** JSON-serialized, except FormData which is sent as multipart. */
  body?: unknown;
  params?: QueryParams;
  headers?: Record<string, string>;
}

let isTearingDownSession = false;

const joinUrl = (base: string, path: string) =>
  /^https?:\/\//i.test(path)
    ? path
    : `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

const withQuery = (url: string, params?: QueryParams) => {
  const query = Object.entries(params ?? {})
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
  if (!query) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
};

// Mirrors what the API client always did: JSON when parseable, raw text otherwise, nothing when empty.
const parseBody = (text: string): unknown => {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// A session that the backend declares dead (account deleted, password changed) ends everywhere at once.
const handleInvalidSession = async (error: HttpError, sentAuth?: string) => {
  if (!sentAuth || isTearingDownSession || !isSessionInvalidError(error))
    return;

  // A newer token (e.g. issued after a password change) may already be stored; keep it.
  const currentToken = await storage.get<string>("token");
  if (currentToken && sentAuth !== `Bearer ${currentToken}`) return;

  isTearingDownSession = true;
  try {
    await performSessionTeardown(queryClient);
  } finally {
    isTearingDownSession = false;
  }
};

/** Thin wrapper over fetch: throws `HttpError` for network failures and non-2xx answers. */
export const httpRequest = async <T>({
  url,
  method,
  body,
  params,
  headers = {},
}: HttpRequest): Promise<T> => {
  const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "";
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET" && method !== "HEAD";
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    // FormData needs the runtime to add its own multipart boundary.
    ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };
  const fullUrl = withQuery(joinUrl(baseURL, url), params);

  if (__DEV__) {
    console.log(`[API] ${method} ${fullUrl}`, {
      hasToken: Boolean(headers.Authorization),
    });
  }

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: hasBody
        ? isFormData
          ? (body as FormData)
          : JSON.stringify(body)
        : undefined,
    });
  } catch (cause) {
    throw new HttpError("Network request failed", {
      code: "ERR_NETWORK",
      cause,
    });
  }

  const data = parseBody(await response.text());

  if (!response.ok) {
    const error = new HttpError(
      `Request failed with status ${response.status}`,
      {
        status: response.status,
        data,
      },
    );
    await handleInvalidSession(error, headers.Authorization);
    throw error;
  }

  return data as T;
};
