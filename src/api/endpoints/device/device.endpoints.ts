import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";

export type DevicePermissionStatus = "granted" | "denied" | "undetermined";

export interface DeviceRegistration {
  platform: "ios" | "android";
  /** null when the device has no token (permission refused, simulator, token request failed). */
  push_token: string | null;
  permission_status: DevicePermissionStatus;
  app_version?: string;
}

export interface DeviceRegistrationResult {
  /** How often an open app must check in; set by the server so it can change without a release. */
  heartbeat_interval_seconds: number;
}

/** Registers this installation for the signed-in user. Also the heartbeat that keeps the device "connected". */
export const registerDevice = (
  installationId: string,
  registration: DeviceRegistration,
) =>
  apiRequest<DeviceRegistrationResult>(
    `${API_ROUTES.devices}/${installationId}`,
    Method.PUT,
    registration,
  );
