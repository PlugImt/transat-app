import type { NotificationType } from "@/types/notification";
import { apiRequest } from "./apiRequest";

const NOTIFICATION_API = "/api/newf/notifications/subscriptions";

export const addNotification = async (
  service: NotificationType,
): Promise<boolean> => {
  const response = await apiRequest<{ subscribed: boolean }>(
    NOTIFICATION_API,
    "POST",
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
      ? `${NOTIFICATION_API}?${queryString}`
      : NOTIFICATION_API;

    const response = await apiRequest<{ services: NotificationType[] }>(
      fullUrl,
      "GET",
    );

    return service ? response.services.includes(service) : response.services;
  } catch (error) {
    console.error("Error fetching notification state:", error);
    return service ? false : [];
  }
};
