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
    const queryParams = new URLSearchParams();

    if (service) {
      queryParams.append("service", service.trim());
    } else if (services?.length) {
      for (const s of services) {
        queryParams.append("services", s.trim());
      }
    }

    const queryString = queryParams.toString();
    const fullUrl = queryString
      ? `${API_ROUTES.notifications}?${queryString}`
      : API_ROUTES.notifications;

    const response = await apiRequest<{ services: NotificationType[] }>(
      fullUrl,
      Method.GET,
    );

    return service ? response.services.includes(service) : response.services;
  } catch (error) {
    console.error("Error fetching notification state:", error);
    return service ? false : [];
  }
};
