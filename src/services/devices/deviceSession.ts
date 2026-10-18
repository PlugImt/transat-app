import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  type DevicePermissionStatus,
  registerDevice,
} from "@/api/endpoints/device";
import { clearPendingDeviceSignOut } from "@/services/devices/deviceSignOut";
import { getInstallationId } from "@/services/devices/installationId";
import { describeToken, notificationLog } from "@/services/notifications/log";
import {
  isNotificationAllowed,
  toPermissionState,
} from "@/services/notifications/permission";
import { storage } from "@/services/storage/asyncStorage";

// Set once the system prompt was shown. It survives logout: the permission belongs to the phone, not the account.
export const PERMISSION_PROMPTED_KEY = "notificationPermissionPrompted";

export const DEFAULT_HEARTBEAT_MS = 5 * 60 * 1000;
const MIN_HEARTBEAT_MS = 60 * 1000;
const MAX_HEARTBEAT_MS = 30 * 60 * 1000;

export interface RegisterOptions {
  /**
   * Show the system permission prompt if it was never shown and the system allows it. The caller decides when the
   * app is in a state where a prompt makes sense; a user who refused is never prompted again from here.
   */
  prompt?: boolean;
  /** Ask the push service for the token again, e.g. because it was rolled. */
  refreshToken?: boolean;
}

const readPermission = async (
  prompt: boolean,
): Promise<DevicePermissionStatus> => {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (isNotificationAllowed(current) || !prompt || !current.canAskAgain) {
      return toPermissionState(current);
    }
    // Android lets an app ask a second time after a refusal: that is not worth nagging for. Recorded before
    // asking, so that an app killed while the prompt is open does not ask again either.
    if (await storage.get<boolean>(PERMISSION_PROMPTED_KEY)) {
      return toPermissionState(current);
    }
    await storage.set(PERMISSION_PROMPTED_KEY, true);
    const answer = await Notifications.requestPermissionsAsync();
    notificationLog.info("permission prompt answered", {
      status: toPermissionState(answer),
    });
    return toPermissionState(answer);
  } catch (error) {
    notificationLog.warn("could not read the permission", error);
    return "undetermined";
  }
};

const ensureAndroidChannel = () =>
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  }).catch((error: unknown) => {
    // Pushes name this channel: without it Android drops them.
    notificationLog.warn("could not create the notification channel", error);
  });

const fetchPushToken = async (): Promise<string | null> => {
  // Simulators cannot get a token; they still register as devices.
  if (!Device.isDevice) return null;
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    notificationLog.warn("project id not found, no push token");
    return null;
  }
  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    notificationLog.info("push token obtained", {
      token: describeToken(token),
    });
    return token;
  } catch (error) {
    // Offline or the push service is down: the next heartbeat tries again.
    notificationLog.warn("could not get the push token", error);
    return null;
  }
};

const heartbeatDelay = (seconds: number) =>
  Math.min(
    MAX_HEARTBEAT_MS,
    Math.max(MIN_HEARTBEAT_MS, Math.round(seconds * 1000)),
  );

/**
 * One registrar per signed-in session. `register` tells the server that the signed-in user is using this
 * installation right now, with its current permission and token, and returns the delay until the next
 * heartbeat. The token is kept between calls so a heartbeat does not ask Expo's servers every time.
 */
export const createDeviceRegistrar = () => {
  let lastToken: string | null = null;
  let lastReported = "";

  const register = async ({
    prompt = false,
    refreshToken = false,
  }: RegisterOptions = {}): Promise<number> => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      return DEFAULT_HEARTBEAT_MS;
    }

    // Android 13+ shows the permission prompt only once a channel exists, and drops pushes for a missing one.
    if (Platform.OS === "android") await ensureAndroidChannel();

    const permission = await readPermission(prompt);
    if (permission !== "granted") {
      if (lastToken) notificationLog.info("permission lost, token dropped");
      lastToken = null;
    } else if (refreshToken || !lastToken) {
      lastToken = await fetchPushToken();
    }

    const result = await registerDevice(await getInstallationId(), {
      platform: Platform.OS,
      push_token: lastToken,
      permission_status: permission,
      app_version: Constants.expoConfig?.version,
    });
    // The server holds this installation for the current account now: a late sign-out of the previous one is moot.
    await clearPendingDeviceSignOut();

    const reported = `${permission}/${describeToken(lastToken)}`;
    if (reported !== lastReported) {
      lastReported = reported;
      notificationLog.info("device registered", {
        platform: Platform.OS,
        permission,
        token: describeToken(lastToken),
      });
    }

    return typeof result?.heartbeat_interval_seconds === "number"
      ? heartbeatDelay(result.heartbeat_interval_seconds)
      : DEFAULT_HEARTBEAT_MS;
  };

  return { register };
};
