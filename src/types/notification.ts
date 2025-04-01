export const NotificationTypeValues = ["RESTAURANT", "TRAQ"] as const;
export type NotificationType = (typeof NotificationTypeValues)[number];
