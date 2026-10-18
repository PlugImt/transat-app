import * as Sentry from "@sentry/react-native";

const TOKEN_PATTERN = /(Expo(?:nent)?PushToken)\[[^\]]*\]/g;

/** Removes push tokens from any text before it is logged or sent to Sentry. */
export const redactPushTokens = (text: string) =>
  text.replace(TOKEN_PATTERN, "$1[redacted]");

/** Describes a token for diagnostics without revealing it. */
export const describeToken = (token: string | null | undefined) =>
  token ? `token(…${token.replace(/\]$/, "").slice(-4)})` : "no token";

const describeError = (error: unknown) =>
  redactPushTokens(error instanceof Error ? error.message : String(error));

type Data = Record<string, string | number | boolean | null | undefined>;

const breadcrumb = (level: "info" | "warning", event: string, data?: Data) =>
  Sentry.addBreadcrumb({
    category: "notifications",
    level,
    message: event,
    data,
  });

/**
 * Diagnostics for the notification lifecycle. Events become Sentry breadcrumbs, so a later crash report shows
 * what the push setup was doing; nothing here ever carries a token, a secret or a notification text.
 */
export const notificationLog = {
  info(event: string, data?: Data) {
    breadcrumb("info", event, data);
    if (__DEV__) console.log(`[Notifications] ${event}`, data ?? "");
  },
  warn(event: string, error?: unknown, data?: Data) {
    const detail = error === undefined ? undefined : describeError(error);
    breadcrumb("warning", event, { ...data, error: detail });
    console.warn(`[Notifications] ${event}`, detail ?? "", data ?? "");
  },
};
