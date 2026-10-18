import * as Notifications from "expo-notifications";

export type Permission = Awaited<
  ReturnType<typeof Notifications.getPermissionsAsync>
>;

/** What the server is told about the phone's notification permission. */
export type PermissionState = "granted" | "denied" | "undetermined";

/** True when the system lets this app notify: a provisional or ephemeral iOS authorization delivers too, quietly. */
export const isNotificationAllowed = (permission: Permission) =>
  permission.granted ||
  permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
  permission.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL;

export const toPermissionState = (permission: Permission): PermissionState => {
  if (isNotificationAllowed(permission)) return "granted";
  return permission.status === "undetermined" ? "undetermined" : "denied";
};
