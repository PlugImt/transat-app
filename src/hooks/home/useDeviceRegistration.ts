import { onlineManager } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import {
  createDeviceRegistrar,
  DEFAULT_HEARTBEAT_MS,
  type RegisterOptions,
} from "@/services/devices/deviceSession";
import { flushPendingDeviceSignOut } from "@/services/devices/deviceSignOut";
import { notificationLog } from "@/services/notifications/log";
import useAuth from "../account/useAuth";

// Coming back to the app inside this delay does not register again; the server throttles writes as well.
const MIN_FOREGROUND_GAP_MS = 30 * 1000;
const RETRY_BASE_MS = 15 * 1000;

/** Wait before the next try after consecutive failures: 15s, 30s, 1 min..., never beyond one heartbeat. */
export const retryDelay = (failures: number, heartbeatMs: number) =>
  Math.min(heartbeatMs, RETRY_BASE_MS * 2 ** Math.max(0, failures - 1));

interface Options {
  /**
   * The app is in a state where the system permission prompt makes sense (signed in, onboarding done). Until
   * then the device registers without asking for anything.
   */
  canPrompt?: boolean;
}

/**
 * Keeps this installation registered for the signed-in user and proves that the app is open: at the start of the
 * session, on every return to the foreground, on a timer while in the foreground, when the push token changes
 * and when the connection comes back. Nothing here blocks the app: a failed attempt is retried with a backoff.
 */
export function useDeviceRegistration({ canPrompt = false }: Options = {}) {
  const { user } = useAuth();
  const email = user?.email;
  // Lets the prompt effect below reach the registration loop of the current session.
  const requestRegistration = useRef<
    ((options: RegisterOptions) => void) | null
  >(null);

  useEffect(() => {
    if (!email) return;

    const registrar = createDeviceRegistrar();
    let stopped = false;
    let running = false;
    let queued: RegisterOptions | null = null;
    // What could not be done yet: offline, or a prompt requested while the app was not in the foreground.
    let deferred: RegisterOptions | null = null;
    let offline = false;
    let lastRunAt = 0;
    let failures = 0;
    let delay = DEFAULT_HEARTBEAT_MS;
    let timer: ReturnType<typeof setInterval> | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const stopTimer = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const startTimer = () => {
      stopTimer();
      timer = setInterval(() => run({}), delay);
    };
    const stopRetry = () => {
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = undefined;
    };

    const run = async (requested: RegisterOptions): Promise<void> => {
      if (stopped) return;
      if (running) {
        // A request that arrives mid-flight (a rolled token) is not lost.
        queued = { ...queued, ...requested };
        return;
      }
      let options = requested;
      if (options.prompt && AppState.currentState !== "active") {
        // The system shows its prompt only to an app in the foreground.
        deferred = { ...deferred, prompt: true };
        options = { ...options, prompt: false };
      }
      if (!onlineManager.isOnline()) {
        // Nobody to tell: resume as soon as the connection is back instead of failing noisily.
        offline = true;
        deferred = { ...deferred, ...options };
        return;
      }

      running = true;
      try {
        const nextDelay = await registrar.register(options);
        failures = 0;
        stopRetry();
        if (!stopped && nextDelay !== delay) {
          delay = nextDelay;
          if (timer) startTimer();
        }
      } catch (error) {
        failures += 1;
        notificationLog.warn("registration failed, will retry", error, {
          failures,
        });
        stopRetry();
        if (!stopped && AppState.currentState === "active") {
          retryTimer = setTimeout(() => run({}), retryDelay(failures, delay));
        }
      } finally {
        running = false;
        lastRunAt = Date.now();
      }
      if (queued && !stopped) {
        const next = queued;
        queued = null;
        await run(next);
      }
    };
    requestRegistration.current = run;

    run({});
    if (AppState.currentState === "active") startTimer();

    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        const resume = deferred;
        deferred = null;
        // A failing registration is retried at once; a healthy one is not repeated within the gap.
        if (
          resume ||
          failures > 0 ||
          Date.now() - lastRunAt >= MIN_FOREGROUND_GAP_MS
        ) {
          run({ ...resume });
        }
        startTimer();
      } else {
        // Only an open app is "connected": nothing is sent from the background.
        stopTimer();
        stopRetry();
      }
    });
    const tokenListener = Notifications.addPushTokenListener(() => {
      notificationLog.info("push token changed");
      run({ refreshToken: true });
    });
    const unsubscribeOnline = onlineManager.subscribe((online) => {
      if (!online) {
        offline = true;
      } else if (offline) {
        offline = false;
        const resume = deferred;
        deferred = null;
        run({ ...resume });
      }
    });

    return () => {
      stopped = true;
      requestRegistration.current = null;
      stopTimer();
      stopRetry();
      appState.remove();
      tokenListener.remove();
      unsubscribeOnline();
    };
    // The account is the identity: switching accounts registers the installation again for the new one.
  }, [email]);

  // The prompt waits for a moment when the app is usable; it never repeats for a user who refused (see deviceSession).
  useEffect(() => {
    if (email && canPrompt) requestRegistration.current?.({ prompt: true });
  }, [email, canPrompt]);

  // Nobody is signed in: finish a sign-out that did not reach the server before.
  useEffect(() => {
    if (user === null) flushPendingDeviceSignOut();
  }, [user]);
}
