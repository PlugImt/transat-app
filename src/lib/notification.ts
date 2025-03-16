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
  service: NotificationType,
): Promise<boolean> => {
  const notifications =
    ((await storage.get("notification")) as Record<
      NotificationType,
      boolean
    >) || {};

  // Si présent dans le stockage local, retourner la valeur
  if (notifications[service] !== undefined) {
    return notifications[service];
  }

  // Sinon, requête à l'API
  const jwtToken = await storage.get("token");
  if (!jwtToken) return false;

  try {
    const response = await fetch(
      `${NOTIFICATION_API}?service=${service.trim()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    if (!response.ok) return false;

    const data = await response.json();

    // Mettre à jour le stockage local
    await storage.set("notification", {
      ...notifications,
      [service]: data.enabled,
    });

    return data.enabled;
  } catch (error) {
    console.error("Error fetching notification state:", error);
    return false;
  }
};
