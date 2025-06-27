import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNotification, getNotificationsState } from "@/lib/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { storage } from "@/services/storage/asyncStorage";
import {
  type NotificationType,
  NotificationTypeValues,
} from "@/types/notification";

function useNotification() {
  const queryClient = useQueryClient();

  /**
   * Récupérer l'état des notifications
   */
  const notificationsQuery = useQuery<
    Record<NotificationType, boolean>,
    Error,
    Record<NotificationType, boolean>
  >({
    queryKey: [QUERY_KEYS.notification],
    queryFn: async () => {
      try {
        const storedData = (await storage.get("notification")) || {};

        const enabledNotifications = await getNotificationsState();

        if (enabledNotifications === false) {
          console.warn(
            "No JWT token found or invalid state. Returning stored data.",
          );
          return storedData as Record<NotificationType, boolean>;
        }

        if (Array.isArray(enabledNotifications)) {
          const updatedNotifications = {
            ...(storedData as Record<NotificationType, boolean>),
          };

          for (const notif of enabledNotifications) {
            if (
              typeof notif === "string" &&
              NotificationTypeValues.includes(notif as NotificationType)
            ) {
              updatedNotifications[notif as NotificationType] = true;
            }
          }

          await storage.set("notification", updatedNotifications);
          return updatedNotifications;
        }

        return storedData as Record<NotificationType, boolean>;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return (
          (await storage.get("notification")) ||
          ({} as Record<NotificationType, boolean>)
        );
      }
    },
  });

  /**
   * Active ou désactive une notification
   * @param service Type de notification à modifier
   */
  const toggleNotification = useMutation({
    mutationFn: async (service: NotificationType) => {
      const enabled = await addNotification(service);
      return { service, enabled };
    },

    // Mise à jour optimiste
    onMutate: async (service) => {
      // Empêche les requêtes concurrentes
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.notification] });

      // Sauvegarde l'état actuel pour annulation en cas d'erreur
      const previousNotifications =
        queryClient.getQueryData<Record<NotificationType, boolean>>([
          QUERY_KEYS.notification,
        ]) || ({} as Record<NotificationType, boolean>);

      // Inverse l'état de la notification sélectionnée
      const newValue = !(previousNotifications[service] ?? false);

      // Met à jour l'UI immédiatement
      queryClient.setQueryData([QUERY_KEYS.notification], {
        ...previousNotifications,
        [service]: newValue,
      });

      return { previousNotifications };
    },
    onSuccess: async ({ service, enabled }) => {
      const notifications = (await storage.get("notification")) || {};
      await storage.set("notification", {
        ...notifications,
        [service]: enabled,
      });

      queryClient.setQueryData([QUERY_KEYS.notification], {
        ...notifications,
        [service]: enabled,
      });
    },
  });

  return {
    data: notificationsQuery.data,
    isPending: notificationsQuery.isPending,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,

    toggleNotification: toggleNotification.mutate,
    isToggling: toggleNotification.isPending,
  };
}

export default useNotification;
