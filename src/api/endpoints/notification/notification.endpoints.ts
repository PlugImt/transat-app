import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import {
  type NotificationPreference,
  type NotificationPreferences,
  type NotificationType,
  notificationTypeSchema,
} from "@/dto";

export const getNotificationPreferences =
  async (): Promise<NotificationPreferences> => {
    const { preferences } = await apiRequest<{
      preferences: { service: string; enabled: boolean }[];
    }>(API_ROUTES.notificationPreferences, Method.GET);

    const result: NotificationPreferences = {};
    for (const { service, enabled } of preferences) {
      // Categories added by a newer backend are ignored until the app knows them.
      const known = notificationTypeSchema.safeParse(service);
      if (known.success) result[known.data] = enabled;
    }
    return result;
  };

export const setNotificationPreference = (
  service: NotificationType,
  enabled: boolean,
) =>
  apiRequest<NotificationPreference>(
    API_ROUTES.notificationPreferences,
    Method.PUT,
    { service, enabled },
  );
