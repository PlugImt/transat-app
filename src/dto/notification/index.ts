import { z } from "zod";

export * from "./navigation";

export const NotificationTypeValues = [
  "RESTAURANT",
  "TRAQ",
  "EVENTS",
  "EVENT_REMINDERS",
  "RESERVATIONS",
] as const;
export const notificationTypeSchema = z.enum(NotificationTypeValues);

export type NotificationType = z.infer<typeof notificationTypeSchema>;

export type NotificationPreference = {
  service: NotificationType;
  enabled: boolean;
};

/** Whether each category is on; a category is absent until the server reports it. */
export type NotificationPreferences = Partial<
  Record<NotificationType, boolean>
>;
