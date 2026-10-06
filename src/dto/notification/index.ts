import { z } from "zod";

export * from "./navigation";

export const NotificationTypeValues = ["RESTAURANT", "TRAQ"] as const;
export const notificationTypeSchema = z.enum(NotificationTypeValues);

export type NotificationType = z.infer<typeof notificationTypeSchema>;
