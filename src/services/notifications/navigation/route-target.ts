import type { Href } from "expo-router";
import { photosHref, servicesHref } from "@/navigation/paths";

/** A screen to open. Shared screens are addressed on the Services tab. */
export type RouteTarget = Href;

/** A page outside the app, opened in the default browser. */
export type ExternalLink = { url: string };

export const isExternalLink = (
  target: RouteTarget | ExternalLink,
): target is ExternalLink => typeof target === "object" && "url" in target;

/** What the signed-in account can reach in the app. */
export type NavigationAccess = { isAcademics: boolean };

/** The path of a route, for checks and logs. */
export const pathOf = (target: RouteTarget): string =>
  typeof target === "string" ? target : String(target.pathname);

/** Academics accounts have no Photos tab, so a route into it would lead nowhere. */
export const isRouteAvailable = (
  target: RouteTarget,
  access: NavigationAccess,
) => !access.isAcademics || !pathOf(target).startsWith("/photos");

/** Route on the Services stack, which hosts every service screen. */
export const servicesRoute = servicesHref;

/** Route inside the Photos stack. */
export const photosRoute = photosHref;
