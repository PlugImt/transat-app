import { z } from "zod";

/** Wire format of the `navigation` object sent by the backend inside a push notification's data. */
export const NOTIFICATION_NAVIGATION_VERSION = 1;

export const notificationNavigationSchema = z.object({
  v: z.literal(NOTIFICATION_NAVIGATION_VERSION),
  type: z.string().min(1),
  id: z.union([z.string(), z.number()]).optional(),
  params: z.record(z.string(), z.string()).optional(),
});

export type NotificationNavigation = z.infer<
  typeof notificationNavigationSchema
>;
