import { addNotification, getNotificationsState } from "@/lib/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { storage } from "@/services/storage/asyncStorage";
import type { NotificationType } from "@/types/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useNotification() {
  const queryClient = useQueryClient();

  // Query pour récupérer l'état des notifications
  const notificationsQuery = useQuery({
    queryKey: [QUERY_KEYS.notification],
    queryFn: async () => {
      const storedData = (await storage.get("notification")) || {};
      return storedData as Record<NotificationType, boolean>;
    },
  });

  // Mutation pour activer/désactiver une notification
  const toggleNotification = useMutation({
    mutationFn: async (service: NotificationType) => {
      const result = await addNotification(service);
      return { service, enabled: result };
    },
    onSuccess: async ({ service, enabled }) => {
      const notifications = (await storage.get("notification")) || {};
      const updatedNotifications = { ...notifications, [service]: enabled };
      await storage.set("notification", updatedNotifications);

      queryClient.setQueryData([QUERY_KEYS.notification], updatedNotifications);
    },
  });

  // Fonction utilitaire pour vérifier si une notification est activée
  const getNotificationEnabled = (service: NotificationType): boolean => {
    const data =
      notificationsQuery.data || ({} as Record<NotificationType, boolean>);
    return data[service] === true;
  };

  return {
    data: notificationsQuery.data,
    isPending: notificationsQuery.isPending,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,

    toggleNotification: toggleNotification.mutate,
    isToggling: toggleNotification.isPending,

    getNotificationEnabled,
  };
}

export default useNotification;
