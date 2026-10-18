import { API_ROUTES } from "@/api/common";
import { getInstallationId } from "@/services/devices/installationId";
import { storage } from "@/services/storage/asyncStorage";

// Set while a sign-out has not reached the server, so it is retried at the next start.
const PENDING_SIGN_OUT_KEY = "deviceSignOutPending";
const SIGN_OUT_TIMEOUT_MS = 4000;

/** A registration for a new session makes an older sign-out moot. */
export const clearPendingDeviceSignOut = () =>
  storage.remove(PENDING_SIGN_OUT_KEY);

// A plain fetch on purpose: the session teardown calls this, and the API client imports the session module.
const sendSignOut = async () => {
  const base = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SIGN_OUT_TIMEOUT_MS);
  try {
    const response = await fetch(
      `${base}${API_ROUTES.devices}/${await getInstallationId()}/sign-out`,
      { method: "POST", signal: controller.signal },
    );
    // Only a network failure, a server error or the rate limit can succeed on a retry.
    const retryable = response.status >= 500 || response.status === 429;
    if (retryable) throw new Error(`Sign-out answered ${response.status}`);
  } finally {
    clearTimeout(timer);
  }
  await storage.remove(PENDING_SIGN_OUT_KEY);
};

/**
 * Stops the server from sending to this phone for the account that is leaving. Never throws: a logout must
 * not fail because the network does, so a failed attempt is kept and retried by `flushPendingDeviceSignOut`.
 */
export const signOutCurrentDevice = async () => {
  await storage.set(PENDING_SIGN_OUT_KEY, true);
  try {
    await sendSignOut();
  } catch (error) {
    console.warn("[Devices] Sign-out not delivered, it will be retried", error);
  }
};

/** Retries a sign-out that did not reach the server. Call it while nobody is signed in. */
export const flushPendingDeviceSignOut = async () => {
  if (!(await storage.get<boolean>(PENDING_SIGN_OUT_KEY))) return;
  try {
    await sendSignOut();
  } catch (error) {
    console.warn("[Devices] Sign-out retry failed", error);
  }
};
