import * as Notifications from "expo-notifications";
import { WAITLIST_ACTIONS, WAITLIST_CATEGORY } from "./waitlistActions";

/**
 * Registers the buttons of the notifications that carry a `categoryId`. The app opens when a button is pressed:
 * the answer of the server (booked, or too late) is then shown to the user instead of being lost in the background.
 */
export const registerNotificationCategories = (labels: {
  reserve: string;
  decline: string;
}) =>
  Notifications.setNotificationCategoryAsync(WAITLIST_CATEGORY, [
    {
      identifier: WAITLIST_ACTIONS.reserve,
      buttonTitle: labels.reserve,
      options: { opensAppToForeground: true },
    },
    {
      identifier: WAITLIST_ACTIONS.decline,
      buttonTitle: labels.decline,
      options: { opensAppToForeground: true },
    },
  ]);
