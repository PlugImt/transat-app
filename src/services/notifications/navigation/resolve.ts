import type { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/api/errors";
import {
  NOTIFICATION_NAVIGATION_VERSION,
  type NotificationNavigation,
  notificationNavigationSchema,
} from "@/dto/notification";
import { DESTINATIONS, type ResolvedDestination } from "./destinations";
import type { ExternalLink, RouteTarget } from "./route-target";

const CHECK_TIMEOUT_MS = 3000;
const GONE_STATUSES = new Set([403, 404, 410]);

export type NotificationRoute = {
  /** Where to go; null when there is nowhere sensible to send the user. */
  target: RouteTarget | ExternalLink | null;
  /** The entity is gone or no longer accessible, so `target` is the fallback. */
  unavailable: boolean;
};

const parseJson = (value: unknown) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

/** Notifications sent before the navigation context only carried `screen` (and `eventId`). */
const legacyNavigation = (data: Record<string, unknown>) => {
  const v = NOTIFICATION_NAVIGATION_VERSION;
  if (data.screen === "Restaurant") return { v, type: "restaurant" };
  if (data.screen === "Events") {
    return data.eventId === undefined
      ? { v, type: "service", id: "events" }
      : { v, type: "event", id: data.eventId };
  }
  return undefined;
};

const getNotificationNavigation = (
  data: unknown,
): NotificationNavigation | null => {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const raw = parseJson(record.navigation) ?? legacyNavigation(record);
  const parsed = notificationNavigationSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
};

const resolveDestination = (data: unknown): ResolvedDestination | null => {
  const navigation = getNotificationNavigation(data);
  if (!navigation || !Object.hasOwn(DESTINATIONS, navigation.type)) {
    return null;
  }
  return DESTINATIONS[navigation.type](navigation);
};

const withTimeout = <T>(promise: Promise<T>, ms: number) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("check timed out")), ms);
    promise.then(resolve, reject).finally(() => clearTimeout(timer));
  });

const isGone = (error: unknown) =>
  error instanceof ApiError &&
  error.status !== undefined &&
  GONE_STATUSES.has(error.status);

/**
 * Resolves the route a tapped notification should open, or null if its payload
 * is unknown or invalid. Never throws: any failure other than "entity gone"
 * (offline, slow API...) still opens the page, which shows its own error state.
 */
export const resolveNotificationRoute = async (
  data: unknown,
  queryClient: QueryClient,
  timeoutMs = CHECK_TIMEOUT_MS,
): Promise<NotificationRoute | null> => {
  const destination = resolveDestination(data);
  if (!destination) return null;

  const { target, fallback, check } = destination;
  if (!check) return { target, unavailable: false };

  try {
    const refined = await withTimeout(check(queryClient), timeoutMs);
    return { target: refined ?? target, unavailable: false };
  } catch (error) {
    if (isGone(error)) {
      return { target: fallback ?? null, unavailable: true };
    }
    return { target, unavailable: false };
  }
};
