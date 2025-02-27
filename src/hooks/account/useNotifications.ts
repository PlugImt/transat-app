import { storage } from "@/services/storage/asyncStorage";

export const useNotifications = () => {
  const NOTIFICATION_API = "https://transat.destimt.fr/api/newf/notification";

  const addNotification = async (value: string) => {
    const jwtToken = await storage.get("token");

    const response = await fetch(NOTIFICATION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        service: value.trim(),
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch notification setting. ");
      console.error(response);
      return false;
    }

    const rd = await response.json();

    await storage.set("notification", { [value]: rd.message });

    return rd.message;
  };

  const getNotificationEnabled = async (service: string) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let notifications: any = await storage.get("notification");
    if (!notifications) {
      notifications = {};
      await storage.set("notification", notifications);
    }

    if (notifications[service] !== undefined) {
      console.log(
        `${service} notifications already set: `,
        notifications[service],
      );
      return notifications[service];
    }

    const jwtToken = await storage.get("token");

    const response = await fetch(NOTIFICATION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ value: service.trim() }),
    });

    if (!response.ok) {
      console.error("Failed to fetch notification setting.");
      return false;
    }

    const { enabled } = await response.json();

    // Store the result in local storage
    notifications[service] = enabled;
    await storage.set("notification", notifications);

    return enabled;
  };

  return {
    addNotification,
    getNotificationEnabled,
  };
};

export default useNotifications;
