import { API_ROUTES, apiRequest, Method } from "@/api";
import type { NotificationType } from "@/dto";

export const addNotification = async (
  service: NotificationType,
): Promise<boolean> => {
  const response = await apiRequest<{ subscribed: boolean }>(
    API_ROUTES.notifications,
    Method.POST,
    {
      service: service.trim(),
    },
  );

  return response.subscribed;
};

export const getNotificationsState = async (
  service?: NotificationType,
  services?: NotificationType[],
): Promise<boolean | NotificationType[]> => {
  try {
    const params: Record<string, string | string[]> = {};

    if (service) {
      params.service = service.trim();
    } else if (services?.length) {
      params.services = services.map((s) => s.trim());
    }

    const response = await apiRequest<{ services: NotificationType[] }>(
      API_ROUTES.notifications,
      Method.GET,
      {},
      { params },
    );

    return service ? response.services.includes(service) : response.services;
  } catch (error) {
    console.error("Error fetching notification state:", error);
    return service ? false : [];
  }
};
