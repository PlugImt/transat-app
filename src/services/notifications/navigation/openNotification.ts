import type { QueryClient } from "@tanstack/react-query";
import { notificationLog } from "../log";
import { resolveNotificationRoute } from "./resolve";
import {
  isExternalLink,
  type NavigationAccess,
  pathOf,
  type RouteTarget,
} from "./route-target";

export type OpenNotificationDeps = {
  queryClient: QueryClient;
  access: NavigationAccess;
  navigate: (target: RouteTarget) => void;
  openUrl: (url: string) => Promise<unknown>;
  /** Tells the user the destination is gone or not theirs to open. */
  notifyUnavailable: () => void;
  /** False once a newer tap, or the navigator going away, made this one obsolete. */
  isCurrent: () => boolean;
};

export type OpenOutcome =
  | "opened"
  | "external"
  | "unavailable"
  | "unknown"
  | "superseded";

const typeOf = (data: unknown) => {
  const type = (data as { type?: unknown } | null | undefined)?.type;
  return typeof type === "string" ? type.slice(0, 40) : undefined;
};

/**
 * Opens what a tapped notification points at. The navigation is decided here and nowhere else, so every way
 * of receiving a tap (app open, in background, launched by it) behaves the same.
 */
export const openNotification = async (
  data: unknown,
  deps: OpenNotificationDeps,
): Promise<OpenOutcome> => {
  const route = await resolveNotificationRoute(data, deps.queryClient, {
    access: deps.access,
  });
  if (!deps.isCurrent()) return "superseded";

  const type = typeOf(data);
  if (!route) {
    notificationLog.info("notification opened without destination", { type });
    return "unknown";
  }

  if (route.target) {
    if (isExternalLink(route.target)) {
      await deps.openUrl(route.target.url);
    } else {
      deps.navigate(route.target);
    }
  }
  if (route.unavailable) deps.notifyUnavailable();

  notificationLog.info("notification opened", {
    type,
    unavailable: route.unavailable,
    destination: route.target
      ? isExternalLink(route.target)
        ? "external"
        : pathOf(route.target)
      : "none",
  });
  if (route.unavailable) return "unavailable";
  return route.target && isExternalLink(route.target) ? "external" : "opened";
};
