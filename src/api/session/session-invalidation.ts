import axios from "axios";
import { ApiError } from "@/api/errors";

// Backend reasons that legitimately end a session: account deleted, or password changed after the token was issued.
const ACCOUNT_INVALID_PATTERN =
  /account.*(deleted|removed|not found|no longer)|user.*(deleted|not found|does not exist|no longer)|password.*changed|token.*(issued before|revoked|invalidated|expired)/i;

const collectMessages = (body: unknown): string[] => {
  if (!body || typeof body !== "object") return [];
  const { error, message } = body as { error?: unknown; message?: unknown };
  return [error, message].filter((v): v is string => typeof v === "string");
};

/** True only when the backend explicitly says the account/token can no longer be used. */
export const isSessionInvalidError = (error: unknown): boolean => {
  let status: number | undefined;
  let messages: string[] = [];

  if (axios.isAxiosError(error)) {
    status = error.response?.status;
    messages = collectMessages(error.response?.data);
  } else if (ApiError.isApiError(error)) {
    status = error.status;
    messages = [
      error.code,
      error.serverMessage,
      ...collectMessages(error.data),
    ].filter((v): v is string => typeof v === "string");
  }

  if (status !== 401) return false;
  return messages.some((m) => ACCOUNT_INVALID_PATTERN.test(m));
};
