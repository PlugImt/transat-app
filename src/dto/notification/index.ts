import { z } from "zod";

// Le serveur décide des catégories : une nouvelle catégorie s'affiche sans mise à jour de l'appli.
export const notificationTypeSchema = z.string();

export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationPreferenceSchema = z.object({
  service: notificationTypeSchema,
  enabled: z.boolean(),
  title: z.string(),
  description: z.string().optional(),
});

export type NotificationPreference = z.infer<
  typeof notificationPreferenceSchema
>;

export const notificationGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(notificationPreferenceSchema),
});

export type NotificationGroup = z.infer<typeof notificationGroupSchema>;
