export const NotificationTypeValues = ["restaurant", "traq"] as const;
export type NotificationType = (typeof NotificationTypeValues)[number];
