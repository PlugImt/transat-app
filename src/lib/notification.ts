import { storage } from "@/services/storage/asyncStorage";
import type { NotificationType } from "@/types/notification";
import { t } from "i18next";

const NOTIFICATION_API = "https://transat.destimt.fr/api/newf/notification";

export const addNotification = async (
  service: NotificationType,
): Promise<boolean> => {
  const jwtToken = await storage.get("token");
  if (!jwtToken) throw new Error(t("account.noToken"));

  const response = await fetch(NOTIFICATION_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      service: service.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error(t("settings.notifications.updateError"));
  }

  const data = await response.json();
  return data.message === true;
};

export const getNotificationsState = async (
  service?: NotificationType,
  services?: NotificationType[],
): Promise<boolean | NotificationType[]> => {
  const jwtToken = await storage.get("token");
  if (!jwtToken) return false;

  try {
    let url = NOTIFICATION_API;
    const queryParams = new URLSearchParams();

    if (service) {
      queryParams.append("service", service.trim());
    } else if (services?.length) {
      for (const s of services) {
        queryParams.append("services", s.trim());
      }
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Make the request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(t("settings.notifications.fetchError"));
    }

    const data = await response.json();

    return service ? data.message === true : data.messages || [];
  } catch (error) {
    console.error("Error fetching notification state:", error);
    return service ? false : [];
  }
};
