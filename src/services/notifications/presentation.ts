import * as Notifications from "expo-notifications";
import { storage } from "@/services/storage/asyncStorage";

const SESSION_KEY = "token";

const SHOW = {
  shouldShowBanner: true,
  shouldShowList: true,
  shouldPlaySound: true,
  shouldSetBadge: true,
} as const;

const HIDE = {
  shouldShowBanner: false,
  shouldShowList: false,
  shouldPlaySound: false,
  shouldSetBadge: false,
} as const;

/**
 * What to do with a notification that arrives while the app is open. The system shows nothing on its own in
 * that case, so this is the only place where a foreground notification becomes visible: no listener presents a
 * second copy. Nothing is shown when nobody is signed in, because it was meant for an account that has left.
 */
export const decidePresentation = async () =>
  (await storage.get<string>(SESSION_KEY)) ? SHOW : HIDE;

let installed = false;

/** Installs the foreground handler once, however many times the app module is evaluated. */
export const installNotificationHandler = () => {
  if (installed) return;
  installed = true;
  Notifications.setNotificationHandler({
    handleNotification: decidePresentation,
  });
};
