import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import {
  type NotificationGroup,
  type NotificationType,
  notificationGroupSchema,
} from "@/dto";

/**
 * Récupère les groupes de notifications, déjà traduits et ordonnés par le serveur
 */
export const getNotificationGroups = async (): Promise<NotificationGroup[]> => {
  const response = await apiRequest<{ groups: unknown[] }>(
    API_ROUTES.notificationPreferences,
    Method.GET,
  );

  return response.groups.flatMap((group) => {
    const parsed = notificationGroupSchema.safeParse(group);
    return parsed.success ? [parsed.data] : [];
  });
};

/**
 * Active ou désactive une catégorie de notification
 */
export const setNotificationPreference = async (
  service: NotificationType,
  enabled: boolean,
): Promise<{ service: NotificationType; enabled: boolean }> =>
  apiRequest<{ service: NotificationType; enabled: boolean }>(
    API_ROUTES.notificationPreferences,
    Method.PUT,
    { service, enabled },
  );
